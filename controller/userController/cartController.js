require('express');
const productModel = require('../../models/product');
const cartModel = require('../../models/cart');
const categoryOfferModel = require('../../models/categoryOffer');
const productOfferModel = require('../../models/productOffer');
const helpers = require('../userController/helper');

// //adding products to the cart list
// const addToCart = async (req, res) => {
//     try {
//         const { productId } = req.body;
//         const userId = req.session.userId;
      
//         const productItem = await productModel.findById(productId);
//         if (!productItem) {
//             res.status(500).render('404error')
//         } else {
//           const productOffer = await productOfferModel.findOne().populate('products');
//           const productPrice = productItem.price;
//           let adjustedPrice = productItem.price;
//           let appliedOffer = null;
  
//           // Check if the product offer exists and applies to the product
//           if (productOffer  && productOffer.products._id.equals(productId)) {
//                   adjustedPrice = productPrice*((100-productOffer.discountPercentage)/100) ; // Assuming `offerPrice` is the discounted price
//                   console.log('product offer price:',adjustedPrice)
//                   appliedOffer = 'product';           
//           }
  
//           // If no product offer, check for category offer
//           if (!appliedOffer) {
//               const categoryOffer = await categoryOfferModel.findOne().populate('categories');
//               if (categoryOffer && categoryOffer.categories._id.equals(productItem.category)) {
//                   adjustedPrice = productPrice*((100-categoryOffer.discountPercentage)/100) ; // Assuming `offerPrice` is the discounted price
//                   console.log('category offer is:',adjustedPrice)
//                   appliedOffer = 'category';
//               }
//           }
  
//           console.log('Adjusted price:', adjustedPrice);
       
      
//             //check if product exist in the cart already
//             const productExists = await helpers.cartProductData(userId, productId)
          
//             console.log('product exist:',productExists)
//             if (productExists) {
//                 res.redirect('/user/cart');
//             } else {

//                 //check if user already exist in the cart
//                 let cart = await cartModel.findOne({ userId });
//                 if (cart) {
//                     cart.products.push({ productId, quantity: 1, total: adjustedPrice, offerPrice:adjustedPrice });
//                     const grandAmount = cart.grandTotal + adjustedPrice
//                     cart.grandTotal = grandAmount
//                     await cart.save();
//                     res.redirect('/user/cart');
//                 } else {
//                     cart = new cartModel({
//                         userId: userId,
//                         products: [{ productId, quantity: 1, total: adjustedPrice, offerPrice: adjustedPrice }],
//                         grandTotal: adjustedPrice
//                     })
//                     await cart.save();
//                     res.redirect('/user/cart');
//                 }
//             }
//         }
//     } catch (error) {
//         console.log('addtocart error:', error.message);
//         res.status(500).render('404error', { message: 'Error in adding product to cart' })
//     }
// }

// //showing cart page
// const cartPage = async (req, res) => {
//     try {
//         if (req.session.isUser) {
//             let userId = req.session.userId;
//             if (userId) {
//                 const cartItems = await cartModel.findOne({ userId }).populate('products.productId');
//                 console.log('cartitems are:',cartItems)
//                 if (cartItems) {
//                     const grandTotalAmount = cartItems.grandTotal || 0;
//                     res.render('user/cart', { cartItems, grandTotalAmount });
//                 } else {
//                     console.log('user have no cart')
//                     res.render('user/cart', { cartItems: [], grandTotalAmount: 0 });
//                 }
//             } else {
//                 res.redirect('/user/login', { message: "please login first to get cart page." });
//             }
//         } else {
//             res.redirect('/user/login');
//         }
//     } catch (error) {
//         console.log('Cart Page error:', error.message);
//         res.redirect('back');
//     }
// }

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
                    console.log('User has no cart');
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
                // Check if the user already has a cart
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
                console.log('product total:',productTotal)
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
            grandTotal += item.quantity * item.offerPrice;
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