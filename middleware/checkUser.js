function checkUser (req, res, next) {
    if(req.session  && req.session.isUser){
        res.locals.user = req.session.isUser;
    }else{
        res.locals.user = null;
    }
    next();
}


module.exports = checkUser;