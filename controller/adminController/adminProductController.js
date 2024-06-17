const express = require('express');
const fs = require('fs');
const sharp = require('sharp');
const path = require('path');
const productModel = require('../../models/product');
const categoryModel = require('../../models/category');
const brandModel = require('../../models/brand')
const upload = require('../../helpers/productMulter');
const { check, validationResult } = require('express-validator');
// const {cropImage} = require('../helpers/imageCrop');


const productList = async (req, res) => {
    try {
        const products = await productModel.find().exec();
        res.render('admin/productList', { products: products });
    } catch (error) {
        console.error("Error in getting product list:", error);
        res.render("admin/productList", { error: "something went wrong in product list " });
    }
};


// for getting product adding page
const addProduct = async (req, res) => {
    try {
        const categories = await categoryModel.find();
        const brands = await brandModel.find();

        res.render('admin/addProduct', {
            categories,
            brands, editMode: false
        });
    } catch (error) {
        console.log('Error fetching categories and brands:', error.message);
    }
}



// For posting product details
const addProductAction = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('error', errors.array().map(error => error.msg));
        return res.redirect('/admin/product/addProduct'); // Adjust the path as necessary
    }
    try {

        const brandName = req.body.brand;
        const categoryName = req.body.category;

        const brand = await brandModel.findOne({name: brandName});
        const category = await brandModel.findOne({name: categoryName});
        const savedImages = req.files.map(file => `/images/product/${file.filename}`);
        const product = new productModel({
            productName: req.body.productName,
            price: req.body.price,
            images: savedImages,
            stock: req.body.stock,
            warranty: req.body.warranty,
            rating: req.body.rating,
            brand: brand.id,
            category: category.id,
            watchType: req.body.watchType,
            CaseMaterial: req.body.CaseMaterial,
            dialColour: req.body.dialColour,
            strapMaterial: req.body.strapMaterial,
            ModelNumber: req.body.ModelNumber,
            features: req.body.features,
        });

        await product.save();
        req.flash('success', 'product added successfully')
        res.redirect('/admin/product/productList')

    } catch (error) {
        console.log("Error saving product:", error.message);
        res.status(500).send('Server Error');
    }
};


const blockProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await productModel.findById(productId);

        if (!product) {
            req.flash('error', 'Product not found');
            const fullproducts = await productModel.find().exec();
            return res.render('admin/productList', { products: fullproducts })
        }

        product.isActive = false;
        await product.save();
        req.flash('success', "product blocked successfully.")

        res.redirect('/admin/product/productList')
    } catch (error) {
        req.flash('error', "Error in blocking product.")
        const fullproducts = await productModel.find().exec();
        res.render('admin/productList', { products: fullproducts })
    }
}


const unblockProduct = async (req, res) => {
    try {

        const productId = req.params.id;
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).send({ error: 'Product not found' });
        }

        product.isActive = true;
        await product.save();

        req.flash('success', "product unblocked successfully.")
        res.redirect('/admin/product/productList')

    } catch (error) {
        console.log("block product error:", error.message);
    }
}


// render product editing page
const editPage = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await productModel.findById(id);
        const categories = await categoryModel.find();
        const brands = await brandModel.find();
        if (!product) {
            req.flash('error', 'product is not found.');
            res.redirect('/admin/product/productList');
        } else {
            res.render('admin/addProduct', { product, editMode: true, categories, brands })
        }
    } catch (error) {
        console.log('editpage:', error.message)
    }

}

const updateProduct = async (req, res) => {
    try {
        const id = req.params.id;

        //update product fields
        const savedImages = req.files.map(file => `/images/product/${file.filename}`);
        const updatedProduct = await productModel.findByIdAndUpdate(id, {
            productName: req.body.productName,
            price: req.body.price,
            images: savedImages,
            stock: req.body.stock,
            warranty: req.body.warranty,
            rating: req.body.rating,
            brand: req.body.brand,
            category: req.body.category,
            watchType: req.body.watchType,
            CaseMaterial: req.body.CaseMaterial,
            dialColour: req.body.dialColour,
            strapMaterial: req.body.strapMaterial,
            ModelNumber: req.body.ModelNumber,
            features: req.body.features,
        }, { new: true });

        if (!updatedProduct) {
            req.flash('error', 'product is not found.');
            return res.redirect('/admin/product/productList')
        }

        req.flash('success', 'successfully edited the Product.')
        res.redirect('/admin/product/productList')
    } catch (error) {
        console.log('editing product:', error.message);
        req.flash('error', 'An error occured while editing the product.');
        res.redirect('/admin/product/productList')
    }

}


module.exports = {
    addProduct,
    addProductAction,
    productList,
    blockProduct,
    unblockProduct,
    editPage,
    updateProduct
}