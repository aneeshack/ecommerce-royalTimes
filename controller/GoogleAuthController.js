
require('express');
const googleModel = require('../models/googleModel')
const product = require('../models/product');
const Otp = require('../models/otp')
const session = require('express-session');
const passport = require('passport')
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');


//Sending Email
const transporter = nodemailer.createTransport({
    host:process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure:false,
    requireTLS:true,
    auth:{
        user: process.env.SMTP_MAIL,
        pass:process.env.SMTP_PASSWORD
    }
})
const sendMail = async(email,subject, content)=>{
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
        transporter.sendMail(mailOptions, (error, info)=>{
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
        console.log('send mail:',error.message)
    }
}


//google singup

const successGoogleLogin =async(req,res)=>{
    try {
        if(req.user){
             const check = await googleModel.findOne({email:req.user.email})
             if(!check){
                let googleUser =req.user
                const name = googleUser.name.givenName+' '+googleUser.name.familyName
               const newUser = new googleModel({
                   name:name,
                   email:googleUser.email,
                   image:googleUser.picture|| 'default_image_url',
                   googleId:googleUser.id
               })
               const user =await newUser.save();
               const products = await product.find({isActive:true})
               req.session.isUser = true;
                res.render('user/homePage',{No_icons:false,products:products})
             }else{
                req.session.isUser = true;
                const products = await product.find({isActive:true})
                res.render('user/homePage',{No_icons:false,products:products})
             }
         
         }else{
             res.redirect('/failure');
         }
    } catch (error) {
        console.log("success Google:",error.message)
    }      
}

const failureGoogleLogin = (req,res)=>{
    res.send('Error')
}



module.exports ={
    successGoogleLogin,
    failureGoogleLogin,
    sendMail,
}