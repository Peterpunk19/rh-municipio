import type { NextRequest } from "next/server";
import { handleHttpResponse } from "@/common/response/handler";
import { HttpResponse } from "@/common/response/model";
import { EmployeeService } from "@/app/api/services/employee.service";
import { HttpMessages } from "@/common/response/messages";
import type { IEmployee } from "@/app/api/employees/interface";
import { EmployeeTypeService } from "@/app/api/services/employeeType.service";
import { formatFolio, getRandomDate, getRandomNumber } from "@/common/utils";
import { LocationService } from "@/app/api/services/location.service";
import { CategoryService } from "@/app/api/services/category.service";

function getRandomDireccionId(): number {
  const validDireccionIds = [1, 2, 3, 4, 11, 15, 17, 18];
  const index = Math.floor(Math.random() * validDireccionIds.length);
  return validDireccionIds[index];
}

async function mapToIEmployee(data: any): Promise<IEmployee> {
  const validateOrGenerateDate = (dateString: string): string => {
    const date = new Date(dateString);
    return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
  };

  console.log("mapToIEmployee");
  console.log(data);

  const locationId = await LocationService.getLocationByDisplayNameToImport(data.location_display_name);
  const categoryId = await CategoryService.getCategoryByDisplayNameToImport(data.category_display_name);

  return {
    numberEmployee: data.number_employee || "",
    name: data.first_name || "",
    paternalLastName: data.paternal_last_name || "",
    maternalLastName: data.maternal_last_name || "",
    birthday: validateOrGenerateDate(data.birthday || ""),
    rfc: data.rfc || "",
    curp: data.curp || "",
    addressLine1: data.address_line_1 || "",
    addressLine2: data.address_line_2 || "",
    addressLine3: data.address_line_3 || "",
    addressLine4: data.address_line_4 || "",
    postalCode: data.postal_code || "",
    postalCodeSat: data.postal_code_sat || "",
    municipalityId: data.municipality_id || "",
    genderId: data.gender_id,
    startJobDate: new Date(data.employment_start_date).toISOString(),
    endJobDate: new Date(data.employment_end_date).toISOString(),
    categoryId: categoryId,
    employeeTypeName: "base_no_sindicalizado",
    employeeTypeId: data.employee_type_id,
    direccionId: getRandomDireccionId(),
    maritalStatusId: 1,
    schoolingId: getRandomNumber(1, 10),
    professionId: 110,
    occupationId: getRandomNumber(1, 20),
    identificationTypeId: 1,
    identificationFolio: data.identification_folio || null,
    locationId: locationId,
    attendanceId: data.attendance_id,
  };
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  try {
    const createdEmployees: IEmployee[] = [];

    await Promise.all(
      body.map(async (employeeData: IEmployee) => {
        const employeeMapped: IEmployee = await mapToIEmployee(employeeData);

        const existingEmployee = await EmployeeService.getEmployeeByRfcCurp(employeeMapped.rfc, employeeMapped.curp);

        if (!existingEmployee) {
          if (employeeMapped.numberEmployee == null || employeeMapped.numberEmployee === "") {
            employeeMapped.numberEmployee = await EmployeeService.getNumberEmployee();
          }

          console.log(employeeMapped);
          // if (employeeMappe  d.curp == "") employeeMapped.curp = employeeMapped.rfc;

          await EmployeeService.createEmployee(employeeMapped);
          employeeMapped.success = true;
          createdEmployees.push(employeeMapped);
        } else {
          console.log("existingEmployee");
          console.log(employeeMapped);
          employeeMapped.success = false;
          createdEmployees.push(employeeMapped);
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
