# Retain Backend Setup
### Overview
This README provides instructions for setting up and running the backend of the Retain application, which uses Express.js and PostgreSQL.

## Prerequisites
* Docker and Docker Compose installed
* Node.js and npm installed

# Steps to Run the Backend
1. Setting Up Docker with Docker Compose
Open your terminal and navigate to the backend directory where your docker-compose.yml file is located.

```bash
cd backend
```

Start the PostgreSQL container using Docker Compose:
```bash
docker-compose up -d
```
This command will start the PostgreSQL database defined in your docker-compose.yml. It runs in detached mode (-d), allowing you to continue using your terminal.

2. Running npm to Install Dependencies and Start the Server
After starting the Docker container, ensure you have all necessary Node.js dependencies installed. Run the following command:

```bash
npm install
```

Once the dependencies are installed, start the Express server with:

```bash
npm run dev
```

This command will start the server in development mode using nodemon, which automatically restarts the server when file changes are detected.

3. Editing and Viewing the Database from the Terminal

To access and interact with your PostgreSQL database from the terminal:

Open a new terminal window and execute the following command to access the PostgreSQL container:

```bash
docker exec -it backend-db-1 psql -U postgres -d retain_db
```

Replace backend-db-1 with the actual name of your running PostgreSQL container if itßß differs.

Query data from the users table:

```sql
SELECT * FROM users;
```
Exit the PostgreSQL shell:

```sql
\q
```
