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
