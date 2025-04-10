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
            name: "ABRAM",
            maternal_last_name: "GUTIERREZ",
            paternal_last_name: "ALFARO",
            employee_hiring: [
              {
                id: 31,
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
            {
              id: 33,
              created_at: "2025-04-11T00:26:26.214Z",
              incident_status: {
                id: 2,
                name: "aprobada",
                display_name: "APROBADA",
                btn_color: "success",
                btn_display_name: "Aprobada",
                btn_icon: "check",
              },
              created_by: {
                id: 32,
                name: "ABRAM",
                maternal_last_name: "GUTIERREZ",
                paternal_last_name: "ALFARO",
              },
            },
          ],
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
