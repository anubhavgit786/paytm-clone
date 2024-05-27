const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');
const accountController = require('../controllers/accountController');

router.get('/balance', authController.protect, accountController.getBalance); 

module.exports = router;