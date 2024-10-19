const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DB_USER,      // From .env
  host: process.env.DB_HOST,      // From .env
  database: process.env.DB_NAME,  // From .env
  password: process.env.DB_PASSWORD, // From .env
  port: process.env.DB_PORT,      // From .env
});

// Middleware
app.use(cors());
app.use(express.json());

// Create users table if it does not exist
const createUsersTable = async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      );
    `;
  
    try {
      await pool.query(query);
      console.log('Users table created or already exists.');
    } catch (err) {
      console.error('Error creating users table:', err);
    }
  };
  
  // Call the function to create the users table
  createUsersTable();

// Test Route
app.get('/', (req, res) => {
  res.send('Hello, Retain API is running!');
});

// Signup Route
app.post('/signup', async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      'INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *',
      [first_name, last_name, email, hashedPassword]
    );
    res.status(201).json(result.rows[0]); // Respond with the created user
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).send('Error signing up');
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (user && await bcrypt.compare(password, user.password)) {
      res.status(200).json({ message: 'Login successful', user });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).send('Error logging in');
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
