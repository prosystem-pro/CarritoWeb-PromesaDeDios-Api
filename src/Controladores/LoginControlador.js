const { IniciarSesionServicio } = require('../Servicios/LoginServicio');

const IniciarSesion = async (req, res) => {
  try {
    const { NombreUsuario, Clave } = req.body;

    if (!NombreUsuario || !Clave) {
      return res.status(400).json({ error: "Nombre de usuario y contraseña son requeridos" });
    }

    const Resultado = await IniciarSesionServicio(NombreUsuario, Clave);
    res.json(Resultado);
  } catch (error) {
    console.error("Error en iniciar sesión:", error);
    res.status(401).json({ error: error.message || "Error en el servidor" });
  }
};

module.exports = { IniciarSesion };
