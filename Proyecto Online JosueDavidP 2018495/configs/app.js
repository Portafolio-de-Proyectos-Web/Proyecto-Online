'use strict'

const express = require('express');
//Logs de las solicitudes que recibe el servidor
const morgan = require('morgan');
//Aplica seguridad básica al servidor
const helmet = require('helmet');
//Aceptación de solicitudes desde otro sistema o desde la misma máquina
const cors = require('cors');
//Instancia de express
const app = express();
const port = process.env.PORT || 3000;
//Rutas
const userRoutes = require('../src/user/user.routes');
const categoryRoutes = require('../src/category/category.routes');
const productRoutes = require('../src/product/product.routes');
const billRoutes = require('../src/bill/bill.routes');
const categoryController = require('../src/category/category.controller');



//CONFIGURAR EL SERVIDOR HTTP DE EXPRESS
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use('/user', userRoutes);
app.use('/category', categoryRoutes);
app.use('/product', productRoutes);
app.use('/bill', billRoutes);

//Función donde se levanta el servidor
exports.initServer = ()=>{
    categoryController.defaultCategory()
    app.listen(port);
    console.log(`Server http running in port ${port}`);
}