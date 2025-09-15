const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');      

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/budget', (req, res) => {
  const filePath = path.join(__dirname, 'budget.json');
  fs.readFile(filePath, 'utf8', (err, text) => {
    if (err) {
      console.error('Failed to read budget.json:', err);
      return res.status(500).json({ error: 'Unable to load budget data' });
    }
    try {
      const data = JSON.parse(text);
      return res.json(data);
    } catch (e) {
      console.error('Invalid JSON in budget.json:', e);
      return res.status(500).json({ error: 'Invalid budget data' });
    }
  });
});

app.get('/hello', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
