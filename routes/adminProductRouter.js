const express = require('express');
const productRouter = express.Router();
const adminProductController = require('../controller/adminController/adminProductController');
const adminOrderController = require('../controller/adminController/adminOrderController');
const offerController = require('../controller/adminController/offerController');
const valid = require('../middleware/userValidation');
const passport = require('passport')
const upload = require('../helpers/productMulter')
const adminValid = require('../middleware/adminValidation');
const { addProductValidator } = require('../helpers/productValidate')
require('../config/passport')




//admin routes
productRouter.get('/addProduct',adminValid.isAdmin,adminProductController.addProduct);
productRouter.post('/addProduct',upload.array('images',10),addProductValidator,adminProductController.addProductAction);
productRouter.get('/productList',adminValid.isAdmin,adminProductController.productList);
productRouter.get('/editProduct/:id',adminValid.isAdmin,adminProductController.editPage);
productRouter.post('/editProduct/:id',upload.array('images',10),adminProductController.updateProduct);
productRouter.delete('/deleteImage/:id',upload.array('images',10),adminProductController.deleteImage);

productRouter.get('/block/:id',adminValid.isAdmin,adminProductController.blockProduct);
productRouter.get('/unblock/:id',adminValid.isAdmin,adminProductController.unblockProduct);

productRouter.get('/orderList',adminValid.isAdmin,adminOrderController.orderList);
productRouter.post('/orderStatus',adminValid.isAdmin,adminOrderController.orderStatus);
productRouter.get('/return/:orderId/:productId',adminValid.isAdmin,adminOrderController.returnManagement);
productRouter.post('/return/:orderId/:productId/accept',adminValid.isAdmin,adminOrderController.acceptReturn);
productRouter.post('/return/:orderId/:productId/reject',adminValid.isAdmin,adminOrderController.rejectReturn);
productRouter.post('/return/:orderId/:productId/returned',adminValid.isAdmin,adminOrderController.productReturned);


// product offer management
productRouter.get('/offerList',offerController.productOfferList);
productRouter.get('/addOffer/:id',offerController.addProductOfferPage);
productRouter.post('/saveOffer/:id',offerController.addProductOffer);
productRouter.delete('/offer/delete/:id',offerController.deleteProductOffer);
productRouter.get('/editOffer/:id',offerController.editProductOfferPage);
productRouter.post('/offer/update/:id',offerController.editProductOffer);




module.exports =productRouter