require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/auth');
const playerDataRoutes = require('./src/routes/playerData'); // Import player data routes
const db = require('./src/db/database'); // Ensure database connection is established

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // For parsing application/json

app.get('/', (req, res) => {
  res.send('Account Server is running!');
});

app.use('/api/auth', authRoutes);
app.use('/api/playerdata', playerDataRoutes); // Use player data routes

app.listen(PORT, () => {
  console.log(`Account Server running on port ${PORT}`);
});