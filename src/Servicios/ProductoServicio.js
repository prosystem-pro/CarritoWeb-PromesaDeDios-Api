const Sequelize = require('sequelize');
const BaseDatos = require('../BaseDatos/ConexionBaseDatos');
const Modelo = require('../Modelos/Producto')(BaseDatos, Sequelize.DataTypes);
const ReporteProducto = require('../Modelos/ReporteProducto')(BaseDatos, Sequelize.DataTypes);
const { EliminarImagen } = require('../Servicios/EliminarImagenServicio');
const { ConstruirUrlImagen } = require('../Utilidades/ConstruirUrlImagen');
const { LanzarError } = require('../Utilidades/ErrorServicios');

const NombreModelo = 'NombreProducto';
const CodigoModelo = 'CodigoProducto';

// const Listado = async (Usuario) => {
//   let estatusPermitido = [1];
//   if (Usuario && (Usuario.NombreRol === 'Administrador' || Usuario.SuperAdmin === 1)) {
//     estatusPermitido = [1, 2];
//   }

//   const Registros = await Modelo.findAll({
//     where: { Estatus: estatusPermitido }
//   });

//   return Registros.map(r => {
//     const Dato = r.toJSON();
//     Dato.UrlImagen = ConstruirUrlImagen(Dato.UrlImagen);
//     return Dato;
//   });
// };
const Listado = async (Usuario) => {
  const Registros = await Modelo.findAll({
    where: { Estatus: [1, 2] }  // trae todos los productos activos e inactivos
  });

  return Registros.map(r => {
    const Dato = r.toJSON();
    Dato.UrlImagen = ConstruirUrlImagen(Dato.UrlImagen);
    console.log('datos',Dato)
    return Dato;
  });
};


const ObtenerPorCodigo = async (Codigo) => {
  const Registro = await Modelo.findOne({ where: { [CodigoModelo]: Codigo } });
  if (!Registro) LanzarError('Registro no encontrado', 404);

  const Dato = Registro.toJSON();
  Dato.UrlImagen = ConstruirUrlImagen(Dato.UrlImagen);

  return Dato;
};

const Buscar = async (TipoBusqueda, ValorBusqueda) => {
  let Registros = [];

  switch (parseInt(TipoBusqueda)) {
    case 1:
      Registros = await Modelo.findAll({
        where: {
          [NombreModelo]: { [Sequelize.Op.like]: `%${ValorBusqueda}%` },
          Estatus: [1, 2]
        }
      });
      break;
    case 2:
      Registros = await Modelo.findAll({
        where: { Estatus: [1, 2] },
        order: [[NombreModelo, 'ASC']]
      });
      break;
    default:
      LanzarError('Tipo de búsqueda inválido', 400);
  }

  return Registros.map(r => {
    const Dato = r.toJSON();
    Dato.UrlImagen = ConstruirUrlImagen(Dato.UrlImagen);
    return Dato;
  });
};

const Crear = async (Datos) => {
  if (!Datos) LanzarError('Datos inválidos para crear registro', 400);

  if (!Datos.NombreProducto || Datos.NombreProducto.trim() === '') {
    let contador = 1;
    let nombreGenerado = `Producto por defecto ${contador}`;
    let existe = true;

    while (existe) {
      const registroExistente = await Modelo.findOne({
        where: { NombreProducto: nombreGenerado }
      });

      if (registroExistente) {
        contador++;
        nombreGenerado = `Producto por defecto ${contador}`;
      } else {
        existe = false;
      }
    }

    Datos.NombreProducto = nombreGenerado;
  }

  const Nuevo = await Modelo.create(Datos);
  const Dato = Nuevo.toJSON();

  if (Dato.UrlImagen) {
    Dato.UrlImagen = ConstruirUrlImagen(Dato.UrlImagen);
  }

  return Dato;
};

const Editar = async (Codigo, Datos) => {
  const Objeto = await Modelo.findOne({ where: { [CodigoModelo]: Codigo } });
  if (!Objeto) LanzarError('Registro no encontrado para editar', 404);

  await Objeto.update(Datos);
  return Objeto;
};

const Eliminar = async (Codigo) => {
  const Objeto = await Modelo.findOne({ where: { [CodigoModelo]: Codigo } });
  if (!Objeto) LanzarError('Registro no encontrado para eliminar', 404);

  await ReporteProducto.destroy({ where: { CodigoProducto: Codigo } });

  const UrlImagenOriginal = Objeto.UrlImagen;
  if (UrlImagenOriginal) {
    const UrlImagenConstruida = ConstruirUrlImagen(UrlImagenOriginal);
    try {
      await EliminarImagen(UrlImagenConstruida);
    } catch (error) {
      console.warn(`No se pudo eliminar la imagen: ${error.message}`);
    }
  }

  await Objeto.destroy();

  return Objeto;
};

const ListadoPorClasificacion = async (Codigo) => {
  const Registros = await Modelo.findAll({
    where: {
      CodigoClasificacionProducto: Codigo,
      Estatus: [1, 2]
    }
  });

  return Registros.map(r => {
    const Dato = r.toJSON();
    Dato.UrlImagen = ConstruirUrlImagen(Dato.UrlImagen);
    console.log('datosss',Dato)
    return Dato;
  });
};

module.exports = { Listado, ObtenerPorCodigo, Buscar, Crear, Editar, Eliminar, ListadoPorClasificacion };
