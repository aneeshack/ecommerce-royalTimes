const userModel = require('../../models/userModel');
const cartModel = require('../../models/cart')
const orderModel = require('../../models/order');
const productModel = require('../../models/product');
const productReturn = require('../../models/returnProduct')
// const razorpayService = require('../../helpers/razorpay');
const mongoose = require('mongoose')
const Razorpay = require('razorpay');

// create a instance for razopay
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_ID_KEY,
    key_secret: process.env.RAZORPAY_SECRET_KEY
});


//placing product order
const placeOrder = async (req, res) => {
    try {
        const userId = req.session.userId;
        const { mobileNumber, addressId, paymentMethod, totalAmount, cartItemID } = req.body;
        console.log('totalamount:',totalAmount,typeof(totalAmount))
        const userData = await userModel.findById(userId);
        if (!userData) {
            console.log('User not found');
            return res.status(400).json({ error: 'User not found' });
        }

        const selectedAddress = userData.address.find(addr => addr._id.toString() === addressId);
        if (!selectedAddress) {
            console.log('Please select one address to continue');
            return res.status(400).json({ error: 'Please select one address to continue' });
        }

        if (!mobileNumber) {
            console.log('Please enter mobile number to continue');
            return res.status(400).json({ error: 'Please enter mobile number to continue' });
        }

        if (!cartItemID) {
            console.log('There are no cart items for ordering');
            return res.status(400).json({ error: 'There are no cart items for ordering' });
        }

        const cart = await cartModel.findById(cartItemID).populate('products.productId');
        if (!cart) {
            console.log('Cart not found');
            return res.status(400).json({ error: 'Cart not found' });
        }

        if (!paymentMethod) {
            return res.status(400).json({ error: 'Please select one payment method to continue' });
        }

        let paymentDetails = {};
        if (paymentMethod === 'Razorpay') {
            const options = {
                        amount: totalAmount * 100, // amount in the smallest currency unit
                        currency: 'INR',
                        receipt: `order_rcptid_${userId}`,
                        payment_capture: 1
                    };
                   
                    razorpayOrder = await razorpayInstance.orders.create(options);
                    return res.status(200).json({ success: ' razorpay payment placed successfully', razorpayOrderId: razorpayOrder.id });
                

        } else if(paymentMethod === 'COD' || paymentMethod === 'Wallet'){
            if (paymentMethod === 'Wallet') {
                console.log('inside wallet')
                console.log('wallet amount:',userData.wallet,typeof(userData.wallet))
                const walletBalance = userData.wallet || 0;
                if (walletBalance >= totalAmount) {
                    console.log('sufficient balance in wallet')
                    userData.wallet -= totalAmount;
                    await userData.save();
                    paymentDetails = {
                        paymentMethod: 'Wallet',
                        paymentStatus: 'success',
                        
                    };
                    console.log('wallet amouont in paymentdetails is:',paymentDetails.paymentMethod)
                } else {
                    console.log('wallet amount is not enough')
                    return res.status(400).json({ error: 'Insufficient wallet balance.' });
                }
            }else{
                console.log('enter in to cod')
            paymentDetails = {
                paymentMethod: 'COD',
                paymentStatus: 'pending',
            };
        } 
         // Map cart items to order items
         const productItems = cart.products.map(product => ({
            productId: product.productId._id,
            productName: product.productId.productName,
            quantity: product.quantity,
            total: product.total
        }));
        console.log('details sin productitems:',productItems)
        // if cod save the data
        const newOrder = new orderModel({
            userId: userId,
            productItems: productItems,
            billingAddress: selectedAddress,
            phone: mobileNumber,
            paymentMethod: paymentDetails.paymentMethod,
            totalPrice: totalAmount
        });

        await newOrder.save();
        console.log('new order created')
        for (const item of productItems) {
            await productModel.findByIdAndUpdate(
                item.productId,
                { $inc: { stock: -item.quantity } },
                { new: true }
            );
        }
        req.session.newOrder = newOrder._id.toString();

        //  to clear the cart
        await cartModel.deleteOne({ _id: cartItemID });
        res.status(200).json({ success: 'Order placed successfully',walletPaymentStatus:paymentDetails.paymentStatus });
    


        } 
           
    } catch (error) {
        console.log('Error in placing order:', error.message);
        res.status(400).json({ error: 'Some errors occurred while placing the order, try again' });
    }
};

// const placeOrder = async (req, res) => {
//     try {
//         const userId = req.session.userId;
//         const { mobileNumber, addressId,  paymentDetails.aymentMethod, totalAmount, cartItemID } = req.body;

//         const userData = await userModel.findById(userId);
//         if (!userData) {
//             console.log('User not found');
//             return res.status(400).json({ error: 'User not found' });
//         }

//         const selectedAddress = userData.address.find(addr => addr._id.toString() === addressId);
//         if (!selectedAddress) {
//             console.log('Please select one address to continue');
//             return res.status(400).json({ error: 'Please select one address to continue' });
//         }

//         if (!mobileNumber) {
//             console.log('Please enter mobile number to continue');
//             return res.status(400).json({ error: 'Please enter mobile number to continue' });
//         }

//         if (!cartItemID) {
//             console.log('There are no cart items for ordering');
//             return res.status(400).json({ error: 'There are no cart items for ordering' });
//         }

//         const cart = await cartModel.findById(cartItemID).populate('products.productId');
//         if (!cart) {
//             console.log('Cart not found');
//             return res.status(400).json({ error: 'Cart not found' });
//         }

//         if (!paymentMethod) {
//             return res.status(400).json({ error: 'Please select one payment method to continue' });
//         }

