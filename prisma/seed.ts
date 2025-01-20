import { PrismaClient } from "@prisma/client";
import { attendance } from "./seeds/attendance";
import { category } from "./seeds/category";
import { day } from "./seeds/day";
import { employeeType } from "./seeds/employee-type";
import { gender } from "./seeds/gender";
import { hours } from "./seeds/hour";
import { incident } from "./seeds/incident";
import { incidentStatus } from "./seeds/incident-status";
import { location } from "./seeds/location";
import { payroll } from "./seeds/payroll";
import { requests } from "./seeds/request";
import { requestStatus } from "./seeds/request-status";
import { roles } from "./seeds/roles";
import { statusEmployee } from "./seeds/status-employee";

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
  await prisma.location.createMany({ data: location });
  await prisma.payroll.createMany({ data: payroll });
  await prisma.request.createMany({ data: requests });
  await prisma.requestStatus.createMany({ data: requestStatus });
  await prisma.role.createMany({ data: roles });
  await prisma.statusEmployee.createMany({ data: statusEmployee });
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
