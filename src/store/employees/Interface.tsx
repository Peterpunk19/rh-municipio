import { IResponseObject } from "@/utils/types";

export interface IEmployeeState {
  values: {
    name: string;
    paternalLastName: string;
    maternalLastName: string;
    birthday: string;
    rfc: string;
    curp: string;
    genderId: string;
    addressLine1: string;
    addressLine2: string;
    addressLine3: string;
    addressLine4: string;
    postalCode: string;
    postalCodeSat: string;
    stateId: string;
    municipalityId: string;
    startJobDate: string;
    endJobDate: string;
    categoryId: string;
    employeeTypeName: string;
    tradeUnionId: string;
    secretariaId: string;
    direccionId: string;
  };
  errors: {
    name: string;
    paternalLastName: string;
    maternalLastName: string;
    birthday: string;
    rfc: string;
    curp: string;
    genderId: string;
    addressLine1: string;
    addressLine2: string;
    addressLine3: string;
    addressLine4: string;
    postalCode: string;
    postalCodeSat: string;
    municipalityId: string;
    startJobDate: string;
    endJobDate: string;
    categoryId: string;
    employeeTypeName: string;
    tradeUnionId: string;
    secretariaId: string;
    direccionId: string;
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
