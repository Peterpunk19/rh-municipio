import { POST } from "@/app/api/user/create/route";
import { dataProvider } from "./dataProvider";
import { UserService } from "@/app/api/services/user.service";
import { RoleService } from "@/app/api/services/role.service";
import { EmployeeService } from "@/app/api/services/employee.service";
import { IUser } from "@/app/api/user/interface";

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

describe("API: /user", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const testCases = [
    {
      description: "should successfully send message with valid data",
      requestData: dataProvider.validData.request as IUser,
      expectedStatus: dataProvider.validData.status,
      expectedResponse: dataProvider.validData.response,
    },
    {
      description: "should return error for empty username",
      requestData: dataProvider.emptyUsername.request,
      expectedStatus: dataProvider.emptyUsername.status,
      expectedResponse: dataProvider.emptyUsername.response,
    },
    {
      description: "should return error for long username",
      requestData: dataProvider.longUsername.request,
      expectedStatus: dataProvider.longUsername.status,
      expectedResponse: dataProvider.longUsername.response,
    },
    {
      description: "should return error for existing username",
      requestData: dataProvider.duplicatedUsername.request as IUser,
      expectedStatus: dataProvider.duplicatedUsername.status,
      expectedResponse: dataProvider.duplicatedUsername.response,
    },
    {
      description: "should return error for invalid uuid",
      requestData: dataProvider.invalidUuid.request,
      expectedStatus: dataProvider.invalidUuid.status,
      expectedResponse: dataProvider.invalidUuid.response,
    },
    {
      description: "should return error for existing uuid",
      requestData: dataProvider.duplicatedUuid.request as IUser,
      expectedStatus: dataProvider.duplicatedUuid.status,
      expectedResponse: dataProvider.duplicatedUuid.response,
    },
    {
      description: "should return error for invalid employee_id",
      requestData: dataProvider.invalidEmployeeId.request,
      expectedStatus: dataProvider.invalidEmployeeId.status,
      expectedResponse: dataProvider.invalidEmployeeId.response,
    },
    {
      description: "should return error for not found employee_id",
      requestData: dataProvider.notFoundEmployeeId.request,
      expectedStatus: dataProvider.notFoundEmployeeId.status,
      expectedResponse: dataProvider.notFoundEmployeeId.response,
    },
    {
      description: "should return error for existing employee_id",
      requestData: dataProvider.duplicatedEmployeeId.request as IUser,
      expectedStatus: dataProvider.duplicatedEmployeeId.status,
      expectedResponse: dataProvider.duplicatedEmployeeId.response,
    },
    {
      description: "should return error for empty password",
      requestData: dataProvider.emptyPassword.request as IUser,
      expectedStatus: dataProvider.emptyPassword.status,
      expectedResponse: dataProvider.emptyPassword.response,
    },
    {
      description: "should return error for short password",
      requestData: dataProvider.shortPassword.request,
      expectedStatus: dataProvider.shortPassword.status,
      expectedResponse: dataProvider.shortPassword.response,
    },
    {
      description: "should return error for long password",
      requestData: dataProvider.longPassword.request,
      expectedStatus: dataProvider.longPassword.status,
      expectedResponse: dataProvider.longPassword.response,
    },
    {
      description: "should return error for password without upper case",
      requestData: dataProvider.upperCasePassword.request,
      expectedStatus: dataProvider.upperCasePassword.status,
      expectedResponse: dataProvider.upperCasePassword.response,
    },
    {
      description: "should return error for password without lower case",
      requestData: dataProvider.lowerCasePassword.request,
      expectedStatus: dataProvider.lowerCasePassword.status,
      expectedResponse: dataProvider.lowerCasePassword.response,
    },
    {
      description: "should return error for password without number",
      requestData: dataProvider.oneNumberPassword.request,
      expectedStatus: dataProvider.oneNumberPassword.status,
      expectedResponse: dataProvider.oneNumberPassword.response,
    },
    {
      description: "should return error for password without symbol",
      requestData: dataProvider.oneSymbolPassword.request,
      expectedStatus: dataProvider.oneSymbolPassword.status,
      expectedResponse: dataProvider.oneSymbolPassword.response,
    },
    {
      description: "should return error for empty role_id",
      requestData: dataProvider.emptyRoleId.request,
      expectedStatus: dataProvider.emptyRoleId.status,
      expectedResponse: dataProvider.emptyRoleId.response,
    },
    {
      description: "should return error for not found role",
      requestData: dataProvider.notFoundRole.request,
      expectedStatus: dataProvider.notFoundRole.status,
      expectedResponse: dataProvider.notFoundRole.response,
    },
  ];

  testCases.forEach(({ description, requestData, expectedStatus, expectedResponse }) => {
    it(`POST /user ${description}`, async () => {
      if (description === "should successfully send message with valid data") {
        (RoleService.getRoleById as jest.Mock).mockResolvedValueOnce({});
        (UserService.createUser as jest.Mock).mockResolvedValueOnce([{}, {}]);
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
