// require('express');
const userModel = require('../../models/userModel');
const product = require('../../models/product');
const categoryModel = require('../../models/category');
const brandModel = require('../../models/brand');
const cartModel = require('../../models/cart');
const productOfferModel = require('../../models/productOffer');
const categoryOfferModel = require('../../models/categoryOffer');
const Otp = require('../../models/otp');
const wishlistModel = require('../../models/wishList');
const session = require('express-session');
const bcrypt = require('bcrypt');
const passport = require('passport');
require('body-parser');
const { check, validationResult } = require('express-validator');
const mailer = require('./GoogleAuthController');
const fs = require('fs');
const path = require('path');
const cart = require('../../models/cart');

//render homepage
const homePage = async (req, res) => {
    try {
        const products = await product.find({ isActive: true }).populate('brand');

        const user = req.session.isUser;
        const userId = req.session.userId

        let categoryOffers = []; 
        let productOffers = [];
        if (user) {
            const usercheck = await userModel.findOne({ _id: userId, isActive: true });
            const wishList = await wishlistModel.find();
             productOffers = await productOfferModel.find().populate('products');

             categoryOffers = await categoryOfferModel.find().populate('categories');
            console.log('category offer are:',categoryOffers,'product offers :',productOffers)
            // const categoryOffers = await categoryOfferModel.find().populate('categories');
            console.log('category offer are:', categoryOffers, 'product offers:', productOffers);

            if (usercheck) {
              

                res.render('user/homePage', { No_icons: false, products: products, user: user, wishList,categoryOffers,productOffers });
            } else {
                res.render('user/homePage', { No_icons: true, products: products,categoryOffers,productOffers });
            }

        } else {
            // count =0
            res.render('user/homePage', { No_icons: true, products: products ,categoryOffers, productOffers });
        }
    } catch (error) {
        console.log('homePage:', error.message)
    }
}


// const homePage = async (req, res) => {
//     try {
//         const products = await product.find({ isActive: true }).populate('brand');

//         const user = req.session.isUser;
//         const userId = req.session.userId

//         if (user) {
//             const usercheck = await userModel.findOne({ _id: userId, isActive: true });
//             const wishList = await wishlistModel.find();
//             if (usercheck) {

//                 res.render('user/homePage', { No_icons: false, products: products, user: user, wishList });
//             } else {
//                 res.render('user/homePage', { No_icons: true, products: products });
//             }

//         } else {
//             // count =0
//             res.render('user/homePage', { No_icons: true, products: products });
//         }
//     } catch (error) {
//         console.log('homePage:', error.message)
//     }
// }

//render login page


const login = (req, res) => {
    try {
        if (!req.session.isUser) {
            res.render('user/login', { No_icons: true })
        } else {
            res.redirect('/user/home')
        }
    } catch (error) {
        console.log(error.message)
    }
}

//render signup page
const signup = (req, res) => {
    try {
        if (!req.session.isUser) {
            res.render('user/signup', { No_icons: true })
        } else {
            res.redirect('/user/home')
        }
    } catch (error) {
        console.log(error.message)
    }
}


const otpPage = (req, res) => {
    res.render('user/otpPage')
}

//generate random otp
const randomOtp = async () => {
    return Math.floor(1000 + Math.random() * 9000);
}

//user signup
const signupAction = async (req, res) => {
    try {

        //check errors in express validator
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('user/signup', { errors: errors.array() });
        } else {
            const { email, name, password, Password_Confirm, referralOffer } = req.body;
            req.session.email = email;

            // Check referral code if provided
        if (referralOffer) {
            const referralUser = await userModel.findOne({ referralOffer: referralOffer });
            if (!referralUser) {
                console.log('referral code does not match')
                return res.render('user/signup', { message: "Referral code is not matching" });
            }
        }
            //checking if user is already exist or not
            const userExist = await userModel.findOne({ email: email })
            if (userExist) {
                res.render('user/signup', { message: "user already exist" })
            } else {
                if (password !== Password_Confirm) {
                    res.render('user/signup', { message: "Password is not matching." })
                } else {
                    const hashedPassword = await bcrypt.hash(password, 10)
                    req.body.password = hashedPassword

                    // Storing the details in session
                    req.session.userDetails = {
                        email: req.body.email,
                        name: req.body.name,
                        password: req.body.password,
                    };

                    // Check if referralOffer is present before saving to session
                    if (referralOffer) {
                        req.session.userDetails.referralOffer = referralOffer;
                    }

                    const existingOtp = await Otp.findOneAndDelete({ email: email });
                    //otp generate 
                    const g_otp = (await randomOtp()).toString();
                    const hashedOtp = await bcrypt.hash(g_otp, 10)
                    const msg = '<p> Hi <b>' + name + '</b>, </br> <h4>' + g_otp + '</h4> </p>'

                    //save otp in model
                    const otpData = new Otp({
                        email: email,
                        otp: hashedOtp,
                        Date: new Date()
                    })
                    const userOtp = await otpData.save();

                    //send otp to user
                    mailer.sendMail(email, 'Otp Verification', msg);
                    res.render('user/otpPage', { show: "otp send successfully.please check your email.", isError: false })

                    // deleting the doc after 2 min
                    setTimeout(async () => {
                        try {
                            await Otp.findOneAndDelete({ otp: userOtp.otp });
                            res.render('user/otpPage', { show: "Otp time out, resend otp.", isError: true })

                        } catch (error) {
                            console.log('2 minutes error:', error.message);
                        }
                    }, 120000);
                    console.log('otp send successfully')
                }
            }
        }
    }
    catch (error) {
        console.log('singup error:', error.message)
    }
}


