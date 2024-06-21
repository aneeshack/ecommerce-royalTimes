const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userlogins',
        required: true
    },
    cartItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart',
        required: true
    },
    // shippingAddress: {
    //     type: String,
    //     required: true
    // },
    billingAddress: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'Pending'
    },
    totalPrice: {
        type: Number
    },
    paymentMethod: {
        type: String,
        required: true,
        // enum: ['COD', 'Razorpay', 'Credit Card', 'Debit Card', 'Net Banking', 'UPI'],
        // default: 'COD'
    },
    dateOrdered: {
        type:Date,
        default:Date.now
    }
  
});


// orderSchema.virtual('id').get(function(){
//     return this._id.toHexString();
// })
// orderSchema.set('toJSON',{
//     virtuals:true
// })

module.exports = mongoose.model('Order', orderSchema);
