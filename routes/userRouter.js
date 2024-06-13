const express = require('express');
const userRouter = express.Router();
const userController = require('../controller/userController');
const googleAuth = require('../controller/GoogleAuthController');
const addressController = require('../controller/addressController');
const categoryController = require('../controller/categoryController');
const userProfileController = require('../controller/userProfileController');
const cartController = require('../controller/cartController');
const valid = require('../middleware/userValidation');
const passport = require('passport')
const upload = require('../helpers/userMulter')
const {signupValidator, otpMailValidator}= require('../helpers/userValidate')
require('../config/passport')

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
userRouter.get('/profile',userProfileController.profilePage);
userRouter.post('/profile/:id',upload.single('profileImage'),userProfileController.profileUpdate);
userRouter.get('/password',userProfileController.changePasswordPage);
userRouter.post('/password/:id',userProfileController.changePass);


//address controller routes
userRouter.get('/address',addressController.addressManage);
userRouter.post('/address/:id',addressController.addAddress);
userRouter.get('/address/edit/:id',addressController.addressEditpage);
userRouter.post('/address/edit/:id',addressController.updateAddress);
userRouter.get('/address/delete/:id',addressController.deleteAddress);


//cart controller routes
userRouter.post('/cart',cartController.addToCart);
userRouter.get('/cart',cartController.cartPage);
userRouter.get('/deleteCart/:id',cartController.deleteCart);
userRouter.post('/updateQuantity',cartController.updateQuantity);
userRouter.post('/getData',cartController.getData)


userRouter.get('/checkout',userController.checkoutPage);
userRouter.get('/confirmation',userController.confirmation);

userRouter.get('/orders',userController.orderList);
module.exports =userRouter
    