const Sequelize = require('sequelize');
const BaseDatos = require('../BaseDatos/ConexionBaseDatos');
const Modelo = require('../Modelos/LoginPortada')(BaseDatos, Sequelize.DataTypes);
const { EliminarImagen } = require('../Servicios/EliminarImagenServicio');
const { ConstruirUrlImagen } = require('../Utilidades/ConstruirUrlImagen');
const { LanzarError } = require('../Utilidades/ErrorServicios');

const NombreModelo = 'Color';
const CodigoModelo = 'CodigoLoginPortada';

const Listado = async () => {
  const Registros = await Modelo.findAll({ where: { Estatus: [1, 2] } });

  return Registros.map(r => {
    const Dato = r.toJSON();

    Dato.UrlImagenPortada = ConstruirUrlImagen(Dato.UrlImagenPortada);
    Dato.UrlImagenDecorativaIzquierda = ConstruirUrlImagen(Dato.UrlImagenDecorativaIzquierda);
    Dato.UrlImagenDecorativaDerecha = ConstruirUrlImagen(Dato.UrlImagenDecorativaDerecha);

    return Dato;
  });
};

const ObtenerPorCodigo = async (Codigo) => {
  const Objeto = await Modelo.findOne({ where: { [CodigoModelo]: Codigo } });
  if (!Objeto) LanzarError('Registro no encontrado', 404);

  const Dato = Objeto.toJSON();

  Dato.UrlImagenPortada = ConstruirUrlImagen(Dato.UrlImagenPortada);
  Dato.UrlImagenDecorativaIzquierda = ConstruirUrlImagen(Dato.UrlImagenDecorativaIzquierda);
  Dato.UrlImagenDecorativaDerecha = ConstruirUrlImagen(Dato.UrlImagenDecorativaDerecha);

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
  const Nuevo = await Modelo.create(Datos);
  const Dato = Nuevo.toJSON();

  Dato.UrlImagenPortada = ConstruirUrlImagen(Dato.UrlImagenPortada);
  Dato.UrlImagenDecorativaIzquierda = ConstruirUrlImagen(Dato.UrlImagenDecorativaIzquierda);
  Dato.UrlImagenDecorativaDerecha = ConstruirUrlImagen(Dato.UrlImagenDecorativaDerecha);

  return Dato;
};

const Editar = async (Codigo, Datos) => {
  const Objeto = await Modelo.findOne({ where: { [CodigoModelo]: Codigo } });
  if (!Objeto) LanzarError('Registro no encontrado para actualizar', 404);

  await Objeto.update(Datos);
  const Dato = Objeto.toJSON();

  Dato.UrlImagenPortada = ConstruirUrlImagen(Dato.UrlImagenPortada);
  Dato.UrlImagenDecorativaIzquierda = ConstruirUrlImagen(Dato.UrlImagenDecorativaIzquierda);
  Dato.UrlImagenDecorativaDerecha = ConstruirUrlImagen(Dato.UrlImagenDecorativaDerecha);

  return Dato;
};

const Eliminar = async (Codigo) => {
  const Objeto = await Modelo.findOne({ where: { [CodigoModelo]: Codigo } });
  if (!Objeto) LanzarError('Registro no encontrado para eliminar', 404);

  const CamposImagen = [
    'UrlImagenPortada',
    'UrlImagenDecorativaIzquierda',
    'UrlImagenDecorativaDerecha'
  ];

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
