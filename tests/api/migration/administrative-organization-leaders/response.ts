import { HttpMessages } from "@/common/response/messages";

export const response = {
  validData: {
    success: true,
    message: HttpMessages.migration.administrativeOrganizationLeadersImportSuccess,
    responseObject: {
      imported: 10,
      skipped: 7,
      total: 17,
      errors: [],
    },
    statusCode: 200,
  },
  validDataWithErrors: {
    success: true,
    message: HttpMessages.migration.administrativeOrganizationLeadersImportSuccess,
    responseObject: {
      imported: 7,
      skipped: 3,
      total: 10,
      errors: [
        {
          numero_empleado: "100379",
          reason:
            "No se encontró la dirección: Dirección del Ayuntamiento - Departamento de Archivo General (normalizado como: DIRECCION DEL AYUNTAMIENTO - DEPARTAMENTO DE ARCHIVO GENERAL)",
        },
        {
          numero_empleado: "100147",
          reason:
            "No se encontró la dirección: Bacheo de Calles y Mantto a Alcantarillas (normalizado como: BACHEO DE CALLES Y MANTTO A ALCANTARILLAS)",
        },
        {
          numero_empleado: "102136",
          reason:
            "No se encontró la dirección: Coordinación Administrativa de la Secretaria General del Ayuntamiento (normalizado como: COORDINACION ADMINISTRATIVA DE LA SECRETARIA GENERAL DEL AYUNTAMIENTO)",
        },
      ],
    },
    statusCode: 200,
  },
  emptyLegacyDatabase: {
    success: true,
    message: HttpMessages.migration.administrativeOrganizationLeadersImportSuccess,
    responseObject: {
      imported: 0,
      skipped: 0,
      total: 0,
      errors: [],
    },
    statusCode: 200,
  },
  unauthorizedUser: {
    success: false,
    message: HttpMessages.error.notAuthorized,
    responseObject: {},
    statusCode: 400,
  },
  unauthenticatedUser: {
    success: false,
    message: HttpMessages.error.notAuthorized,
    responseObject: {},
    statusCode: 401,
  },
  missingDatabaseUrl: {
    success: false,
    message: HttpMessages.error.internalServerError,
    responseObject: {
      error: HttpMessages.migration.databaseLegacyUrlNotConfigured,
    },
    statusCode: 500,
  },
  databaseConnectionError: {
    success: false,
    message: HttpMessages.error.internalServerError,
    responseObject: {
      error: HttpMessages.migration.databaseConnectionFailed,
    },
    statusCode: 500,
  },
};
