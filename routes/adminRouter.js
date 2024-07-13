const express = require('express');
const adminRouter = express.Router();
const adminController = require('../controller/adminController/adminController');
const categoryController = require('../controller/adminController/CategoryController');
const brandController = require('../controller/adminController/brandController');
const couponController = require('../controller/adminController/couponController');
const dashboardController = require('../controller/adminController/dashboardController');
const adminValid = require('../middleware/adminValidation');

//admin validation
adminRouter.get('/login', adminController.login);
adminRouter.post('/login', adminController.loginAction);
adminRouter.get('/logout', adminValid.isAdmin, adminController.logout);
// adminRouter.get('/dashboard', adminValid.isAdmin, dashboardController.dashboard);

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
adminRouter.post('/addCoupons', couponController.createCoupon);
adminRouter.delete('/deleteCoupon/:id', couponController.deleteCoupon);
adminRouter.get('/editCoupon/:id', adminValid.isAdmin, couponController.editCoupon);
adminRouter.post('/editCoupon/:id', adminValid.isAdmin, couponController.updateCoupon);

// category offer management
adminRouter.get('/categoryOffer',categoryController.categoryOfferList);
adminRouter.get('/categoryOffer/add',categoryController.categoryOfferUpdatePage);
adminRouter.post('/categoryOffer/post',categoryController.addCategoryOffer);
adminRouter.delete('/categoryOffer/delete/:id',categoryController.deleteCategoryOffer);
adminRouter.get('/categoryOffer/edit/:id',categoryController.editCategoryOfferPage);
adminRouter.post('/categoryOffer/update/:id',categoryController.editCategoryOffer);

// dashboard managements
adminRouter.get('/dashboard', adminValid.isAdmin, dashboardController.dashboard);
adminRouter.get('/orders',adminValid.isAdmin,dashboardController.chartUpdate);
adminRouter.get('/reports',adminValid.isAdmin,dashboardController.salesReport);
module.exports = adminRouter;