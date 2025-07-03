export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  EMPLEADO: "empleado",
  ENLACE: "enlace",
  SUBENLACE: "subenlace",
  CAPTURISTA: "capturista",
  ANALISTA: "analista",
  ADMIN_INCIDENCIA: "admin_incidencias",
  ADMIN_NOMINA: "admin_nomina",
  SERVICIO_SOCIAL: "servicio_social",
  REGIDOR: "regidor",
  DIRECTOR: "director",
  SUPLENTE: "suplente",
} as const;

export const ROLES_ID_VALUES = {
  [ROLES.ADMIN]: 1,
  [ROLES.USER]: 2,
  [ROLES.EMPLEADO]: 3,
  [ROLES.ENLACE]: 4,
  [ROLES.CAPTURISTA]: 5,
  [ROLES.ANALISTA]: 6,
  [ROLES.ADMIN_INCIDENCIA]: 7,
  [ROLES.ADMIN_NOMINA]: 8,
  [ROLES.SERVICIO_SOCIAL]: 9,
  [ROLES.REGIDOR]: 10,
  [ROLES.DIRECTOR]: 11,
  [ROLES.SUPLENTE]: 12,
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
  11: "DIRECTOR",
  12: "SUPLENTE",
};
