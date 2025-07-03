const { Almacenamiento } = require("../Configuracion/FirebaseConfiguracion");
const { v4: GenerarUuid } = require("uuid");


const SubirImagenAlmacenamiento = (Archivo, CarpetaPrincipal, SubCarpeta) => {
  return new Promise((Resolver, Rechazar) => {
    if (!CarpetaPrincipal || !SubCarpeta) {
      return Rechazar(new Error("No se enviaron las carpetas necesarias"));
    }

    const NombreArchivo = `${CarpetaPrincipal}/${SubCarpeta}/${GenerarUuid()}-${Archivo.originalname}`;
    const ArchivoSubido = Almacenamiento.file(NombreArchivo);

    const Flujo = ArchivoSubido.createWriteStream({
      metadata: { contentType: Archivo.mimetype },
    });

    Flujo.on("error", () => {
      Rechazar(new Error("Error al subir la imagen"));
    });

    Flujo.on("finish", async () => {
      await ArchivoSubido.makePublic();
      // Resolver(`/${NombreArchivo}`); 
      Resolver(`/${NombreArchivo.replace(`${CarpetaPrincipal}/`, '')}`);
    });

    Flujo.end(Archivo.buffer);
  });
};

module.exports = { SubirImagenAlmacenamiento };
