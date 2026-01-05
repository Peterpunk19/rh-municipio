import { catalogTestConfigs, generateCatalogTests } from "./catalogTestFactory";

jest.mock("@/middleware/authMiddleware", () => ({
  authMiddleware: jest.fn().mockResolvedValue({ userId: 1, roleId: 1 }),
}));

jest.mock("@/app/api/services/category.service");
jest.mock("@/app/api/services/holiday.service");
jest.mock("@/app/api/services/schooling.service");
jest.mock("@/app/api/services/occupation.service");
jest.mock("@/app/api/services/direccion.service");
jest.mock("@/app/api/services/location.service");
jest.mock("@/app/api/services/marital-status.service");
jest.mock("@/app/api/services/profession.service");
jest.mock("@/app/api/services/secretarias.service");
jest.mock("@/app/api/services/trade-union.service");

Object.entries(catalogTestConfigs).forEach(([catalogKey, config]) => {
  describe(`API: /catalogs/${catalogKey}`, () => {
    let POST: any;
    let mockService: any;

    beforeAll(() => {
      const route = require(config.routePath);
      POST = route.POST;
      mockService = require(config.servicePath)[config.serviceName];
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    const { baseTests, additionalTests } = generateCatalogTests(config);
    const allTests = [...baseTests, ...additionalTests];

    allTests.forEach(({ description, data, shouldFail, expectedError }) => {
      it(description, async () => {
        if (!shouldFail) {
          const mockResponse = { id: 1, ...data };
          (mockService[config.serviceMethod] as jest.Mock).mockResolvedValueOnce(mockResponse);
        }

        const requestObj = {
          json: async () => data,
        } as any;

        const response = await POST(requestObj);
        const body = await response.json();

        if (shouldFail) {
          expect(response.status).toBe(400);
          expect(body.success).toBe(false);
          if (expectedError) {
            expect(body.responseObject).toHaveProperty(expectedError);
          }
        } else {
          expect(response.status).toBe(200);
          expect(body.success).toBe(true);
          expect(body.responseObject).toMatchObject(data);
        }
      });
    });
  });
});
