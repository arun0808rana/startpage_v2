const express = require('express');
const app = express();
const PORT = 6660;

// app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile('index.html');
});

//app.post('/route', (req, res) => {
//  res.end();
//});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`)
});