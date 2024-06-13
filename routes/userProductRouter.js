const express = require('express');
const productRouter = express.Router();
const userProductController = require('../controller/userProductController');
// const valid = require('../middleware/userValidation');
// const passport = require('passport')
// const adminValid = require('../middleware/adminValidation')
require('../config/passport')


//user routes
productRouter.get('/:productId',userProductController.productDetails);


module.exports =productRouter