const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/category_controller');


// get all products 
router.get('/', categoryController.home);
// create new category 
router.post('/',categoryController.create);
// edit category 
router.get('/edit/:id',categoryController.edit);
// update category by id 
router.post('/updateCategory/:id',categoryController.update);
// delete category by id 
router.delete('/delete/:id',categoryController.remove);


module.exports = router;