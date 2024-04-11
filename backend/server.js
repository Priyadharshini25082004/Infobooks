const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MySQL Connection
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'library',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Route to handle adding books (admin only)
app.post('/add-book', (req, res) => {
  const { title, author, subject, publishDate, count } = req.body;
  // Insert the book details into the database
  pool.query('INSERT INTO lib_details (Title, Author, Subject, Publish_Date, Count) VALUES (?, ?, ?, ?, ?)',
    [title, author, subject, publishDate, count],
    (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.status(200).json({ message: 'Book added successfully' });
    });
});

// Start server
const PORT = 5500;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

