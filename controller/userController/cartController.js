require('express');
const productModel = require('../../models/product');
const cartModel = require('../../models/cart');
const categoryOfferModel = require('../../models/categoryOffer');
const productOfferModel = require('../../models/productOffer');
const helpers = require('../userController/helper');

// showing cart page for perticular users
const cartPage = async (req, res) => {
    try {
        if (req.session.isUser) {
            let userId = req.session.userId;
            if (userId) {
                let cartItems = await cartModel.findOne({ userId }).populate('products.productId');
                
                if (cartItems) {
                    let grandTotalAmount = 0;

                    // Recalculate prices based on the latest offers
                    for (let item of cartItems.products) {
                        const { adjustedPrice, appliedOffer } = await getAdjustedPrice(item.productId);
                        item.total = adjustedPrice * item.quantity;
                        item.offerPrice = adjustedPrice;
                        grandTotalAmount += item.total;
                    }

                    cartItems.grandTotal = grandTotalAmount;
                    await cartItems.save();

                    res.render('user/cart', { cartItems, grandTotalAmount });
                } else {
                    res.render('user/cart', { cartItems: [], grandTotalAmount: 0 });
                }
            } else {
                res.redirect('/user/login', { message: "Please login first to view the cart page." });
            }
        } else {
            res.redirect('/user/login');
        }
    } catch (error) {
        console.log('Cart Page error:', error.message);
        res.redirect('back');
    }
};


const getAdjustedPrice = async (productId) => {
    let adjustedPrice;
    let appliedOffer = null;

    const productItem = await productModel.findById(productId);
    if (productItem) {
        const productPrice = productItem.price;

        const productOffer = await productOfferModel.findOne({ products: productId });
        if (productOffer) {
            adjustedPrice = productPrice * ((100 - productOffer.discountPercentage) / 100);
            appliedOffer = 'product';
        } else {
            const categoryOffer = await categoryOfferModel.findOne({ categories: productItem.category });
            if (categoryOffer) {
                adjustedPrice = productPrice * ((100 - categoryOffer.discountPercentage) / 100);
                appliedOffer = 'category';
            } else {
                adjustedPrice = productPrice;
            }
        }
    }

    return { adjustedPrice, appliedOffer };
};

const addToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.session.userId;

        const productItem = await productModel.findById(productId);
        if (!productItem) {
            res.status(500).render('404error');
        } else {
            const { adjustedPrice } = await getAdjustedPrice(productId);

            // Check if the product exists in the cart already
            const productExists = await helpers.cartProductData(userId, productId);
            if (productExists) {
                res.redirect('/user/cart');
            } else {
                let cart = await cartModel.findOne({ userId });
                if (cart) {
                    cart.products.push({ productId, quantity: 1, total: adjustedPrice, offerPrice: adjustedPrice });
                    cart.grandTotal += adjustedPrice;
                    await cart.save();
                } else {
                    cart = new cartModel({
                        userId: userId,
                        products: [{ productId, quantity: 1, total: adjustedPrice, offerPrice: adjustedPrice }],
                        grandTotal: adjustedPrice
                    });
                    await cart.save();
                }
                res.redirect('/user/cart');
            }
        }
    } catch (error) {
        console.log('addtocart error:', error.message);
        res.status(500).render('404error', { message: 'Error in adding product to cart' });
    }
};



//update the quantity of the products
const updateQuantity = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.session.userId;
        const cart = await cartModel.findOne({ userId }).populate('products.productId');
        if (cart) {
            const product = cart.products.find(p => p.productId._id.toString() === productId);
            if (product) {
                let productTotal = product.offerPrice * quantity
                product.quantity = quantity;
                product.total = productTotal;

                //finding the grand total of all the products
                let grandT = cart.products.reduce((acc, curr) => {
                    acc = acc + (curr.offerPrice * curr.quantity)
                    return acc
                }, 0)
                cart.grandTotal = grandT
                await cart.save();

                res.status(200).json({ message: 'Quantity updated successfully.', grandT, productTotal });

            } else {
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
            await cartModel.deleteOne({ userId: userId });
            return res.status(200).json({ success: 'Cart is empty after deleting the product.' });
        }

        let grandTotal = 0;
        for (const item of updatedCart.products) {
            grandTotal += item.quantity * item.offerPrice;
        }

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