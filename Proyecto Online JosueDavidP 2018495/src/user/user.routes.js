'use strict'

const express = require('express');
const api = express.Router();
const userController = require('./user.controller');
const { ensureAuth, isAdmin, isClient } = require('../services/authenticated');

api.get('/test', [ensureAuth, isAdmin], userController.test);
//Publicas
api.post('/register', userController.register);
api.post('/login', userController.login);
//Client
api.put('/update/:id', [ensureAuth, isClient], userController.update);
api.delete('/delete/:id', [ensureAuth, isClient], userController.delete);
//Admin
api.post('/save', userController.save);
api.put('/updateUser/:id', [ensureAuth, isAdmin],userController.updateUserAdmin);
api.delete('/deleteUser/:id', [ensureAuth, isAdmin],userController.deleteUserAdmin);

module.exports = api;