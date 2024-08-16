import multer from "multer";
import path from "path";
import fs from "fs";

// Configuración de multer para la subida de imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.session.user.id_user; // Obtiene el ID del usuario de la sesión
    const dir = `uploads/${userId}`; // Carpeta con el ID del usuario

    // Crear la carpeta si no existe
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir); // Guarda la imagen en la carpeta del usuario
  },
  filename: (req, file, cb) => {
    // Genera un nombre de archivo único
    const ext = path.extname(file.originalname); // Obtiene la extensión del archivo (por ejemplo, .jpg, .png)
    const filename = `profile${ext}`; // Nombre de archivo fijo (puede ser dinámico si prefieres)

    cb(null, filename); // Guarda la imagen con el nombre generado
  },
});

// Filtro para aceptar solo imágenes JPEG y PNG
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png/;
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
