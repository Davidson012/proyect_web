import express from "express";
import {
  olvidarPassword,
  restablecerPassword,
  register,
  login,
  logout,
  getUserInfo,
  updateProfile,
} from "../controllers/authController.js";
import upload from "../middleware/multer.js";

// Crear un router de Express
const router = express.Router();

// Ruta para manejar la solicitud POST de recuperación de contraseña
router.post("/forget-password", olvidarPassword);

// Ruta para manejar la solicitud POST de restablecimiento de contraseña
router.post("/reset-password", restablecerPassword);

// Ruta para manejar la solicitud POST de registro de usuario
router.post("/register", register);

// Ruta para manejar la solicitud POST de inicio de sesión
router.post("/login", login);

//Ruta de cerrar sesion
router.post("/logout", logout);

//Routes Get
router.get("/user-info", getUserInfo);

router.post("/update-profile", upload.single("profileImage"), updateProfile);

export default router;
