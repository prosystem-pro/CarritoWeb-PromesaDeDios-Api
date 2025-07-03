const Sequelize = require('sequelize');
const BaseDatos = require('../BaseDatos/ConexionBaseDatos');
const Modelo = require('../Modelos/Usuario')(BaseDatos, Sequelize.DataTypes);
const { EncriptarClave } = require('../Configuracion/AutorizacionConfiguracion');
const { Op } = require('sequelize');

const NombreModelo = 'NombreUsuario';
const CodigoModelo = 'CodigoUsuario';

const Listado = async () => {
  return await Modelo.findAll({
    where: {
      Estatus: [1,2],
      SuperAdmin: {
        [Op.is]: null 
      }
    }
  });
};

const ObtenerPorCodigo = async (Codigo) => {

  const usuario = await Modelo.findOne({ where: { [CodigoModelo]: Codigo } });

  if (!usuario) {
    throw new Error("Usuario no encontrado.");
  }

  if (usuario.SuperAdmin !== null) {
    throw new Error("Este usuario es Super Adminsitrador y no se puede mostrar.");
  }

  return usuario;
};

const Buscar = async (TipoBusqueda, ValorBusqueda) => {
  switch (parseInt(TipoBusqueda)) {
    case 1:
      return await Modelo.findAll({
        where: { 
          [NombreModelo]: { [Sequelize.Op.like]: `%${ValorBusqueda}%` },
          Estatus: [1,2],
          SuperAdmin: null
        }
      });
    case 2:
      return await Modelo.findAll({
        where: { Estatus: [1,2], SuperAdmin: null },
        order: [[NombreModelo, 'ASC']]
      });
    default:
      return null;
  }
};


const Crear = async (Datos) => {
    if (!Datos.Clave) {
      throw new Error("La clave es obligatoria");
    }

   if ("SuperAdmin" in Datos && Datos.SuperAdmin !== null) {
      throw new Error("No se puede asignar un valor a la columna Super Administrador");
    }
    const { Salt, Hash } = await EncriptarClave(Datos.Clave);
    Datos.ClaveHash = Hash;
    Datos.ClaveSalt = Salt;
    delete Datos.Clave;
    return await Modelo.create(Datos);
};


const Editar = async (Codigo, Datos) => {
  const Objeto = await Modelo.findOne({ where: { [CodigoModelo]: Codigo } });
  if (!Objeto) return null;

  if ("SuperAdmin" in Datos) {
    if (Objeto.SuperAdmin !== null) {
      throw new Error("No se puede modificar la columna Super Administrador de este usuario.");
    }
    delete Datos.SuperAdmin; 
  }

  if (Datos.Clave && Datos.Clave.trim() !== "") {
    const { Salt, Hash } = await EncriptarClave(Datos.Clave);
    Datos.ClaveHash = Hash;
    Datos.ClaveSalt = Salt;
    delete Datos.Clave;
  }

  await Objeto.update(Datos);
  return Objeto;
};



const Eliminar = async (Codigo) => {
  const Objeto = await Modelo.findOne({ where: { [CodigoModelo]: Codigo } });
  if (!Objeto) return null;

  if ("SuperAdmin" in Objeto && Objeto.SuperAdmin !== null) {
    throw new Error("No se puede eliminar a un usuario con Super Administrador lleno.");
  }

  await Objeto.destroy();
  return Objeto;
};

module.exports = { Listado, ObtenerPorCodigo, Buscar, Crear, Editar, Eliminar };