
require('express');
const userModel = require('../../models/userModel');
const product = require('../../models/product');
const Otp = require('../../models/otp')
const session = require('express-session');
const passport = require('passport')
const nodemailer = require('nodemailer');
const productOfferModel = require('../../models/productOffer');
const categoryOfferModel = require('../../models/categoryOffer');
const wishlistModel = require('../../models/wishList');

//Sending Email
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD
    }
})
const sendMail = async (email, subject, content) => {
    try {
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            throw new Error('Invalid or empty recipient email address.');
        }

        var mailOptions = {
            from: process.env.SMTP_MAIL,
            to: email,
            subject: subject,
            html: content
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error)
            }
            if (info && info.messageId) {
                console.log('Email sent:', info.messageId);
            } else {
                console.log('Email sent successfully.'); // You can log a success message if info.messageId is not available
            }
        });

    } catch (error) {
        console.log('send mail:', error.message)
    }
}


//google singup
const successGoogleLogin = async (req, res) => {
    try {
        if (req.user) {
            const check = await userModel.findOne({ email: req.user.email })
            if (!check) {
                let googleUser = req.user
                const name = googleUser.name.givenName + ' ' + googleUser.name.familyName
                const newUser = new userModel({
                    name: name,
                    email: googleUser.email,
                    profileImage: googleUser.picture || 'default_image_url',
                    googleId: googleUser.id,
                    isGoogleUser :true
                })
                const users = await newUser.save();
                req.session.isUser = name;
                req.session.userId = users._id;
                const products = await product.find({ isActive: true }).populate('brand');

                const user = req.session.isUser;
                const userId = req.session.userId
               
                let categoryOffers = []; 
                let productOffers = [];
                if (user) {
                    const usercheck = await userModel.findOne({ _id: userId, isActive: true });
                    const wishList = await wishlistModel.find();
                    const currentDate = new Date(); 
                     productOffers = await productOfferModel.find({startDate: { $lte: currentDate }}).populate('products');
                     categoryOffers = await categoryOfferModel.find({startDate: { $lte: currentDate }}).populate('categories');
        
                    if (usercheck) {
                        res.render('user/homePage', { No_icons: false, products: products, user: user, wishList,categoryOffers,productOffers });
                    } else {
                        res.render('user/homePage', { No_icons: true, products: products,categoryOffers,productOffers });
                    }
        
                } else {
                    res.render('user/homePage', { No_icons: true, products: products ,categoryOffers, productOffers });
                }
            } else {
                // const userName = check.name;
                req.session.isUser = check.name;
                req.session.userId = check._id;
                const products = await product.find({ isActive: true }).populate('brand');

                const user = req.session.isUser;
                const userId = req.session.userId
                
                let categoryOffers = []; 
                let productOffers = [];
                if (user) {
                    const usercheck = await userModel.findOne({ _id: userId, isActive: true });
                    const wishList = await wishlistModel.find();
                    const currentDate = new Date(); 
                     productOffers = await productOfferModel.find({startDate: { $lte: currentDate }}).populate('products');
                     categoryOffers = await categoryOfferModel.find({startDate: { $lte: currentDate }}).populate('categories');
        
                    if (usercheck) {
                        res.render('user/homePage', { No_icons: false, products: products, user: user, wishList,categoryOffers,productOffers });
                    } else {
                        res.render('user/homePage', { No_icons: true, products: products,categoryOffers,productOffers });
                    }
        
                } else {
                    res.render('user/homePage', { No_icons: true, products: products ,categoryOffers, productOffers });
                }
            } 

        } else {
            res.redirect('/user/failure');
        }
    } catch (error) {
        console.log("success Google:", error.message)
    }
}


const failureGoogleLogin = (req, res) => {
    res.redirect('/user/login');
}



module.exports = {
    successGoogleLogin,
    failureGoogleLogin,
    sendMail,
}