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
  SUBENLACE: "subenlace",
  SERVICIOS_MEDICOS: "servicios_medicos",
  SECRETARIO: "secretario",
  COORDINADOR: "coordinador",
  RESPONSABLE_INMEDIATO: "responsable_inmediato",
  SOPORTE_NIVEL_1: "soporte_nivel_1",
  SOPORTE_NIVEL_2: "soporte_nivel_2",
  SOPORTE_NIVEL_3: "soporte_nivel_3",
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
  [ROLES.SUBENLACE]: 13,
  [ROLES.SERVICIOS_MEDICOS]: 14,
  [ROLES.SECRETARIO]: 15,
  [ROLES.COORDINADOR]: 16,
  [ROLES.RESPONSABLE_INMEDIATO]: 17,
  [ROLES.SOPORTE_NIVEL_1]: 18,
  [ROLES.SOPORTE_NIVEL_2]: 19,
  [ROLES.SOPORTE_NIVEL_3]: 20,
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
  13: "SUBENLACE",
  14: "SERVICIOS_MEDICOS",
  15: "SECRETARIO",
  16: "COORDINADOR",
  17: "RESPONSABLE_INMEDIATO",
  18: "SOPORTE_NIVEL_1",
  19: "SOPORTE_NIVEL_2",
  20: "SOPORTE_NIVEL_3",
};
export const ROLE_EXCLUSIONS = {
  USER_CREATION: [ROLES.DIRECTOR, ROLES.EMPLEADO],
};

export const isRoleExcluded = (roleName: string, context: keyof typeof ROLE_EXCLUSIONS): boolean => {
  if (!ROLE_EXCLUSIONS[context]) {
    return false;
  }

  return ROLE_EXCLUSIONS[context].includes(roleName as any);
};
