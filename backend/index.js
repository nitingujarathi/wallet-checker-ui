const express = require('express');
const app = express();
const PORT = 4000;

app.use(express.json());

app.get('/api/ping', (req, res) => {
  res.json({ message: 'Backend is running smoothly 🚀' });
});

app.get('/', (req, res) => {
  res.send('Welcome to Wallet Checker API');
});

app.listen(PORT, () => {
console.log(`✅ Backend listening at http://localhost:${PORT}`);