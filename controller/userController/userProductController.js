require('express');
const product = require('../../models/product');
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
        } else {
            const relatedProducts = await product.find({ category: product_details.category })
            console.log('related products',relatedProducts)
            res.render('user/productDetails', { products: product_details, user ,relatedProducts})
        }

    } catch (error) {
        console.log("product adding error:", error.message)
    }
}


// //filter products based on category price and brand
// const productFilter = async (req, res) => {
//     try {
//         console.log('hello this is product filter')
//     } catch (error) {
//         console.log('error in filtering:',error.message);
//     }
// }


module.exports = {
    productDetails,
    // productFilter
}