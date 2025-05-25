import { GET } from "@/app/api/administrative-organizations/route";
import { AdministrativeOrganizationLeadersService } from "@/app/api/services/administrative-organization-leaders.service";
import { testCases } from "./testCases";
import { authMiddleware } from "@/middleware/authMiddleware";

jest.mock("@/middleware/authMiddleware", () => ({
  authMiddleware: jest.fn(),
}));

jest.mock("@/app/api/services/administrative-organization-leaders.service", () => ({
  AdministrativeOrganizationLeadersService: {
    getAdministrativeOrganizationsByParams: jest.fn(),
  },
}));

describe("API: GET /administrative-organizations", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  testCases.forEach(({ description, requestData, expectedStatus, expectedResponse }) => {
    (authMiddleware as jest.Mock).mockResolvedValue({
      userId: 1,
    });

    it(`GET /administrative-organizations ${description}`, async () => {
      if (description === "should successfully send message with valid data") {
        (
          AdministrativeOrganizationLeadersService.getAdministrativeOrganizationsByParams as jest.Mock
        ).mockResolvedValueOnce({
          total: 100,
          totalPages: 10,
          currentPage: 1,
          administrativeOrganizations: [],
        });
      }

      const queryParams = new URLSearchParams(requestData as unknown as Record<string, string>).toString();
      const url = `${process.env.NEXT_PUBLIC_API_URL}/administrative-organizations?${queryParams}`;

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