//         let razorpayOrder = null;
//         if (paymentMethod !== 'COD') {
//             const options = {
//                 amount: totalAmount * 100, // amount in the smallest currency unit
//                 currency: 'INR',
//                 receipt: `order_rcptid_${userId}`,
//                 payment_capture: 1
//             };
           
//             razorpayOrder = await razorpayInstance.orders.create(options);
//             return res.status(200).json({ success: 'payment placed successfully', razorpayOrderId: razorpayOrder.id });

//         } else {
//             // Map cart items to order items
//             const productItems = cart.products.map(product => ({
//                 productId: product.productId._id,
//                 productName: product.productId.productName,
//                 quantity: product.quantity,
//                 total: product.total
//             }));
//             // if cod save the data
//             const newOrder = new orderModel({
//                 userId: userId,
//                 productItems: productItems,
//                 billingAddress: selectedAddress,
//                 phone: mobileNumber,
//                 paymentMethod: paymentMethod,
//                 totalPrice: totalAmount
//             });

//             await newOrder.save();
//             for (const item of productItems) {
//                 await productModel.findByIdAndUpdate(
//                     item.productId,
//                     { $inc: { stock: -item.quantity } },
//                     { new: true }
//                 );
//             }
//             req.session.newOrder = newOrder._id.toString();

//             //  to clear the cart
//             await cartModel.deleteOne({ _id: cartItemID });
//             res.status(200).json({ success: 'Order placed successfully with COD' });
//         }
//     } catch (error) {
//         console.log('Error in placing order:', error.message);
//         res.status(400).json({ error: 'Some errors occurred while placing the order, try again' });
//     }
// };

//redirecting while payment done through razorpay
const paymentOrder = async (req, res) => {
    try {
        const userId = req.session.userId;

        const paymentData= req.body;
        const orderData = paymentData.orderData;
        const { mobileNumber, addressId, paymentMethod, cartItemID, totalAmount } = orderData;
        const { orderId, paymentId, razorpayOrderId, amount } = paymentData;

        const userData = await userModel.findById(userId);
        const selectedAddress = userData.address.find(addr => addr._id.toString() === addressId);
        const cart = await cartModel.findById(cartItemID).populate('products.productId');

        const productItems = cart.products.map(product => ({
            productId: product.productId._id,
            productName: product.productId.productName,
            quantity: product.quantity,
            total: product.total
        }));

        const newOrder = new orderModel({
            userId: userId,
            productItems: productItems,
            billingAddress: selectedAddress,
            phone: mobileNumber,
            paymentMethod: paymentMethod,
            totalPrice: totalAmount,


        });

        await newOrder.save();

        // Decrease the quantity of each product in the order
        for (const item of productItems) {
            await productModel.findByIdAndUpdate(
                item.productId,
                { $inc: { stock: -item.quantity } },
                { new: true }
            );
        }
        req.session.newOrder = newOrder._id.toString();
        //  to clear the cart
        await cartModel.deleteOne({ _id: cartItemID });
        res.status(200).json({ success: 'Order placed successfully with razorpay' });


    } catch (error) {
        console.log('some error while updating the payment:', error.message);
        res.status(400).json({ error: 'Error in placing razorpay.' })
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
        // await cartModel.deleteOne({userId})

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
            const order = await orderModel.find({ userId }).populate('productItems.productId');;

            res.render('user/orderList', { order, userData })
        } else {
            res.redirect('/user/login')
        }
    } catch (error) {
        console.log('error in showing order list:', error.message);
    }

}

//api for cancel the products
const orderCancel = async (req, res) => {
    try {
        console.log('order cancel')
        const { orderId, productId } = req.params;
        const userId = req.session.userId;
        const order = await orderModel.findById(orderId);
        
        if (order) {
            const productUpdate = order.productItems.find(item => item.productId.toString() === productId);
            if (productUpdate) {
                console.log('productupdate:',productUpdate.total)
            
                const updatedProduct = await productModel.findByIdAndUpdate(
                    productId,
                    { $inc: { stock: productUpdate.quantity } },
                    { new: true }
                )

                // Update the status of the product in productItems array
                productUpdate.status = 'Cancelled';
                await order.save();


                if (order.paymentMethod === 'Razorpay') {
                    const total = productUpdate.total;
                    const userData = await userModel.findById(userId);
                    userData.wallet += total;
                    await userData.save();
                }
               
                res.status(200).json({ message: 'Order and product updated successfully', order });
            } else {
                console.log('products not found in order schema:')
                return res.status(404).json({ message: 'product not found in the order.' })
            }
        } else {
            console.log('order is not found')
            return res.status(404).json({ message: 'order not found.' })

        }
    } catch (error) {
        console.log('error in cancel order:', error.message);
        res.status(400).json({ message: 'error occured while cancelling the order' })
    }
}

// product returning request
const returnProduct = async (req, res) => {
    try {
        console.log('return ing product')
        const { orderId, productId, returnReason } = req.body;
        console.log('values are obtaining in body:', req.body);

        const order = await orderModel.findById(orderId);
        if (!order) {
            console.log('order is not found')
            return res.status(404).json({ message: 'order not found.' })
        }

        const productUpdate = order.productItems.find(item => item.productId.toString() === productId);
        if (!productUpdate) {
            console.log('products not found in order schema:')
            return res.status(404).json({ message: 'product not found in the order.' })
        }

        productUpdate.status = 'Return Requested';
        productUpdate.returnReason = returnReason;
        await order.save();


        res.json({ success: true });
    } catch (error) {
        console.log('error occured while return a product:', error.message);
        res.status(400).json({ error: 'Failed to submit the return request.' })
    }
}


module.exports = {
    placeOrder,
    confirmation,
    orderList,
    orderCancel,
    returnProduct,
    paymentOrder
}