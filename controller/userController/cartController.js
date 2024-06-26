require('express');
const productModel = require('../../models/product');
const cartModel = require('../../models/cart')
const helpers = require('../userController/helper');

//adding products to the cart list
const addToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.session.userId;
      
        const productItem = await productModel.findById(productId);
        if (!productItem) {
            res.status(500).render('404error')
        } else {
            const productPrice = productItem.price

            //check if product exist in the cart already
            const productExists = await helpers.cartProductData(userId, productId)
          
            console.log('product exist:',productExists)
            if (productExists) {
                res.redirect('/user/cart');
            } else {

                //check if user already exist in the cart
                let cart = await cartModel.findOne({ userId });
                if (cart) {
                    cart.products.push({ productId, quantity: 1, total: productPrice });
                    const grandAmount = cart.grandTotal + productPrice
                    cart.grandTotal = grandAmount
                    await cart.save();
                    res.redirect('/user/cart');
                } else {
                    cart = new cartModel({
                        userId: userId,
                        products: [{ productId, quantity: 1, total: productPrice }],
                        grandTotal: productPrice
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
                console.log('cartitems are:',cartItems)
                if (cartItems) {
                    const grandTotalAmount = cartItems.grandTotal || 0;
                    res.render('user/cart', { cartItems, grandTotalAmount });
                } else {
                    console.log('user have no cart')
                    res.render('user/cart', { cartItems: [], grandTotalAmount: 0 });
                }
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
                let productTotal = product.productId.price * quantity

                product.quantity = quantity;
                product.total = productTotal;

                //finding the grand total of all the products
                let grandT = cart.products.reduce((acc, curr) => {
                    acc = acc + (curr.productId.price * curr.quantity)
                    return acc
                }, 0)
                cart.grandTotal = grandT
                await cart.save();

                res.status(200).json({ message: 'Quantity updated successfully.', grandT, productTotal });

            } else {
                console.log("product is not found in cart");
                res.status(404).json({ error: 'product is not found in cart' });
            }
        } else {
            res.status(404).json({ error: 'Cart not found.' });
        }
    } catch (error) {
        console.log('Update quantity error:', error.message);
        res.status(500).json({ error: 'Error in updating quantity.' })
    }
}


// Deleting a product from the cart
const deleteCart = async (req, res) => {
    try {
        const productId = req.params.id;
        const userId = req.session.userId;

        // Find and update the cart, pulling out the specified product
        const updatedCart = await cartModel.findOneAndUpdate(
            { userId: userId },
            { $pull: { products: { productId: productId } } },
            { new: true }
        ).populate('products.productId');

        if (!updatedCart) {
            // Cart not found or empty after deletion, delete the entire cart
            await cartModel.deleteOne({ userId: userId });
            return res.status(200).json({ success: 'Cart is empty after deleting the product.' });
        }

        // Calculate the new grand total based on the remaining products
        let grandTotal = 0;
        for (const item of updatedCart.products) {
            grandTotal += item.quantity * item.productId.price;
        }

        // Update the grand total in the cart
        updatedCart.grandTotal = grandTotal;
        await updatedCart.save();

        res.status(200).json({ success: 'Successfully deleted the product from the cart.', grandTotal });
    } catch (error) {
        console.log('Error deleting product from cart:', error.message);
        req.flash('error', 'Error in deleting the product from the cart.');
        res.redirect('/user/cart');
    }
};


module.exports = {
    addToCart,
    cartPage,
    updateQuantity,
    deleteCart,

}