const express = require('express');
const adminRouter = express.Router();
const adminController = require('../controller/adminController');
const productController = require('../controller/adminProductController')
const passport = require('passport')
const adminValid = require('../middleware/adminValidation');

//admin validation
adminRouter.get('/',adminController.login);
adminRouter.post('/login',adminController.loginAction);
adminRouter.get('/dashboard',adminValid.isAdmin,adminController.dashboard);
adminRouter.get('/logout',adminValid.isAdmin,adminController.logout);


//admin control user routes
adminRouter.get('/usersList',adminValid.isAdmin,adminController.userList);
adminRouter.get('/block/:id',adminValid.isAdmin,adminController.blockuser);
adminRouter.get('/unblock/:id',adminValid.isAdmin,adminController.unblockuser);

//controlling categories and brands
adminRouter.get('/category',adminValid.isAdmin,adminController.category);
adminRouter.post('/categoryAdd',adminValid.isAdmin,adminController.categoryAdd);
adminRouter.post('/brandAdd',adminValid.isAdmin,adminController.brandAdd);
adminRouter.get('/deleteBrand/:id',adminValid.isAdmin,adminController.deleteBrand);
adminRouter.get('/deleteCategory/:id',adminValid.isAdmin,adminController.deleteCategory);
adminRouter.get('/editCategory/:id',adminValid.isAdmin,adminController.editCategory);
adminRouter.get('/editBrand/:id',adminValid.isAdmin,adminController.editBrand);
adminRouter.put('/editCategory/:id',adminValid.isAdmin,adminController.editCategoryAction);
adminRouter.put('/editBrand/:id',adminValid.isAdmin,adminController.editBrandAction);


adminRouter.get('/coupons',adminValid.isAdmin,adminController.couponList);
adminRouter.get('/addCoupons',adminValid.isAdmin,adminController.addCoupon);
adminRouter.post('/addCoupons',adminValid.isAdmin,adminController.createCoupon);
adminRouter.get('/deleteCoupon/:id',adminValid.isAdmin,adminController.deleteCoupon);
adminRouter.get('/editCoupon/:id',adminValid.isAdmin,adminController.editCoupon);
adminRouter.post('/editCoupon/:id',adminValid.isAdmin,adminController.updateCoupon);



module.exports = adminRouter;