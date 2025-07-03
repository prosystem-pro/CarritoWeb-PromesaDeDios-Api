const { PermisoRolRecursoModelo, PermisoModelo, RecursoModelo } = require('../Relaciones/Relaciones');
const ManejarError = require('../Utilidades/ErrorServicios');

const ObtenerPermisosPorRolYRecurso = async (CodigoRol, Recurso) => {
  try {
    console.log(` Consultando permisos en la BD para Rol: ${CodigoRol}, Recurso: ${Recurso}`);

    const Datos = await PermisoRolRecursoModelo.findAll({
      where: { CodigoRol, Estatus: 1 }, 
      include: [
        {
          model: PermisoModelo,
          as: 'Permiso',
          attributes: ['NombrePermiso','Estatus'],
          where: { Estatus: 1 }
        },
        {
          model: RecursoModelo,
          as: 'Recurso',
          attributes: ['NombreRecurso','Estatus'],
          where: { NombreRecurso: Recurso, Estatus: 1 } 
        }
      ],
      attributes: [],
      raw: true,
      nest: true
    });

    console.log("Datos obtenidos de la BD:", Datos);

    if (!Datos || Datos.length === 0) {
      console.log(" ERROR: No se encontraron permisos en la BD.");
      return [];
    }

    const datosFiltrados = Datos.filter(Permiso => Permiso.Permiso.Estatus === 1 && Permiso.Recurso.Estatus === 1);
    
    console.log(" Permisos filtrados:", datosFiltrados.map(Permiso => Permiso.Permiso.NombrePermiso));

    return datosFiltrados.map(Permiso => Permiso.Permiso.NombrePermiso);
  } catch (error) {
    ManejarError(error, 'Error al obtener permisos');
  }
};

module.exports = { ObtenerPermisosPorRolYRecurso };
