import {
  registerUser,
  loginUser,
  actualizarPassword,
  updateUser,
  addToWatchlistDB,
  getWatchlistFromDB,
  removeFromWatchlistDB,
  addToWatchedDB,
  getWatchedFilmsDB,
  removeFromWatchedDB,
  addLike,
  getLikes,
  removeLike,
  getCommentsByMovieId,
  saveComment,
  addFavoriteMovieDB,
  getFavoriteMoviesDB,
  removeFavoriteMovieDB,
} from "../models/userModel.js";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import fs from "fs";

// Configurar el transporte de correos
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Controlador para manejar la solicitud POST de recuperación de contraseña
export const olvidarPassword = (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send("Email is required");
  }

  const mailOptions = {
    to: email,
    from: process.env.EMAIL_USER,
    subject: "Restablecimiento de contraseña",
    text: `Recibió este correo electrónico porque usted (u otra persona) solicitó el restablecimiento de la contraseña de su cuenta.\n\n
    Haga clic en el siguiente enlace, o cópielo y péguelo en su navegador para completar el proceso:\n\n
    http://${req.headers.host}/reset-password\n\n
    Si no solicitó esto, ignore este correo electrónico y su contraseña permanecerá sin cambios.\n`,
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).send("Error sending email");
    }
    res.send(
      `Se ha enviado un enlace para restablecer su contraseña a ${email}.`
    );
  });
};

// Controlador para manejar la solicitud POST de restablecimiento de contraseña
export const restablecerPassword = (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (!email || !password || !confirmPassword) {
    return res
      .status(400)
      .send("Email, password and confirmPassword are required");
  }

  if (password !== confirmPassword) {
    return res.status(400).send("La contraseña no coinciden");
  }

  actualizarPassword(email, password, (err) => {
    if (err) {
      console.error("Error updating password:", err);
      return res.status(500).send("Error updating password");
    }
    res.redirect("/");
    // res.send("Password has been reset.");
  });
};

// Controlador para manejar la solicitud POST de registro de usuario
export const register = (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).send("Email, username and password are required");
  }

  registerUser(email, username, password, (err) => {
    if (err) {
      console.error("Error inserting user:", err);
      return res.status(500).send("Error registering user");
    }
    // res.send("User registered successfully");
    loginUser(email, (err, results) => {
      if (err) {
        console.error("Error logging in user:", err);
        return res.status(500).send("Error logging in user");
      }
      if (results.length > 0) {
        const user = results[0];
        const passwordIsValid = bcrypt.compareSync(
          password,
          user.password_user
        );
        if (!passwordIsValid) {
          return res.status(401).send("Invalid email or password");
        }
        req.session.user = user;
        res.redirect("/home/user");
      } else {
        res.status(401).send("Invalid email or password");
      }
    });
  });
};

// Controlador para manejar la solicitud POST de inicio de sesión
export const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Email and password are required");
  }

  loginUser(email, (err, results) => {
    if (err) {
      console.error("Error logging in user:", err);
      return res.status(500).send("Error logging in user");
    }
    if (results.length > 0) {
      const user = results[0];
      const passwordIsValid = bcrypt.compareSync(password, user.password_user);
      if (!passwordIsValid) {
        return res.status(401).send("Invalid email or password");
      }
      req.session.user = user;
      res.redirect("/home/user");
    } else {
      res.status(401).send("Invalid email or password");
    }
  });
};

// Controlador para manejar la solicitud POST de cierre de sesión
export const logout = (req, res) => {
  if (!req.session.user) {
    return res.status(401).send("No estás logueado");
  }

  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).send("Error al cerrar sesión");
    }

    res.redirect("/home"); // Redirige al usuario a la página de inicio de sesión o a la página principal
  });
};

export const getUserInfo = (req, res) => {
  // if (req.session.user) {
  //   const userId = req.session.user.id_user;
  //   const profileImage = `/uploads/${userId}/profile.png`;
  //   // Asume que la estructura de carpetas es /uploads/userId/profile.png

  //   res.json({
  //     username: req.session.user.name_user,
  //     profileImage: req.session.user.image_user,
  //   });
  // } else {
  //   res.status(401).send("No estás logueado");
  // }

  if (req.session.user) {
    // Obtén la URL de la imagen de perfil desde la base de datos
    const userId = req.session.user.id_user;
    // Suponiendo que en la base de datos guardas la ruta relativa
    const profileImage =
      req.session.user.image_user || `uploads/${userId}/profile.png`; // Ajusta según tu estructura de carpetas

    res.json({
      username: req.session.user.name_user,
      profileImage: `/${profileImage}`, // Asegúrate de tener la barra inicial para servir desde el servidor
    });
  } else {
    res.status(401).send("No estás logueado");
  }
};

// Controlador para manejar la solicitud POST de actualización de perfil
// export const updateProfile = (req, res) => {
//   const { username, email, password } = req.body;
//   const profileImage = req.file ? req.file.filename : null;
//   const userId = req.session.user.id_user;

