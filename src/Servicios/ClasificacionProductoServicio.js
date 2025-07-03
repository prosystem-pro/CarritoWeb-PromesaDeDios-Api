const Sequelize = require('sequelize');
const BaseDatos = require('../BaseDatos/ConexionBaseDatos');
const Modelo = require('../Modelos/ClasificacionProducto')(BaseDatos, Sequelize.DataTypes);
const Producto = require('../Modelos/Producto')(BaseDatos, Sequelize.DataTypes);
const ReporteProducto = require('../Modelos/ReporteProducto')(BaseDatos, Sequelize.DataTypes);
const { EliminarImagen } = require('../Servicios/EliminarImagenServicio');
const { ConstruirUrlImagen } = require('../Utilidades/ConstruirUrlImagen');

const NombreModelo = 'NombreClasificacionProducto';
const CodigoModelo = 'CodigoClasificacionProducto'

const Listado = async () => {
  const Registros = await Modelo.findAll({ where: { Estatus: [1, 2] } });

  const Resultado = Registros.map(r => {
    const Dato = r.toJSON();

    if (Dato.UrlImagen) {
      Dato.UrlImagen = ConstruirUrlImagen(Dato.UrlImagen);
    }

    return Dato;
  });

  return Resultado;
};

const ObtenerPorCodigo = async (Codigo) => {
  const Registro = await Modelo.findOne({ where: { [CodigoModelo]: Codigo } });

  if (!Registro) return null;

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
        where: { [NombreModelo]: { [Sequelize.Op.like]: `%${ValorBusqueda}%` }, Estatus: [1, 2] }
      });
    case 2:
      return await Modelo.findAll({ where: { Estatus: [1, 2] }, order: [[NombreModelo, 'ASC']] });
    default:
      return null;
  }
};

const Crear = async (Datos) => {
  const Nuevo = await Modelo.create(Datos);
  const Dato = Nuevo.toJSON();

  if (Dato.UrlImagen) {
    Dato.UrlImagen = ConstruirUrlImagen(Dato.UrlImagen);
  }

  return Dato;
};

const Editar = async (Codigo, Datos) => {
  const Objeto = await Modelo.findOne({ where: { [CodigoModelo]: Codigo } });
  if (!Objeto) return null;

  await Objeto.update(Datos);
  const Dato = Objeto.toJSON();

  if (Dato.UrlImagen) {
    Dato.UrlImagen = ConstruirUrlImagen(Dato.UrlImagen);
  }

  return Dato;
};

const Eliminar = async (Codigo) => {
  try {
    const Objeto = await Modelo.findOne({ where: { [CodigoModelo]: Codigo } });
    if (!Objeto) return null;

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
  } catch (error) {
    console.error('Error en eliminación en cola:', error);
    throw error;
  }
};

module.exports = { Listado, ObtenerPorCodigo, Buscar, Crear, Editar, Eliminar };
