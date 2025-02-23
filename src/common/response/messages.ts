export const HttpMessages = {
  catalog: {
    success: "Datos encontrados",
  },
  employee: {
    alreadyExists: "RFC or CURP ya existen",
    createdSuccess: "Empleado creado correctamente",
    notFound: "No se encontraron empleados con los filtros proporcionados",
    idNotFound: "Empleado no encontrado",
    getSuccess: "Empleados encontrados correctamente",
    invalidEmployeeType: "No fue encontrado el tipo de empleado.",
    notFoundById: "No se encontró empleado con el ID proporcionado",
    foundById: "Empleado encontrado correctamente",
    inactive: "El empleado está deshabilitado",
  },
  employeeIncidents: {
    invalidData: "Ya existe una incidencia con estos datos",
    createdSuccess: "Incidencia creada correctamente",
    notFound: "No se encontraron incidencias con los filtros proporcionados",
    getSuccess: "Incidencias encontradas correctamente",
    invalidEmployeeType: "No fue encontrado el tipo de empleado.",
    folioError: "Folio no creado.",
  },
  incidentStatus: {
    notFound: "Estatus de incidencia no encontrado",
  },
  error: {
    internalServerError: "Internal server error",
    invalidRequest: "Invalid request",
    notFound: "Datos no encontrados",
    validationFields: "Datos incorrectos, por favor revise de nuevo el formulario.",
  },
  user: {
    usernameAlreadyExists: "El nombre de usuario ya existe",
    uuidAlreadyExists: "El UUID ya existe",
    employeeIdAlreadyExists: "El ID de empleado ya está vinculado con otro usuario",
    createdSuccess: "Usuario creado correctamente",
    notFound: "No se encontraron usuarios con los filtros proporcionados",
    getSuccess: "Usuarios encontrados correctamente",
    notFoundById: "No se encontró al usuario con el ID proporcionado",
    foundById: "Usuario encontrado correctamente",
    alreadyDeactivated: "El usuario ya está desactivado",
    deactivatedSuccess: "Usuario desactivado correctamente",
  },
  role: {
    notFound: "El rol no existe",
  },
};
