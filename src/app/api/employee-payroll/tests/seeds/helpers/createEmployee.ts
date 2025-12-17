import { prisma } from "@/lib/prisma";

import { v4 as uuidv4 } from "uuid";

export async function createEmployeeSeed({
  numberEmployee,
  name,
  attendanceType, // "digital_clock" | "attendance_list" | "intercalated"
  categoryId = 1,
  employeeTypeId = 1,
  direccionId = 1,
}: {
  numberEmployee: string;
  name: string;
  attendanceType: string;
  categoryId?: number;
  employeeTypeId?: number;
  direccionId?: number;
}) {
  console.log(numberEmployee);
  // 1. User
  const user = await prisma.user.create({
    data: {
      uuid: uuidv4(),
      username: numberEmployee,
      password: "123456",
      role_id: 3,
    },
  });

  // 2. Employee
  const employee = await prisma.employee.create({
    data: {
      number_employee: numberEmployee,
      name,
      paternal_last_name: "Test",
      maternal_last_name: "Seed",
      rfc: `${numberEmployee}RFC`,
      curp: `${numberEmployee}CURP`,
      user_id: user.id,
      status_employee_id: 1,
    },
  });

  // 3. Hiring
  await prisma.employeeHiring.create({
    data: {
      employee_id: employee.id,
      start_job_date: new Date("2021-01-01"),
      end_job_date: new Date("2030-01-01"),
      category_id: categoryId,
      employee_type_id: employeeTypeId,
      direccion_id: direccionId,
      active: true,
      created_at: new Date(),
    },
  });

  // 4. Ascriptions
  const ascription = await prisma.employeeAscriptions.create({
    data: {
      employee_id: employee.id,
      start_date: new Date("2021-01-01"),
      end_date: new Date("2030-01-01"),
      direccion_id: direccionId,
      created_by_id: 1,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  // 5. Location
  const location = await prisma.employeeLocation.create({
    data: {
      employee_id: employee.id,
      location_id: 1,
      created_by: 1,
    },
  });

  // 6. Attendance type
  const attendance = await prisma.attendance.findFirst({
    where: { name: attendanceType },
  });

  const employeeAttendanceType = await prisma.employeeAttendanceType.create({
    data: {
      employee_id: employee.id,
      attendance_id: attendance!.id,
      created_by_id: 1,
    },
  });

  return {
    employee,
    user,
    location,
    ascription,
    employeeAttendanceType,
  };
}
