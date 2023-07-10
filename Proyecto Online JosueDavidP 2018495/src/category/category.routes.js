'use strict'

const express = require('express');
const api = express.Router();
const categoryController = require('./category.controller');
const {ensureAuth, isAdmin} = require('../services/authenticated');
//Admin
api.post('/add', [ensureAuth, isAdmin ] ,categoryController.addCategory);
api.get('/get', [ensureAuth, isAdmin], categoryController.getCategories);
api.get('/get/:id', [ensureAuth, isAdmin], categoryController.getCategory);
api.put('/update/:id', [ensureAuth, isAdmin], categoryController.updateCategory);
api.delete('/delete/:id', [ensureAuth, isAdmin], categoryController.deleteCategory); 

module.exports = api;