const express = require('express');
const userModel = require('../models/userModel');
const categoryModel = require('../models/category');
const brandModel =  require('../models/brand');
const couponModel = require('../models/coupon')
const bcrypt = require('bcrypt');
const passport = require('passport');
const bodyParser = require('body-parser');
const coupon = require('../models/coupon');


//admin credentials
const adminCredentials = {
    email : process.env.ADMIN_EMAIL,
    password : process.env.ADMIN_PASS,
}

//Admin Login Page
const login =(req,res)=>{
    if(!req.session.admin){
        res.render('admin/adminLogin');
    }else{
        res.redirect('/admin/dashboard');
    }

}


//admin login action
const loginAction = async(req,res)=>{
    try {
        const { email, password } =req.body;
        if(email === adminCredentials.email && password === adminCredentials.password){
            req.session.admin= email;
            res.redirect('/admin/dashboard');      
        }else{
            res.render('admin/adminLogin',{errors: "The admin didn't exist"});
        }
    }   
    catch (error) {
       console.log('adminLogin:',error.message);
       res.render('admin/adminLogin',{errors: "An error occured during login."});
    }
}


//dashboard
const dashboard = (req, res) =>{
    res.render('admin/dashboard');
}

//Admin Logouot
const logout = (req, res)=>{
    req.session.destroy();
    res.render('admin/adminLogin');
}

//user list
const userList = async(req,res) =>{
    try {
        const user = await userModel.find().exec();
        const formattedUsers = user.map(user => ({
            ...user._doc,
            date: user.date.toISOString().split('T')[0]
        }));        
        res.render('admin/userList', {users:formattedUsers});
    } catch (error) {
        console.error("Error in getting user list:", error);
        res.render("admin/userList", { error: "An error occurred while fetching the user list."});
    }
}


