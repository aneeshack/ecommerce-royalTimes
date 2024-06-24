const userModel = require('../../models/userModel');
const orderModel = require('../../models/order');


//placing product order
const placeOrder = async (req, res) => {
    try {
     console.log('checkoutorder is working')
     const userId = req.session.userId;

     const {  mobileNumber, addressId, paymentMethod,  totalAmount,cartItemID } = req.body;
   
     console.log('req.body datas',mobileNumber, addressId, paymentMethod,  totalAmount,cartItemID)
     console.log('type of mobilenumber:',typeof(mobileNumber))
     const userData = await userModel.findById(userId);
     if(userData){
        const selectedAddress = userData.address.find(addr => addr._id.toString() === addressId);
        if(selectedAddress){
            if(mobileNumber){
                if(paymentMethod ){
                    const newOrder = new orderModel({
                        userId: userId,
                        cartItemId :cartItemID,
                        billingAddress: selectedAddress,
                        phone :mobileNumber,
                        paymentMethod: paymentMethod,
                        totalPrice: totalAmount
                
                    });
                
                    await newOrder.save();
                    console.log('order placed successfully')
                    res.status(200).json({ success: 'Order placed successfully' });
                }else{
                    console.log('please select one payment method to continue');
                    res.status(400).json({error:'please select one payment method to continue'})
                }
            }else{
                console.log('please enter mobile number continue');
                res.status(400).json({error:'please enter mobile number continue'})
            }
        }else{
            console.log('please select one address to continue');
            res.status(400).json({error:'please select one address to continue'})
        }
     }else{
        console.log('user is not found');
        res.status(400).json({error: 'user not found'})
     }
    
    } catch (error) {
     console.log('error in checkout order:',error.message);
     res.status(400).json({error:'some errors in placing order,try agian'})
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

            res.render('user/orderList', { userData })
        } else {
            res.redirect('/user/login')
        }
    } catch (error) {
        console.log('error in showing order list:', error.message);
    }

}
 module.exports = {
    placeOrder,
    confirmation,
    orderList
 }