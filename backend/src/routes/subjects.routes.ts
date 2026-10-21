// Mapping between (HTTP method + path) and controller. No business logic here.
// Cada ruta declara su nivel de acceso: public, private o role.
import { Router } from "express";
import {
  listSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
} from "../controllers/subjects.controller";
import { accessFor } from "../middlewares/access";
import { validateBody } from "../middlewares/validate";
import {
  createSubjectSchema,
  listSubjectsSchema,
  updateSubjectSchema,
} from "../schemas/subject.schema";

const router = Router();

// Publicas: leer el catalogo no requiere sesion.
router.query!("/", ...accessFor({ level: "public" }), validateBody(listSubjectsSchema), listSubjects);
router.get("/:id", ...accessFor({ level: "public" }), getSubjectById);

// Privadas por rol: solo ADMIN escribe materias.
router.post("/", ...accessFor({ level: "role", roles: ["ADMIN"] }), validateBody(createSubjectSchema), createSubject);
router.put("/:id", ...accessFor({ level: "role", roles: ["ADMIN"] }), validateBody(updateSubjectSchema), updateSubject);
router.delete("/:id", ...accessFor({ level: "role", roles: ["ADMIN"] }), deleteSubject);

export default router;
