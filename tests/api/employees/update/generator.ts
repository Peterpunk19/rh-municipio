import type { IEmployee } from "@/app/api/employees/interface";
import { HttpMessages } from "@/common/response/messages";
import type { IResponse } from "@/utils/types";

export const generator = {
  request: (overrides?: Partial<IEmployee>): IEmployee => ({
    numberEmployee: overrides?.numberEmployee ?? "000001",
    name: overrides?.name ?? "Enrique",
    paternalLastName: overrides?.paternalLastName ?? "Guillen",
    maternalLastName: overrides?.maternalLastName ?? "Alvarez",
    birthday: overrides?.birthday ?? "1991-12-14",
    genderId: overrides?.genderId !== undefined ? overrides?.genderId : 1,
    rfc: overrides?.rfc ?? "GUAR911214EF6",
    curp: overrides?.curp ?? "GUAR911214HCSLLF08",
    addressLine1: overrides?.addressLine1 ?? "Av mango",
    addressLine2: overrides?.addressLine2 ?? "218",
    addressLine3: overrides?.addressLine3 ?? "",
    addressLine4: overrides?.addressLine4 ?? "Chiapas solidario",
    postalCode: overrides?.postalCode ?? "29018",
    postalCodeSat: overrides?.postalCodeSat ?? "29018",
    municipalityId: overrides?.municipalityId !== undefined ? overrides?.municipalityId : 1,
    startJobDate: overrides?.startJobDate ?? "2025-01-01",
    endJobDate: overrides?.endJobDate ?? "2025-06-30",
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
  }),
  response: (overrides?: Partial<IResponse>): IResponse => ({
    success: overrides?.success ?? false,
    message: overrides?.message ?? HttpMessages.error.validationFields,
    responseObject: overrides?.responseObject ?? [],
    statusCode: overrides?.statusCode ?? 400,
  }),
};
