const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const attendance = require("./seeds/attendance");
const category = require("./seeds/category");
const day = require("./seeds/day");
const employeeType = require("./seeds/employee-type");
const gender = require("./seeds/gender");
const hours = require("./seeds/hour");
const incident = require("./seeds/incident");
const incidentStatus = require("./seeds/incident-status");
const locations = require("./seeds/location");
const requests = require("./seeds/request");
const requestStatus = require("./seeds/request-status");
const roles = require("./seeds/roles");
const statusEmployee = require("./seeds/status-employee");
const direccion = require("./seeds/direccion");
const secretaria = require("./seeds/secretaria");
const country = require("./seeds/country");
const state = require("./seeds/state");
const municipality = require("./seeds/municipality");
const identificationType = require("./seeds/identification-type");
const maritalStatus = require("./seeds/marital-status");
const occupation = require("./seeds/occupation");
const profession = require("./seeds/profession");
const schooling = require("./seeds/schooling");
const tradeUnion = require("./seeds/trade-union");
const employee = require("./seeds/employee");
const user = require("./seeds/user");
const modules = require("./seeds/modules");
const roleModules = require("./seeds/roleModules");
const incidentsRolesPermission = require("./seeds/incidents-roles-permissions");
const categoryEmployeeType = require("./seeds/category-employee-type");
const incidentRulesVacations = require("./seeds/incidentRulesVacations");
const holidays = require("./seeds/holiday");

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  await prisma.attendance.createMany({ data: attendance });
  await prisma.category.createMany({ data: category });
  await prisma.day.createMany({ data: day });
  await prisma.employeeType.createMany({ data: employeeType });
  await prisma.gender.createMany({ data: gender });
  await prisma.hour.createMany({ data: hours });
  await prisma.incident.createMany({ data: incident });
  await prisma.incidentStatus.createMany({ data: incidentStatus });
  await prisma.location.createMany({ data: locations });
  await prisma.request.createMany({ data: requests });
  await prisma.requestStatus.createMany({ data: requestStatus });
  await prisma.role.createMany({ data: roles });
  await prisma.statusEmployee.createMany({ data: statusEmployee });
  await prisma.secretaria.createMany({ data: secretaria });
  await prisma.direccion.createMany({ data: direccion });
  await prisma.country.createMany({ data: country });
  await prisma.state.createMany({ data: state });
  await prisma.municipality.createMany({ data: municipality });
  await prisma.identificationType.createMany({ data: identificationType });
  await prisma.maritalStatus.createMany({ data: maritalStatus });
  await prisma.occupation.createMany({ data: occupation });
  await prisma.profession.createMany({ data: profession });
  await prisma.schooling.createMany({ data: schooling });
  await prisma.tradeUnion.createMany({ data: tradeUnion });
  await prisma.incidentsRolesPermissions.createMany({ data: incidentsRolesPermission });
  await prisma.categoryEmployeeType.createMany({ data: categoryEmployeeType });
  await prisma.incidentRules.createMany({ data: incidentRulesVacations });
  await prisma.holiday.createMany({ data: holidays });

  await prisma.module.createMany({ data: modules });

  for (const rm of roleModules) {
    await prisma.roleModule.create({
      data: {
        role_id: rm.role_id,
        module_id: rm.module_id,
        can_view: rm.can_view ?? false,
        can_create: rm.can_create ?? false,
        can_edit: rm.can_edit ?? false,
        can_delete: rm.can_delete ?? false,
      },
    });
  }

  const hashedPassword = await bcrypt.hash("Password123", 10);

  const createdUser = await prisma.user.create({
    data: {
      ...user,
      password: hashedPassword,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  const createdEmployee = await prisma.employee.create({
    data: {
      ...employee,
      user_id: createdUser.id,
      created_at: new Date(),
      updated_at: new Date(),
      birthday: new Date(employee.birthday),
    },
  });

  await prisma.user.update({
    where: { id: createdUser.id },
    data: {
      employee_id: createdEmployee.id,
      updated_at: new Date(),
    },
  });

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
