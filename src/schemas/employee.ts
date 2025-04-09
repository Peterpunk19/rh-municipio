import { validationMessages } from "@/common/validation/messages";
import { UserSchema } from "./user";
import { GenderSchema, StatusEmployeeSchema } from "./catalogs";
import { z } from "zod";
import { EmployeeTypeDisplayName, EmployeeTypeName } from "@/common/constants/EmployeeType";

const rfcRegex = /^([A-ZÑ&]{3}|[A-Z][AEIOU][A-Z]{2})\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])[A-Z0-9]{3}$/;
const curpRegex =
  /^[A-Z][AEIOU][A-Z]{2}\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])[HM](AS|BC|BS|CC|CH|CL|CM|CS|DF|DG|GR|GT|HG|JC|MC|MN|MS|NL|NT|OC|PL|QR|QT|SL|SP|SR|TC|TL|TS|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[A-Z0-9]\d$/;

export const EmployeePostSchema = z
  .object({
    numberEmployee: z
      .string({ message: validationMessages.required("Número de empleado") })
      .min(1, { message: validationMessages.required("Número de empleado") })
      .max(6, { message: validationMessages.maxLength("Número de empleado", 6) })
      .optional()
      .nullable(),
    name: z
      .string({ message: validationMessages.required("Nombre(s)") })
      .min(1, { message: validationMessages.required("Nombre(s)") })
      .max(255, { message: validationMessages.maxLength("Nombre(s)", 255) }),
    paternalLastName: z
      .string({ message: validationMessages.required("Apellido paterno") })
      .min(1, { message: validationMessages.required("Apellido paterno") })
      .max(255, { message: validationMessages.maxLength("Apellido paterno", 255) }),
    maternalLastName: z
      .string({ message: validationMessages.required("Apellido materno") })
      .min(1, { message: validationMessages.required("Apellido materno") })
      .max(255, { message: validationMessages.maxLength("Apellido materno", 255) }),
    birthday: z.preprocess(
      (val) => {
        if (typeof val === "string" || val instanceof String) {
          const parsedDate = new Date(val as string);
          return Number.isNaN(parsedDate.getTime()) ? undefined : parsedDate;
        }
        return val;
      },
      z.date({ message: validationMessages.invalidaFormat("Fecha de nacimiento") }),
    ),
    genderId: z.number({ message: validationMessages.required("Género") }),
    rfc: z
      .string({ message: validationMessages.required("RFC") })
      .min(1, { message: validationMessages.required("RFC") })
      .regex(rfcRegex, { message: validationMessages.invalidFormat("RFC") }),
    curp: z
      .string({ message: validationMessages.required("CURP") })
      .min(1, { message: validationMessages.required("CURP") })
      .regex(curpRegex, { message: validationMessages.invalidFormat("CURP") }),
    startJobDate: z.preprocess(
      (val) => {
        if (typeof val === "string" || val instanceof String) {
          const parsedDate = new Date(val as string);
          return Number.isNaN(parsedDate.getTime()) ? undefined : parsedDate;
        }
        return val;
      },
      z.date({ message: validationMessages.invalidaFormat("Fecha de inicio") }),
    ),
    endJobDate: z.preprocess(
      (val) => {
        if (typeof val === "string" || val instanceof String) {
          const parsedDate = new Date(val as string);
          return Number.isNaN(parsedDate.getTime()) ? undefined : parsedDate;
        }
        return val;
      },
      z.date({ message: validationMessages.invalidaFormat("Fecha de terminación") }),
    ),
    addressLine1: z
      .string({ message: validationMessages.required("Calle") })
      .min(1, { message: validationMessages.required("Calle") })
      .max(255, { message: validationMessages.maxLength("Calle", 255) }),
    addressLine2: z
      .string({ message: validationMessages.required("Número de casa") })
      .min(1, { message: validationMessages.required("Número de casa") })
      .max(255, { message: validationMessages.maxLength("Número de casa", 255) }),
    addressLine3: z.string({ message: validationMessages.required("Número de Departamento") }),
    addressLine4: z
      .string({ message: validationMessages.required("Colonia") })
      .min(1, { message: validationMessages.required("Colonia") })
      .max(255, { message: validationMessages.maxLength("Colonia", 255) }),
    postalCode: z
      .string({ message: validationMessages.required("Código postal") })
      .min(1, { message: validationMessages.required("Código postal") })
      .max(255, { message: validationMessages.maxLength("Código postal", 255) }),
    postalCodeSat: z
      .string({ message: validationMessages.required("Código postal SAT") })
      .min(1, { message: validationMessages.required("Código postal SAT") })
      .max(255, { message: validationMessages.maxLength("Código postal SAT", 255) }),
    municipalityId: z.number({ message: validationMessages.required("Municipio") }),
    categoryId: z.number({ message: validationMessages.required("Categoria") }),
    employeeTypeName: z
      .string({ message: validationMessages.required("Tipo de empleado") })
      .min(1, { message: validationMessages.required("Tipo de empleado") })
      .refine(
        (val) =>
          val === "" ||
          Object.values(EmployeeTypeName).includes(val as (typeof EmployeeTypeName)[keyof typeof EmployeeTypeName]),
        {
          message: validationMessages.invalid("Tipo de empleado"),
        },
      ),
    direccionId: z.number({ message: validationMessages.required("Órgano administrativo") }),
    maritalStatusId: z
      .number({ message: validationMessages.required("Estado Civil") })
      .optional()
      .nullable(),
    schoolingId: z
      .number({ message: validationMessages.required("Escolaridad") })
      .optional()
      .nullable(),
    occupationId: z
      .number({ message: validationMessages.required("Ocupación") })
      .optional()
      .nullable(),
    professionId: z
      .number({ message: validationMessages.required("Profesión") })
      .optional()
      .nullable(),
    identificationTypeId: z
      .number({ message: validationMessages.required("Tipo de identificacion") })
      .optional()
      .nullable(),
    identificationFolio: z
      .string({ message: validationMessages.required("Folio de identificación") })
      .optional()
      .nullable(),
    tradeUnionId: z
      .string()
      .optional()
      .nullable()
      .refine((val) => val === null || val === "" || val, {
        message: validationMessages.required("Sindicato"),
      }),
  })
  .refine(
    (data) => {
      return !(data.employeeTypeName === EmployeeTypeName.BASE_SINDICALIZADO && !data.tradeUnionId);
    },
    {
      message: validationMessages.requiredIf(
        "Sindicato",
        "Tipo de empleado",
        EmployeeTypeDisplayName[EmployeeTypeName.BASE_SINDICALIZADO],
      ),
      path: ["tradeUnionId"],
    },
  );

export const EmployeeGetByFilterSchema = z.object({
  page: z
    .number({ message: validationMessages.number("Página") })
    .min(1, { message: validationMessages.minNumber("Página", 1) })
    .nullable(),
  limit: z
    .number({ message: validationMessages.number("Limite") })
    .min(1, { message: validationMessages.minNumber("Limite", 1) })
    .nullable(),
  active: z.preprocess((val) => {
    if (typeof val === "string" || val instanceof String) {
      const stringValue = val.toString().toLowerCase();
      if (stringValue === "true") return true;
      if (stringValue === "false") return false;
      return undefined;
    }
    return val;
  }, z.boolean({ message: validationMessages.invalidBoolean("Activo") }).nullable()),
  employee_status: z
    .number({ message: validationMessages.number("Id estatus del empleado") })
    .min(1, { message: validationMessages.minNumber("Id estatus del empleado", 1) })
    .nullable(),
  location: z
    .number({ message: validationMessages.number("Id de ubicación") })
    .min(1, { message: validationMessages.minNumber("Id de ubicación", 1) })
    .nullable(),
  gender: z
    .number({ message: validationMessages.number("El id del genero") })
    .min(1, { message: validationMessages.minNumber("El id del genero", 1) })
    .nullable(),
  employee_type: z
    .number({ message: validationMessages.number("El id del tipo de empleado") })
    .min(1, { message: validationMessages.minNumber("El id del tipo de empleado", 1) })
    .nullable(),
  category: z
    .number({ message: validationMessages.number("La categoría del empleado") })
    .min(1, { message: validationMessages.minNumber("La categoría del empleado", 1) })
    .nullable(),
  direccion: z
    .number({ message: validationMessages.number("El id de direccion del empleado") })
    .min(1, { message: validationMessages.minNumber("El id de direccion del empleado", 1) })
    .nullable(),
  secretaria: z
    .number({ message: validationMessages.number("El id de la secretaria del empleado") })
    .min(1, { message: validationMessages.minNumber("El id la secreatria del empleado", 1) })
    .nullable(),
  start_job_date_start: z
    .preprocess(
      (val) => {
        if (typeof val === "string") {
          const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
          const parsedDate = new Date(val);
          if (!isoDateRegex.test(val) || Number.isNaN(parsedDate.getTime())) {
            return "invalid";
          }
          return parsedDate;
        }
        if (typeof val === "number") return "invalid";
        return val;
      },
      z.date({ message: validationMessages.invalidaFormat("Fecha de inicio en rango de inicio") }),
    )
    .optional()
    .nullable(),
  start_job_date_end: z
    .preprocess(
      (val) => {
        if (typeof val === "string") {
          const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
          const parsedDate = new Date(val);
          if (!isoDateRegex.test(val) || Number.isNaN(parsedDate.getTime())) {
            return "invalid";
          }
          return parsedDate;
        }
        if (typeof val === "number") return "invalid";
        return val;
      },
      z.date({ message: validationMessages.invalidaFormat("Fecha fin en rango de inicio") }),
    )
    .optional()
    .nullable(),
  end_job_date_start: z
    .preprocess(
      (val) => {
        if (typeof val === "string") {
          const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
          const parsedDate = new Date(val);
          if (!isoDateRegex.test(val) || Number.isNaN(parsedDate.getTime())) {
            return "invalid";
          }
          return parsedDate;
        }
        if (typeof val === "number") return "invalid";
        return val;
      },
      z.date({ message: validationMessages.invalidaFormat("Fecha de inicio en rango final") }),
    )
    .optional()
    .nullable(),
  end_job_date_end: z
    .preprocess(
      (val) => {
        if (typeof val === "string") {
          const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
          const parsedDate = new Date(val);
          if (!isoDateRegex.test(val) || Number.isNaN(parsedDate.getTime())) {
            return "invalid";
          }
          return parsedDate;
        }
        if (typeof val === "number") return "invalid";
        return val;
      },
      z.date({ message: validationMessages.invalidaFormat("Fecha fin en rango final") }),
    )
    .optional()
    .nullable(),
  search: z
    .string({ message: validationMessages.required("Búsqueda") })
    .min(1, { message: validationMessages.required("Búsqueda") })
    .max(255, { message: validationMessages.maxLength("Búsqueda", 255) })
    .optional()
    .nullable(),
});

export const EmployeeSchema = z.object({
  id: z.number().int().positive(),
  number_employee: z.string().min(1),
  name: z.string().min(1),
  paternal_last_name: z.string().min(1),
  maternal_last_name: z.string().min(1),
  birthday: z.string().min(1),
  rfc: z.string().min(1),
  curp: z.string().min(1),
  active: z.boolean(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  user: UserSchema.optional(),
  user_id: z.number().int().positive().optional(),
  status_employee: StatusEmployeeSchema.optional(),
  status_employee_id: z.number().int().positive(),
  gender: GenderSchema,
  gender_id: z.number().int().positive(),
  employee_hiring_id: z.number().int().positive(),
  employee_hiring: z.object({ id: z.number().int().positive() }).optional(),
  locations: z.array(z.object({ id: z.number().int().positive() })).optional(),
  director_id: z.number().int().positive().optional(),
  director: z.object({ id: z.number().int().positive() }).optional(),
  sustitute_id: z.number().int().positive().optional(),
  sustitute: z.object({ id: z.number().int().positive() }).optional(),
  employee_incidents: z.array(z.object({ id: z.number().int().positive() })).optional(),
  employee_incidents_created_by: z.array(z.object({ id: z.number().int().positive() })).optional(),
  employee_vacations: z.array(z.object({ id: z.number().int().positive() })).optional(),
  employee_vacations_created_by: z.array(z.object({ id: z.number().int().positive() })).optional(),
  employee_requests: z.array(z.object({ id: z.number().int().positive() })).optional(),
  employee_requests_by: z.array(z.object({ id: z.number().int().positive() })).optional(),
  employee_requests_resolved_by: z.array(z.object({ id: z.number().int().positive() })).optional(),
  employee_created_by: z.array(z.object({ id: z.number().int().positive() })).optional(),
});

export const EmployeeGetByIdSchema = z.object({
  id: z
    .number({ message: validationMessages.number("ID") })
    .min(1, { message: validationMessages.minNumber("ID", 1) })
    .max(999999999999999, { message: validationMessages.maxNumber("ID", 999999999999999) })
    .nullable(),
});
