const axios = require('axios');
const dotenv = require('dotenv');
const User = require('../models/User');


exports.verifyAadhaar = async (req, res) => {
  const { aadhaar, phone } = req.body;

  try {
    const options = {
      method: 'POST',
      url: process.env.APY_URL,
      headers: {
        'Content-Type': 'application/json',
        'apy-token': process.env.APY_TOKEN,
      },
      data: { aadhaar },
    };

    const response = await axios.request(options);

    // Check the response data
    if (response.data.data === true) {
      res.status(200).json({ status: "success", message: "Aadhaar verified", aadhaar });
      //find user by phone number
      const user = await User.findOne({ phone });
      //update the user model
      user.aadharVerified = true;
      user.aadharVerifiedAt = new Date();
      await user.save();
    } else if (response.data.data === false) {
      res.status(400).json({ status: "failed", message: "Aadhaar verification failed" });
    } else {
      res.status(500).json({ status: "error", message: "Unexpected response from Aadhaar verification service" });
    }
  } catch (error) {
    console.error("Aadhaar verification error:", error);
    res.status(500).json({ status: "error", message: "An error occurred during Aadhaar verification" });
  }
};
