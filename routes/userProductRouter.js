const express = require('express');
const productRouter = express.Router();
const valid = require('../middleware/userValidation');
const userProductController = require('../controller/userController/userProductController');
require('../config/passport')


//user routes
productRouter.get('/:productId',valid.isLogout,userProductController.productDetails);



module.exports =productRouter