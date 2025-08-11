const Sequelize = require('sequelize');
const BaseDatos = require('../BaseDatos/ConexionBaseDatos');
const Modelo = require('../Modelos/MenuPortada')(BaseDatos, Sequelize.DataTypes);
const { EliminarImagen } = require('../Servicios/EliminarImagenServicio');
const { ConstruirUrlImagen } = require('../Utilidades/ConstruirUrlImagen');
const { LanzarError } = require('../Utilidades/ErrorServicios');

const NombreModelo = 'TituloMenu';
const CodigoModelo = 'CodigoMenuPortada';

const Listado = async () => {
  const Registros = await Modelo.findAll({ where: { Estatus: [1, 2] } });

  return Registros.map(r => {
    const Dato = r.toJSON();

    if (Dato.UrlImagenPortadaIzquierdo) {
      Dato.UrlImagenPortadaIzquierdo = ConstruirUrlImagen(Dato.UrlImagenPortadaIzquierdo);
    }
    if (Dato.UrlImagenPortadaDerecho) {
      Dato.UrlImagenPortadaDerecho = ConstruirUrlImagen(Dato.UrlImagenPortadaDerecho);
    }
    if (Dato.UrlImagenPresentacion) {
      Dato.UrlImagenPresentacion = ConstruirUrlImagen(Dato.UrlImagenPresentacion);
    }

    return Dato;
  });
};

const ObtenerPorCodigo = async (Codigo) => {
  const Registro = await Modelo.findOne({ where: { [CodigoModelo]: Codigo } });
  if (!Registro) LanzarError('Registro no encontrado', 404);

  const Dato = Registro.toJSON();

  if (Dato.UrlImagenPortadaIzquierdo) {
    Dato.UrlImagenPortadaIzquierdo = ConstruirUrlImagen(Dato.UrlImagenPortadaIzquierdo);
  }
  if (Dato.UrlImagenPortadaDerecho) {
    Dato.UrlImagenPortadaDerecho = ConstruirUrlImagen(Dato.UrlImagenPortadaDerecho);
  }
  if (Dato.UrlImagenPresentacion) {
    Dato.UrlImagenPresentacion = ConstruirUrlImagen(Dato.UrlImagenPresentacion);
  }

  return Dato;
};

const Buscar = async (TipoBusqueda, ValorBusqueda) => {
  switch (parseInt(TipoBusqueda)) {
    case 1:
      return await Modelo.findAll({
        where: {
          [NombreModelo]: { [Sequelize.Op.like]: `%${ValorBusqueda}%` },
          Estatus: [1, 2],
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
  return await Modelo.create(Datos);
};

const Editar = async (Codigo, Datos) => {
  const Objeto = await Modelo.findOne({ where: { [CodigoModelo]: Codigo } });
  if (!Objeto) LanzarError('Registro no encontrado para actualizar', 404);

  await Objeto.update(Datos);
  return Objeto;
};

const Eliminar = async (Codigo) => {
  const Objeto = await Modelo.findOne({ where: { [CodigoModelo]: Codigo } });
  if (!Objeto) LanzarError('Registro no encontrado para eliminar', 404);

  const CamposImagen = [
    'UrlImagenPortadaIzquierdo',
    'UrlImagenPortadaDerecho',
    'UrlImagenPresentacion',
  ];

  for (const campo of CamposImagen) {
    const urlOriginal = Objeto[campo];
    if (urlOriginal) {
      const urlConstruida = ConstruirUrlImagen(urlOriginal);
      await EliminarImagen(urlConstruida);
    }
  }

  await Objeto.destroy();
  return Objeto;
};

module.exports = { Listado, ObtenerPorCodigo, Buscar, Crear, Editar, Eliminar };
