  
const express = require('express');
const router = express.Router();
const typeController = require('../controller/type.controller');
// const middleware = require('../middleware/data.middleware');

router.post('/get-type', typeController.getType);
router.post('/add-type', typeController.add);

module.exports = router;