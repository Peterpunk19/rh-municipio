import { GET } from "@/app/api/catalogs/salaries/byCategoryAndEmployeeType/route";
import { SalariesService } from "@/app/api/services/salaries.service";
import { testCases } from "./testCases";
import { authMiddleware } from "@/middleware/authMiddleware";

jest.mock("@/middleware/authMiddleware", () => ({
  authMiddleware: jest.fn(),
}));

jest.mock("@/app/api/services/salaries.service", () => ({
  SalariesService: {
    getSalariesByCategoryAndEmployeeType: jest.fn(),
  },
}));

describe("API: GET /catalogs/salaries/byCategoryAndEmployeeType", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  testCases.forEach(({ description, requestData, expectedStatus, expectedResponse }) => {
    (authMiddleware as jest.Mock).mockResolvedValue({
      userId: 1,
    });

    it(`GET /catalogs/salaries/byCategoryAndEmployeeType ${description}`, async () => {
      if (description === "should successfully send message with valid data") {
        (SalariesService.getSalariesByCategoryAndEmployeeType as jest.Mock).mockResolvedValueOnce({
          salary: {
            id: 1,
            salary: 100,
            active: true,
          },
        });
      }

      const queryParams = new URLSearchParams(requestData as unknown as Record<string, string>).toString();
      const url = `${process.env.NEXT_PUBLIC_API_URL}/catalogs/salaries/byCategoryAndEmployeeType?${queryParams}`;

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
