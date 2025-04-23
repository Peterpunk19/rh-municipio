import { GET } from "@/app/api/employee-requests/route";
import { EmployeeRequestService } from "@/app/api/services/employee-request.service";
import { testCases } from "./testCases";

jest.mock("@/app/api/services/employee-request.service", () => ({
  EmployeeRequestService: {
    getEmployeeRequestsByParams: jest.fn(),
  },
}));

describe("API: GET /employee-requests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  testCases.forEach(({ description, requestData, expectedStatus, expectedResponse }) => {
    it(`GET /employee-requests ${description}`, async () => {
      if (description === "should successfully send message with valid data") {
        (EmployeeRequestService.getEmployeeRequestsByParams as jest.Mock).mockResolvedValueOnce({
          total: 100,
          totalPages: 10,
          currentPage: 1,
          requests: [],
        });
      }

      const queryParams = new URLSearchParams();
      Object.entries(requestData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
      
      const url = `${process.env.NEXT_PUBLIC_API_URL}/employee-requests?${queryParams.toString()}`;

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
