from flask import Flask, request, jsonify
import openai
import os
from langchain.text_splitter import CharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.embeddings import OpenAIEmbeddings
from pinecone import Pinecone, ServerlessSpec
import requests
import time
from openai import OpenAI
import autogen

app = Flask(__name__)

# Set your API keys
api_key = ""
pinecone_api_key = ""

# Initialize Pinecone
pc = Pinecone(api_key=pinecone_api_key)
cloud = os.environ.get('PINECONE_CLOUD') or 'aws'
region = os.environ.get('PINECONE_REGION') or 'us-east-1'
spec = ServerlessSpec(cloud=cloud, region=region)
index_name = 'semantic-search-fast'

# Initialize OpenAI client
openai_client = OpenAI(api_key=api_key)

# AutoGen configuration
config_list = [{'model': 'gpt-4', 'api_key': api_key}]
llm_config = {"config_list": config_list}

# Function to ensure Pinecone index exists
def ensure_pinecone_index():
    existing_indexes = [index_info["name"] for index_info in pc.list_indexes()]
    if index_name not in existing_indexes:
        pc.create_index(
            index_name,
            dimension=1536,
            metric='cosine',
            spec=spec
        )
        while not pc.describe_index(index_name).status['ready']:
            time.sleep(1)
    return pc.Index(index_name)

# Function to perform RAG
def perform_rag(pdf_url, question):
    index = ensure_pinecone_index()
    
    # Download and process PDF
    response = requests.get(pdf_url)
    if response.status_code != 200:
        raise Exception("Failed to download PDF")
    
    file_path = 'temp.pdf'
    with open(file_path, 'wb') as f:
        f.write(response.content)

    loader = PyPDFLoader(file_path)
    documents = loader.load()
    text_splitter = CharacterTextSplitter(chunk_size=2000, chunk_overlap=0)
    docs = text_splitter.split_documents(documents)

    # Generate embeddings and upsert to Pinecone
    embeddings = OpenAIEmbeddings(api_key=api_key)
    for i, doc in enumerate(docs):
        vector = embeddings.embed_query(doc.page_content)
        index.upsert(vectors=[(str(i), vector, {"text": doc.page_content})])

    # Query Pinecone
    question_vector = embeddings.embed_query(question)
    results = index.query(vector=question_vector, top_k=3, include_metadata=True)

    if not results['matches']:
        raise Exception("No relevant information found")

    context = ' '.join([match['metadata']['text'] for match in results['matches']])
    
    # Clean up
    os.remove(file_path)
    pc.delete_index(index_name)
    
    return context

# AutoGen agent setup
def setup_autogen_agents():
    config_list = [{'model': 'gpt-4', 'api_key': api_key}]
    llm_config = {"config_list": config_list, "cache_seed": 42}

    assistant = autogen.AssistantAgent(
        name="assistant",
        llm_config=llm_config,
        system_message="""You are an expert at creating clear, concise, and accurate educational content. 
        Synthesize the information to produce a final, high-quality answer of 200-300 words. 
        End your response with 'END_OF_RESPONSE'"""
    )
    
    user_proxy = autogen.UserProxyAgent(
        name="user",
        human_input_mode="NEVER",
        max_consecutive_auto_reply=1,
        is_termination_msg=lambda x: "END_OF_RESPONSE" in x.get("content", "")
    )
    
    return assistant, user_proxy

@app.route("/enhanced_sequential_transcript", methods=["POST"])
def generate_enhanced_sequential_transcript():
    try:
        data = request.json
        pdf_url = data.get("pdf_url")
        question = data.get("question")

        if not pdf_url or not question:
            return jsonify({"error": "Both PDF URL and question are required"}), 400

        # Perform RAG
        context = perform_rag(pdf_url, question)

        # Set up AutoGen agents
        assistant, user_proxy = setup_autogen_agents()

        # Initiate the chat
        chat_result = user_proxy.initiate_chat(
            assistant,
            message=f"""Use this context to answer the question:
            Context: {context}
            Question: {question}
            
            Provide a final answer in 200-300 words. End your response with 'END_OF_RESPONSE'"""
        )

        # Extract the final transcript
        final_transcript = next((msg["content"].split('END_OF_RESPONSE')[0].strip() 
                                 for msg in chat_result.chat_history 
                                 if msg["role"] == "user" and "END_OF_RESPONSE" in msg["content"]),
                                "No final answer found.")

        return jsonify({
            "enhanced_transcript": final_transcript,
            "chat_history": chat_result.chat_history,
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)