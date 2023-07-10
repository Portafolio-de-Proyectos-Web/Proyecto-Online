'use strict'

const express = require('express');
const api = express.Router();
const billController = require('../bill/bill.controller');
const { ensureAuth, isAdmin } = require('../services/authenticated');

api.post('/addBill',[ensureAuth], billController.addBill );
api.get('/getBill/:id', [ensureAuth], billController.getBills);
api.get('/billPrint/:id', [ensureAuth, isAdmin], billController.Sprint)

module.exports = api;