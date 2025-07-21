const Express = require('express');
const Router = Express.Router();
const Modelo = 'producto';
const Tabla = 'Producto'
const { Listado, ObtenerPorCodigo, Buscar, Crear, Editar, Eliminar, ListadoPorClasificacion } = require('../Controladores/ProductoControlador');
const VerificarToken = require('../FuncionIntermedia/VerificarToken');
const VerificarPermisos = require('../FuncionIntermedia/VerificarPermisos'); 
const ObtenerInformacionTokenRuta = require('../FuncionIntermedia/ObtenerInformacionTokenRuta'); 

Router.get(`/${Modelo}/listado`,ObtenerInformacionTokenRuta, Listado);
Router.get(`/${Modelo}/:Codigo`,VerificarToken,VerificarPermisos('VerUnidad',Tabla), ObtenerPorCodigo);
Router.get(`/${Modelo}/buscar/:TipoBusqueda/:ValorBusqueda`, Buscar);
Router.post(`/${Modelo}/crear`, VerificarToken,VerificarPermisos('Crear',Tabla),Crear);
Router.put(`/${Modelo}/editar/:Codigo`, VerificarToken,VerificarPermisos('Editar',Tabla), Editar);
Router.delete(`/${Modelo}/eliminar/:Codigo`, VerificarToken,VerificarPermisos('Eliminar',Tabla),  Eliminar);
Router.get(`/${Modelo}/listado/:Codigo`, ListadoPorClasificacion);

module.exports = Router;