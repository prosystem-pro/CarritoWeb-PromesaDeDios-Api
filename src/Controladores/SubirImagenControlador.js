const ManejarError = require('../Utilidades/ErrorControladores');
const { SubirImagenAlmacenamiento } = require("../Servicios/SubirImagenServicio");
const { EliminarImagen } = require("../Servicios/EliminarImagenServicio");
const { ConstruirUrlImagen } = require('../Utilidades/ConstruirUrlImagen');
const { Almacenamiento } = require("../Configuracion/FirebaseConfiguracion");

const Servicios = {
  EmpresaPortada: require("../Servicios/EmpresaPortadaServicio"),
  Navbar: require("../Servicios/NavbarServicio"),
  Footer: require("../Servicios/FooterServicio"),
  Carrusel: require("../Servicios/CarruselServicio"),
  CarruselImagen: require("../Servicios/CarruselImagenServicio"),
  ClasificacionProducto: require("../Servicios/ClasificacionProductoServicio"),
  RedSocial: require("../Servicios/RedSocialServicio"),
  Otro: require("../Servicios/OtroServicio"),
  ContactanosPortada: require("../Servicios/ContactanosPortadaServicio"),
  Producto: require("../Servicios/ProductoServicio"),
  ProductoPortada: require("../Servicios/ProductoPortadaServicio"),
  CarritoPortada: require("../Servicios/CarritoPortadaServicio"),
  MenuPortada: require("../Servicios/MenuPortadaServicio"),
  LogoImagen: require("../Servicios/LogoImagenServicio"),
  LoginPortada: require("../Servicios/LoginPortadaServicio"),
  RedSocialImagen: require("../Servicios/RedSocialImagenServicio"),
};

const SubirImagen = async (req, res) => {
  let RutaRelativa = "";
  let UrlPublica = "";
  let ImagenAnterior = ""; // para eliminar si todo sale bien
  let EstaEditando = false;

  try {
    if (!req.file) {
      return res.status(400).json({ Error: "No se envió ninguna imagen" });
    }

    const {
      CarpetaPrincipal,
      SubCarpeta,
      CodigoVinculado,
      CodigoPropio,
      CampoVinculado,
      CampoPropio,
      NombreCampoImagen,
    } = req.body;

    if (!CarpetaPrincipal || !SubCarpeta) {
      return res.status(400).json({ Error: "Las carpetas son obligatorias" });
    }

    const Servicio = Servicios[SubCarpeta];
    if (!Servicio) {
      return res.status(400).json({ Error: `No hay servicio para la carpeta ${SubCarpeta}` });
    }

    const [archivos] = await Almacenamiento.getFiles({
      prefix: `${CarpetaPrincipal}/`
    });

    let totalBytes = 0;
    for (const archivo of archivos) {
      const [metadata] = await archivo.getMetadata();
      totalBytes += Number(metadata.size || 0);
    }

    if (totalBytes >= 950 * 1024 * 1024) {
      return res.status(400).json({
        Alerta: "El límite de almacenamiento ha sido alcanzado. No se puede subir más imágenes."
      });
    }

    let CuentaComoNuevaImagen = false;

    if (!CodigoPropio && CodigoVinculado) {
      CuentaComoNuevaImagen = true;
    } else if (CodigoPropio) {
      const EntidadExistente = await Servicio.ObtenerPorCodigo(CodigoPropio);

      if (!EntidadExistente) {
        return res.status(400).json({ Alerta: "No se encontró el registro a editar, se alcanzó el límite máximo de imágenes permitidas" });
      }

      const ImagenActual = EntidadExistente[NombreCampoImagen];
      if (!ImagenActual || ImagenActual.trim() === '') {
        CuentaComoNuevaImagen = true;
      }
    } else {
      CuentaComoNuevaImagen = true;
    }

    if (CuentaComoNuevaImagen && archivos.length >= 250) {
      return res.status(400).json({
        Alerta: "Se alcanzó el límite máximo de imágenes permitidas"
      });
    }

    if (!req.file) {
      return res.status(400).json({
        Alerta: "Debes subir una imagen para continuar."
      });
    }

    RutaRelativa = await SubirImagenAlmacenamiento(req.file, CarpetaPrincipal, SubCarpeta);
    UrlPublica = `${process.env.URL_PUBLICA_FIREBASE}${RutaRelativa}`;

    let Entidad = {};
    let Datos = {};

    if (CodigoVinculado && !CodigoPropio) {
      Datos[CampoVinculado] = CodigoVinculado;
      Datos[NombreCampoImagen] = RutaRelativa;
      // throw new Error("Error intencional en edición para prueba"); // para probar el catch
      Entidad = await Servicio.Crear(Datos);

    } else if (!CodigoVinculado && CodigoPropio) {
      EstaEditando = true;
      Datos[CampoPropio] = CodigoPropio;
      const EntidadExistente = await Servicio.ObtenerPorCodigo(CodigoPropio);

      if (EntidadExistente && EntidadExistente[NombreCampoImagen]) {
        ImagenAnterior = EntidadExistente[NombreCampoImagen]; // solo si hay una existente
      }

      Datos[NombreCampoImagen] = RutaRelativa;
      // throw new Error("Error intencional en edición para prueba"); // para probar el catch
      Entidad = await Servicio.Editar(CodigoPropio, Datos);

    } else if (CodigoVinculado && CodigoPropio) {
      EstaEditando = true;
      Datos[CampoVinculado] = CodigoVinculado;
      Datos[CampoPropio] = CodigoPropio;

      const EntidadExistente = await Servicio.ObtenerPorCodigo(CodigoPropio);

      if (EntidadExistente && EntidadExistente[NombreCampoImagen]) {
        ImagenAnterior = EntidadExistente[NombreCampoImagen];
      }

      Datos[NombreCampoImagen] = RutaRelativa;
      // throw new Error("Error intencional en edición para prueba"); // para probar el catch
      Entidad = await Servicio.Editar(CodigoPropio, Datos);

    } else {
      Datos[NombreCampoImagen] = RutaRelativa;
      // throw new Error("Error intencional en edición para prueba"); // para probar el catch
      Entidad = await Servicio.Crear(Datos);
    }

    // === SI LLEGA HASTA AQUÍ, LA EDICIÓN FUE EXITOSA Y PODEMOS BORRAR LA ANTERIOR ===
    if (EstaEditando && ImagenAnterior) {
      await EliminarImagen(ImagenAnterior);
      console.log("Imagen anterior eliminada correctamente:", ImagenAnterior);
    }

    // if (Entidad && Entidad[NombreCampoImagen]) {
    //   Entidad[NombreCampoImagen] = ConstruirUrlImagen(Entidad[NombreCampoImagen]);
    // }

    return res.status(201).json({
      Mensaje: `${SubCarpeta} procesado con éxito`,
      Entidad,
      UrlImagenPublica: UrlPublica
    });

  } catch (error) {
    if (UrlPublica) {
      try {
        console.log("Intentando eliminar imagen nueva tras error:", UrlPublica);
        await EliminarImagen(UrlPublica);
      } catch (errEliminar) {
        console.error("Error eliminando imagen subida tras fallo:", errEliminar.message);
      }
    }

    return ManejarError(error, res, "Error al procesar la imagen");
  }
};

module.exports = { SubirImagen };
