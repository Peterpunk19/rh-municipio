import { z } from "zod";
import { validationMessages } from "@/common/validation/messages";

export const IncidentsRolesPermissionsByIdSchema = z.object({
  id: z
    .number({ message: validationMessages.number("ID") })
    .min(1, { message: validationMessages.minNumber("ID", 1) })
    .max(999999999999999, { message: validationMessages.maxNumber("ID", 999999999999999) })
    .nullable(),
});

export const IncidentsRolesPermissionsUpdateStatusSchema = z.object({
  can_view: z.boolean().optional(),
  can_validate: z.boolean().optional(),
  can_create: z.boolean().optional(),
  can_approve: z.boolean().optional(),
  can_cancel: z.boolean().optional(),
  can_delete: z.boolean().optional(),
  can_reject: z.boolean().optional(),
  can_edit: z.boolean().optional(),
  active: z.boolean().optional(),
});
