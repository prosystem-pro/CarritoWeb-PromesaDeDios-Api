const Sequelize = require('sequelize');
const BaseDatos = require('../BaseDatos/ConexionBaseDatos');
const Modelo = require('../Modelos/CarruselImagen')(BaseDatos, Sequelize.DataTypes);
const { EliminarImagen } = require('../Servicios/EliminarImagenServicio');
const { ConstruirUrlImagen } = require('../Utilidades/ConstruirUrlImagen');
const { LanzarError } = require('../Utilidades/ErrorServicios');

const NombreModelo = 'Orden';
const CodigoModelo = 'CodigoCarruselImagen';

const Listado = async () => {
  const Registros = await Modelo.findAll({ where: { Estatus: [1, 2] } });

  return Registros.map(r => {
    const Dato = r.toJSON();
    Dato.UrlImagen = ConstruirUrlImagen(Dato.UrlImagen);
    return Dato;
  });
};

const ObtenerPorCodigo = async (Codigo) => {
  const Registro = await Modelo.findOne({ where: { [CodigoModelo]: Codigo } });

  if (!Registro) LanzarError('Registro no encontrada', 404);

  const Dato = Registro.toJSON();
  Dato.UrlImagen = ConstruirUrlImagen(Dato.UrlImagen);
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
  const Registro = await Modelo.create(Datos);
  const Dato = Registro.toJSON();
  Dato.UrlImagen = ConstruirUrlImagen(Dato.UrlImagen);
  return Dato;
};

const Editar = async (Codigo, Datos) => {
  const Objeto = await Modelo.findOne({ where: { [CodigoModelo]: Codigo } });
  if (!Objeto) LanzarError('Registro no encontrado para editar', 404);

  await Objeto.update(Datos);

  const Dato = Objeto.toJSON();
  Dato.UrlImagen = ConstruirUrlImagen(Dato.UrlImagen);
  return Dato;
};

const Eliminar = async (Codigo) => {
  const Objeto = await Modelo.findOne({ where: { [CodigoModelo]: Codigo } });
  if (!Objeto) LanzarError('Registro no encontrado para eliminar', 404);

  const UrlImagenConstruida = ConstruirUrlImagen(Objeto.UrlImagen);
  await EliminarImagen(UrlImagenConstruida);

  await Objeto.destroy();
  return Objeto;
};

const ListadoPorCarrusel = async (CodigoCarrusel) => {
  const Registros = await Modelo.findAll({
    where: { CodigoCarrusel: CodigoCarrusel, Estatus: [1, 2] }
  });

  return Registros.map(r => {
    const Dato = r.toJSON();
    Dato.UrlImagen = ConstruirUrlImagen(Dato.UrlImagen);
    return Dato;
  });
};

module.exports = { Listado, ObtenerPorCodigo, Buscar, Crear, Editar, Eliminar, ListadoPorCarrusel };
