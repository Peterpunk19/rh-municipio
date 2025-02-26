import { POST } from "@/app/api/users/deactivate/route";
import { UserService } from "@/app/api/services/user.service";
import { testCases } from "./testCases";

jest.mock("@/app/api/services/user.service", () => ({
  UserService: {
    deactivateUser: jest.fn(),
    getUserById: jest.fn(),
  },
}));

describe("API: POST /users/deactivate", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  testCases.forEach(({ description, requestData, expectedStatus, expectedResponse }) => {
    it(`POST /users/deactivate ${description}`, async () => {
      if (description === "should return error for user already deactivated") {
        (UserService.getUserById as jest.Mock).mockResolvedValueOnce({
          id: 1,
          username: "carloszh04",
          role_id: 2,
          role_display_name: "User",
          active: false,
          created_at: "2025-02-17T00:02:09.415Z",
          updated_at: "2025-02-22T22:47:36.946Z",
        });
        (UserService.deactivateUser as jest.Mock).mockResolvedValueOnce({
          user_id: 1,
        });
      }

      if (description === "should return error for id not found") {
        (UserService.getUserById as jest.Mock).mockResolvedValueOnce(null);
        (UserService.deactivateUser as jest.Mock).mockResolvedValueOnce({
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
        (UserService.deactivateUser as jest.Mock).mockResolvedValueOnce({ user: {} });
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
