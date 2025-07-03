const Path = require('path');
const BaseDatos = require('../BaseDatos/ConexionBaseDatos');
const Sequelize = require('sequelize');

const RutaModelos = Path.join(__dirname, '..', 'Modelos');

const UsuarioModelo = require(Path.join(RutaModelos, 'Usuario.js'))(BaseDatos, Sequelize.DataTypes);
const RolModelo = require(Path.join(RutaModelos, 'Rol.js'))(BaseDatos, Sequelize.DataTypes);
const PermisoModelo = require(Path.join(RutaModelos, 'Permiso.js'))(BaseDatos, Sequelize.DataTypes);
const RecursoModelo = require(Path.join(RutaModelos, 'Recurso.js'))(BaseDatos, Sequelize.DataTypes);
const PermisoRolRecursoModelo = require(Path.join(RutaModelos, 'PermisoRolRecurso.js'))(BaseDatos, Sequelize.DataTypes);
const Producto = require(Path.join(RutaModelos, 'Producto.js'))(BaseDatos, Sequelize.DataTypes);
const ClasificacionProducto = require(Path.join(RutaModelos, 'ClasificacionProducto.js'))(BaseDatos, Sequelize.DataTypes);
const ReporteProducto = require(Path.join(RutaModelos, 'ReporteProducto.js'))(BaseDatos, Sequelize.DataTypes);

const RedSocial = require(Path.join(RutaModelos, 'RedSocial.js'))(BaseDatos, Sequelize.DataTypes);
const RedSocialImagen = require(Path.join(RutaModelos, 'RedSocialImagen.js'))(BaseDatos, Sequelize.DataTypes);

// RedSocial tiene muchas RedSocialImagen
RedSocial.hasMany(RedSocialImagen, {
  foreignKey: 'CodigoRedSocial',
  as: 'Imagenes'
});

// RedSocialImagen pertenece a RedSocial
RedSocialImagen.belongsTo(RedSocial, {
  foreignKey: 'CodigoRedSocial',
  as: 'RedSocial'
});



UsuarioModelo.belongsTo(RolModelo, { foreignKey: 'CodigoRol',as: 'Rol' });
RolModelo.hasMany(UsuarioModelo, { foreignKey: 'CodigoRol' });

PermisoRolRecursoModelo.belongsTo(PermisoModelo, { foreignKey: 'CodigoPermiso', as: 'Permiso' });
PermisoModelo.hasMany(PermisoRolRecursoModelo, { foreignKey: 'CodigoPermiso', as: 'PermisoRolRecursos' });

PermisoRolRecursoModelo.belongsTo(RecursoModelo, { foreignKey: 'CodigoRecurso', as: 'Recurso' });
RecursoModelo.hasMany(PermisoRolRecursoModelo, { foreignKey: 'CodigoRecurso', as: 'PermisoRolRecursos' });

PermisoRolRecursoModelo.belongsTo(RolModelo, { foreignKey: 'CodigoRol', as: 'Rol' });
RolModelo.hasMany(PermisoRolRecursoModelo, { foreignKey: 'CodigoRol', as: 'PermisoRolRecursos' });

Producto.belongsTo(ClasificacionProducto, { foreignKey: 'CodigoClasificacion', as: 'ClasificacionProducto' });

// Relación: ClasificacionProducto tiene muchos productos
ClasificacionProducto.hasMany(Producto, { foreignKey: 'CodigoClasificacion', as: 'Productos' });

// Relación: ReporteProducto pertenece a un producto
ReporteProducto.belongsTo(Producto, { as: 'Producto', foreignKey: 'CodigoProducto' });


// Relación: Producto tiene muchos ReporteProducto
Producto.hasMany(ReporteProducto, { foreignKey: 'CodigoProducto', as: 'Reportes' });

module.exports = {
  UsuarioModelo,
  RolModelo,
  PermisoModelo,
  PermisoRolRecursoModelo,
  RecursoModelo,
  Producto,
  ClasificacionProducto,
  ReporteProducto,
  RedSocial,
  RedSocialImagen
};
