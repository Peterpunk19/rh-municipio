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
