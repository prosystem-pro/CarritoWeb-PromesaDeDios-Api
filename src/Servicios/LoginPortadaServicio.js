const Sequelize = require('sequelize');
const BaseDatos = require('../BaseDatos/ConexionBaseDatos');
const Modelo = require('../Modelos/LoginPortada')(BaseDatos, Sequelize.DataTypes);
const { EliminarImagen } = require('../Servicios/EliminarImagenServicio');
const { ConstruirUrlImagen } = require('../Utilidades/ConstruirUrlImagen');

const NombreModelo= 'Color';
const CodigoModelo= 'CodigoLoginPortada'

const Listado = async () => {
  const Registros = await Modelo.findAll({ where: { Estatus: [1, 2] } });

  const Resultado = Registros.map(r => {
    const Dato = r.toJSON();

    Dato.UrlImagenPortada = ConstruirUrlImagen(Dato.UrlImagenPortada);
    Dato.UrlImagenDecorativaIzquierda = ConstruirUrlImagen(Dato.UrlImagenDecorativaIzquierda);
    Dato.UrlImagenDecorativaDerecha = ConstruirUrlImagen(Dato.UrlImagenDecorativaDerecha);

    return Dato;
  });

  return Resultado;
};

const ObtenerPorCodigo = async (Codigo) => {
  const Objeto = await Modelo.findOne({ where: { [CodigoModelo]: Codigo } });
  if (!Objeto) return null;

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
        where: { [NombreModelo]: { [Sequelize.Op.like]: `%${ValorBusqueda}%` }, Estatus:  [1,2] }
      });
    case 2:
      return await Modelo.findAll({ where: { Estatus:  [1,2] }, order: [[NombreModelo, 'ASC']] });
    default:
      return null;
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
  if (!Objeto) return null;

  await Objeto.update(Datos);

  const Dato = Objeto.toJSON();

  Dato.UrlImagenPortada = ConstruirUrlImagen(Dato.UrlImagenPortada);
  Dato.UrlImagenDecorativaIzquierda = ConstruirUrlImagen(Dato.UrlImagenDecorativaIzquierda);
  Dato.UrlImagenDecorativaDerecha = ConstruirUrlImagen(Dato.UrlImagenDecorativaDerecha);

  return Dato;
};

const Eliminar = async (Codigo) => {
  try {
    const Objeto = await Modelo.findOne({ where: { [CodigoModelo]: Codigo } });
    if (!Objeto) return null;

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
        } catch (error) {
          console.warn(`No se pudo eliminar la imagen del campo "${campo}": ${error.message}`);
        }
      }
    }

    await Objeto.destroy();
    return Objeto;

  } catch (error) {
    console.error("Error en la función Eliminar:", error.message);
    throw error;
  }
};



module.exports = { Listado, ObtenerPorCodigo, Buscar, Crear, Editar, Eliminar };