//verify otp and enter into homepage
const verifyOtp = async (req, res) => {
    try {
        const otpDigits = [
            req.body.otpDigit1,
            req.body.otpDigit2,
            req.body.otpDigit3,
            req.body.otpDigit4
        ]

        // Check if any OTP digit is missing or not a number
        const missingOrInvalidDigit = otpDigits.some(digit => !digit || isNaN(digit));
        if (missingOrInvalidDigit) {
            console.log("Invalid OTP digits:", otpDigits);
            res.render('user/otpPage', { show: "Invalid otp.", isError: true })
            return;
        }
        const enteredOtp = otpDigits.join('');
        const email = req.session.email;

        //retrieve otp data from database
        const userValue = await Otp.findOne({ email })

        //if retrieve data from data base check otp and enter to home page
        if (userValue) {
            if (userValue.email === email) {
                const otpMatch = await bcrypt.compare(enteredOtp, userValue.otp);
                console.log(otpMatch)
                if (otpMatch) {
                    console.log("otp is matching");
                    await Otp.findOneAndDelete({ otp: userValue.otp });

                    //retrieve data from session
                    const userDetailsData = req.session.userDetails;
                    console.log("userdetails data in session:", userDetailsData.name)
                 
                    const userDetails = new userModel(userDetailsData);
                    if(userDetailsData.referralOffer){
                        userDetails.wallet = 1000
                    }
                    userDetails.save()
                        .then(savedUser => {
                            console.log('user saved successfully:', savedUser)
                            savedUser.referralOffer = savedUser._id.toString().slice(0, 10);

                            return savedUser.save();
                        })
                        .catch(error => {
                            console.log("error in saving data", error)
                        })
                    // const cart = await cartModel.findOne({ userId: userId });
                    // let count = cart.products.length;
                    // req.session.countCart = count
                    req.session.userId = userDetails._id;
                    req.session.isUser = userDetailsData.name;
                    res.redirect('/user/home')
                } else {
                    console.log("otp not match");
                    res.render('user/otpPage', { show: "otp is not matching, please enter the correct otp.", isError: true })
                }
            } else {
                res.render('user/otpPage', { show: "Invalid otp.", isError: true })
            }
        } else {
            res.render('user/otpPage', { show: "Invalid otp.", isError: true })
        }
    } catch (error) {
        console.log("verify otp:", error.message)
    }
}

//resend otp 
const resendOtp = async (req, res) => {
    try {
        //retrieve data from session
        if (req.session.userDetails) {
            const { email, name } = req.session.userDetails;

            //find and delete old otp data
            const existingOtp = await Otp.findOneAndDelete({ email: email });

            //generate otp
            const g_otp = (await randomOtp()).toString();
            const hashedOtp = await bcrypt.hash(g_otp, 10);
            const message = '<p> Hi <b>' + name + '</b>, </br> <h4>' + g_otp + '</h4> </p>'

            //save otp in model
            const otpData = new Otp({
                email: email,
                otp: hashedOtp,
                Date: new Date()
            })
            const userOtp = await otpData.save();
            //send email containing otp
            mailer.sendMail(email, 'Otp Verification', message);
            res.render('user/otpPage', { show: "otp resend successfully.please check your email.", isError: false })

            // deleting the doc after 2 min
            setTimeout(async () => {
                try {
                    await Otp.findOneAndDelete({ otp: userOtp.otp });
                    //  res.render('user/otpPage',{show:"otp verifying timeout. resend otp.",isError:true}) 
                    console.log('otp deleted after 2 minutes');
                } catch (error) {
                    console.log('2 minutes error:', error.message);
                }
            }, 120000);
        } else {
            res.render('user/otpPage', { show: "invalid otp.", isError: true })
        }
    } catch (error) {
        console.log("resend error: ", error.message)
    }
}

//login user
const loginAction = async (req, res) => {
    try {

        const email = req.body.email;
        const password = req.body.password;
        const check = await userModel.findOne({ email: email })
        if (check) {
            if (check.isActive === true) {
                if (check.isGoogleUser === false) {
                    const passwordMatch = bcrypt.compare(password, check.password);
                    if (passwordMatch) {
                        req.session.userId = check._id
                        req.session.isUser = check.name;
                        res.redirect('/user/home')
                    } else {
                        res.render('user/login', { message: "password not matching.", No_icons: true })
                    }
                } else {
                    res.render('user/login', { message: "please signin through google,or signup and try again.", No_icons: true })
                }
            } else {
                res.render('user/login', { message: "user is blocked by the admin for malpractice.", No_icons: true })
            }
        } else {
            res.render('user/login', { message: "User not exist. Please signup", No_icons: true })
        }

    } catch (error) {
        console.log('login action:', error.message)
        return res.status(400).json({
            success: false,
            loginMessage: error.message
        })

    }
}


//user logout action
const logout = (req, res) => {
    req.session.destroy();
    res.clearCookie('connect.sid')
    res.redirect('/user/home')
}


module.exports = {
    login,
    signupAction,
    loginAction,
    homePage,
    signup,
    resendOtp,
    verifyOtp,
    logout,
    otpPage
}