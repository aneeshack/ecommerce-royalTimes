const couponModel = require('../../models/coupon')


// show coupons list
const couponList = async (req, res) => {
    try {

        const coupons = await couponModel.find();
        const couponUpdate = coupons.map(coupon => ({
            ...coupon._doc,
            expiryDate: coupon.expiryDate.toISOString().split('T')[0]
        }));
        res.render('admin/coupons', { coupons: couponUpdate });

    } catch (error) {
        console.log('Some error occured in coupon:', error);
        res.render('admin/coupons', { error: 'some error in coupon list.' });
    }
}

//rendering coupon adding page
const addCoupon = async (req, res) => {
    res.render('admin/addCoupon', { coupon: {}, editMode: false })
}

//coupon editing page
const editCoupon = async (req, res) => {
    const couponId = req.params.id;
    const coupon = await couponModel.findById(couponId);
    if (!coupon) {
        req.flash('error', 'coupon is not found.');
        res.redirect('/admin/coupons');
    } else {
        res.render('admin/addCoupon', { coupon, editMode: true })
    }
}


//updating coupon
const updateCoupon = async (req, res) => {
    try {
        const id = req.params.id;
        const { description, code, status, maxDiscount, usageLimitPerUser, maxCount, expiryDate, discountPercentage } = req.body;

        //update category fields
        const updatedCoupon = await couponModel.findByIdAndUpdate(id, {
            description,
            code,
            status,
            maxDiscount,
            usageLimitPerUser,
            maxCount,
            expiryDate,
            discountPercentage
        }, { new: true });

        if (!updatedCoupon) {
            req.flash('error', 'coupon not found.');
            return res.redirect('/admin/coupons')
        }

        req.flash('success', 'successfully edited the coupon.')
        res.redirect('/admin/coupons')
    } catch (error) {
        console.log('editing coupon:', error.message);
        req.flash('error', 'An error occured while editing the coupon');
        res.redirect('/admin/coupons')
    }

}

//creating a coupon 
const createCoupon = async (req, res) => {
    const { description, code, status, maxDiscount, usageLimitPerUser, maxCount, expiryDate, discountPercentage } = req.body;

    try {
        const newCoupon = new couponModel({
            description,
            code,
            status,
            maxDiscount,
            usageLimitPerUser,
            maxCount,
            expiryDate,
            discountPercentage
        });

        await newCoupon.save();
        req.flash('success', 'coupon added successfully.')
        res.redirect('/admin/coupons'); // Redirect to the list of coupons or some confirmation page
    } catch (err) {
        console.error(err);
        req.flash('error', 'Error adding coupon.');
        res.redirect('/admin/addcoupon'); // Redirect back to the form in case of error
    }

}


const deleteCoupon = async (req, res) => {
    try {

        const coupon = await couponModel.findByIdAndDelete(req.params.id)
        if (!coupon) {
            req.flash('error', "Error in finding the couponId.");
            return res.redirect('/admin/coupons')
        }
        req.flash('success', 'The coupon is deleted successfully');
        res.redirect('/admin/coupons')
    } catch (error) {
        console.log("delete coupon error:", error.message);
        req.flash('error', "Error in deleting coupon.");
        res.redirect('/admin/coupons')
    }
}


module.exports = {
    couponList,
    addCoupon,
    createCoupon,
    deleteCoupon,
    editCoupon,
    updateCoupon
}