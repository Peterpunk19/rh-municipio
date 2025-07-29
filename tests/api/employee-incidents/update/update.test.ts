import { PUT } from "@/app/api/employee-incidents/update/route";
import { testCases } from "./testCases";
import { authMiddleware } from "@/middleware/authMiddleware";
import { EmployeeIncidentsService } from "@/app/api/services/employee-incidents.service";
import { CatalogsService } from "@/app/api/services/catalogs.service";

jest.mock("@/middleware/authMiddleware", () => ({
  authMiddleware: jest.fn(),
}));

jest.mock("@/app/api/services/employee-incidents.service", () => ({
  EmployeeIncidentsService: {
    getEmployeeIncidentById: jest.fn(),
    updateEmployeeIncidents: jest.fn(),
  },
}));

jest.mock("@/app/api/services/catalogs.service", () => ({
  CatalogsService: {
    getCatalogById: jest.fn(),
  },
}));

jest.mock("@/app/api/services/incidents-status.service", () => ({
  IncidentsStatusService: {
    validateIncidentStatus: jest.fn(),
  },
}));

jest.mock("@/app/api/services/employee-incidents-status.service", () => ({
  EmployeeIncidentsStatusService: {
    validateEmployeeIncidentStatus: jest.fn(),
  },
}));

jest.mock("@/app/api/common/utils.service", () => ({
  validateIncidentsRolesPermissions: jest.fn().mockResolvedValue(true),
}));

describe("API: /employees/update", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  testCases.forEach(({ description, requestData, expectedStatus, expectedResponse }) => {
    (authMiddleware as jest.Mock).mockResolvedValue({
      userId: 1,
      roleId: 3,
      employeeId: 1,
    });
    it(`PUT /employee-incidents/update ${description}`, async () => {
      if (description === "should successfully send message with valid data") {
        const { IncidentsStatusService } = require("@/app/api/services/incidents-status.service");
        const { validateIncidentsRolesPermissions } = require("@/app/api/common/utils.service");

        (IncidentsStatusService.validateIncidentStatus as jest.Mock).mockResolvedValue({
          allowed_roles_to_update: "1,2,3",
        });

        const { EmployeeIncidentsStatusService } = require("@/app/api/services/employee-incidents-status.service");
        (EmployeeIncidentsStatusService.validateEmployeeIncidentStatus as jest.Mock).mockResolvedValue(null);

        validateIncidentsRolesPermissions.mockResolvedValue(true);

        (EmployeeIncidentsService.getEmployeeIncidentById as jest.Mock).mockResolvedValue({
          id: 1,
          folio: "000001",
          oficio: "",
          description: "TEST IMPORT",
          incident_status_id: 2,
          start_date: "2021-09-23T23:22:42.160Z",
          end_date: "2001-05-28T17:04:14.929Z",
          active: true,
          created_at: "2025-04-10T00:07:52.066Z",
          employee_id: 32,
          incident: {
            id: 1,
            name: "incapacidad",
            display_name: "INCAPACIDADES",
          },
          incident_status: {
            id: 2,
            name: "aprobada",
            display_name: "APROBADA",
            btn_color: "success",
            btn_display_name: "Aprobada",
            btn_icon: "check",
          },
          employee: {
            id: 32,
            user_id: 1, // Add missing property
            name: "ABRAM",
            maternal_last_name: "GUTIERREZ",
            paternal_last_name: "ALFARO",
            employee_ascriptions: [
              // Add missing property
              {
                id: 1,
                active: true,
                created_at: new Date(),
                updated_at: new Date(),
                direccion: {
                  id: 1,
                  name: "rh",
                  display_name: "Recursos Humanos",
                  secretaria: {
                    id: 1,
                    name: "gobierno",
                    display_name: "Secretaría de gobernación",
                  },
                },
              },
            ],
            employee_hiring: [
              {
                id: 31,
                active: true,
                created_at: new Date(),
                updated_at: new Date(),
                category: {
                  id: 130,
                  name: "jardinero_a",
                  display_name: "JARDINERO A",
                },
                employee_type: {
                  id: 1,
                  name: "base_sindicalizado",
                },
                direccion: {
                  id: 1,
                  name: "rh",
                  display_name: "Recursos Humanos",
                  secretaria: {
                    id: 1,
                    name: "gobierno",
                    display_name: "Secretaría de gobernación",
                  },
                },
              },
            ],
            employee_location: [
              {
                id: 31,
                active: true,
                created_at: new Date(),
                updated_at: new Date(),
                location: {
                  id: 1,
                  name: "main",
                  display_name: "Main Location",
                },
              },
            ],
            employee_attendance_type: [
              {
                id: 1,
              },
            ],
          },
          employee_incidents_status: [
            {
              id: 1,
              created_at: "2025-04-10T00:07:52.068Z",
              incident_status: {
                id: 3,
                name: "rechazada",
                display_name: "RECHAZADA",
                btn_color: "error",
                btn_display_name: "Rechazada",
                btn_icon: "x",
              },
              created_by: {
                id: 32,
                name: "ABRAM",
                maternal_last_name: "GUTIERREZ",
                paternal_last_name: "ALFARO",
              },
            },
          ],
          employee_incident_days: [], // Add missing property
        });
        (CatalogsService.getCatalogById as jest.Mock).mockResolvedValue({
          id: 2,
          name: "aprobada",
          display_name: "APROBADA",
          btn_display_name: "Aprobada",
          btn_icon: "check",
          btn_color: "success",
          type: 1,
          active: true,
          permission_name: "can_update",
        });
        (EmployeeIncidentsService.updateEmployeeIncidents as jest.Mock).mockResolvedValueOnce([{}, {}]);
      }

      const requestObj = {
        json: async () => requestData,
      } as any;

      const response = await PUT(requestObj);
      const body = await response.json();

      expect(response.status).toBe(expectedStatus);
      expect(body).toEqual(expectedResponse);
    });
  });
});
