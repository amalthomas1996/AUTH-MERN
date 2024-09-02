const express = require('express');
const { registerUser, getUserByPhone } = require('../controllers/userController');


const router = express.Router();

router.post('/register', registerUser);


router.get('/:phone', getUserByPhone);

module.exports = router;
