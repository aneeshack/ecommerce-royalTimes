const cartModel = require('../../models/cart');
const userModel = require('../../models/userModel');

//To retrieve checkout page
const checkoutPage = async (req, res) => {
    try {
        if (req.session.isUser) {
            const userId = req.session.userId;
            if (userId) {
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
            } else {
                res.redirect('/user/login', { message: "please login to access checkout page." })
            }
        } else {
            res.redirect('/user/login')
        }
    } catch (error) {
        console.log('cartpage rendering error:', error.message);
    }

}


//updating the phone number if it doesn't exist
const checkoutPageMobile = async (req, res) => {
    try {
        const userId = req.session.userId
        const { mobile } = req.body
        const userUpdate = await userModel.findById(userId)
        userUpdate.mobileNumber = mobile;
        await userUpdate.save()
        res.status(200).json({ success: "mobilenumber updated correctly", mobile })

    } catch (error) {
        console.log('mobile number update:', error.message);
        res.status(400).json({ error: 'fail to update mobile number' })
    }
};



//add address in checkout page
const checkoutAddressAdd = async (req, res) => {
    try {
        const { street, city, state, country, pinCode } = req.body;

        if (!street || !city || !pinCode || !state || !country) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const userId = req.session.userId
        const userData = await userModel.findById(userId)
        if (userData) {
            if (userData.address.length > 3) {
                res.status(400).json({ error: "Maximum of 3 address is allowed" })
                console.log('address length is high')
            } else {

                const newAddress = {
                    street: street,
                    city: city,
                    state: state,
                    pinCode: pinCode,
                    country: country
                };
                userData.address.push(newAddress)
                const userupdate = await userData.save();
                // const address = userupdate.address
                res.status(200).json({ message: ' Address added successfully', address :newAddress})
            }

        } else {
            console.log('user not find in database');
            res.status(400).json({ message: 'User is not found in the user data' });
        }
    } catch (error) {
        console.log("add address in checkout page:", error.message);
        res.status(400).json({ message: 'error while adding address' });
    }
}


//updating the address while checkout
const checkoutAddressEdit = async (req, res) => {
    try {

        const { addressId, street, city, state, country, pinCode } = req.body;
        
        if (!addressId || !street || !city || !state || !country || !pinCode) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const userId = req.session.userId
        const userData = await userModel.findById(userId)
        if (userData) {

            const address = userData.address.id(addressId);
            if (address) {
                address.street = street;
                address.city = city;
                address.state = state;
                address.country = country;
                address.pinCode = pinCode;

                await userData.save();

                res.json({ message: 'Address edited successfully!',address });
            } else {
                console.log('address not found');
                res.status(404).json({ error: 'Address not found' });
            }
        } else {
            console.log('user not found');
            res.status(400).json({ error: 'user not, found try again' })
        }
    } catch (error) {
        console.log('error in checkout address editing:', error.message);
        res.status(400).json({ error: 'Unable to edit address' })
    }
}


const checkoutOrder = async (req, res) => {

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
    checkoutPage,
    checkoutPageMobile,
    checkoutAddressAdd,
    checkoutAddressEdit,
    checkoutOrder,
    confirmation,
    orderList,
}