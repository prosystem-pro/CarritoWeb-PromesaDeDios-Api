const Sequelize = require('sequelize');
const { GenerarToken, CompararClaves } = require("../Configuracion/AutorizacionConfiguracion");
const { UsuarioModelo, RolModelo, EmpresaModelo } = require('../Relaciones/Relaciones'); // Importar desde Relaciones.js

const IniciarSesionServicio = async (NombreUsuario, Clave) => {
  const Usuario = await UsuarioModelo.findOne({
    where: { NombreUsuario },
    include: [{
      model: RolModelo,
      as: 'Rol',
      attributes: ['NombreRol', 'Estatus']
    },
    //Nueva vinculación
    {
      model: EmpresaModelo,
      as: 'Empresa',
      attributes: ['NombreEmpresa', 'Estatus'] // Traer Estatus de la Empresa
    }]
  });

  if (!Usuario) throw new Error("Usuario o contraseña incorrectos");

  const Valida = await CompararClaves(Clave, Usuario.ClaveHash);
  if (!Valida) throw new Error("Usuario o contraseña incorrectos");

  if (Usuario.SuperAdmin === 1) {
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
      }
    };
  }

  if (Usuario.Estatus !== 1) throw new Error("Usuario inactivo");
  if (!Usuario.Rol || Usuario.Rol.Estatus !== 1) throw new Error("Rol inactivo o no asignado");
  if (!Usuario.Empresa || Usuario.Empresa.Estatus !== 1) throw new Error("Empresa inactiva o no asignada");

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
