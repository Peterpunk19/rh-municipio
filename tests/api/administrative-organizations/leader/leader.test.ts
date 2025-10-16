import { NextRequest } from "next/server";
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
    getRoleById: jest.fn(),
  },
}));

jest.mock("@/app/api/services/administrative-organization-leaders.service", () => ({
  AdministrativeOrganizationLeadersService: {
    createLeaders: jest.fn(),
    deactivateOtherLeaders: jest.fn().mockResolvedValue({ success: true }),
  },
}));

describe("API: /administrative-organizations/leader", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  testCases.forEach(({ description, requestData, expectedStatus, expectedResponse }) => {
    (authMiddleware as jest.Mock).mockResolvedValue({
      userId: 1,
    });

    it(`POST /api/administrative-organizations/leader ${description}`, async () => {
      if (description === "should successfully send message with valid data") {
        const { RoleService } = require("@/app/api/services/role.service");
        (RoleService.getRoleByName as jest.Mock)
          .mockResolvedValueOnce({ id: 1, name: "director" })
          .mockResolvedValueOnce({ id: 2, name: "secretary" })
          .mockResolvedValueOnce({ id: 3, name: "coordinator" })
          .mockResolvedValueOnce({ id: 4, name: "immediateResponsible" });

        (RoleService.getRoleById as jest.Mock)
          .mockResolvedValueOnce({ id: 1, name: "director" })
          .mockResolvedValueOnce({ id: 2, name: "secretary" });

        (DireccionService.getDireccionById as jest.Mock).mockResolvedValue({
          id: requestData.direccionId,
        });

        [
          requestData.director,
          requestData.secretary,
          requestData.coordinator,
          requestData.immediateResponsible,
        ].forEach((employeeId) => {
          (EmployeeService.getEmployeeById as jest.Mock).mockResolvedValueOnce({
            id: employeeId,
            employee_hiring: [],
            employee_location: [],
            employee_address: [],
          });
        });

        (AdministrativeOrganizationLeadersService.createLeaders as jest.Mock).mockResolvedValueOnce({
          success: true,
          responseObject: [],
        });
      }

      const isSuccessCase = description === "should successfully send message with valid data";
      const directorRoleId = 1;
      const secretaryRoleId = 2;

      const requestBody = {
        ...requestData,
        startDate: requestData.startDate ? new Date(requestData.startDate).toISOString() : null,
        endDate: requestData.endDate ? new Date(requestData.endDate).toISOString() : null,
        ...(isSuccessCase
          ? {
              signIncidentsRole: directorRoleId,
              signRequestsRole: secretaryRoleId,
            }
          : {
              signIncidentsRole: requestData.signIncidentsRole,
              signRequestsRole: requestData.signRequestsRole,
            }),
      };

      const request = new NextRequest("http://localhost:3000/api/administrative-organizations/leader", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const response = await POST(request);
      const body = await response.json();
      expect(body).toEqual(expectedResponse);
    });
  });
});
