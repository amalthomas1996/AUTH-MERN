const nodemailer = require('nodemailer');
const Otp = require('../models/Otp');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});


// Send Email OTP
exports.sendEmailOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    // Remove any existing OTP for this email
    await Otp.deleteMany({ identifier: email });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}`,
    };

    // Send the OTP email
    await transporter.sendMail(mailOptions);

    // Save the OTP to the database with email as the identifier
    const otpEntry = new Otp({ identifier: email, otp });
    await otpEntry.save();

    res.status(200).json({ message: 'OTP sent successfully to your email' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Failed to send OTP', error: error.message });
  }
};

// Verify Email OTP
exports.verifyEmailOtp = async (req, res) => {
  const { email, otp, phone } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  try {
    // Find the OTP in the database using email as the identifier
    const otpEntry = await Otp.findOne({ identifier: email, otp });

    if (!otpEntry) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // OTP is valid, delete it from the database
    await Otp.deleteMany({ identifier: email });
    //find user by phone number
    const user = await User.findOne({ phone });
    //update the user model
    user.emailVerified = true;
    user.emailVerifiedAt = new Date();
    await user.save();


    res.status(200).json({ message: 'OTP Verified. Email is now verified.' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Failed to verify OTP', error: error.message });
  }
};
