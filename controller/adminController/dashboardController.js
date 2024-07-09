const orderModel = require('../../models/order');


//dashboard
const dashboard = async(req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const todayOrders = await orderModel.find({
            dateOrdered: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        });
        console.log('today orders:',JSON.stringify(todayOrders))
        console.log('Orders fetched for today:', JSON.stringify(todayOrders, null, 2));
        res.render('admin/dashboard',{orderData : JSON.stringify(todayOrders)});
    } catch (error) {
        console.error('error while loading dashboard:',error);
        res.status(500).send('Server error');
    }
    
}


const chartUpdate = async(req, res)=> {
    try {
        console.log('here to update chart')
        const {date,month, year} = req.query;
        let query = {};

       
    } catch (error) {
        console.log('error in chart updation:',error.message);
    }
}
module.exports = {
    dashboard,
    chartUpdate
}