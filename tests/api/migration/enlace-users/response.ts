import { HttpMessages } from "@/common/response/messages";

export const response = {
  validData: {
    success: true,
    message: HttpMessages.migration.enlaceUsersImportSuccess,
    responseObject: {
      imported: 5,
      skipped: 2,
      total: 7,
      errors: [],
    },
    statusCode: 200,
  },
  validDataWithErrors: {
    success: true,
    message: HttpMessages.migration.enlaceUsersImportSuccess,
    responseObject: {
      imported: 3,
      skipped: 2,
      total: 5,
      errors: [
        {
          numero_empleado: "12345",
          reason: "Employee 12345 not found in main database, in legacy database with status Activo",
        },
        {
          numero_empleado: "67890",
          reason: "Direccion DIRECCION INEXISTENTE not found in main database",
        },
      ],
    },
    statusCode: 200,
  },
  emptyLegacyDatabase: {
    success: true,
    message: HttpMessages.migration.enlaceUsersImportSuccess,
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
    message: HttpMessages.error.notAuthenticated,
    responseObject: {},
    statusCode: 401,
  },
  missingDatabaseUrl: {
    success: false,
    message: HttpMessages.error.internalServerError,
    responseObject: {
      error: "Migration failed: DATABASE_LEGACY_URL no está configurada en las variables de entorno",
    },
    statusCode: 500,
  },
  databaseConnectionError: {
    success: false,
    message: HttpMessages.error.internalServerError,
    responseObject: {
      error: "Migration failed: Database connection failed",
    },
    statusCode: 500,
  },
};
