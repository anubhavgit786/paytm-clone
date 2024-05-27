const express = require('express');

const router = express.Router();

console.log('router loaded');


router.use('/user', require('./users'));
router.use('/account', require('./account'));



module.exports = router;