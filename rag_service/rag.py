from flask import Flask, request, jsonify
import openai
import os
from langchain.text_splitter import CharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.embeddings import OpenAIEmbeddings
# from langchain_community.vectorstores import Pinecone
from pinecone import Pinecone
from pinecone import ServerlessSpec
import requests
import time
from openai import OpenAI


app = Flask(__name__)

# Set your OpenAI API key
api_key = ""
openai_api_key = api_key

pinecone_api_key = ""

pc = Pinecone(api_key=pinecone_api_key)


cloud = os.environ.get('PINECONE_CLOUD') or 'aws'
region = os.environ.get('PINECONE_REGION') or 'us-east-1'

spec = ServerlessSpec(cloud=cloud, region=region)
index_name = 'semantic-search-fast'

# Check if index exists, if not create it
existing_indexes = [index_info["name"] for index_info in pc.list_indexes()]

if index_name not in existing_indexes:
    pc.create_index(
        index_name,
        dimension=1536,  # dimensionality of OpenAI embeddings
        metric='cosine',
        spec=spec
    )
    # wait for index to be initialized
    while not pc.describe_index(index_name).status['ready']:
        time.sleep(1)

# Connect to index
index = pc.Index(index_name)

@app.route("/ask", methods=["POST"])
def ask_openai():
    try:
        # Get the URL of the PDF and the question from the request
        data = request.json
        pdf_url = data.get("pdf_url")
        question = data.get("question")

        if not pdf_url or not question:
            return jsonify({"error": "Both PDF URL and question are required"}), 400

        # Step 1: Download the PDF file
        response = requests.get(pdf_url)
        if response.status_code != 200:
            return jsonify({"error": "Failed to download PDF"}), 400
        
        file_path = 'temp.pdf'
        with open(file_path, 'wb') as f:
            f.write(response.content)

        # Step 2: Load the PDF and split it into chunks
        loader = PyPDFLoader(file_path)
        documents = loader.load()
        text_splitter = CharacterTextSplitter(chunk_size=2000, chunk_overlap=0)
        docs = text_splitter.split_documents(documents)

        # Step 3: Generate embeddings using OpenAI
        embeddings = OpenAIEmbeddings(api_key=openai_api_key)

        # Step 4: Upsert documents to Pinecone
        for i, doc in enumerate(docs):
            vector = embeddings.embed_query(doc.page_content)
            index.upsert(vectors=[(str(i), vector, {"text": doc.page_content})])

        # Step 5: Generate embedding for the question
        question_vector = embeddings.embed_query(question)

        ## After querying Pinecone and getting results
        results = index.query(vector=question_vector, top_k=3, include_metadata=True)

        if not results['matches']:
            return jsonify({"error": "No relevant information found"}), 404

        # Extract context from the top matches
        context = ' '.join([match['metadata']['text'] for match in results['matches']])

        # Now generate an answer using OpenAI's LLM
        client = OpenAI(api_key=openai_api_key)

        messages = [
            {"role": "system", "content": "You are an AI assistant that provides helpful and concise answers based on the provided context."},
            {"role": "user", "content": f"Context:\n{context}\n\nQuestion:\n{question}"}
        ]
        
        model = "gpt-3.5-turbo" #"gpt-3.5-turbo-1106"


        response = client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=0
        )

        answer =  response.choices[0].message.content

        pc.delete_index(index_name)

        # Return the generated answer
        return jsonify({"question": question, "answer": answer})


    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)