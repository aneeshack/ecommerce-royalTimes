const express = require('express');
const productRouter = express.Router();
const adminProductController = require('../controller/adminProductController');
const valid = require('../middleware/userValidation');
const passport = require('passport')
const upload = require('../helpers/productMulter')
const adminValid = require('../middleware/adminValidation');
const { addProductValidator } = require('../helpers/productValidate')
require('../config/passport')




//admin routes
productRouter.get('/addProduct',adminValid.isAdmin,adminProductController.addProduct);
productRouter.post('/addProduct',upload.array('images',3),addProductValidator,adminProductController.addProductAction);
productRouter.get('/productList',adminValid.isAdmin,adminProductController.productList);
productRouter.get('/editProduct/:id',adminValid.isAdmin,adminProductController.editPage);
productRouter.post('/editProduct/:id',upload.array('images',3),adminValid.isAdmin,adminProductController.updateProduct);

productRouter.get('/block/:id',adminValid.isAdmin,adminProductController.blockProduct);
productRouter.get('/unblock/:id',adminValid.isAdmin,adminProductController.unblockProduct);


module.exports =productRouter