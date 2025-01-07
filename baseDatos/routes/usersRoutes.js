const express = require('express');
const router = express.Router();
const registerUser = require('../controllers/users/registerUser');
const loginUser = require('../controllers/users/loginUser');

router.post('/registerUser', registerUser.registerUser);
router.post('/loginUser', loginUser.loginUser);

module.exports = router;