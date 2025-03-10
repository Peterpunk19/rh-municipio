import type { NextRequest } from "next/server";
import { handleHttpResponse } from "@/common/response/handler";
import { HttpResponse } from "@/common/response/model";
import { EmployeeService } from "@/app/api/services/employee.service";
import { HttpMessages } from "@/common/response/messages";
import type { IEmployee } from "@/app/api/employees/interface";
import { EmployeeTypeService } from "@/app/api/services/employeeType.service";
import { formatFolio, getRandomDate, getRandomNumber } from "@/common/utils";

function mapToIEmployee(data: any): IEmployee {
  const validateOrGenerateDate = (dateString: string): string => {
    const date = new Date(dateString);
    return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
  };

  return {
    numberEmployee: data.number_employee || "",
    name: data.first_name || "",
    paternalLastName: data.paternal_last_name || "",
    maternalLastName: data.maternal_last_name || "",
    birthday: validateOrGenerateDate(data.birthday || ""),
    rfc: data.rfc || "",
    curp: data.curp || "",
    addressLine1: "Calle",
    addressLine2: "250",
    addressLine3: "",
    addressLine4: "Teran",
    postalCode: "29000",
    postalCodeSat: "29000",
    municipalityId: getRandomNumber(81, 198),
    genderId: getRandomNumber(1, 3),
    startJobDate: getRandomDate(new Date("2000-01-01"), new Date("2025-01-01")),
    endJobDate: getRandomDate(new Date("2000-01-01"), new Date("2025-01-01")),
    categoryId: getRandomNumber(1, 193),
    employeeTypeName: "base_no_sindizalizado",
    direccionId: 1,
    maritalStatusId: 1,
    schoolingId: 1,
    professionId: 1,
    occupationId: 1,
    identificationTypeId: 1,
    identificationFolio: data.identification_folio || null,
  };
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  try {
    const createdEmployees: IEmployee[] = [];

    await Promise.all(
      body.map(async (employeeData: IEmployee) => {
        const employeeMapped: IEmployee = mapToIEmployee(employeeData);

        const existingEmployee = await EmployeeService.getEmployeeByRfcCurp(employeeMapped.rfc, employeeMapped.curp);

        if (!existingEmployee) {
          if (employeeMapped.numberEmployee == null || employeeMapped.numberEmployee === "") {
            employeeMapped.numberEmployee = await EmployeeService.getNumberEmployee();
          }

          employeeMapped.numberEmployee = formatFolio(Number(employeeMapped.numberEmployee));

          if (employeeMapped.curp == "") employeeMapped.curp = employeeMapped.rfc;

          const employeeType = await EmployeeTypeService.getEmployeeTypeByName(body.employeeTypeName);

          if (employeeType) {
            employeeMapped.employeeTypeId = employeeType.id;

            await EmployeeService.createEmployee(employeeMapped);

            createdEmployees.push(employeeMapped);
          } else {
            console.log("employeeType");
            console.log(employeeMapped);
          }
        } else {
          console.log("existingEmployee");
          console.log(employeeMapped);
        }
      }),
    );

    const response = HttpResponse.success(HttpMessages.employee.createdSuccess, {
      createdEmployees,
    });

    return handleHttpResponse(response);
  } catch (error: any) {
    console.log(error.message);

    const response = HttpResponse.internalServerError(HttpMessages.error.internalServerError, { error: error.message });

    return handleHttpResponse(response);
  }
}
