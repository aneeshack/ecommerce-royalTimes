const mongoose =require('mongoose');

const addressSchema = new mongoose.Schema({
    street:String,
    city: String,
    state: String,
    pinCode : String,
    country:String
})


const loginSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    mobileNumber:{
        type:String,
        required:false,
    },
    gender: {
        type: String,
        required: false
    },
    profileImage: {
        type:String,
        required:false
    },
    password:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    },
    isActive:{
        type:Boolean,
        default:true
    },
    address:[addressSchema]
})



module.exports = mongoose.model('userLogin',loginSchema)
