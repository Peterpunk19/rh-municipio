import type { NextRequest } from "next/server";
import { handleHttpResponse } from "@/common/response/handler";
import { HttpResponse } from "@/common/response/model";
import { EmployeeService } from "@/app/api/services/employee.service";
import { HttpMessages } from "@/common/response/messages";
import type { IEmployee } from "@/app/api/employees/interface";
import { EmployeeTypeService } from "@/app/api/services/employeeType.service";
import { SchoolingService } from "@/app/api/services/schooling.service";
import { ProfessionService } from "@/app/api/services/profession.service";
import { OccupationService } from "@/app/api/services/occupation.service";
import { MunicipalityService } from "@/app/api/services/municipality.service";
import { LocationService } from "@/app/api/services/location.service";
import { CategoryService } from "@/app/api/services/category.service";
import { DireccionService } from "@/app/api/services/direccion.service";

async function mapToIEmployee(data: any): Promise<IEmployee> {
  const locationId = data.location_display_name
    ? await LocationService.getLocationByDisplayNameToImport(data.location_display_name)
    : null;
  const schoolingId = data.schooling_display_name
    ? await SchoolingService.getSchoolingByDisplayName(data.schooling_display_name)
    : null;
  const municipalityId = data.municipality_code
    ? await MunicipalityService.getMunicipalityByCveCode(String(data.municipality_code))
    : null;
  const categoryId = await CategoryService.getCategoryByDisplayName(data.category_display_name);
  const profesionId = data.profession_code
    ? await ProfessionService.getProfessionById(Number(data.profession_code))
    : null;
  const occupationId = data.occupation_code
    ? await OccupationService.getOccupationById(Number(data.occupation_code))
    : null;
  const direccionId = data.secretaria_display_name
    ? await DireccionService.getDireccionByDisplayNameToImport(data.secretaria_display_name)
    : null;
  const employeeTypeId = await EmployeeTypeService.getEmployeeTypeByDisplayName(data.employee_type_display_name);

  return {
    numberEmployee: String(data.number_employee),
    name: data.first_name,
    paternalLastName: data.paternal_last_name,
    maternalLastName: data.maternal_last_name,
    birthday: data.birthday ? new Date(data.birthday).toISOString() : null,
    rfc: data.rfc || "",
    curp: data.curp || "",
    addressLine1: data.address_line_1 || "",
    addressLine2: data.address_line_2 || "",
    addressLine3: data.address_line_3 || "",
    addressLine4: data.address_line_4 || "",
    postalCode: data.postal_code || "",
    postalCodeSat: data.postal_code_sat || "",
    municipalityId: municipalityId || "",
    genderId: data.gender_id,
    startJobDate: data.original_hire_date ? new Date(data.original_hire_date).toISOString() : new Date().toISOString(),
    endJobDate: data.employment_end_date ? new Date(data.employment_end_date).toISOString() : null,
    categoryId: categoryId,
    employeeTypeId: employeeTypeId,
    direccionId: direccionId,
    maritalStatusId: data.marital_status_id,
    schoolingId: schoolingId,
    professionId: profesionId,
    occupationId: occupationId,
    identificationTypeId: data.identification_type_id || null,
    identificationFolio: data.identification_folio || null,
    locationId: locationId,
    attendanceId: data.attendance_id,
  };
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  try {
    const createdEmployees: IEmployee[] = [];
    const errors: IEmployee[] = [];

    for (const employeeData of body) {
      const errorMessage = {
        curp: employeeData.curp,
      };

      const existingNumberEmployee = await EmployeeService.getByNumberEmployee(String(employeeData.number_employee));
      if (existingNumberEmployee) {
        errorMessage.success = false;
        errorMessage.message = `Ya existe un empleado con el numero de empelado: ${employeeData.number_employee}`;
        errors.push(errorMessage);
        continue;
      }

      const employeeMapped: IEmployee = await mapToIEmployee(employeeData);

      const existingEmployee = await EmployeeService.getEmployeeByRfcCurp(employeeMapped.rfc, employeeMapped.curp);

      if (!existingEmployee) {
        if (employeeMapped.numberEmployee == null || employeeMapped.numberEmployee === "") {
          employeeMapped.numberEmployee = await EmployeeService.getNumberEmployee();
        }

        console.log(employeeMapped);

        await EmployeeService.createEmployee(employeeMapped);
        employeeMapped.success = true;
        createdEmployees.push(employeeMapped);
      } else {
        errorMessage.success = false;
        errorMessage.message = `Ya existe un empleado con la curp: ${employeeMapped.curp} o rfc: ${employeeMapped.rfc}`;
        errors.push(errorMessage);
      }
    }

    const response = HttpResponse.success(HttpMessages.employee.createdSuccess, {
      createdEmployees,
      errors,
    });

    return handleHttpResponse(response);
  } catch (error: any) {
    console.log(error);

    const response = HttpResponse.internalServerError(HttpMessages.error.internalServerError, { error: error.message });

    return handleHttpResponse(response);
  }
}
