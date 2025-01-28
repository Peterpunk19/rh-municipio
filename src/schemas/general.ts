import { z } from "zod";

const FileSchema = z.union([
  z.string().url("Selecciona un archivo"), // URL de la foto
  z.instanceof(File), // Archivo de la foto
]);

const LoginSchema = z.object({
  email: z.string().email({ message: "Introduce un correo válido" }),
  password: z.string().min(1, { message: "La contraseña es obligatoria" }),
});

const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: "Introduce un correo válido" }),
});

const ResetPasswordSchema = z.object({
  token: z.string().min(1, { message: "El token es obligatorio" }),
  password: z.string().min(1, { message: "La contraseña es obligatoria" }),
});

const UserFormSchema = z.object({
  password: z.string().min(1, { message: "La contraseña es obligatoria" }),
  name: z
    .string({
      message: "El nombre es requerido y debe ser de al menos 1 caracter",
    })
    .min(1, { message: "El nombre debe tener al menos 1 caracter" }),
  lastname: z.string().min(1, { message: "El apellido paternoes obligatorio" }),
  second_lastname: z
    .string()
    .min(1, { message: "El apellido materno es obligatorio" }),
  photo: z
    .instanceof(File)
    .optional()
    .refine((file: any) => file?.size <= 5000000, {
      // 5MB max
      message: "La foto es requerida y debe ser menor de 5MB",
    }),
  email: z.string().email({ message: "Correo electrónico inválido" }),
  ish: z.string().optional(),
  phone_number: z
    .string()
    .min(1, { message: "El número de teléfono es obligatorio" }),
  office_address: z.string().optional(),
  office_phone: z.string().optional(),
  tax_address: z.string().optional(),
  service_hours: z.string().optional(),
  birthday: z.date().optional(),
  badge_number: z.string().optional(),
  sex: z.enum(["M", "F"]),
  user_type: z
    .number()
    .int({ message: "El tipo de usuario debe ser un número entero" }),
  entry_date: z.date().optional(),
  valid_until: z.date().optional(),
  visible_in_directory: z.boolean(),
  vacation_days: z.number().int().positive().optional(),
  specialties: z.array(z.any()).optional(),
  hobbies: z.array(z.any()).optional(),
  modules: z.array(z.any()).optional(),
});

const UserSchema = z.object({
  id: z.number().int().positive().optional(),
  password: z.string().min(1),
  name: z
    .string({
      required_error:
        "El nombre es requerido y debe ser de al menos 1 caracter",
    })
    .min(1),
  lastname: z.string().min(1),
  second_lastname: z.string().min(1),
  photo: z.string({ required_error: "La url de la foto es requerido" }),
  email: z.string().email(),
  sex: z.enum(["M", "F"]),
  phone_number: z.string().min(1),
  office_phone: z.string().optional(),
  office_address: z.string().optional(),
  service_hours: z.string().optional(),
  birthday: z.date().optional(),
  badge_number: z.string().optional(),
  user_type_id: z.number().int(),
  entry_date: z.date().optional(),
  vacation_days: z.number().int().positive().optional(),
  visible_in_directory: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  role: z.enum(["USER", "ADMIN", "SUPER"]).optional(),
  tax_address: z.string().optional(),
  ish: z.string().optional(),
  payments: z.array(z.any()).optional(),
  fileAttachments: z.array(z.any()).optional(),
  specialties: z.array(z.any()).optional(),
  hobbies: z.array(z.any()).optional(),
  modules: z.array(z.any()).optional(),
  changesSessions: z.array(z.any()).optional(),
  user_type: z.array(z.any()).optional(),
  is_verfied: z.boolean().optional(),
  is_active: z.boolean().optional(),
});

const UserEventEnrollmentFormSchema = z.object({
  eventId: z.number().int(),
  userId: z.number().int().optional(),
  event: z.any().optional(),
  user: z.any().optional(),
  payment: z.any().optional(),
  enrollment_date: z.date().optional(),
  email: z.string().optional(),
  phone_number: z.string().optional(),
  name: z.string().optional(),
  birthday: z.date().optional(),
  is_active: z.boolean().optional(),
  is_internal: z.boolean().optional(),
  status_code: z.number().int().optional(),
  status: z.string().optional(),
});

const UserEventEnrollmentSchema = z.object({
  id: z.number().int().positive().optional(),
  eventId: z.number().int(),
  userId: z.number().int(),
  paymentId: z.number().int(),
  event: z.any().optional(),
  user: z.any().optional(),
  payment: z.any().optional(),
  enrollment_date: z.date().optional(),
  email: z.string().optional(),
  phone_number: z.string().optional(),
  name: z.string().optional(),
  birthday: z.date().optional(),
  is_active: z.boolean().optional(),
  is_internal: z.boolean().optional(),
  status_code: z.number().int().optional(),
  status: z.string().optional(),
});

