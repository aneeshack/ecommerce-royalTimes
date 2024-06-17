const express = require('express');
const adminRouter = express.Router();
const adminController = require('../controller/adminController/adminController');
const categoryController = require('../controller/adminController/CategoryController');
const brandController = require('../controller/adminController/brandController');
const couponController = require('../controller/adminController/couponController');
const adminValid = require('../middleware/adminValidation');

//admin validation
adminRouter.get('/', adminController.login);
adminRouter.post('/login', adminController.loginAction);
adminRouter.get('/dashboard', adminValid.isAdmin, adminController.dashboard);
adminRouter.get('/logout', adminValid.isAdmin, adminController.logout);

//admin control user routes
adminRouter.get('/usersList', adminValid.isAdmin, adminController.userList);
adminRouter.get('/block/:id', adminValid.isAdmin, adminController.blockuser);
adminRouter.get('/unblock/:id', adminValid.isAdmin, adminController.unblockuser);

//controlling category management
adminRouter.get('/category', adminValid.isAdmin, categoryController.category);
adminRouter.post('/categoryAdd', adminValid.isAdmin, categoryController.categoryAdd);
adminRouter.get('/deleteCategory/:id', adminValid.isAdmin, categoryController.deleteCategory);
adminRouter.get('/editCategory/:id', adminValid.isAdmin, categoryController.editCategory);
adminRouter.put('/editCategory/:id', adminValid.isAdmin, categoryController.editCategoryAction);

//routes handling brand management
adminRouter.post('/brandAdd', adminValid.isAdmin, brandController.brandAdd);
adminRouter.get('/editBrand/:id', adminValid.isAdmin, brandController.editBrand);
adminRouter.put('/editBrand/:id', adminValid.isAdmin, brandController.editBrandAction);
adminRouter.get('/deleteBrand/:id', adminValid.isAdmin, brandController.deleteBrand);

//routes for coupon management
adminRouter.get('/coupons', adminValid.isAdmin, couponController.couponList);
adminRouter.get('/addCoupons', adminValid.isAdmin, couponController.addCoupon);
adminRouter.post('/addCoupons', adminValid.isAdmin, couponController.createCoupon);
adminRouter.get('/deleteCoupon/:id', adminValid.isAdmin, couponController.deleteCoupon);
adminRouter.get('/editCoupon/:id', adminValid.isAdmin, couponController.editCoupon);
adminRouter.post('/editCoupon/:id', adminValid.isAdmin, couponController.updateCoupon);



module.exports = adminRouter;