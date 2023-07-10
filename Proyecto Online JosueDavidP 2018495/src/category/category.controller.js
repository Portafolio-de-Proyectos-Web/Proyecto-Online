'use strict'

const Category = require('./category.model');
const Product = require('../product/product.model');

exports.defaultCategory = async()=>{
    try{
        let data = {
            name: 'Default',
            description: 'Default category'
        }
        let existCategory = await Category.findOne({name: 'Default'});
        if(existCategory) return console.log('Default category already existed');
        let defualCategory = new Category(data);
        await defualCategory.save();
        return console.log('Default category created');
    }catch(err){
        return console.error(err);
    }
}

exports.addCategory = async(req, res)=>{ 
    try{
        let data = req.body;
        //Validar duplicados
        let existCategory = await Category.findOne({name: data.name});
        if(existCategory) {
            return res.sed({message: 'Category already existed'})
        }
        let category = new Category(data);
        await category.save();
        return res.status(201).send({message: 'Created category'})
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error save category'})
    }
}

exports.getCategories = async(req, res)=>{
    try{
        let categories = await Category.find();
        return res.send({message: 'Categorys found', categories})
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error get categorys'});
    }
}

exports.getCategory = async(req, res)=>{
    try{
        let categoryId = req.params.id;
        let product = req.params.name;
        let category = await Category.findOne({_id: categoryId});
        if(!category) return res.status(404).send({message: 'Category not found'});
        return res.send({message: 'Category found', category, product})
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error get category'});
    }
}

exports.updateCategory = async(req, res)=>{
    try{
         //Obtener el Id de la categoria
        let categoryId = req.params.id;
        //Capturar el fomulario de registro (Body)
        let data = req.body;
        //validar que exista en la BD
        let existCategory = await Category.findOne({name: data.name}).lean();
        if(existCategory) {
            if(existCategory._id != categoryId) return res.send({message: 'Category already created'});
            let updatedCategory = await Category.findOneAndUpdate(
                {_id: categoryId},
                data,
                {new: true}
            )
            if(!updatedCategory) return res.status(404).send({message: 'Category not found and not updated'});
            return res.send({message: 'Category updated', updatedCategory});
        }
        //Actualizar
        let updatedCategory = await Category.findOneAndUpdate(
            {_id: categoryId},
            data,
            {new: true}
        )
        if(!updatedCategory) return res.status(404).send({message: 'Category not found and not updated'});
        return res.send({message: 'Category updated', updatedCategory});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error update category'});
    }
}

exports.deleteCategory = async(req, res)=>{
    try{
         //Obtener el Id de la categoria
        let categoryId = req.params.id;
        //Si exista el productos en la categoria
        let defaultCategory = await Category.findOne({name: 'Default'});
        if(defaultCategory._id == categoryId) return res.send({message: 'Default cateogory cannot deleted'});
        await Product.updateMany(
            {category: categoryId}, 
            {category: defaultCategory._id}
        );
        let deletedCategory = await Category.findOneAndDelete({_id: categoryId});
        if(!deletedCategory) return res.status(404).send({message: 'Category not found and not deleted'});
        return res.send({message: 'Category deleted sucessfuly'});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error deleted category'});
    }
}