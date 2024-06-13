

 const isAdmin = async(req,res,next)=>{
    try {
        if(req.session.admin){
          return next()
        }
       return res.redirect("/admin")
    } catch (error) {
        console.log(error.messasge)
    }
 }

    
    module.exports ={
        isAdmin
    }