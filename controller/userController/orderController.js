const userModel = require('../../models/userModel');
const cartModel = require('../../models/cart')
const orderModel = require('../../models/order');
const mongoose = require('mongoose')

//placing product order
const placeOrder = async (req, res) => {
    try {
        const userId = req.session.userId;

        const { mobileNumber, addressId, paymentMethod, totalAmount, cartItemID } = req.body;

        console.log('req.body datas', mobileNumber, addressId, paymentMethod, totalAmount, cartItemID)
        const userData = await userModel.findById(userId);
        if (userData) {
            const selectedAddress = userData.address.find(addr => addr._id.toString() === addressId);
            if (selectedAddress) {
                if (mobileNumber) {
                    if (cartItemID) {

                        const cart = await cartModel.findById(cartItemID).populate('products.productId');
                        if (!cart) {
                            console.log('Cart not found');
                            return res.status(400).json({ error: 'Cart not found' });
                        }

                        // Map cart items to order items
                        const productItems = cart.products.map(product => ({
                            productId: product.productId._id,
                            productName: product.productId.productName,
                            quantity: product.quantity,
                            total: product.total
                        }));

                        if (paymentMethod) {
                            const newOrder = new orderModel({
                                userId: userId,
                                productItems: productItems,
                                billingAddress: selectedAddress,
                                phone: mobileNumber,
                                paymentMethod: paymentMethod,
                                totalPrice: totalAmount

                            });

                            await newOrder.save();
                            console.log('order :',newOrder._id.toString())
                            req.session.newOrder = newOrder._id.toString()
                            // await cartModel.deleteOne({ userId: userId });
                            console.log('order placed successfully')
                            res.status(200).json({ success: 'Order placed successfully' });

                        } else {
                            console.log('please select one payment method to continue');
                            res.status(400).json({ error: 'please select one payment method to continue' })
                        }
                    } else {
                        console.log('There is no cart items for ordering');
                        res.status(400).json({ error: 'There is no cart items for ordering' })

                    }
                } else {
                    console.log('please enter mobile number continue');
                    res.status(400).json({ error: 'please enter mobile number continue' })
                }
            } else {
                console.log('please select one address to continue');
                res.status(400).json({ error: 'please select one address to continue' })
            }
        } else {
            console.log('user is not found');
            res.status(400).json({ error: 'user not found' })
        }

    } catch (error) {
        console.log('error in checkout order:', error.message);
        res.status(400).json({ error: 'some errors in placing order,try agian' })
    }
}


//render confirmation page
const confirmation = async (req, res) => {
    try {
        const userId = req.session.userId;       
        const orderId = req.session.newOrder 
        const order = await orderModel.findById(orderId)
      
        if (!order) {
            console.log('no order found')
            res.status(404).json('Order not found');

        }
        res.render('user/confirmation', { order });
        //delete cartmodel after place order
        await cartModel.deleteOne({userId})
        
        req.session.newOrder = null;
    } catch (error) {
        console.log('rendering confirmation page failed:', error.message);

    }

}


//showing all the order of the user
const orderList = async (req, res) => {
    try {
        if (req.session.isUser) {
            const userId = req.session.userId;
            const userData = await userModel.findOne({ name: req.session.isUser });
            const order = await orderModel.find({userId});
            console.log('order list,', order)
            order.forEach(ord=>{
                console.log('products:',ord.productItems)
            })
            res.render('user/orderList', { order, userData })
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