//   console.log("Username:", username);
//   console.log("Email:", email);
//   console.log("Password:", password);
//   console.log("Profile Image:", profileImage);
//   console.log("User ID:", userId);

//   // Crear un objeto de actualización dinámico
//   const updates = {};

//   // Solo añadir campos si están presentes
//   if (username) updates.name_user = username;
//   if (email) updates.email_user = email;
//   if (password) updates.password_user = bcrypt.hashSync(password, 8); // Encriptar contraseña
//   if (profileImage) updates.image_user = profileImage;

//   console.log("Updates object:", updates);

//   if (Object.keys(updates).length === 0) {
//     return res.status(400).send("No fields to update");
//   }

//   // Llama a la función del modelo para actualizar el usuario
//   updateUser(userId, updates, (err) => {
//     if (err) {
//       console.error("Error updating user:", err);
//       return res.status(500).send("Error updating profile");
//     }

//     res.redirect("/home/profile");
//   });
// };

export const updateProfile = (req, res) => {
  const { username, email, password } = req.body;
  const profileImage = req.file ? req.file.filename : null;
  const userId = req.session.user.id_user; // ID del usuario logueado

  // Crear un objeto de actualización dinámico
  const updates = {};

  if (username) updates.name_user = username;
  if (email) updates.email_user = email;
  if (password) updates.password_user = bcrypt.hashSync(password, 8); // Asegúrate de encriptar la contraseña antes de guardarla
  if (profileImage) {
    // Ruta anterior de la imagen
    const oldImagePath = req.session.user.image_user;

    // Actualiza la ruta de la imagen en la base de datos
    updates.image_user = `uploads/${userId}/${profileImage}`;

    // Borra la imagen anterior si existe
    if (oldImagePath && fs.existsSync(oldImagePath)) {
      fs.unlinkSync(oldImagePath);
    }

    req.session.user = {
      ...req.session.user,
      ...updates,
    };
  }
  // Llama a la función del modelo para actualizar el usuario
  updateUser(userId, updates, (err) => {
    if (err) {
      console.error("Error updating user:", err);
      return res.status(500).send("Error updating profile");
    }

    res.redirect("/home/profile");
  });
};

// Controlador para agregar una película a la watchlist
export const addToWatchlist = (req, res) => {
  if (!req.session.user || !req.session.user.id_user) {
    return res.status(401).send("Unauthorized: User ID is missing");
  }
  const userId = req.session.user.id_user; // Obtener el id del usuario de la sesión
  const { movieId, title, posterPath } = req.body; // Incluye todos los campos necesarios

  if (!movieId || !title || !posterPath) {
    return res
      .status(400)
      .send("Movie ID, title, and poster path are required");
  }

  addToWatchlistDB(userId, movieId, title, posterPath, (err, results) => {
    if (err) {
      console.error("Error adding to watchlist:", err);
      return res.status(500).send("Error adding to watchlist");
    }
    res.status(200).send("Movie added to watchlist successfully");
  });
};

// Controlador para obtener la watchlist de un usuario
export const getWatchlist = (req, res) => {
  const userId = req.session.user.id_user;

  if (!userId) {
    return res.status(401).send("No estás logueado");
  }

  getWatchlistFromDB(userId, (err, results) => {
    if (err) {
      console.error("Error fetching watchlist:", err);
      return res.status(500).send("Error fetching watchlist");
    }
    res.json(results);
  });
};

// Controlador para eliminar una película de la watchlist
export const removeFromWatchlist = (req, res) => {
  const { movieId, title, posterPath } = req.body;
  const userId = req.session.user.id_user;

  // Verifica que todos los campos necesarios estén presentes
  if (!userId || !movieId || !title || !posterPath) {
    console.log({ userId, movieId, title, posterPath }); // Agrega esta línea para verificar los datos
    return res
      .status(400)
      .send("User ID, Movie ID, title, and poster path are required");
  }

  removeFromWatchlistDB(userId, movieId, title, posterPath, (err, results) => {
    if (err) {
      console.error("Error removing movie from watchlist:", err);
      return res.status(500).send("Error removing movie from watchlist");
    }
    res.send("Movie removed from watchlist successfully");
  });
};

//Controlador para agregar a pelicula vista
export const addToWatched = (req, res) => {
  const { movieId, title, posterPath } = req.body;
  const userId = req.session.user.id_user;

  if (!userId) {
    return res.status(401).send("No estás logueado");
  }

  addToWatchedDB(userId, movieId, title, posterPath, (err, results) => {
    if (err) {
      console.error("Error adding movie to watched:", err);
      return res.status(500).send("Error adding movie to watched");
    }
    res.send("Movie added to watched successfully");
  });
};

