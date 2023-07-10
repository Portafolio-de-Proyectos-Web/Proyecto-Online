'use strict'
const Product = require('./product.model');
const Category = require('../category/category.model');
const User = require('../user/user.model');



exports.test = (req, res)=>{
    res.send({message: 'Test function is running Product'});
}

exports.addProduct = async(req, res)=>{
    try{
        //Obtener la información a agregar
        let data = req.body;
        let existCategory = await Category.findOne({_id: data.category});
        if(!existCategory) return res.status(404).send({message: 'Category not found'});
        //Guardar
        let product = new Product(data);
        await product.save();
        return res.send({message: 'Product saved sucessfully', product})
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error creating product'});
    }
}

exports.addProductShopping = async(req, res)=>{
    try{
        let userId = req.user.sub
        let productId = req.params.id
        let amountProduct = 0
        let total = 0

        //Verificar si existen en BD
        let product = await Product.findOne({_id: productId})
        let user = await User.findOne({_id: userId})
        let totalCart = user.totalCart

        if(!product) return res.send({message: 'Product does not exist'})
        
        //Verificar el producto 
        let existProductCart = await User.findOne({_id: userId,"cart.product": productId});
        if(existProductCart){let cart = existProductCart.cart
            for(let productCart of cart){
                if(productCart.product == productId){         
                    amountProduct = productCart.amount
                }
            }
            //Producto en Carrito de Compras
            amountProduct = amountProduct+1
            let updateCart =  await User.updateOne(
                { _id: userId, 'cart.product': productId },
                { $set: { 'cart.$.amount': amountProduct } },
            )
            //Actualizar el stock
            total = totalCart + product.price
            let updateUser = await User.findOneAndUpdate({_id: userId},{totalCart: total})
            let cartNew = updateUser.cart
            if(!updateCart) return res.send({message: 'Could not save product in cart'})
            return res.send({message: 'Product saved in cart', cartNew})
        }
        //Agregar un producto 
        let cart = await User.updateOne(
            {_id: userId},
            {$push: {cart: {product: productId, amount: 1}}},
        )
        //Actualizar el Total
        total = totalCart + product.price
        await User.findOneAndUpdate({_id: userId},{totalCart: total})
        if(!cart) return res.send({message: 'Could not save product in cart'})
        return res.send({message: 'product saved in cart'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error product saved in cart', error: err.message})
    }
}

exports.getProducts = async(req, res)=>{
    try{
        //Buscar datos
        let products = await Product.find().populate('category');
        return res.send({message: 'Products found', products});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting products'});
    }
}

exports.getProduct = async(req, res)=>{
    try{
        //Obtener el Id del producto a buscar
        let productId = req.params.id;
        //Buscarlo en BD
        let product = await Product.findOne({_id: productId}).populate('category');
        //Valido que exista el producto
        if(!product) return res.status(404).send({message: 'Product not found'});
        //Si existe lo devuelvo
        return res.send({message: 'Product found:', product});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting product'});
    }
}

exports.bestSoldAdmin = async(req, res)=>{
    try{
        let products = await Product.find().sort({sold: -1})
        res.send({message: 'Products Best Sold:', products})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error best sold products'})
    }
}

exports.bestSold = async(req, res)=>{
    try{
        let products = await Product.find().sort({sold: -1})
        res.send({message: 'Products Best Sold:', products})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error best sold products'})
    }
}

exports.soldOutProduct = async(req, res)=>{
    try{
        let product = await Product.find({stock: 0}).populate('category')
        res.send({message: 'Products Sold Out:',product})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error sold out products'})
    }
}

exports.getProductName = async(req, res)=>{
    try{
        //Capturar el fomulario de registro (Body)
        let data = req.body
        //validar que exista en la BD
        let nameProduct = await Product.findOne({name: data.name})
        if(!nameProduct) return res.send({message: 'Product does not exist'})
        return res.send({message:'Products name is:', nameProduct})

    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error getting product'})
    }
}

exports.updateProduct = async(req, res)=>{
    try{
        //obtener el Id del producto
        let productId = req.params.id;
        //obtener la data a actualizar
        let data = req.body;
        //Validar que exista la categoría
        let existCategory = await Category.findOne({_id: data.category});
        if(!existCategory) return res.status(404).send({message: 'Category not found'});
        //Actualizar
        let updatedProduct = await Product.findOneAndUpdate(
            {_id: productId},
            data,
            {new: true}
        )
        if(!updatedProduct) return res.send({message: 'Product not found and not updated'});
        return res.send({message: 'Product updated:', updatedProduct});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error updating product'});
    }
}

exports.deleteProduct = async(req, res)=>{
    try{
        let productId = req.params.id

        let deleteProduct = await Product.findOneAndDelete({_id: productId})
        if(!deleteProduct) return  res.send({message:'Product does not exist'})
        return res.send({message: 'Product deleted:', deleteProduct})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error deleted Product'})
    }
}