const blockuser = async(req,res) =>{
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


const unblockuser = async(req,res) =>{
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

//render category page
const category = async(req,res) =>{
    try {

        const brands = await brandModel.find()
        const categories = await categoryModel.find()
        res.render('admin/categories',{brand:brands,category:categories})
    } catch (error) {
        console.log("error in category:",error.message)
    }
   
}

const categoryAdd = async(req,res) => {
    try {
        const {name} = req.body;
        const category = new categoryModel({
            name
        })
        await category.save()

        req.flash('success',"new category added successfully.")
        res.redirect('/admin/category')
    } catch (error) {
        console.error("category error",error.message)
        req.flash('error',"some error occured while adding the category.")
        res.redirect('/admin/category')
    }
}


const brandAdd = async(req,res) => {
    try {
        const {name} = req.body;
        const newBrand = new brandModel({
            name
        })
        await newBrand.save()

        req.flash('success',"new brand added successfully.")
        res.redirect('/admin/category')
    } catch (error) {
        console.error("category error",error.message)
        req.flash('error',"some error occured while adding the brand.")
        res.redirect('/admin/category')
    }
}


const deleteBrand = async(req,res) =>{
    try {
        
        const brand = await brandModel.findByIdAndDelete(req.params.id)
        if(!brand){
            req.flash('error',"Error in finding the brand.");
            res.redirect('/admin/category')
        }
        req.flash('success','The brand is deleted successfully');
        res.redirect('/admin/category')
    } catch (error) {
        console.log("delete brand error:",error.message);
        req.flash('error',"Error in deleting brands.");
        res.redirect('/admin/category')
    }
}


const deleteCategory = async(req,res) =>{
    try {
        
    const brand = await categoryModel.findByIdAndDelete(req.params.id)
    if(!brand){
        req.flash('error',"Error in finding the category.");
        res.redirect('/admin/category');
    }
        req.flash('success','The category is deleted successfully');
        res.redirect('/admin/category')
    } catch (error) {
        console.log("delete brand error:",error.message);
        req.flash('error',"Error in deleting category.");
        res.redirect('/admin/category')
    }
}


const editCategory = async(req,res)=>{
    try {
        let id = req.params.id
        let category = await categoryModel.findById(id)
        res.render('admin/editCategory',{categories:category})
    } catch (error) {
        console.log("editcategory error:",error.message)
    }

}

const editBrand = async(req,res)=>{
    try {
        let id = req.params.id
        let brand = await brandModel.findById(id)
        res.render('admin/editBrand',{brands:brand})
    } catch (error) {
        console.log("brand edit error:",error.message)
    }
}


const editCategoryAction =async(req,res) =>{
    try {
        const id=req.params.id;
        const {categoryName} =req.body;

        let category = await categoryModel.findById(id)

        //update category fields
        category.name = categoryName;
        await category.save();

        req.flash('success','successfully edited the category.')
        res.redirect('/admin/category')
    } catch (error) {
        console.log('editing category',error.message);
    }
}

const editBrandAction = async(req,res) =>{
    try {
        const id=req.params.id;
        const {brandName} =req.body;

        let brand = await brandModel.findById(id)

        //update category fields
        brand.name = brandName;
        await brand.save();

        req.flash('success','successfully edited the brand.')
        res.redirect('/admin/category')
    } catch (error) {
        console.log('editing brand',error.message);
    }
 
}

// show coupons list
const couponList = async(req, res) => {
    try {
        
        const coupons = await couponModel.find();
        const couponUpdate = coupons.map(coupon => ({
            ...coupon._doc,
            expiryDate: coupon.expiryDate.toISOString().split('T')[0]
        }));   
        res.render('admin/coupons',{coupons:couponUpdate});

    } catch (error) {
        console.log('Some error occured in coupon:',error);
        res.render('admin/coupons',{error:'some error in coupon list.'});
    }
}

const addCoupon = async(req, res) => {
    res.render('admin/addCoupon',{coupon : {}, editMode : false})
}

//coupon editing page
const editCoupon = async(req, res) => {
    const couponId = req.params.id;
    const coupon = await couponModel.findById(couponId);
    if(!coupon){
        req.flash('error','coupon is not found.');
        res.redirect('/admin/coupons');
    }else{
        res.render('admin/addCoupon',{coupon, editMode:true})
    }
}


//updating coupon
const updateCoupon = async(req,res) =>{
    try {
        const id=req.params.id;
        const { description, code, status, maxDiscount, usageLimitPerUser, maxCount, expiryDate, discountPercentage } = req.body;

        //update category fields
        const updatedCoupon = await couponModel.findByIdAndUpdate(id, {
            description,
            code,
            status,
            maxDiscount,
            usageLimitPerUser,
            maxCount,
            expiryDate,
            discountPercentage
        }, { new: true });

        if(!updatedCoupon){
            req.flash('error', 'coupon not found.');
            return res.redirect('/admin/coupons')
        }

        req.flash('success','successfully edited the coupon.')
        res.redirect('/admin/coupons')
    } catch (error) {
        console.log('editing coupon:',error.message);
        req.flash('error', 'An error occured while editing the coupon');
        res.redirect('/admin/coupons')
    }
 
}

const createCoupon = async(req, res) => {
    const { description, code, status, maxDiscount, usageLimitPerUser, maxCount, expiryDate, discountPercentage } = req.body;

    try {
        const newCoupon = new couponModel({
            description,
            code,
            status,
            maxDiscount,
            usageLimitPerUser,
            maxCount,
            expiryDate,
            discountPercentage
        });

        await newCoupon.save();
        req.flash('success','coupon added successfully.')
        res.redirect('/admin/coupons'); // Redirect to the list of coupons or some confirmation page
    } catch (err) {
        console.error(err);
        req.flash('error', 'Error adding coupon.'); 
        res.redirect('/admin/addcoupon'); // Redirect back to the form in case of error
    }

}


const deleteCoupon =  async(req, res) => {
    try {
        
        const coupon = await couponModel.findByIdAndDelete(req.params.id)
        if(!coupon){
            req.flash('error',"Error in finding the couponId.");
           return res.redirect('/admin/coupons')
        }
            req.flash('success','The coupon is deleted successfully');
            res.redirect('/admin/coupons')
        } catch (error) {
            console.log("delete coupon error:",error.message);
            req.flash('error',"Error in deleting coupon.");
            res.redirect('/admin/coupons')
        }
}



module.exports = {
    login,
    loginAction,
    dashboard,
    logout,
    userList,
    blockuser,
    unblockuser,
    category,
    categoryAdd,
    brandAdd,
    deleteBrand,
    deleteCategory,
    editCategory,
    editBrand,
    editBrandAction,
    editCategoryAction,
    couponList,
    addCoupon,
    createCoupon,
    deleteCoupon,
    editCoupon,
    updateCoupon
}