const express = require('express');
const router = express.Router();

const productController = require('../controllers/product_controller');



// get all products 
router.get('/', productController.home);
// create new product 
router.post('/',productController.create);
// edit product 
router.get('/editProduct/:id',productController.edit);
// update product by id 
router.post('/updateProduct/:productId',productController.update);
// delete product by id 
router.delete('/delete/:id',productController.remove);



module.exports = router;