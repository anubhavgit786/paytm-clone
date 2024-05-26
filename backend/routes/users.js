const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');

router.post('/signup', userController.signUp);

router.patch('/updateMyPassword', userController.protect, userController.updatePassword);

router.patch('/', userController.protect, userController.updateUser);

module.exports = router;