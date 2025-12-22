// NOKOSKU Main Router
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('NOKOSKU API aktif');
});

module.exports = router;
