const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const multer = require('multer');
const AWS = require('aws-sdk');
const fs = require('fs');
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

// AWS Configuration
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,      
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, 
  region: process.env.AWS_REGION,                
});

const s3 = new AWS.S3(); //AWS S3 Bucket

//Multer Middleware for file uploads
// Set up storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure this directory exists and is writable
  },
  filename: function (req, file, cb) {
    // Use a unique filename to prevent overwriting
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage }); //used in the Create lecture route to handle file

// Create users table if it does not exist
const createUsersTable = async () => {
    const query = `
      -- create users table: 
      CREATE TABLE IF NOT EXISTS users (
          first_name VARCHAR(100) NOT NULL,
          last_name VARCHAR(100) NOT NULL,
          email VARCHAR(100) PRIMARY KEY,  -- Set email as the primary key
          password VARCHAR(255) NOT NULL
      );

      -- create courses table: 
      CREATE TABLE IF NOT EXISTS courses (
          course_id SERIAL PRIMARY KEY,
          email VARCHAR(100) REFERENCES users(email) ON DELETE CASCADE,
          created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          course_name VARCHAR(255) NOT NULL
      );

      -- create lectures table: 
      CREATE TABLE IF NOT EXISTS lectures (
        lecture_id SERIAL PRIMARY KEY,
        course_id INT REFERENCES courses(course_id) ON DELETE CASCADE,
        created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        aws_folder_link TEXT,
        lecture_name VARCHAR(255) NOT NULL,
        prompt TEXT,
        transcript TEXT
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

// Signup Route -- NEW users table entry. 
app.post('/signup', async (req, res) => {
    const { first_name, last_name, email, password } = req.body;

    try {
        // Check if the email already exists in the database
        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // If not, hash the password and insert the new user
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log(`new user insert success. cck0`);
        const newUser = await pool.query(
            'INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *',
            [first_name, last_name, email, hashedPassword]
        );
        // console.log(`new user insert success. cck1`);

        res.json(newUser.rows[0]); // Send back the newly created user
        // console.log(`new user insert success. cck2`);
        
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// Login Route -- AUTH user from users table. 
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

// Create Course Route
app.post('/create-course', async (req, res) => {
  const { email, course_name } = req.body;

  try {
    // Insert new course into the courses table
    const newCourse = await pool.query(
      'INSERT INTO courses (email, course_name) VALUES ($1, $2) RETURNING *',
      [email, course_name]
    );
    res.status(201).json(newCourse.rows[0]);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Create Lecture Route
app.post('/create-lecture', upload.single('file'), async (req, res) => {
  const { course_id, lecture_name, prompt } = req.body;
  const file = req.file; // Access the uploaded file

  if (!file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    // Read the file from the local filesystem
    const fileContent = fs.readFileSync(file.path);

    // Set up S3 upload parameters
    const params = {
      Bucket: 'calhacks24-retain',
      Key: `lectures/${Date.now()}_${file.originalname}`, // File name to save as in S3
      Body: fileContent,
      ContentType: file.mimetype,
    };

    // Uploading files to S3
    s3.upload(params, async (err, data) => {
      if (err) {
        console.error('Error uploading to S3:', err);
        return res.status(500).json({ message: 'Failed to upload file to S3' });
      } else {
        console.log('File uploaded successfully to S3:', data.Location); //when the file is uploaded to the S3 bucket, AWS S3 responds with a data object that includes several details about the file, including its location (URL).

        // Delete the local file after uploading to S3
        fs.unlinkSync(file.path);

        // Insert new lecture data into the lectures table
        try {
          const newLecture = await pool.query(
            'INSERT INTO lectures (course_id, aws_folder_link, lecture_name, prompt, transcript) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [course_id, data.Location, lecture_name, prompt, ''] // Use S3 URL as aws_folder_link
          );

          res.status(201).json(newLecture.rows[0]);
        } catch (error) {
          console.error('Error creating lecture:', error);
          res.status(500).json({ message: 'Server error. Please try again later.' });
        }
      }
    });
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Get Courses for a User
app.get('/courses/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const courses = await pool.query('SELECT * FROM courses WHERE email = $1', [email]);
    res.status(200).json(courses.rows);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Get Lectures Route
app.get('/lectures/:email/:course_id', async (req, res) => {
  const { email, course_id } = req.params;

  try {
    const lectures = await pool.query(
      `SELECT lectures.* 
       FROM lectures 
       JOIN courses ON lectures.course_id = courses.course_id 
       WHERE courses.email = $1 AND lectures.course_id = $2`,
      [email, course_id]
    );

    res.status(200).json(lectures.rows);
  } catch (error) {
    console.error('Error fetching lectures:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});


// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
