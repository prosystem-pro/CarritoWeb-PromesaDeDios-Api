const Sequelize = require('sequelize');
const BaseDatos = require('../BaseDatos/ConexionBaseDatos');
const Modelo = require('../Modelos/ReporteVista')(BaseDatos, Sequelize.DataTypes);
const { DateTime } = require('luxon');

const NombreModelo= 'NombreDiagrama';
const CodigoModelo= 'CodigoReporteVista'

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
  console.log('Registros con Fecha Local:', RegistrosConFechaLocal);
  const RegistrosFiltrados = (Anio && Mes)
    ? RegistrosConFechaLocal.filter(Registro =>
        Registro.Fecha.year === parseInt(Anio) &&
        Registro.Fecha.month === parseInt(Mes)
      )
    : RegistrosConFechaLocal;

const ConteoPorDia = {};
for (let i = 1; i <= 31; i++) {
  const DiaStr = i.toString().padStart(2, '0');
  ConteoPorDia[DiaStr] = 0;
}

// Contar cuántos registros hay en cada día
RegistrosFiltrados.forEach(Registro => {
  const Dia = Registro.Fecha.day.toString().padStart(2, '0');
  ConteoPorDia[Dia]++;
});

// Formatear conteo por día en array ordenado
const ConteoPorDiaOrdenadoArray = Object.entries(ConteoPorDia)
  .map(([Dia, Total]) => ({ dia: Dia, total: Total }))
  .sort((a, b) => parseInt(a.dia) - parseInt(b.dia));



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

  return {
    SolicitudTotalMes: RegistrosFiltrados.length,
    SolicitudesDiaMes: ConteoPorDiaOrdenadoArray,
    SolicitudesPorMes: ConteoPorMesFormateado
  };
};

const Listado = async () => {
  return await Modelo.findAll({ where: { Estatus:  [1,2] } });
};

const ObtenerPorCodigo = async (Codigo) => {
  return await Modelo.findOne({ where: { [CodigoModelo]: Codigo } });
};

const Buscar = async (TipoBusqueda, ValorBusqueda) => {
  switch (parseInt(TipoBusqueda)) {
    case 1:
      return await Modelo.findAll({
        where: { [NombreModelo]: { [Sequelize.Op.like]: `%${ValorBusqueda}%` }, Estatus:  [1,2] }
      });
    case 2:
      return await Modelo.findAll({ where: { Estatus:  [1,2] }, order: [[NombreModelo, 'ASC']] });
    default:
      return null;
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
