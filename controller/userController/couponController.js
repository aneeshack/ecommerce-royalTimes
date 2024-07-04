
const couponPage = async(req, res) => {
    try {
        
        res.render('user/coupon')
    } catch (error) {
        console.log('error in coupon listing:',error.message);
    }
}


module.exports ={
    couponPage
}