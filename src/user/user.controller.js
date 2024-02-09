'use strict' //Modo estricto

import User from './user.model.js'
import { encrypt, checkPassword, checkUpdate } from '../utils/validator.js'

export const test = (req, res)=>{
    console.log('test is running')
    return res.send({message: 'Test is running'})
}

export const register = async(req, res)=>{
    try{
        //Capturar el formulario (body)
        let data = req.body
        //Encriptar la contraseña
        data.password = await encrypt(data.password)
        //Asignar el rol por defecto
        data.role = 'CLIENT'
        //Guardar la información en la BD
        let user = new User(data)
        await user.save() //Guardar en la BD
        //Responder al usuario
        return res.send({message: `Registered successfully, can be logged with username ${user.username}`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error registering user', err: err})
    }
}

export const login = async(req, res)=>{
    try{
        //Capturar los datos (body)
        let { username, password } = req.body
        //Validar que el usuario exista
        let user = await User.findOne({username}) //buscar un solo registro
        //Verifico que la contraseña coincida
        if(user && await checkPassword(password, user.password)){
            let loggedUser = {
                username: user.username,
                name: user.name,
                role: user.role
            }
            //Respondo al usuario
            return res.send({message: `Welcome ${loggedUser.name}`, loggedUser})
        }
        return res.status(404).send({message: 'Invalid credentials'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error to login'})
    }
}

//Update
export const update = async(req, res)=>{ //Datos generales(No password)
    try {
        //Obtener el id del usuario a actualizar
        let { id } = req.params
        //Obtener los datos a actualizar
        let data = req.body
        //Validar sin traer datos
        let update = checkUpdate(data, id)
        if(!update)return res.status(400).send({message: 'Have submitted some data that canot be update'})
        //Validar si tiene permisos (tokenizacion) X hoy no lo vemos X  
        //Actualizar (BD)
        let updatedUser = await User.findOneAndUpdate(
            {_id: id},//ObjectsId <- hexadecimales(Hora sys, Verssion Mongo, Llave privada...)
            data, //Los datos que se van a actualziar
            {new: true}
        )
        //Validar actualizacion
        if(!updatedUser) ReadableByteStreamController.status(401).send({message: 'User not found  and not update'})
        //Respondo al usuario
        return res.send({message: 'Update user', updatedUser})    
    } catch (error) {
        console.error(err)
        if(err.keyValue.username) return res.status(400).send ({message: `Username ${err.keyValue.username} is alredy taken`})
        return res.status(500).send({message: 'Error updating account'})
    }
}

export const deleteU = async(req, res)=>{
    try {
        //Obtener el Id
        let { id } = req.params
        //Validar si esta logueado y el mismo  X no lo vemos X
        //Eliminar  (deleteOne/findOneAdnDelete)
        let deletedUser = await User.findOneAndDelete({_id: id})
        //Verficar si se elimino
        if(!deletedUser) return res.status(404).send({message: 'Account not found and not deleted'}) 
        //Responder
        return res.status({message: `Account with username ${deletedUser.username} delete succesfully`})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error deleting account'})
    }
}