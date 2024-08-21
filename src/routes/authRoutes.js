import express from "express";
import {
  olvidarPassword,
  restablecerPassword,
  register,
  login,
  logout,
  getUserInfo,
  updateProfile,
  addToWatchlist,
  getWatchlist,
  removeFromWatchlist,
  addToWatched,
  getWatchedFilms,
  removeFromWatched,
  likeMovie,
  getUserLikes,
  unlikeMovie,
  getComments,
  addComment,
  addFavoriteMovie,
  getFavoriteMovies,
  removeFavoriteMovie,
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

// Ruta para agregar una película a la watchlist
router.post("/add-to-watchlist", addToWatchlist);

// Ruta para obtener la watchlist de un usuario
router.get("/get-watchlist", getWatchlist);

// Ruta para eliminar una película de la watchlist
router.post("/remove-from-watchlist", removeFromWatchlist);

//Ruta para agregar una pelicula a pelicula vista
router.post("/add-to-watched", addToWatched);

//Ruta para obtener pelicula vista
router.get("/get-watched", getWatchedFilms);

//Ruta para eliminar pelicula vista
router.post("/remove-from-watched", removeFromWatched);

// Ruta para agregar los likes del usuario
router.post("/add-to-like", likeMovie);

// Ruta para obtener los likes del usuario
router.get("/get-likes", getUserLikes);

// Ruta para eliminar los likes del usuario
router.post("/remove-from-like", unlikeMovie);

// Ruta para obtener comentarios de una película específica
// router.get("/get-comments", getComments);
router.get("/get-comments/:movieId", getComments);

// Ruta para guardar un nuevo comentario
router.post("/add-comment", addComment);

//Ruta para guardar a pelicula favorita
router.post("/add-to-favorites", addFavoriteMovie);

//Ruta para obtener las peliculas favoritaas de los usuarios
router.get("/get-favorites", getFavoriteMovies);

//Ruta para eliminar pelicula de favorita
router.post("/remove-from-favorites", removeFavoriteMovie);

export default router;
