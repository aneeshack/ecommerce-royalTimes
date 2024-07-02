const productModel = require('../../models/product');
const wishlistModel = require('../../models/wishList');

// showing all the products in wishlist
const wishList = async(req, res) =>{
    try {
        
        const result = await wishlistModel.aggregate([
            {
                $unwind: '$products' // Deconstruct the array of product IDs
            },
            {
                $lookup: {
                    from: 'products', // The name of the collection to join
                    let: { productId: '$products' }, 
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ['$_id', { $toObjectId: '$$productId' }] // Match the product IDs
                                }
                            }
                        }
                    ],
                    as: 'populatedProducts' // The name for the resulting field that holds the joined documents
                }
            },
            {
                $unwind: '$populatedProducts' // Deconstruct the array of populated products
            },
            {
                $group: {
                    _id: '$_id', // Group by the wishlist ID
                    products: { $push: '$populatedProducts' } // Reconstruct the products array with the populated documents
                }
            }
        ]);
       
        res.render('user/wishList' ,{ wishlists: result })
    } catch (error) {
        console.log('error in wishlist page:',error.message)
    }
}



// product added to wishlist
const wishProduct = async(req, res)=>{
    try {
        
        const{productId} =req.body;
        const userId = req.session.userId;
  

        //find if the user already have wishlist
        let wishList = await wishlistModel.findOne({userId})
        if(wishList){

            if(wishList.products.includes(productId)){

                // if product already exist in the wishlist just remove it 
              const remove = await wishlistModel.updateOne({userId},{$pull:{ products:productId}});
             
            //   product model making wishlist into false
              await productModel.findByIdAndUpdate(productId,
                {isWishlist:false},
                {new:true}
               )

            //    check if any products in the wishlist
              const wishListNew= await wishlistModel.findOne({userId});
               if(!wishListNew || wishListNew.products.length === 0){

                // if no products in wishlist just remove it
                await wishlistModel.deleteOne({userId});
               }
                res.json({message:'product already exist in wishlist'});
            }else{
               wishList.products.push(productId);
               await wishList.save();

                await productModel.findByIdAndUpdate(productId,
                {isWishlist:true},
                {new:true}
               )
               console.log('product added to wishlist');
               res.json({message:'product added to wishlist successfully'});
            }
        }else{
        const newWishlist = new wishlistModel({
            userId,
            products:[productId]
        })
        await newWishlist.save();
        await productModel.findByIdAndUpdate(productId,
            {isWishlist:true},
            {new:true}
           )
        res.json({message:'Wishlist created and product added successfully'});
    }

    } catch (error) {
        console.log('error in add to wish list: ',error.message);
        res.status(500).json({ message: 'Error adding product to wishlist' });
    }
}
 

// delete item in wishlist
const deleteWish = async(req, res ) => {
    try {
        console.log('entered to delete wishlist api')
        const productId = req.params.id;
        const userId = req.session.userId;

        console.log('productid is getting:',productId);
       
        const remove = await wishlistModel.updateOne({userId},{$pull:{ products:productId}});
             
            //   product model making wishlist into false
              await productModel.findByIdAndUpdate(productId,
                {isWishlist:false},
                {new:true}
               )

               const wishListNew= await wishlistModel.findOne({userId});
               if(!wishListNew || wishListNew.products.length === 0){

                // if no products in wishlist just remove it
                await wishlistModel.deleteOne({userId});
               }
                res.json({success:'product deleted from wishlist'});
    } catch (error) {
        console.log('error while deleting products from wishlist:',error.message);
    }
}

module.exports = {
    wishList,
    wishProduct,
    deleteWish
}