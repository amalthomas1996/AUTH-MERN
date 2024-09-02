const express = require('express');
const router = express.Router();
const { verifyGST } = require('../controllers/gstController');

// Route to verify GST
router.post('/verify', verifyGST);

module.exports = router;
