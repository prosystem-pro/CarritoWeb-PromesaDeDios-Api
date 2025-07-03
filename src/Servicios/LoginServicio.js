const Sequelize = require('sequelize');
const { GenerarToken, CompararClaves } = require("../Configuracion/AutorizacionConfiguracion");
const { UsuarioModelo, RolModelo } = require('../Relaciones/Relaciones'); // Importar desde Relaciones.js

const IniciarSesionServicio = async (NombreUsuario, Clave) => {
  const Usuario = await UsuarioModelo.findOne({
    where: { NombreUsuario },
    include: [{
      model: RolModelo,
      as: 'Rol',
      attributes: ['NombreRol']
    }]
  });

  if (!Usuario) throw new Error("Usuario o contraseña incorrectos");

  if (Usuario.Estatus !== 1) throw new Error("Usuario inactivo");

  const Valida = await CompararClaves(Clave, Usuario.ClaveHash);
  if (!Valida) throw new Error("Usuario o contraseña incorrectos");

  const Token = GenerarToken({
    CodigoUsuario: Usuario.CodigoUsuario,
    CodigoRol: Usuario.CodigoRol,
    NombreUsuario: Usuario.NombreUsuario,
    NombreRol: Usuario.Rol?.NombreRol || null,  
    SuperAdmin: Usuario.SuperAdmin  
  });
  
  return {
    Token,
    usuario: {
      CodigoUsuario: Usuario.CodigoUsuario,
      NombreUsuario: Usuario.NombreUsuario,
      CodigoRol: Usuario.CodigoRol,
      NombreRol: Usuario.Rol?.NombreRol || null 
    },
  };
};

module.exports = { IniciarSesionServicio };
