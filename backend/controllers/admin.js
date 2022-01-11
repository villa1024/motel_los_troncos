const { response } = require('express');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const { generarJWT } = require('../helpers/jwt');
const Usuario = require('../models/usuario');
const Roles = require('../models/rol');


const verUsuarios = async (req, res = response) => {
    try {
        const allUsers = await Usuario.findAll(
            {
                where:{
                    estado:true
                },
                attributes: ['id', 'rut', 'nombre', 'apellido', 'correo', 'direccion', 'telefono'],
                include: [
                    Roles
                ]
            });
        return res.json({
            ok: true,
            msg: allUsers
        })



    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Ha ocurrido un error, por favor contacte al administrador'
        });
    }
};

const nuevoRol = async (req, res = response) => {
    const { rol } = req.body;
    console.log(rol);
    Rol.create(
        { rol }
    )
        .then(result => {
            console.log(result);
            return res.status(200).json({
                ok: true,
                rol
            });
        })
        .catch(err => {
            console.log(err);
        });
};

const obtenerRolesUsuarios = async (req, res = response) => {
    try {
        const rolesUsuarios = await Roles.findAll();
        console.log(rolesUsuarios);
        return res.status(200).json({
            ok: true,
            msg: rolesUsuarios
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Ha ocurrido un error, por favor contacte al administrador'
        });
    }
};

module.exports = {
    verUsuarios,
    nuevoRol,
    obtenerRolesUsuarios
};