//Controlador la peliculas vista del usuario
export const getWatchedFilms = (req, res) => {
  const userId = req.session.user.id_user;

  if (!userId) {
    return res.status(401).send("No estás logueado");
  }

  getWatchedFilmsDB(userId, (err, results) => {
    if (err) {
      console.error("Error fetching watched films:", err);
      return res.status(500).send("Error fetching watched films");
    }
    res.json(results);
  });
};

//Controlador de borrar peliculas vista
export const removeFromWatched = (req, res) => {
  const { movieId, title, posterPath } = req.body;
  const userId = req.session.user.id_user;

  if (!userId) {
    return res.status(401).send("No estás logueado");
  }

  if (!movieId || !title || !posterPath) {
    return res
      .status(400)
      .send("Movie ID, title, and poster path are required");
  }

  removeFromWatchedDB(userId, movieId, title, posterPath, (err, results) => {
    if (err) {
      console.error("Error removing movie from watched:", err);
      return res.status(500).send("Error removing movie from watched");
    }
    res.send("Movie removed from watched successfully");
  });
};

//Controlador de para agregar like
export const likeMovie = (req, res) => {
  const { movieId, title, posterPath } = req.body;
  const userId = req.session.user.id_user; // Asume que el ID del usuario está en la sesión

  addLike(userId, movieId, title, posterPath, (err, results) => {
    if (err) {
      console.error("Error liking movie:", err);
      return res.status(500).send("Error liking movie");
    }
    res.send("Movie liked successfully");
  });
};

//Controlador para obtener los like de los usuarios
export const getUserLikes = (req, res) => {
  const userId = req.session.user.id_user; // Asume que el ID del usuario está en la sesión

  getLikes(userId, (err, results) => {
    if (err) {
      console.error("Error fetching likes:", err);
      return res.status(500).send("Error fetching likes");
    }
    res.json(results);
  });
};

//Controlador para borrar like
export const unlikeMovie = (req, res) => {
  const { movieId, title, posterPath } = req.body;
  const userId = req.session.user.id_user; // Asume que el ID del usuario está en la sesión

  removeLike(userId, movieId, title, posterPath, (err, results) => {
    if (err) {
      console.error("Error unliking movie:", err);
      return res.status(500).send("Error unliking movie");
    }
    res.send("Movie unliked successfully");
  });
};

// Controlador para obtener comentarios de una película
export const getComments = (req, res) => {
  const { movieId } = req.params;
  const userId = req.session.user.id_user;

  getCommentsByMovieId(movieId, userId, (err, comments) => {
    if (err) {
      console.error("Error al obtener los comentarios:", err);
      return res
        .status(500)
        .json({ error: "Error al obtener los comentarios" });
    }
    res.status(200).json(comments);
  });
};

// Controlador para guardar un nuevo comentario
export const addComment = (req, res) => {
  const { movieId, comment, rating } = req.body;
  const userId = req.session.user.id_user; // Asume que el ID del usuario está en la sesión

  saveComment(userId, movieId, comment, rating, (err) => {
    if (err) {
      console.error("Error al guardar el comentario:", err);
      return res.status(500).json({ error: "Error al guardar el comentario" });
    }
    res.status(200).json({ message: "Comentario guardado exitosamente" });
  });
};

//Controlador para agregar peliculas favorita
export const addFavoriteMovie = (req, res) => {
  const { movieId, title, posterPath } = req.body;
  const userId = req.session.user.id_user;

  if (!userId || !movieId || !title || !posterPath) {
    return res.status(400).send("Todos los campos son obligatorios");
  }

  addFavoriteMovieDB(
    userId,
    movieId,
    title,
    posterPath,
    new Date(),
    (err, results) => {
      if (err) {
        console.error("Error al agregar película a favoritos:", err);
        return res.status(500).send("Error al agregar película a favoritos");
      }
      res.send("Película agregada a favoritos");
    }
  );
};

//Controlador de para obtener la peliculas favorita
export const getFavoriteMovies = (req, res) => {
  const userId = req.session.user.id_user;

  if (!userId) {
    return res.status(401).send("No estás logueado");
  }

  getFavoriteMoviesDB(userId, (err, results) => {
    if (err) {
      console.error("Error al obtener películas favoritas:", err);
      return res.status(500).send("Error al obtener películas favoritas");
    }
    res.json(results);
  });
};

//Controlador de eliminar pelicular favorita
export const removeFavoriteMovie = (req, res) => {
  const { movieId, title, posterPath } = req.body;
  const userId = req.session.user.id_user;

  if (!userId || !movieId || !title || !posterPath) {
    return res.status(400).send("Todos los campos son obligatorios");
  }

  removeFavoriteMovieDB(userId, movieId, title, posterPath, (err, results) => {
    if (err) {
      console.error("Error al eliminar película de favoritos:", err);
      return res.status(500).send("Error al eliminar película de favoritos");
    }
    res.send("Película eliminada de favoritos");
  });
};
