'use strict'

//Archivo para verificar si el token es valido(expirado, valido)
const jwt = require('jsonwebtoken');
const { findOne } = require('../user/user.model');
const User = require('../user/user.model')

//Funcion middLeware (Barrera Logica)
exports.ensureAuth = (req, res, next)=>{
    if(!req.headers.authorization){
        return res.status(403).send({message: 'Doesnt contain header "AUTHORIZATION"'});

    }else{
        try{
            //Obtener el Token
            let token = req.headers.authorization.replace(/['"]+/g, '');
            //Decodificar el Token
            var payload = jwt.decode(token, `${process.env.SRECRET_KEY}`);

            //Validar que no haya expirado
            if(payload.exp >= Date.now()){
                return res.status(401).send({message: 'Expired token'});
            }
        }catch(err){
            console.error(err);
            return res.status(400).send({message: 'Invalid Token'});
        }
        //Inyectar a la solicitud un dato
        req.user = payload;
        next()
    }
}

// bloque nuevo
exports.isAdmin = async(req, res, next)=>{
    try{
        let user = req.user;
        if(user.role  !== 'ADMIN') return res.status(403).send({message:'Unauthorized user '})
        console.log('You Admin')
        next()
    }catch(err){
        console.error(err)
        return res.status(403).send({message: 'Unauthorized user'})
    }
}

// bloque nuevo
exports.isClient = async(req, res, next)=>{
    try{
        let user = req.user;
        if(user.role  !== 'CLIENT') return res.status(403).send({message:'Unauthorized user'})
        console.log('You Client')
        next()
    }catch(err){
        console.error(err)
        return res.status(403).send({message: 'Unauthorized user'})
    }
}