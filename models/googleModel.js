const mongoose =require('mongoose');


const loginSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    image:{
        type:String,
        required:true
    },
    googleId:{
        type:String,
        required:true
    }
})



module.exports = mongoose.model('googleUser',loginSchema)
