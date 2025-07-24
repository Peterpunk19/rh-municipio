import { POST } from "@/app/api/employee-incidents/create/route";
import { testCases } from "./testCases";
import { EmployeeIncidentsService } from "@/app/api/services/employee-incidents.service";
import { IncidentRulesService } from "@/app/api/services/incident-rules.service";
import { EmployeeService } from "@/app/api/services/employee.service";
import * as utilsService from "@/app/api/common/utils.service";

jest.mock("@/app/api/services/employee-incidents.service");
jest.mock("@/app/api/services/incident-rules.service");
jest.mock("@/app/api/services/employee.service");
jest.mock("@/app/api/common/utils.service");
jest.mock("@/middleware/authMiddleware", () => ({
  authMiddleware: jest.fn().mockResolvedValue({
    employeeId: 1,
    roleId: 1,
    userId: 1,
  }),
}));

describe("API: /employee-incidents", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  testCases.forEach(({ description, requestData, expectedStatus, expectedResponse }) => {
    it(`POST /employee-incidents ${description}`, async () => {
      (utilsService.getFolio as jest.Mock).mockResolvedValue({
        success: true,
        message: "Incidencia creada correctamente",
        responseObject: {},
        statusCode: 200,
      });
      (utilsService.getIncidentStatus as jest.Mock).mockResolvedValue({ id: 1, name: "Pendiente" });
      (utilsService.validateEmployee as jest.Mock).mockResolvedValue({ id: 1 });
      (utilsService.validateEmployeeIncident as jest.Mock).mockResolvedValue(true);
      (utilsService.getEmployeeDireccion as jest.Mock).mockResolvedValue({ id: 1 });
      (utilsService.validateIncidentsRolesPermissions as jest.Mock).mockResolvedValue(true);
      (EmployeeIncidentsService.createEmployeeIncidents as jest.Mock).mockResolvedValue({ id: 1 });
      (IncidentRulesService.validateIncidentRules as jest.Mock).mockResolvedValue(null);
      (EmployeeService.getCurrentJobSchedule as jest.Mock).mockResolvedValue([
        {
          day: 1,
          entry_time: "09:00:00",
          departure_time: "18:00:00",
          is_active: true,
        },
      ]);

      if (description === "should return error when employee validation fails") {
        (utilsService.validateEmployee as jest.Mock).mockRejectedValueOnce(new Error("Employee validation failed"));
      } else if (description === "should successfully send message with valid data") {
        const createdIncident = {
          id: 1,
          folio: "TEST123",
          employee_id: 1,
          incident_id: 1,
          incident_status_id: 1,
          start_date: new Date(),
          end_date: new Date(),
          created_at: new Date(),
          created_by_id: 1,
          direccion_id: 1,
        };

        (EmployeeIncidentsService.createEmployeeIncidents as jest.Mock).mockResolvedValue(createdIncident);
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
