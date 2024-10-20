## Requirements
* This is set up using Poetry 
```bash
brew install poetry
poetry --version

```
* Navigate to current directory

```bash 
poetry env use 3.12.0
poetry install
pip install autogen
pip install xgboost
poetry shell
python rag.py
```
* Example curl command (with url)

```bash
curl -X POST http://127.0.0.1:5000/ask \
-H "Content-Type: application/json" \
-d '{                                              
    "pdf_url": "https://arxiv.org/pdf/1511.08458",
    "question": "What is the main point of this document?"
}'
```