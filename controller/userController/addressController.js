const userModel = require('../../models/userModel');


const addressManage = async (req, res) => {
    try {
        if (req.session.isUser) {
            const userName = req.session.isUser;
            const userData = await userModel.findOne({ name: userName });
            const userAddress = userData.address;
            const userId = userData._id
            res.render('user/userAddress', { users: userAddress, editMode: false, userId ,userData});
        }
    } catch (error) {
        console.log('address page render:', error.message);
        res.status(404).render('404error', { status: 404, message: error.message });
    }

}


//adding user address
const addAddress = async (req, res) => {
    try {
        const user = req.session.isUser;
        console.log(user)
        const userData = await userModel.findOne({ name: user });
        if (userData) {
            const newAddress = {
                street: req.body.street,
                city: req.body.city,
                state: req.body.state,
                pinCode: req.body.pinCode,
                country: req.body.country
            };
            await userModel.findByIdAndUpdate(
                userData._id,
                { $push: { address: newAddress } },
                { new: true, userFindAndModify: false }
            );
            req.flash('success', 'New address added successfully.')
            res.redirect('/user/address')
        } else {
            console.log('user is not found');
        }
    } catch (error) {
        console.log('address update error:', error.message);
        res.status(500).render('404error', { status: 500, message: error.message });
    }
}


//render address editing page
const addressEditpage = async (req, res) => {
    try {

        if (req.session.isUser) {
            const addressId = req.params.id;
            const userName = req.session.isUser;
            const userData = await userModel.findOne({ name: userName });
            const userAddress = userData.address;
            const addressToEdit = userAddress.find(address => address._id.toString() === addressId);
            console.log(addressId)
            res.render('user/userAddress', { users: userAddress, editMode: true, addressToEdit, userData });
        }
    } catch (error) {
        console.log('render edit page:', error.message);
        res.status(500).render('404error', { message: error.message });
    }
}


//user editing address
const updateAddress = async (req, res) => {
    try {

        const addressId = req.params.id;
        const userName = req.session.isUser;
        await userModel.updateOne(
            { name: userName, 'address._id': addressId },
            {
                $set: {
                    "address.$.street": req.body.street,
                    "address.$.city": req.body.city,
                    "address.$.state": req.body.state,
                    "address.$.country": req.body.country,
                    "address.$.pinCode": req.body.pinCode
                }
            }
        )
        req.flash('success', 'Your address is updated successfully.')
        res.redirect('/user/address');

    } catch (error) {
        console.log('user editing address:', error.message);
        res.status(500).render('404error', { message: error.message });
    }
}


//deleting user address
const deleteAddress = async (req, res) => {
    try {

        const addressId = req.params.id;
        const userName = req.session.isUser;
        const user = await userModel.findOneAndUpdate(
            { name: userName },
            { $pull: { address: { _id: addressId } } },
            { new: true }
        );

        if (!user) {
            req.flash('error', 'User not found or address not found');
            return res.redirect('/user/address');
        }

        req.flash('success', 'address deleted successfully');
        res.redirect('/user/address');
    } catch (error) {
        console.log('delete address:', error.message);
        req.flash('error', 'some error occured while deleting address');
        res.redirect('/user/address')
    }
}


module.exports = {
    addressManage,
    addAddress,
    addressEditpage,
    updateAddress,
    deleteAddress,
}