const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  aadhar: { type: String, required: true, unique: true },
  dob: { type: Date, required: true },
  password: { type: String, required: true },
  phoneVerified: { type: Boolean, default: false },
  phoneVerifiedAt: { type: Date, default: null },
  emailVerified: { type: Boolean, default: false },
  emailVerifiedAt: { type: Date, default: null },
  aadharVerified: { type: Boolean, default: false },
  aadharVerifiedAt: { type: Date, default: null },
  pan: { type: String, default: null },
  panVerified: { type: Boolean, default: false },
  panVerifiedAt: { type: Date, default: null },
  bankAccount: { type: String, default: null },
  bankAccountVerified: { type: Boolean, default: false },
  bankAccountVerifiedAt: { type: Date, default: null },
  gst: { type: String, default: null },
  gstVerified: { type: Boolean, default: false },
  gstVerifiedAt: { type: Date, default: null },
  pincode: { type: String, default: null },

});

module.exports = mongoose.model('User', userSchema);
