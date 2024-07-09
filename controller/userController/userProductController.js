require('express');
const product = require('../../models/product');
const productOfferModel = require('../../models/productOffer');
const categoryOfferModel = require('../../models/categoryOffer');
const mongoose = require('mongoose');

//product detail showing page
const productDetails = async (req, res) => {
    try {

        const productId = req.params.productId;
        console.log('product id is:',productId)
        if (!mongoose.isValidObjectId(productId)) {
            console.log('Invalid product ID');
            return res.status(400).json({ error: 'Invalid product ID' });
        }

        const product_details = await product.findById(productId)
        .populate('brand')
        .populate('category');

        const user = req.session.isUser;
        if (!product_details) {
            console.log('product details not found')
            return res.status(404).json({ error: 'Product not found' });
        } 
            // const relatedProducts = await product.find({ category: product_details.category })
            // console.log('related products',relatedProducts)
            // res.render('user/productDetails', { products: product_details, user ,relatedProducts})
        
            // Fetch product offer if exists
        const productOffer = await productOfferModel.findOne({ products: productId });
        console.log('pro offer:',productOffer)
        // Fetch category offer if exists
        const categoryOffer = await categoryOfferModel.findOne({ categories: product_details.category._id });
        console.log('cat off:',categoryOffer);
        // Determine the final price
        let finalPrice = product_details.price;
        let offerPercentage = 0;
        let offerType = '';

        if (productOffer) {
            finalPrice = product_details.price - (product_details.price * productOffer.discountPercentage / 100);
            offerPercentage = productOffer.discountPercentage;
            offerType = 'product';
        } else if (categoryOffer) {
            finalPrice = product_details.price - (product_details.price * categoryOffer.discountPercentage / 100);
            offerPercentage = categoryOffer.discountPercentage;
            offerType = 'category';
        }

        const relatedProducts = await product.find({ category: product_details.category });
        console.log('related products', relatedProducts);

        res.render('user/productDetails', { 
            products: product_details, 
            user, 
            productOffer,
            categoryOffer,
            relatedProducts, 
            finalPrice: finalPrice.toFixed(2), 
            offerPercentage, 
            offerType 
        });

    } catch (error) {
        console.log("product adding error:", error.message)
    }
}


module.exports = {
    productDetails,
    // productFilter
}