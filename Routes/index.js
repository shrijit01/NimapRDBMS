const express = require('express');
const router = express.Router();

const homeController = require('../controllers/home_controller');

// home route  
router.get('/',homeController.home);
// Get product route 
router.use('/products',require('./product'));
// category route 
router.use('/categories',require('./category'));


module.exports = router;