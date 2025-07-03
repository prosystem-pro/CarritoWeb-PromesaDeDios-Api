const Sequelize = require('sequelize');
const BaseDatos = require('../BaseDatos/ConexionBaseDatos');
const Modelo = require('../Modelos/ReporteTiempoPagina')(BaseDatos, Sequelize.DataTypes);
const { DateTime, Duration } = require('luxon');


const NombreModelo = 'NombreDiagrama';
const CodigoModelo = 'CodigoReporteTiempoPagina'

const ObtenerResumen = async (Anio, Mes) => {
  // Traer todos los registros con estatus válido
  const Registros = await Modelo.findAll({
    where: { Estatus: [1, 2] },
  });

  // Convertir fechas a zona horaria local (opcional, solo para el filtro)
const RegistrosConFechaLocal = Registros.map(Registro => {
  const RegistroPlano = Registro.toJSON();
  if (RegistroPlano.Fecha) {
    const fechaLuxon = DateTime
      .fromJSDate(new Date(RegistroPlano.Fecha))
      .setZone('America/Guatemala');

    RegistroPlano.Fecha = {
      year: fechaLuxon.year,
      month: fechaLuxon.month,
      day: fechaLuxon.day
    };
  }
  return RegistroPlano;
});

  // Filtrar por año y mes
  const RegistrosFiltrados = (Anio && Mes)
    ? RegistrosConFechaLocal.filter(Registro =>
        Registro.Fecha.year === parseInt(Anio) &&
        Registro.Fecha.month === parseInt(Mes)
      )
    : RegistrosConFechaLocal;

  // Sumar el campo TiempoPromedio de todos los registros
  let totalSegundos = 0;
  RegistrosFiltrados.forEach(Registro => {
    const tiempo = Registro.TiempoPromedio;

    if (tiempo) {
      // Convertir a string y dividir por :
      const partes = tiempo.toString().split(':');
      if (partes.length === 3) {
        const horas = parseInt(partes[0]) || 0;
        const minutos = parseInt(partes[1]) || 0;
        const segundos = parseFloat(partes[2]) || 0;
        totalSegundos += (horas * 3600) + (minutos * 60) + segundos;
      }
    }
  });

  // Convertir totalSegundos a días, horas, minutos, segundos
  const dias = Math.floor(totalSegundos / 86400);
  const restoDespuesDias = totalSegundos % 86400;

  const horas = Math.floor(restoDespuesDias / 3600);
  const restoDespuesHoras = restoDespuesDias % 3600;

  const minutos = Math.floor(restoDespuesHoras / 60);
  const segundos = Math.floor(restoDespuesHoras % 60);

  return {
    TotalTiempo: {
      dias,
      horas,
      minutos,
      segundos
    }
  };
};


const Listado = async () => {
  return await Modelo.findAll({ where: { Estatus: [1, 2] } });
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
  const FechaActual = DateTime.now().setZone('America/Guatemala').toISO();

  const DatosConFecha = {
    ...Datos,
    Fecha: FechaActual,
  };

  return await Modelo.create(DatosConFecha);
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
