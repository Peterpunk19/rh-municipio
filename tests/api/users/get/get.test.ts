import { GET } from "@/app/api/user/route";
import { dataProvider } from "./dataProvider";
import { UserService } from "@/app/api/services/user.service";
import type { IUserFilters } from "@/app/api/user/interface";

jest.mock("@/app/api/services/user.service", () => ({
  UserService: {
    getUsersByParams: jest.fn(),
  },
}));

describe("API: GET /user", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const testCases = [
    {
      description: "should return error for limit not number",
      requestData: dataProvider.limitNotnumber.request,
      expectedStatus: dataProvider.limitNotnumber.status,
      expectedResponse: dataProvider.limitNotnumber.response,
    },
    {
      description: "should return error for limit zero",
      requestData: dataProvider.limitZero.request as IUserFilters,
      expectedStatus: dataProvider.limitZero.status,
      expectedResponse: dataProvider.limitZero.response,
    },
    {
      description: "should return error for limit negative",
      requestData: dataProvider.limitNegative.request as IUserFilters,
      expectedStatus: dataProvider.limitNegative.status,
      expectedResponse: dataProvider.limitNegative.response,
    },
    {
      description: "should return error for page not number",
      requestData: dataProvider.pageNotnumber.request,
      expectedStatus: dataProvider.pageNotnumber.status,
      expectedResponse: dataProvider.pageNotnumber.response,
    },
    {
      description: "should return error for page zero",
      requestData: dataProvider.pageZero.request,
      expectedStatus: dataProvider.pageZero.status,
      expectedResponse: dataProvider.pageZero.response,
    },
    {
      description: "should return error for page negative",
      requestData: dataProvider.pageNegative.request as IUserFilters,
      expectedStatus: dataProvider.pageNegative.status,
      expectedResponse: dataProvider.pageNegative.response,
    },
    {
      description: "should return error for role_id not number",
      requestData: dataProvider.roleIdNotNumber.request,
      expectedStatus: dataProvider.roleIdNotNumber.status,
      expectedResponse: dataProvider.roleIdNotNumber.response,
    },
    {
      description: "should return error for role_id zero",
      requestData: dataProvider.roleIdZero.request as IUserFilters,
      expectedStatus: dataProvider.roleIdZero.status,
      expectedResponse: dataProvider.roleIdZero.response,
    },
    {
      description: "should return error for role_id negative",
      requestData: dataProvider.roleIdNegative.request as IUserFilters,
      expectedStatus: dataProvider.roleIdNegative.status,
      expectedResponse: dataProvider.roleIdNegative.response,
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
      description: "should successfully send message with valid data",
      requestData: dataProvider.validData.request as IUserFilters,
      expectedStatus: dataProvider.validData.status,
      expectedResponse: dataProvider.validData.response,
    },
  ];

  testCases.forEach(({ description, requestData, expectedStatus, expectedResponse }) => {
    it(`GET /user ${description}`, async () => {
      if (description === "should successfully send message with valid data") {
        (UserService.getUsersByParams as jest.Mock).mockResolvedValueOnce({
          total: 100,
          totalPages: 10,
          currentPage: 1,
          users: [],
        });
      }
      const queryParams = new URLSearchParams(requestData as unknown as Record<string, string>).toString();
      const url = `http://localhost:3001/api/user?${queryParams}`;
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
