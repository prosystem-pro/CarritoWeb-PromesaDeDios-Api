const Sequelize = require('sequelize');
const BaseDatos = require('../BaseDatos/ConexionBaseDatos');
const Modelo = require('../Modelos/PermisoRolRecurso')(BaseDatos, Sequelize.DataTypes);
const { PermisoRolRecursoModelo, PermisoModelo, RecursoModelo, RolModelo } = require('../Relaciones/Relaciones');

const NombreModelo = 'CodigoPermiso';
const CodigoModelo = 'CodigoEmpresa';

const Listado = async () => {
  return await PermisoRolRecursoModelo.findAll({
    where: { Estatus: [1, 2] },
    attributes: ['CodigoRol', 'CodigoPermiso', 'CodigoRecurso', 'Estatus'],
    include: [
      {
        model: RolModelo,
        as:'Rol',
        attributes: ['NombreRol'], 
        required: true,
      },
      {
        model: PermisoModelo,
        as: 'Permiso',
        attributes: ['NombrePermiso'], 
        required: true,
      },
      {
        model: RecursoModelo,
        as: 'Recurso',
        attributes: ['NombreRecurso'], 
        required: true,
      },
    ],
  });
};


const ObtenerPorCodigo = async (CodigoRol, CodigoPermiso,CodigoRecurso) => {
    return await Modelo.findOne({ where: { CodigoRol: CodigoRol, CodigoPermiso: CodigoPermiso, CodigoRecurso: CodigoRecurso } });
};

const Buscar = async (TipoBusqueda, ValorBusqueda) => {
  switch (parseInt(TipoBusqueda)) {
    case 1:
      return await Modelo.findAll({
        where: { [NombreModelo]: { [Sequelize.Op.like]: `%${ValorBusqueda}%` }, Estatus: [1,2] }
      });
    case 2:
      return await Modelo.findAll({ where: { Estatus: [1,2] }, order: [[NombreModelo, 'ASC']] });
    default:
      return null;
  }
};

const Crear = async (Datos) => {
  return await Modelo.create(Datos);
};

const Editar = async (CodigoRol, CodigoPermiso, CodigoRecurso, Datos) => {
    const Objeto = await Modelo.findOne({ where: { CodigoRol: CodigoRol, CodigoPermiso: CodigoPermiso, CodigoRecurso: CodigoRecurso } });
  
    if (!Objeto) {
      return null;
    }
    const ClaveCambia = CodigoRol !== Datos.CodigoRol || CodigoPermiso !== Datos.CodigoPermiso || CodigoRecurso !== CodigoRecurso;
  
    if (ClaveCambia) {
      await Objeto.destroy();
  
      const NuevoObjeto = await Modelo.create({
        CodigoRol: Datos.CodigoRol,
        CodigoPermiso: Datos.CodigoPermiso,
        CodigoRecurso: Datos.CodigoRecurso,
        Estatus: Datos.Estatus
      });
  
      return NuevoObjeto;
    }
    
    await Objeto.update({ Estatus: Datos.Estatus });
  
    return Objeto;
  };
  
  const Eliminar = async (CodigoRol, CodigoPermiso, CodigoRecurso) => {
    const Objeto = await Modelo.findOne({ where: { CodigoRol: CodigoRol, CodigoPermiso: CodigoPermiso, CodigoRecurso: CodigoRecurso } });
    if (!Objeto) return null;
    await Objeto.destroy();
    return Objeto;
  };


  const FiltrarPermisos = async (CodigoRol) => {
      const permisos = await PermisoModelo.findAll(); 
      const recursos = await RecursoModelo.findAll();
  
      const permisosAsignados = await PermisoRolRecursoModelo.findAll({
        where: { CodigoRol },
        include: [
          { model: PermisoModelo, as: 'Permiso', attributes: ['CodigoPermiso'] },
          { model: RecursoModelo, as: 'Recurso', attributes: ['CodigoRecurso'] },
        ],
      });
  
      const permisosConRecursosPendientes = [];
  
      for (let permiso of permisos) {
        const recursosAsignados = permisosAsignados.filter(item => item.Permiso.CodigoPermiso === permiso.CodigoPermiso);
  
        const recursosAsignadosCount = recursosAsignados.length;
        const recursosTotales = recursos.length;
  
        if (recursosAsignadosCount < recursosTotales) {
          permisosConRecursosPendientes.push({
            CodigoPermiso: permiso.CodigoPermiso,
            NombrePermiso: permiso.NombrePermiso,
            RecursosPendientes: recursosTotales - recursosAsignadosCount,
          });
        }
      }
  
      return permisosConRecursosPendientes;
  };
  
  
  const FiltrarRecursos = async (CodigoRol, CodigoPermiso) => {
    console.log('Código Rol:', CodigoRol);
    console.log('Código Permiso:', CodigoPermiso);
  
    try {
      // Obtener todos los recursos en la BD
      const TodosLosRecursos = await RecursoModelo.findAll();
      console.log('Todos los Recursos en la BD:', TodosLosRecursos.map(r => r.CodigoRecurso));
  
      // Obtener los recursos asignados al CodigoRol y CodigoPermiso
      const RecursosAsignados = await PermisoRolRecursoModelo.findAll({
        where: { CodigoRol, CodigoPermiso },
        attributes: ['CodigoRecurso'],
      });
  
      console.log('RecursosAsignados sin procesar:', RecursosAsignados);
  
      // Si no hay recursos asignados, devolvemos todos los disponibles
      if (!RecursosAsignados.length) {
        console.log("No hay recursos asignados, devolviendo todos los recursos.");
        return TodosLosRecursos;
      }
  
      const RecursosAsignadosIds = RecursosAsignados.map((item) => item.CodigoRecurso);
      console.log('Recursos Asignados:', RecursosAsignadosIds);
  
      // Obtener los recursos disponibles que aún no están asignados
      const RecursosDisponibles = await RecursoModelo.findAll({
        where: RecursosAsignadosIds.length > 0
          ? { CodigoRecurso: { [Sequelize.Op.notIn]: RecursosAsignadosIds } }
          : {},
      });
  
      console.log('Recursos Disponibles:', RecursosDisponibles.map(r => r.CodigoRecurso));
  
      return RecursosDisponibles;
    } catch (error) {
      console.error('Error en FiltrarRecursos:', error);
      throw new Error('Error al obtener los recursos pendientes');
    }
  };
  
  

module.exports = { Listado, ObtenerPorCodigo, Buscar, Crear, Editar, Eliminar, FiltrarPermisos, FiltrarRecursos };
