import { POST } from "@/app/api/employee-requests/create/route";
import { EmployeeRequestService } from "@/app/api/services/employee-request.service";
import { authMiddleware } from "@/middleware/authMiddleware";
import { RequestService } from "@/app/api/services/request.service";

jest.mock("@/app/api/common/utils.service", () => ({
  getEmployeeRequestFolio: jest.fn(),
  getRequestStatus: jest.fn(),
  validateEmployee: jest.fn(),
  validateEmployeeRequest: jest.fn(),
  validateExistence: jest.fn(),
  validateRequestsRolesPermissions: jest.fn(),
}));

jest.mock("@/app/api/services/request.service", () => ({
  RequestService: {
    getRequestById: jest.fn(),
  },
}));

jest.mock("@/middleware/authMiddleware", () => ({
  authMiddleware: jest.fn(),
}));

jest.mock("@/app/api/services/employee-request.service", () => ({
  EmployeeRequestService: {
    getFolio: jest.fn(),
    createEmployeeRequest: jest.fn(),
    validateEmployeeRequest: jest.fn(),
  },
}));

const {
  getEmployeeRequestFolio,
  getRequestStatus,
  validateEmployee,
  validateEmployeeRequest,
  validateExistence,
  validateRequestsRolesPermissions,
} = require("@/app/api/common/utils.service");

describe("API: /employee-requests permissions", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return error when user lacks permission to create requests", async () => {
    (authMiddleware as jest.Mock).mockResolvedValue({
      userId: 1,
      roleId: 2, // Role without permissions
    });

    // Mock successful request lookup
    (RequestService.getRequestById as jest.Mock).mockResolvedValue({
      id: 1,
      name: "schedule_change_request",
      display_name: "CAMBIO DE HORARIO",
      description: "Estatus de la solicitud",
      active: 1,
    });

    // Mock permission validation failure
    validateRequestsRolesPermissions.mockResolvedValue(null); // No permissions found

    const requestData = {
      employeeId: 1,
      requestId: 1,
      description: "Test request for schedule change",
      schedule: [
        {
          startDayId: 1,
          endDayId: 5,
          startHourId: 1,
          endHourId: 8,
        },
      ],
      startDate: "2025-01-01",
      endDate: "2025-01-31",
    };

    const requestObj = {
      json: async () => requestData,
    } as any;

    const response = await POST(requestObj);
    const responseData = await response.json();

    expect(response.status).toBe(400);
    expect(responseData.message).toBe("No puedes crear este tipo de solicitud");
  });

  it("should succeed when user has permission to create requests", async () => {
    (authMiddleware as jest.Mock).mockResolvedValue({
      userId: 1,
      roleId: 1, // Role with permissions
    });

    // Mock successful validations
    getEmployeeRequestFolio.mockResolvedValue(null);
    getRequestStatus.mockResolvedValue(null);
    validateEmployee.mockResolvedValue(null);
    validateEmployeeRequest.mockResolvedValue(null);
    validateExistence.mockResolvedValue(null);
    validateRequestsRolesPermissions.mockResolvedValue({ can_create: true }); // Has permissions

    (EmployeeRequestService.getFolio as jest.Mock).mockResolvedValue("00001");
    (EmployeeRequestService.validateEmployeeRequest as jest.Mock).mockResolvedValue(null);
    (RequestService.getRequestById as jest.Mock).mockResolvedValue({
      id: 1,
      name: "schedule_change_request",
      display_name: "CAMBIO DE HORARIO",
      description: "Estatus de la solicitud",
      active: 1,
    });
    (EmployeeRequestService.createEmployeeRequest as jest.Mock).mockResolvedValueOnce([{ id: 1 }, {}]);

    const requestData = {
      employeeId: 1,
      requestId: 1,
      description: "Test request for schedule change",
      schedule: [
        {
          startDayId: 1,
          endDayId: 5,
          startHourId: 1,
          endHourId: 8,
        },
      ],
      startDate: "2025-01-01",
      endDate: "2025-01-31",
    };

    const requestObj = {
      json: async () => requestData,
    } as any;

    const response = await POST(requestObj);
    const responseData = await response.json();

    expect(response.status).toBe(200);
    expect(responseData.message).toBe("Solicitud creada correctamente");
  });
});
