const { PermisoRolRecursoModelo, PermisoModelo, RecursoModelo } = require('../Relaciones/Relaciones');
const ManejarError = require('../Utilidades/ErrorServicios');
const { LanzarError } = require('../Utilidades/ErrorServicios');

const ObtenerPermisosPorRolYRecurso = async (CodigoRol, Recurso) => {
  try {

    const Datos = await PermisoRolRecursoModelo.findAll({
      where: { CodigoRol, Estatus: 1 },
      include: [
        {
          model: PermisoModelo,
          as: 'Permiso',
          attributes: ['NombrePermiso', 'Estatus'],
          where: { Estatus: 1 }
        },
        {
          model: RecursoModelo,
          as: 'Recurso',
          attributes: ['NombreRecurso', 'Estatus'],
          where: { NombreRecurso: Recurso, Estatus: 1 }
        }
      ],
      attributes: [],
      raw: true,
      nest: true
    });

    if (!Datos || Datos.length === 0) {
      LanzarError(`No se encontraron permisos para el rol ${CodigoRol} y recurso ${Recurso}`, 404, 'Alerta');
    }

    const datosFiltrados = Datos.filter(p => p.Permiso.Estatus === 1 && p.Recurso.Estatus === 1);

    return datosFiltrados.map(p => p.Permiso.NombrePermiso);

  } catch (error) {
    ManejarError(error, 'Error al obtener permisos');
  }
};

module.exports = { ObtenerPermisosPorRolYRecurso };
