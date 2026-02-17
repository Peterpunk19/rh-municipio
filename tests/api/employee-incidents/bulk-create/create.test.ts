import { POST } from "@/app/api/employee-incidents/bulk-create/route";
import { testCases } from "./testCases";
import { EmployeeIncidentsService } from "@/app/api/services/employee-incidents.service";
import { CatalogsService } from "@/app/api/services/catalogs.service";
import * as utilsService from "@/app/api/common/utils.service";
import { HttpMessages } from "@/common/response/messages";

jest.mock("@/app/api/services/employee-incidents.service");
jest.mock("@/app/api/services/catalogs.service");
jest.mock("@/app/api/common/utils.service");
jest.mock("@/middleware/authMiddleware", () => ({
  authMiddleware: jest.fn().mockResolvedValue({
    employeeId: 1,
    roleId: 1,
    userId: 1,
  }),
}));

describe("API: /employee-incidents/bulk-create", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  testCases.forEach(({ description, requestData, expectedStatus, expectedResponse }) => {
    it(`POST /employee-incidents/bulk-create ${description}`, async () => {
      (CatalogsService.getCatalogById as jest.Mock).mockResolvedValue({
        id: 1,
        name: "JUSTIFICACION DE ENTRADA",
        allow_bulk_creation: true,
      });
      (utilsService.validateIncidentsRolesPermissions as jest.Mock).mockResolvedValue(true);
      (EmployeeIncidentsService.bulkCreateEmployeeIncidents as jest.Mock).mockResolvedValue({
        success: true,
        message: HttpMessages.employeeIncidents.createdSuccess,
        responseObject: {},
        statusCode: 200,
      });

      if (description === "should return error when incident does not allow bulk creation") {
        (CatalogsService.getCatalogById as jest.Mock).mockResolvedValue({
          id: 1,
          name: "JUSTIFICACION DE ENTRADA",
          allow_bulk_creation: false,
        });
      } else if (description === "should return error when permission validation fails") {
        (utilsService.validateIncidentsRolesPermissions as jest.Mock).mockResolvedValue(false);
      } else if (description === "should successfully send message with valid data") {
        const createdIncidents = {
          success: true,
          message: HttpMessages.employeeIncidents.bulkProcessed,
          responseObject: {
            incidents: [
              {
                id: 1,
                folio: "000015",
                oficio: "",
                start_date: "2026-02-11T00:00:00.000Z",
                end_date: "2026-02-12T00:00:00.000Z",
                description:
                  HttpMessages.employeeIncidents.bulkProcessed.split(" ")[0] +
                  " " +
                  HttpMessages.employeeIncidents.bulkProcessed.split(" ")[1],
                incident_id: 2,
                incident_status_id: 1,
                employee_id: 1,
                created_by_id: 1,
                created_at: "2026-02-11T23:08:38.869Z",
                validated_at: "2026-02-11T23:08:38.870Z",
                validated_by_id: null,
                direccion_id: 11,
                active: true,
              },
              {
                id: 2,
                folio: "000016",
                oficio: "",
                start_date: "2026-02-11T00:00:00.000Z",
                end_date: "2026-02-12T00:00:00.000Z",
                description:
                  HttpMessages.employeeIncidents.bulkProcessed.split(" ")[0] +
                  " " +
                  HttpMessages.employeeIncidents.bulkProcessed.split(" ")[1],
                incident_id: 2,
                incident_status_id: 1,
                employee_id: 2,
                created_by_id: 1,
                created_at: "2026-02-11T23:08:38.912Z",
                validated_at: "2026-02-11T23:08:38.913Z",
                validated_by_id: null,
                direccion_id: 11,
                active: true,
              },
              {
                id: 3,
                folio: "000017",
                oficio: "",
                start_date: "2026-02-11T00:00:00.000Z",
                end_date: "2026-02-12T00:00:00.000Z",
                description:
                  HttpMessages.employeeIncidents.bulkProcessed.split(" ")[0] +
                  " " +
                  HttpMessages.employeeIncidents.bulkProcessed.split(" ")[1],
                incident_id: 2,
                incident_status_id: 1,
                employee_id: 3,
                created_by_id: 1,
                created_at: "2026-02-11T23:08:38.913Z",
                validated_at: "2026-02-11T23:08:38.914Z",
                validated_by_id: null,
                direccion_id: 11,
                active: true,
              },
            ],
          },
          statusCode: 200,
        };

        (EmployeeIncidentsService.bulkCreateEmployeeIncidents as jest.Mock).mockResolvedValue(createdIncidents);
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
