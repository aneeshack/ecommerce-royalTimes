

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

    module.exports ={
        isLogin,
        isLogout,
    }