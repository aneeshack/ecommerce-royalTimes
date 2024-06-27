const productModel = require('../../models/product')
const brandModel =  require('../../models/brand');
const categoryModel = require('../../models/category');

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
// const brandFilter = async (req, res) => {
//     try {
//         const brandId = req.query.brand;
//         console.log('brand id:', brandId)
//         const products = await productModel.find({ brand: brandId })
//             .populate('brand')
//             .populate('category');
//         console.log("products are for brand fetching:", products);
//         // res.render('user/categoryPage',{products} );
//         res.json({ products });
//     } catch (error) {
//         console.log('brandfilter error:', error.message)
//     }
// };

// api for filter by brands
// const categoryFilter = async (req, res) => {
//     try {
//         console.log('category')
//         const categoryId = req.query.category;
//         console.log('category id:', categoryId)
//         const products = await productModel.find({ category: categoryId })
//             .populate('brand')
//             .populate('category');
//         console.log("category are for brand fetching:", products);
//         // res.render('user/categoryPage',{products} );
//         res.json({ products });
//     } catch (error) {
//         console.log('category error:', error.message)
//     }
// };

//filter products based on category price and brand
const productFilter = async (req, res) => {
    try {
        console.log('hello this is product filter')
        const {brand , category, priceRange } = req.query;
        console.log('req.body is:',req.query)
        let filter ={};

        if(brand !=='undefined'){
            filter.brand = brand
            console.log('brand')
        }
        if(category!=='undefined'){
            filter.category = category
            console.log('category')
        }
        if(priceRange !=='undefined'){
            console.log('price')
            const[minPrice , maxPrice ] = priceRange.split('-').map(Number);
            console.log(minPrice,maxPrice)
            filter.price = {$gte:minPrice, $lte:maxPrice};
        }
        const products = await productModel.find(filter).populate('brand category')
        console.log('products according to filter :',products);
        
        res.status(200).json({products})

    } catch (error) {
        console.log('error in filtering:',error.message);
        res.status(500).send('Server error');
    }
}

module.exports = {
    categoryPage,
    // brandFilter,
    // categoryFilter,
    productFilter

}