const ChangeSessionSchema = z.object({
  id: z.number().int().positive().optional(),
  userId: z.number().int(),
  changeDate: z.date().optional(),
  fieldChanges: z.array(z.any()).optional(),
});

const FieldChangeSchema = z.object({
  id: z.number().int().positive().optional(),
  changeSessionId: z.number().int(),
  field: z.string().min(1),
  oldValue: z.any().optional(),
  newValue: z.any().optional(),
  changeType: z.enum(["ADD", "REMOVE", "UPDATE"]),
});

const EventFormSchema = z.object({
  id: z.number().int().positive().optional(),
  name: z
    .string({ message: "El nombre  del evento es requerido" })
    .min(6, { message: "El nombre debe tener al menos 6 caracteres" }),
  cost: z
    .number({ message: "El costo del evento es requerido" })
    .positive({ message: "El costo debe ser número positivo" }),
  description: z
    .string({ message: "La descripción del evento es requerida" })
    .min(10, { message: "La descripción debe tener al menos 10 caracteres" }),
  date: z.date(),
  location: z
    .string({ message: "El lugar del evento es requerida" })
    .min(10, {
      message: "El lugar del evento debe tener al menos 10 caracteres",
    }),
  event_type: z.number().int(),
  event_status: z.number().int(),
  event_banner: z
    .instanceof(File)
    .optional()
    .refine((file: any) => file?.size <= 5000000, {
      // 5MB max
      message: "La imagen del banner es requerida y debe ser menor de 5MB",
    }),
  banner_text: z
    .string({ message: "El texto del banner es requerido" })
    .min(10, {
      message: "El texto del banner debe tener al menos 10 caracteres",
    }),
  event_url: z.string().optional(),
  event_file_a: FileSchema.optional(),
  event_file_b: FileSchema.optional(),
  event_file_c: FileSchema.optional(),
  event_file_d: FileSchema.optional(),
  event_file_e: FileSchema.optional(),
  max_limit: z.number().int(),
  creatorId: z.number().int().optional(),
  surveyId: z.number().int().optional(),
  is_active: z.boolean().optional(),
  has_limit: z.boolean().optional(),
  onlyPrivate: z.boolean().optional(),
  onlyUserTypes: z.array(z.number()), // IDs de tipos de usuario permitidos
  onlySpecialities: z.array(z.number()),
});

const EventSchema = z.object({
  id: z.number().int().positive().optional(),
  name: z.string().min(1),
  cost: z.number().positive(),
  description: z.string().min(1),
  date: z.date(),
  location: z.string().min(1),
  event_type: z.number().int(),
  event_status: z.number().int(),
  event_banner: z.string().optional(),
  banner_text: z.string().min(1),
  event_url: z.string().optional(),
  event_file_a: FileSchema.optional(),
  event_file_b: FileSchema.optional(),
  event_file_c: FileSchema.optional(),
  event_file_d: FileSchema.optional(),
  event_file_e: FileSchema.optional(),
  creatorId: z.number().int().optional(),
  surveyId: z.number().int().optional(),
  is_active: z.boolean().optional(),
  onlyPrivate: z.boolean().optional(),
  isFull: z.boolean().optional(),
  has_limit: z.boolean().optional(),
  max_limit:z.number().positive().optional(),
  onlyUserTypes: z.array(z.number()),
  onlySpecialities: z.array(z.number()),
});

const ScientificSessionsFormSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  photo: FileSchema.optional(),
  photo_yt: z.string().url(),
  link: z.string().url(),
  youtubeId: z.string().min(1),
  show_in_web: z.boolean().optional(),
  is_active: z.boolean().optional(),
  authorId: z.number().int().optional(),
  enrollment_status: z.enum(["ENROLLING", "WAITING_LIST", "ENROLLED", "CANCELLED"]),
});

const ScientificSessionsSchema = z.object({
  id: z.number().int().positive().optional(),
  name: z.string().min(1),
  description: z.string().min(1),
  photo: z.string().url(),
  photo_yt: z.string().url(),
  link: z.string().url(),
  upload_date: z.date(),
  youtubeId: z.string().min(1),
  show_in_web: z.boolean().optional(),
  is_active: z.boolean().optional(),
  authorId: z.number().int().optional(),
});

