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
const configYear = require("./seeds/config-year");
const incapacityRule = require("./seeds/incapacity-rule");

const prisma = new PrismaClient();

const normalizeName = (displayName: string) => {
  if (displayName === undefined) return "";
  return displayName
    .trim()
    .replace(/['".(),`´]/g, "") // quita ' " . ( ) , ` ´
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quita acentos combinados
    .toLowerCase()
    .replace(/\s+/g, "_");
};

const normalizeCategoryName = (displayName: string) => {
  return (
    displayName
      .trim()
      // expandir abreviaturas ANTES de limpiar comillas
      .replace(/\b(ALBAÑILPENS\.?)\b/gi, "ALBAÑIL")
      .replace(/\b(ELECTROMEC\.?)\b/gi, "ELECTROMECANICO ")
      .replace(/\b(OF\.?)\b/gi, "OFICIAL ")
      .replace(/\b(OPER\.?)\b/gi, "OPERADOR ")
      .replace(/\b(ADMVO\.?)\b/gi, "ADMINISTRATIVO ")
      .replace(/\b(ESP\.?)\b/gi, "ESPECIALIZADO ")
      .replace(/\b(ESPEC\.?)\b/gi, "ESPECIALIZADO ")
      .replace(/\b(AUX\.?)\b/gi, "AUXILIAR ")
      .replace(/\b(TEC\.?)\b/gi, "TECNICO ")
      .replace(/\b(EJEC\.?)\b/gi, "EJECUTIVA ")
      .replace(/\b(AYUD\.?)\b/gi, "AYUDANTE ")
      .replace(/\b(SEC\.?)\b/gi, "SECRETARIA ")
      // quitar variantes de "PENSIONADO"
      .replace(/\b(pens(?:ion\w*|i\w*|\.?)?|pns\.?)\b/gi, "")
      .replace(/\b(pesionado?)\b/gi, "")
      .replace(/\b(pen)\b/gi, "")
      // limpiar caracteres extraños
      .replace(/['".(),`´]/g, " ")
      // normalizar acentos
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      // bajar a minúsculas
      .toLowerCase()
      // colapsar espacios múltiples
      .replace(/\s+/g, "_")
      // quitar guiones bajos sobrantes
      .replace(/^_+|_+$/g, "")
  );
};

const timeToHourName = (time: string) => {
  return time.replace(":", "_");
};

interface Reference {
  id: number;
  name: string;
}

async function main() {
  const employeesArg = process.argv.find((arg) => arg.startsWith("--employees="));
  let employeesCount = employeesArg ? parseInt(employeesArg.split("=")[1], 10) : 0;

  console.log(`Seeding ${employeesCount} employees...`);

  console.log("Start seeding...");

  await prisma.attendance.createMany({ data: attendance });
  await prisma.category.createMany({ data: category });
  await prisma.day.createMany({ data: day });
  await prisma.configYear.createMany({ data: configYear });
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

  const direcciones = await prisma.direccion.findMany();
  const direccionMap = Object.fromEntries(direcciones.map((d: Reference) => [d.name, d]));

  const municipalities = await prisma.municipality.findMany();
  const municipalityMap = Object.fromEntries(
    municipalities.map((m: { id: number; cve_code: string }) => [m.cve_code, m]),
  );

  const professions = await prisma.profession.findMany();
  const professionMap = Object.fromEntries(professions.map((p: Reference) => [String(p.id), p]));

  const categories = await prisma.category.findMany();
  const categoriesMap = Object.fromEntries(categories.map((c: Reference) => [c.name, c]));

  const employeeTypes = await prisma.employeeType.findMany();
  const employeeTypesMap = Object.fromEntries(employeeTypes.map((e: Reference) => [e.name, e]));

  const hoursDB = await prisma.hour.findMany();
  const hourMap = Object.fromEntries(hoursDB.map((h: Reference) => [h.name, h]));

  const daysDB = await prisma.day.findMany();
  const dayMap = Object.fromEntries(daysDB.map((d: Reference) => [d.name, d]));

  const tradeUnionDB = await prisma.tradeUnion.findMany();
  const tradeUnionMap = Object.fromEntries(tradeUnionDB.map((t: Reference) => [t.name, t]));

  const direccionesNotFound = new Set();
  const categoriesNotFound = new Set();
  const employeesDuplicated = new Set();
  const limitedEmployees = employeesCount ? employee.slice(0, employeesCount) : employee;

  for (const e of limitedEmployees) {
    const hashedPassword = await bcrypt.hash(e.password ? e.password : String(e.numberEmployee), 10);

    if (!e.curp) continue;

    const validateCurp = await prisma.user.findUnique({
      where: {
        username: e.curp,
      },
    });

    if (validateCurp) continue;

    let createUser;
    try {
      createUser = await prisma.user.create({
        data: {
          username: e.curp,
          password: hashedPassword,
          active: true,
          created_at: new Date(),
          updated_at: new Date(),
          role: {
            connect: { id: e.roleId ? Number(e.roleId) : 3 },
          },
        },
      });
    } catch (error) {
      console.error(`Error creating user for ${e.numberEmployee}:`, error);
    }

    const profession = e.professionCode ? professionMap[String(e.professionCode)] : null;
    if (e.professionCode && !profession) {
      console.log(`Profession Code ${e.professionCode} - not found for Employee ${e.numberEmployee}`);
    }

    const tradeUnionName = normalizeName(e.tradeUnionDisplayName);
    const tradeUnion = e.tradeUnionDisplayName ? tradeUnionMap[tradeUnionName] : null;

    let createEmployee;
    try {
      createEmployee = await prisma.employee.create({
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
          ...(e.identificationTypeId
            ? { identification_type: { connect: { id: Number(e.identificationTypeId) } } }
            : {}),
          ...(e.identificationTypeId
            ? { identification_type: { connect: { id: Number(e.identificationTypeId) } } }
            : {}),
          ...(tradeUnion ? { trade_union_id: tradeUnion.id } : {}),
          identification_folio: e.identificationFolio,
        },
      });

      console.log(`Employee created with number: ${e.numberEmployee}`);
    } catch (error) {
      console.error(`Error creating employee for ${e.numberEmployee}:`, error);
      employeesDuplicated.add(e.numberEmployee);
      continue;
    }

    if (Number(e.roleId) === 3) {
      const direccionName = normalizeName(e.direccionDisplayName);
      const direccionObj = e.direccionDisplayName ? direccionMap[direccionName] : null;
      const municipalityObj = e.municipalityCode ? municipalityMap[String(e.municipalityCode)] : null;

      const categoryName = normalizeCategoryName(e.categoryDisplayName);
      const categoryObj = e.categoryDisplayName ? categoriesMap[categoryName] : null;

      const employeeTypeName = normalizeName(e.employeeTypeDisplayName);
      const employeeTypeObj = e.employeeTypeDisplayName ? employeeTypesMap[employeeTypeName] : null;

      if (e.categoryDisplayName && !categoryObj) {
        categoriesNotFound.add(e.categoryDisplayName);
        console.log(
          `CategoryDisplayName: ${e.categoryDisplayName} name: ${categoryName} - not found for Employee with Number: ${e.numberEmployee}`,
        );
      }

      if (e.employeeTypeDisplayName && !employeeTypeObj) {
        console.log(
          `EmployeeTypeDisplayName: ${e.employeeTypeDisplayName} - not found for Employee with Number: ${e.numberEmployee}`,
        );
      }

      if (e.direccionDisplayName && !direccionObj) {
        direccionesNotFound.add(e.direccionDisplayName);
        console.log(
          `DireccionDisplayName: ${e.direccionDisplayName} - not found for Employee with Number: ${e.numberEmployee}`,
        );
      }

      if (e.municipalityCode && !municipalityObj) {
        console.log(`Municipality Code ${e.municipalityCode} - not found for Employee ${e.numberEmployee}`);
      }

      try {
        await prisma.employeeAddress.create({
          data: {
            employee: { connect: { id: createEmployee.id } },
            address_line_1: e.addressLine1,
            address_line_2: e.addressLine2,
            address_line_3: e.addressLine3 ?? "",
            address_line_4: e.addressLine4,
            postal_code: e.postalCode,
            postal_code_sat: e.postalCodeSat,
            ...(municipalityObj ? { municipality: { connect: { id: municipalityObj.id } } } : {}),
            created_at: new Date(),
          },
        });
      } catch (error) {
        console.error(`Error creating employee address for ${e.numberEmployee}:`, error);
      }

      if (tradeUnion) {
        try {
          await prisma.employeeTradeUnion.create({
            data: {
              employee: { connect: { id: createEmployee.id } },
              trade_union: { connect: { id: tradeUnion.id } },
              created_at: new Date(),
            },
          });
        } catch (error) {
          console.error(`Error creating employee trade union for ${e.numberEmployee}:`, error);
        }
      }

      try {
        await prisma.employeeHiring.create({
          data: {
            employee: { connect: { id: createEmployee.id } },
            start_job_date: new Date(e.startJobDate),
            end_job_date: e.endJobDate ? new Date(e.endJobDate) : null,
            ...(categoryObj ? { category: { connect: { name: categoryName } } } : {}),
            ...(employeeTypeObj ? { employee_type: { connect: { name: employeeTypeName } } } : {}),
            ...(direccionObj ? { direccion: { connect: { name: direccionName } } } : {}),
            created_at: new Date(),
          },
        });
      } catch (error) {
        console.error(`Error creating employee hiring for ${e.numberEmployee}:`, error);
      }
      try {
        await prisma.employeeAscriptions.create({
          data: {
            employee: { connect: { id: createEmployee.id } },
            start_date: new Date(e.startJobDate),
            end_date: e.endJobDate ? new Date(e.endJobDate) : null,
            ...(direccionObj ? { direccion: { connect: { name: direccionName } } } : {}),
            created_by: { connect: { id: 1 } },
            created_at: new Date(),
            updated_at: new Date(),
          },
        });
      } catch (error) {
        console.error(`Error creating employee ascriptions for ${e.numberEmployee}:`, error);
      }

      const schedule = jobSchedulesEmployees.find(
        (js: { numberEmployee: string }) => js.numberEmployee === String(e.numberEmployee),
      );

      if (schedule) {
        if (schedule.locationDisplayName && schedule.locationDisplayName !== "") {
          try {
            await prisma.employeeLocation.create({
              data: {
                employee: { connect: { id: createEmployee.id } },
                location: { connect: { display_name: schedule.locationDisplayName } },
                active: true,
                created_by: 1,
                created_at: new Date(),
                updated_at: new Date(),
              },
            });
          } catch (error) {
            console.error(`Error creating EmployeeLocation for employee ${e.numberEmployee}:`, error);
          }
        }

        const attendanceType =
          schedule.jornada === "Intercalados" || schedule.jornada === "Intercalado Nocturno"
            ? 6
            : Number(schedule.attendanceId);

        if (schedule.attendanceId && schedule.attendanceId !== "" && schedule.attendanceId !== "0") {
          try {
            await prisma.employeeAttendanceType.create({
              data: {
                employee: { connect: { id: createEmployee.id } },
                attendance: { connect: { id: attendanceType } },
                active: true,
                created_by: { connect: { id: 1 } },
                created_at: new Date(),
                updated_at: new Date(),
              },
            });
          } catch (error) {
            console.error(`Error creating EmployeeAttendanceType for employee ${e.numberEmployee}:`, error);
          }

          if (
            attendanceType !== 6 &&
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
              // Procesar cada rango de días en la jornada
              for (const range of jornadaMapping) {
                try {
                  // Buscar los días en la base de datos
                  const startDayObj = range.start_day ? dayMap[String(range.start_day)] : null;
                  const endDayObj = range.end_day ? dayMap[String(range.end_day)] : null;

                  if (!startDayObj || !endDayObj) {
                    console.log(`Days not found for range: ${range.start_day} - ${range.end_day}`);
                    continue;
                  }

                  // Convertir y buscar las horas
                  const startHourName = timeToHourName(schedule.checkin);
                  const endHourName = timeToHourName(schedule.checkout);

                  const startHourObj = startHourName ? hourMap[String(startHourName)] : null;
                  const endHourObj = endHourName ? hourMap[String(endHourName)] : null;

                  if (!startHourObj || !endHourObj) {
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
                      start_day: { connect: { id: startDayObj.id } },
                      end_day: { connect: { id: endDayObj.id } },
                      start_hour: { connect: { id: startHourObj.id } },
                      end_hour: { connect: { id: endHourObj.id } },
                      created_at: new Date(),
                      updated_at: new Date(),
                    },
                  });
                } catch (error) {
                  console.error(`Error creating job schedule for employee ${e.numberEmployee}:`, error);
                }
              }
            }
          }
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
  console.log("direccionesNotFound");
  console.log(direccionesNotFound);
  console.log(categoriesNotFound);
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
