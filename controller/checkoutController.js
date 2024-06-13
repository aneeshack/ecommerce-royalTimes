const cartModel = require('../models/cart');

//To retrieve checkout page
const checkoutPage = async (req, res) => {
    
    const cartModel = await 
    res.render('user/checkoutPage')
}

const confirmation = async (req, res) => {
    res.render('user/confirmation');
}

const orderList = async (req, res) => {
    res.render('user/orderList')
}

module.exports = {
    checkoutPage,
    confirmation,
    orderList

}