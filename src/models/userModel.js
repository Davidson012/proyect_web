import db from "./database/db.js";
import bcrypt from "bcryptjs";

// Función para registrar un nuevo usuario
export const registerUser = (email, username, password, callback) => {
  const hashedPassword = bcrypt.hashSync(password, 8);
  const query =
    "INSERT INTO users (email_user, name_user, password_user) VALUES (?, ?, ?)";
  db.query(query, [email, username, hashedPassword], callback);
};

// Función para obtener un usuario por email(Login)
export const loginUser = (email, callback) => {
  const query = "SELECT * FROM users WHERE email_user = ?";
  db.query(query, [email], callback);
};

// Función para actualizar la contraseña del usuario
export const actualizarPassword = (email, newPassword, callback) => {
  const hashedPassword = bcrypt.hashSync(newPassword, 8);
  const query = "UPDATE users SET password_user = ? WHERE email_user = ?";
  db.query(query, [hashedPassword, email], callback);
};

//Actualizar el perfil
export const updateUser = (userId, updates, callback) => {
  if (Object.keys(updates).length === 0) {
    return callback(new Error("No fields to update"));
  }

  let query = "UPDATE users SET ";
  const fields = [];

  // Construye dinámicamente la consulta SQL
  for (const [key, value] of Object.entries(updates)) {
    fields.push(`${key} = ?`);
  }

  query += fields.join(", ") + " WHERE id_user = ?";

  // Valores para la consulta SQL
  const values = [...Object.values(updates), userId];

  console.log("Generated SQL query:", query);
  console.log("Values:", values);

  db.query(query, values, (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

// Función para agregar una película a la watchlist
export const addToWatchlistDB = (
  userId,
  movieId,
  title,
  posterPath,
  callback
) => {
  // Verifica que `posterPath` sea una cadena de texto
  if (typeof posterPath !== "string") {
    return callback(new Error("Poster path must be a string"));
  }

  // Verifica que todos los campos requeridos estén presentes
  if (!movieId || !title || !posterPath) {
    return callback(new Error("Movie ID, title, and poster path are required"));
  }

  const query =
    "INSERT INTO watchlist (id_user, movie_id, title, poster_path, added_at) VALUES (?, ?, ?, ?, NOW())";
  db.query(query, [userId, movieId, title, posterPath], callback);
};

// Obtener la watchlist de un usuario
export const getWatchlistFromDB = (userId, callback) => {
  const query =
    "SELECT movie_id, title, poster_path FROM watchlist WHERE id_user = ?";
  db.query(query, [userId], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
};

// Eliminar una película de la watchlist
export const removeFromWatchlistDB = (
  userId,
  movieId,
  title,
  posterPath,
  callback
) => {
  // Verifica que todos los campos necesarios estén presentes
  if (!userId || !movieId || !title || !posterPath) {
    return callback(
      new Error("User ID, Movie ID, title, and poster path are required")
    );
  }

  // Consulta para eliminar la película de la watchlist basándose en todos los datos
  const query = `
    DELETE FROM watchlist
    WHERE id_user = ? AND movie_id = ? AND title = ? AND poster_path = ?
  `;
  db.query(query, [userId, movieId, title, posterPath], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
};

//Funcion para agregar a pelicula vista
export const addToWatchedDB = (
  userId,
  movieId,
  title,
  posterPath,
  callback
) => {
  if (typeof posterPath !== "string") {
    return callback(new Error("Poster path must be a string"));
  }

  if (!movieId || !title || !posterPath) {
    return callback(new Error("Movie ID, title, and poster path are required"));
  }

  const query =
    "INSERT INTO films (id_user, movie_id, title, poster_path, watched_at) VALUES (?, ?, ?, ?, NOW())";
  db.query(query, [userId, movieId, title, posterPath], callback);
};

//Funcion para obtener pelicula vista
export const getWatchedFilmsDB = (userId, callback) => {
  const query =
    "SELECT movie_id, title, poster_path, watched_at FROM films WHERE id_user = ?";
  db.query(query, [userId], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
};

//Funcion para borrarla de pelicula vista
export const removeFromWatchedDB = (
  userId,
  movieId,
  title,
  posterPath,
  callback
) => {
  // Verifica que todos los campos necesarios estén presentes
  if (!userId || !movieId || !title || !posterPath) {
    return callback(
      new Error("User ID, Movie ID, title, and poster path are required")
    );
  }

  // Consulta para eliminar la película de la lista de vistas basándose en todos los datos
  const query = `
    DELETE FROM films
    WHERE id_user = ? AND movie_id = ? AND title = ? AND poster_path = ?
  `;
  db.query(query, [userId, movieId, title, posterPath], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
};

//Funcion para agregar a like
export const addLike = (userId, movieId, title, posterPath, callback) => {
  const query = `
    INSERT INTO likes (id_user, movie_id, title, poster_path)
    VALUES (?, ?, ?, ?)
  `;
  db.query(query, [userId, movieId, title, posterPath], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
};

//Funcion para obtener la pelicualas al que usuario le dado like
export const getLikes = (userId, callback) => {
  const query = `
    SELECT * FROM likes
    WHERE id_user = ?
  `;
  db.query(query, [userId], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
};

//Funcion para borrar el like
export const removeLike = (userId, movieId, title, posterPath, callback) => {
  // Verifica que todos los campos necesarios estén presentes
  if (!userId || !movieId || !title || !posterPath) {
    return callback(
      new Error("User ID, Movie ID, title, and poster path are required")
    );
  }

  // Consulta para eliminar el like basándose en todos los datos
  const query = `
    DELETE FROM likes
    WHERE id_user = ? AND movie_id = ? AND title = ? AND poster_path = ?
  `;
  db.query(query, [userId, movieId, title, posterPath], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
};

// Función para obtener comentarios por ID de película
export const getCommentsByMovieId = (movieId, userId, callback) => {
  const query = `
    SELECT c.comment, c.rating, u.name_user
    FROM comments c
    JOIN users u ON c.id_user = u.id_user
    WHERE c.movie_id = ?;
  `;

  db.query(query, [movieId], (err, results) => {
    if (err) {
      console.error("Error en la consulta SQL:", err);
      return callback(err, null);
    }

    callback(null, results);
  });
};

// Función para guardar un nuevo comentario
export const saveComment = (userId, movieId, comment, rating, callback) => {
  const query =
    "INSERT INTO comments (id_user, movie_id, comment, rating) VALUES (?, ?, ?, ?)";
  db.query(query, [userId, movieId, comment, rating], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
};

//Funcion para agregar peliculas favoritas
export const addFavoriteMovieDB = (
  userId,
  movieId,
  title,
  posterPath,
  addedAt,
  callback
) => {
  if (!userId || !movieId || !title || !posterPath || !addedAt) {
    return callback(
      new Error(
        "User ID, Movie ID, title, poster path, and added date are required"
      )
    );
  }

  const query = `
    INSERT INTO favorite_films (id_user, movie_id, title, poster_path, added_at)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(
    query,
    [userId, movieId, title, posterPath, addedAt],
    (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    }
  );
};

//Funcion para obtener la peliculas favoritas de cada user
export const getFavoriteMoviesDB = (userId, callback) => {
  if (!userId) {
    return callback(new Error("User ID is required"));
  }

  const query = `
    SELECT movie_id, title, poster_path, added_at 
    FROM favorite_films
    WHERE id_user = ?
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
};

//Funcion para eliminar peliculas favoritas
export const removeFavoriteMovieDB = (
  userId,
  movieId,
  title,
  posterPath,
  callback
) => {
  if (!userId || !movieId || !title || !posterPath) {
    return callback(
      new Error("User ID, Movie ID, title, and poster path are required")
    );
  }

  const query = `
    DELETE FROM favorite_films
    WHERE id_user = ? AND movie_id = ? AND title = ? AND poster_path = ?
  `;
  db.query(query, [userId, movieId, title, posterPath], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
};
