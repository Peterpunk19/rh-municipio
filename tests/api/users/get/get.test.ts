import { GET } from "@/app/api/users/route";
import { UserService } from "@/app/api/services/user.service";
import { testCases } from "./testCases";

jest.mock("@/app/api/services/user.service", () => ({
  UserService: {
    getUsersByParams: jest.fn(),
  },
}));

describe("API: GET /users", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  testCases.forEach(({ description, requestData, expectedStatus, expectedResponse }) => {
    it(`GET /users ${description}`, async () => {
      if (description === "should successfully send message with valid data") {
        (UserService.getUsersByParams as jest.Mock).mockResolvedValueOnce({
          total: 100,
          totalPages: 10,
          currentPage: 1,
          users: [],
        });
      }
      const queryParams = new URLSearchParams(requestData as unknown as Record<string, string>).toString();
      const url = `http://localhost:3001/api/user?${queryParams}`;
      const requestObj = {
        url,
        method: "GET",
      } as any;
      const response = await GET(requestObj);
      const body = await response.json();
      expect(response.status).toBe(expectedStatus);
      expect(body).toEqual(expectedResponse);
    });
  });
});
