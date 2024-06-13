require('dotenv').config();
const express = require('express');
const session = require('express-session');
const userRouter = require('./routes/userRouter');
const adminRouter = require('./routes/adminRouter')
const userProductRouter = require('./routes/userProductRouter');
const adminProductRouter = require('./routes/adminProductRouter')
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
require('./connection/mongooseConnect')
const sessionSecret = process.env.session_secret || 'default-secret-key';
const flash =require('connect-flash')
const methodOveride = require('method-override')
const adminValid = require('./middleware/adminValidation')
const app =express()
const MongoStore = require('connect-mongo');
const checkUser = require('./middleware/checkUser');
require('./config/passport');


app.use(session({
  secret: process.env.session_secret, // Replace 'your_secret_key' with your actual secret key
  resave: false,
  saveUninitialized: false, // Usually set to false to avoid storing unmodified sessions
  store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/RoyalTimes' }), // Replace with your actual MongoDB connection string
  cookie: { 
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
    httpOnly: true, // Helps prevent XSS attacks
    sameSite: 'strict' // Helps prevent CSRF attacks
  }
}));


app.use(passport.initialize());
app.use(passport.session());
app.use(checkUser);

//bodyparser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))


  app.use(methodOveride('_method'));
  app.use(flash());
  
  //midddleware to make flash messages available in views
  app.use((req, res, next) => {
    res.locals.successMessage = req.flash('success');
    res.locals.errorMessage = req.flash('error');
    next();
  });
  


 app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
});


//join paths
app.set('view engine','ejs')
app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'public/userHome')));
app.use(express.static(path.join(__dirname,'public/adminHome')));



//user
app.use('/user',userRouter)
app.use('/user/product',userProductRouter)

//admin
app.use('/admin',adminRouter)
app.use('/admin/product',adminProductRouter)


app.get('*',(req,res)=>{
    res.render('404error')
})


const PORT = process.env.PORT||3000

app.listen(PORT,()=>{
    console.log(`server is running in the port http://localhost:${PORT}/user/home`)
})
