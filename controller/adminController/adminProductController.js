const express = require('express');
const fs = require('fs');
const sharp = require('sharp');
const path = require('path');
const productModel = require('../../models/product');
const categoryModel = require('../../models/category');
const brandModel = require('../../models/brand')
const upload = require('../../helpers/productMulter');
const { check, validationResult } = require('express-validator');
const { Mongoose, default: mongoose } = require('mongoose');
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

    try {
        if (!req.files || req.files.length !== 3) {
            return res.status(400).json({ message: 'Please upload exactly 3 images.' });
        }
        // Create a new Product instance
        const newProduct = new productModel({
            productName: req.body.productName,
            price: req.body.price,
            stock: req.body.stock,
            warranty: req.body.warranty,
            rating: req.body.rating,
            watchType: req.body.watchType,
            CaseMaterial: req.body.CaseMaterial,
            dialColour: req.body.dialColour,
            strapMaterial: req.body.strapMaterial,
            ModelNumber: req.body.ModelNumber,
            features: req.body.features,
            brand: req.body.brand,
            category: req.body.category
        });

      
            const images = req.files;
            const imagePaths = [];

            // Process each uploaded image
            for (const image of images) {
                const imagePath = `/images/product/${image.filename}`; 
                imagePaths.push(imagePath);
            }

            // Set product images
            newProduct.images = imagePaths;
        

        // Save the new product to the database
        await newProduct.save();

        res.status(200).json({ message: 'Product updated successfully!' });
    } catch (error) {
        console.error("Error saving product:", error.message);
        res.status(500).json({ message: 'An error occurred while adding the product.' });
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

// const updateProduct = async (req, res) => {
//     try {
//         const id = req.params.id;

//         //update product fields
//         const savedImages = req.files.map(file => `/images/product/${file.filename}`);
//         console.log('thisi s the brand',req.body.brand)
//         const products = await productModel.findById(id)
//         console.log('products are:',products);

       
//         const updatedProduct = await productModel.findByIdAndUpdate(id, {
//             productName: req.body.productName,
//             price: req.body.price,
//             images: savedImages,
//             stock: req.body.stock,
//             warranty: req.body.warranty,
//             rating: req.body.rating,
//             brand: req.body.brand,
//             category: req.body.category,
//             watchType: req.body.watchType,
//             CaseMaterial: req.body.CaseMaterial,
//             dialColour: req.body.dialColour,
//             strapMaterial: req.body.strapMaterial,
//             ModelNumber: req.body.ModelNumber,
//             features: req.body.features,
//         }, { new: true });

//         if (!updatedProduct) {
//             req.flash('error', 'product is not found.');
//             return res.redirect('/admin/product/productList')
//         }

//         req.flash('success', 'successfully edited the Product.')
//         res.redirect('/admin/product/productList')
//     } catch (error) {
//         console.log('editing product:', error.message);
//         req.flash('error', 'An error occured while editing the product.');
//         res.redirect('/admin/product/productList')
//     }

// }

const updateProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const imageIndexes = req.body.imageIndexes || []; 
        const{productName,price,stock,warranty,rating,watchType,CaseMaterial,dialColour,strapMaterial,ModelNumber,features,brand,category}= req.body
       
        const updatedProduct  = await productModel.findById(id)
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        updatedProduct.productName = productName;
        updatedProduct.price = price;
        updatedProduct.stock = stock;
        updatedProduct.warranty = warranty;
        updatedProduct.rating = rating;
        updatedProduct.watchType = watchType;
        updatedProduct.CaseMaterial = CaseMaterial;
        updatedProduct.dialColour = dialColour;
        updatedProduct.strapMaterial = strapMaterial;
        updatedProduct.ModelNumber = ModelNumber;
        updatedProduct.features = features;
        updatedProduct.brand = brand;
        updatedProduct.category = category;

        if (req.files && req.files.length > 0) {
            const images = req.files;
            const imagePaths = [];
      
            // Process each uploaded image
            for (const image of images) {
              const imagePath = `/images/product/${image.filename}`; 
              imagePaths.push(imagePath);
            }
     
            imageIndexes.forEach((index, i) => {
                updatedProduct.images[index] = imagePaths[i];
            });
          }

          await updatedProduct.save();
          

        res.status(200).json({ message: 'Product updated successfully!' });
    } catch (error) {
        console.log('editing product:', error.message);
        res.status(500).json({ message: 'An error occurred while editing the product.' });
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