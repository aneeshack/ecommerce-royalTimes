const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userlogins',
        required: true
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'product',
                required : true
            },
            quantity: {
                type: Number,
                required : true
            },
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },

});

module.exports = mongoose.model('Order', orderSchema);
