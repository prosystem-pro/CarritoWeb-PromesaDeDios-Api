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
    const Datos = req.body;
    const Objeto = await Servicio.Editar(Datos);

    if (!Objeto) {
      return res.status(404).json({ message: 'Registro no encontrado' });
    }

    return res.status(200).json({ message: 'Se actualizó el registro exitosamente.' });
  } catch (error) {
    return ManejarError(error, res, 'Error al actualizar el registro');
  }
};


const EliminarPorRol = async (req, res) => {
  try {
    const { CodigoRol } = req.params;

    const resultado = await Servicio.EliminarPorRol(CodigoRol);

    if (!resultado) {
      return res.status(404).json({ message: 'No se encontraron registros para eliminar con ese CodigoRol' });
    }

    return res.status(200).json({ message: resultado.mensaje });
  } catch (error) {
    return ManejarError(error, res, 'Error al eliminar los registros del rol');
  }
};

const EliminarPorRolRecurso = async (req, res) => {
  try {
    const { CodigoRol, CodigoRecurso } = req.params;

    const cantidad = await Servicio.EliminarPorRolRecurso(CodigoRol, CodigoRecurso);

    if (cantidad === 0) {
      return res.status(404).json({
        Titulo: 'Alerta',
        Alerta: `No se encontraron registros con el rol ${CodigoRol} y recurso ${CodigoRecurso}.`
      });
    }

    return res.status(200).json({
      Titulo: 'Éxito',
      Exito: `Se eliminaron ${cantidad} registros para el rol ${CodigoRol} y recurso ${CodigoRecurso}.`
    });

  } catch (error) {
    return ManejarError(error, res, 'Error al eliminar los registros por rol y recurso');
  }
};

const EliminarPorRolRecursoPermiso = async (req, res) => {
  const { CodigoRol, CodigoRecurso, CodigoPermiso } = req.params;

  try {
    const cantidadEliminada = await Servicio.EliminarPorPermisoRolRecurso(CodigoRol, CodigoRecurso, CodigoPermiso);

    if (cantidadEliminada === 0) {
      return res.status(404).json({
        Alerta: `No se encontró un registro con rol ${CodigoRol}, recurso ${CodigoRecurso} y permiso ${CodigoPermiso}.`
      });
    }

    return res.status(200).json({
      Exito: `Registro eliminado correctamente con rol ${CodigoRol}, recurso ${CodigoRecurso} y permiso ${CodigoPermiso}.`
    });
  } catch (error) {
    console.error('Error en controlador al eliminar registro específico:', error);
    return res.status(500).json({
      Error: 'Ocurrió un error al intentar eliminar el registro.',
      Detalles: error.message
    });
  }
};

const FiltrarRoles = async (req, res) => {
  try {
    const roles = await Servicio.FiltrarRoles();
    res.json(roles);
  } catch (error) {
    ManejarError(error, res, 'Error al filtrar roles con recursos incompletos');
  }
};

const FiltrarRecursos = async (req, res) => {
  const { CodigoRol } = req.params;

  if (isNaN(CodigoRol)) {
    return res.status(400).json({ message: "Código de rol inválido" });
  }

  try {
    const recursosDisponibles = await Servicio.FiltrarRecursos(CodigoRol);
    res.json(recursosDisponibles);
  } catch (error) {
    ManejarError(error, res, 'Error al filtrar recursos');
  }
};

const FiltrarPermisos = async (req, res) => {
  const { CodigoRol, CodigoRecurso } = req.params;

  if (isNaN(CodigoRol) || isNaN(CodigoRecurso)) {
    return res.status(400).json({ message: "Código de rol o recurso inválido" });
  }

  try {
    const permisosDisponibles = await Servicio.FiltrarPermisos(CodigoRol, CodigoRecurso);
    res.json(permisosDisponibles);
  } catch (error) {
    ManejarError(error, res, 'Error al filtrar permisos');
  }
};
const ObtenerResumenPermisos = async (req, res) => {
  try {
    const permisosUnicos = await Servicio.ObtenerResumenPermisosUnicos();
    return res.json({ permisos: permisosUnicos });
  } catch (error) {
    return ManejarError(error, res, 'Error al obtener resumen de permisos');
  }
};

module.exports = { Listado, ObtenerPorCodigo, 
  Buscar, Crear, 
  Editar, FiltrarRoles, 
  FiltrarRecursos, FiltrarPermisos, 
  EliminarPorRol, EliminarPorRolRecurso,
  EliminarPorRolRecursoPermiso,
  ObtenerResumenPermisos
};
