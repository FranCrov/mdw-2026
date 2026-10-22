// Traduce la declaracion de acceso de una ruta a la cadena de middlewares que la hace cumplir.
//   public  -> sin middlewares: cualquiera entra.
//   private -> exige sesion (authMiddleware).
//   role    -> exige sesion Y que el rol de la ruta este entre los permitidos.
// Las publicas se declaran igual que las otras: asi "esta ruta no tiene guard" siempre
// es una decision y no un forgot de cablear el middleware.
import type { RequestHandler } from "express";
import { authMiddleware, requireRole } from "./auth.middleware";
import type { RouteAccess } from "../types/route.types";

export function accessFor(route: RouteAccess): RequestHandler[] {
  switch (route.level) {
    case "public":
      return [];
    case "private":
      return [authMiddleware];
    case "role":
      // Sin roles listados no entra nadie: el deny-by-default manda.
      return [authMiddleware, requireRole(...(route.roles ?? []))];
    default:
      // Un level desconocido no puede devolver undefined en silencio: el spread
      // reventaria al montar el router con un error que no dice nada.
      throw new Error(`Nivel de acceso desconocido: "${String(route.level)}"`);
  }
}
