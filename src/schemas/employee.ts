import { validationMessages } from "@/common/validation/messages";
import { z } from "zod";

const rfcRegex = /^([A-ZÑ&]{3}|[A-Z][AEIOU][A-Z]{2})\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])[A-Z0-9]{3}$/;
const curpRegex =
  /^[A-Z][AEIOU][A-Z]{2}\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])[HM](AS|BC|BS|CC|CH|CL|CM|CS|DF|DG|GR|GT|HG|JC|MC|MN|MS|NL|NT|OC|PL|QR|QT|SL|SP|SR|TC|TL|TS|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[A-Z0-9]\d$/;

export const EmployeePostSchema = z.object({
  numberEmployee: z
    .string({ message: validationMessages.required("Número de empleado") })
    .min(1, { message: validationMessages.required("Número de empleado") })
    .max(6, { message: validationMessages.maxLength("Número de empleado", 6) }),
  name: z
    .string({ message: validationMessages.required("Nombre(s)") })
    .min(1, { message: validationMessages.required("Nombre(s)") })
    .max(255, { message: validationMessages.maxLength("Nombre(s)", 255) }),
  paternalLastName: z
    .string({ message: validationMessages.required("Apellido paterno") })
    .min(1, { message: validationMessages.required("Apellido paterno") })
    .max(255, { message: validationMessages.maxLength("Apellido paterno", 255) }),
  maternalLastName: z
    .string()
    .min(1, { message: validationMessages.required("Apellido materno") })
    .max(255, { message: validationMessages.maxLength("Apellido materno", 255) }),
  birthday: z.preprocess(
    (val) => {
      if (typeof val === "string" || val instanceof String) {
        const parsedDate = new Date(val as string);
        return isNaN(parsedDate.getTime()) ? undefined : parsedDate;
      }
      return val;
    },
    z.date({ message: validationMessages.invalidaFormat("Fecha de nacimiento") }),
  ),
  genderId: z.number({ message: validationMessages.number("Género") }),
  rfc: z
    .string()
    .min(1, { message: validationMessages.required("RFC") })
    .regex(rfcRegex, { message: validationMessages.invalidFormat("RFC") }),
  curp: z
    .string()
    .min(1, { message: validationMessages.required("CURP") })
    .regex(curpRegex, { message: validationMessages.invalidFormat("CURP") }),
});
