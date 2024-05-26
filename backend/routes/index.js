const express = require('express');

const router = express.Router();

console.log('router loaded');


router.use('/users', require('./users'));
//router.use('/tours', require('./tours'));
//router.use('/reviews', require('./reviews'));


module.exports = router;