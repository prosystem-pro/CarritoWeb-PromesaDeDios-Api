const Sequelize = require('sequelize');
const BaseDatos = require('../BaseDatos/ConexionBaseDatos');
const Modelo = require('../Modelos/Producto')(BaseDatos, Sequelize.DataTypes);
const ReporteProducto = require('../Modelos/ReporteProducto')(BaseDatos, Sequelize.DataTypes);
const { EliminarImagen } = require('../Servicios/EliminarImagenServicio');
const { ConstruirUrlImagen } = require('../Utilidades/ConstruirUrlImagen'); 

const NombreModelo= 'NombreProducto';
const CodigoModelo= 'CodigoProducto'

const Listado = async (Usuario) => {
  let estatusPermitido = [1];

  if (Usuario && (Usuario.NombreRol === 'Administrador' || Usuario.SuperAdmin === 1)) {
    estatusPermitido = [1, 2];
  }

  const Registros = await Modelo.findAll({
    where: { Estatus: estatusPermitido }
  });

  const Resultado = Registros.map(r => {
    const Dato = r.toJSON();
    Dato.UrlImagen = ConstruirUrlImagen(Dato.UrlImagen); 
    return Dato;
  });

  return Resultado;
};

const ObtenerPorCodigo = async (Codigo) => {
  const Registro = await Modelo.findOne({ where: { [CodigoModelo]: Codigo } });

  if (!Registro) return null;

  const Dato = Registro.toJSON();
  Dato.UrlImagen = ConstruirUrlImagen(Dato.UrlImagen);

  return Dato;
};

const Buscar = async (TipoBusqueda, ValorBusqueda) => {
  let Registros = [];

  switch (parseInt(TipoBusqueda)) {
    case 1:
      Registros = await Modelo.findAll({
        where: {
          [NombreModelo]: { [Sequelize.Op.like]: `%${ValorBusqueda}%` },
          Estatus: [1, 2]
        }
      });
      break;
    case 2:
      Registros = await Modelo.findAll({
        where: { Estatus: [1, 2] },
        order: [[NombreModelo, 'ASC']]
      });
      break;
    default:
      return null;
  }

  return Registros.map(r => {
    const Dato = r.toJSON();
    Dato.UrlImagen = ConstruirUrlImagen(Dato.UrlImagen);
    return Dato;
  });
};

const Crear = async (Datos) => {
  return await Modelo.create(Datos);
};

const Editar = async (Codigo, Datos) => {
  const Objeto = await Modelo.findOne({ where: { [CodigoModelo]: Codigo } });
  if (!Objeto) return null;
  await Objeto.update(Datos);
  return Objeto;
};

const Eliminar = async (Codigo) => {
  try {
    const Objeto = await Modelo.findOne({ where: { [CodigoModelo]: Codigo } });
    if (!Objeto) return null;

    await ReporteProducto.destroy({
      where: { CodigoProducto: Codigo }
    });

    const UrlImagenOriginal = Objeto.UrlImagen;
    if (UrlImagenOriginal) {
      const UrlImagenConstruida = ConstruirUrlImagen(UrlImagenOriginal);
      await EliminarImagen(UrlImagenConstruida);
    }

    await Objeto.destroy();

    return Objeto;
  } catch (error) {
    console.error('Error en eliminación en cola:', error);
    throw error;
  }
};




const ListadoPorClasificacion = async (Codigo) => {
  const Registros = await Modelo.findAll({
    where: {
      CodigoClasificacionProducto: Codigo,
      Estatus: [1, 2]
    }
  });

  const Resultado = Registros.map(r => {
    const Dato = r.toJSON();
    Dato.UrlImagen = ConstruirUrlImagen(Dato.UrlImagen); 
    return Dato;
  });

  return Resultado;
};

module.exports = { Listado, ObtenerPorCodigo, Buscar, Crear, Editar, Eliminar, ListadoPorClasificacion };
