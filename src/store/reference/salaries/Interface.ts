import { IResponseObject as BaseIResponseObject } from "@/utils/types";

type BaseCatalogItem = {
  id: string | number;
  name?: string;
  display_name?: string;
};

export interface IResponseObject<T = BaseCatalogItem> extends Omit<BaseIResponseObject, "responseObject"> {
  responseObject: T[];
  success: boolean;
}

export interface ISalaryConfigState {
  values: {
    category_id: number | null;
    employee_type_id: number | null;
    salary: number | null;
    config_year_id: number | null;
  };
  errors: {
    category_id: string;
    employee_type_id: string;
    salary: string;
    config_year_id: string;
  };
  helperText: {
    salary: string;
  };
  catalogs: {
    categories: IResponseObject<ICategory>;
    employeeTypes: IResponseObject<IEmployeeType>;
    configYears: IResponseObject<IConfigYear>;
  };
  tableData: any[];
  selectedYear: number | null;
  loading: boolean;
  error: string | null;
}

export interface IEmployeeType {
  id: number | string;
  name: string;
  display_name: string;
}

export interface ICategory {
  id: number | string;
  name: string;
  display_name: string;
}

export interface IConfigYear {
  id: number;
  year: number;
  display_name: string | null;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}
