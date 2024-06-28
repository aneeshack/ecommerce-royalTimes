require('dotenv').config();
const express = require('express');
const session = require('express-session');
const userRouter = require('./routes/userRouter');
const adminRouter = require('./routes/adminRouter')
const userProductRouter = require('./routes/userProductRouter');
const adminProductRouter = require('./routes/adminProductRouter');
const path = require('path');
// const bodyParser = require('body-parser');
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
  secret: process.env.session_secret,
  resave: false,
  saveUninitialized: false, 
  store: MongoStore.create({ mongoUrl: process.env.DB_URL }), 
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


app.use(express.json())
app.use(express.urlencoded({extended:true}))


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

// Set view engine and static files
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


// Catch-all route for 404 errors
app.use((req, res, next) => {
  res.status(404).render('404error');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('500error', { error: err.message });
});

const PORT = process.env.PORT||3000

app.listen(PORT,()=>{
    console.log(`server is running in the port http://localhost:${PORT}/user/home`)
})
