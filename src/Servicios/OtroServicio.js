const Sequelize = require('sequelize');
const BaseDatos = require('../BaseDatos/ConexionBaseDatos');
const Modelo = require('../Modelos/Otro')(BaseDatos, Sequelize.DataTypes);
const { EliminarImagen } = require('../Servicios/EliminarImagenServicio');
const { ConstruirUrlImagen } = require('../Utilidades/ConstruirUrlImagen');
const { LanzarError } = require('../Utilidades/ErrorServicios');

const NombreModelo = 'NombreOtro';
const CodigoModelo = 'CodigoOtro';

const Listado = async () => {
  const Registros = await Modelo.findAll({ where: { Estatus: [1, 2] } });

  return Registros.map(r => {
    const Dato = r.toJSON();
    if (Dato.UrlImagen) Dato.UrlImagen = ConstruirUrlImagen(Dato.UrlImagen);
    if (Dato.UrlImagen2) Dato.UrlImagen2 = ConstruirUrlImagen(Dato.UrlImagen2);
    return Dato;
  });
};

const ObtenerPorCodigo = async (Codigo) => {
  const Objeto = await Modelo.findOne({ where: { [CodigoModelo]: Codigo } });
  if (!Objeto) LanzarError('Registro no encontrado', 404);

  const Dato = Objeto.toJSON();
  if (Dato.UrlImagen) Dato.UrlImagen = ConstruirUrlImagen(Dato.UrlImagen);
  if (Dato.UrlImagen2) Dato.UrlImagen2 = ConstruirUrlImagen(Dato.UrlImagen2);
  return Dato;
};

const Buscar = async (TipoBusqueda, ValorBusqueda) => {
  switch (parseInt(TipoBusqueda)) {
    case 1:
      return await Modelo.findAll({
        where: {
          [NombreModelo]: { [Sequelize.Op.like]: `%${ValorBusqueda}%` },
          Estatus: [1, 2]
        },
      });
    case 2:
      return await Modelo.findAll({
        where: { Estatus: [1, 2] },
        order: [[NombreModelo, 'ASC']],
      });
    default:
      LanzarError('Tipo de búsqueda no válido', 400);
  }
};

const Crear = async (Datos) => {
  const Objeto = await Modelo.create(Datos);
  const Dato = Objeto.toJSON();
  if (Dato.UrlImagen) Dato.UrlImagen = ConstruirUrlImagen(Dato.UrlImagen);
  if (Dato.UrlImagen2) Dato.UrlImagen2 = ConstruirUrlImagen(Dato.UrlImagen2);
  return Dato;
};

const Editar = async (Codigo, Datos) => {
  const Objeto = await Modelo.findOne({ where: { [CodigoModelo]: Codigo } });
  if (!Objeto) LanzarError('Registro no encontrado para actualizar', 404);

  await Objeto.update(Datos);
  const Dato = Objeto.toJSON();
  if (Dato.UrlImagen) Dato.UrlImagen = ConstruirUrlImagen(Dato.UrlImagen);
  if (Dato.UrlImagen2) Dato.UrlImagen2 = ConstruirUrlImagen(Dato.UrlImagen2);
  return Dato;
};

const Eliminar = async (Codigo) => {
  const Objeto = await Modelo.findOne({ where: { [CodigoModelo]: Codigo } });
  if (!Objeto) LanzarError('Registro no encontrado para eliminar', 404);

  const CamposImagen = ['UrlImagen', 'UrlImagen2'];

  for (const campo of CamposImagen) {
    const urlOriginal = Objeto[campo];
    if (urlOriginal) {
      const urlConstruida = ConstruirUrlImagen(urlOriginal);
      try {
        await EliminarImagen(urlConstruida);
      } catch {
      }
    }
  }

  await Objeto.destroy();
  return Objeto;
};

module.exports = { Listado, ObtenerPorCodigo, Buscar, Crear, Editar, Eliminar };
