const Sequelize = require('sequelize');
const BaseDatos = require('../BaseDatos/ConexionBaseDatos');
const Modelo = require('../Modelos/ProductoPortada')(BaseDatos, Sequelize.DataTypes);
const { EliminarImagen } = require('../Servicios/EliminarImagenServicio');
const { ConstruirUrlImagen } = require('../Utilidades/ConstruirUrlImagen');
const { LanzarError } = require('../Utilidades/ErrorServicios');

const NombreModelo = 'TituloPortada';
const CodigoModelo = 'CodigoProductoPortada';

const Listado = async () => {
  return await Modelo.findAll({ where: { Estatus: [1, 2] } });
};

const ObtenerPorCodigo = async (Codigo) => {
  const registro = await Modelo.findOne({ where: { [CodigoModelo]: Codigo } });
  if (!registro) LanzarError('Registro no encontrado', 404);
  return registro;
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
      LanzarError('Tipo de búsqueda inválido', 400);
  }
};

const Crear = async (Datos) => {
  if (!Datos || !Datos[NombreModelo]) LanzarError('Datos inválidos para crear registro', 400);
  return await Modelo.create(Datos);
};

const Editar = async (Codigo, Datos) => {
  const registro = await Modelo.findOne({ where: { [CodigoModelo]: Codigo } });
  if (!registro) LanzarError('Registro no encontrado para editar', 404);
  await registro.update(Datos);
  return registro;
};

const Eliminar = async (Codigo) => {
  const registro = await Modelo.findOne({ where: { [CodigoModelo]: Codigo } });
  if (!registro) LanzarError('Registro no encontrado para eliminar', 404);

  const CamposImagen = [
    'UrlImagenNavbar',
    'UrlImagenCarrito'
  ];

  for (const campo of CamposImagen) {
    const urlOriginal = registro[campo];
    if (urlOriginal) {
      const urlConstruida = ConstruirUrlImagen(urlOriginal);
      try {
        await EliminarImagen(urlConstruida);
      } catch (error) {
        console.warn(`No se pudo eliminar la imagen del campo "${campo}": ${error.message}`);
      }
    }
  }

  await registro.destroy();
  return registro;
};

module.exports = { Listado, ObtenerPorCodigo, Buscar, Crear, Editar, Eliminar };
