const { response } = require("express");
const Cliente = require("../models/cliente");
const Servicio = require("../models/servicio");

const crearCliente = async (req, res) => {
  try {
    const { nombre, apellido, rut } = req.body;

    //busco si esta registrado a traves de la funcion findClient
    const findclient = await Cliente.findOne({
      where: {
        rut,
      },
      attributes: ["id", "nombre", "apellido", "rut"],
    });
    if (!findclient) {
      const createCliente = await Cliente.create(
        {
          nombre,
          apellido,
          rut,
        },
        {
          fields: ["nombre", "apellido", "rut"],
          attributes: ["id"],
        }
      );

      res.json({
        ok: true,
        msg: "Cliente registrado con exito",
      });
    } else {
      res.json({
        ok: true,
        msg: "Cliente ya esta registrado",
        findclient,
      });
    }
  } catch (error) {
    res.json({
      ok: false,
      msg: "No se pudo crear el producto",
    });
  }
};

const actualizarCliente = async (req, res) => {
  try {
    const { id_servicio, clientes } = req.body;
    //  const client = await findClient(rut) ;

    //buscar el servicio

    const findService = await Servicio.findOne({
      where: { id: id_servicio },
    });
    

    //si lo encuentro obtengo los id de los clientes culiaos
    if (findService) {
    console.log(findService.id_cliente1)
      const findCliente1 = await Cliente.findOne({
        where: {
          id: findService.id_cliente1,
        }
      });
    //   console.log(findCliente1.nombre)
      
      const findCliente2 = await Cliente.findOne({
          where: {
              id: findService.id_cliente2,
            },
        });
        if(findCliente1 || findCliente2){
            findCliente1.nombre = clientes[0].nombre
            findCliente1.apellido = clientes[0].apellido
            findCliente1.rut = clientes[0].rut
            findCliente1.save()
            findCliente2.nombre = clientes[1].nombre
            findCliente2.apellido = clientes[1].apellido
            findCliente2.rut = clientes[1].rut
            findCliente2.save()
            
            res.json({
                ok: true,
                findService,
                msg: "Cliente actualizado con exito",
            });
        }else{
            res.json({
                ok: false,
                findService,
                msg: "Cliente no encontrado",
            });
        }
     }else{
        res.json({
            ok: false,
            msg: "Servicio no valido"
          });
     }

  } catch (error) {
      console.log(error)
    res.json({
      ok: false,
      msg: "No se pudo actualizar el cliente",
    });
  }
};

module.exports = {
  crearCliente,
  actualizarCliente,
};
