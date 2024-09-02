const User = require('../models/User');


exports.registerUser = async (req, res) => {
  try {
    const { name, email, phone, aadhar, dob, password } = req.body;

    // Check if the email, phone, or aadhar already exists
    const existingUserByEmail = await User.findOne({ email });
    const existingUserByPhone = await User.findOne({ phone });
    const existingUserByAadhar = await User.findOne({ aadhar });

    if (existingUserByEmail) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (existingUserByPhone) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (existingUserByAadhar) {
      return res.status(400).json({ message: "User  already exists" });
    }

    // Create a new user if all checks pass
    const newUser = new User({ name, email, phone, aadhar, dob, password });
    await newUser.save();
    res.status(201).json({ message: "Registration Successful" });

  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ message: "Registration failed", error });
  }
};
exports.getUserByPhone = async (req, res) => {
  try {
    const { phone } = req.params;

    // Find the user by phone number
    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user data", error });
  }
};

