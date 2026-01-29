const bcrypt = require("bcryptjs");
const pLimit = require("p-limit").default;
const limit = pLimit(4); // 2–4 suele ser ideal

const normalizeName = (displayName) => {
  if (displayName === undefined) return "";
  return displayName
    .trim()
    .replace(/['".(),`´-]/g, "") // quita ' " . ( ) , ` ´
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quita acentos combinados
    .toLowerCase()
    .replace(/\s+/g, "_");
};

const timeToHourName = (time) => {
  return time.replace(":", "_");
};

const direccionAliases = {
  // legacy => BD
  coordinacion_de_politica_fiscal: "coordinacion_general_de_politica_fiscal",
  direccion_de_mercados: "direccion_de_mercados_y_panteones",
};

const professionAliases = {
  // legacy => BD
  375: "162",
  178: "162",
  582: "162",
  580: "162",
  585: "162",
  577: "162",
  576: "162",
  575: "162",
  348: "162",
  581: "162",
  311: "162",
  584: "162",
  186: "162",
  339: "162",
  578: "162",
  586: "162",
  574: "162",
  371: "162",
};

const normalizeCategoryName = (displayName) => {
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

const normalizeCache = new Map();

function chunkArray(arr, size) {
  const res = [];
  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size));
  }
  return res;
}

const CHUNK = 500;
const now = new Date();

