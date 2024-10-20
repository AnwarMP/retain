import requests
import json

url = "http://localhost:5000/enhanced_sequential_transcript"

payload = {
    "pdf_url": "https://arxiv.org/pdf/1706.03762.pdf",
    "question": "What are transformers and what do they do?"
}

headers = {
    "Content-Type": "application/json"
}

response = requests.post(url, json=payload, headers=headers)

if response.status_code == 200:
    result = response.json()
    print("Enhanced Transcript:")
    print(result["enhanced_transcript"])
    print("\nChat History:")
    print(json.dumps(result["chat_history"], indent=2))
else:
    print(f"Error: {response.status_code}")
    print(response.text)