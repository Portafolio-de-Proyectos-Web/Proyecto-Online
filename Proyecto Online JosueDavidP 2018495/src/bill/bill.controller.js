'use strict'

const User = require('../user/user.model');
const Bill = require('./bill.model');
const Product = require('../product/product.model')
const infoUser = '-_id username phone'
const infoProduct = '-_id name price'
const infoBill = '-_id -products._id'
const PDFDocument = require('pdfkit');
const fs = require('fs');


exports.addBill = async(req, res)=>{
try {

        let userId = req.user.sub
        let user = await User.findOne({_id: userId})
     //Generar la factura 
        let data = req.body
        let params = {
            user: userId,
            NIT: data.NIT,
            products: user.cart,
            date: Date.now(),
            total: user.totalCart
        }
        let bill = new Bill(params)
        let newBill = await bill.save()
        
        let myShopping = await Bill.findById({_id: newBill._id})
            .populate('user', infoUser)
            .populate('products.product', infoProduct)
            .select(infoBill)
        return res.send({message:'Bill', myShopping})
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error save bill' });
    }
};

exports.getBills = async(req, res)=>{
    try{
        let userId = req.params.id;
        let myBills = await Bill.find({user: userId})
            .populate('user', infoUser)
            .populate('products.product', infoProduct)
            .select(infoBill)
        
        if(!myBills) return res.send({message: 'User do not have bill'})
        return res.send({message: 'Bills', myBills})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error getting bill'})
    }


}

exports.Sprint = async(req, res)=>{
    try{
        let billId = req.params.id
        let bill = await Bill.findOne({_id: billId})
        let user = await User.findOne({_id: bill.user})

        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          };
          
        const date = bill.date.toLocaleString('es-ES', options);
          

        const doc = new PDFDocument()
        doc.pipe(fs.createWriteStream(`FacturaPDF/Facturas-${bill._id}.pdf`))
        
        doc.fontSize(25).text(`Factura`, { align: 'center' });
        doc.fontSize(18).text(`Usuario: ${user.name + ' ' +user.surname}`);
        doc.fontSize(18).text(`NIT: ${bill.NIT}`);
        doc.fontSize(18).text(`Fecha: ${date}`);
        doc.moveDown();
        doc.fontSize(18).text('Productos:');
        
        for(let productBill of bill.products){
            let product = await Product.findOne({_id: productBill.product})

            doc.fontSize(14).text(`- ${product.name} Q.${product.price}.00`);

        }
        doc.moveDown();
        doc.fontSize(18).text(`Total: ${bill.total}`);

        doc.end();

        return res.send({message: 'hola', bill})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error Sprint'})
    }
}
