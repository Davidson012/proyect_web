import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// router.use("/api", express.static(path.join(__dirname, "..", "api")));
router.use(express.static(path.join(__dirname, "..", "public")));

//router.use("/uploads", express.static(path.join(__dirname, "uploads")));

router.use(
  "/css",
  express.static(path.join(__dirname, "..", "node_modules/bootstrap/dist/css"))
);
router.use(
  "/js",
  express.static(path.join(__dirname, "..", "node_modules/bootstrap/dist/js"))
);

export default router;
