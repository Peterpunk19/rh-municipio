import { prisma } from "@/lib/prisma";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { ROLES_ID_VALUES } from "@/common/constants/Roles";
import { logger } from "@/lib/logger";
import { ImportResult, LegacyEnlaceUser } from "@/app/api/migration/enlace-users/interface";
import { encryptPassword } from "@/common/utils";

const DIRECCION_EXCEPTIONS: Record<string, string> = {
  "DIRECCION DE AUDITORIAS A FONDOS DE APORTACIONES FEDERALES ESTATALES Y MUNICIPALES":
    "DIR DE AUDITORIAS A F DE APORTACIONES FED EST Y MPALES",
  "DIRECCION DE INVESTIGACION DE FALTAS ADMINISTRATIVAS Y EVOLUCION":
    "DIRECCION DE INVESTIGACION DE FALTAS ADMINISTRATIVAS Y EVOLUCION PATRIMONIAL",
  "PRESIDENCIA MUNICIPAL": "PRESIDENCIA",
  "SECRETARIA DE OBRAS PUBLICAS": "SECRETARIA DE OBRAS PUBLICAS MUNICIPAL",
  "SECRETARIA DE DESARROLLO URBANO": "SECRETARIA DE DESARROLLO URBANO MUNICIPAL",
  "SECRETARIA PROTECCION CIVIL": "SECRETARIA DE PROTECCION CIVIL",
  "DIRECCION DE RECURSOS MATERIALES SERVICIOS GENERALES Y PATRIMONIO MUNICIPAL":
    "DIRECCION DE REC MATERIALES SERV GRALES Y PATRIMONIO MPAL",
  "DIRECCION DE ADMINISTRACION DE EMERGENCIAS Y CAPACITACION": "DIR DE ADMON DE EMERGENCIAS Y CAPACITACION",
  "CLINICA DE DIAGNOSTICO DE LA MUJER PONIENTE": "DIRECCION DE LA CLINICA DE DIAGNOSTICO DE LA MUJER PONIENTE",
  "DIRECCION DE IDENTIFICACION Y REDUCCION DE RIESGOS INSPECCIONES Y EVENTOS":
    "DIR DE IDENTIFICACION Y REDUCCION DE RIESGOS, INSPECCIONES Y EVE",
};

const normalizeName = (displayName: string): string => {
  if (!displayName) return "";
  const normalized = displayName
    .trim()
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\./g, "")
    .replace(/,/g, "")
    .replace(/\s+/g, " ");

  return DIRECCION_EXCEPTIONS[normalized] || normalized;
};

