import { POST } from "@/app/api/employee-requests/create/route";
import { EmployeeRequestService } from "@/app/api/services/employee-request.service";
import { testCases } from "./testCases";
import { authMiddleware } from "@/middleware/authMiddleware";
import { RequestService } from "@/app/api/services/request.service";

const { getEmployeeRequestFolio, getRequestStatus, validateEmployee, validateEmployeeRequest, validateExistence } =
  jest.requireMock("@/app/api/common/utils.service");

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

describe("API: /employee-requests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  testCases.forEach(({ description, requestData, expectedStatus, expectedResponse }) => {
    it(`POST /employee-requests ${description}`, async () => {
      (authMiddleware as jest.Mock).mockResolvedValue({
        userId: 1,
      });

      if (description === "should successfully send message with valid data") {
        getEmployeeRequestFolio.mockResolvedValue(null);
        getRequestStatus.mockResolvedValue(null);
        validateEmployee.mockResolvedValue(null);
        validateEmployeeRequest.mockResolvedValue(null);
        validateExistence.mockResolvedValue(null);
        (EmployeeRequestService.getFolio as jest.Mock).mockResolvedValue("00001");
        (EmployeeRequestService.validateEmployeeRequest as jest.Mock).mockResolvedValue(null);
        (RequestService.getRequestById as jest.Mock).mockResolvedValue({
          id: requestData.requestId,
          name: "Name",
          display_name: "DISPLAY_NAME",
          description: "Estatus de la solicitud",
          active: 1,
        });
        (EmployeeRequestService.createEmployeeRequest as jest.Mock).mockResolvedValueOnce([{}, {}]);
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
