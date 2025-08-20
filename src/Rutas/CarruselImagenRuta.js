const Express = require('express');
const Router = Express.Router();
const Modelo = 'carruselimagen';
const Tabla = 'CarruselImagen'
const { Listado, ObtenerPorCodigo, Buscar, Crear, Editar, Eliminar, ListadoPorCarrusel } = require('../Controladores/CarruselImagenControlador');
const { SubirImagen } = require("../Controladores/SubirImagenControlador");

const VerificarToken = require('../FuncionIntermedia/VerificarToken');
const VerificarPermisos = require('../FuncionIntermedia/VerificarPermisos'); 
const { Subir } = require("../FuncionIntermedia/SubirImagen");

Router.get(`/${Modelo}/listado`, Listado);
Router.get(`/${Modelo}/:Codigo`,VerificarToken,VerificarPermisos('VerUnidad',Tabla), ObtenerPorCodigo);
Router.get(`/${Modelo}/buscar/:TipoBusqueda/:ValorBusqueda`,VerificarToken,VerificarPermisos('Buscar',Tabla), Buscar);
Router.post(`/${Modelo}/crear`, VerificarToken,VerificarPermisos('Crear',Tabla),Crear);
Router.put(`/${Modelo}/editar/:Codigo`, VerificarToken,VerificarPermisos('Editar',Tabla), Editar);
Router.delete(`/${Modelo}/eliminar/:Codigo`, VerificarToken,VerificarPermisos('Eliminar',Tabla),  Eliminar);
Router.get(`/${Modelo}/listado/:CodigoCarrusel`, ListadoPorCarrusel);
Router.post(`/${Modelo}/subir-imagen`, VerificarToken, VerificarPermisos("SubirImagen", Tabla),Subir.single("Imagen"), SubirImagen);



module.exports = Router;