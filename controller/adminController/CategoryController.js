const categoryModel = require('../../models/category');
const brandModel = require('../../models/brand');
const categoryOfferModel = require('../../models/categoryOffer');


//render category and brand management page
const category = async(req,res) =>{
    try {

        const brands = await brandModel.find()
        const categories = await categoryModel.find()
        res.render('admin/categories',{brand:brands,category:categories})
    } catch (error) {
        console.log("error in category:",error.message)
    }
   
}


//adding category filed of products
const categoryAdd = async(req,res) => {
    try {
        const {name} = req.body;
        const category = new categoryModel({
            name
        })
        await category.save()

        req.flash('success',"new category added successfully.")
        res.redirect('/admin/category')
    } catch (error) {
        console.error("category error",error.message)
        req.flash('error',"some error occured while adding the category.")
        res.redirect('/admin/category')
    }
}

//category editing page rendering
const editCategory = async(req,res)=>{
    try {
        let id = req.params.id
        let category = await categoryModel.findById(id)
        res.render('admin/editCategory',{categories:category})
    } catch (error) {
        console.log("editcategory error:",error.message)
    }

}

//edited category updation
const editCategoryAction =async(req,res) =>{
    try {
        const id=req.params.id;
        const {categoryName} =req.body;

        let category = await categoryModel.findById(id)
        category.name = categoryName;
        await category.save();

        req.flash('success','successfully edited the category.')
        res.redirect('/admin/category')
    } catch (error) {
        console.log('editing category',error.message);
    }
}


//deleting one category
const deleteCategory = async(req,res) =>{
    try {
        
    const brand = await categoryModel.findByIdAndDelete(req.params.id)
    if(!brand){
        req.flash('error',"Error in finding the category.");
        res.redirect('/admin/category');
    }
        req.flash('success','The category is deleted successfully');
        res.redirect('/admin/category')
    } catch (error) {
        console.log("delete brand error:",error.message);
        req.flash('error',"Error in deleting category.");
        res.redirect('/admin/category')
    }
}

// category offer lists
const categoryOfferList = async(req, res)=> {
    try {
        const categoryOffer = await categoryOfferModel.find().populate('categories');
        console.log('cat off is:',categoryOffer)
        res.render('admin/categoryOffer',{categoryOffer})
    } catch (error) {
        console.log('error in category offer listing:',error.message);
    }
}

// category offer updating page
const categoryOfferUpdatePage = async(req, res) => {
    try {
        const categories = await categoryModel.find()
        res.render('admin/addCategoryOffer',{categories})
    } catch (error) {
        console.log('error in rendering category offer page:',error.message);
    }
}

const addCategoryOffer = async (req, res) => {
    try {
        console.log('adding category offer')
        const {categoryId, offerName, discountPercentage, startDate, endDate} = req.body;
        console.log('value in cagerory offers are:',req.body);
        const categoryOffer = new categoryOfferModel({
            categories:categoryId,
            offerName,
            discountPercentage,
            startDate,
            endDate
        })
        const savedOffer = await categoryOffer.save();
        console.log('saved offer is:',savedOffer);
        res.status(200).json({success: 'category offer updated successfully'});
    } catch (error) {
        console.log('error in adding category offer:',error.message);
    }
}

const deleteCategoryOffer = async(req, res) => {
    try {
        const categoryId = req.params.id;
        console.log('cat',categoryId);
        console.log('deleting category offer')
        const catOffer = await categoryOfferModel.findByIdAndDelete(categoryId);
        if(!catOffer){
            console.log('catoffer is not found')
            return res.status(400).json({error:'No category offer found'});
        }
        console.log('successfully deleted')
        res.status(200).json({success:'Your category is offer deleted.'});
    } catch (error) {
       console.log('error while deleting category offer:',error.message); 
       return res.status(400).json({error:'error in deleting category offer.'})
    }
}

const editCategoryOfferPage = async(req, res) => {
    try {
        console.log('editing category')
        const categoryId = req.params.id;
        console.log('cat id:',categoryId);
        const categoryOffer  = await categoryOfferModel.findById(categoryId);
        const categories = await categoryModel.find();
        if (!categories) {
            return res.status(404).send('Category offer not found');
        }
        res.render('admin/editCategoryOffer', { categories, categoryOffer });
    } catch (error) {
        console.log('error in editpage rendering:',error.message);
    }
}

const editCategoryOffer = async(req, res) => {
    try {
        const category = req.params.id;
        console.log('category id is:',category);
        const {categoryId, offerName, discountPercentage, startDate, endDate} = req.body;
        console.log('value in cagerory offers are:',req.body);
        const updateOffer = await categoryOfferModel.findByIdAndUpdate(category,{
            categories:categoryId,
            offerName,
            discountPercentage,
            startDate,
            endDate
        },{ new: true })
        console.log('saved offer is:',updateOffer);
        console.log('edited successfully');
        req.flash('success',"offer edited successfully.");
        res.redirect('/admin/categoryOffer')
    } catch (error) {
        console.log('error in editing category offer:',error.message);
        req.flash('error',"error in offer editing.");
        res.redirect('/admin/categoryOffer')
    }
}

module.exports = {
    category,
    categoryAdd,
    editCategory,
    editCategoryAction,
    deleteCategory,
    categoryOfferList,
    categoryOfferUpdatePage,
    addCategoryOffer,
    deleteCategoryOffer,
    editCategoryOfferPage,
    editCategoryOffer
}