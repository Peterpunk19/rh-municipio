import { POST } from "@/app/api/users/reset-password/route";
import { UserService } from "@/app/api/services/user.service";
import { testCases } from "./testCases";
import { authMiddleware } from "@/middleware/authMiddleware";
import { ROLES_ID_VALUES, ROLES } from "@/common/constants/Roles";

jest.mock("@/app/api/services/user.service", () => ({
  UserService: {
    getUserById: jest.fn(),
    resetUserPassword: jest.fn(),
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

describe("API: /users/reset-password", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  testCases.forEach(({ description, requestData, expectedStatus, expectedResponse, isAdmin }) => {
    it(`POST /users/reset-password ${description}`, async () => {
      if (isAdmin) {
        (authMiddleware as jest.Mock).mockResolvedValue({
          userId: 1,
          roleId: ROLES_ID_VALUES[ROLES.ADMIN],
        });
      } else {
        (authMiddleware as jest.Mock).mockResolvedValue({
          userId: 2,
          roleId: ROLES_ID_VALUES[ROLES.EMPLEADO],
        });
      }

      if (description === "should successfully reset password with valid data") {
        (UserService.getUserById as jest.Mock).mockResolvedValue({
          id: 2,
          username: "testuser",
          role_id: ROLES_ID_VALUES[ROLES.EMPLEADO],
        });
        (UserService.resetUserPassword as jest.Mock).mockResolvedValue({
          success: true,
          temporaryPassword: "Temp1234",
        });
      }

      if (description === "should return error for non-existent user") {
        (UserService.getUserById as jest.Mock).mockResolvedValue(null);
      }

      if (description === "should return error when trying to reset admin password") {
        (UserService.getUserById as jest.Mock).mockResolvedValue({
          id: 1,
          username: "admin",
          role_id: ROLES_ID_VALUES[ROLES.ADMIN],
        });
      }

      if (
        description.includes("should return error for invalid user ID") ||
        description.includes("should return error for missing user ID")
      ) {
      }

      if (description === "should return unauthorized error for non-admin user") {
      }

      const mockRequest = {
        json: jest.fn().mockResolvedValue(requestData),
      } as any;
      const response = await POST(mockRequest);
      const responseData = await response.json();

      expect(response.status).toBe(expectedStatus);

      if (expectedResponse.success !== undefined) {
        expect(responseData.success).toBe(expectedResponse.success);
      }

      if (expectedResponse.message) {
        expect(responseData.message).toBe(expectedResponse.message);
      }

      if (description === "should successfully reset password with valid data") {
        expect(responseData.responseObject).toMatchObject({
          userId: (requestData as any).userId,
          mustChangePassword: true,
        });
        expect(UserService.resetUserPassword).toHaveBeenCalledWith(
          (requestData as any).userId,
          1,
          (requestData as any).password,
        );
      }

      if (description === "should return error for non-existent user") {
        expect(UserService.getUserById).toHaveBeenCalledWith((requestData as any).userId);
      }

      if (description === "should return unauthorized error for non-admin user") {
        expect(authMiddleware).toHaveBeenCalled();
      }
    });
  });

  it("should handle service errors gracefully", async () => {
    (authMiddleware as jest.Mock).mockResolvedValue({
      userId: 1,
      roleId: ROLES_ID_VALUES[ROLES.ADMIN],
    });

    (UserService.getUserById as jest.Mock).mockResolvedValue({
      id: 2,
      username: "testuser",
      role_id: ROLES_ID_VALUES[ROLES.EMPLEADO],
    });

    (UserService.resetUserPassword as jest.Mock).mockResolvedValue({
      success: false,
      message: "Database error",
    });

    const mockRequest = {
      json: jest.fn().mockResolvedValue({ userId: 2, password: "Temp1234" }),
    } as any;

    const response = await POST(mockRequest);
    const responseData = await response.json();

    expect(response.status).toBe(500);
    expect(responseData.success).toBe(false);
    expect(responseData.message).toBe("Database error");
  });
});
