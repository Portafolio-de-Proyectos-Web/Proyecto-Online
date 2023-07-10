'use strict'

const { crossOriginResourcePolicy } = require('helmet');
//Archivo para creacion de tokens
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.createToken = async(user)=>{
    try{
        let payload = {
            sub: user._id,
            name: user.name,
            surname: user.username,
            email: user.email,
            role: user.role,
            iat: Math.floor(Date.now() / 1000), //Fecha actual en formato UNIX | Segundos
            exp: Math.floor(Date.now() / 1000) + (60 * 120)
        }
        return jwt.sign(payload, `${process.env.SECRET_KEY}`);
    }catch(err){
        console.error(err);
        return err;
    }
}