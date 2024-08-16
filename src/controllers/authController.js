import {
  registerUser,
  loginUser,
  actualizarPassword,
  updateUser,
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
    res.send("Password has been reset.");
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
    res.send("User registered successfully");
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
