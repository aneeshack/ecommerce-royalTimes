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
            const userIds = userData._id.toString()
            res.render('user/checkoutPage', { userData, cartItems, totalAmount, userIds })
        }else{
            res.redirect('/user/login',{message:"please login to access checkout page."})
        }
        } else {
            res.redirect('/user/login')
        }
    } catch (error) {
        console.log('cartpage rendering error:', error.message);
    }

}

//add address in checkout page
const checkoutAddressAdd = async(req, res) => {
    try {
        const{number,street,city,state,country,pinCode } = req.body;
        
        const userId = req.session.userId
        const userData = await userModel.findById(userId)
        if(userData){
            
            userData.mobileNumber = number

            
            const newAddress = {
                street: street,
                city: city,
                state: state,
                pinCode: pinCode ,
                country: country
            };
           userData.address.push(newAddress)
           await userData.save();
            res.json({ success: true, message: 'Form submitted successfully' })
        }else{
            console.log('user not find in database');
            res.json({ message: 'User is not found in the user data' });
        }
    } catch (error) {
        console.log("add address in checkout page:",error.message);
    }
}

const confirmation = async (req, res) => {

    res.render('user/confirmation');
}

const orderList = async (req, res) => {
    // const userId = req.session.userId;
    // const cartItems = await cartModel.find({userId:userId}).populate('products')
    // console.log("cart items:",cartItems.products)
    try {
        if (req.session.isUser) {
            const user = req.session.isUser
            const userData = await userModel.findOne({ name: user });
            
        res.render('user/orderList',{userData})
        }else{
            res.redirect('/user/login')
        }
    } catch (error) {
        console.log('error in showing order list:',error.message);
    }
   
}

module.exports = {
    checkoutPage,
    confirmation,
    orderList,
    checkoutAddressAdd

}