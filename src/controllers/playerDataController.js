const db = require('../db/database');

// Default player data for new players
const defaultPlayerData = {
    position: { x: 0, y: 0, z: 0 },
    health: 100,
    inventory: [],
    skills: []
};

const loadPlayerData = (req, res) => {
    const userId = req.user.id; // From authenticated JWT

    db.get('SELECT data FROM player_data WHERE user_id = ?', [userId], (err, row) => {
        if (err) {
            console.error('Error loading player data:', err.message);
            return res.status(500).json({ message: 'Error loading player data.' });
        }

        if (row) {
            // Data found, return it
            res.status(200).json({ message: 'Player data loaded successfully.', playerData: JSON.parse(row.data) });
        } else {
            // No data found for this user, return default data and optionally save it
            console.log(`No player data found for user ${userId}, returning default.`);
            // Optionally save default data here, or let the client save it later
            res.status(200).json({ message: 'No player data found, returning default.', playerData: defaultPlayerData });
        }
    });
};

const savePlayerData = (req, res) => {
    const userId = req.user.id; // From authenticated JWT
    const { playerData } = req.body; // Expects a JSON object in playerData field

    if (!playerData) {
        return res.status(400).json({ message: 'Player data is required.' });
    }

    const jsonData = JSON.stringify(playerData);

    db.run(
        'INSERT OR REPLACE INTO player_data (user_id, data) VALUES (?, ?)',
        [userId, jsonData],
        function (err) {
            if (err) {
                console.error('Error saving player data:', err.message);
                return res.status(500).json({ message: 'Error saving player data.' });
            }
            res.status(200).json({ message: 'Player data saved successfully.', changes: this.changes });
        }
    );
};

module.exports = {
    loadPlayerData,
    savePlayerData
};
