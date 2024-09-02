const twilio = require('twilio');
const Otp = require('../models/Otp');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);


exports.getUserPhone = async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // Assuming req.user.id contains the user's ID
    if (user) {
      res.json({ phone: user.phone });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Send OTP
exports.sendOtp = async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ message: 'Phone number is required' });
  }

  // Check if the phone number exists
  const user = await User.findOne({ phone });
  if (!user) {
    return res.status(400).json({ message: 'Phone number not registered' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    // Send OTP using Twilio
    await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER, // Twilio phone number
      to: `+91${phone}`,
    });

    // Save the OTP in the database with a 5-minute expiration
    const otpEntry = new Otp({
      identifier: phone,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000) // OTP valid for 5 minutes
    });
    await otpEntry.save();

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Failed to send OTP', error: error.message });
  }
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;



  if (!phone || !otp) {
    return res.status(400).json({ message: 'Phone number and OTP are required' });
  }

  try {
    // Find the OTP in the database using phone as the identifier
    const otpEntry = await Otp.findOne({ identifier: phone, otp });

    if (!otpEntry) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (otpEntry.expiresAt < new Date()) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // OTP is valid, delete it from the database
    await Otp.deleteMany({ identifier: phone });
    const user = await User.findOne({ phone });
    if (user) {
      user.phoneVerified = true;
      user.phoneVerifiedAt = new Date();
      await user.save();
    }
    res.status(200).json({ message: 'OTP Verified' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Failed to verify OTP', error: error.message });
  }
};
