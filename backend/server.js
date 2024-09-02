const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const otpRoutes = require('./routes/otp');
const emailOtpRoutes = require('./routes/emailOtp');
const addressRoutes = require('./routes/addressRoutes');
const aadhaarRoutes = require('./routes/AadhaarRoutes');
const panRoutes = require('./routes/PanRoutes');
const bankRoutes = require('./routes/bankRoutes');
const gstRoutes = require('./routes/gstRoutes');

require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/email-otp', emailOtpRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/aadhaar', aadhaarRoutes);
app.use('/api/pan', panRoutes);
app.use('/api/bank', bankRoutes);
app.use('/api/gst', gstRoutes);


// MongoDB Connection
const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {

    });
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1); // Exit process with failure code
  }
};

// Start Server
const startServer = () => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

// Run the database connection and server startup
if (process.env.MONGO_URI) {
  connectToDatabase().then(startServer);
} else {
  console.error("MONGO_URI environment variable is not set.");
  process.exit(1);
}
