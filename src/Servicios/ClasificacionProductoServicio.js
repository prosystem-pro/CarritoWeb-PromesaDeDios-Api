const Sequelize = require('sequelize');
const BaseDatos = require('../BaseDatos/ConexionBaseDatos');
const Modelo = require('../Modelos/ClasificacionProducto')(BaseDatos, Sequelize.DataTypes);
const Producto = require('../Modelos/Producto')(BaseDatos, Sequelize.DataTypes);
const ReporteProducto = require('../Modelos/ReporteProducto')(BaseDatos, Sequelize.DataTypes);
const { EliminarImagen } = require('../Servicios/EliminarImagenServicio');
const { ConstruirUrlImagen } = require('../Utilidades/ConstruirUrlImagen');
const { LanzarError } = require('../Utilidades/ErrorServicios');

const NombreModelo = 'NombreClasificacionProducto';
const CodigoModelo = 'CodigoClasificacionProducto';

const Listado = async () => {
  const Registros = await Modelo.findAll({ where: { Estatus: [1, 2] } });

  return Registros.map(r => {
    const Dato = r.toJSON();
    if (Dato.UrlImagen) {
      Dato.UrlImagen = ConstruirUrlImagen(Dato.UrlImagen);
    }
    return Dato;
  });
};

const ObtenerPorCodigo = async (Codigo) => {
  const Registro = await Modelo.findOne({ where: { [CodigoModelo]: Codigo } });
  if (!Registro) LanzarError('Registro no encontrado', 404);

  const Dato = Registro.toJSON();
  if (Dato.UrlImagen) {
    Dato.UrlImagen = ConstruirUrlImagen(Dato.UrlImagen);
  }

  return Dato;
};

const Buscar = async (TipoBusqueda, ValorBusqueda) => {
  switch (parseInt(TipoBusqueda)) {
    case 1:
      return await Modelo.findAll({
        where: {
          [NombreModelo]: { [Sequelize.Op.like]: `%${ValorBusqueda}%` },
          Estatus: [1, 2]
        }
      });
    case 2:
      return await Modelo.findAll({
        where: { Estatus: [1, 2] },
        order: [[NombreModelo, 'ASC']]
      });
    default:
      LanzarError('Tipo de búsqueda no válido', 400);
  }
};

const Crear = async (Datos) => {
  if (!Datos.NombreClasificacionProducto || Datos.NombreClasificacionProducto.trim() === '') {
    let contador = 1;
    let nombreGenerado = `Nombre por defecto ${contador}`;
    let existe = true;

    while (existe) {
      const registroExistente = await Modelo.findOne({
        where: { NombreClasificacionProducto: nombreGenerado }
      });

      if (registroExistente) {
        contador++;
        nombreGenerado = `Nombre por defecto ${contador}`;
      } else {
        existe = false;
      }
    }

    Datos.NombreClasificacionProducto = nombreGenerado;
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

  const Dato = Objeto.toJSON();
  if (Dato.UrlImagen) {
    Dato.UrlImagen = ConstruirUrlImagen(Dato.UrlImagen);
  }

  return Dato;
};

const Eliminar = async (Codigo) => {
  const Objeto = await Modelo.findOne({ where: { [CodigoModelo]: Codigo } });
  if (!Objeto) LanzarError('Registro no encontrado para eliminar', 404);

  const productos = await Producto.findAll({
    where: { CodigoClasificacionProducto: Codigo }
  });

  for (const producto of productos) {
    await ReporteProducto.destroy({
      where: { CodigoProducto: producto.CodigoProducto }
    });

    if (producto.UrlImagen) {
      const ImagenConstruida = ConstruirUrlImagen(producto.UrlImagen);
      await EliminarImagen(ImagenConstruida);
    }

    await producto.destroy();
  }

  if (Objeto.UrlImagen) {
    const ImagenConstruida = ConstruirUrlImagen(Objeto.UrlImagen);
    await EliminarImagen(ImagenConstruida);
  }

  await Objeto.destroy();

  return Objeto;
};
module.exports = { Listado, ObtenerPorCodigo, Buscar, Crear, Editar, Eliminar };
