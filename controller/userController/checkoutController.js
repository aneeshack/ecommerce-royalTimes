const cartModel = require('../../models/cart');
const userModel = require('../../models/userModel');

//To retrieve checkout page
const checkoutPage = async (req, res) => {
    try {
        if (req.session.isUser) {
            const userId = req.session.userId;
            if(userId){

            
            const cartItems = await cartModel.find({ userId: userId }).populate('products.productId');

            let totalAmount = 0;
            cartItems.forEach(cartItem => {
                cartItem.products.forEach(product => {
                    totalAmount += product.productId.price * product.quantity;
                });
            });

            const userData = await userModel.findById({ _id: userId })
            res.render('user/checkoutPage', { userData, cartItems, totalAmount })
        }else{
            req.
            res.redirect('/user/login',{message:"please login to access checkout page."})
        }
        } else {
            res.redirect('/user/login')
        }
    } catch (error) {
        console.log('cartpage rendering error:', error.message);
    }

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