//require("dotenv").config();

import dotenv from "dotenv";
import mysql from "mysql2";

// Cargar configuración del archivo .env
dotenv.config({ path: "./src/env/.env" });

// Crea la conexión a la base de datos
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// Conecta a la base de datos
connection.connect((err) => {
  if (err) {
    console.error("Error de conexión a la base de datos:", err.stack);
    return;
  }
  console.log(
    "Conexión exitosa a la base de datos con ID:",
    connection.threadId
  );
});

// Exporta la conexión para usarla en otras partes del proyecto
export default connection;
