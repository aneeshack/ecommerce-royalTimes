const productModel = require('../models/product')
const brandModel =  require('../models/brand');
const categoryModel = require('../models/category');

// render the page containing all the products 
const categoryPage = async (req, res) => {
    try {
        const category = await categoryModel.find();
        const brands = await brandModel.find();
        const products = await productModel.find().populate('brand');
        res.render('user/categoryPage', { category, brands, products });

    } catch (error) {
        console.log('loading category page by user:', error.message);
    }
}

// api for filter by brands
const brandFilter = async (req, res) => {
    try {
        const brandId = req.query.brand;
        console.log('brand id:', brandId)
        const products = await productModel.find({ brand: brandId })
            .populate('brand')
            .populate('category');
        console.log("products are for brand fetching:", products);
        // res.render('user/categoryPage',{products} );
        res.json({ products });
    } catch (error) {
        console.log('brandfilter error:', error.message)
    }
};

// api for filter by brands
const categoryFilter = async (req, res) => {
    try {
        console.log('category')
        const categoryId = req.query.category;
        console.log('category id:', categoryId)
        const products = await productModel.find({ category: categoryId })
            .populate('brand')
            .populate('category');
        console.log("category are for brand fetching:", products);
        // res.render('user/categoryPage',{products} );
        res.json({ products });
    } catch (error) {
        console.log('category error:', error.message)
    }
};


module.exports = {
    categoryPage,
    brandFilter,
    categoryFilter

}