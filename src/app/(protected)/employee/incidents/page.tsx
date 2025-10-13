"use client";

import EmployeesIncidents from "@/app/(protected)/admin/employees-incidents/EmployeesIncidents";
import { withEmployeeLayout } from "@/app/(protected)/employee/(home)/components/EmployeeLayoutWrapper";
import { ContentCard } from "@/app/(protected)/employee/(home)/components/ContentCard";
import { useCurrentUser } from "@/hooks/use-current-user";
import { header as employeeHeader } from "./(list)/Header";

const IncidentsContent = () => {
  const { user } = useCurrentUser();

  return (
    <ContentCard>
      <EmployeesIncidents role={user?.role_name} header={employeeHeader} />
    </ContentCard>
  );
};

export default withEmployeeLayout(IncidentsContent, "Incidents", "Employee Incidents");
