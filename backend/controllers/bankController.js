const axios = require('axios');
const dotenv = require('dotenv');
const User = require('../models/User');

const initiateBankVerification = async (req, res) => {
  const { accountNumber, ifsc } = req.body;

  const options = {
    method: 'POST',
    url: process.env.RAPIDAPI_BANK_URL_I,
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY_BANK_I,
      'x-rapidapi-host': process.env.RAPIDAPI_HOST_BANK_I,
      'Content-Type': 'application/json'
    },
    data: {
      task_id: '123',
      group_id: '1234',
      data: {
        bank_account_no: accountNumber,
        bank_ifsc_code: ifsc
      }
    }
  };

  try {
    const response = await axios.request(options);
    const requestId = response.data.request_id;
    res.status(200).json({ requestId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to initiate bank verification", error: error.message });
  }
};

const checkBankVerificationStatus = async (req, res) => {
  const { requestId, phone, accountNumber } = req.query;

  const options = {
    method: 'GET',
    url: process.env.RAPIDAPI_BANK_URL_V,
    params: {
      request_id: requestId
    },
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY_BANK_V,
      'x-rapidapi-host': process.env.RAPIDAPI_HOST_BANK_V
    }
  };

  try {
    const response = await axios.request(options);
    const result = response.data[0].result;

    if (result.status === "id_found") {
      res.status(200).json({ message: "Account Number Verified Successfully..", verified: true, name: result.name_at_bank });
      //find user by phone number
      const user = await User.findOne({ phone });
      //update the user model
      user.bankAccount = accountNumber;
      user.bankAccountVerified = true;
      user.bankAccountVerifiedAt = new Date();
      await user.save();
    } else {
      res.status(400).json({ message: "Invalid Account Number", verified: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to check bank verification status", error: error.message });
  }
};

module.exports = { initiateBankVerification, checkBankVerificationStatus };
