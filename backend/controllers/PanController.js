const axios = require('axios');
const User = require('../models/User');
const dotenv = require('dotenv');

// PAN verification function
exports.verifyPan = async (req, res) => {
  try {
    const { pan, phone } = req.body;
    const options = {
      method: 'POST',
      url: process.env.RAPIDAPI_URL_PAN,
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY_PAN,
        'x-rapidapi-host': process.env.RAPIDAPI_HOST_PAN,
        'Content-Type': 'application/json',
      },
      data: {
        pan,
        consent: 'y',
        consent_text: 'I hear by declare my consent agreement for fetching my information via AITAN Labs API',
      },
    };

    const response = await axios.request(options);

    // Check the response status
    if (response.data.status === 'success') {
      res.status(200).json({
        message: 'PAN verified successfully',
        data: response.data.result,
      });
      //find user by phone number
      const user = await User.findOne({ phone });
      //update the user model
      user.pan = pan;
      user.panVerified = true;
      user.panVerifiedAt = new Date();
      await user.save();
    } else {
      res.status(400).json({
        message: 'PAN verification failed',
      });
    }
  } catch (error) {
    console.error('PAN verification error:', error);
    res.status(500).json({
      message: 'PAN verification failed',
      error: error.message,
    });
  }
};
