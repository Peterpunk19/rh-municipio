import { IResponseObject } from "@/utils/types";

export interface IUserState {
  values: {
    name: string;
    paternalLastName: string;
    maternalLastName: string;
  };
  errors: {
    name: string;
    paternalLastName: string;
    maternalLastName: string;
  };
  helperText: {
    categoryId: string;
  };
  catalogs: {
    municipalities: IResponseObject | null;
    direcciones: IResponseObject | null;
    categories: any | null;
  };
}
