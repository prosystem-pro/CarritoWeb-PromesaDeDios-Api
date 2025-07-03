const Servicio = require('../Servicios/PermisoRolRecursoServicio');
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
    const { CodigoRol, CodigoPermiso, CodigoRecurso } = req.params;
    const Objeto = await Servicio.ObtenerPorCodigo(CodigoRol, CodigoPermiso, CodigoRecurso);
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
    const { CodigoRol, CodigoPermiso, CodigoRecurso } = req.params;
    const Datos = req.body;

    const Objeto = await Servicio.Editar(CodigoRol, CodigoPermiso, CodigoRecurso, Datos);

    if (!Objeto) {
      return res.status(404).json({ message: 'Registro no encontrado' });
    }

    return res.status(200).json({ message: 'Se actualizó el registro exitosamente.' });
  } catch (error) {
    return ManejarError(error, res, 'Error al actualizar el registro');
  }
};

const Eliminar = async (req, res) => {
  try {
    const { CodigoRol, CodigoPermiso, CodigoRecurso } = req.params;
    const Objeto = await Servicio.Eliminar(CodigoRol, CodigoPermiso, CodigoRecurso);
    if (!Objeto) return res.status(404).json({ message: 'Registro no encontrado' });
    return res.status(200).json({ message: 'Registro eliminado exitosamente' });
  } catch (error) {
    return ManejarError(error, res, 'Error al eliminar el registro');
  }
};

// Controlador para obtener permisos asignados a un rol
const ObtenerPermisosAsignados = async (req, res) => {
  const { CodigoRol } = req.params;

  try {
    // Llamada a la función FiltrarPermisos
    const permisos = await Servicio.FiltrarPermisos(CodigoRol);
    res.json(permisos);
  } catch (error) {
    ManejarError(error, res, 'Error al obtener los permisos asignados');
  }
};

const ObtenerRecursosDisponibles = async (req, res) => {
  const { CodigoRol, CodigoPermiso } = req.params;
  console.log('Código Rol:', CodigoRol); // Verifica que el CódigoRol está bien capturado
  console.log('Código Permiso:', CodigoPermiso); // Verifica que el CódigoPermiso está bien capturado

  // Validación de que los parámetros son números válidos
  if (isNaN(CodigoRol) || isNaN(CodigoPermiso)) {
    return res.status(400).json({
      message: "Código de rol o código de permiso no son números válidos",
    });
  }

  try {
    // Llamada a la función FiltrarRecursos
    const recursos = await Servicio.FiltrarRecursos(CodigoRol, CodigoPermiso);
    res.json(recursos); // Responder con los recursos disponibles
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los recursos disponibles', error: error.message });
  }
};

module.exports = { Listado, ObtenerPorCodigo, Buscar, Crear, Editar, Eliminar, ObtenerPermisosAsignados, ObtenerRecursosDisponibles };
