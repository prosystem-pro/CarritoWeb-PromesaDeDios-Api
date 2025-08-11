const Sequelize = require('sequelize');
const { Op } = Sequelize;
const BaseDatos = require('../BaseDatos/ConexionBaseDatos');
const Modelo = require('../Modelos/ReporteProducto')(BaseDatos, Sequelize.DataTypes);
const ModeloProducto = require('../Modelos/Producto')(BaseDatos, Sequelize.DataTypes);
const ModeloClasificacionProducto = require('../Modelos/ClasificacionProducto')(BaseDatos, Sequelize.DataTypes);
const { ConstruirUrlImagen } = require('../Utilidades/ConstruirUrlImagen');
const { LanzarError } = require('../Utilidades/ErrorServicios');
const { DateTime } = require('luxon');
const { v4: uuidv4 } = require('uuid');

const NombreModelo = 'CodigoProducto';
const CodigoModelo = 'CodigoReporteProducto';

const Listado = async () => {
  return await Modelo.findAll({ where: { Estatus: [1, 2] } });
};

const ObtenerPorCodigo = async (Codigo) => {
  const Objeto = await Modelo.findOne({ where: { [CodigoModelo]: Codigo } });
  if (!Objeto) LanzarError('Registro no encontrado', 404);
  return Objeto;
};

const Buscar = async (TipoBusqueda, ValorBusqueda) => {
  switch (parseInt(TipoBusqueda)) {
    case 1:
      return await Modelo.findAll({
        where: {
          [NombreModelo]: { [Op.like]: `%${ValorBusqueda}%` },
          Estatus: [1, 2]
        }
      });
    case 2:
      return await Modelo.findAll({
        where: { Estatus: [1, 2] },
        order: [[NombreModelo, 'ASC']]
      });
    default:
      LanzarError('Tipo de búsqueda inválido', 400);
  }
};

const Crear = async (Datos) => {
  const EsArray = Array.isArray(Datos);
  const ListaDatos = EsArray ? Datos : [Datos];

  const CodigoSolicitud = uuidv4();
  const FechaActual = DateTime.now().setZone('America/Guatemala').toISO();

  const DatosConFechaYSolicitud = ListaDatos.map(dato => ({
    ...dato,
    Fecha: FechaActual,
    CodigoSolicitud: CodigoSolicitud
  }));

  return await Modelo.bulkCreate(DatosConFechaYSolicitud);
};

const Editar = async (Codigo, Datos) => {
  const Objeto = await Modelo.findOne({ where: { [CodigoModelo]: Codigo } });
  if (!Objeto) LanzarError('Registro no encontrado para editar', 404);
  await Objeto.update(Datos);
  return Objeto;
};

const Eliminar = async (Codigo) => {
  const Objeto = await Modelo.findOne({ where: { [CodigoModelo]: Codigo } });
  if (!Objeto) LanzarError('Registro no encontrado para eliminar', 404);
  await Objeto.destroy();
  return Objeto;
};

