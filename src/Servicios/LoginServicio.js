const Sequelize = require('sequelize');
const { GenerarToken, CompararClaves } = require("../Configuracion/AutorizacionConfiguracion");
const { UsuarioModelo, RolModelo, EmpresaModelo } = require('../Relaciones/Relaciones');
const { LanzarError } = require('../Utilidades/ErrorServicios');
const { ObtenerPermisosFrontEnd } = require('../Servicios/PermisoRolRecursoServicio');

// const IniciarSesionServicio = async (NombreUsuario, Clave) => {
//   if (!NombreUsuario || !Clave) {
//     LanzarError("Nombre de usuario y contraseña son requeridos", 400 );
//   }

//   const Usuario = await UsuarioModelo.findOne({
//     where: { NombreUsuario },
//     include: [
//       {
//         model: RolModelo,
//         as: 'Rol',
//         attributes: ['NombreRol', 'Estatus']
//       },
//       {
//         model: EmpresaModelo,
//         as: 'Empresa',
//         attributes: ['NombreEmpresa', 'Estatus']
//       }
//     ]
//   });

//   if (!Usuario) LanzarError("Usuario o contraseña incorrectos", 400);

//   const Valida = await CompararClaves(Clave, Usuario.ClaveHash);
//   if (!Valida) LanzarError("Usuario o contraseña incorrectos", 400);

//   if (Usuario.SuperAdmin === 1) {
//     const Token = GenerarToken({
//       CodigoUsuario: Usuario.CodigoUsuario,
//       CodigoRol: Usuario.CodigoRol,
//       NombreUsuario: Usuario.NombreUsuario,
//       NombreRol: Usuario.Rol?.NombreRol || null,
//       SuperAdmin: Usuario.SuperAdmin
//     });

//     return {
//       Token,
//       usuario: {
//         CodigoUsuario: Usuario.CodigoUsuario,
//         NombreUsuario: Usuario.NombreUsuario,
//         CodigoRol: Usuario.CodigoRol,
//         NombreRol: Usuario.Rol?.NombreRol || null
//       }
//     };
//   }

//   if (Usuario.Estatus !== 1) LanzarError("Usuario inactivo", 403);
//   if (!Usuario.Rol || Usuario.Rol.Estatus !== 1) LanzarError("Rol inactivo o no asignado", 403);
//   if (!Usuario.Empresa || Usuario.Empresa.Estatus !== 1) LanzarError("Empresa inactiva o no asignada", 403);

//   const Token = GenerarToken({
//     CodigoUsuario: Usuario.CodigoUsuario,
//     CodigoRol: Usuario.CodigoRol,
//     NombreUsuario: Usuario.NombreUsuario,
//     NombreRol: Usuario.Rol?.NombreRol || null,
//     SuperAdmin: Usuario.SuperAdmin
//   });

//   return {
//     Token,
//     usuario: {
//       CodigoUsuario: Usuario.CodigoUsuario,
//       NombreUsuario: Usuario.NombreUsuario,
//       CodigoRol: Usuario.CodigoRol,
//       NombreRol: Usuario.Rol?.NombreRol || null
//     }
//   };
// };

const IniciarSesionServicio = async (NombreUsuario, Clave) => {
  if (!NombreUsuario || !Clave) {
    LanzarError("Nombre de usuario y contraseña son requeridos", 400);
  }

  const Usuario = await UsuarioModelo.findOne({
    where: { NombreUsuario },
    include: [
      {
        model: RolModelo,
        as: 'Rol',
        attributes: ['CodigoRol', 'NombreRol', 'Estatus']
      },
      {
        model: EmpresaModelo,
        as: 'Empresa',
        attributes: ['NombreEmpresa', 'Estatus']
      }
    ]
  });

  if (!Usuario) LanzarError("Usuario o contraseña incorrectos", 400);

  const Valida = await CompararClaves(Clave, Usuario.ClaveHash);
  if (!Valida) LanzarError("Usuario o contraseña incorrectos", 400);

  // Si es SuperAdmin, asignamos flag y no enviamos permisos
  if (Usuario.SuperAdmin === 1) {
    const Token = GenerarToken({
      CodigoUsuario: Usuario.CodigoUsuario,
      CodigoRol: null,
      NombreUsuario: Usuario.NombreUsuario,
      NombreRol: null,
      SuperAdmin: true,
      AccesoCompleto: true  // flag claro para frontend
    });

    return {
      Token,
      usuario: {
        CodigoUsuario: Usuario.CodigoUsuario,
        NombreUsuario: Usuario.NombreUsuario,
        CodigoRol: null,
        NombreRol: null,
        SuperAdmin: true,
        AccesoCompleto: true,
        Permisos: [] // sin permisos individuales
      }
    };
  }

  // Validaciones para usuarios normales
  if (Usuario.Estatus !== 1) LanzarError("Usuario inactivo", 403);
  if (!Usuario.Rol || Usuario.Rol.Estatus !== 1) LanzarError("Rol inactivo o no asignado", 403);
  if (!Usuario.Empresa || Usuario.Empresa.Estatus !== 1) LanzarError("Empresa inactiva o no asignada", 403);

  const permisos = await ObtenerPermisosFrontEnd(Usuario.CodigoRol);

  const Token = GenerarToken({
    CodigoUsuario: Usuario.CodigoUsuario,
    CodigoRol: Usuario.CodigoRol,
    NombreUsuario: Usuario.NombreUsuario,
    NombreRol: Usuario.Rol?.NombreRol || null,
    SuperAdmin: false,
    AccesoCompleto: false,
    Permisos: permisos.Recursos
  });

  return {
    Token,
    usuario: {
      CodigoUsuario: Usuario.CodigoUsuario,
      NombreUsuario: Usuario.NombreUsuario,
      CodigoRol: Usuario.CodigoRol,
      NombreRol: Usuario.Rol?.NombreRol || null,
      SuperAdmin: false,
      AccesoCompleto: false,
      Permisos: permisos.Recursos
    }
  };
};

module.exports = { IniciarSesionServicio };
