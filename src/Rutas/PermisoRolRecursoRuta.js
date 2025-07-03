const Express = require('express');
const Router = Express.Router();
const Modelo = 'permisorolrecurso';
const Tabla = 'PermisoRolRecurso'
const { Listado, ObtenerPorCodigo, Buscar, Crear, Editar, Eliminar, ObtenerPermisosAsignados, ObtenerRecursosDisponibles } = require('../Controladores/PermisoRolRecursoControlador');
const VerificarToken = require('../FuncionIntermedia/VerificarToken');
const VerificarPermisos = require('../FuncionIntermedia/VerificarPermisos'); 

Router.get(`/${Modelo}/listado`, Listado);
Router.get(`/${Modelo}/:CodigoRol/:CodigoPermiso/:CodigoRecurso`,VerificarToken,VerificarPermisos('Ver',Tabla), ObtenerPorCodigo);
Router.get(`/${Modelo}/buscar/:TipoBusqueda/:ValorBusqueda`,VerificarToken,VerificarPermisos('Buscar',Tabla), Buscar);
Router.post(`/${Modelo}/crear`, VerificarToken,VerificarPermisos('Crear', Tabla),Crear);
Router.put(`/${Modelo}/editar/:CodigoRol/:CodigoPermiso/:CodigoRecurso`, VerificarToken, VerificarPermisos('Editar', Tabla), Editar);
Router.delete(`/${Modelo}/eliminar/:CodigoRol/:CodigoPermiso/:CodigoRecurso`, VerificarToken,VerificarPermisos('Eliminar',Tabla),  Eliminar);
Router.get(`/${Modelo}/obtener-permisos/:CodigoRol`, VerificarToken, VerificarPermisos('Ver', Tabla), ObtenerPermisosAsignados);
Router.get(`/${Modelo}-obtener-recursos/:CodigoRol/:CodigoPermiso`, VerificarToken, VerificarPermisos('Ver', Tabla), ObtenerRecursosDisponibles);

module.exports = Router;