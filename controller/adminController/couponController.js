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
        const { couponName, couponCode, startDate, expiryDate, discountPercentage, maxDiscount, maxAmount } = req.body;
        console.log('details',req.body)
        //update category fields
        const updatedCoupon = await couponModel.findByIdAndUpdate(id, {
            couponName,
            couponCode,
            startDate,
            expiryDate,
            discountPercentage,
            maxDiscount,
            maxAmount
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

// adding new coupon
const createCoupon = async (req, res) => {
    const { couponName, couponCode, startDate, expiryDate, discountPercentage, maxDiscount,maxAmount } = req.body;
    console.log('details',req.body)
    try {
        const newCoupon = new couponModel({
            couponName,
            couponCode,
            startDate,
            expiryDate,
            discountPercentage,
            maxDiscount,
            maxAmount
        });

        await newCoupon.save();
        console.log('product added successfully')
        req.flash('success', 'coupon added successfully.')
        res.redirect('/admin/coupons'); 
    } catch (err) {
        console.error(err);
        req.flash('error', 'Error adding coupon.');
        res.redirect('/admin/addcoupons');
    }

}

// delete one coupon
const deleteCoupon = async (req, res) => {
    try {
        console.log('deleted coupon')
        const coupon = await couponModel.findByIdAndDelete(req.params.id)
        if (!coupon) {
            console.log("delete coupon error:", error.message);
            res.status(400).json({error: 'coupon not find.'})
        }
        console.log('deleted successfully')
        res.status(200).json({success: 'coupon deleted successfuly'})
    } catch (error) {
        console.log("delete coupon error:", error.message);
        res.status(400).json({error: 'error in coupon deleting.'})
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