const axios = require('axios');
const User = require('../models/User');

// GST verification function
exports.verifyGST = async (req, res) => {
  try {
    const { gstin, phone } = req.body;

    const options = {
      method: 'POST',
      url: process.env.RAPIDAPI_KEY_GST_URL,
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY_GST,
        'x-rapidapi-host': process.env.RAPIDAPI_KEY_GST_HOST,
        'Content-Type': 'application/json',
      },
      data: {
        task_id: process.env.GST_TASKID,
        group_id: process.env.GST_GROUPID,
        data: {
          gstin: gstin,
        },
      },
    };

    const response = await axios.request(options);
    const sourceOutput = response.data.result.source_output;
    const gstinOutput = sourceOutput.gstin;

    if (gstinOutput && gstinOutput !== null) {
      res.status(200).json({
        message: 'GSTIN verified successfully',
        data: gstinOutput,
      });
      //find user by phone number
      const user = await User.findOne({ phone });
      //update the user model
      user.gst = gstin;
      user.gstVerified = true;
      user.gstVerifiedAt = new Date();
      await user.save();

    } else {
      res.status(400).json({
        message: 'GST verification failed',
        error: 'Unknown status returned by API',
      });
    }
  } catch (error) {
    console.error('GST verification error:', error);
    res.status(500).json({
      message: 'GST verification failed',
      error: error.message,
    });
  }
};
