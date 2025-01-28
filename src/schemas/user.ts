import { z } from "zod";

export const UserSchema = z.object({
  id: z.number().int().positive().optional(),
  uuid: z.string().optional(),
  username: z.string().min(1),
  password: z.string().min(1),
  set_password_key: z.string().min(1).optional().nullable(),
  create_at: z.date().optional(),
  updated_at: z.date().optional(),
  employee_id: z.number().int().optional(),
  role_id: z.number().int().positive().optional(),
  created_by_id: z.number().int().positive().optional().nullable(),

  /**
   * createdAt              DateTime?            @default(now())
  updatedAt              DateTime?            @updatedAt
  employee               Employee?            @relation(fields: [employee_id], references: [id])
  employee_id            Int?                 @unique
  role_id                Int                  @unique
  role                   Role                 @relation(fields: [role_id], references: [id])
  user_module_actions    UserModuleActions[]
  attendances_created_by EmployeeAttendance[]
  employee_incidents     EmployeeIncidents[]
  created_by             User?                @relation("UserCreatedBy", fields: [created_by_id], references: [id])
  created_by_id          Int?
  users_created          User[]    
   */
});
