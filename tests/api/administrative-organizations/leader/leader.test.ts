import { POST } from "@/app/api/administrative-organizations/leader/route";
import { EmployeeService } from "@/app/api/services/employee.service";
import { DireccionService } from "@/app/api/services/direccion.service";
import { AdministrativeOrganizationLeadersService } from "@/app/api/services/administrative-organization-leaders.service";
import { testCases } from "./testCases";
import { authMiddleware } from "@/middleware/authMiddleware";

jest.mock("@/middleware/authMiddleware", () => ({
  authMiddleware: jest.fn(),
}));

jest.mock("@/app/api/services/employee.service", () => ({
  EmployeeService: {
    getEmployeeById: jest.fn(),
  },
}));

jest.mock("@/app/api/services/direccion.service", () => ({
  DireccionService: {
    getDireccionById: jest.fn(),
  },
}));

jest.mock("@/app/api/services/role.service", () => ({
  RoleService: {
    getRoleByName: jest.fn(),
  },
}));

jest.mock("@/app/api/services/administrative-organization-leaders.service", () => ({
  AdministrativeOrganizationLeadersService: {
    createLeader: jest.fn(),
    deactivateLeader: jest.fn(),
  },
}));

describe("API: /administrative-organizations", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  testCases.forEach(({ description, requestData, expectedStatus, expectedResponse }) => {
    (authMiddleware as jest.Mock).mockResolvedValue({
      userId: 1,
    });

    it(`POST /administrative-organizations ${description}`, async () => {
      if (description === "should successfully send message with valid data") {
        const { RoleService } = require("@/app/api/services/role.service");
        (RoleService.getRoleByName as jest.Mock)
          .mockResolvedValueOnce({ id: 1, name: "director" })
          .mockResolvedValueOnce({ id: 2, name: "suplente" });

        (DireccionService.getDireccionById as jest.Mock).mockResolvedValue({
          id: requestData.direccionId,
        });
        (EmployeeService.getEmployeeById as jest.Mock).mockResolvedValue({
          id: requestData.director,
          employee_hiring: [],
          employee_location: [],
          employee_address: [],
        });
        (EmployeeService.getEmployeeById as jest.Mock).mockResolvedValue({
          id: requestData.deputyDirector,
          employee_hiring: [],
          employee_location: [],
          employee_address: [],
        });
        (AdministrativeOrganizationLeadersService.createLeader as jest.Mock)
          .mockResolvedValueOnce([])
          .mockResolvedValueOnce([]);
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
