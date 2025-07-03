const Servicio = require('../Servicios/RolServicio');
const ManejarError = require('../Utilidades/ErrorControladores');

const Listado = async (req, res) => {
  try {
    const Objeto = await Servicio.Listado();
    if (Objeto && Objeto.length > 0) {
      return res.json(Objeto);
    }
    return res.json(Objeto || []);
  } catch (error) {
    return ManejarError(error, res, 'Error al obtener los registros');
  }
};

const ObtenerPorCodigo = async (req, res) => {
  try {
    const { Codigo } = req.params;
    const Objeto = await Servicio.ObtenerPorCodigo(Codigo);
    if (Objeto) return res.json(Objeto);
    return res.status(404).json({ message: 'Registro no encontrado' });
  } catch (error) {
    return ManejarError(error, res, 'Error al obtener el registro');
  }
};

const Buscar = async (req, res) => {
  try {
    const { TipoBusqueda, ValorBusqueda } = req.params;
    const Objeto = await Servicio.Buscar(TipoBusqueda, ValorBusqueda);
    if (Objeto && Objeto.length > 0) return res.json(Objeto);
    return res.status(404).json({ message: 'No se encontraron registros' });
  } catch (error) {
    return ManejarError(error, res, 'Error al realizar la búsqueda');
  }
};

const Crear = async (req, res) => {
  try {
    await Servicio.Crear(req.body);
    return res.status(201).json({ message: 'Se guardó el registro exitosamente.' });
  } catch (error) {
    return ManejarError(error, res, 'Error al crear el registro');
  }
};

const Editar = async (req, res) => {
  try {
    const { Codigo } = req.params;
    const Objeto = await Servicio.Editar(Codigo, req.body);
    if (!Objeto) return res.status(404).json({ message: 'Registro no encontrado' });
    return res.status(200).json({ message: 'Se actualizó el registro exitosamente.' });
  } catch (error) {
    return ManejarError(error, res, 'Error al actualizar el registro');
  }
};

const Eliminar = async (req, res) => {
  try {
    const { Codigo } = req.params;
    const Objeto = await Servicio.Eliminar(Codigo);
    if (!Objeto) return res.status(404).json({ message: 'Registro no encontrado' });
    return res.status(200).json({ message: 'Registro eliminado exitosamente' });
  } catch (error) {
    return ManejarError(error, res, 'Error al eliminar el registro');
  }
};

module.exports = { Listado, ObtenerPorCodigo, Buscar, Crear, Editar, Eliminar };
