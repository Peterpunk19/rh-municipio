export const HttpMessages = {
  catalog: {
    success: "Datos encontrados",
  },
  employee: {
    alreadyExists: "RFC or CURP ya existen",
    createdSuccess: "Empleado creado correctamente",
    notFound: "No se encontraron empleados con los filtros proporcionados",
    getSuccess: "Empleados encontrados correctamente",
    invalidEmployeeType: "No fue encontrado el tipo de empleado.",
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
  },
  role: {
    notFound: "El rol no existe",
  },
};
