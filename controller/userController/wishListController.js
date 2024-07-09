const productModel = require('../../models/product');
const wishlistModel = require('../../models/wishList');


//wishlist page showing
const wishList = async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.redirect('/user/login', { message: "Please log in to view your wishlist." });
        }
        const wishlist = await wishlistModel.findOne({ userId }).populate('products');

        if (!wishlist || wishlist.products.length === 0) {
            return res.render('user/wishList', { wishlists: [] });
        }

        res.render('user/wishList', { wishlists: [wishlist] });
    } catch (error) {
        console.log('error in wishlist page:', error.message)
    }
}



// product added to wishlist
const wishProduct = async (req, res) => {
    try {

        const { productId } = req.body;
        const userId = req.session.userId;


        //find if the user already have wishlist
        let wishList = await wishlistModel.findOne({ userId })
        if (wishList) {

            if (wishList.products.includes(productId)) {

                // if product already exist in the wishlist just remove it 
                const remove = await wishlistModel.updateOne({ userId }, { $pull: { products: productId } });


                //    check if any products in the wishlist
                const wishListNew = await wishlistModel.findOne({ userId });
                if (!wishListNew || wishListNew.products.length === 0) {
                    // if no products in wishlist just remove it
                    await wishlistModel.deleteOne({ userId });
                }
                res.json({ message: 'product removed from the wishlist' });
            } else {
                wishList.products.push(productId);
                await wishList.save();


                console.log('product added to wishlist');
                res.json({ message: 'product added to wishlist successfully' });
            }
        } else {
            const newWishlist = new wishlistModel({
                userId,
                products: [productId]
            })
            await newWishlist.save();

            res.json({ message: ' product added to the wishlist successfully' });
        }

    } catch (error) {
        console.log('error in add to wish list: ', error.message);
        res.status(500).json({ message: 'Error adding product to wishlist' });
    }
}


// delete item in wishlist
const deleteWish = async (req, res) => {
    try {
        console.log('entered to delete wishlist api')
        const productId = req.params.id;
        const userId = req.session.userId;

        console.log('productid is getting:', productId);

        const remove = await wishlistModel.updateOne({ userId }, { $pull: { products: productId } });

        //   product model making wishlist into false
        await productModel.findByIdAndUpdate(productId,
            { isWishlist: false },
            { new: true }
        )

        const wishListNew = await wishlistModel.findOne({ userId });
        if (!wishListNew || wishListNew.products.length === 0) {

            // if no products in wishlist just remove it
            await wishlistModel.deleteOne({ userId });
        }
        res.json({ success: 'product deleted from wishlist' });
    } catch (error) {
        console.log('error while deleting products from wishlist:', error.message);
    }
}

module.exports = {
    wishList,
    wishProduct,
    deleteWish
}