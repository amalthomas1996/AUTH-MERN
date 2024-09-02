const express = require('express');
const router = express.Router();
const { initiateBankVerification, checkBankVerificationStatus } = require('../controllers/bankController');

router.post('/initiate', initiateBankVerification);
router.get('/status', checkBankVerificationStatus);

module.exports = router;
