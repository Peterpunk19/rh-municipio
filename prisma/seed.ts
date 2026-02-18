const { PrismaClient } = require("@prisma/client");

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
const modules = require("./seeds/modules");
const roleModules = require("./seeds/roleModules");
const incidentsRolesPermission = require("./seeds/incidents-roles-permissions");
const requestsRolesPermissions = require("./seeds/requests-roles-permissions");
const categoryEmployeeType = require("./seeds/category-employee-type");
const incidentRules = require("./seeds/incident-rules");
const holidays = require("./seeds/holiday");
const jobSchedulesEmployees = require("./seeds/job-schedules-employees");
const { scheduleMappings } = require("./seeds/schedule-mappings");
const configYear = require("./seeds/config-year");
const incapacityRule = require("./seeds/incapacity-rule");
const seedEmployeesOptimized = require("./seeds/employees.optimized");

const prisma = new PrismaClient();

async function main() {
  const employeesArg = process.argv.find((arg) => arg.startsWith("--employees="));
  let employeesCount = employeesArg ? parseInt(employeesArg.split("=")[1], 10) : 0;

  console.log(`Seeding ${employeesCount} employees...`);

  console.log("Start seeding...");

  await prisma.attendance.createMany({ data: attendance });
  const categoriesMap = await seedAndBuildMap({
    prismaModel: prisma.category,
    seedData: category,
    mapKey: "name",
  });
  const dayMap = await seedAndBuildMap({
    prismaModel: prisma.day,
    seedData: day,
    mapKey: "name",
  });
  await prisma.configYear.createMany({ data: configYear });
  await prisma.employeeType.createMany({ data: employeeType });
  const employeeTypesMap = await seedAndBuildMap({
    prismaModel: prisma.employeeType,
    seedData: employeeType,
    mapKey: "name",
  });
  await prisma.gender.createMany({ data: gender });
  await prisma.hour.createMany({ data: hours });
  const hourMap = await seedAndBuildMap({
    prismaModel: prisma.hour,
    seedData: hours,
    mapKey: "name",
  });
  await prisma.incident.createMany({ data: incident });
  await prisma.incidentStatus.createMany({ data: incidentStatus });
  const locationMap = await seedAndBuildMap({
    prismaModel: prisma.location,
    seedData: locations,
    mapKey: "name",
  });
  await prisma.request.createMany({ data: requests });
  await prisma.requestStatus.createMany({ data: requestStatus });
  await prisma.role.createMany({ data: roles });
  await prisma.statusEmployee.createMany({ data: statusEmployee });
  await prisma.secretaria.createMany({ data: secretaria });
  const direccionMap = await seedAndBuildMap({
    prismaModel: prisma.direccion,
    seedData: direccion,
    mapKey: "name",
  });
  await prisma.country.createMany({ data: country });
  await prisma.state.createMany({ data: state });
  const municipalityMap = await seedAndBuildMap({
    prismaModel: prisma.municipality,
    seedData: municipality,
    mapKey: "name",
  });
  await prisma.identificationType.createMany({ data: identificationType });
  await prisma.maritalStatus.createMany({ data: maritalStatus });
  await prisma.occupation.createMany({ data: occupation });
  const professionMap = await seedAndBuildMap({
    prismaModel: prisma.profession,
    seedData: profession,
    mapKey: "name",
  });
  await prisma.schooling.createMany({ data: schooling });
  await prisma.tradeUnion.createMany({ data: tradeUnion });
  const tradeUnionMap = await seedAndBuildMap({
    prismaModel: prisma.tradeUnion,
    seedData: tradeUnion,
    mapKey: "name",
  });
  await prisma.incidentsRolesPermissions.createMany({ data: incidentsRolesPermission });
  await prisma.requestsRolesPermissions.createMany({ data: requestsRolesPermissions.allPermissions });

  await prisma.categoryEmployeeType.createMany({ data: categoryEmployeeType });

  await prisma.incidentRules.createMany({ data: incidentRules });
  await prisma.holiday.createMany({ data: holidays });
  await prisma.incapacityRule.createMany({ data: incapacityRule });

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

  const limitedEmployees = employeesCount ? employee.slice(0, employeesCount) : employee;

  await seedEmployeesOptimized({
    prisma,
    employees: limitedEmployees,
    maps: {
      direccionMap,
      municipalityMap,
      professionMap,
      categoriesMap,
      employeeTypesMap,
      tradeUnionMap,
      hourMap,
      dayMap,
      locationMap,
    },
    jobSchedulesEmployees,
    scheduleMappings,
  });
}

async function seedAndBuildMap<T extends { [key: string]: any }>({
  prismaModel,
  seedData,
  mapKey,
}: {
  prismaModel: {
    createMany: (args: any) => Promise<any>;
    findMany: () => Promise<T[]>;
  };
  seedData: T[];
  mapKey: keyof T;
}): Promise<Record<string, T>> {
  await prismaModel.createMany({
    data: seedData,
    skipDuplicates: true,
  });

  const records = await prismaModel.findMany();

  return Object.fromEntries(
    records.filter((r) => r[mapKey] !== null && r[mapKey] !== undefined).map((r) => [String(r[mapKey]), r]),
  );
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
