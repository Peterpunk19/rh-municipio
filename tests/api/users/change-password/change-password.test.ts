import { POST } from "@/app/api/users/change-password/route";
import { UserService } from "@/app/api/services/user.service";
import { testCases } from "./testCases";
import { authMiddleware } from "@/middleware/authMiddleware";

jest.mock("@/app/api/services/user.service", () => ({
  UserService: {
    changeUserPassword: jest.fn(),
    getUserById: jest.fn(),
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

describe("API: /users/change-password", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  testCases.forEach(
    ({ description, requestData, expectedStatus, expectedResponse, isAuthenticated, mockChangePasswordResult }) => {
      it(`POST /users/change-password ${description}`, async () => {
        // Setup authentication mock
        if (isAuthenticated) {
          (authMiddleware as jest.Mock).mockResolvedValue({
            userId: 2,
            roleId: 2,
          });
        } else {
          const NextResponse = require("next/server").NextResponse;
          const mockResponse = NextResponse.json(
            {
              success: false,
              message: "No autenticado",
            },
            {
              status: 401,
            },
          );
          (authMiddleware as jest.Mock).mockResolvedValue(mockResponse);
        }

        // Setup service mocks
        if (description === "should successfully change password with valid data") {
          (UserService.changeUserPassword as jest.Mock).mockResolvedValue({
            success: true,
          });
          (UserService.getUserById as jest.Mock).mockResolvedValue({
            id: 2,
            username: "testuser",
            role_id: 2,
          });
        }

        if (mockChangePasswordResult) {
          (UserService.changeUserPassword as jest.Mock).mockResolvedValue(mockChangePasswordResult);
        }

        // Execute request
        const mockRequest = {
          json: jest.fn().mockResolvedValue(requestData),
        } as any;

        const response = await POST(mockRequest);
        const responseData = await response.json();

        // Assertions
        expect(response.status).toBe(expectedStatus);

        if (expectedResponse.success !== undefined) {
          expect(responseData.success).toBe(expectedResponse.success);
        }

        if (expectedResponse.message) {
          expect(responseData.message).toBe(expectedResponse.message);
        }

        // Specific assertions for successful change
        if (description === "should successfully change password with valid data") {
          expect(responseData.responseObject).toMatchObject({
            userId: 2,
            mustChangePassword: false,
          });
          expect(UserService.changeUserPassword).toHaveBeenCalledWith(
            2,
            (requestData as any).currentPassword,
            (requestData as any).newPassword,
          );
        }

        // Specific assertions for validation errors
        if (expectedResponse.responseObject && Object.keys(expectedResponse.responseObject).length > 0) {
          expect(responseData.responseObject).toBeDefined();
        }
      });
    },
  );

  it("should handle database errors gracefully", async () => {
    (authMiddleware as jest.Mock).mockResolvedValue({
      userId: 2,
      roleId: 2,
    });

    (UserService.changeUserPassword as jest.Mock).mockRejectedValue(new Error("Database error"));

    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        currentPassword: "OldPassword123!",
        newPassword: "NewSecurePassword456!",
        confirmNewPassword: "NewSecurePassword456!",
      }),
    } as any;

    const response = await POST(mockRequest);
    const responseData = await response.json();

    expect(response.status).toBe(500);
    expect(responseData.success).toBe(false);
    expect(responseData.message).toBe("Error interno del servidor al cambiar la contraseña");
  });

  it("should clear mustChangePassword flag after successful password change", async () => {
    (authMiddleware as jest.Mock).mockResolvedValue({
      userId: 2,
      roleId: 2,
    });

    (UserService.changeUserPassword as jest.Mock).mockResolvedValue({
      success: true,
    });

    (UserService.getUserById as jest.Mock).mockResolvedValue({
      id: 2,
      username: "testuser",
      must_change_password: true,
      role_id: 2,
    });

    const mockRequest = {
      json: jest.fn().mockResolvedValue({
        currentPassword: "OldPassword123!",
        newPassword: "NewSecurePassword456!",
        confirmNewPassword: "NewSecurePassword456!",
      }),
    } as any;

    const response = await POST(mockRequest);
    const responseData = await response.json();

    expect(response.status).toBe(200);
    expect(responseData.success).toBe(true);
    expect(responseData.responseObject.mustChangePassword).toBe(false);
  });
});
