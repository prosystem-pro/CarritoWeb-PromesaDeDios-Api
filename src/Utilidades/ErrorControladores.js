const ManejarError = (error, res, MensajeError, statusCode = 500) => {
  const esDesarrollo = process.env.ALERTA_ERRORES === 'Desarrollo';

  const DetallesError = {
    message: error.message,
    stack: error.stack,
    type: error.name,
    innerError: error.innerError ? error.innerError.message : null,
    innerStack: error.innerError ? error.innerError.stack : null
  };

  console.error('Error detectado:', DetallesError);

  const respuesta = {
    success: false,
    message: MensajeError,
    error: esDesarrollo ? DetallesError : { message: error.message }
  };

  return res.status(statusCode).json(respuesta);
};

module.exports = ManejarError;

  