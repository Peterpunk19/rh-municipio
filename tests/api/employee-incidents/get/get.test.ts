import { GET } from "@/app/api/employee-incidents/route";
import { testCases } from "./testCases";
import { EmployeeIncidentsService } from "@/app/api/services/employee-incidents.service";

jest.mock("@/app/api/services/employee-incidents.service", () => ({
  EmployeeIncidentsService: {
    getEmployeesIncidentsByParams: jest.fn(),
  },
}));

describe("API: GET /employee-incidents", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  testCases.forEach(({ description, requestData, expectedStatus, expectedResponse }) => {
    it(`GET /employees-incidents/ ${description}`, async () => {
      if (description === "should successfully send message with valid data") {
        (EmployeeIncidentsService.getEmployeesIncidentsByParams as jest.Mock).mockResolvedValueOnce({
          data: [],
          total: 1,
          currentPage: 1,
          totalPages: 1,
        });
      }

      const queryParams = new URLSearchParams(requestData as unknown as Record<string, string>).toString();
      const url = `${process.env.NEXT_PUBLIC_API_URL}/employee-incidents?${queryParams}`;

      const requestObj = {
        url,
        method: "GET",
      } as any;

      const response = await GET(requestObj);
      const body = await response.json();

      expect(response.status).toBe(expectedStatus);
      expect(body).toEqual(expectedResponse);
    });
  });
});
