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
import { requests } from "./seeds/request";
import { requestStatus } from "./seeds/request-status";
import { roles } from "./seeds/roles";
import { statusEmployee } from "./seeds/status-employee";

const prisma = new PrismaClient();

async function rollback() {
  console.log("Rolling back seed data...");

  await prisma.attendance.deleteMany();
  await prisma.category.deleteMany();
  await prisma.day.deleteMany();
  await prisma.employeeType.deleteMany();
  await prisma.gender.deleteMany();
  await prisma.hour.deleteMany();
  await prisma.incident.deleteMany();
  await prisma.incidentStatus.deleteMany();
  await prisma.location.deleteMany();
  await prisma.payroll.deleteMany();
  await prisma.request.deleteMany();
  await prisma.requestStatus.deleteMany();
  await prisma.role.deleteMany();
  await prisma.statusEmployee.deleteMany();

  console.log("Rollback completed.");
}

rollback()
  .catch((e) => {
    console.error("Error during rollback:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
