require('express');
const productModel = require('../models/product');
const cartModel = require('../models/cart')


//adding products to the cart list
const addToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.session.userId;
        const productItem = await productModel.findById(productId);
        if (!productItem) {
            res.status(500).render('404error')
        } else {
            //check if the product already exist in the cart
            const productExists = await cartModel.findOne({
                userId,
                'products.productId': productId,
            });
            if (productExists) {
                res.redirect('/user/cart');
            } else {

                //check if user already exist in the cart
                let cart = await cartModel.findOne({ userId });
                if (cart) {
                    cart.products.push({ productId, quantity: 1 });
                    await cart.save();
                    res.redirect('/user/cart');
                } else {
                    cart = new cartModel({
                        userId: userId,
                        products: [{ productId, quantity: 1 }],
                        // totalAmount : productItem.price
                    })
                    await cart.save();
                    res.redirect('/user/cart');
                }
            }
        }
    } catch (error) {
        console.log('addtocart error:', error.message);
        res.status(500).render('404error', { message: 'Error in adding product to cart' })
    }
}

//showing cart page
const cartPage = async (req, res) => {
    try {
        if (req.session.isUser) {
            let userId = req.session.userId;
            if (userId) {
                const cartItems = await cartModel.findOne({ userId }).populate('products.productId');
                res.render('user/cart', { cartItems });
            } else {
                res.redirect('/user/login', { message: "please login first to get cart page." });
            }
        } else {
            res.redirect('/user/login');
        }
    } catch (error) {
        console.log('Cart Page error:', error.message);
        res.redirect('back');
    }
}


//update the quantity of the products
const updateQuantity = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.session.userId;
        const cart = await cartModel.findOne({ userId }).populate('products.productId');
        if (cart) {
            const product = cart.products.find(p => p.productId._id.toString() === productId);
            if (product) {
                product.quantity = quantity;
                await cart.save();
                
           
                res.json({ message: 'Quantity updated successfully.' });

            } else {
                console.log("product is not found in cart");
                res.status(404).json({ error: 'product is not found in cart' });
            }
        } else {
            res.status(404).json({ error: 'Cart not found.' });
        }
    } catch (error) {
        console.log('Update quantity error:', error.message);
        res.status(500).render('404error', 'Error in updating quantity.')
    }
}

const deleteCart = async (req, res) => {
    try {
        const productId = req.params.id;
        const userId = req.session.userId;
        const cart = await cartModel.findOneAndUpdate(
            { userId: userId },
            { $pull: { products: { _id: productId } } },
            { new: true })

        res.redirect('/user/cart');

    } catch (error) {
        console.log('delete cart:', error.message);
        req.flash('error', 'Error in deleting the cart.');
        res.redirect('/user/cart');
    }
}

// const getData = (req,res)=>{
//     const {productId,} = req.body.input
//     res.send(`Hello, ${user}`);
// }
module.exports = {
    addToCart,
    cartPage,
    updateQuantity,
    deleteCart,

}