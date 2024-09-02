const express = require('express');
const router = express.Router();
const { verifyPan } = require('../controllers/PanController');

// Route to verify PAN
router.post('/pan-verify', verifyPan);

module.exports = router;
