/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Action` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[day]` on the table `Day` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Departamento` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Direccion` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `EmployeeType` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Gender` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[hour]` on the table `Hour` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Incident` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `IncidentStatus` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Location` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Module` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Payroll` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Role` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Secretaria` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `StatusEmployee` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `display_name` to the `Role` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Role` ADD COLUMN `display_name` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Action_name_key` ON `Action`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `Category_name_key` ON `Category`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `Day_day_key` ON `Day`(`day`);

-- CreateIndex
CREATE UNIQUE INDEX `Departamento_name_key` ON `Departamento`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `Direccion_name_key` ON `Direccion`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `EmployeeType_name_key` ON `EmployeeType`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `Gender_name_key` ON `Gender`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `Hour_hour_key` ON `Hour`(`hour`);

-- CreateIndex
CREATE UNIQUE INDEX `Incident_name_key` ON `Incident`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `IncidentStatus_name_key` ON `IncidentStatus`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `Location_name_key` ON `Location`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `Module_name_key` ON `Module`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `Payroll_name_key` ON `Payroll`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `Role_name_key` ON `Role`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `Secretaria_name_key` ON `Secretaria`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `StatusEmployee_name_key` ON `StatusEmployee`(`name`);
