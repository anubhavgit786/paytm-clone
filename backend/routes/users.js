const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

router.post('/signup', userController.signUp);

router.patch('/updateMyPassword', authController.protect, userController.updatePassword);

router.patch('/', authController.protect, userController.updateUser);

router.get('/bulk', userController.getUsers);

module.exports = router;