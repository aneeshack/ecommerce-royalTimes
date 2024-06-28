const productModel = require('../../models/product')
const brandModel = require('../../models/brand');
const categoryModel = require('../../models/category');

// render the page containing all the products 
const categoryPage = async (req, res) => {
    try {
        const category = await categoryModel.find();
        const brands = await brandModel.find();
        const products = await productModel.find({ isActive: true }).populate('brand');
        res.render('user/categoryPage', { category, brands, products });

    } catch (error) {
        console.log('loading category page by user:', error.message);
    }
}


//filter products based on category price and brand
const productFilter = async (req, res) => {
    try {
        const { brand, category, priceRange } = req.query;
        let filter = {};

        if (brand !== 'undefined') {
            filter.brand = brand
            console.log('brand')
        }
        if (category !== 'undefined') {
            filter.category = category
            console.log('category')
        }
        if (priceRange !== 'undefined') {
            console.log('price')
            const [minPrice, maxPrice] = priceRange.split('-').map(Number);
            console.log(minPrice, maxPrice)
            filter.price = { $gte: minPrice, $lte: maxPrice };
        }
        const products = await productModel.find(filter).populate('brand category')
        console.log('products according to filter :', products);

        res.status(200).json({ products })

    } catch (error) {
        console.log('error in filtering:', error.message);
        res.status(500).send('Server error');
    }
}

//searching products 
const searchProduct = async (req, res) => {
    try {
        const searchQuery = req.query.query;
        if (!searchQuery) {
            return res.json({ products: [] })
        }
        
        const products = await productModel.find({ productName: { $regex: '^' + searchQuery, $options: 'i' } });
        res.status(200).json({ products });

    } catch (error) {
        console.log('searching product error:', error.message);
        res.status(400).json({ error: 'Internal server Error' })
    }
}

module.exports = {
    categoryPage,
    productFilter,
    searchProduct

}