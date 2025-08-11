const Sequelize = require('sequelize');
const BaseDatos = require('../BaseDatos/ConexionBaseDatos');
const Modelo = require('../Modelos/ReporteRedSocial')(BaseDatos, Sequelize.DataTypes);
const ModeloRedSocial = require('../Modelos/RedSocial')(BaseDatos, Sequelize.DataTypes);
const ModeloRedSocialImagen = require('../Modelos/RedSocialImagen')(BaseDatos, Sequelize.DataTypes);
const { ConstruirUrlImagen } = require('../Utilidades/ConstruirUrlImagen');
const { LanzarError } = require('../Utilidades/ErrorServicios');
const { DateTime } = require('luxon');

const NombreModelo = 'NombreDiagrama';
const CodigoModelo = 'CodigoReporteRedSocial';

const ObtenerResumen = async (Anio, Mes) => {
  const Registros = await Modelo.findAll({ where: { Estatus: [1, 2] } });

  const RegistrosConFechaLocal = Registros.map(Registro => {
    const RegistroPlano = Registro.toJSON();
    if (RegistroPlano.Fecha) {
      RegistroPlano.Fecha = DateTime
        .fromJSDate(RegistroPlano.Fecha)
        .setZone('America/Guatemala');
    }
    return RegistroPlano;
  });

  const RegistrosFiltrados = (Anio && Mes)
    ? RegistrosConFechaLocal.filter(Registro =>
        Registro.Fecha.year === parseInt(Anio) &&
        Registro.Fecha.month === parseInt(Mes)
      )
    : RegistrosConFechaLocal;

  const ConteoPorDia = {};
  RegistrosFiltrados.forEach(Registro => {
    const Dia = Registro.Fecha.day;
    ConteoPorDia[Dia] = (ConteoPorDia[Dia] || 0) + 1;
  });

  const FechaReferencia = RegistrosFiltrados.length > 0 ? RegistrosFiltrados[0].Fecha : null;
  const DiasEnMes = FechaReferencia ? FechaReferencia.daysInMonth : 31;

  const ConteoPorDiaOrdenadoArray = Array.from({ length: DiasEnMes }, (_, i) => {
    const DiaNum = i + 1;
    const DiaStr = DiaNum.toString().padStart(2, '0');
    return {
      dia: DiaStr,
      total: ConteoPorDia[DiaNum] || 0
    };
  });

  const MesesNombres = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const RegistrosDelAnio = Anio
    ? RegistrosConFechaLocal.filter(Registro =>
        Registro.Fecha.year === parseInt(Anio)
      )
    : [];

  const ConteoPorMes = new Array(12).fill(0);
  RegistrosDelAnio.forEach(Registro => {
    const MesIndex = Registro.Fecha.month - 1;
    ConteoPorMes[MesIndex]++;
  });

  const ConteoPorMesFormateado = ConteoPorMes.map((Total, Index) => ({
    mes: (Index + 1).toString().padStart(2, '0'),
    nombre: MesesNombres[Index],
    total: Total
  }));

  const ConteoPorRedSocial = {};
  RegistrosFiltrados.forEach(Registro => {
    const Codigo = Registro.CodigoRedSocial;
    if (Codigo) {
      ConteoPorRedSocial[Codigo] = (ConteoPorRedSocial[Codigo] || 0) + 1;
    }
  });

  const TopCodigos = Object.entries(ConteoPorRedSocial)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  const TopRedesSociales = [];

  for (const [CodigoRed, Total] of TopCodigos) {
    const Codigo = parseInt(CodigoRed);

    const Red = await ModeloRedSocial.findOne({
      where: { CodigoRedSocial: Codigo }
    });

    const Imagen = await ModeloRedSocialImagen.findOne({
      where: {
        CodigoRedSocial: Codigo,
        Ubicacion: 'Contacto'
      }
    });

    const UrlImagen = ConstruirUrlImagen(Imagen?.UrlImagen || null);

    if (Red) {
      TopRedesSociales.push({
        codigo: CodigoRed,
        nombre: Red.NombreRedSocial,
        total: Total,
        urlImagen: UrlImagen
      });
    }
  }

  const ResumenRedesSociales = [];

  for (const [CodigoRed, Total] of Object.entries(ConteoPorRedSocial)) {
    const Red = await ModeloRedSocial.findOne({
      where: { CodigoRedSocial: parseInt(CodigoRed) }
    });

    if (Red) {
      ResumenRedesSociales.push({
        codigo: CodigoRed,
        nombre: Red.NombreRedSocial,
        total: Total
      });
    }
  }

  return {
    SolicitudTotalMes: RegistrosFiltrados.length,
    SolicitudesDiaMes: ConteoPorDiaOrdenadoArray,
    SolicitudesPorMes: ConteoPorMesFormateado,
    TopRedesSociales,
    ResumenRedesSociales
  };
};

const Listado = async () => {
  return await Modelo.findAll({ where: { Estatus: [1, 2] } });
};

const ObtenerPorCodigo = async (Codigo) => {
  const Objeto = await Modelo.findOne({ where: { [CodigoModelo]: Codigo } });
  if (!Objeto) LanzarError('Registro no encontrado', 'Alerta', 404);
  return Objeto;
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
      return [];
  }
};

const Crear = async (Datos) => {
  const EsArray = Array.isArray(Datos);
  const ListaDatos = EsArray ? Datos : [Datos];

  const FechaActual = DateTime.now().setZone('America/Guatemala').toISO();
  const DatosConFecha = ListaDatos.map(dato => ({
    ...dato,
    Fecha: FechaActual,
  }));

  return EsArray
    ? await Modelo.bulkCreate(DatosConFecha)
    : await Modelo.create(DatosConFecha[0]);
};

const Editar = async (Codigo, Datos) => {
  const Objeto = await Modelo.findOne({ where: { [CodigoModelo]: Codigo } });
  if (!Objeto) LanzarError('Registro no encontrado', 'Alerta', 404);
  await Objeto.update(Datos);
  return Objeto;
};

const Eliminar = async (Codigo) => {
  const Objeto = await Modelo.findOne({ where: { [CodigoModelo]: Codigo } });
  if (!Objeto) LanzarError('Registro no encontrado', 'Alerta', 404);
  await Objeto.destroy();
  return Objeto;
};

module.exports = { Listado, ObtenerPorCodigo, Buscar, Crear, Editar, Eliminar, ObtenerResumen };
