const axios = require("axios");
const User = require("../models/User");

exports.getAddressByPincode = async (req, res) => {
  const { pincode, phone } = req.body;

  try {
    // Fetch address details using the pincode
    const response = await axios.get(
      `https://api.postalpincode.in/pincode/${pincode}`
    );

    const data = response.data[0];
    if (data.Status === "Success") {
      const postOffice = data.PostOffice[0];
      const address = {
        city: postOffice.Division,
        district: postOffice.District,
        state: postOffice.State,
        postalDetails: postOffice.Name,
      };

      // Update the user's pincode in the database
      const updatedUser = await User.findOneAndUpdate(
        { phone },
        { pincode },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(address);
    } else {
      res.status(404).json({ message: "Pincode not found" });
    }
  } catch (error) {
    console.error("Error fetching address details:", error);
    res.status(500).json({ message: "Server error" });
  }
};
