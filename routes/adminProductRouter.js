const express = require('express');
const productRouter = express.Router();
const adminProductController = require('../controller/adminController/adminProductController');
const adminOrderController = require('../controller/adminController/adminOrderController');
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
productRouter.post('/editProduct/:id',upload.array('images',3),adminProductController.updateProduct);

productRouter.get('/block/:id',adminValid.isAdmin,adminProductController.blockProduct);
productRouter.get('/unblock/:id',adminValid.isAdmin,adminProductController.unblockProduct);

productRouter.get('/orderList',adminValid.isAdmin,adminOrderController.orderList);
productRouter.post('/orderStatus',adminValid.isAdmin,adminOrderController.orderStatus);
productRouter.get('/return/:orderId/:productId',adminValid.isAdmin,adminOrderController.returnManagement);
productRouter.post('/return/:orderId/:productId/accept',adminValid.isAdmin,adminOrderController.acceptReturn);
productRouter.post('/return/:orderId/:productId/reject',adminValid.isAdmin,adminOrderController.rejectReturn);




module.exports =productRouter