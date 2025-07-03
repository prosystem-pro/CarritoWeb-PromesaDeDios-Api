const Sequelize = require('sequelize');
const { Op } = Sequelize;
const BaseDatos = require('../BaseDatos/ConexionBaseDatos');
const Modelo = require('../Modelos/ReporteProducto')(BaseDatos, Sequelize.DataTypes);
const ModeloProducto = require('../Modelos/Producto')(BaseDatos, Sequelize.DataTypes);
const ModeloClasificacionProducto = require('../Modelos/ClasificacionProducto')(BaseDatos, Sequelize.DataTypes);
const { ConstruirUrlImagen } = require('../Utilidades/ConstruirUrlImagen');
const { DateTime } = require('luxon');
const { v4: uuidv4 } = require('uuid');


const NombreModelo = 'CodigoProducto';
const CodigoModelo = 'CodigoReporteProducto'

const Listado = async () => {
  return await Modelo.findAll({ where: { Estatus: [1, 2] } });
};

const ObtenerResumen = async (Anio, Mes) => {
  // Obtener registros base
  const Registros = await Modelo.findAll({
    where: { Estatus: [1, 2] },
  });

  // Procesar fechas con Luxon
  const RegistrosConFecha = Registros.map(({ dataValues }) => {
    const FechaOriginal = dataValues.Fecha;
    const FechaLuxon = FechaOriginal
      ? DateTime.fromJSDate(FechaOriginal).setZone('America/Guatemala')
      : null;

    return {
      ...dataValues,
      Fecha: FechaLuxon ? FechaLuxon.toFormat('yyyy-MM-dd HH:mm:ss') : null,
      _FechaLuxon: FechaLuxon,
    };
  });

  // Filtrar registros por año y mes 
  const RegistrosFiltrados = RegistrosConFecha.filter(r => {
    const Fecha = r._FechaLuxon;
    return Fecha && Fecha.year === parseInt(Anio) && Fecha.month === parseInt(Mes);
  });

  // Contar cantidad vendida por producto 
  const ConteoPorProducto = RegistrosFiltrados.reduce((Acc, { CodigoProducto, CantidadVendida }) => {
    const Codigo = CodigoProducto;
    const Cantidad = CantidadVendida ?? 0;
    Acc[Codigo] = (Acc[Codigo] || 0) + Cantidad;
    return Acc;
  }, {});

// Top 3 productos más vendidos
const TopCodigos = Object.entries(ConteoPorProducto)
  .sort(([, A], [, B]) => B - A)
  .slice(0, 3);

const TopProductos = await Promise.all(
  TopCodigos.map(async ([CodigoProducto, CantidadVendida]) => {
    const Producto = await ModeloProducto.findOne({
      where: { [NombreModelo]: CodigoProducto },
      attributes: ['NombreProducto', 'UrlImagen']
    });

    const NombreProducto = Producto?.dataValues?.NombreProducto || 'Desconocido';
    const UrlImagenCruda = Producto?.dataValues?.UrlImagen || null;
    const UrlImagen = ConstruirUrlImagen(UrlImagenCruda);

    return {
      CodigoProducto: Number(CodigoProducto),
      NombreProducto,
      UrlImagen,
      CantidadVendida,
    };
  })
);
  // Total de solicitudes en el mes 
  const CodigosUnicos = new Set(RegistrosFiltrados.map(r => r.CodigoSolicitud));
  const TotalSolicitudes = CodigosUnicos.size;


  // Resumen por día del mes, pero contando SOLO solicitudes únicas
  const ResumenPorDia = RegistrosFiltrados.reduce((Acc, { _FechaLuxon, CodigoSolicitud }) => {
    if (!_FechaLuxon || !CodigoSolicitud) return Acc;

    const Dia = _FechaLuxon.day.toString().padStart(2, '0');

    // Asegúrate de que para cada día se maneje un Set para contar solicitudes únicas
    if (!Acc[Dia]) {
      Acc[Dia] = new Set();
    }
    Acc[Dia].add(CodigoSolicitud);

    return Acc;
  }, {});

  // Determinar el número máximo de días del mes
  const FechaReferencia = RegistrosFiltrados.length > 0 ? RegistrosFiltrados[0]._FechaLuxon : null;
  const DiasEnMes = FechaReferencia ? FechaReferencia.daysInMonth : 31;

  // Generar arreglo de días (01 - último día del mes) con la cantidad de solicitudes únicas
  const ResumenPorDiaOrdenado = Array.from({ length: DiasEnMes }, (_, i) => {
    const Dia = (i + 1).toString().padStart(2, '0');
    const SolicitudesUnicas = ResumenPorDia[Dia] ? ResumenPorDia[Dia].size : 0;

    return {
      dia: Dia,
      cantidad: SolicitudesUnicas
    };
  });


  // Nombres de los meses
  const NombresMeses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Filtrar registros por año
  const RegistrosFiltradosAnio = RegistrosConFecha.filter(r => {
    const Fecha = r._FechaLuxon;
    return Fecha && Fecha.year === parseInt(Anio);
  });

  // Contador de solicitudes únicas por mes
  const ConteoPorMes = RegistrosFiltradosAnio.reduce((Acc, { _FechaLuxon, CodigoSolicitud }) => {
    if (!_FechaLuxon || !CodigoSolicitud) return Acc;

    const MesNum = _FechaLuxon.month.toString().padStart(2, '0');

    // Asegúrate de que cada mes tenga un Set para contar solicitudes únicas
    if (!Acc[MesNum]) {
      Acc[MesNum] = new Set();
    }
    Acc[MesNum].add(CodigoSolicitud);

    return Acc;
  }, {});

  // Crear arreglo de los 12 meses con su conteo (o 0 si no hay)
  const ResumenPorMesOrdenado = Array.from({ length: 12 }, (_, i) => {
    const MesNum = (i + 1).toString().padStart(2, '0');
    const SolicitudesUnicas = ConteoPorMes[MesNum] ? ConteoPorMes[MesNum].size : 0;

    return {
      mes: MesNum,
      nombreMes: NombresMeses[i],
      cantidad: SolicitudesUnicas
    };
  });


  // ClasificaciónMes: Resumen por Clasificación de Producto

  // Obtener códigos únicos de producto
  const CodigosProductoUnicos = [...new Set(RegistrosFiltrados.map(r => r.CodigoProducto))];

  // Obtener productos con clasificación
  const Productos = await ModeloProducto.findAll({
    where: { CodigoProducto: CodigosProductoUnicos },
    attributes: ['CodigoProducto', 'CodigoClasificacionProducto'],
  });

  const MapaProductoClasificacion = {};
  Productos.forEach(Producto => {
    MapaProductoClasificacion[Producto.CodigoProducto] = Producto.CodigoClasificacionProducto;
  });

  // Contar registros por clasificación
  const ConteoPorClasificacion = {};
  RegistrosFiltrados.forEach(({ CodigoProducto }) => {
    const CodigoClasificacion = MapaProductoClasificacion[CodigoProducto];
    if (CodigoClasificacion !== undefined && CodigoClasificacion !== null) {
      ConteoPorClasificacion[CodigoClasificacion] = (ConteoPorClasificacion[CodigoClasificacion] || 0) + 1;
    }
  });

  // Obtener nombres de clasificaciones
  const CodigosClasificacionUnicos = Object.keys(ConteoPorClasificacion);

  const Clasificaciones = await ModeloClasificacionProducto.findAll({
    where: { CodigoClasificacionProducto: CodigosClasificacionUnicos },
    attributes: ['CodigoClasificacionProducto', 'NombreClasificacionProducto'],
  });

  const MapaClasificacion = {};
  Clasificaciones.forEach(Clasificacion => {
    MapaClasificacion[Clasificacion.CodigoClasificacionProducto] = Clasificacion.NombreClasificacionProducto;
  });

  // Construir arreglo final de clasificación
  const ClasificacionMes = CodigosClasificacionUnicos.map(Codigo => ({
    CodigoClasificacionProducto: Number(Codigo),
    NombreClasificacionProducto: MapaClasificacion[Codigo] || 'Sin Clasificación',
    TotalRegistros: ConteoPorClasificacion[Codigo],
  }));

  // Retorno final del resumen
  return {
    TopProductos,
    SolicitudesPorMes: {
      titulo: "Solicitudes por mes",
      total: TotalSolicitudes,
    },
    ResumenPorDiaMes: {
      titulo: "ResumenPorDíaMes",
      datos: ResumenPorDiaOrdenado,
    },
    SolicitudesAño: {
      titulo: "SolicitudesAño",
      datos: ResumenPorMesOrdenado,
    },
    ClasificacionMes,
  };
};


const ObtenerPorCodigo = async (Codigo) => {
  return await Modelo.findOne({ where: { [CodigoModelo]: Codigo } });
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
  if (!Objeto) return null;
  await Objeto.update(Datos);
  return Objeto;
};

const Eliminar = async (Codigo) => {
  const Objeto = await Modelo.findOne({ where: { [CodigoModelo]: Codigo } });
  if (!Objeto) return null;
  await Objeto.destroy();
  return Objeto;
};

module.exports = { Listado, ObtenerPorCodigo, Buscar, Crear, Editar, Eliminar, ObtenerResumen };
