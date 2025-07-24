const Sequelize = require('sequelize');
const BaseDatos = require('../BaseDatos/ConexionBaseDatos');
const Modelo = require('../Modelos/Pago')(BaseDatos, Sequelize.DataTypes);
const { EliminarImagen } = require('../Servicios/EliminarImagenServicio');
const { ConstruirUrlImagen } = require('../Utilidades/ConstruirUrlImagen');
const { DateTime } = require('luxon');

const NombreModelo = 'NumeroBoleta';
const CodigoModelo = 'CodigoPago'

const Listado = async (Anio) => {
  const Registros = await Modelo.findAll({
    where: {
      Estatus: [1, 2, 3],
      [Sequelize.Op.and]: Sequelize.where(
        Sequelize.fn('YEAR', Sequelize.col('FechaVencimientoPago')),
        Anio
      )
    }
  });
  const Resultado = Registros.map((r) => {
    const Dato = r.toJSON();
    if (Dato.FechaVencimientoPago) {
      const original = Dato.FechaVencimientoPago instanceof Date
        ? Dato.FechaVencimientoPago
        : new Date(Dato.FechaVencimientoPago);
      const yyyy = original.getUTCFullYear();
      const mm = original.getUTCMonth();
      const dd = original.getUTCDate();
      const nuevaFecha = new Date(Date.UTC(yyyy, mm, dd + 1));
      const nuevoYyyy = nuevaFecha.getUTCFullYear();
      const nuevoMm = String(nuevaFecha.getUTCMonth() + 1).padStart(2, '0');
      const nuevoDd = String(nuevaFecha.getUTCDate()).padStart(2, '0');
      Dato.FechaVencimientoPago = `${nuevoYyyy}-${nuevoMm}-${nuevoDd}`;
    }
    Dato.UrlComprobante = ConstruirUrlImagen(Dato.UrlComprobante);
    return Dato;
  });
  return Resultado;
};

const ObtenerPorCodigo = async (Codigo) => {
  const Registro = await Modelo.findOne({ where: { [CodigoModelo]: Codigo } });

  if (!Registro) return null;

  const Dato = Registro.toJSON();
  Dato.UrlComprobante = ConstruirUrlImagen(Dato.UrlComprobante);

  return Dato;
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
  return await Modelo.create(Datos);
};

const Editar = async (Codigo, Datos) => {
  const Objeto = await Modelo.findOne({ where: { [CodigoModelo]: Codigo } });
  if (!Objeto) return null;
  await Objeto.update(Datos);
  return Objeto;
};

const Eliminar = async (Codigo) => {
  try {
    const Objeto = await Modelo.findOne({ where: { [CodigoModelo]: Codigo } });
    if (!Objeto) return null;

    const CamposImagen = [
      'UrlComprobante',
    ];

    for (const campo of CamposImagen) {
      const urlOriginal = Objeto[campo];
      if (urlOriginal) {
        const urlConstruida = ConstruirUrlImagen(urlOriginal);
        try {
          await EliminarImagen(urlConstruida);
        } catch (error) {
          console.warn(`No se pudo eliminar la imagen del campo "${campo}": ${error.message}`);
        }
      }
    }

    await Objeto.destroy();
    return Objeto;

  } catch (error) {
    console.error("Error en la función Eliminar:", error.message);
    throw error;
  }
};

const ObtenerResumenGeneralPagos = async (Anio) => {
  const { Op, fn, col, where, literal } = Sequelize;

  const resumen = await Modelo.findAll({
    attributes: [
      [fn('COUNT', col('CodigoPago')), 'CantidadPagos'],
      [fn('SUM', literal(`CASE WHEN UrlComprobante IS NOT NULL AND LTRIM(RTRIM(UrlComprobante)) <> '' THEN 1 ELSE 0 END`)), 'PagosConComprobante'],
      [fn('SUM', literal(`CASE WHEN UrlComprobante IS NULL OR LTRIM(RTRIM(UrlComprobante)) = '' THEN 1 ELSE 0 END`)), 'PagosSinComprobante'],
      [fn('SUM', literal(`
        CASE 
          WHEN (UrlComprobante IS NULL OR LTRIM(RTRIM(UrlComprobante)) = '')
          AND FechaVencimientoPago < GETDATE() THEN 1 
          ELSE 0 
        END
      `)), 'PagosVencidosSinComprobante'],
      [fn('SUM', literal(`
        CASE 
          WHEN (UrlComprobante IS NULL OR LTRIM(RTRIM(UrlComprobante)) = '')
          AND FechaVencimientoPago >= GETDATE()
          AND FechaVencimientoPago <= DATEADD(day, 3, GETDATE()) THEN 1 
          ELSE 0 
        END
      `)), 'PagosPorVencer'],
      [fn('SUM', literal(`
        CASE 
          WHEN (UrlComprobante IS NULL OR LTRIM(RTRIM(UrlComprobante)) = '')
          AND FechaVencimientoPago > DATEADD(day, 3, GETDATE()) THEN 1 
          ELSE 0 
        END
      `)), 'PagosConTiempo']
    ],
    where: {
      Estatus: [1, 2, 3],
      [Op.and]: where(fn('YEAR', col('FechaVencimientoPago')), Anio)
    },
    raw: true
  });

  const r = resumen[0];

  const pagosPendientes = await Modelo.findAll({
    attributes: ['CodigoPago', 'FechaVencimientoPago'],
    where: {
      Estatus: [1, 2, 3],
      [Op.and]: [
        where(fn('YEAR', col('FechaVencimientoPago')), Anio),
        {
          [Op.or]: [
            { UrlComprobante: null },
            where(fn('LTRIM', fn('RTRIM', col('UrlComprobante'))), '')
          ]
        }
      ]
    },
    raw: true
  });

  const ahora = DateTime.now().setZone('America/Guatemala').startOf('day');
  const diasPorVencer = [];
  const diasConTiempo = [];

  for (const pago of pagosPendientes) {
    if (!pago.FechaVencimientoPago) continue;

    const fechaISO = pago.FechaVencimientoPago instanceof Date
      ? pago.FechaVencimientoPago.toISOString().slice(0, 10)
      : pago.FechaVencimientoPago.toString().slice(0, 10);

    const fechaVencimiento = DateTime.fromISO(fechaISO, { zone: 'America/Guatemala' }).startOf('day');
    const diferencia = fechaVencimiento.diff(ahora, 'days').days;
    const diasRestantes = diferencia >= 0 ? Math.floor(diferencia) + 1 : Math.floor(diferencia);

    if (diasRestantes >= 0 && diasRestantes <= 3) {
      diasPorVencer.push(diasRestantes);
    } else if (diasRestantes > 3) {
      diasConTiempo.push(diasRestantes);
    }
  }

  const resultadoFinal = {
    CantidadPagos: parseInt(r.CantidadPagos) || 0,
    PagosConComprobante: parseInt(r.PagosConComprobante) || 0,
    PagosSinComprobante: parseInt(r.PagosSinComprobante) || 0,
    PagosVencidosSinComprobante: parseInt(r.PagosVencidosSinComprobante) || 0,
    PagosPorVencer: parseInt(r.PagosPorVencer) || 0,
    PagosPorVencer_DetalleDias: diasPorVencer,
    PagosConTiempo: parseInt(r.PagosConTiempo) || 0,
    PagosConTiempo_DetalleDias: diasConTiempo
  };

  return resultadoFinal;
};



module.exports = { Listado, ObtenerPorCodigo, Buscar, Crear, Editar, Eliminar, ObtenerResumenGeneralPagos };
