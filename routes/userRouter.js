const express = require('express');
const userRouter = express.Router();
const userController = require('../controller/userController/userController');
const googleAuth = require('../controller/userController/GoogleAuthController');
const addressController = require('../controller/userController/addressController');
const categoryController = require('../controller/userController/categoryController');
const userProfileController = require('../controller/userController/userProfileController');
const cartController = require('../controller/userController/cartController');
const checkoutController = require('../controller/userController/checkoutController');
const orderController = require('../controller/userController/orderController')
const forgotPassController = require('../controller/userController/fogotPassController');
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
userRouter.get('/otp',userController.otpPage); 
userRouter.get('/resendOtp',userController.resendOtp); 
userRouter.post('/verifyOtp',userController.verifyOtp);

// forgot password routes
userRouter.get('/forgotPass',forgotPassController.forgotPassword);
userRouter.post('/forgotPass/email',forgotPassController.forgotPasswordEmail);
userRouter.get('/forgotOtp',forgotPassController.otpPage);
userRouter.get('/forgotPass/resendOtp',forgotPassController.resendOtp); 
userRouter.post('/forgotPass/verifyOtp',forgotPassController.verifyOtp);
userRouter.post('/forget/changePass',forgotPassController.changePassword);

//product filtering
userRouter.get('/category',valid.isLogout,categoryController.categoryPage);
userRouter.get('/filter',valid.isLogout,categoryController.productFilter);
userRouter.get('/search',valid.isLogout,categoryController.searchProduct);


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
userRouter.delete('/deleteCart/:id',cartController.deleteCart);
userRouter.post('/updateQuantity',cartController.updateQuantity);

//chekout order and payment controller routes
userRouter.get('/checkout',valid.isLogout,checkoutController.checkoutPage);
userRouter.post('/checkout/mobile',checkoutController.checkoutPageMobile);
userRouter.post('/checkout/address', uploadForm.none(),checkoutController.checkoutAddressAdd);
userRouter.post('/checkout/address/edit', uploadForm.none(),checkoutController.checkoutAddressEdit);

// ordering product
userRouter.post('/checkout/order',orderController.placeOrder);
userRouter.get('/confirmation',valid.isLogout,orderController.confirmation);

//order management
userRouter.get('/orders',valid.isLogout,orderController.orderList);
userRouter.get('/order/cancel/:orderId/:productId',valid.isLogout,orderController.orderCancel);
userRouter.post('/order/return',valid.isLogout,orderController.returnProduct);

module.exports =userRouter
    