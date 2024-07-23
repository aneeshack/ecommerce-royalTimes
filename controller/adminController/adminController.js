const express = require('express');
const userModel = require('../../models/userModel');
const categoryModel = require('../../models/category');
const brandModel = require('../../models/brand');
const couponModel = require('../../models/coupon')
const bcrypt = require('bcrypt');
const passport = require('passport');
const bodyParser = require('body-parser');
const coupon = require('../../models/coupon');


//admin credentials
const adminCredentials = {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASS,
}

//Admin Login Page
const login = (req, res) => {
    if (!req.session.admin) {
        res.render('admin/adminLogin');
    } else {
        res.redirect('/admin/dashboard');
    }

}


//admin login action
const loginAction = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email === adminCredentials.email && password === adminCredentials.password) {
            req.session.admin = email;
            res.redirect('/admin/dashboard');
        } else {
            res.render('admin/adminLogin', { errors: "The admin didn't exist" });
        }
    }
    catch (error) {
        console.log('adminLogin:', error.message);
        res.render('admin/adminLogin', { errors: "An error occured during login." });
    }
}




//Admin Logouot
const logout = (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login')
}

//user list
const userList = async (req, res) => {
    try {
        const user = await userModel.find().exec();
        const formattedUsers = user.map(user => ({
            ...user._doc,
            date: user.date.toISOString().split('T')[0]
        }));
        res.render('admin/userList', { users: formattedUsers });
    } catch (error) {
        console.error("Error in getting user list:", error);
        res.render("admin/userList", { error: "An error occurred while fetching the user list." });
    }
}

//block a active user
const blockuser = async (req, res) => {
    try {

        const id = req.params.id;
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).send({ error: 'Product not found' });
        }
        user.isActive = false;
        await user.save();
        req.flash('success', "user is blocked successfully.")
        res.redirect('/admin/usersList')

    } catch (error) {
        console.log("block user error:", error.message);
    }
}

//unblocking the blocked user
const unblockuser = async (req, res) => {
    try {

        const id = req.params.id;
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).send({ error: 'Product not found' });
        }

        user.isActive = true;
        const updateUser = await user.save();

        req.flash('success', "user is unblocked successfully.");
        res.redirect('/admin/usersList');

    } catch (error) {
        console.log("block user error:", error.message);
    }
}


module.exports = {
    login,
    loginAction,
    logout,
    userList,
    blockuser,
    unblockuser,
}