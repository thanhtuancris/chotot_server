  
const express = require('express');
const router = express.Router();
const dataController = require('../controller/data.controller');
const middleware = require('../middleware/data.middleware');

router.post('/cuahang', dataController.cuahang);
router.post('/canhan', dataController.canhan);
router.post('/find-all', dataController.findAll);
router.post('/update', middleware.update, dataController.update);
router.post('/keep', dataController.keepProducts);

module.exports = router;