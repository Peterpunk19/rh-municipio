import { NextRequest } from "next/server";
import { handleHttpResponse } from "@/common/response/handler";
import { HttpResponse } from "@/common/response/model";
import { EmployeeService } from "@/app/api/services/employee.service";
import { HttpMessages } from "@/common/response/messages";
import { IEmployee } from "@/app/api/employees/interface";

function mapToIEmployee(data: any): IEmployee {
  const validateOrGenerateDate = (dateString: string): string => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
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
    postalCode: "29000",
    postalCodeSat: "29000",
    municipalityId: 81,
    genderId: data.gender_id ? Number(data.gender_id) : null,
    startJobDate: new Date().toISOString(),
    endJobDate: new Date().toISOString(),
    categoryId: 1,
    employeeTypeId: 1,
    direccionId: 1,
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
          console.log(employeeMapped);
          if (employeeMapped.numberEmployee == null)
            employeeMapped.numberEmployee = await EmployeeService.getNumberEmployee();
          if (employeeMapped.curp == "") employeeMapped.curp = employeeMapped.rfc;

          const [employee] = await EmployeeService.createEmployee(employeeMapped);
          createdEmployees.push(employee);
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
