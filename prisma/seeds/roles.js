export const roles = [
  { id: 1, name: "admin", display_name: "Administrator", description: "Administrator" },
  { id: 2, name: "user", display_name: "User", description: "User" },
  {
    id: 3,
    name: "empleado",
    display_name: "Empleado",
    description: "Empleado es el usuario que pueden crear incidencias, ver su asistencia y  ver sus datos personales",
  },
  {
    id: 4,
    name: "enlace",
    display_name: "Enlace",
    description: "Enlace es el usuario encargado de una Secretaria",
  },
  {
    id: 5,
    name: "capturista",
    display_name: "Empleado",
    description: "Capturista es el usuario que validar las incidencias",
  },
  {
    id: 6,
    name: "analista",
    display_name: "Empleado",
    description: "Analista es el usuario que puede ver datos de empleados, incidencias y asistencias",
  },
  {
    id: 7,
    name: "admin_incidencia",
    display_name: "Administrador Incidencias",
    description:
      "Administrador Incidencias es el usuario que tiene acceso a todos los modulos de incidencias, asistencias, solicitudes y empleados",
  },
  {
    id: 8,
    name: "admin_nomina",
    display_name: "Administrador Nominas",
    description:
      "Administrador Nominas es el usuario que tiene acceso a todos los modulos de incidencias, asistencias, empleados y nomina",
  },
];
