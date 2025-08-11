const Servicio = require('../Servicios/IconoServicio');
const ManejarError = require('../Utilidades/ErrorControladores');
const ResponderExito = require('../Utilidades/RespuestaExitosaControlador');

const Listado = async (req, res) => {
  try {
    const Objeto = await Servicio.Listado();
    return ResponderExito(res, 'Listado obtenido correctamente', Objeto || []);
  } catch (error) {
    return ManejarError(error, res, 'Error al obtener los registros');
  }
};

const ObtenerPorCodigo = async (req, res) => {
  try {
    const { Codigo } = req.params;
    const Objeto = await Servicio.ObtenerPorCodigo(Codigo);
    if (Objeto) return ResponderExito(res, 'Registro obtenido correctamente', Objeto);
    return res.status(404).json({ message: 'Registro no encontrado' });
  } catch (error) {
    return ManejarError(error, res, 'Error al obtener el registro');
  }
};

const Buscar = async (req, res) => {
  try {
    const { TipoBusqueda, ValorBusqueda } = req.params;
    const Objeto = await Servicio.Buscar(TipoBusqueda, ValorBusqueda);
    if (Objeto && Objeto.length > 0) return ResponderExito(res, 'Resultados encontrados', Objeto);
    return res.status(404).json({ message: 'No se encontraron registros' });
  } catch (error) {
    return ManejarError(error, res, 'Error al realizar la búsqueda');
  }
};

const Crear = async (req, res) => {
  try {
    await Servicio.Crear(req.body);
    return ResponderExito(res, 'Se guardó el registro exitosamente.', null, 201);
  } catch (error) {
    return ManejarError(error, res, 'Error al crear el registro');
  }
};

const Editar = async (req, res) => {
  try {
    const { Codigo } = req.params;
    const Objeto = await Servicio.Editar(Codigo, req.body);
    if (!Objeto) return res.status(404).json({ message: 'Registro no encontrado' });
    return ResponderExito(res, 'Se actualizó el registro exitosamente.');
  } catch (error) {
    return ManejarError(error, res, 'Error al actualizar el registro');
  }
};

const Eliminar = async (req, res) => {
  try {
    const { Codigo } = req.params;
    const Objeto = await Servicio.Eliminar(Codigo);
    if (!Objeto) return res.status(404).json({ message: 'Registro no encontrado' });
    return ResponderExito(res, 'Registro eliminado exitosamente');
  } catch (error) {
    return ManejarError(error, res, 'Error al eliminar el registro');
  }
};

module.exports = { Listado, ObtenerPorCodigo, Buscar, Crear, Editar, Eliminar };
