// Importing required packages
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
// require('dotenv').config({ path: './config.env' });  // Load environment variables

// console.log('DB_HOST:', process.env.DB_HOST);
// console.log('DB_USER:', process.env.DB_USER);
// console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
// console.log('DB_NAME:', process.env.DB_NAME);


// Initialize express app
const app = express();
const port = 3000;

// Middleware to parse JSON data and handle CORS
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Body parser to handle JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// MySQL connection setup
const db = mysql.createConnection({
  host: 'mysql.razs.me',   // MySQL host
  user: 'twitter_db_user',        // MySQL username
  password: 'swEqodl2aP_PrUrU0AkA', // MySQL password
  database: 'angular_twitter' // MySQL database name
});

// Connecting to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to MySQL database!');
});

// CRUD Operations

// Create a user
app.post('/users', (req, res) => {
  const { name, email, mobile_number,password } = req.body;
  console.log(req.body);
  const query = 'INSERT INTO users (name, email, mobile_number,password) VALUES (?, ?, ?, ?)';

  db.query(query, [name, email, mobile_number, password], (err, result) => {
    if (err) {
        console.log(err);
      return res.status(500).json({ error: 'Error creating user' });
    }
    res.status(201).json({ message: 'User created', userId: result.insertId });
  });
});

// Read all users
app.get('/users', (req, res) => {
  const query = 'SELECT * FROM users';

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching users' });
    }
    res.status(200).json(results);
  });
});

// Read a user by ID
app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  const query = 'SELECT * FROM users WHERE id = ?';

  db.query(query, [userId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching user' });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(result[0]);
  });
});

// Update a user by ID
app.put('/users/:id', (req, res) => {
  const userId = req.params.id;
  const { name, email, mobile_number } = req.body;
  const query = 'UPDATE users SET name = ?, email = ?, mobile_number = ? WHERE id = ?';

  db.query(query, [name, email, mobile_number, userId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error updating user' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User updated' });
  });
});

// Delete a user by ID
app.delete('/users/:id', (req, res) => {
  const userId = req.params.id;
  const query = 'DELETE FROM users WHERE id = ?';

  db.query(query, [userId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error deleting user' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted' });
  });
});

// Starting the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
