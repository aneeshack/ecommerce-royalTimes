const orderModel = require('../../models/order');


 
//admin getting all user orders
const orderList = async (req, res) => {
    try {
       const order = await orderModel.find()
       console.log('orderlistsare:',order);
   
        res.render('admin/adminOrderList',{order})
        // res.status(200).json({ success: true,  });
    } catch (error) {
       console.log('order list error:',error.message)
    }
};

//admin changing order status
const orderStatus = async(req, res) => {
    try {
        const { orderId, productId, status } =req.body
        console.log('req.body:',req.body)
        const orderUpdate = await orderModel.updateOne(
            {_id:orderId , 'productItems._id':productId},
            { $set : {'productItems.$.status' :status}}
        )
        const order = await orderModel.findOne({_id:orderId })
        console.log('update order:',order)
        res.status(200).json({success:true,message:'status updated successfully'})
    } catch (error) {
        console.log('order status changing error:',error.message);
        res.status(400).json({success:false,message:'error occured while updating status'})
    }
  

}


module.exports = {
    orderList,
    orderStatus
}