export const MigrationService = {
  createLegacyPrismaClient() {
    const legacyDatabaseUrl = process.env.DATABASE_LEGACY_URL;

    if (!legacyDatabaseUrl) {
      throw new Error("DATABASE_LEGACY_URL no está configurada en las variables de entorno");
    }

    return new PrismaClient({
      datasources: {
        db: {
          url: legacyDatabaseUrl,
        },
      },
    });
  },

  async importEnlaceUsers(authResponse: any): Promise<ImportResult> {
    const result: ImportResult = {
      success: true,
      imported: 0,
      skipped: 0,
      total: 0,
      errors: [],
    };

    const prismaLegacy = this.createLegacyPrismaClient();

    try {
      const legacyUsers = await prismaLegacy.$queryRaw<LegacyEnlaceUser[]>`
                SELECT enlace.Username, enlace.idSecretaria, empleado.NumeroEmpleado, 
                       cat_secretarias.Secretaria, enlace.Activo, CASE WHEN empleado.StatusEmpl = 'A' THEN 'Activo' WHEN empleado.StatusEmpl = 'D' THEN 'Baja' ELSE 'Fallecimiento' END AS StatusEmployee 
                FROM enlace 
                INNER JOIN empleado ON empleado.IdEmpleado = enlace.idEmpleado 
                INNER JOIN cat_secretarias ON cat_secretarias.idSecretaria = enlace.idSecretaria
                WHERE enlace.Activo = 1
            `;

      logger.info(`Found ${legacyUsers.length} enlace users in legacy database`);
      result.total = legacyUsers.length;

      if (legacyUsers.length === 0) {
        return result;
      }

      const employeeNumbers = legacyUsers.map((u) => String(u.NumeroEmpleado));

      const [employees, direcciones] = await Promise.all([
        prisma.employee.findMany({
          where: { number_employee: { in: employeeNumbers } },
          select: { id: true, number_employee: true },
        }),
        prisma.direccion.findMany({
          where: { active: true },
          select: { id: true, display_name: true },
          orderBy: { display_name: "asc" },
        }),
      ]);

      const employeeMap = new Map(employees.map((e) => [e.number_employee, e.id]));
      const direccionMap = new Map(direcciones.map((d) => [normalizeName(d.display_name), d.id]));

      const employeeIds = Array.from(employees.map((e) => e.id));
      const existingEnlaceUsers = await prisma.user.findMany({
        where: {
          employee_id: { in: employeeIds },
          role_id: ROLES_ID_VALUES.enlace,
        },
        select: { id: true, employee_id: true },
      });
      const enlaceUserMap = new Map(existingEnlaceUsers.map((u) => [u.employee_id, u.id]));

      const userIds = Array.from(existingEnlaceUsers.map((u) => u.id));
      const existingRelations = await prisma.userDireccion.findMany({
        where: { user_id: { in: userIds } },
        select: { user_id: true, direccion_id: true },
      });

      const relationSet = new Set(existingRelations.map((rel) => `${rel.user_id}-${rel.direccion_id}`));

      for (const legacyUser of legacyUsers) {
        try {
          const employeeNumber = String(legacyUser.NumeroEmpleado);
          const employeeId = employeeMap.get(employeeNumber);

          if (!employeeId) {
            result.errors.push({
              numero_empleado: legacyUser.NumeroEmpleado,
              reason: `Employee ${legacyUser.NumeroEmpleado} not found in main database`,
            });
            logger.info(`Employee ${legacyUser.NumeroEmpleado} not found in main database`);
            result.skipped++;
            continue;
          }

          const normalizedDireccionName = normalizeName(legacyUser.Secretaria);
          const direccionId = direccionMap.get(normalizedDireccionName);
          if (!direccionId) {
            result.errors.push({
              numero_empleado: legacyUser.NumeroEmpleado,
              reason: `Direccion ${normalizedDireccionName} not found in main database`,
            });
            logger.info(`Direccion ${normalizedDireccionName} not found in main database`);
            result.skipped++;
            continue;
          }

          const existingUserId = enlaceUserMap.get(employeeId);
          const relationKey = `${existingUserId}-${direccionId}`;
          const relationExists = relationSet.has(relationKey);

          if (!existingUserId) {
            const tempPassword = await encryptPassword(employeeNumber);

            await prisma.$transaction(async (tx) => {
              const newUser = await tx.user.create({
                data: {
                  uuid: uuidv4(),
                  username: legacyUser.Username,
                  password: tempPassword,
                  must_change_password: true,
                  active: legacyUser.Activo === 1,
                  employee_id: employeeId,
                  role_id: ROLES_ID_VALUES.enlace,
                  created_by_id: authResponse.userId,
                },
              });

              await tx.userDireccion.create({
                data: {
                  user_id: newUser.id,
                  direccion_id: direccionId,
                  created_by_id: authResponse.userId,
                },
              });

              enlaceUserMap.set(employeeId, newUser.id);
              relationSet.add(`${newUser.id}-${direccionId}`);
            });
            result.imported++;
            logger.info(`Created user and relationship: ${legacyUser.NumeroEmpleado}`);
          } else if (!relationExists) {
            await prisma.userDireccion.create({
              data: {
                user_id: existingUserId,
                direccion_id: direccionId,
                created_by_id: authResponse.userId,
              },
            });
            relationSet.add(relationKey);
            result.imported++;
            logger.info(`Created relationship for existing user: ${legacyUser.NumeroEmpleado}`);
          } else {
            result.skipped++;
            logger.info(`Relationship already exists for user: ${legacyUser.NumeroEmpleado}`);
          }
        } catch (error: any) {
          result.errors.push({
            numero_empleado: legacyUser.NumeroEmpleado,
            reason: error.message,
          });
          logger.error(`Error importing user ${legacyUser.NumeroEmpleado}:`, error);
        }
      }

      logger.info(
        `Migration completed: ${result.imported} imported, ${result.skipped} skipped, ${result.errors.length} errors`,
      );
      return result;
    } catch (error: any) {
      logger.error("Error in importEnlaceUsers:", error);
      throw new Error(`Migration failed: ${error.message}`);
    } finally {
      await prismaLegacy.$disconnect();
    }
  },
};
