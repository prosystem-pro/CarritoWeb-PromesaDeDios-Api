const Servicio = require('../Servicios/LogoServicio');
const ManejarError = require('../Utilidades/ErrorControladores');
const ResponderExito = require('../Utilidades/RespuestaExitosaControlador');

const Listado = async (req, res) => {
  try {
    const Resultado = await Servicio.Listado();
    return ResponderExito(res, 'Listado exitoso', Resultado);
  } catch (error) {
    return ManejarError(error, res, 'Error al obtener los registros');
  }
};

const ObtenerPorCodigo = async (req, res) => {
  try {
    const Resultado = await Servicio.ObtenerPorCodigo(req.params.Codigo);
    return ResponderExito(res, 'Consulta exitosa', Resultado);
  } catch (error) {
    return ManejarError(error, res, 'Error al obtener el registro');
  }
};

const Buscar = async (req, res) => {
  try {
    const Resultado = await Servicio.Buscar(req.params.TipoBusqueda, req.params.ValorBusqueda);
    return ResponderExito(res, 'Búsqueda exitosa', Resultado);
  } catch (error) {
    return ManejarError(error, res, 'Error al realizar la búsqueda');
  }
};

const Crear = async (req, res) => {
  try {
    await Servicio.Crear(req.body);
    return ResponderExito(res, 'Registro creado exitosamente', null, 201);
  } catch (error) {
    return ManejarError(error, res, 'Error al crear el registro');
  }
};

const Editar = async (req, res) => {
  try {
    await Servicio.Editar(req.params.Codigo, req.body);
    return ResponderExito(res, 'Registro actualizado exitosamente');
  } catch (error) {
    return ManejarError(error, res, 'Error al actualizar el registro');
  }
};

const Eliminar = async (req, res) => {
  try {
    await Servicio.Eliminar(req.params.Codigo);
    return ResponderExito(res, 'Registro eliminado exitosamente');
  } catch (error) {
    return ManejarError(error, res, 'Error al eliminar el registro');
  }
};

module.exports = { Listado, ObtenerPorCodigo, Buscar, Crear, Editar, Eliminar };
