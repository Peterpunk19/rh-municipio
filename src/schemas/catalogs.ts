import { z } from "zod";
import { validateDate } from "./utils";
import { validationMessages } from "@/common/validation/messages";

const BaseCatalogFilterSchema = z.object({
  page: z.number().nullable(),
  limit: z.number().nullable(),
  search: z.string().nullable(),
  active: z.preprocess((val) => {
    if (typeof val === "string" || val instanceof String) {
      const stringValue = val.toString().toLowerCase();
      if (stringValue === "true") return true;
      if (stringValue === "false") return false;
      return undefined;
    }
    return val;
  }, z.boolean().optional().nullable()),
});
const EmployeeTypeFilterSchema = BaseCatalogFilterSchema;
const GenderFilterSchema = BaseCatalogFilterSchema;
const DireccionFilterSchema = BaseCatalogFilterSchema.extend({
  secretaria_id: z.number().nullable().optional(),
});
const SecretariaFilterSchema = BaseCatalogFilterSchema;
const CategoryFilterSchema = BaseCatalogFilterSchema;
const HolidayFilterSchema = BaseCatalogFilterSchema.extend({
  year: z.number().nullable(),
});
const IncidentFilterSchema = BaseCatalogFilterSchema;
const LocationFilterSchema = BaseCatalogFilterSchema;
const OccupationFilterSchema = BaseCatalogFilterSchema;
const ProfessionFilterSchema = BaseCatalogFilterSchema;
const RequestsTypeFilterSchema = BaseCatalogFilterSchema;
const TradeUnionFilterSchema = BaseCatalogFilterSchema;
const MaritalStatusFilterSchema = BaseCatalogFilterSchema;
const SchoolingFilterSchema = BaseCatalogFilterSchema;

const EmployeeTypeSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  display_name: z.string().min(1),
  active: z.boolean().optional(),
  employees: z.array(z.object({ id: z.number().int().positive() })).optional(),
});

const StatusEmployeeSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  display_name: z.string().min(1),
  active: z.boolean().optional(),
  employees: z.array(z.object({ id: z.number().int().positive() })).optional(),
});

const GenderSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  display_name: z.string().min(1),
  active: z.boolean().optional(),
  employees: z.array(z.object({ id: z.number().int().positive() })).optional(),
});

const DepartamentoSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  display_name: z.string().min(1),
  active: z.boolean().optional(),
  employees: z.array(z.object({ id: z.number().int().positive() })).optional(),
  direccion: z.object({ id: z.number().int().positive() }),
  direccion_id: z.number().int().positive(),
});

const PayrollSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  display_name: z.string().min(1),
  active: z.boolean().optional(),
  employees: z.array(z.object({ id: z.number().int().positive() })).optional(),
});

const DireccionSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  display_name: z.string().min(1),
  departamentos: z.array(z.object({ id: z.number().int().positive() })).optional(),
  secretaria: z.object({ id: z.number().int().positive() }),
  secretaria_id: z.number().int().positive(),
  directors: z.array(z.object({ id: z.number().int().positive() })).optional(),
});

const SecretariaSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  display_name: z.string().min(1),
  active: z.boolean().optional(),
  direcciones: z.array(z.object({ id: z.number().int().positive() })).optional(),
});

const CategorySchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  display_name: z.string().min(1),
  active: z.boolean().optional(),
  employees: z.array(z.object({ id: z.number().int().positive() })).optional(),
});

const IncidentsSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  display_name: z.string().min(1),
  active: z.boolean().optional(),
  employee_incidents: z.array(z.object({ id: z.number().int().positive() })).optional(),
});

const IncidentStatusSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  display_name: z.string().min(1),
  type: z.number().int().positive(),
  active: z.boolean().optional(),
  employee_incidents: z.array(z.object({ id: z.number().int().positive() })).optional(),
});

const LocationSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  display_name: z.string().min(1),
  active: z.boolean().optional(),
  employees: z.array(z.object({ id: z.number().int().positive() })).optional(),
  employee_attendance: z.array(z.object({ id: z.number().int().positive() })).optional(),
  employee_request_detail: z.array(z.object({ id: z.number().int().positive() })).optional(),
});

const RequestStatusSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  display_name: z.string().min(1),
  active: z.boolean().optional(),
  employee_requests: z.array(z.object({ id: z.number().int().positive() })).optional(),
});

const AttendanceSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  display_name: z.string().min(1),
  active: z.boolean().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  employee_attendance: z.array(z.object({ id: z.number().int().positive() })).optional(),
  employee_request_detail: z.array(z.object({ id: z.number().int().positive() })).optional(),
});

const BaseCatalogPostSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  display_name: z.string().min(1, "El nombre para mostrar es requerido"),
  active: z.boolean().optional().default(true),
});

const EmployeeTypePostSchema = BaseCatalogPostSchema;
const CategoryPostSchema = BaseCatalogPostSchema;
const HolidayPostSchema = BaseCatalogPostSchema.extend({
  holiday_date: z.preprocess(
    (val) => validateDate(val),
    z.date({ required_error: "La fecha del día festivo es requerida" }),
  ),
  validation_date: z.preprocess(
    (val) => validateDate(val),
    z.date({ required_error: "La fecha de validación es requerida" }),
  ),
}).refine(
  (data) => {
    if (!data.holiday_date || !data.validation_date) return true;
    const diffInMs = Math.abs(data.validation_date.getTime() - data.holiday_date.getTime());
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
    return diffInDays <= 10;
  },
  {
    message: "La diferencia entre la fecha del día festivo y la fecha de validación no puede ser mayor a 10 días",
    path: ["validation_date"],
  },
);
const LocationPostSchema = BaseCatalogPostSchema;
const MaritalStatusPostSchema = BaseCatalogPostSchema;
const SchoolingPostSchema = BaseCatalogPostSchema.extend({
  cve_code: z.string().min(1, "El código es requerido"),
});
const OccupationPostSchema = BaseCatalogPostSchema.extend({
  cve_code: z.string().min(1, "El código es requerido"),
});
const ProfessionPostSchema = BaseCatalogPostSchema;
const SecretariaPostSchema = BaseCatalogPostSchema;
const DireccionPostSchema = BaseCatalogPostSchema.extend({
  secretaria_id: z.preprocess(
    (val) => (typeof val === "string" ? Number(val) : val),
    z
      .number()
      .int()
      .positive({ message: validationMessages.required("Secretaria") }),
  ),
});
const TradeUnionPostSchema = BaseCatalogPostSchema;
const IncidentByEmployeeGetSchema = z.object({
  employee_id: z
    .number({ message: validationMessages.number("Empleado") })
    .optional()
    .nullable(),
});
export {
  EmployeeTypeSchema,
  GenderSchema,
  GenderFilterSchema,
  StatusEmployeeSchema,
  DepartamentoSchema,
  PayrollSchema,
  DireccionSchema,
  DireccionFilterSchema,
  SecretariaSchema,
  CategorySchema,
  IncidentStatusSchema,
  IncidentsSchema,
  IncidentFilterSchema,
  LocationSchema,
  LocationFilterSchema,
  RequestStatusSchema,
  AttendanceSchema,
  EmployeeTypeFilterSchema,
  CategoryFilterSchema,
  HolidayFilterSchema,
  OccupationFilterSchema,
  ProfessionFilterSchema,
  RequestsTypeFilterSchema,
  SecretariaFilterSchema,
  TradeUnionFilterSchema,
  MaritalStatusFilterSchema,
  SchoolingFilterSchema,
  EmployeeTypePostSchema,
  CategoryPostSchema,
  HolidayPostSchema,
  LocationPostSchema,
  MaritalStatusPostSchema,
  SchoolingPostSchema,
  OccupationPostSchema,
  ProfessionPostSchema,
  SecretariaPostSchema,
  DireccionPostSchema,
  TradeUnionPostSchema,
  IncidentByEmployeeGetSchema,
};
