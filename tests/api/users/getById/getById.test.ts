import { GET } from "@/app/api/users/[id]/route";
import { UserService } from "@/app/api/services/user.service";
import { testCases } from "./testCases";

jest.mock("@/app/api/services/user.service", () => ({
  UserService: {
    getUserById: jest.fn(),
  },
}));

describe("API: GET /users/:id", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  testCases.forEach(({ description, requestData, expectedStatus, expectedResponse }) => {
    it(`GET /users/:id ${description}`, async () => {
      if (description === "should successfully send message with valid data") {
        (UserService.getUserById as jest.Mock).mockResolvedValueOnce({
          id: 1,
          username: "carloszh",
          role_id: 3,
          role_display_name: "Empleado",
          active: true,
          created_at: "2025-02-14T02:45:21.416Z",
          updated_at: "2025-02-14T02:45:21.416Z",
        });
      }
      const id = requestData.id;
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`;

      const requestObj = {
        url,
        method: "GET",
      } as any;

      const response = await GET(requestObj, { params: { id: id.toString() } } as any);
      const body = await response.json();
      expect(response.status).toBe(expectedStatus);
      expect(body).toEqual(expectedResponse);
    });
  });
});
