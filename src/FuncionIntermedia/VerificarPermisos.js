const { ObtenerPermisosPorRolYRecurso } = require('../Servicios/PermisoPorRolRecursoServicio');
const ManejarError = require('../Utilidades/ErrorControladores');

const VerificarPermisos = (Permiso, Recurso) => {
  return async (req, res, next) => {
    try {
      const { CodigoRol, SuperAdmin } = req.Datos;

      if (SuperAdmin === 1) {
        return next();
      }

      if (!CodigoRol) {
        return res.status(403).json({ error: 'No autorizado, rol no proporcionado' });
      }

      const Permisos = await ObtenerPermisosPorRolYRecurso(CodigoRol, Recurso);

      if (!Permisos.includes(Permiso)) {
        return res.status(403).json({ error: 'No tienes permiso para realizar esta acción' });
      }

      next();
    } catch (error) {
      ManejarError(error, res, 'Error verificando permisos');
    }
  };
};

module.exports = VerificarPermisos;
