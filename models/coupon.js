const mongoose =require('mongoose');


const couponSchema = new mongoose.Schema({
    description:{
      type:String,
      required:true
    },
    code: { 
      type: String, 
      required: true, 
      unique: true 
    },
  status: { 
    type: String, 
    required: true,
    enum: ['active', 'expired'] 
    },
  maxDiscount: { 
    type: String, 
    required: true 
    },
  usageLimitPerUser: {
    type: Number, 
    required: true 
    },
  maxCount: { 
    type: Number, 
    required: true 
    },
  expiryDate: { 
    type: Date,   
    required: true 
    },
  discountPercentage: { 
    type: Number, 
    required: true 
    }
})



module.exports = mongoose.model('coupons',couponSchema)
