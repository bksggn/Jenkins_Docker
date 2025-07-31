const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 8080;

const dbConfig = {
  host: 'mysql',
  user: 'bks',
  password: 'Bks#13',
  database: 'bks'
};

// Retry logic
function waitForMySQLConnection(retries = 10, delay = 2000) {
  return new Promise((resolve, reject) => {
    const attempt = () => {
      const connection = mysql.createConnection(dbConfig);
      connection.connect(err => {
        if (err) {
          console.log(`MySQL not ready yet (${retries} retries left)...`);
          if (retries === 0) return reject('MySQL not reachable');
          retries--;
          setTimeout(attempt, delay);
        } else {
          console.log('MySQL connected successfully');
          resolve(connection);
        }
      });
    };
    attempt();
  });
}

let dbConnection;

app.get('/test-db', async (req, res) => {
  try {
    if (!dbConnection) {
      dbConnection = await waitForMySQLConnection();
    }
    dbConnection.query('SELECT 1', (err, results) => {
      if (err) {
        res.send('connection not stabiles');
      } else {
        res.send('MySQL connection successful!');
      }
    });
  } catch (err) {
    res.send('connection not stabiles');
  }
});

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});