const ObtenerResumen = async (Anio, Mes) => {
  const Registros = await Modelo.findAll({ where: { Estatus: [1, 2] } });

  const RegistrosConFecha = Registros.map(({ dataValues }) => {
    const FechaOriginal = dataValues.Fecha;
    const FechaLuxon = FechaOriginal ? DateTime.fromJSDate(FechaOriginal).setZone('America/Guatemala') : null;

    return {
      ...dataValues,
      Fecha: FechaLuxon ? FechaLuxon.toFormat('yyyy-MM-dd HH:mm:ss') : null,
      _FechaLuxon: FechaLuxon,
    };
  });

  const RegistrosFiltrados = RegistrosConFecha.filter(r =>
    r._FechaLuxon?.year === parseInt(Anio) && r._FechaLuxon.month === parseInt(Mes)
  );

  const ConteoPorProducto = RegistrosFiltrados.reduce((Acc, { CodigoProducto, CantidadVendida }) => {
    Acc[CodigoProducto] = (Acc[CodigoProducto] || 0) + (CantidadVendida ?? 0);
    return Acc;
  }, {});

  const TopCodigos = Object.entries(ConteoPorProducto)
    .sort(([, A], [, B]) => B - A)
    .slice(0, 3);

  const TopProductos = await Promise.all(
    TopCodigos.map(async ([CodigoProducto, CantidadVendida]) => {
      const Producto = await ModeloProducto.findOne({
        where: { [NombreModelo]: CodigoProducto },
        attributes: ['NombreProducto', 'UrlImagen']
      });

      return {
        CodigoProducto: Number(CodigoProducto),
        NombreProducto: Producto?.NombreProducto || 'Desconocido',
        UrlImagen: ConstruirUrlImagen(Producto?.UrlImagen || null),
        CantidadVendida
      };
    })
  );

  const CodigosUnicos = new Set(RegistrosFiltrados.map(r => r.CodigoSolicitud));
  const TotalSolicitudes = CodigosUnicos.size;

  const ResumenPorDia = RegistrosFiltrados.reduce((Acc, { _FechaLuxon, CodigoSolicitud }) => {
    if (!_FechaLuxon || !CodigoSolicitud) return Acc;
    const Dia = _FechaLuxon.day.toString().padStart(2, '0');
    if (!Acc[Dia]) Acc[Dia] = new Set();
    Acc[Dia].add(CodigoSolicitud);
    return Acc;
  }, {});

  const FechaReferencia = RegistrosFiltrados.length > 0 ? RegistrosFiltrados[0]._FechaLuxon : null;
  const DiasEnMes = FechaReferencia ? FechaReferencia.daysInMonth : 31;

  const ResumenPorDiaOrdenado = Array.from({ length: DiasEnMes }, (_, i) => {
    const Dia = (i + 1).toString().padStart(2, '0');
    return {
      dia: Dia,
      cantidad: ResumenPorDia[Dia]?.size || 0
    };
  });

  const NombresMeses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const RegistrosFiltradosAnio = RegistrosConFecha.filter(r => r._FechaLuxon?.year === parseInt(Anio));

  const ConteoPorMes = RegistrosFiltradosAnio.reduce((Acc, { _FechaLuxon, CodigoSolicitud }) => {
    if (!_FechaLuxon || !CodigoSolicitud) return Acc;
    const MesNum = _FechaLuxon.month.toString().padStart(2, '0');
    if (!Acc[MesNum]) Acc[MesNum] = new Set();
    Acc[MesNum].add(CodigoSolicitud);
    return Acc;
  }, {});

  const ResumenPorMesOrdenado = Array.from({ length: 12 }, (_, i) => {
    const MesNum = (i + 1).toString().padStart(2, '0');
    return {
      mes: MesNum,
      nombreMes: NombresMeses[i],
      cantidad: ConteoPorMes[MesNum]?.size || 0
    };
  });

  const CodigosProductoUnicos = [...new Set(RegistrosFiltrados.map(r => r.CodigoProducto))];

  const Productos = await ModeloProducto.findAll({
    where: { CodigoProducto: CodigosProductoUnicos },
    attributes: ['CodigoProducto', 'CodigoClasificacionProducto'],
  });

  const MapaProductoClasificacion = {};
  Productos.forEach(p => {
    MapaProductoClasificacion[p.CodigoProducto] = p.CodigoClasificacionProducto;
  });

  const ConteoPorClasificacion = {};
  RegistrosFiltrados.forEach(({ CodigoProducto }) => {
    const CodigoClasificacion = MapaProductoClasificacion[CodigoProducto];
    if (CodigoClasificacion !== undefined && CodigoClasificacion !== null) {
      ConteoPorClasificacion[CodigoClasificacion] = (ConteoPorClasificacion[CodigoClasificacion] || 0) + 1;
    }
  });

  const CodigosClasificacionUnicos = Object.keys(ConteoPorClasificacion);

  const Clasificaciones = await ModeloClasificacionProducto.findAll({
    where: { CodigoClasificacionProducto: CodigosClasificacionUnicos },
    attributes: ['CodigoClasificacionProducto', 'NombreClasificacionProducto'],
  });

  const MapaClasificacion = {};
  Clasificaciones.forEach(c => {
    MapaClasificacion[c.CodigoClasificacionProducto] = c.NombreClasificacionProducto;
  });

  const ClasificacionMes = CodigosClasificacionUnicos.map(Codigo => ({
    CodigoClasificacionProducto: Number(Codigo),
    NombreClasificacionProducto: MapaClasificacion[Codigo] || 'Sin Clasificación',
    TotalRegistros: ConteoPorClasificacion[Codigo]
  }));

  return {
    TopProductos,
    SolicitudesPorMes: {
      titulo: "Solicitudes por mes",
      total: TotalSolicitudes
    },
    ResumenPorDiaMes: {
      titulo: "ResumenPorDíaMes",
      datos: ResumenPorDiaOrdenado
    },
    SolicitudesAño: {
      titulo: "SolicitudesAño",
      datos: ResumenPorMesOrdenado
    },
    ClasificacionMes
  };
};

module.exports = { Listado, ObtenerPorCodigo, Buscar, Crear, Editar, Eliminar, ObtenerResumen };
