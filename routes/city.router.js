  
const express = require('express');
const router = express.Router();
const cityController = require('../controller/city.controller');

router.post('/get-city', cityController.getCity);

module.exports = router;