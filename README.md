# Retain - AI-Powered Lecture Generation Platform

## Overview
Retain is an intelligent platform that transforms academic materials into personalized, easy-to-understand audio lectures using AI. It helps students and professionals tackle the challenge of processing complex academic content by converting documents into structured, accessible learning experiences.

## Problem Statement
Students and professionals face several challenges with traditional learning materials:
- Overwhelming volume of complex academic content
- Difficulty in identifying and focusing on key concepts
- Time-consuming process of digesting dense research papers and notes
- Need for more accessible and efficient learning methods

## Solution
Retain addresses these challenges by:
- Converting academic materials into personalized audio lectures
- Breaking down complex concepts into digestible explanations
- Using AI to identify and focus on key themes
- Providing a structured learning experience through an intuitive interface

## Tech Stack

### Frontend
- **React.js**: Core frontend framework
- **Tailwind CSS**: Utility-first CSS framework for styling
- **React Router**: For navigation and routing
- **Lucide React**: For UI icons and components
- **ShadCN UI**: Component library for modern UI elements

### Backend
- **Node.js & Express**: Server framework
- **PostgreSQL**: Primary database
- **AWS S3**: Document storage
- **Multer**: File upload handling
- **JWT & Bcrypt**: Authentication and security
- **CORS**: Cross-origin resource sharing

### AI & Machine Learning
- **Flask API**: RAG service implementation
- **OpenAI GPT-4**: For text processing and generation
- **Pinecone**: Vector database for embeddings
- **AutoGen**: Multi-agent framework for AI processing
- **Cartesia TTS API**: Text-to-speech conversion

### DevOps & Infrastructure
- **Docker & Docker Compose**: Containerization and orchestration
- **AWS Infrastructure**: Cloud hosting and services
- **Poetry**: Python dependency management
- **NPM**: Node.js package management

## Key Features

### Document Processing
- PDF document upload and processing
- Intelligent text chunking and embedding
- Secure document storage in AWS S3

### AI-Powered Analysis
- Retrieval-Augmented Generation (RAG) for context-aware responses
- Multi-agent processing using AutoGen
- Intelligent summarization and key concept extraction

### User Experience
- Clean, intuitive web interface
- Personal course and lecture management
- Audio lecture generation and playback
- Progress tracking and management

## Setup and Installation

### Prerequisites
- Node.js (>= 12.0.0)
- Python 3.12
- Docker and Docker Compose
- AWS account credentials
- PostgreSQL

### Backend Setup
1. Clone the repository
2. Navigate to the backend directory:
```bash
cd backend
```

3. Set up PostgreSQL using Docker:
```bash
docker-compose up -d
```

4. Install dependencies:
```bash
npm install
```

5. Configure environment variables:
```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=retain_db
DB_PASSWORD=your_password
DB_PORT=5432
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=your_aws_region
```

6. Start the server:
```bash
npm run dev
```

### Frontend Setup
1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

### RAG Service Setup
1. Navigate to the RAG service directory
2. Set up Python environment:
```bash
poetry install
```

3. Configure API keys:
```env
OPENAI_API_KEY=your_key
PINECONE_API_KEY=your_key
```

4. Start the Flask server:
```bash
poetry run python agent.py
```

## API Endpoints

### Authentication
- `POST /signup`: User registration
- `POST /login`: User authentication

### Courses
- `POST /create-course`: Create a new course
- `GET /courses/:email`: Get all courses for a user

### Lectures
- `POST /create-lecture`: Create a new lecture
- `GET /lectures/:email/:course_id`: Get all lectures for a course

## Contributing
We welcome contributions! Please read our contributing guidelines and submit pull requests for any improvements.

## License
This project is licensed under the ISC License.

## Acknowledgments
- OpenAI for GPT models
- All contributors and supporters of the project
