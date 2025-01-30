import { GET } from "@/app/api/employees/route";
import { dataProvider } from "./dataProvider";
import { EmployeeService } from "@/app/api/services/employee.service";
import type { IEmployeeFilters } from "@/app/api/employees/interface";

jest.mock("@/app/api/services/employee.service", () => ({
  EmployeeService: {
    getEmployeesByParams: jest.fn(),
  },
}));

describe("API: GET /employees", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const testCases = [
    {
      description: "should return error for page not number",
      requestData: dataProvider.pageNotnumber.request,
      expectedStatus: dataProvider.pageNotnumber.status,
      expectedResponse: dataProvider.pageNotnumber.response,
    },
    {
      description: "should return error for page zero",
      requestData: dataProvider.pageZero.request as IEmployeeFilters,
      expectedStatus: dataProvider.pageZero.status,
      expectedResponse: dataProvider.pageZero.response,
    },
    {
      description: "should return error for page negative",
      requestData: dataProvider.pageNegative.request as IEmployeeFilters,
      expectedStatus: dataProvider.pageNegative.status,
      expectedResponse: dataProvider.pageNegative.response,
    },
    {
      description: "should return error for limit not number",
      requestData: dataProvider.limitNotnumber.request,
      expectedStatus: dataProvider.limitNotnumber.status,
      expectedResponse: dataProvider.limitNotnumber.response,
    },
    {
      description: "should return error for limit zero",
      requestData: dataProvider.limitZero.request as IEmployeeFilters,
      expectedStatus: dataProvider.limitZero.status,
      expectedResponse: dataProvider.limitZero.response,
    },
    {
      description: "should return error for limit negative",
      requestData: dataProvider.limitNegative.request as IEmployeeFilters,
      expectedStatus: dataProvider.limitNegative.status,
      expectedResponse: dataProvider.limitNegative.response,
    },
    {
      description: "should return error for active not boolean",
      requestData: dataProvider.activeNotBoolean.request,
      expectedStatus: dataProvider.activeNotBoolean.status,
      expectedResponse: dataProvider.activeNotBoolean.response,
    },
    {
      description: "should return error for active as number",
      requestData: dataProvider.activeAsNumber.request,
      expectedStatus: dataProvider.activeAsNumber.status,
      expectedResponse: dataProvider.activeAsNumber.response,
    },
    {
      description: "should return error for status_employee_id not number",
      requestData: dataProvider.statusEmployeeIdNotNumber.request,
      expectedStatus: dataProvider.statusEmployeeIdNotNumber.status,
      expectedResponse: dataProvider.statusEmployeeIdNotNumber.response,
    },
    {
      description: "should return error for status_employee_id zero",
      requestData: dataProvider.statusEmployeeIdZero.request as IEmployeeFilters,
      expectedStatus: dataProvider.statusEmployeeIdZero.status,
      expectedResponse: dataProvider.statusEmployeeIdZero.response,
    },
    {
      description: "should return error for status_employee_id negative",
      requestData: dataProvider.statusEmployeeIdNegative.request as IEmployeeFilters,
      expectedStatus: dataProvider.statusEmployeeIdNegative.status,
      expectedResponse: dataProvider.statusEmployeeIdNegative.response,
    },
    {
      description: "should return error for location_id not number",
      requestData: dataProvider.locationIdNotNumber.request,
      expectedStatus: dataProvider.locationIdNotNumber.status,
      expectedResponse: dataProvider.locationIdNotNumber.response,
    },
    {
      description: "should return error for location_id zero",
      requestData: dataProvider.locationIdZero.request as IEmployeeFilters,
      expectedStatus: dataProvider.locationIdZero.status,
      expectedResponse: dataProvider.locationIdZero.response,
    },
    {
      description: "should return error for location_id negative",
      requestData: dataProvider.locationIdNegative.request as IEmployeeFilters,
      expectedStatus: dataProvider.locationIdNegative.status,
      expectedResponse: dataProvider.locationIdNegative.response,
    },
    {
      description: "should return error for invalid start date",
      requestData: dataProvider.invalidStartDate.request,
      expectedStatus: dataProvider.invalidStartDate.status,
      expectedResponse: dataProvider.invalidStartDate.response,
    },
    {
      description: "should return error for invalid end date",
      requestData: dataProvider.invalidEndDate.request,
      expectedStatus: dataProvider.invalidEndDate.status,
      expectedResponse: dataProvider.invalidEndDate.response,
    },
    {
      description: "should return error for empty search",
      requestData: dataProvider.emptySearch.request,
      expectedStatus: dataProvider.emptySearch.status,
      expectedResponse: dataProvider.emptySearch.response,
    },
    {
      description: "should return error for long search",
      requestData: dataProvider.longSearch.request,
      expectedStatus: dataProvider.longSearch.status,
      expectedResponse: dataProvider.longSearch.response,
    },
    {
      description: "should successfully send message with valid data",
      requestData: dataProvider.validData.request as IEmployeeFilters,
      expectedStatus: dataProvider.validData.status,
      expectedResponse: dataProvider.validData.response,
    },
  ];

  testCases.forEach(({ description, requestData, expectedStatus, expectedResponse }) => {
    it(`GET /employees ${description}`, async () => {
      if (description === "should successfully send message with valid data") {
        (EmployeeService.getEmployeesByParams as jest.Mock).mockResolvedValueOnce({
          data: [],
          total: 1,
          currentPage: 1,
          totalPages: 1,
        });
      }
      const queryParams = new URLSearchParams(requestData as unknown as Record<string, string>).toString();
      const url = `http://localhost:3001/api/employees?${queryParams}`;
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
