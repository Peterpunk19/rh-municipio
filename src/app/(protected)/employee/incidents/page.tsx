"use client";

import EmployeesIncidents from "@/app/(protected)/admin/employees-incidents/page";
import { withEmployeeLayout } from "@/app/(protected)/employee/(home)/components/EmployeeLayoutWrapper";
import { ContentCard } from "@/app/(protected)/employee/(home)/components/ContentCard";

const IncidentsContent = () => (
  <ContentCard>
    <EmployeesIncidents />
  </ContentCard>
);

export default withEmployeeLayout(IncidentsContent, "Incidents", "Employee Incidents");
