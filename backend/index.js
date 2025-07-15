const express = require('express');
const app = express();
const PORT = 4000;

app.get('/api/ping', (req, res) => {
  res.json({ message: 'Backend is running!' });
});

app.listen(PORT, () => {
  console.log(`✅ Backend listening at http://localhost:${PORT}`);
});
