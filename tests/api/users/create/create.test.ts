import { POST } from "@/app/api/users/create/route";
import { UserService } from "@/app/api/services/user.service";
import { RoleService } from "@/app/api/services/role.service";
import { EmployeeService } from "@/app/api/services/employee.service";
import { testCases } from "./testCases";

jest.mock("@/app/api/services/user.service", () => ({
  UserService: {
    getUserByUsername: jest.fn(),
    getUserByUuid: jest.fn(),
    getUserByEmployeeId: jest.fn(),
    createUser: jest.fn(),
  },
}));

jest.mock("@/app/api/services/role.service", () => ({
  RoleService: {
    getRoleById: jest.fn(),
  },
}));

jest.mock("@/app/api/services/employee.service", () => ({
  EmployeeService: {
    getEmployeeById: jest.fn(),
  },
}));

jest.mock("@/middleware/authMiddleware", () => ({
  authMiddleware: jest.fn(),
}));

const { authMiddleware } = jest.requireMock("@/middleware/authMiddleware");

describe("API: /users", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  testCases.forEach(({ description, requestData, expectedStatus, expectedResponse }) => {
    it(`POST /users ${description}`, async () => {
      if (description === "should successfully send message with valid data") {
        (RoleService.getRoleById as jest.Mock).mockResolvedValueOnce({});
        (UserService.createUser as jest.Mock).mockResolvedValueOnce([{}, {}]);
        authMiddleware.mockResolvedValue({ userId: 1 });
      }

      if (description === "should return error for existing employee_id" && "employee_id" in requestData) {
        (UserService.getUserByEmployeeId as jest.Mock).mockResolvedValueOnce({
          employee_id: requestData.employee_id,
        });
      }

      if (description === "should return error for existing employee_id" && "employee_id" in requestData) {
        (EmployeeService.getEmployeeById as jest.Mock).mockResolvedValueOnce(null);
      }

      if (description === "should return error for not found role") {
        (RoleService.getRoleById as jest.Mock).mockResolvedValueOnce(null);
      }

      if (description === "should return error for existing uuid" && "uuid" in requestData) {
        (UserService.getUserByUuid as jest.Mock).mockResolvedValueOnce({
          uuid: requestData.uuid,
        });
      }

      if (description === "should return error for existing username") {
        (UserService.getUserByUsername as jest.Mock).mockResolvedValueOnce({
          username: requestData.username,
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
