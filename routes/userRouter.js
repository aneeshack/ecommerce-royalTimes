const express = require('express');
const userRouter = express.Router();
const userController = require('../controller/userController/userController');
const googleAuth = require('../controller/userController/GoogleAuthController');
const addressController = require('../controller/userController/addressController');
const categoryController = require('../controller/userController/categoryController');
const userProfileController = require('../controller/userController/userProfileController');
const cartController = require('../controller/userController/cartController');
const checkoutController = require('../controller/userController/checkoutController');
const valid = require('../middleware/userValidation');
const passport = require('passport')
const upload = require('../helpers/userMulter')
const {signupValidator, otpMailValidator}= require('../helpers/userValidate')
require('../config/passport')
const multer = require('multer');
const uploadForm = multer(); 

//google signup
userRouter.get('/auth/google',passport.authenticate('google',{
    scope: ['email','profile'],
    prompt: 'select_account'
}));    
userRouter.get('/auth/google/callback', passport.authenticate('google', {
    scope:['profile','email'],
    failureRedirect: '/user/failure'
}), googleAuth.successGoogleLogin);
userRouter.get('/failure',googleAuth.failureGoogleLogin)


//user validation routes
userRouter.get('/home',userController.homePage);
userRouter.get('/logout',valid.isLogout,userController.logout)
userRouter.get('/login',userController.login);
userRouter.post('/login',userController.loginAction);
userRouter.get('/signup',userController.signup);
userRouter.post('/signup',signupValidator,otpMailValidator,userController.signupAction);//signup and otp send
userRouter.get('/resendOtp',userController.resendOtp); 
userRouter.post('/verifyOtp',userController.verifyOtp)

//product filtering
userRouter.get('/category',categoryController.categoryPage);
userRouter.get('/api/products',categoryController.brandFilter);
userRouter.get('/api/productCategory',categoryController.categoryFilter);

//user profile details
userRouter.get('/profile',valid.isLogout,userProfileController.profilePage);
userRouter.post('/profile/:id',upload.single('profileImage'),userProfileController.profileUpdate);
userRouter.get('/password',valid.isLogout,userProfileController.changePasswordPage);
userRouter.post('/password/:id',valid.isLogout,userProfileController.changePass);


//address controller routes
userRouter.get('/address',valid.isLogout,addressController.addressManage);
userRouter.post('/address/:id',addressController.addAddress);
userRouter.get('/address/edit/:id',valid.isLogout,addressController.addressEditpage);
userRouter.post('/address/edit/:id',addressController.updateAddress);
userRouter.get('/address/delete/:id',valid.isLogout,addressController.deleteAddress);


//cart controller routes
userRouter.post('/cart',cartController.addToCart);
userRouter.get('/cart',valid.isLogout,cartController.cartPage);
userRouter.delete('/deleteCart/:id',valid.isLogout,cartController.deleteCart);
userRouter.post('/updateQuantity',cartController.updateQuantity);

//chekout order and payment controller routes
userRouter.get('/checkout',valid.isLogout,checkoutController.checkoutPage);
userRouter.post('/checkout/mobile',valid.isLogout,checkoutController.checkoutPageMobile);
userRouter.post('/checkout/address', uploadForm.none(),checkoutController.checkoutAddressAdd);
userRouter.post('/checkout/address/edit', uploadForm.none(),checkoutController.checkoutAddressEdit);
userRouter.post('/checkout/order',checkoutController.checkoutOrder);

// userRouter.post('/order',checkoutController.orderAction);
userRouter.get('/confirmation',valid.isLogout,checkoutController.confirmation);
userRouter.get('/orders',valid.isLogout,checkoutController.orderList);

module.exports =userRouter
    