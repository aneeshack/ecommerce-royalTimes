const couponModel = require('../../models/coupon')
const orderModel = require('../../models/order');

//showing coupons showing page
const couponPage = async(req, res) => {
    try {
        const userId = req.session.userId;
        const currentDate = new Date(); 
        // const coupons = await couponModel.find();
        const coupons = await couponModel.find({
            startDate: { $lte: currentDate }
        });
        console.log('showing all the coupons:',coupons)
        res.render('user/coupon',{coupons});
    } catch (error) {
        console.log('error in coupon listing:',error.message);
    }
}

//validate if coupon is applicable for the user
const applyCoupon = async(req, res) => {
    try {
        const userId = req.session.userId;
        const { couponCode, totalAmount } = req.body;
        console.log('coupon code and total:',req.body);
        const coupons = await couponModel.findOne({ couponCode: couponCode });
        console.log('coupon:',coupons)
        if(coupons){
            if(totalAmount  >= coupons.maxAmount){
                const discountAmount = Math.floor(totalAmount*(coupons.discountPercentage/100));
                const newTotal = totalAmount-discountAmount;

                console.log('discouont amount is:',discountAmount,'new total is :',newTotal);
                res.status(200).json({success:'coupon added successfully',discountAmount, newTotal});
        
            }else{
                console.log('coupon code not matching');
                return  res.status(400).json({error: 'coupon code is not applicable to you.'});
        
            }
        }else{
            console.log('coupon code not matching');
            return  res.status(400).json({error: 'coupon code is not matching.'});
        }
      
    } catch (error) {
        console.log('error in applying coupon');
    }
}


// const applyCoupon = async(req, res) => {
//     try {
//         const userId = req.session.userId;
//         const { couponCode, totalAmount } = req.body;
//         console.log('coupon code and total:',req.body);
//         const coupons = await couponModel.findOne({ couponCode: couponCode });
//         if(!coupons){
//             console.log('coupon code not matching');
//           return  res.status(400).json({error: 'coupon code is not available now.'});
//         }

//         if(totalAmount  < coupons.maxAmount){
//             console.log('coupon code not matching');
//             return  res.status(400).json({error: `coupon code is available for amount greater than ${coupons.maxAmount}.`});
//         }


//         const discountAmount = Math.floor(totalAmount*(coupons.discountPercentage/100));
//         const newTotal = totalAmount-discountAmount;

//         console.log('discouont amount is:',discountAmount,'new total is :',newTotal);

//         res.status(200).json({success:'coupon added successfully',discountAmount, newTotal});

//     } catch (error) {
//         console.log('error in applying coupon');
//     }
// }

module.exports ={
    couponPage,
    applyCoupon
}