const { GenerarModelos } = require("../Servicios/GenerarModeloTypescriptServicio");
const ManejarError = require("../Utilidades/ErrorControladores");

const GenerarModelosControlador = async (req, res) => {
  try {
    const ModelosTS = await GenerarModelos();
    res.status(200).json(ModelosTS);
  } catch (error) {
    ManejarError(error, res, "Error al generar modelos");
  }
};

module.exports = { GenerarModelosControlador };
