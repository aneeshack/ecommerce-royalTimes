const mongoose = require('mongoose');


const CartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'userlogins'
  },
  products:
    [{
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
      },
      quantity: {
        type: Number,
        default: 1
      },
    }],

  totalAmount: {
    type: Number,
  },
});

module.exports = mongoose.model('Cart', CartSchema);
