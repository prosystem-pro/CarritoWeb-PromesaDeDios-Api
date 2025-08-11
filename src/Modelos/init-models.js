var DataTypes = require("sequelize").DataTypes;
var _AlertaEstilo = require("./alertaEstilo");
var _AlertaEstiloBoton = require("./alertaEstiloBoton");
var _CarritoPortada = require("./carritoPortada");
var _Carrusel = require("./carrusel");
var _CarruselImagen = require("./carruselImagen");
var _ClasificacionProducto = require("./clasificacionProducto");
var _ContactanosPortada = require("./contactanosPortada");
var _Empresa = require("./empresa");
var _EmpresaPortada = require("./empresaPortada");
var _Footer = require("./footer");
var _Icono = require("./icono");
var _LoginPortada = require("./loginPortada");
var _Logo = require("./logo");
var _LogoImagen = require("./logoImagen");
var _MenuPortada = require("./menuPortada");
var _Navbar = require("./navbar");
var _Otro = require("./otro");
var _Pago = require("./pago");
var _Permiso = require("./permiso");
var _PermisoRolRecurso = require("./permisoRolRecurso");
var _PortadaOtro = require("./portadaOtro");
var _Producto = require("./producto");
var _ProductoPortada = require("./productoPortada");
var _Recurso = require("./recurso");
var _RedSocial = require("./redSocial");
var _RedSocialImagen = require("./redSocialImagen");
var _ReporteProducto = require("./reporteProducto");
var _ReporteRedSocial = require("./reporteRedSocial");
var _ReporteRedSocialPortada = require("./reporteRedSocialPortada");
var _ReporteTiempoPagina = require("./reporteTiempoPagina");
var _ReporteTiempoPaginaPortada = require("./reporteTiempoPaginaPortada");
var _ReporteVista = require("./reporteVista");
var _ReporteVistaPortada = require("./reporteVistaPortada");
var _Rol = require("./rol");
var _Usuario = require("./usuario");

