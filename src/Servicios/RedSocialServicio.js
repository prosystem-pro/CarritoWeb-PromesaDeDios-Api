const Sequelize = require('sequelize');
const BaseDatos = require('../BaseDatos/ConexionBaseDatos');
const Modelo = require('../Modelos/RedSocial')(BaseDatos, Sequelize.DataTypes);
const ModeloRedSocialImagen = require('../Modelos/RedSocialImagen')(BaseDatos, Sequelize.DataTypes);
const ReporteRedSocial = require('../Modelos/ReporteRedSocial')(BaseDatos, Sequelize.DataTypes);
const { RedSocial, RedSocialImagen } = require('../Relaciones/Relaciones');
const { EliminarImagen } = require('../Servicios/EliminarImagenServicio');
const { ConstruirUrlImagen } = require('../Utilidades/ConstruirUrlImagen');

const { Op } = require('sequelize');

const NombreModelo = 'NombreRedSocial';
const CodigoModelo = 'CodigoRedSocial'

const Listado = async (ubicacionFiltro = '') => {
  const Registros = await RedSocial.findAll({
    where: { Estatus: [1, 2] },
    include: [{
      model: RedSocialImagen,
      as: 'Imagenes',
      required: false,
      where: {
        Estatus: 1,
        ...(ubicacionFiltro && {
          Ubicacion: {
            [Op.like]: `%${ubicacionFiltro}%`
          }
        })
      },
      attributes: ['CodigoRedSocialImagen', 'UrlImagen', 'Ubicacion']
    }]
  });

  const Resultado = Registros.map(r => {
    const Dato = r.toJSON();

    if (Dato.Imagenes && Array.isArray(Dato.Imagenes)) {
      Dato.Imagenes = Dato.Imagenes.map(img => {
        img.UrlImagen = ConstruirUrlImagen(img.UrlImagen);
        return img;
      });
    }

    return Dato;
  });

  return Resultado;
};


const ObtenerPorCodigo = async (Codigo) => {
  return await Modelo.findOne({ where: { [CodigoModelo]: Codigo } });
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

  const total = await Modelo.count({ where: { Estatus: [1, 2] } });

  if (total >= 8) {
    throw new Error('No se pueden crear más de 8 redes sociales activas.');
  }

  return await Modelo.create(Datos);
};


const Editar = async (Codigo, Datos) => {
  const Objeto = await Modelo.findOne({ where: { [CodigoModelo]: Codigo } });
  if (!Objeto) return null;

  const estatusAntes = Objeto.Estatus;
  const estatusNuevo = Datos.Estatus;

  await Objeto.update(Datos);

  if (typeof estatusNuevo !== 'undefined' && estatusNuevo !== estatusAntes) {
    await ModeloRedSocialImagen.update(
      { Estatus: estatusNuevo },
      { where: { CodigoRedSocial: Codigo } }
    );
  }

  return Objeto;
};


const Eliminar = async (Codigo) => {
  try {
    await ReporteRedSocial.destroy({
      where: { CodigoRedSocial: Codigo }
    });

    const Objeto = await RedSocial.findOne({
      where: { [CodigoModelo]: Codigo },
      include: [{
        model: RedSocialImagen,
        as: 'Imagenes',
        where: { Estatus: 1 },
        required: false
      }]
    });

    if (!Objeto) return null;

    if (Objeto.Imagenes?.length > 0) {
      for (const imagen of Objeto.Imagenes) {
        try {
          if (imagen.UrlImagen) {
            const urlConstruida = ConstruirUrlImagen(imagen.UrlImagen);
            await EliminarImagen(urlConstruida);
          }
          await imagen.destroy();
        } catch (err) {
          console.error(`Error al eliminar imagen con código ${imagen.CodigoRedSocialImagen}:`, err);
        }
      }
    }

    if (Objeto.UrlImagen) {
      const urlConstruidaPrincipal = ConstruirUrlImagen(Objeto.UrlImagen);
      await EliminarImagen(urlConstruidaPrincipal);
    }

    await Objeto.destroy();

    return Objeto;
  } catch (error) {
    console.error('Error en eliminación de red social:', error);
    throw error;
  }
};




module.exports = { Listado, ObtenerPorCodigo, Buscar, Crear, Editar, Eliminar };
