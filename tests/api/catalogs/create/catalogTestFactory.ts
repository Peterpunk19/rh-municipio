import {
  ICatalogCreate,
  IHolidayCreate,
  ISchoolingCreate,
  ICreateOccupation,
  IDireccionCreate,
} from "@/interfaces/Catalogs";

export interface CatalogTestConfig<T = ICatalogCreate> {
  catalogName: string;
  routePath: string;
  servicePath: string;
  serviceName: string;
  serviceMethod: string;
  baseData: T;
  validationTests: {
    emptyName: Partial<T>;
    emptyDisplayName: Partial<T>;
    longName?: Partial<T>;
    longDisplayName?: Partial<T>;
    additionalValidations?: Array<{
      description: string;
      data: Partial<T>;
      expectedError: string;
    }>;
  };
}

export const catalogTestConfigs: Record<string, CatalogTestConfig<any>> = {
  category: {
    catalogName: "category",
    routePath: "@/app/api/catalogs/category/route",
    servicePath: "@/app/api/services/category.service",
    serviceName: "CategoryService",
    serviceMethod: "createCategory",
    baseData: {
      name: "test_category",
      display_name: "Test Category",
      active: true,
    },
    validationTests: {
      emptyName: { name: "" },
      emptyDisplayName: { display_name: "" },
    },
  },

  holiday: {
    catalogName: "holiday",
    routePath: "@/app/api/catalogs/holiday/route",
    servicePath: "@/app/api/services/holiday.service",
    serviceName: "HolidayService",
    serviceMethod: "createHoliday",
    baseData: {
      name: "test_holiday",
      display_name: "Test Holiday",
      holiday_date: "2026-01-01",
      validation_date: "2026-01-01",
      active: true,
    } as IHolidayCreate,
    validationTests: {
      emptyName: { name: "" },
      emptyDisplayName: { display_name: "" },
      additionalValidations: [
        {
          description: "should return error for empty holiday_date",
          data: { holiday_date: "" },
          expectedError: "holiday_date",
        },
        {
          description: "should return error for empty validation_date",
          data: { validation_date: "" },
          expectedError: "validation_date",
        },
      ],
    },
  },

  schooling: {
    catalogName: "schooling",
    routePath: "@/app/api/catalogs/schooling/route",
    servicePath: "@/app/api/services/schooling.service",
    serviceName: "SchoolingService",
    serviceMethod: "createSchooling",
    baseData: {
      name: "test_schooling",
      display_name: "Test Schooling",
      cve_code: "SCH001",
      active: true,
    } as ISchoolingCreate,
    validationTests: {
      emptyName: { name: "" },
      emptyDisplayName: { display_name: "" },
      additionalValidations: [
        {
          description: "should return error for empty cve_code",
          data: { cve_code: "" },
          expectedError: "cve_code",
        },
      ],
    },
  },

  occupation: {
    catalogName: "occupation",
    routePath: "@/app/api/catalogs/occupation/route",
    servicePath: "@/app/api/services/occupation.service",
    serviceName: "OccupationService",
    serviceMethod: "createOccupation",
    baseData: {
      name: "test_occupation",
      display_name: "Test Occupation",
      cve_code: "OCC001",
      active: true,
    } as ICreateOccupation,
    validationTests: {
      emptyName: { name: "" },
      emptyDisplayName: { display_name: "" },
      additionalValidations: [
        {
          description: "should return error for empty cve_code",
          data: { cve_code: "" },
          expectedError: "cve_code",
        },
      ],
    },
  },

  direccion: {
    catalogName: "direccion",
    routePath: "@/app/api/catalogs/direcciones/route",
    servicePath: "@/app/api/services/direccion.service",
    serviceName: "DireccionService",
    serviceMethod: "createDireccion",
    baseData: {
      name: "test_direccion",
      display_name: "Test Direccion",
      secretaria_id: 1,
      active: true,
    } as IDireccionCreate,
    validationTests: {
      emptyName: { name: "" },
      emptyDisplayName: { display_name: "" },
      additionalValidations: [
        {
          description: "should return error for empty secretaria_id",
          data: { secretaria_id: 0 },
          expectedError: "secretaria_id",
        },
      ],
    },
  },

  location: {
    catalogName: "location",
    routePath: "@/app/api/catalogs/location/route",
    servicePath: "@/app/api/services/location.service",
    serviceName: "LocationService",
    serviceMethod: "createLocation",
    baseData: {
      name: "test_location",
      display_name: "Test Location",
      active: true,
    },
    validationTests: {
      emptyName: { name: "" },
      emptyDisplayName: { display_name: "" },
    },
  },

  "marital-status": {
    catalogName: "marital-status",
    routePath: "@/app/api/catalogs/marital-status/route",
    servicePath: "@/app/api/services/marital-status.service",
    serviceName: "MaritalStatusService",
    serviceMethod: "createMaritalStatus",
    baseData: {
      name: "test_marital",
      display_name: "Test Marital Status",
      active: true,
    },
    validationTests: {
      emptyName: { name: "" },
      emptyDisplayName: { display_name: "" },
    },
  },

  profession: {
    catalogName: "profession",
    routePath: "@/app/api/catalogs/profession/route",
    servicePath: "@/app/api/services/profession.service",
    serviceName: "ProfessionService",
    serviceMethod: "createProfession",
    baseData: {
      name: "test_profession",
      display_name: "Test Profession",
      active: true,
    },
    validationTests: {
      emptyName: { name: "" },
      emptyDisplayName: { display_name: "" },
    },
  },

  secretaria: {
    catalogName: "secretaria",
    routePath: "@/app/api/catalogs/secretarias/route",
    servicePath: "@/app/api/services/secretarias.service",
    serviceName: "SecretariaService",
    serviceMethod: "createSecretaria",
    baseData: {
      name: "test_secretaria",
      display_name: "Test Secretaria",
      active: true,
    },
    validationTests: {
      emptyName: { name: "" },
      emptyDisplayName: { display_name: "" },
    },
  },

  "trade-union": {
    catalogName: "trade-union",
    routePath: "@/app/api/catalogs/trade-union/route",
    servicePath: "@/app/api/services/trade-union.service",
    serviceName: "TradeUnionService",
    serviceMethod: "createTradeUnion",
    baseData: {
      name: "test_union",
      display_name: "Test Trade Union",
      active: true,
    },
    validationTests: {
      emptyName: { name: "" },
      emptyDisplayName: { display_name: "" },
    },
  },
};

export function generateCatalogTests<T = ICatalogCreate>(config: CatalogTestConfig<T>) {
  return {
    baseTests: [
      {
        description: "should return error for empty name",
        data: { ...config.baseData, ...config.validationTests.emptyName },
        shouldFail: true,
        expectedError: "name",
      },
      {
        description: "should return error for empty display_name",
        data: { ...config.baseData, ...config.validationTests.emptyDisplayName },
        shouldFail: true,
        expectedError: "display_name",
      },
      {
        description: "should successfully create with valid data",
        data: config.baseData,
        shouldFail: false,
      },
      {
        description: "should successfully create inactive catalog",
        data: { ...config.baseData, active: false },
        shouldFail: false,
      },
    ],
    additionalTests:
      config.validationTests.additionalValidations?.map((validation) => ({
        description: validation.description,
        data: { ...config.baseData, ...validation.data },
        shouldFail: true,
        expectedError: validation.expectedError,
      })) || [],
  };
}
