const Sequelize = require('sequelize');
const BaseDatos = require('../BaseDatos/ConexionBaseDatos');
const Modelo = require('../Modelos/RedSocial')(BaseDatos, Sequelize.DataTypes);
const ModeloRedSocialImagen = require('../Modelos/RedSocialImagen')(BaseDatos, Sequelize.DataTypes);
const ReporteRedSocial = require('../Modelos/ReporteRedSocial')(BaseDatos, Sequelize.DataTypes);
const { RedSocial, RedSocialImagen } = require('../Relaciones/Relaciones');
const { EliminarImagen } = require('../Servicios/EliminarImagenServicio');
const { ConstruirUrlImagen } = require('../Utilidades/ConstruirUrlImagen');
const { LanzarError } = require('../Utilidades/ErrorServicios');

const { Op } = require('sequelize');

const NombreModelo = 'NombreRedSocial';
const CodigoModelo = 'CodigoRedSocial';

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

  return Registros.map(r => {
    const Dato = r.toJSON();
    if (Array.isArray(Dato.Imagenes)) {
      Dato.Imagenes = Dato.Imagenes.map(img => {
        img.UrlImagen = ConstruirUrlImagen(img.UrlImagen);
        return img;
      });
    }
    return Dato;
  });
};

const ObtenerPorCodigo = async (Codigo) => {
  const Registro = await Modelo.findOne({ where: { [CodigoModelo]: Codigo } });
  if (!Registro) LanzarError('Registro no encontrado', 404);
  return Registro;
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
      LanzarError('Tipo de búsqueda inválido', 400);
  }
};

const Crear = async (Datos) => {
  const total = await Modelo.count({ where: { Estatus: [1, 2] } });
  if (total >= 8) LanzarError('No se pueden crear más de 8 registros activos.', 400);
  return await Modelo.create(Datos);
};

const Editar = async (Codigo, Datos) => {
  const Objeto = await Modelo.findOne({ where: { [CodigoModelo]: Codigo } });
  if (!Objeto) LanzarError('Registro no encontrado para editar', 404);

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
  // Eliminar registros relacionados
  await ReporteRedSocial.destroy({ where: { CodigoRedSocial: Codigo } });

  const Objeto = await RedSocial.findOne({
    where: { [CodigoModelo]: Codigo },
    include: [{
      model: RedSocialImagen,
      as: 'Imagenes',
      where: { Estatus: 1 },
      required: false
    }]
  });

  if (!Objeto) LanzarError('Registro no encontrado para eliminar', 404);

  // Eliminar imágenes relacionadas
  if (Array.isArray(Objeto.Imagenes)) {
    for (const imagen of Objeto.Imagenes) {
      if (imagen.UrlImagen) {
        const urlConstruida = ConstruirUrlImagen(imagen.UrlImagen);
        try {
          await EliminarImagen(urlConstruida);
        } catch (err) {
          console.error(`Error al eliminar imagen ${imagen.CodigoRedSocialImagen}:`, err);
        }
      }
      await imagen.destroy();
    }
  }

  // Eliminar imagen principal si existe
  if (Objeto.UrlImagen) {
    const urlConstruidaPrincipal = ConstruirUrlImagen(Objeto.UrlImagen);
    try {
      await EliminarImagen(urlConstruidaPrincipal);
    } catch (err) {
      console.error('Error al eliminar imagen principal:', err);
    }
  }

  await Objeto.destroy();
  return Objeto;
};

module.exports = { Listado, ObtenerPorCodigo, Buscar, Crear, Editar, Eliminar };