module.exports = async function seedEmployeesOptimized({
  prisma,
  employees,
  maps,
  jobSchedulesEmployees,
  scheduleMappings,
}) {
  const {
    direccionMap,
    municipalityMap,
    professionMap,
    categoriesMap,
    employeeTypesMap,
    tradeUnionMap,
    hourMap,
    dayMap,
    locationMap,
  } = maps;
  console.log("👷 Seeding employees (optimized, safe mode)");

  /* =========================
       1️⃣ Detect existing USERS
    ========================= */

  const curps = employees.map((e) => e.curp).filter(Boolean);

  const existingUsers = await prisma.user.findMany({
    where: { username: { in: curps } },
    select: { id: true, username: true },
  });

  const userByCurp = new Map(existingUsers.map((u) => [u.username, u]));

  /* =========================
       2️⃣ Create missing USERS
    ========================= */

  const usersToCreate = await Promise.all(
    employees
      .filter((e) => e.curp && !userByCurp.has(e.curp))
      .map((e) =>
        limit(async () => ({
          username: e.curp,
          password: await bcrypt.hash(e.password ?? String(e.numberEmployee), 10),
          active: true,
          role_id: e.roleId ? Number(e.roleId) : 3,
          created_at: now,
          updated_at: now,
        })),
      ),
  );

  if (usersToCreate.length) {
    await prisma.user.createMany({
      data: usersToCreate,
      skipDuplicates: true,
    });
  }

  /* =========================
       3️⃣ Reload USERS map
    ========================= */

  const users = await prisma.user.findMany({
    where: { username: { in: curps } },
    select: { id: true, username: true },
  });

  const userIdByCurp = new Map(users.map((u) => [u.username, u.id]));

  /* =========================
       5️⃣ Main loop (SAFE)
    ========================= */

  const employeesToInsert = [];

  for (const e of employees) {
    if (!e.curp) continue;

    const userId = userIdByCurp.get(e.curp);
    if (!userId) continue;

    const resolvedProfessionCode = professionAliases[e.professionCode] ?? e.professionCode;

    const professionId = resolvedProfessionCode ? professionMap[String(resolvedProfessionCode)]?.id : null;

    employeesToInsert.push({
      number_employee: String(e.numberEmployee),
      name: e.name,
      paternal_last_name: e.paternalLastName,
      maternal_last_name: e.maternalLastName,
      birthday: e.birthday ? new Date(e.birthday) : null,
      rfc: e.rfc,
      curp: e.curp,
      status_employee_id: 1,
      gender_id: e.genderId ? Number(e.genderId) : null,
      marital_status_id: e.maritalStatusId ? Number(e.maritalStatusId) : null,
      profession_id: professionId,
      occupation_id: e.occupationId ?? null,
      identification_type_id: e.identificationTypeId ? Number(e.identificationTypeId) : null,
      identification_folio: e.identificationFolio,
      trade_union_id: tradeUnionMap[normalizeName(e.tradeUnionDisplayName)]?.id ?? null,
      user_id: userId,
      active: true,
    });
  }

  for (const batch of chunkArray(employeesToInsert, CHUNK)) {
    await prisma.employee.createMany({
      data: batch,
      skipDuplicates: true,
    });
  }

  const dbEmployees = await prisma.employee.findMany({
    where: {
      number_employee: { in: employees.map((e) => String(e.numberEmployee)) },
    },
    select: { id: true, number_employee: true, curp: true },
  });

  const employeeByNumber = new Map(dbEmployees.map((e) => [e.number_employee, e]));

  const normalizedEmployees = employees.map((e) => ({
    ...e,
    _direccionKey: e.direccionDisplayName ? normalizeName(e.direccionDisplayName) : null,
    _municipalityKey: e.municipalityCode ? String(e.municipalityCode) : null,
    _employeeTypeKey: e.employeeTypeDisplayName ? normalizeName(e.employeeTypeDisplayName) : null,
    _categoryKey: e.categoryDisplayName ? normalizeCategoryName(e.categoryDisplayName) : null,
    _tradeUnionKey: e.tradeUnionDisplayName ? normalizeName(e.tradeUnionDisplayName) : null,
  }));

  const addresses = [];
  const tradeUnions = [];
  const hirings = [];
  const ascriptions = [];
  const userLinks = [];
  const employeeLocations = [];
  const employeeAttendanceTypes = [];
  const jobSchedules = [];
  const locationStats = {
    noSchedule: [],
    noLocationName: [],
    locationNotFound: [],
  };

  const scheduleByEmployeeNumber = new Map(jobSchedulesEmployees.map((js) => [String(js.numberEmployee), js]));

  for (const e of normalizedEmployees) {
    const userId = userIdByCurp.get(e.curp);
    const employee = employeeByNumber.get(String(e.numberEmployee));
    if (!employee) continue;

    /* ---------- USER LINK (update después) ---------- */

    const employeeId = employee.id;

    if (userId) {
      userLinks.push({ userId, employeeId });
    }
    if (Number(e.roleId) !== 3) continue;

    /* ---------- ADDRESS ---------- */
    if (e.addressLine1 || e.postalCode) {
      addresses.push({
        employee_id: employeeId,
        address_line_1: e.addressLine1,
        address_line_2: e.addressLine2,
        address_line_3: e.addressLine3 ?? "",
        address_line_4: e.addressLine4,
        postal_code: e.postalCode,
        postal_code_sat: e.postalCodeSat,
        municipality_id: municipalityMap[e._municipalityKey]?.id ?? null,
        created_at: now,
      });
    }

    /* ---------- TRADE UNION ---------- */
    if (e._tradeUnionKey && tradeUnionMap[e._tradeUnionKey]) {
      tradeUnions.push({
        employee_id: employeeId,
        trade_union_id: tradeUnionMap[e._tradeUnionKey].id,
        created_at: now,
      });
    }

    /* ---------- HIRING + ASCRIPTION ---------- */
    if (e.startJobDate) {
      const resolvedDireccionName = direccionAliases[e._direccionKey] ?? e._direccionKey;

      const direccionId = resolvedDireccionName ? direccionMap[resolvedDireccionName]?.id : null;

      hirings.push({
        employee_id: employeeId,
        start_job_date: new Date(e.startJobDate),
        end_job_date: e.endJobDate ? new Date(e.endJobDate) : null,
        category_id: categoriesMap[e._categoryKey]?.id ?? null,
        employee_type_id: employeeTypesMap[e._employeeTypeKey]?.id ?? null,
        direccion_id: direccionId,
        created_at: now,
      });

      ascriptions.push({
        employee_id: employeeId,
        start_date: new Date(e.startJobDate),
        end_date: e.endJobDate ? new Date(e.endJobDate) : null,
        direccion_id: direccionId,
        created_by_id: 1,
        created_at: now,
        updated_at: now,
      });
    }

    const schedule = scheduleByEmployeeNumber.get(String(e.numberEmployee));

    if (!schedule) {
      locationStats.noSchedule.push(e.numberEmployee);
      continue;
    }

    /* ---------- LOCATION ---------- */
    if (!schedule.locationDisplayName?.trim()) {
      locationStats.noLocationName.push(e.numberEmployee);
    } else {
      const rawLocation = schedule.locationDisplayName.trim();
      const _locationKey = normalizeName(rawLocation);
      const location = locationMap[_locationKey];

      if (!location) {
        locationStats.locationNotFound.push({
          employee: e.numberEmployee,
          rawLocation,
          normalized: _locationKey,
        });
      } else {
        employeeLocations.push({
          employee_id: employeeId,
          location_id: location.id, // 🔒 garantizado
          active: true,
          created_by: 1,
          created_at: now,
          updated_at: now,
        });
      }
    }

    /* ---------- ATTENDANCE TYPE ---------- */
    if (schedule.attendanceId && schedule.attendanceId !== "0") {
      const attendanceType =
        schedule.jornada === "Intercalados" || schedule.jornada === "Intercalado Nocturno"
          ? 6
          : Number(schedule.attendanceId);

      employeeAttendanceTypes.push({
        employee_id: employeeId,
        attendance_id: attendanceType,
        active: true,
        created_by_id: 1,
        created_at: now,
        updated_at: now,
      });

      /* ---------- JOB SCHEDULE ---------- */
      if (
        attendanceType !== 6 &&
        schedule.jornada?.trim() &&
        schedule.checkin &&
        schedule.checkout &&
        schedule.checkin !== "00:00" &&
        schedule.checkout !== "00:00"
      ) {
        const jornadaMapping = scheduleMappings[schedule.jornada];

        if (!jornadaMapping) continue;
        const startHour = hourMap[timeToHourName(schedule.checkin)];
        const endHour = hourMap[timeToHourName(schedule.checkout)];
        if (!startHour || !endHour) continue;

        for (const range of jornadaMapping) {
          const startDay = dayMap[String(range.start_day)];
          const endDay = dayMap[String(range.end_day)];
          if (!startDay || !endDay) continue;

          jobSchedules.push({
            employee_id: employeeId,
            name: `Jornada ${schedule.jornada} - ${e.numberEmployee}`,
            description: `Jornada laboral migrada - ${schedule.FechaCambioOficio ?? ""}`,
            active: true,
            start_day_id: startDay.id,
            end_day_id: endDay.id,
            start_hour_id: startHour.id,
            end_hour_id: endHour.id,
            created_at: now,
            updated_at: now,
          });
        }
      }
    }
  }

  for (const batch of chunkArray(addresses, CHUNK)) {
    await prisma.employeeAddress.createMany({
      data: batch,
      skipDuplicates: true,
    });
  }

  for (const batch of chunkArray(tradeUnions, CHUNK)) {
    await prisma.employeeTradeUnion.createMany({
      data: batch,
      skipDuplicates: true,
    });
  }

  for (const batch of chunkArray(hirings, CHUNK)) {
    await prisma.employeeHiring.createMany({
      data: batch,
      skipDuplicates: true,
    });
  }

  for (const batch of chunkArray(ascriptions, CHUNK)) {
    await prisma.employeeAscriptions.createMany({
      data: batch,
      skipDuplicates: true,
    });
  }

  const uniqueUserLinks = [];
  const seenUserLinks = new Set();

  for (const link of userLinks) {
    const key = `${link.userId}-${link.employeeId}`;
    if (!seenUserLinks.has(key)) {
      seenUserLinks.add(key);
      uniqueUserLinks.push(link);
    }
  }

  for (const { userId, employeeId } of uniqueUserLinks) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        employee_id: employeeId,
        updated_at: now,
      },
    });
  }

  for (const batch of chunkArray(employeeLocations, CHUNK)) {
    await prisma.employeeLocation.createMany({
      data: batch,
      skipDuplicates: true,
    });
  }

  for (const batch of chunkArray(employeeAttendanceTypes, CHUNK)) {
    await prisma.employeeAttendanceType.createMany({
      data: batch,
      skipDuplicates: true,
    });
  }

  for (const batch of chunkArray(jobSchedules, CHUNK)) {
    await prisma.jobScheduleEmployee.createMany({
      data: batch,
      skipDuplicates: true,
    });
  }

  console.log("Resumen seed empleados:");
  console.log("Employees:", employeesToInsert.length);
  console.log("Addresses:", addresses.length);
  console.log("TradeUnions:", tradeUnions.length);
  console.log("Hirings:", hirings.length);
  console.log("Ascriptions:", ascriptions.length);
  console.log("User links:", userLinks.length);
  console.log("EmployeeLocations:", employeeLocations.length);
  console.log("EmployeeAttendanceTypes:", employeeAttendanceTypes.length);
  console.log("JobSchedules:", jobSchedules.length);

  console.log("📊 Diagnóstico EmployeeLocations:");
  console.log("Sin schedule:", locationStats.noSchedule.length);
  console.log("Sin locationDisplayName:", locationStats.noLocationName.length);
  console.log("Location no encontrada:", locationStats.locationNotFound.length);

  if (locationStats.locationNotFound.length) {
    console.table(locationStats.locationNotFound);
  }

  console.log("✅ seedEmployeesOptimized finished safely");
};
