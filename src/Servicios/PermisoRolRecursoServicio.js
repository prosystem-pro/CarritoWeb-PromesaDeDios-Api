const Sequelize = require('sequelize');
const BaseDatos = require('../BaseDatos/ConexionBaseDatos');
const Modelo = require('../Modelos/PermisoRolRecurso')(BaseDatos, Sequelize.DataTypes);
const { PermisoRolRecursoModelo, PermisoModelo, RecursoModelo, RolModelo } = require('../Relaciones/Relaciones');
const { ObtenerTodasLasTablasConPermisos } = require('../FuncionIntermedia/ObtenerPermisosTablas');
const { Op, fn, col } = require('sequelize');

const NombreModelo = 'CodigoPermiso';
const CodigoModelo = 'CodigoEmpresa';

const Listado = async () => {
  return await PermisoRolRecursoModelo.findAll({
    where: { Estatus: [1, 2] },
    attributes: ['CodigoRol', 'CodigoPermiso', 'CodigoRecurso', 'Estatus'],
    include: [
      {
        model: RolModelo,
        as: 'Rol',
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

const ObtenerPorCodigo = async (CodigoRol, CodigoPermiso, CodigoRecurso) => {
  return await Modelo.findOne({ where: { CodigoRol: CodigoRol, CodigoPermiso: CodigoPermiso, CodigoRecurso: CodigoRecurso } });
};

const Buscar = async (TipoBusqueda, ValorBusqueda) => {
  switch (parseInt(TipoBusqueda)) {
    case 1:
      return await Modelo.findAll({
        where: { [NombreModelo]: { [Sequelize.Op.like]: `%${ValorBusqueda}%` }, Estatus: [1, 2] }
      });
    case 2:
      return await Modelo.findAll({ where: { Estatus: [1, 2] }, order: [[NombreModelo, 'ASC']] });
    default:
      return null;
  }
};

const Crear = async (Datos) => {
  const { CodigoRol, Datos: items } = Datos;

  const registros = items.map(item => ({
    CodigoRol,
    CodigoRecurso: item.CodigoRecurso,
    CodigoPermiso: item.CodigoPermiso,
    Estatus: item.Estatus ?? 1
  }));

  const existentes = await Modelo.findAll({
    where: {
      CodigoRol,
      [Op.or]: registros.map(r => ({
        CodigoRecurso: r.CodigoRecurso,
        CodigoPermiso: r.CodigoPermiso
      }))
    }
  });

  const existentesSet = new Set(
    existentes.map(e => `${e.CodigoRecurso}-${e.CodigoPermiso}`)
  );

  const registrosFiltrados = registros.filter(r =>
    !existentesSet.has(`${r.CodigoRecurso}-${r.CodigoPermiso}`)
  );

  if (registrosFiltrados.length === 0) {
    return null;
  }

  return await Modelo.bulkCreate(registrosFiltrados);
};

const Editar = async (Datos) => {
  const { CodigoRol, CodigoPermiso, CodigoRecurso, Estatus } = Datos;

  const Objeto = await Modelo.findOne({
    where: { CodigoRol, CodigoPermiso, CodigoRecurso }
  });

  if (!Objeto) {
    return null;
  }

  await Objeto.update({ Estatus });

  return Objeto;
};

const EliminarPorRol = async (CodigoRol) => {
  try {

    if (!CodigoRol || isNaN(CodigoRol)) {
      return { Alerta: 'Código de rol inválido.' };
    }

    const registros = await Modelo.findAll({
      where: { CodigoRol }
    });

    if (registros.length === 0) {
      return { Alerta: `No se encontraron registros para el rol ${CodigoRol}.` };
    }

    const cantidadEliminada = await Modelo.destroy({
      where: { CodigoRol }
    });

    return {
      Exito: `Se eliminaron ${cantidadEliminada} registros relacionados al rol ${CodigoRol}.`
    };
  } catch (error) {
    console.error(' Error al eliminar registros del rol:', error);
    return {
      Error: 'Ocurrió un error al intentar eliminar los registros del rol.',
      Detalles: error.message
    };
  }
};

const EliminarPorRolRecurso = async (CodigoRol, CodigoRecurso) => {
  if (!CodigoRol || isNaN(CodigoRol)) throw new Error('Código de rol inválido');
  if (!CodigoRecurso || isNaN(CodigoRecurso)) throw new Error('Código de recurso inválido');

  const registros = await Modelo.findAll({
    where: { CodigoRol, CodigoRecurso }
  });

  if (registros.length === 0) return 0;

  const cantidadEliminada = await Modelo.destroy({
    where: { CodigoRol, CodigoRecurso }
  });

  return cantidadEliminada;
};

const EliminarPorPermisoRolRecurso = async (CodigoRol, CodigoRecurso, CodigoPermiso) => {
  if (!CodigoRol || isNaN(CodigoRol)) throw new Error('Código de rol inválido');
  if (!CodigoRecurso || isNaN(CodigoRecurso)) throw new Error('Código de recurso inválido');
  if (!CodigoPermiso || isNaN(CodigoPermiso)) throw new Error('Código de permiso inválido');

  const registro = await Modelo.findOne({
    where: { CodigoRol, CodigoRecurso, CodigoPermiso }
  });

  if (!registro) return 0;

  await registro.destroy();
  return 1;
};

const FiltrarRoles = async () => {
  const roles = await RolModelo.findAll();
  const recursos = await RecursoModelo.findAll();
  const tablasConPermisos = ObtenerTodasLasTablasConPermisos();

  const todosLosPermisos = await PermisoModelo.findAll();
  const permisosPorNombre = new Map();
  todosLosPermisos.forEach(p => permisosPorNombre.set(p.NombrePermiso, p.CodigoPermiso));

  const rolesIncompletos = [];

  for (const rol of roles) {
    let rolCompleto = true;

    for (const recurso of recursos) {
      const definicion = tablasConPermisos.find(t => t.Tabla === recurso.NombreRecurso);
      if (!definicion) continue;

      const permisosValidos = definicion.Permisos.map(nombre => permisosPorNombre.get(nombre)).filter(Boolean);

      const permisosAsignados = await PermisoRolRecursoModelo.findAll({
        where: {
          CodigoRol: rol.CodigoRol,
          CodigoRecurso: recurso.CodigoRecurso
        },
        attributes: ['CodigoPermiso']
      });

      const permisosAsignadosSet = new Set(permisosAsignados.map(p => p.CodigoPermiso));

      const faltantes = permisosValidos.filter(pid => !permisosAsignadosSet.has(pid));
      if (faltantes.length > 0) {
        rolCompleto = false;
        break;
      }
    }
    if (!rolCompleto) {
      rolesIncompletos.push(rol);
    }
  }
  return rolesIncompletos;
};

const FiltrarRecursos = async (CodigoRol) => {
  const todosLosRecursos = await RecursoModelo.findAll();

  const permisosPorRecurso = await PermisoRolRecursoModelo.findAll({
    where: { CodigoRol },
    attributes: ['CodigoRecurso', 'CodigoPermiso'],
  });

  // Mapear permisos asignados por recurso
  const permisosAsignadosMap = new Map();
  for (const pr of permisosPorRecurso) {
    const recursoId = pr.CodigoRecurso;
    const permisoId = pr.CodigoPermiso;
    if (!permisosAsignadosMap.has(recursoId)) {
      permisosAsignadosMap.set(recursoId, new Set());
    }
    permisosAsignadosMap.get(recursoId).add(permisoId);
  }

  // Cargar todos los permisos con nombre e ID
  const todosLosPermisos = await PermisoModelo.findAll();
  const permisosPorNombre = new Map();
  todosLosPermisos.forEach(p => permisosPorNombre.set(p.NombrePermiso, p.CodigoPermiso));

  // Cargar las definiciones de rutas
  const tablasConPermisos = ObtenerTodasLasTablasConPermisos();

  const recursosNoCreados = [];
  const recursosConPermisosPendientes = [];

  for (const recurso of todosLosRecursos) {
    const codigo = recurso.CodigoRecurso;
    const nombre = recurso.NombreRecurso;

    const definicion = tablasConPermisos.find(t => t.Tabla === nombre);
    if (!definicion) {
      continue;
    }

    const permisosValidos = definicion.Permisos.map(nombre => permisosPorNombre.get(nombre)).filter(Boolean);
    const permisosAsignados = permisosAsignadosMap.get(codigo) || new Set();

    if (permisosAsignados.size === 0) {
      recursosNoCreados.push(recurso);
      continue;
    }

    const faltantes = permisosValidos.filter(pid => !permisosAsignados.has(pid));

    if (faltantes.length > 0) {
      recursosConPermisosPendientes.push(recurso);
    }
  }

  return {
    recursosNoCreados,
    recursosConPermisosPendientes
  };
};

const FiltrarPermisos = async (CodigoRol, CodigoRecurso) => {
  // 1. Obtener los permisos que aún no están asignados
  const permisosAsignados = await PermisoRolRecursoModelo.findAll({
    where: { CodigoRol, CodigoRecurso },
    attributes: ['CodigoPermiso']
  });
  const permisosAsignadosIds = permisosAsignados.map(p => p.CodigoPermiso);
  const permisosDisponibles = await PermisoModelo.findAll({
    where: {
      CodigoPermiso: {
        [Op.notIn]: permisosAsignadosIds
      }
    }
  });
  // 2. Obtener el nombre real del recurso
  const recurso = await RecursoModelo.findOne({
    where: { CodigoRecurso },
    attributes: ['NombreRecurso']
  });
  if (!recurso) {
    return [];
  }
  const nombreRecurso = recurso.NombreRecurso;
  // 3. Obtener permisos válidos desde archivos de rutas
  const tablasConPermisos = ObtenerTodasLasTablasConPermisos();
  const definicionRecurso = tablasConPermisos.find(t => t.Tabla === nombreRecurso);
  if (!definicionRecurso) {
    return [];
  }
  const permisosValidos = definicionRecurso.Permisos;
  // 4. Filtrar los permisosDisponibles en base a los válidos
  const permisosFiltrados = permisosDisponibles.filter(p =>
    permisosValidos.includes(p.NombrePermiso)
  );
  return permisosFiltrados;
};

const ObtenerResumenPermisosUnicos = () => {
  const tablasConPermisos = ObtenerTodasLasTablasConPermisos();

  const permisosSet = new Set();

  tablasConPermisos.forEach(tabla => {
    tabla.Permisos.forEach(permiso => {
      permisosSet.add(permiso);
    });
  });

  return Array.from(permisosSet);
};

module.exports = {
  Listado,
  ObtenerPorCodigo,
  Buscar,
  Crear,
  Editar,
  FiltrarPermisos,
  FiltrarRecursos,
  FiltrarRoles,
  EliminarPorRol,
  EliminarPorRolRecurso,
  EliminarPorPermisoRolRecurso,
  ObtenerResumenPermisosUnicos
};
