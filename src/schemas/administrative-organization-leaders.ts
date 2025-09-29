import { z } from "zod";
import { validationMessages } from "@/common/validation/messages";
import { validateDate } from "@/schemas/utils";

export const CreateUpdateLeaderSchema = z
  .object({
    direccionId: z
      .number({ message: validationMessages.number("El ID del organismo administrativo") })
      .min(1, { message: validationMessages.minNumber("El ID del organismo administrativo", 1) })
      .max(999999999999999, {
        message: validationMessages.maxNumber("El ID del organismo administrativo", 999999999999999),
      }),
    director: z
      .number({ message: validationMessages.number("El ID del director") })
      .min(1, { message: validationMessages.minNumber("El ID del director", 1) })
      .max(999999999999999, { message: validationMessages.maxNumber("El ID del director", 999999999999999) }),
    secretary: z
      .number({ message: validationMessages.number("El ID del secretario") })
      .min(1, { message: validationMessages.minNumber("El ID del secretario", 1) })
      .max(999999999999999, { message: validationMessages.maxNumber("El ID del secretario", 999999999999999) })
      .optional()
      .nullable(),
    coordinator: z
      .number({ message: validationMessages.number("El ID del coordinador") })
      .min(1, { message: validationMessages.minNumber("El ID del coordinador", 1) })
      .max(999999999999999, { message: validationMessages.maxNumber("El ID del coordinador", 999999999999999) })
      .optional()
      .nullable(),
    immediateResponsible: z
      .number({ message: validationMessages.number("El ID del responsable inmediato") })
      .min(1, { message: validationMessages.minNumber("El ID del responsable inmediato", 1) })
      .max(999999999999999, {
        message: validationMessages.maxNumber("El ID del responsable inmediato", 999999999999999),
      })
      .optional()
      .nullable(),
    signIncidentsRole: z
      .number({ message: validationMessages.number("El ID del rol de firmante de incidentes") })
      .min(1, { message: validationMessages.minNumber("El ID del rol de firmante de incidentes", 1) })
      .max(999999999999999, {
        message: validationMessages.maxNumber("El ID del rol de firmante de incidentes", 999999999999999),
      })
      .optional()
      .nullable(),
    signRequestsRole: z
      .number({ message: validationMessages.number("El ID del rol de firmante de solicitudes") })
      .min(1, { message: validationMessages.minNumber("El ID del rol de firmante de solicitudes", 1) })
      .max(999999999999999, {
        message: validationMessages.maxNumber("El ID del rol de firmante de solicitudes", 999999999999999),
      })
      .optional()
      .nullable(),
    startDate: z.preprocess(
      (val) => validateDate(val),
      z
        .date({ message: validationMessages.invalidaFormat("Fecha de inicio") })
        .optional()
        .nullable(),
    ),
    endDate: z.preprocess(
      (val) => validateDate(val),
      z
        .date({ message: validationMessages.invalidaFormat("Fecha de fin") })
        .optional()
        .nullable(),
    ),
  })
  .refine(
    (data) => {
      const { director, secretary, coordinator, immediateResponsible } = data;
      const roles = [director, secretary, coordinator, immediateResponsible].filter(Boolean).map(String);

      return new Set(roles).size === roles.length;
    },
    {
      message: "El director, secretario, coordinador y responsable inmediato deben ser diferentes",
      path: ["secretary"],
    },
  )
  .refine(
    (data) => {
      const requiresDates = Boolean(data.director || data.secretary || data.coordinator);
      if (!requiresDates) return true;
      return Boolean(data.startDate) && Boolean(data.endDate);
    },
    {
      message: validationMessages.required("Fecha de inicio y fin"),
      path: ["startDate"],
    },
  )
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.endDate > data.startDate;
      }
      return true;
    },
    {
      message: validationMessages.invalidDateRangeGreaterThan("Fecha de fin", "Fecha de inicio"),
      path: ["endDate"],
    },
  );

export const AdministrativeOrganizationsGetFilterSchema = z.object({
  page: z
    .number({ message: validationMessages.number("Página") })
    .min(1, { message: validationMessages.minNumber("Página", 1) })
    .nullable(),
  limit: z
    .number({ message: validationMessages.number("Limite") })
    .min(1, { message: validationMessages.minNumber("Limite", 1) })
    .nullable(),
  search: z
    .union([
      z
        .string()
        .min(1, { message: validationMessages.required("Búsqueda") })
        .max(255, { message: validationMessages.maxLength("Búsqueda", 255) }),
      z.number().transform((num) => num.toString()),
    ])
    .optional()
    .nullable(),
});

export const LeadersGetFilterSchema = z
  .object({
    page: z
      .number({ message: validationMessages.number("Página") })
      .min(1, { message: validationMessages.minNumber("Página", 1) })
      .nullable(),
    limit: z
      .number({ message: validationMessages.number("Limite") })
      .min(1, { message: validationMessages.minNumber("Limite", 1) })
      .nullable(),
    search: z
      .union([
        z
          .string()
          .min(1, { message: validationMessages.required("Búsqueda") })
          .max(255, { message: validationMessages.maxLength("Búsqueda", 255) }),
        z.number().transform((num) => num.toString()),
      ])
      .optional()
      .nullable(),
    active: z.preprocess(
      (val) => (typeof val === "string" || val instanceof String ? val.toString().toLowerCase() : val),
      z.enum(["true", "false"], { message: validationMessages.invalidBoolean("Activo") }).nullable(),
    ),
    startDate: z
      .preprocess((val) => validateDate(val), z.date({ message: validationMessages.invalidaFormat("Fecha de inicio") }))
      .optional()
      .nullable(),
    endDate: z
      .preprocess((val) => validateDate(val), z.date({ message: validationMessages.invalidaFormat("Fecha de fin") }))
      .optional()
      .nullable(),
    direccionId: z.number().optional().nullable(),
    roleId: z.number().optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.endDate >= data.startDate;
      }
      return true;
    },
    {
      message: validationMessages.invalidDateRange("Fecha de fin", "Fecha de inicio"),
      path: ["endDate"],
    },
  );
