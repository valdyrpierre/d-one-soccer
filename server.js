const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Use your actual MySQL credentials here
const db = mysql.createConnection({
  host: 'sql5.freesqldatabase.com',
  user: 'sql5783727',
  password: 'Zz3H2Js3bw',
  database: 'sql5783727',
  port: 3306
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database.');
});

// Handle POST requests to /adminlogin
app.post('/adminlogin', (req, res) => {
  const { userpin } = req.body;
  db.query('SELECT * FROM admininfo WHERE pin = ?', [userpin], (err, results) => {
    if (err) {
      res.status(500).json({ success: false, message: 'Database error' });
      return;
    }
    if (results.length > 0) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  });
});

// New endpoint: Get all teams for standings page
app.get('/teams', (req, res) => {
  db.query('SELECT * FROM team', (err, results) => {
    if (err) {
      res.status(500).json({ success: false, message: 'Database error' });
      return;
    }
    res.json(results);
  });
});

app.post('/update-team', (req, res) => {
  console.log('Update request:', req.body);
  const {
    teamgroup, teamname, played, wins, draws, losses, gd, points
  } = req.body;

  // Validate required fields
  if (
    !teamgroup || !teamname ||
    played === undefined || wins === undefined || draws === undefined ||
    losses === undefined || gd === undefined || points === undefined
  ) {
    res.status(400).json({ success: false, message: 'Missing required fields' });
    return;
  }

  // Convert numeric fields to numbers
  const playedNum = Number(played);
  const winsNum = Number(wins);
  const drawsNum = Number(draws);
  const lossesNum = Number(losses);
  const gdNum = Number(gd);
  const pointsNum = Number(points);

  // Check for NaN values
  if (
    isNaN(playedNum) || isNaN(winsNum) || isNaN(drawsNum) ||
    isNaN(lossesNum) || isNaN(gdNum) || isNaN(pointsNum)
  ) {
    res.status(400).json({ success: false, message: 'Invalid number input' });
    return;
  }

  // Update the team row matching group and name
  db.query(
    `UPDATE team SET played=?, wins=?, draws=?, losses=?, gd=?, points=?
     WHERE teamgroup=? AND teamname=?`,
    [playedNum, winsNum, drawsNum, lossesNum, gdNum, pointsNum, teamgroup, teamname],
    (err, result) => {
      if (err) {
        console.error('Database error:', err);
        res.status(500).json({ success: false, message: 'Database error' });
        return;
      }
      if (result.affectedRows > 0) {
        res.json({ success: true });
      } else {
        res.json({ success: false, message: 'Team not found' });
      }
    }
  );
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});