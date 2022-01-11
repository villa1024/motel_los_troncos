const { response } = require("express");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const { Pool } = require("pg");

const { generarJWT } = require("../helpers/jwt");
const Usuario = require("../models/usuario");
const Rol = require("../models/rol");
const Roles = require("../models/rol");
const Rol_usuario = require("../models/rol_usuario");

// Conexion base de datos postgres
const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "tics2",
  database: "test",
  port: "5432",
});

const crearUsuario = async (req, res = response) => {
  try {
    const {
      nombre,
      apellido,
      rut,
      correo,
      telefono,
      direccion,
      password,
      rol,
    } = req.body;

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    const passwordHash = bcrypt.hashSync(password, salt);
  
    const findUser = await Usuario.findOne({
      where: {
        rut,
        estado:true
      },
      attributes: ["id"],
    });
    const findRol = await Rol.findOne({
      where: {
        id: rol,
      },
      attributes: ["id"],
    });
    if (findUser && findRol) {
      return res.status(440).json({
        ok: false,
        msg: "El usuario ya existe",
      });
    } else {
      const newUser = await Usuario.create(
        {
          nombre,
          apellido,
          rut,
          correo,
          telefono,
          direccion,
          password: passwordHash,
          estado: true,
        },
        {
          fields: [
            "nombre",
            "apellido",
            "rut",
            "correo",
            "telefono",
            "direccion",
            "password",
            "estado",
          ],
        }
      );

            await newUser.addRoles([findRol]);

            // const setRol = await Rol_usuario.create({
            //     usuarioId: newUser.id,
            //     rolId:findRol.id
            // },{
            //     fields:[
            //         'usuarioId',
            //         'rolId'
            //     ]
            // });


            // Generar JWT
            const token = await generarJWT(rut, rol);
            return res.status(201).json({
                ok: true,
                msg: 'Usuario Registrado correctamente',
                rut,
                rol,
                token
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Ha ocurrido un error, por favor contacte al administrador'
        });
    }
};

const loginUsuario = async (req, res) => {
  try {
    const { rut, password } = req.body;
    // Confirmar los passwords
    //const result = await pool.query('SELECT password as passwordhash, rol as tipo FROM usuarios, rol_usuario, roles WHERE rut = ($1) and usuarios.id = rol_usuario.usuarioId ', [rut]);

    const findUser = await Usuario.findOne({
      where: {
        rut,
        estado:true
      },
      attributes: ["id", "rut", "password", "nombre", "apellido"],
      include: [Rol],
    });

    if (!findUser) {
      return res.status(500).json({
        ok: false,
        msg: "Usuario o contraseña incorrecta",
      });
        
        }
        console.log(findUser.dataValues.roles[0].dataValues.rol);
        const passwordhash = findUser.dataValues.password;
        const id = findUser.dataValues.id;

        //const tipo = findUser.dataValues.roles[0].dataValues.rol;
        const id_usurario = findUser.id;
        const tipo = findUser.dataValues.roles[0].dataValues.rol;
        const tipo_id = findUser.dataValues.roles[0].dataValues.id;
        //const { passwordhash, tipo } = result.rows[0];
        const validPassword = bcrypt.compareSync(password, passwordhash);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Rut y/o contraseña incorrecta'
            });
        }
        // Generar JWT
        const token = await generarJWT(rut, tipo, findUser.id);
        return res.json({
            ok: true,
            msg: 'Login',
            id,
            nombre: findUser.dataValues.nombre,
            apellido: findUser.dataValues.apellido,
            rut,
            tipo,
            tipo_id,
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Ha ocurrido un error, por favor contacte al administrador'
        });
    }
  
};

const revalidarToken = async (req, res) => {
  const { rut, tipo } = req;
  // Generar nuevo JWT
  const token = await generarJWT(rut, tipo);
  return res.json({
    ok: "renew",
    rut,
    tipo,
    token,
  });
};

const eliminarUsuario = async (req, res) => {
  const { id } = req.body;
  try {
    const deleteUser = await Usuario.update({
      estado:false
    },
    {
        where: {
            id
        }
    });
    return res.json({
      ok: true,
      msg: "Usuario Eliminado con Exito",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "No se pudo eliminar. Por favor hable con el administrador",
    });
  }
};

const updateUsuario = async (req, res) => {
  try {
    const {
      id,
      nombre,
      apellido,
      rut,
      correo,
      telefono,
      direccion,
      rol,
      password,
      newPassword,
    } = req.body;

    const findUser = await Usuario.findOne({
      where: {
        id,
      },
    });

    if (findUser) {
      if (password) {
        
        const salt = bcrypt.genSaltSync();
        const passwordhash = bcrypt.hashSync(password, salt);

        const validPassword = bcrypt.compareSync(password, passwordhash);
        if (!validPassword) {
          return res.status(400).json({
            ok: false,
            msg: "la contraseña no coincide",
          });
        }
        else{
            const salt = bcrypt.genSaltSync();
            const passwordhash = bcrypt.hashSync(newPassword, salt);  
            const updatePassword = await Usuario.update({
                password: passwordhash
            },
            {
                where:{
                    id
                }
            });
        }
      }

      const updateUser = await Usuario.update(
        {
          nombre,
          apellido,
          rut,
          correo,
          telefono,
          direccion,
        },
        {
          where: { id },
        }
      );
      //cambiar el rol si existe
      if (rol) {
        const updateRol = await Rol_usuario.update(
          {
            rolId: rol,
          },
          {
            where: {
              usuarioId: id,
            },
          }
        );
      }

      res.json({
        ok: true,
        msg: "Usuario actualizado correctamente",
      });
    } else {
      return res.status(440).json({
        ok: false,
        msg: "El usuario no existe",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};
module.exports = {
  crearUsuario,
  loginUsuario,
  revalidarToken,
  eliminarUsuario,
  updateUsuario,
};
