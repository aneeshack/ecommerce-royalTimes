const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URL)
.then(()=>{
    console.log('Database is connected successfully')
})
.catch((error)=>{
    console.log(error.message);
})