import { POST } from "@/app/api/users/deactivate/route";
import { UserService } from "@/app/api/services/user.service";
import { testCases } from "./testCases";
import { authMiddleware } from "@/middleware/authMiddleware";

jest.mock("@/app/api/services/user.service", () => ({
  UserService: {
    changeStatusUser: jest.fn(),
    getUserById: jest.fn(),
  },
}));

jest.mock("@/middleware/authMiddleware", () => ({
  authMiddleware: jest.fn().mockResolvedValue({
    userId: 1,
    employeeId: 1,
    roleId: 1,
    roleName: "admin",
  }),
}));

describe("API: POST /users/deactivate", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (authMiddleware as jest.Mock).mockResolvedValue({
      userId: 1,
      employeeId: 1,
      roleId: 1,
      roleName: "admin",
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  testCases.forEach(({ description, requestData, expectedStatus, expectedResponse }) => {
    it(`POST /users/deactivate ${description}`, async () => {
      if (description === "should return error for id not found") {
        (UserService.getUserById as jest.Mock).mockResolvedValueOnce(null);
        (UserService.changeStatusUser as jest.Mock).mockResolvedValueOnce({
          user_id: 100000,
        });
      }

      if (description === "should successfully send message with valid data") {
        (UserService.getUserById as jest.Mock).mockResolvedValueOnce({
          id: 2,
          username: "carloszh",
          role_id: 2,
          role_display_name: "User",
          active: true,
          created_at: "2025-02-17T00:02:09.415Z",
          updated_at: "2025-02-22T22:47:36.946Z",
        });
        (UserService.changeStatusUser as jest.Mock).mockResolvedValueOnce({
          id: 2,
          uuid: "test-uuid",
          username: "carloszh",
          active: false,
          updated_at: "2025-02-22T22:47:36.946Z",
        });
      }

      if (description === "should successfully activate a user") {
        (UserService.getUserById as jest.Mock).mockResolvedValueOnce({
          id: 3,
          username: "williammrr",
          role_id: 2,
          role_display_name: "User",
          active: false,
          created_at: "2025-02-17T00:02:09.415Z",
          updated_at: "2025-02-22T22:47:36.946Z",
        });

        (UserService.changeStatusUser as jest.Mock).mockResolvedValueOnce({
          id: 3,
          uuid: "test-uuid-2",
          username: "williammrr",
          active: true,
          updated_at: "2025-02-22T22:47:36.946Z",
        });
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