function initModels(sequelize) {
  var AlertaEstilo = _AlertaEstilo(sequelize, DataTypes);
  var AlertaEstiloBoton = _AlertaEstiloBoton(sequelize, DataTypes);
  var CarritoPortada = _CarritoPortada(sequelize, DataTypes);
  var Carrusel = _Carrusel(sequelize, DataTypes);
  var CarruselImagen = _CarruselImagen(sequelize, DataTypes);
  var ClasificacionProducto = _ClasificacionProducto(sequelize, DataTypes);
  var ContactanosPortada = _ContactanosPortada(sequelize, DataTypes);
  var Empresa = _Empresa(sequelize, DataTypes);
  var EmpresaPortada = _EmpresaPortada(sequelize, DataTypes);
  var Footer = _Footer(sequelize, DataTypes);
  var Icono = _Icono(sequelize, DataTypes);
  var LoginPortada = _LoginPortada(sequelize, DataTypes);
  var Logo = _Logo(sequelize, DataTypes);
  var LogoImagen = _LogoImagen(sequelize, DataTypes);
  var MenuPortada = _MenuPortada(sequelize, DataTypes);
  var Navbar = _Navbar(sequelize, DataTypes);
  var Otro = _Otro(sequelize, DataTypes);
  var Pago = _Pago(sequelize, DataTypes);
  var Permiso = _Permiso(sequelize, DataTypes);
  var PermisoRolRecurso = _PermisoRolRecurso(sequelize, DataTypes);
  var PortadaOtro = _PortadaOtro(sequelize, DataTypes);
  var Producto = _Producto(sequelize, DataTypes);
  var ProductoPortada = _ProductoPortada(sequelize, DataTypes);
  var Recurso = _Recurso(sequelize, DataTypes);
  var RedSocial = _RedSocial(sequelize, DataTypes);
  var RedSocialImagen = _RedSocialImagen(sequelize, DataTypes);
  var ReporteProducto = _ReporteProducto(sequelize, DataTypes);
  var ReporteRedSocial = _ReporteRedSocial(sequelize, DataTypes);
  var ReporteRedSocialPortada = _ReporteRedSocialPortada(sequelize, DataTypes);
  var ReporteTiempoPagina = _ReporteTiempoPagina(sequelize, DataTypes);
  var ReporteTiempoPaginaPortada = _ReporteTiempoPaginaPortada(sequelize, DataTypes);
  var ReporteVista = _ReporteVista(sequelize, DataTypes);
  var ReporteVistaPortada = _ReporteVistaPortada(sequelize, DataTypes);
  var Rol = _Rol(sequelize, DataTypes);
  var Usuario = _Usuario(sequelize, DataTypes);

  Pago.belongsTo(Empresa, { as: "CodigoEmpresa_Empresa", foreignKey: "CodigoEmpresa"});
  Empresa.hasMany(Pago, { as: "Pagos", foreignKey: "CodigoEmpresa"});
  Usuario.belongsTo(Empresa, { as: "CodigoEmpresa_Empresa", foreignKey: "CodigoEmpresa"});
  Empresa.hasMany(Usuario, { as: "Usuarios", foreignKey: "CodigoEmpresa"});
  Carrusel.belongsTo(Empresa, { as: "CodigoEmpresa_Empresa", foreignKey: "CodigoEmpresa"});
  Empresa.hasMany(Carrusel, { as: "Carrusels", foreignKey: "CodigoEmpresa"});
  ClasificacionProducto.belongsTo(Empresa, { as: "CodigoEmpresa_Empresa", foreignKey: "CodigoEmpresa"});
  Empresa.hasMany(ClasificacionProducto, { as: "ClasificacionProductos", foreignKey: "CodigoEmpresa"});
  Icono.belongsTo(Empresa, { as: "CodigoEmpresa_Empresa", foreignKey: "CodigoEmpresa"});
  Empresa.hasMany(Icono, { as: "Iconos", foreignKey: "CodigoEmpresa"});
  Logo.belongsTo(Empresa, { as: "CodigoEmpresa_Empresa", foreignKey: "CodigoEmpresa"});
  Empresa.hasMany(Logo, { as: "Logos", foreignKey: "CodigoEmpresa"});
  Otro.belongsTo(Empresa, { as: "CodigoEmpresa_Empresa", foreignKey: "CodigoEmpresa"});
  Empresa.hasMany(Otro, { as: "Otros", foreignKey: "CodigoEmpresa"});
  RedSocial.belongsTo(Empresa, { as: "CodigoEmpresa_Empresa", foreignKey: "CodigoEmpresa"});
  Empresa.hasMany(RedSocial, { as: "RedSocials", foreignKey: "CodigoEmpresa"});
  CarritoPortada.belongsTo(Empresa, { as: "CodigoEmpresa_Empresa", foreignKey: "CodigoEmpresa"});
  Empresa.hasMany(CarritoPortada, { as: "CarritoPortadas", foreignKey: "CodigoEmpresa"});
  AlertaEstilo.belongsTo(Empresa, { as: "CodigoEmpresa_Empresa", foreignKey: "CodigoEmpresa"});
  Empresa.hasMany(AlertaEstilo, { as: "AlertaEstilos", foreignKey: "CodigoEmpresa"});
  ContactanosPortada.belongsTo(Empresa, { as: "CodigoEmpresa_Empresa", foreignKey: "CodigoEmpresa"});
  Empresa.hasMany(ContactanosPortada, { as: "ContactanosPortadas", foreignKey: "CodigoEmpresa"});
  EmpresaPortada.belongsTo(Empresa, { as: "CodigoEmpresa_Empresa", foreignKey: "CodigoEmpresa"});
  Empresa.hasMany(EmpresaPortada, { as: "EmpresaPortadas", foreignKey: "CodigoEmpresa"});
  Footer.belongsTo(Empresa, { as: "CodigoEmpresa_Empresa", foreignKey: "CodigoEmpresa"});
  Empresa.hasMany(Footer, { as: "Footers", foreignKey: "CodigoEmpresa"});
  MenuPortada.belongsTo(Empresa, { as: "CodigoEmpresa_Empresa", foreignKey: "CodigoEmpresa"});
  Empresa.hasMany(MenuPortada, { as: "MenuPortadas", foreignKey: "CodigoEmpresa"});
  Navbar.belongsTo(Empresa, { as: "CodigoEmpresa_Empresa", foreignKey: "CodigoEmpresa"});
  Empresa.hasMany(Navbar, { as: "Navbars", foreignKey: "CodigoEmpresa"});
  PortadaOtro.belongsTo(Empresa, { as: "CodigoEmpresa_Empresa", foreignKey: "CodigoEmpresa"});
  Empresa.hasMany(PortadaOtro, { as: "PortadaOtros", foreignKey: "CodigoEmpresa"});
  ProductoPortada.belongsTo(Empresa, { as: "CodigoEmpresa_Empresa", foreignKey: "CodigoEmpresa"});
  Empresa.hasMany(ProductoPortada, { as: "ProductoPortadas", foreignKey: "CodigoEmpresa"});
  ReporteRedSocialPortada.belongsTo(Empresa, { as: "CodigoEmpresa_Empresa", foreignKey: "CodigoEmpresa"});
  Empresa.hasMany(ReporteRedSocialPortada, { as: "ReporteRedSocialPortadas", foreignKey: "CodigoEmpresa"});
  ReporteTiempoPaginaPortada.belongsTo(Empresa, { as: "CodigoEmpresa_Empresa", foreignKey: "CodigoEmpresa"});
  Empresa.hasMany(ReporteTiempoPaginaPortada, { as: "ReporteTiempoPaginaPortadas", foreignKey: "CodigoEmpresa"});
  ReporteVistaPortada.belongsTo(Empresa, { as: "CodigoEmpresa_Empresa", foreignKey: "CodigoEmpresa"});
  Empresa.hasMany(ReporteVistaPortada, { as: "ReporteVistaPortadas", foreignKey: "CodigoEmpresa"});
  PermisoRolRecurso.belongsTo(Permiso, { as: "CodigoPermiso_Permiso", foreignKey: "CodigoPermiso"});
  Permiso.hasMany(PermisoRolRecurso, { as: "PermisoRolRecursos", foreignKey: "CodigoPermiso"});
  PermisoRolRecurso.belongsTo(Recurso, { as: "CodigoRecurso_Recurso", foreignKey: "CodigoRecurso"});
  Recurso.hasMany(PermisoRolRecurso, { as: "PermisoRolRecursos", foreignKey: "CodigoRecurso"});
  PermisoRolRecurso.belongsTo(Rol, { as: "CodigoRol_Rol", foreignKey: "CodigoRol"});
  Rol.hasMany(PermisoRolRecurso, { as: "PermisoRolRecursos", foreignKey: "CodigoRol"});
  Usuario.belongsTo(Rol, { as: "CodigoRol_Rol", foreignKey: "CodigoRol"});
  Rol.hasMany(Usuario, { as: "Usuarios", foreignKey: "CodigoRol"});
  CarruselImagen.belongsTo(Carrusel, { as: "CodigoCarrusel_Carrusel", foreignKey: "CodigoCarrusel"});
  Carrusel.hasMany(CarruselImagen, { as: "CarruselImagens", foreignKey: "CodigoCarrusel"});
  Producto.belongsTo(ClasificacionProducto, { as: "CodigoClasificacionProducto_ClasificacionProducto", foreignKey: "CodigoClasificacionProducto"});
  ClasificacionProducto.hasMany(Producto, { as: "Productos", foreignKey: "CodigoClasificacionProducto"});
  LogoImagen.belongsTo(Logo, { as: "CodigoLogo_Logo", foreignKey: "CodigoLogo"});
  Logo.hasMany(LogoImagen, { as: "LogoImagens", foreignKey: "CodigoLogo"});
  ReporteProducto.belongsTo(Producto, { as: "CodigoProducto_Producto", foreignKey: "CodigoProducto"});
  Producto.hasMany(ReporteProducto, { as: "ReporteProductos", foreignKey: "CodigoProducto"});
  ReporteRedSocial.belongsTo(RedSocial, { as: "CodigoRedSocial_RedSocial", foreignKey: "CodigoRedSocial"});
  RedSocial.hasMany(ReporteRedSocial, { as: "ReporteRedSocials", foreignKey: "CodigoRedSocial"});
  RedSocialImagen.belongsTo(RedSocial, { as: "CodigoRedSocial_RedSocial", foreignKey: "CodigoRedSocial"});
  RedSocial.hasMany(RedSocialImagen, { as: "RedSocialImagens", foreignKey: "CodigoRedSocial"});
  AlertaEstiloBoton.belongsTo(AlertaEstilo, { as: "CodigoAlertaEstilo_AlertaEstilo", foreignKey: "CodigoAlertaEstilo"});
  AlertaEstilo.hasMany(AlertaEstiloBoton, { as: "AlertaEstiloBotons", foreignKey: "CodigoAlertaEstilo"});

  return {
    AlertaEstilo,
    AlertaEstiloBoton,
    CarritoPortada,
    Carrusel,
    CarruselImagen,
    ClasificacionProducto,
    ContactanosPortada,
    Empresa,
    EmpresaPortada,
    Footer,
    Icono,
    LoginPortada,
    Logo,
    LogoImagen,
    MenuPortada,
    Navbar,
    Otro,
    Pago,
    Permiso,
    PermisoRolRecurso,
    PortadaOtro,
    Producto,
    ProductoPortada,
    Recurso,
    RedSocial,
    RedSocialImagen,
    ReporteProducto,
    ReporteRedSocial,
    ReporteRedSocialPortada,
    ReporteTiempoPagina,
    ReporteTiempoPaginaPortada,
    ReporteVista,
    ReporteVistaPortada,
    Rol,
    Usuario,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
