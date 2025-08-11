const Servicio = require('../Servicios/ReporteRedSocialServicio');
const ManejarError = require('../Utilidades/ErrorControladores');
const ResponderExito = require('../Utilidades/RespuestaExitosaControlador');

const ObtenerResumen = async (req, res) => {
  try {
    const { anio, mes } = req.params;
    const Resumen = await Servicio.ObtenerResumen(anio, mes);
    return ResponderExito(res, 'Resumen obtenido correctamente', Resumen);
  } catch (error) {
    return ManejarError(error, res, 'Error al obtener el resumen');
  }
};

const Listado = async (req, res) => {
  try {
    const Objeto = await Servicio.Listado();
    return ResponderExito(res, 'Registros obtenidos correctamente', Objeto || []);
  } catch (error) {
    return ManejarError(error, res, 'Error al obtener los registros');
  }
};

const ObtenerPorCodigo = async (req, res) => {
  try {
    const { Codigo } = req.params;
    const Objeto = await Servicio.ObtenerPorCodigo(Codigo);
    return ResponderExito(res, 'Registro obtenido correctamente', Objeto);
  } catch (error) {
    return ManejarError(error, res, 'Error al obtener el registro');
  }
};

const Buscar = async (req, res) => {
  try {
    const { TipoBusqueda, ValorBusqueda } = req.params;
    const Objeto = await Servicio.Buscar(TipoBusqueda, ValorBusqueda);
    return ResponderExito(res, 'Búsqueda realizada correctamente', Objeto || []);
  } catch (error) {
    return ManejarError(error, res, 'Error al realizar la búsqueda');
  }
};

const Crear = async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    const datosConIp = Array.isArray(req.body)
      ? req.body.map(dato => ({ ...dato, DireccionIp: ip }))
      : { ...req.body, DireccionIp: ip };

    const resultado = await Servicio.Crear(datosConIp);
    return ResponderExito(res, 'Se guardó el registro exitosamente.', resultado, 201);
  } catch (error) {
    return ManejarError(error, res, 'Error al crear el registro');
  }
};

const Editar = async (req, res) => {
  try {
    const { Codigo } = req.params;
    await Servicio.Editar(Codigo, req.body);
    return ResponderExito(res, 'Se actualizó el registro exitosamente.');
  } catch (error) {
    return ManejarError(error, res, 'Error al actualizar el registro');
  }
};

const Eliminar = async (req, res) => {
  try {
    const { Codigo } = req.params;
    await Servicio.Eliminar(Codigo);
    return ResponderExito(res, 'Registro eliminado exitosamente');
  } catch (error) {
    return ManejarError(error, res, 'Error al eliminar el registro');
  }
};

module.exports = { Listado, ObtenerPorCodigo, Buscar, Crear, Editar, Eliminar, ObtenerResumen };
