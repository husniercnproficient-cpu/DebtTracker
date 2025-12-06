const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Folder public untuk HTML
app.use(express.static('public'));

const DATA_FILE = path.join(__dirname, 'data.json');

// Baca data
function readData() {
  const raw = fs.readFileSync(DATA_FILE);
  return JSON.parse(raw);
}

// Tulis data
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// --- ROUTES ---

// GET semua data
app.get('/api/debts', (req, res) => {
  const data = readData();
  res.json(data);
});

// CREATE data baru
app.post('/api/debts', (req, res) => {
  const data = readData();
  const newDebt = req.body;
  data.push(newDebt);
  writeData(data);
  res.json({ message: 'Debt added', debt: newDebt });
});

// UPDATE data (by namaAplikasi)
app.put('/api/debts/:nama', (req, res) => {
  const data = readData();
  const index = data.findIndex(d => d.namaAplikasi === req.params.nama);
  if (index === -1) return res.status(404).json({ message: 'Not found' });

  data[index] = req.body;
  writeData(data);
  res.json({ message: 'Debt updated', debt: data[index] });
});

// DELETE data (by namaAplikasi)
app.delete('/api/debts/:nama', (req, res) => {
  let data = readData();
  const index = data.findIndex(d => d.namaAplikasi === req.params.nama);
  if (index === -1) return res.status(404).json({ message: 'Not found' });

  const removed = data.splice(index, 1);
  writeData(data);
  res.json({ message: 'Debt removed', debt: removed[0] });
});

// Jalankan server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});
