const express = require("express");
const router = express.Router();
const { getAddressByPincode } = require("../controllers/addressController");

router.post('/pincode', getAddressByPincode);

module.exports = router;
