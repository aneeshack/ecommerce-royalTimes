const productModel = require('../../models/product');
const productOffer = require('../../models/productOffer');
const productOfferModel = require('../../models/productOffer');

// showing product list
const productOfferList = async(req, res) => {
    try {
        console.log('Fetching product offer list');
        const products = await productModel.find().populate('offer');
        // const productOffer = await offerModel.find();
        console.log('product are:',products)

        res.render('admin/productOfferList', { products: products });
    } catch (error) {
        console.error("Error in getting product list:", error);
        res.render("admin/productOfferList");
    }
}

// product offer adding page
const addProductOfferPage = async(req, res) =>{
    try {
        const id = req.params.id;
        console.log('idI is:',id)
        const product = await productModel.findById(id)
        console.log('product is:',product)
        res.render('admin/addProductOffer',{product:product})
    } catch (error) {
        console.log('product offer adding page:',error.message);
    }
}

// product offer is updating by posting it
const addProductOffer = async(req, res) => {
    try {
        const productId= req.params.id;
        console.log('idI is:',productId)
        const {offerName,discountPercentage,startDate,endDate } = req.body
        console.log('datas:',req.body);
        const product = await productModel.findById(productId);
        const productOffer = new productOfferModel({
            products:productId,
            offerName,
            discountPercentage,
            startDate,
            endDate
        })
        const savedOffer  = await productOffer.save();
        console.log('offer is:,',savedOffer )

          // Update the product with the new offer reference
          const productSchemaUpdate = await productModel.findByIdAndUpdate(
            productId,
            { offer: savedOffer._id },
            { new: true }
        );

       
        res.redirect('/admin/product/offerList')
    } catch (error) {
        console.log('some errors in adding product offer:',error.message);
    }
}

const deleteProductOffer = async(req, res) => {
    try {
        const productId = req.params.id;
        console.log('cat',productId);
        console.log('deleting product offer')
        const ProductOffer = await productOfferModel.findByIdAndDelete(productId);
        console.log('products are:',productOffer);
        if(!ProductOffer){
            console.log('ProductOffer is not found')
            return res.status(400).json({error:'No product offer found'});
        }
        console.log('successfully deleted')
        res.status(200).json({success:'Your product offer deleted.'});
    } catch (error) {
       console.log('error while deleting product offer:',error.message); 
       return res.status(400).json({error:'error in deleting product offer.'})
    }
}


const editProductOfferPage = async(req, res) => {
    try {
        console.log('editing product offer')
        const productOfferId = req.params.id;
        console.log('product id:',productOfferId);
        const productOffer  = await productOfferModel.findById(productOfferId).populate('products');
        const products = await productModel.find();
        if (!productOffer) {
            return res.status(404).send('product offer not found');
        }
        res.render('admin/editProductOffer', {  productOffer, products});
    } catch (error) {
        console.log('error in product editpage rendering:',error.message);
    }
}

const editProductOffer = async(req, res) => {
    try {
        const productOfferId = req.params.id;
        console.log('product id is:',productOfferId);
        const { offerName, discountPercentage, startDate, endDate} = req.body;
        console.log('value in product offers are:',req.body);
        const updateOffer = await productOfferModel.findByIdAndUpdate(productOfferId,{
            products:productOfferId,
            offerName,
            discountPercentage,
            startDate,
            endDate
        },{ new: true })
        console.log('saved offer is:',updateOffer);
        console.log('edited successfully');
        req.flash('success',"offer edited successfully.");
        res.redirect('/admin/product/offerList')
    } catch (error) {
        console.log('error in editing product offer:',error.message);
        req.flash('error',"error in offer editing.");
        res.redirect('/admin/product/offerList')
    }
}


module.exports ={
    productOfferList,
    addProductOfferPage,
    addProductOffer,
    deleteProductOffer,
    editProductOfferPage,
    editProductOffer
    
}