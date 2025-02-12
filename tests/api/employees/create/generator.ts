import { IEmployee } from "@/app/api/employees/interface";
import { HttpMessages } from "@/common/response/messages";
import { IResponse } from "@/utils/types";

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
    employeeTypeId: overrides?.employeeTypeId !== undefined ? overrides?.employeeTypeId : 1,
    direccionId: overrides?.direccionId !== undefined ? overrides?.direccionId : 1,
  }),
  response: (overrides?: Partial<IResponse>): IResponse => ({
    success: overrides?.success ?? false,
    message: overrides?.message ?? HttpMessages.error.validationFields,
    responseObject: overrides?.responseObject ?? [],
    statusCode: overrides?.statusCode ?? 400,
  }),
};
