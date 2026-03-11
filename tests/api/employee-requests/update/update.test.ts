import { PUT } from "@/app/api/employee-requests/update/route";
import { testCases } from "./testCases";
import { authMiddleware } from "@/middleware/authMiddleware";
import { EmployeeRequestService } from "@/app/api/services/employee-request.service";
import { CatalogsService } from "@/app/api/services/catalogs.service";
import { RequestsStatusService } from "@/app/api/services/requests-status.service";
import { EmployeeRequestsStatusService } from "@/app/api/services/employee-requests-status.service";

jest.mock("@/middleware/authMiddleware", () => ({
  authMiddleware: jest.fn(),
}));

jest.mock("@/app/api/services/employee-request.service", () => ({
  EmployeeRequestService: {
    getEmployeeRequestById: jest.fn(),
    updateEmployeeRequests: jest.fn(),
  },
}));

jest.mock("@/app/api/services/catalogs.service", () => ({
  CatalogsService: {
    getCatalogById: jest.fn(),
  },
}));

jest.mock("@/app/api/services/requests-status.service", () => ({
  RequestsStatusService: {
    getRequestStatusById: jest.fn(),
  },
}));

jest.mock("@/app/api/services/employee-requests-status.service", () => ({
  EmployeeRequestsStatusService: {
    validateEmployeeRequestStatus: jest.fn(),
  },
}));

jest.mock("@/app/api/common/utils.service", () => ({
  validateRequestsRolesPermissions: jest.fn(),
}));

jest.mock("@/app/api/services/requests-permissions-validator.service", () => ({
  RequestsPermissionsValidator: {
    validateStatusTransition: jest.fn(),
  },
}));

const { validateRequestsRolesPermissions } = require("@/app/api/common/utils.service");

describe("API: /employee-requests/update", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  testCases.forEach(({ description, requestData, expectedStatus, expectedResponse }) => {
    (authMiddleware as jest.Mock).mockResolvedValue({
      userId: 1,
      roleId: 3,
      employeeId: 1,
    });

    it(`PUT /employee-requests/update ${description}`, async () => {
      if (
        description.includes("empty id") ||
        description.includes("id not number") ||
        description.includes("empty status")
      ) {
      } else if (
        description.includes("id zero") ||
        description.includes("id negative") ||
        description.includes("id too long")
      ) {
        (RequestsStatusService.getRequestStatusById as jest.Mock).mockResolvedValue(null);
      } else if (description.includes("invalid status")) {
      } else if (description === "should successfully send message with valid data") {
        (RequestsStatusService.getRequestStatusById as jest.Mock).mockResolvedValue({
          id: 2,
          name: "aprobada",
          display_name: "APROBADA",
          btn_display_name: "Aprobada",
          btn_icon: "check",
          btn_color: "success",
          type: 1,
          active: true,
          allowed_roles_to_update: "1,2,3",
        });

        (EmployeeRequestService.getEmployeeRequestById as jest.Mock).mockResolvedValue({
          id: 1,
          folio: "000001",
          oficio: "",
          justification: "TEST IMPORT",
          request_status: {
            id: 1,
            name: "creada",
            display_name: "CREADA",
            btn_color: "warning",
            btn_display_name: "Creada",
            btn_icon: "clock",
            type: 1,
            active: true,
          },
          employee: {
            name: "ABRAM GUTIERREZ ALFARO",
            employeeNumber: "12345",
            rfc: "GUAA123456ABC",
            curp: "GUAA123456HDFABC01",
            publicOrganization: "Secretaría de gobernación",
            administrativeOrganization: "Recursos Humanos",
            category: "JARDINERO A",
          },
          request: {
            id: 1,
            name: "schedule_change_request",
            display_name: "CAMBIO DE HORARIO",
            active: true,
          },
          requestedBy: {
            id: 32,
            username: "abram.gutierrez",
          },
          employee_request_status: [
            {
              id: 1,
              created_at: "2025-04-10T00:07:52.068Z",
              request_status: {
                id: 1,
                name: "creada",
                display_name: "CREADA",
                btn_color: "warning",
                btn_display_name: "Creada",
                btn_icon: "clock",
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

        (EmployeeRequestsStatusService.validateEmployeeRequestStatus as jest.Mock).mockResolvedValue(false);
        validateRequestsRolesPermissions.mockResolvedValue({ can_edit: true });

        const { RequestsPermissionsValidator } = require("@/app/api/services/requests-permissions-validator.service");
        (RequestsPermissionsValidator.validateStatusTransition as jest.Mock).mockResolvedValue(true);

        (EmployeeRequestService.updateEmployeeRequests as jest.Mock).mockResolvedValueOnce([{}]);
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
