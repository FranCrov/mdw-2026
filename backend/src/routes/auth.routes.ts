// Mapping between (HTTP method + path) and controller. No business logic here.
// Cada ruta declara su nivel de acceso: public, private o role.
import { Router } from "express";
import { registerUser, login, logout, me } from "../controllers/auth.controller";
import { accessFor } from "../middlewares/access";
import { validateBody } from "../middlewares/validate";
import { registerSchema, loginSchema } from "../schemas/auth.schema";

const router = Router();

// Publicas: abrir sesion o crearla no requiere sesion.
router.post("/register", ...accessFor({ level: "public" }), validateBody(registerSchema), registerUser);
router.post("/login", ...accessFor({ level: "public" }), validateBody(loginSchema), login);
router.post("/logout", ...accessFor({ level: "public" }), logout);

// Privada: exige sesion valida.
router.get("/me", ...accessFor({ level: "private" }), me);

export default router;
