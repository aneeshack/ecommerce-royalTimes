const categoryModel = require('../../models/category');
const brandModel = require('../../models/brand');



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








module.exports = {
    category,
    categoryAdd,
    editCategory,
    editCategoryAction,
    deleteCategory
}