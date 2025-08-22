const ManejarError = (error, res, mensajeError = 'Error inesperado', statusCodeDefault = 500) => {
  const Desarrollo = process.env.ALERTA_ERRORES === 'Desarrollo';

  const statusCode = error.statusCode || statusCodeDefault;
  const tipo = error.tipo || (statusCode >= 500 ? 'Error' : 'Alerta');

  const DetallesError = {
    message: error.message,
    stack: error.stack,
    type: error.name,
    innerError: error.innerError ? error.innerError.message : null,
    innerStack: error.innerError ? error.innerError.stack : null
  };

  console.error('Error detectado:', DetallesError);

  // const respuesta = {
  //   success: false,
  //   tipo,
  //   message: mensajeError,
  //   ...(Desarrollo && { error: DetallesError }) 
  // };
    const respuesta = {
    success: false,
    tipo,
    message: mensajeError,
    error: Desarrollo 
      ? DetallesError          
      : { message: mensajeError } 
  };

  return res.status(statusCode).json(respuesta);
};

module.exports = ManejarError;
