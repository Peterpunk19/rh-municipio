import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

function generateDynamicNumberEmployee() {
  return Date.now().toString();
}

function generateDynamicUsername(roleName: string) {
  return `${roleName}_${Date.now()}`;
}

export async function createUserWithRole(
  roleName: "admin" | "enlace" | "empleado",
  attendanceType: "digital_clock" | "attendance_list" | "intercalated",
  categoryId = 1,
  employeeTypeId = 1,
  direccionId = 1,
) {
  const hashedPassword = await bcrypt.hash("123456", 10);

  const role = await prisma.role.findFirst({
    where: { name: roleName },
  });

  if (!role) throw new Error("Role not found");

  const numberEmployee = generateDynamicNumberEmployee();
  const username = generateDynamicUsername(role.display_name);

  const user = await prisma.user.create({
    data: {
      uuid: uuidv4(),
      username: username.toLowerCase().trim(),
      password: hashedPassword,
      role_id: role.id,
    },
  });

  const employee = await prisma.employee.create({
    data: {
      user_id: user.id,
      name: `${roleName} TEST`,
      number_employee: numberEmployee.toString(),
      paternal_last_name: "Test",
      maternal_last_name: "Seed",
      rfc: `${numberEmployee}RFC`,
      curp: `${numberEmployee}CURP`,
      status_employee_id: 1,
    },
  });

  await prisma.user.update({
    where: { id: user.id },
    data: {
      employee_id: employee.id,
      updated_at: new Date(),
    },
  });

  if (roleName === "empleado") {
    const employeeHiringId = await prisma.employeeHiring.create({
      data: {
        employee_id: employee.id,
        start_job_date: new Date("2021-01-01"),
        end_job_date: new Date("2030-01-01"),
        category_id: categoryId,
        employee_type_id: employeeTypeId,
        active: true,
        created_at: new Date(),
      },
    });

    await prisma.employeeAscriptions.create({
      data: {
        employee_id: employee.id,
        employee_hiring_id: employeeHiringId.id,
        start_date: new Date("2021-01-01"),
        end_date: new Date("2030-01-01"),
        direccion_id: direccionId,
        created_by_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    await prisma.employeeLocation.create({
      data: {
        employee_id: employee.id,
        location_id: 1,
        created_by: 1,
      },
    });

    const attendance = await prisma.attendance.findFirst({
      where: { name: attendanceType },
    });

    await prisma.employeeAttendanceType.create({
      data: {
        employee_id: employee.id,
        attendance_id: attendance!.id,
        created_by_id: 1,
      },
    });
  }

  return {
    userId: user.id,
    id: employee.id,
    username,
    roleId: role.id,
  };
}
