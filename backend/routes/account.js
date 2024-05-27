const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');
const accountController = require('../controllers/accountController');

router.get('/balance', authController.protect, accountController.getBalance); 
router.post('/transfer', authController.protect, accountController.transferBalance); 

module.exports = router;