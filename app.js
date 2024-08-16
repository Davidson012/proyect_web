import express from "express";
import sessiones from "./src/middleware/sessiones.js";
import staticRoutes from "./src/middleware/staticRoutes.js";
import bodyParse from "./src/middleware/bodyParse.js";
import viewRoutes from "./src/routes/viewsRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import path from "path";

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
//import dotenv from 'dotenv';
//dotenv.config({ path: './src/env/.env' });

const app = express();
const port = 3001;
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//middleware
app.use(staticRoutes);
bodyParse(app);
sessiones(app);
//Rutas
app.use("/", viewRoutes);
app.use("/auth", authRoutes);

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
