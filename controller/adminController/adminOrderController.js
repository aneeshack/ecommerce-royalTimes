const orderModel = require('../../models/order');

// const orderList = async(req, res) => {
//     try {
       
//         const order = await orderModel.find()
//         console.log('order',order)
//         res.render('admin/adminOrderList',order)
//     } catch (error) {
//         console.log('orderlist page:',error.message)
//     }
  
// }
 
//admin getting all user orders
const orderList = async (req, res) => {
    try {
       const orderList = await orderModel.find()
       console.log('orderlistsare:',orderList);
   
        
        res.status(200).json({ success: true,  });
    } catch (error) {
        // res.status(500).json({ success: false, message: 'Server Error', error });
    }
};

module.exports = {
    orderList
}