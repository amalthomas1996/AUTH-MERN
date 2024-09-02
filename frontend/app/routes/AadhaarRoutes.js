const express = require('express');
const router = express.Router();
const { verifyAadhaar } = require('../controllers/AadhaarController');

// Route to verify Aadhaar
router.post('/verify', verifyAadhaar);

module.exports = router;
