'use strict'

const express = require('express');
const api = express.Router();
const productController = require('./product.controller');
const {ensureAuth, isAdmin, isClient} = require('../services/authenticated');

api.get('/test', [ensureAuth, isAdmin], productController.test);
//CLIENT
api.get('/getProduct', [ensureAuth, isClient], productController.getProducts);
api.get('/bestSold',[ensureAuth, isClient], productController.bestSold);
api.get('/getProductName', [ensureAuth, isClient], productController.getProductName);
api.put('/addProductShopping/:id', [ensureAuth, isClient], productController.addProductShopping)
//ADMIN
api.post('/add', [ensureAuth, isAdmin], productController.addProduct);
api.get('/get/:id', [ensureAuth, isAdmin], productController.getProduct);
api.get('/bestSoldAdmin',[ensureAuth, isAdmin], productController.bestSoldAdmin);
api.get('/soldOut', [ensureAuth, isAdmin], productController.soldOutProduct );
api.put('/update/:id', [ensureAuth, isAdmin], productController.updateProduct); 
api.delete('/delete/:id', [ensureAuth, isAdmin], productController.deleteProduct);

module.exports = api;