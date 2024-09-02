// backend/routes/otp.js
const express = require('express');
const router = express.Router();
const otpController = require('../controllers/otpController'); // Ensure correct path


// Route to send OTP
router.post('/send', otpController.sendOtp);

// Route to verify OTP
router.post('/verify', otpController.verifyOtp);

module.exports = router;
