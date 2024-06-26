const userModel = require("../models/userModel")


const isLogout = async(req,res,next)=>{
    try {
        if(!req.session.isUser){
          return res.redirect('/user/home')
        }
        next()
    } catch (error) {
        console.log(error.messasge)
    }
 }
    
    const isLogin =async(req,res,next)=>{
        try {
            
            if(req.session.isUser){
              return  res.redirect('/user/home')
            }
            next()
    
        } catch (error) {
            console.log(error.messasge)
        }
       
    }

    // const isActive = async(req, res, next) => {
    //     try {
    //         if(req.session.isUSer){
    //             const user = await userModel.find({name:req.session.isUSer})
    //             console.log('isactive:',user.isActive)
    //         }
    //     } catch (error) {
    //         console.log('middleware error:',error.messasge);
    //     }
    //  }
    module.exports ={
        isLogin,
        isLogout,
    }