'use strict'

const mongoose = require('mongoose');

const facturaSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    NIT: {
        type: String,
        require: true
    },
    products: {
        type: [{
            product:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                require: true
            },
            amount: {
                type: Number,
                require: true
            }
        }],
        require: true
    },
    date: {
        type: Date,
        require: true
    },
    total: {
        type: Number,
        require: true
    }
},{
    versionKey: false
})

module.exports = mongoose.model('Factura', facturaSchema);

