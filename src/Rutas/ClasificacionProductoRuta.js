const Express = require('express');
const Router = Express.Router();
const Modelo = 'clasificacionproducto';
const Tabla = 'ClasificacionProducto'
const { Listado, ObtenerPorCodigo, Buscar, Crear, Editar, Eliminar } = require('../Controladores/ClasificacionProductoControlador');
const VerificarToken = require('../FuncionIntermedia/VerificarToken');
const VerificarPermisos = require('../FuncionIntermedia/VerificarPermisos'); 

Router.get(`/${Modelo}/listado`, Listado);
Router.get(`/${Modelo}/:Codigo`, ObtenerPorCodigo);
Router.get(`/${Modelo}/buscar/:TipoBusqueda/:ValorBusqueda`,VerificarToken,VerificarPermisos('Buscar',Tabla), Buscar);
Router.post(`/${Modelo}/crear`, VerificarToken,VerificarPermisos('Crear',Tabla),Crear);
Router.put(`/${Modelo}/editar/:Codigo`, VerificarToken,VerificarPermisos('Editar',Tabla), Editar);
Router.delete(`/${Modelo}/eliminar/:Codigo`, VerificarToken,VerificarPermisos('Eliminar',Tabla),  Eliminar);


module.exports = Router;