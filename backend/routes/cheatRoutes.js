// backend/routes/cheatRoutes.js
const express = require('express');
const router = express.Router();

// Exemple de route
router.get('/', (req, res) => {
    res.send('Bienvenue dans les cheat routes !');
});

module.exports = router;
