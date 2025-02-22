import { POST } from "@/app/api/employee-incidents/create/route";
import { testCases } from "./testCases";
import { EmployeeIncidentsService } from "@/app/api/services/employee-incidents.service";

const { getFolio, getIncidentStatus, validateEmployee, validateEmployeeIncident } = jest.requireMock(
  "@/app/api/common/utils.service",
);

jest.mock("@/app/api/common/utils.service", () => ({
  getFolio: jest.fn(),
  getIncidentStatus: jest.fn(),
  validateEmployee: jest.fn(),
  validateEmployeeIncident: jest.fn(),
}));

jest.mock("@/app/api/services/employee-incidents.service", () => ({
  EmployeeIncidentsService: {
    createEmployeeIncidents: jest.fn(),
  },
}));

describe("API: /employee-incidents", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  testCases.forEach(({ description, requestData, expectedStatus, expectedResponse }) => {
    it(`POST /employees-incidents ${description}`, async () => {
      if (description === "should successfully send message with valid data") {
        getFolio.mockResolvedValue(null);
        getIncidentStatus.mockResolvedValue(null);
        validateEmployee.mockResolvedValue(null);
        validateEmployeeIncident.mockResolvedValue(null);
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
