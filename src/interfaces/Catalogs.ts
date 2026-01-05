import { NextRequest } from "next/server";
import { z } from "zod";

export interface ICatalogFilters {
  page: number | string | undefined;
  limit: number | string | undefined;
  search: string | null | undefined;
  year?: number | string | undefined;
  secretaria_id?: number | string | undefined;
  active?: number | string | undefined;
}

export interface CatalogCreateConfig<T = any> {
  request: NextRequest;
  createSchema: z.ZodTypeAny;
  serviceMethod: (data: T) => Promise<any>;
  message: {
    createdSuccess: string;
  };
}

export interface ICatalogCreate {
  name: string;
  display_name: string;
  active?: boolean;
}

export interface IHolidayCreate extends ICatalogCreate {
  holiday_date: string | Date;
  validation_date: string | Date;
}

export interface ISchoolingCreate extends ICatalogCreate {
  cve_code: string;
}

export interface ICreateOccupation extends ICatalogCreate {
  cve_code: string;
}

export interface IDireccionCreate extends ICatalogCreate {
  secretaria_id: number;
}
