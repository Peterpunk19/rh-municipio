const { PrismaClient } = require("@prisma/client");

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
