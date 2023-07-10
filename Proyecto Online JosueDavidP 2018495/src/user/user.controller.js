'use strict'

const User = require('./user.model');
const { validateData, encrypt, checkPassword } = require('../utils/validate');
const { createToken } = require('../services/jwt');

//Users Logeados 
exports.test = (req, res)=>{
    res.send({message: 'Test function is running User'});
}

//User CLIENT
exports.register = async(req, res)=>{
    try{
        //Capturar la data
        let data = req.body;
        let params = {
            password: data.password,
        }
        let validate = validateData(params);
        if(validate) return res.status(400).send(validate);
        //Role predefinido
        data.role = 'CLIENT';
        //Encriptar contraseña
        data.password = await encrypt(data.password)
        //Guardar la información
        let user = new User(data);
        await user.save();
        return res.send({message: 'Account created sucessfully'});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error creating account', error: err.message})
    }
}

exports.save = async(req, res)=>{
    try{
        //Capturar datos
        let data = req.body;
        let params = {
            password: data.password,
        }
        let validate = validateData(params);
        if(validate) return res.status(400).send(validate);
        //Encriptar la password
        data.password = await encrypt(data.password);
        //Guardar
        let user = new User(data);
        await user.save();
        return res.send({message: 'Account created sucessfully'});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error saving user', error: err.message});
    }
}

exports.login = async(req, res)=>{
    try{
        //Obtener la data a validar (username y password)
        let data = req.body;
        let credentials = { //Datos obligatorios que va a validar la función validateData
            username: data.username,
            password: data.password
        }
        let msg = validateData(credentials);
        if(msg) return res.status(400).send(msg)
        //validar que exista en la BD
        let user = await User.findOne({username: data.username});
        //Validar la contraseña
        if(user && await checkPassword(data.password, user.password)) {
            let token = await createToken(user)
            return res.send({message: 'User logged sucessfully', token});
        }
        return res.status(401).send({message: 'Invalid credentials'});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error, not logged'});
    }
}

exports.update = async(req, res)=>{
    try{
        //Obtener el Id del usuario a actualizar
        let userId = req.params.id;
        //Obtener los datos a actualizar
        let data = req.body;
        //Validar si tiene permisos
        if(userId != req.user.sub) return res.status(401).send({message: 'Dont have permission to do this action'});
        //Validar que le llegue data a actualizar
        if(data.password || Object.entries(data).length === 0 || data.role) return res.status(400).send({message: 'Have submitted some data that cannot be updated'});
        let userUpdated = await User.findOneAndUpdate(
            {_id: req.user.sub},
            data,
            {new: true} 
        )
        if(!userUpdated) return res.status(404).send({message: 'User not found adn not updated'});
        return res.send({message: 'User updated', userUpdated})
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error not updated', err: `Username ${err.keyValue.username} is already token`});
    }
}

exports.delete = async(req, res)=>{
    try{
        //Obtener el id del usuario a eliminar
        let userId = req.params.id;
        //Validar si tiene permisos
        if( userId != req.user.sub) return res.status(401).send({message: 'Dont have permission to do this action'});
        //Eliminar
        let userDeleted = await User.findOneAndDelete({_id: req.user.sub});
        if(!userDeleted) return res.send({message: 'Account not found and not deleted'});
        return res.send({message: `Account with username ${userDeleted.username} deleted sucessfully`});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error not deleted'});
    }
}

//User ADMIN
exports.updateUserAdmin = async(req, res)=>{
    try{
        //Capturar datos
        let data = req.body;
        //Obtener el Id del usuario a actualizar
        let userId = req.params.id
        let userToken = req.user.sub
        //Si exista el User
        let existUserId = await User.findOne({_id: userId})
        //No podra actualizar contraseña
        if(data.password) return res.send({message: 'Cant update password'});
        //No podra cambiarse su rol
        if(data.role && (userId === userToken)) return res.send({message: 'Cant update your same user '});
        //No actualizar a un ADMIN
        if((existUserId.role === 'ADMIN') && (userId !== userToken)) return res.send({message: 'Cant update user ADMIN '});
        let updateUser = await User.findOneAndUpdate(
            { _id: userId },
            data, 
            { new: true });
        if (!updateUser) return res.status(404).send({ message: 'User not afound and not updated' });
        return res.send({ message: 'User updated', updateUser }); 
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error to update'});
    }
}

exports.deleteUserAdmin = async(req, res)=>{
    try{
        //Obtener el Id del usuario a eliminar
        let userId = req.params.id
        let userToken = req.user.sub
        //Si exista el User
        let existUserId = await User.findOne({_id: userId})
        //No eliminar un Usuario ADMIN
        if((existUserId.role == 'ADMIN') && (userToken !== userId)) return res.send({message: 'Do not deleted Admin'});
        await User.findOneAndDelete({_id: userId})
        res.send({message: 'Account with username deleted sucessfully '});
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error not deleted user'});
    }
}