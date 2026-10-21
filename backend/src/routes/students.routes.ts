// Mapping between (HTTP method + path) and controller. No business logic here.
// Cada ruta declara su nivel de acceso: public, private o role.
import { Router } from "express";
import {
  listStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../controllers/students.controller";
import { accessFor } from "../middlewares/access";
import { validateBody } from "../middlewares/validate";
import { createStudentSchema, listStudentsSchema, updateStudentSchema } from "../schemas/student.schema";

const router = Router();

// Publicas: leer el listado no requiere sesion.
router.query!("/", ...accessFor({ level: "public" }), validateBody(listStudentsSchema), listStudents);
router.get("/:id", ...accessFor({ level: "public" }), getStudentById);

// Privadas por rol: solo ADMIN escribe estudiantes.
router.post("/", ...accessFor({ level: "role", roles: ["ADMIN"] }), validateBody(createStudentSchema), createStudent);
router.put("/:id", ...accessFor({ level: "role", roles: ["ADMIN"] }), validateBody(updateStudentSchema), updateStudent);
router.delete("/:id", ...accessFor({ level: "role", roles: ["ADMIN"] }), deleteStudent);

export default router;
