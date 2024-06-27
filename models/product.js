const mongoose =require('mongoose');


const productSchema = new mongoose.Schema({
    productName:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true,
    },
    // images:{
    //     type:[String],
    //     required:true,
    //     validate:[arrayLimit,'you can pass only 3 images']
    // },
    images:{
        type:[String],

    },
    stock:{
        type:Number,
        required:true
    },
    warranty:{
        type:String,
        required:false
    },
    rating:{
        type:Number,
        required:true
    },
    brand:{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'brands'
    },
    category:{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'category'
    },
    watchType:{
        type:String,
        required:true
    },
    CaseMaterial:{
        type:String,
        required:true
    },
    dialColour:{
        type:String,
        required:true
    },
    strapMaterial:{
        type:String,
        required:true
    },
    ModelNumber:{
        type:String,
        required:true
    },
    features:{
        type:String,
        required:true
    },
    isActive:{
        type:Boolean,
        default:true
    }
})

function arrayLimit(val){
    return val.length <4;
}

module.exports = mongoose.model('product',productSchema)
