const express = require('express');
const { loadPlayerData, savePlayerData } = require('../controllers/playerDataController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/load', authenticateToken, loadPlayerData);
router.post('/save', authenticateToken, savePlayerData);

module.exports = router;
