const cartModel = require('../models/cart');
const userModel = require('../models/userModel');

//To retrieve checkout page
const checkoutPage = async (req, res) => {
    const userId = req.session.userId;
    // const cartItems = await cartModel.find({userId:userId})
    const cartItems = await cartModel.find({userId:userId}).populate('products.productId');
    // console.log("cart items",cartItems)
    // cartItems.forEach(element => {
    //     console.log('cart',element)
    //     element.products.forEach(product=>{
    //         console.log('productid',product.productId.productName)
    //     })
    // });
    let totalAmount = 0;
    cartItems.forEach(cartItem => {
        cartItem.products.forEach(product => {
            totalAmount += product.productId.price * product.quantity;
        });
    });

   const userData = await userModel.findById({_id:userId})
//    console.log(userData.address)
    res.render('user/checkoutPage',{userData,cartItems,totalAmount})
}

const confirmation = async (req, res) => {
    
    res.render('user/confirmation');
}

const orderList = async (req, res) => {
    // const userId = req.session.userId;
    // const cartItems = await cartModel.find({userId:userId}).populate('products')
    // console.log("cart items:",cartItems.products)
    res.render('user/orderList')
}

module.exports = {
    checkoutPage,
    confirmation,
    orderList

}