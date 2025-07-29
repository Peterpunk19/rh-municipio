import { POST } from "@/app/api/employee-incidents/create/route";
import { testCases } from "./testCases";
import { EmployeeIncidentsService } from "@/app/api/services/employee-incidents.service";

const {
  getFolio,
  getIncidentStatus,
  validateEmployee,
  validateEmployeeIncident,
  getEmployeeDireccion,
  validateIncidentsRolesPermissions,
} = jest.requireMock("@/app/api/common/utils.service");

jest.mock("@/app/api/common/utils.service", () => ({
  getFolio: jest.fn(),
  getIncidentStatus: jest.fn(),
  validateEmployee: jest.fn(),
  validateEmployeeIncident: jest.fn(),
  getEmployeeDireccion: jest.fn(),
  validateIncidentsRolesPermissions: jest.fn().mockResolvedValue(true),
}));

jest.mock("@/app/api/services/employee-incidents.service", () => ({
  EmployeeIncidentsService: {
    createEmployeeIncidents: jest.fn(),
  },
}));

// Mock authMiddleware
jest.mock("@/middleware/authMiddleware", () => ({
  authMiddleware: jest.fn(),
}));

const { authMiddleware } = jest.requireMock("@/middleware/authMiddleware");

describe("API: /employee-incidents", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  testCases.forEach(({ description, requestData, expectedStatus, expectedResponse }) => {
    it(`POST /employees-incidents ${description}`, async () => {
      if (description === "should successfully send message with valid data") {
        validateIncidentsRolesPermissions.mockResolvedValue(true);
        getFolio.mockResolvedValue(null);
        getIncidentStatus.mockResolvedValue(null);
        validateEmployee.mockResolvedValue(null);
        validateEmployeeIncident.mockResolvedValue(null);
        getEmployeeDireccion.mockResolvedValue(1);
        authMiddleware.mockResolvedValue({ userId: 1 });
        (EmployeeIncidentsService.createEmployeeIncidents as jest.Mock).mockResolvedValueOnce([{}, {}]);
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
