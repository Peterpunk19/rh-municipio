import { GET } from "@/app/api/catalogs/salaries/route";
import { SalariesService } from "@/app/api/services/salaries.service";
import { testCases } from "./testCases";
import { authMiddleware } from "@/middleware/authMiddleware";

jest.mock("@/middleware/authMiddleware", () => ({
  authMiddleware: jest.fn(),
}));

jest.mock("@/app/api/services/salaries.service", () => ({
  SalariesService: {
    getSalariesByParams: jest.fn(),
  },
}));

describe("API: GET /salaries", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  testCases.forEach(({ description, requestData, expectedStatus, expectedResponse }) => {
    (authMiddleware as jest.Mock).mockResolvedValue({
      userId: 1,
    });

    it(`GET /salaries ${description}`, async () => {
      if (description === "should successfully send message with valid data") {
        (SalariesService.getSalariesByParams as jest.Mock).mockResolvedValueOnce({
          total: 100,
          totalPages: 10,
          currentPage: 1,
          salaries: [],
        });
      }

      const queryParams = new URLSearchParams(requestData as unknown as Record<string, string>).toString();
      const url = `${process.env.NEXT_PUBLIC_API_URL}/salaries?${queryParams}`;

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
