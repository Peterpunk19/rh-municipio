import type { IEmployee } from "@/app/api/employees/interface";
import { HttpMessages } from "@/common/response/messages";
import type { IResponse } from "@/utils/types";

export const generator = {
  request: (overrides?: Partial<IEmployee>): IEmployee => ({
    numberEmployee: overrides?.numberEmployee ?? "107991",
    name: overrides?.name ?? "Carlos Ricardo",
    paternalLastName: overrides?.paternalLastName ?? "Roman",
    maternalLastName: overrides?.maternalLastName ?? "Aguilar",
    birthday: overrides?.birthday ?? "1992-10-19",
    genderId: overrides?.genderId !== undefined ? overrides?.genderId : 1,
    rfc: overrides?.rfc ?? "DIBP921019Q12",
    curp: overrides?.curp ?? "DIBP921019HDFZLD12",
    addressLine1: overrides?.addressLine1 ?? "calle",
    addressLine2: overrides?.addressLine2 ?? "250",
    addressLine3: overrides?.addressLine3 ?? "",
    addressLine4: overrides?.addressLine4 ?? "Terán",
    postalCode: overrides?.postalCode ?? "29050",
    postalCodeSat: overrides?.postalCodeSat ?? "29000",
    municipalityId: overrides?.municipalityId !== undefined ? overrides?.municipalityId : 1,
    startJobDate: overrides?.startJobDate ?? "2025-01-22",
    endJobDate: overrides?.endJobDate ?? "2025-11-22",
    categoryId: overrides?.categoryId !== undefined ? overrides?.categoryId : 1,
    employeeTypeName: overrides?.employeeTypeName !== undefined ? overrides?.employeeTypeName : "base_no_sindicalizado",
    direccionId: overrides?.direccionId !== undefined ? overrides?.direccionId : 1,
    maritalStatusId: overrides?.maritalStatusId !== undefined ? overrides?.maritalStatusId : 1,
    schoolingId: overrides?.schoolingId !== undefined ? overrides?.schoolingId : 1,
    professionId: overrides?.professionId !== undefined ? overrides?.professionId : 1,
    occupationId: overrides?.occupationId !== undefined ? overrides?.occupationId : 1,
    identificationTypeId: overrides?.identificationTypeId !== undefined ? overrides?.identificationTypeId : 1,
    identificationFolio:
    overrides?.identificationFolio !== undefined ? overrides?.identificationFolio : "0100230123123",
    stateId: overrides?.stateId !== undefined ? overrides?.stateId : 1,
    secretariaId: overrides?.secretariaId !== undefined ? overrides?.secretariaId : 1,
    id: overrides?.id !== undefined ? overrides?.id : 1,
    active: overrides?.active ?? true,
  }),
  response: (overrides?: Partial<IResponse>): IResponse => ({
    success: overrides?.success ?? false,
    message: overrides?.message ?? HttpMessages.error.validationFields,
    responseObject: overrides?.responseObject ?? [],
    statusCode: overrides?.statusCode ?? 400,
  }),
};
