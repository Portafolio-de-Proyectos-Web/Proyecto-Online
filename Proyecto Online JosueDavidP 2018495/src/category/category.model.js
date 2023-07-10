'use strict'
//Definición de la estructura de una colección

const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    }
},{
    versionKey: false
});

module.exports = mongoose.model('Category', categorySchema);