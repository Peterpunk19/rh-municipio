import { z } from "zod";
import { EmployeeHiringSchema } from "./employee-hiring";
import { LocationSchema, AttendanceSchema } from "./catalogs";
import { UserSchema } from "./user";

export const EmployeeAttendanceSchema = z.object({
  id: z.number().int().positive(),
  check_in: z.date(),
  check_out: z.date(),
  active: z.boolean(),
  created_by_id: z.number().int(),
  location_id: z.number().int(),
  employee_hiring_id: z.number().int(),
  attendance_id: z.number().int(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  created_by: UserSchema,
  location: LocationSchema,
  employee_hiring: EmployeeHiringSchema,
  attendance: AttendanceSchema,
  employee_incidents: z.array(z.object({ id: z.number().int().positive() })).optional(),
});
