// Place this file at prisma/seed.production.cjs.
// One-time bootstrap of a new database; intentionally refuses non-empty targets.
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const catalogSources = [
  ['attendance', './seeds/attendance'],
  ['category', './seeds/category'],
  ['day', './seeds/day'],
  ['configYear', './seeds/config-year'],
  ['employeeType', './seeds/employee-type'],
  ['gender', './seeds/gender'],
  ['hour', './seeds/hour'],
  ['incident', './seeds/incident'],
  ['incidentStatus', './seeds/incident-status'],
  ['location', './seeds/location'],
  ['request', './seeds/request'],
  ['requestStatus', './seeds/request-status'],
  ['role', './seeds/roles'],
  ['statusEmployee', './seeds/status-employee'],
  ['secretaria', './seeds/secretaria'],
  ['direccion', './seeds/direccion'],
  ['country', './seeds/country'],
  ['state', './seeds/state'],
  ['municipality', './seeds/municipality'],
  ['identificationType', './seeds/identification-type'],
  ['maritalStatus', './seeds/marital-status'],
  ['occupation', './seeds/occupation'],
  ['profession', './seeds/profession'],
  ['schooling', './seeds/schooling'],
  ['tradeUnion', './seeds/trade-union'],
  ['incidentsRolesPermissions', './seeds/incidents-roles-permissions'],
  ['requestsRolesPermissions', './seeds/requests-roles-permissions', 'allPermissions'],
  ['categoryEmployeeType', './seeds/category-employee-type'],
  ['incidentRules', './seeds/incident-rules'],
  ['holiday', './seeds/holiday'],
  ['incapacityRule', './seeds/incapacity-rule'],
  ['module', './seeds/modules'],
  ['roleModule', './seeds/roleModules'],
];

async function main() {
  if (process.env.CONFIRM_INITIAL_SEED !== 'rh_municipio_db') {
    throw new Error('Explicit confirmation required: CONFIRM_INITIAL_SEED=rh_municipio_db');
  }
  const url = new URL(process.env.DATABASE_URL || '');
  if (url.protocol !== 'mysql:' || decodeURIComponent(url.pathname.slice(1)) !== 'rh_municipio_db') {
    throw new Error('Unexpected DATABASE_URL target. No seed applied.');
  }
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!password || password.length < 16 || Buffer.byteLength(password, 'utf8') > 72) {
    throw new Error('SEED_ADMIN_PASSWORD must have at least 16 characters and at most 72 UTF-8 bytes.');
  }
  // Match the application's actual password verifier before using in production.
  const hash = await bcrypt.hash(password, 12);
  const prisma = new PrismaClient();
  try {
    const [target] = await prisma.$queryRaw`SELECT DATABASE() AS db, @@hostname AS host, @@port AS port`;
    if (target?.db !== 'rh_municipio_db') throw new Error('Unexpected connected database.');
    console.log(`Seed target: ${target.host}:${target.port}/${target.db}`);
    // Load only the catalog exports; review these files for side effects before use.
    const catalogs = catalogSources.map(([model, source, exportName]) => {
      const raw = require(source);
      const rows = exportName ? raw[exportName] : raw;
      if (!Array.isArray(rows)) throw new Error(`Expected array for ${model}`);
      return [model, model === 'roleModule' ? rows.map(rm => ({
        role_id: rm.role_id,
        module_id: rm.module_id,
        can_view: rm.can_view ?? false,
        can_create: rm.can_create ?? false,
        can_edit: rm.can_edit ?? false,
        can_delete: rm.can_delete ?? false,
      })) : rows];
    });
    const admin = require('./seeds/user');
    // Guard all application tables, not just the tables this seed writes.
    const models = Object.values(require('@prisma/client').Prisma.ModelName)
      .map(name => name.charAt(0).toLowerCase() + name.slice(1));
    await prisma.$transaction(async tx => {
      for (const model of models) {
        if (await tx[model].count()) {
          throw new Error(`Database is not empty: ${model}. Initial seed aborted.`);
        }
      }
      for (const [model, rows] of catalogs) {
        if (rows.length === 0) continue;
        const result = await tx[model].createMany({ data: rows });
        console.log(`${model}: ${result.count} inserted (pending commit)`);
      }
      const role = await tx.role.findUnique({ where: { name: 'admin' } });
      if (!role || role.id !== admin.role_id) throw new Error('Administrator role does not match user seed.');
      await tx.user.create({ data: {
        ...admin,
        password: hash,
        must_change_password: true,
      } });
    }, { maxWait: 10000, timeout: 300000 });
    console.log('Initial seed committed successfully. No employees imported.');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(error => {
  // Avoid dumping Prisma arguments or other potentially sensitive data to logs.
  console.error('Initial seed failed:', error.code || '', error.message?.split('\n')[0] || 'Unknown error');
  process.exitCode = 1;
});
