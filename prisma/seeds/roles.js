const roles = [
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
    display_name: "Capturista",
    description: "Capturista es el usuario que validar las incidencias",
  },
  {
    id: 6,
    name: "analista",
    display_name: "Analista",
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
  {
    id: 9,
    name: "servicio_social",
    display_name: "Servicio social",
    description: "Servicio social es el usuario que solo tiene acceso a empleados",
  },
  {
    id: 10,
    name: "regidor",
    display_name: "Regidor",
    description: "Regidor es el usuario que tiene acceso para para realizar solicitudes",
  },
  {
    id: 11,
    name: "director",
    display_name: "Director",
    description: "Director de organismo administrativo",
  },
  {
    id: 12,
    name: "suplente",
    display_name: "Suplente",
    description: "Suplente de organismo administrativo",
  },
  {
    id: 13,
    name: "subenlace",
    display_name: "Subenlace",
    description: "Subenlace es el usuario encargado de una Secretaria",
  },
  {
    id: 14,
    name: "servicios_medicos",
    display_name: "Servicios Médicos",
    description: "Personal correspondiente a la Dirección de Servicios Médicos",
  },
  {
    id: 15,
    name: "secretario",
    display_name: "Secretario",
    description: "Secretario de organismo administrativo",
  },
  {
    id: 16,
    name: "coordinador",
    display_name: "Coordinador",
    description: "Coordinador de organismo administrativo",
  },
  {
    id: 17,
    name: "responsable_inmediato",
    display_name: "Responsable Inmediato",
    description: "Responsable Inmediato de organismo administrativo",
  },
];
module.exports = roles;
