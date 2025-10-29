import { POST } from "@/app/api/migration/administrative-organization-leaders/route";
import { MigrationService } from "@/app/api/services/migration.service";
import { testCases } from "./testCases";
import { NextResponse } from "next/server";
import { ROLES } from "@/common/constants/Roles";
import { HttpMessages } from "@/common/response/messages";

jest.mock("@/app/api/services/migration.service", () => ({
  MigrationService: {
    createLegacyPrismaClient: jest.fn(),
    importAdministrativeOrganizationsLeaders: jest.fn(),
  },
}));

jest.mock("@/middleware/authMiddleware", () => ({
  authMiddleware: jest.fn(),
}));

jest.mock("@/lib/logger", () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

const { authMiddleware } = jest.requireMock("@/middleware/authMiddleware");

describe("API: /migration/administrative-organization-leaders", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  testCases.forEach(({ description, requestData, expectedStatus, expectedResponse }) => {
    it(`POST /migration/administrative-organization-leaders ${description}`, async () => {
      authMiddleware.mockResolvedValue({
        userId: 1,
        roleId: 1,
        roleName: ROLES.ADMIN,
      });

      if (description === "should successfully import leaders with valid data") {
        (MigrationService.importAdministrativeOrganizationsLeaders as jest.Mock).mockResolvedValue({
          success: true,
          imported: 10,
          skipped: 7,
          total: 17,
          errors: [],
        });
      }

      if (description === "should successfully import leaders with some errors") {
        (MigrationService.importAdministrativeOrganizationsLeaders as jest.Mock).mockResolvedValue({
          success: true,
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
        });
      }

      if (description === "should handle empty legacy database") {
        (MigrationService.importAdministrativeOrganizationsLeaders as jest.Mock).mockResolvedValue({
          success: true,
          imported: 0,
          skipped: 0,
          total: 0,
          errors: [],
        });
      }

      if (description === "should return error for unauthorized user") {
        authMiddleware.mockResolvedValue({
          userId: 1,
          roleId: 2,
          roleName: ROLES.ENLACE,
        });
      }

      if (description === "should return error for unauthenticated user") {
        authMiddleware.mockResolvedValue(
          NextResponse.json(
            {
              success: false,
              message: HttpMessages.error.notAuthorized,
              responseObject: {},
              statusCode: 401,
            },
            { status: 401 },
          ),
        );
      }

      if (description === "should return error when DATABASE_LEGACY_URL is missing") {
        (MigrationService.importAdministrativeOrganizationsLeaders as jest.Mock).mockRejectedValue(
          new Error(HttpMessages.migration.databaseLegacyUrlNotConfigured),
        );
      }

      if (description === "should return error when database connection fails") {
        (MigrationService.importAdministrativeOrganizationsLeaders as jest.Mock).mockRejectedValue(
          new Error(HttpMessages.migration.databaseConnectionFailed),
        );
      }

      const requestObj = {
        json: async () => requestData,
      } as any;

      const response = await POST(requestObj);
      const body = await response.json();

      expect(response.status).toBe(expectedStatus);
      expect(body).toEqual(expectedResponse);
    });
  });
});
