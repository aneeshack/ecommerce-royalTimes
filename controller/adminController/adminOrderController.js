const orderModel = require('../../models/order');


 
//admin getting all user orders
const orderList = async (req, res) => {
    try {
       const order = await orderModel.find().populate('productItems.productId');
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

//product return management page
const returnManagement = async(req, res) => {
    try {
       
        const orderId = req.params.orderId;
    const productId = req.params.productId;
        const order =await orderModel.findOne({
            _id:orderId,
            'productItems._id':productId
        }).populate('productItems.productId');
       
       
        if(!order){
            console.log('order not found');
            return res.status(404).json({ message: 'Order not found' });
        }

        const product = order.productItems.find(item => item._id.toString() === productId)
        
        if(!product){
            console.log('product not found');
            return res.status(404).json({ message: 'Product not found in order' });
        }
        const productDetails = product.productId; 
        
    res.render('admin/returnProduct', {
        orderId: orderId,
        productId: productId,
        product:product,
        productDetails,
        imageUrl:productDetails.images[0]
        // Pass other necessary data to render the page
    });
    } catch (error) {
        console.log('error in return management:',error.message);
    }
}


//accepting the return request of the product
const acceptReturn = async(req, res ) => {
    try {
        
    const orderId = req.params.orderId;
    const productId = req.params.productId;

    const order =await orderModel.findOne({
        _id:orderId,
        'productItems._id':productId
    })

    if(!order){
        console.log('order not found');
        return res.status(404).json({ message: 'Order not found' });
    }

    const product = order.productItems.find(item => item._id.toString() === productId)
    if(!product){
        console.log('product not found');
        return res.status(404).json({ message: 'Product not found in order' });
    }
    
        product.status = 'return request accepted'
        await order.save();
        res.json({success: true})
    } catch (error) {
        console.log('error in accept return :',error.message);
    }
}


//product return request rejected
const rejectReturn = async(req, res ) => {
    try {
        
    const orderId = req.params.orderId;
    const productId = req.params.productId;

    const order =await orderModel.findOne({
        _id:orderId,
        'productItems._id':productId
    })

    if(!order){
        console.log('order not found');
        return res.status(404).json({ message: 'Order not found' });
    }

    const product = order.productItems.find(item => item._id.toString() === productId)

    if(!product){
        console.log('product not found');
        return res.status(404).json({ message: 'Product not found in order' });
    }
        product.status = 'return request rejected'
        await order.save();
        res.json({success: true})

    } catch (error) {
        console.log('error in accept return :',error.message);
    }
}


module.exports = {
    orderList,
    orderStatus,
    returnManagement,
    acceptReturn,
    rejectReturn
}