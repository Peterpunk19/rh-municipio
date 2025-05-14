export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  EMPLEADO: "empleado",
  ENLACE: "enlace",
  CAPTURISTA: "capturista",
  ANALISTA: "analista",
  ADMIN_INCIDENCIA: "admin_incidencias",
  ADMIN_NOMINA: "admin_nomina",
  SERVICIO_SOCIAL: "servicio_social",
  REGIDOR: "regidor",
  DIRECTOR: "director",
  SUPLENTE: "suplente",
} as const;

export type RoleKey = keyof typeof ROLES;
export type RoleValue = (typeof ROLES)[RoleKey];

export const ROLES_ID: Record<number, RoleKey> = {
  1: "ADMIN",
  2: "USER",
  3: "EMPLEADO",
  4: "ENLACE",
  5: "CAPTURISTA",
  6: "ANALISTA",
  7: "ADMIN_INCIDENCIA",
  8: "ADMIN_NOMINA",
  9: "SERVICIO_SOCIAL",
  10: "REGIDOR",
};
