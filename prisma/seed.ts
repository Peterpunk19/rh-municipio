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
const modules = require("./seeds/modules");
const roleModules = require("./seeds/roleModules");
const incidentsRolesPermission = require("./seeds/incidents-roles-permissions");
const requestsRolesPermissions = require("./seeds/requests-roles-permissions");
const categoryEmployeeType = require("./seeds/category-employee-type");
const incidentRules = require("./seeds/incident-rules");
const holidays = require("./seeds/holiday");
const jobSchedulesEmployees = require("./seeds/job-schedules-employees");
const { scheduleMappings } = require("./seeds/schedule-mappings");

const prisma = new PrismaClient();

const normalizeName = (displayName: string) => {
  return displayName
    .trim()
    .replace(/['"]/g, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "_");
};

const timeToHourName = (time: string) => {
  return time.replace(":", "_");
};

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
  await prisma.requestsRolesPermissions.createMany({ data: requestsRolesPermissions.allPermissions });
  await prisma.categoryEmployeeType.createMany({ data: categoryEmployeeType });
  await prisma.incidentRules.createMany({ data: incidentRules });
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

  for (const e of employee) {
    const hashedPassword = await bcrypt.hash(e.password ? e.password : String(e.numberEmployee), 10);

    if (!e.curp) continue;

    const createUser = await prisma.user.create({
      data: {
        username: e.curp,
        password: hashedPassword,
        active: true,
        created_at: new Date(),
        updated_at: new Date(),
        role: {
          connect: { id: e.roleId ? e.roleId : 3 },
        },
      },
    });

    let profession = null;
    if (e.professionCode) {
      profession = await prisma.profession.findUnique({
        where: { id: Number(e.professionCode) },
      });
    }

    const createEmployee = await prisma.employee.create({
      data: {
        number_employee: String(e.numberEmployee),
        name: e.name,
        paternal_last_name: e.paternalLastName,
        maternal_last_name: e.maternalLastName,
        birthday: new Date(e.birthday),
        rfc: e.rfc,
        curp: e.curp,
        status_employee: {
          connect: { id: 1 },
        },
        ...(e.genderId ? { gender: { connect: { id: Number(e.genderId) } } } : {}),
        user: {
          connect: {
            id: createUser.id,
          },
        },
        ...(e.maritalStatusId ? { marital_status: { connect: { id: Number(e.maritalStatusId) } } } : {}),
        ...(e.schoolingCode ? { schooling: { connect: { cve_code: e.schoolingCode } } } : {}),
        ...(profession ? { profession: { connect: { id: Number(e.professionCode) } } } : {}),
        ...(e.occupationId ? { occupation: { connect: { id: Number(e.occupationId) } } } : {}),
        ...(e.identificationTypeId ? { identification_type: { connect: { id: Number(e.identificationTypeId) } } } : {}),
        ...(e.identificationTypeId ? { identification_type: { connect: { id: Number(e.identificationTypeId) } } } : {}),
        identification_folio: e.identificationFolio,
      },
    });

    if (e.roleId === 3) {
      const categoryName = normalizeName(e.categoryDisplayName);
      const employeeTypeName = normalizeName(e.employeeTypeDisplayName);
      const direccionName = normalizeName(e.direccionDisplayName);

      let direccion = null;
      if (e.direccionDisplayName) {
        direccion = await prisma.direccion.findUnique({
          where: { name: direccionName },
        });
      }

      let municipality = null;
      if (e.municipalityCode) {
        municipality = await prisma.municipality.findFirst({
          where: {
            cve_code: String(e.municipalityCode),
          },
        });
      }

      await prisma.employeeAddress.create({
        data: {
          employee: { connect: { id: createEmployee.id } },
          address_line_1: e.addressLine1,
          address_line_2: e.addressLine2,
          address_line_3: e.addressLine3 ?? "",
          address_line_4: e.addressLine4,
          postal_code: e.postalCode,
          postal_code_sat: e.postalCodeSat,
          ...(municipality ? { municipality: { connect: { id: municipality.id } } } : {}),
          created_at: new Date(),
        },
      });

      await prisma.employeeHiring.create({
        data: {
          employee: { connect: { id: createEmployee.id } },
          start_job_date: new Date(e.startJobDate),
          end_job_date: e.endJobDate ? new Date(e.endJobDate) : null,
          ...(e.categoryDisplayName ? { category: { connect: { name: categoryName } } } : {}),
          ...(e.employeeTypeDisplayName ? { employee_type: { connect: { name: employeeTypeName } } } : {}),
          ...(direccion ? { direccion: { connect: { name: direccionName } } } : {}),
          created_at: new Date(),
        },
      });

      await prisma.employeeAscriptions.create({
        data: {
          employee: { connect: { id: createEmployee.id } },
          start_date: new Date(e.startJobDate),
          end_date: e.endJobDate ? new Date(e.endJobDate) : null,
          ...(direccion ? { direccion: { connect: { name: direccionName } } } : {}),
          created_by: { connect: { id: 1 } },
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      const schedule = jobSchedulesEmployees.find(
        (js: { numberEmployee: string }) => js.numberEmployee === String(e.numberEmployee),
      );

      if (schedule) {
        console.log(`Found schedule for employee ${e.numberEmployee}:`, schedule);

        if (schedule.locationId && schedule.locationId !== "0" && schedule.locationId !== 0) {
          try {
            await prisma.employeeLocation.create({
              data: {
                employee: { connect: { id: createEmployee.id } },
                location: { connect: { display_name: schedule.locationDisplayName } },
                active: true,
                created_by: 1, // Usuario administrador
                created_at: new Date(),
                updated_at: new Date(),
              },
            });
            console.log(`EmployeeLocation created for employee ${e.numberEmployee} at location ${schedule.locationId}`);
          } catch (error) {
            console.error(`Error creating EmployeeLocation for employee ${e.numberEmployee}:`, error);
          }
        } else {
          console.log(
            `Skipping EmployeeLocation for employee ${e.numberEmployee} - invalid locationId: ${schedule.locationId}`,
          );
        }

        if (schedule.attendanceId && schedule.attendanceId !== "" && schedule.attendanceId !== "0") {
          try {
            await prisma.employeeAttendanceType.create({
              data: {
                employee: { connect: { id: createEmployee.id } },
                attendance: { connect: { id: Number(schedule.attendanceId) } },
                active: true,
                created_by: { connect: { id: 1 } },
                created_at: new Date(),
                updated_at: new Date(),
              },
            });
            console.log(
              `EmployeeAttendanceType created for employee ${e.numberEmployee} with attendance ${schedule.attendanceId}`,
            );
          } catch (error) {
            console.error(`Error creating EmployeeAttendanceType for employee ${e.numberEmployee}:`, error);
          }

          // INSERTAR JOB SCHEDULE (solo si tiene jornada válida y horas válidas)
          if (
            schedule.jornada &&
            schedule.jornada.trim() !== "" &&
            schedule.checkin &&
            schedule.checkin.trim() !== "" &&
            schedule.checkin !== "00:00" &&
            schedule.checkout &&
            schedule.checkout.trim() !== "" &&
            schedule.checkout !== "00:00"
          ) {
            const jornadaMapping = scheduleMappings[schedule.jornada];

            if (!jornadaMapping) {
              console.log(`Jornada mapping not found: ${schedule.jornada}`);
            } else {
              console.log(`Processing jornada mapping for: ${schedule.jornada}`);

              // Procesar cada rango de días en la jornada
              for (const range of jornadaMapping) {
                try {
                  // Buscar los días en la base de datos
                  const startDay = await prisma.day.findUnique({
                    where: { name: range.start_day },
                  });

                  const endDay = await prisma.day.findUnique({
                    where: { name: range.end_day },
                  });

                  if (!startDay || !endDay) {
                    console.log(`Days not found for range: ${range.start_day} - ${range.end_day}`);
                    continue;
                  }

                  // Convertir y buscar las horas
                  const startHourName = timeToHourName(schedule.checkin);
                  const endHourName = timeToHourName(schedule.checkout);

                  const startHour = await prisma.hour.findUnique({
                    where: { name: startHourName },
                  });

                  const endHour = await prisma.hour.findUnique({
                    where: { name: endHourName },
                  });

                  if (!startHour || !endHour) {
                    console.log(`Hours not found: ${startHourName} or ${endHourName}`);
                    continue;
                  }

                  // Crear la jornada laboral en la base de datos
                  await prisma.jobScheduleEmployee.create({
                    data: {
                      employee: { connect: { id: createEmployee.id } },
                      name: `Jornada ${schedule.jornada} - ${e.numberEmployee}`,
                      description: `Jornada laboral migrada - ${schedule.FechaCambioOficio}`,
                      active: true,
                      start_day: { connect: { id: startDay.id } },
                      end_day: { connect: { id: endDay.id } },
                      start_hour: { connect: { id: startHour.id } },
                      end_hour: { connect: { id: endHour.id } },
                      created_at: new Date(),
                      updated_at: new Date(),
                    },
                  });

                  console.log(
                    `Job schedule created for employee ${e.numberEmployee}: ${range.start_day} to ${range.end_day}`,
                  );
                } catch (error) {
                  console.error(`Error creating job schedule for employee ${e.numberEmployee}:`, error);
                }
              }
            }
          }
        } else {
          console.log(
            `Skipping EmployeeAttendanceType for employee ${e.numberEmployee} - invalid attendanceId: ${schedule.attendanceId}`,
          );
        }
      }
    }

    await prisma.user.update({
      where: { id: createUser.id },
      data: {
        employee_id: createEmployee.id,
        updated_at: new Date(),
      },
    });
  }

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
