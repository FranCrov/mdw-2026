// Los tres niveles de acceso con los que puede declararse una ruta.
// Cada ruta declara el suyo y accessFor() lo traduce a la cadena de middlewares que lo hace cumplir.
import type { UserRole } from "./auth.types";

export type AccessLevel = "public" | "private" | "role";

export interface RouteAccess {
  level: AccessLevel;
  // Solo se mira cuando level === "role": los roles con permiso de entrar.
  roles?: readonly UserRole[];
}
