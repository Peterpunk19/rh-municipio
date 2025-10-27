import { POST } from "@/app/api/migration/enlace-users/route";
import { MigrationService } from "@/app/api/services/migration.service";
import { testCases } from "./testCases";
import { NextResponse } from "next/server";
import { ROLES } from "@/common/constants/Roles";

jest.mock("@/app/api/services/migration.service", () => ({
  MigrationService: {
    createLegacyPrismaClient: jest.fn(),
    importEnlaceUsers: jest.fn(),
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

describe("API: /migration/enlace-users", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  testCases.forEach(({ description, requestData, expectedStatus, expectedResponse }) => {
    it(`POST /migration/enlace-users ${description}`, async () => {
      authMiddleware.mockResolvedValue({
        userId: 1,
        roleId: 1,
        roleName: ROLES.ADMIN,
      });

      if (description === "should successfully import users with valid data") {
        (MigrationService.importEnlaceUsers as jest.Mock).mockResolvedValue({
          success: true,
          imported: 5,
          skipped: 2,
          total: 7,
          errors: [],
        });
      }

      if (description === "should successfully import users with some errors") {
        (MigrationService.importEnlaceUsers as jest.Mock).mockResolvedValue({
          success: true,
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
        });
      }

      if (description === "should handle empty legacy database") {
        (MigrationService.importEnlaceUsers as jest.Mock).mockResolvedValue({
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
              message: "No autenticado",
              responseObject: {},
              statusCode: 401,
            },
            { status: 401 },
          ),
        );
      }

      if (description === "should return error when DATABASE_LEGACY_URL is missing") {
        (MigrationService.importEnlaceUsers as jest.Mock).mockRejectedValue(
          new Error("Migration failed: DATABASE_LEGACY_URL no está configurada en las variables de entorno"),
        );
      }

      if (description === "should return error when database connection fails") {
        (MigrationService.importEnlaceUsers as jest.Mock).mockRejectedValue(
          new Error("Migration failed: Database connection failed"),
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
