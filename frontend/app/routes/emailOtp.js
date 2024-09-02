const express = require('express');
const { sendEmailOtp, verifyEmailOtp } = require('../controllers/emailOtpController');
const router = express.Router();

// Define routes
router.post('/send', sendEmailOtp);
router.post('/verify', verifyEmailOtp);

module.exports = router;
