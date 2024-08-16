//Rutas de las Paginas

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Crear un router de Express
const router = express.Router();

// Obtener el nombre del archivo y el directorio actual para rutas relativas
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ruta  principal
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

// Ruta de recuperación de contraseña
router.get("/forget-password", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "forget-password.html"));
});

// Ruta de restablecimiento de contraseña
router.get("/reset-password", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "reset-password.html"));
});

//Ruta  de home
router.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "home.html"));
});

router.get("/home/user", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "home-user.html"));
});

//Ruta de detalles de peliculas
router.get("/movie", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "detail.html"));
});

//Rutas de
router.get("/movies", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "movie_list.html"));
});

router.get("/films", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "films.html"));
});

router.get("/home/profile", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "profile.html"));
});
router.get("/home/profile/films", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "p.html"));
});

router.get("/home/profile/watchlist", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "watchlist.html"));
});

router.get("/home/profile/likes", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "like.html"));
});

router.get("/home/setting", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "setting.html"));
});

export default router;