const PaymentSchema = z.object({
  id: z.number().int().positive().optional(),
  amount: z.number().positive(),
  percentage: z.number().optional(),
  discount: z.number().positive().min(0).optional(),
  debtor_amount: z.number().positive().optional(),
  support_amount: z.number().positive().min(0).optional(),
  payment_desc: z.string().min(1),
  url_file: FileSchema.optional(),
  category: z.string().min(1),
  category_code: z.number().int(),
  debtorId: z.number().int(),
  creatorId: z.number().int(),
  status: z.string().min(1),
  status_code: z.number().int(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  is_active: z.boolean().optional(),
});

const FileAttachmentSchema = z.object({
  id: z.number().int().positive().optional(),
  url_file: FileSchema.optional(),
  file_type: z.string().min(1),
  category: z.string().min(1),
  category_code: z.number().int(),
  ownerId: z.number().int().optional(),
  paymentId: z.number().int().optional(),
  is_active: z.boolean().optional(),
  is_payment:   z.boolean().optional(),
  is_deleted:   z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

const SpecialitySchema = z.object({
  id: z.number().int().positive().optional(),
  name: z.string().min(1),
  users: z.array(z.any()).optional(),
  is_active: z.boolean().optional(),
});

const UserSpecialitySchema = z.object({
  userId: z.number().int(),
  specialityId: z.number().int(),
  license_number: z.string(),
  is_active: z.boolean().optional(),
});

const HobbySchema = z.object({
  id: z.number().int().positive().optional(),
  name: z.string().min(1),
  users: z.array(z.any()).optional(),
  is_active: z.boolean().optional(),
});

const ModuleSchema = z.object({
  id: z.number().int().positive().optional(),
  name: z.string().min(1),
  modules: z.array(z.any()).optional(),
  is_active: z.boolean().optional(),
});

const UserHobbySchema = z.object({
  userId: z.number().int(),
  hobbyId: z.number().int(),
  is_active: z.boolean().optional(),
});

const RequestVacationSchema = z.object({
  reason: z.string().optional(),
  start_date: z.date(),
  end_date: z.date(),
});

export {
  LoginSchema,
  UserSchema,
  UserFormSchema,
  ChangeSessionSchema,
  FieldChangeSchema,
  EventSchema,
  EventFormSchema,
  ScientificSessionsSchema,
  ScientificSessionsFormSchema,
  PaymentSchema,
  FileAttachmentSchema,
  SpecialitySchema,
  UserSpecialitySchema,
  HobbySchema,
  UserHobbySchema,
  UserEventEnrollmentSchema,
  UserEventEnrollmentFormSchema,
  ModuleSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  RequestVacationSchema
};

/** V1 TO DELETE
 * 
 * 
 
export const UserSchema = z.object({
    name: z.string({ message: "El nombre es requerido" }),
    lastname: z.string(),
    email: z.string().email(),
    photo: z.any(),
    phone_number: z.string(),
    office_address: z.string().optional(),
    service_hours: z.string().optional(),
    badge_number: z.string().optional(),
    birthday: z.date(),
    user_type: z.string(),
    user_grants: z.string(),
    entry_date: z.date().default(new Date()),
    visible_in_directory: z.boolean().default(false),
    role: z.enum(["USER", "ADMIN"]).default("USER"),
    fileAttachments: z.array().default([]),
    is_active: z.boolean().default(true)
});


const MAX_FILE_SIZE = 5000000;
const MAX_EVENT_FILE_SIZE = 50000000;
const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "pdf"];
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const EventSchema = z.object({
    name: z.string({ message: "El nombre es requerido" }),
    cost: z.string({ message: "El costo es requerido" }),
    description: z.string({ message: "La descripción es requerida" }),
    date: z.date(),
    location: z.string().optional(),
    event_type: z.string(),
    event_status: z.string(),
    banner_text: z.string(),
    event_url: z.string(),
    event_banner: z.any(),
    /*event_banner: z.any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, `El tamaño máximo del archivo debe ser 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png y .webp son los formatos soportados."
    ).optional(),
    event_file:z.any()
    .refine((file) => file?.size <= MAX_EVENT_FILE_SIZE, `El tamaño máximo del archivo debe ser 50MB.`)
    .refine(
      (file) => ACCEPTED_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png .webp y PDF son los formatos soportados."
    ).optional(),*/
/*   creatorId: z.number().optional(),
    is_active: z.boolean().default(true)
});

export const PaymentSchema = z.object({
  amount: z.string({ message: "El monto es requerido" }),
  payment_desc: z.string({ message: "La descripción es requerida" }),
  category: z.string({ message: "La categoría es requerida" }),
  debtorId: z.number({ message: "El deudor es requerido" }),
  creatorId: z.number({ message: "El id del creador es requerido" }),
  status: z.string().optional(),
  status_code: z.number().optional(),
  is_active: z.boolean().default(true)
});


export const ScientificSessionSchema = z.object({
  name: z.string(),
  description: z.string(),
  photo_url: z.string(),
  photo: z.string().optional(),
  link: z.string(),
  upload_date: z.string(),
  youtubeId: z.string(),
  show_in_web: z.boolean(),
  is_active: z.boolean(),
});

*/
