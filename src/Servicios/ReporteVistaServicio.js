const Sequelize = require('sequelize');
const BaseDatos = require('../BaseDatos/ConexionBaseDatos');
const Modelo = require('../Modelos/ReporteVista')(BaseDatos, Sequelize.DataTypes);
const { DateTime } = require('luxon');
const { LanzarError } = require('../Utilidades/ErrorServicios');

const NombreModelo = 'NombreDiagrama';
const CodigoModelo = 'CodigoReporteVista';

const ObtenerResumen = async (Anio, Mes) => {
  const Registros = await Modelo.findAll({ where: { Estatus: [1, 2] } });

  const RegistrosConFechaLocal = Registros.map((Registro) => {
    const Plano = Registro.toJSON();
    if (Plano.Fecha) {
      Plano.Fecha = DateTime
        .fromJSDate(Plano.Fecha)
        .setZone('America/Guatemala');
    }
    return Plano;
  });

  const RegistrosFiltrados = (Anio && Mes)
    ? RegistrosConFechaLocal.filter((r) =>
        r.Fecha.year === parseInt(Anio) && r.Fecha.month === parseInt(Mes)
      )
    : RegistrosConFechaLocal;

  const ConteoPorDia = {};
  for (let i = 1; i <= 31; i++) {
    ConteoPorDia[i.toString().padStart(2, '0')] = 0;
  }

  RegistrosFiltrados.forEach((r) => {
    const Dia = r.Fecha.day.toString().padStart(2, '0');
    ConteoPorDia[Dia]++;
  });

  const ConteoPorDiaOrdenadoArray = Object.entries(ConteoPorDia)
    .map(([dia, total]) => ({ dia, total }))
    .sort((a, b) => parseInt(a.dia) - parseInt(b.dia));

  const MesesNombres = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const RegistrosDelAnio = Anio
    ? RegistrosConFechaLocal.filter((r) => r.Fecha.year === parseInt(Anio))
    : [];

  const ConteoPorMes = new Array(12).fill(0);
  RegistrosDelAnio.forEach((r) => {
    const mesIndex = r.Fecha.month - 1;
    ConteoPorMes[mesIndex]++;
  });

  const ConteoPorMesFormateado = ConteoPorMes.map((total, i) => ({
    mes: (i + 1).toString().padStart(2, '0'),
    nombre: MesesNombres[i],
    total,
  }));

  return {
    SolicitudTotalMes: RegistrosFiltrados.length,
    SolicitudesDiaMes: ConteoPorDiaOrdenadoArray,
    SolicitudesPorMes: ConteoPorMesFormateado,
  };
};

const Listado = async () => {
  return await Modelo.findAll({ where: { Estatus: [1, 2] } });
};

const ObtenerPorCodigo = async (Codigo) => {
  const Registro = await Modelo.findOne({ where: { [CodigoModelo]: Codigo } });
  if (!Registro) throw LanzarError('Registro no encontrado');
  return Registro;
};

const Buscar = async (TipoBusqueda, ValorBusqueda) => {
  switch (parseInt(TipoBusqueda)) {
    case 1:
      return await Modelo.findAll({
        where: {
          [NombreModelo]: { [Sequelize.Op.like]: `%${ValorBusqueda}%` },
          Estatus: [1, 2]
        }
      });
    case 2:
      return await Modelo.findAll({
        where: { Estatus: [1, 2] },
        order: [[NombreModelo, 'ASC']]
      });
    default:
      return null;
  }
};

const Crear = async (Datos) => {
  const EsArray = Array.isArray(Datos);
  const ListaDatos = EsArray ? Datos : [Datos];

  const FechaActual = DateTime.now().setZone('America/Guatemala').toISO();
  const DatosConFecha = ListaDatos.map((dato) => ({
    ...dato,
    Fecha: FechaActual,
  }));

  return EsArray
    ? await Modelo.bulkCreate(DatosConFecha)
    : await Modelo.create(DatosConFecha[0]);
};

const Editar = async (Codigo, Datos) => {
  const Registro = await Modelo.findOne({ where: { [CodigoModelo]: Codigo } });
  if (!Registro) throw LanzarError('Registro no encontrado');
  await Registro.update(Datos);
  return Registro;
};

const Eliminar = async (Codigo) => {
  const Registro = await Modelo.findOne({ where: { [CodigoModelo]: Codigo } });
  if (!Registro) throw LanzarError('Registro no encontrado');
  await Registro.destroy();
  return Registro;
};

module.exports = { Listado, ObtenerPorCodigo, Buscar, Crear, Editar, Eliminar, ObtenerResumen };
