require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// const server = http.createServer(app);

app.get('/', (req, res) => {
  res.json({
    status: 'Alive',
    message: 'The Roaster Backend is ready to burn code! 🔥'
  });
});

app.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
