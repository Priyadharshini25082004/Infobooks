const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

// Middleware
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

// Route to handle retrieving books with filters (for users)
app.get('/books', (req, res) => {
  const { title, author, subject, publishDate, count } = req.query;
  let query = 'SELECT * FROM lib_details WHERE 1=1';
  const params = [];

  // Apply filters if provided
  if (title) {
    query += ' AND Title = ?';
    params.push(title);
  }
  if (author) {
    query += ' AND Author = ?';
    params.push(author);
  }
  if (subject) {
    query += ' AND Subject = ?';
    params.push(subject);
  }
  if (publishDate) {
    query += ' AND Publish_Date = ?';
    params.push(publishDate);
  }
  if (count) {
    query += ' AND Count = ?';
    params.push(count);
  }

  // Execute query
  pool.query(query, params, (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.status(200).json(results);
  });
});

// Start server
const PORT = 5500;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
