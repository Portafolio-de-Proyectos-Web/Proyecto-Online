'use strict'

const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
        lowercase: true,
        unique: true
    },
    price: {
        type: Number,
        require: true
    },
    stock: {
        type: Number,
        require: true
    },
    sold: {
        type: Number,
        require: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category',
        require: true
    }
},{
    versionKey: false
});

module.exports = mongoose.model('Product', productSchema);