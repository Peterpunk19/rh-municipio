"use client";

import EmployeesIncidents from "@/app/(protected)/admin/employees-incidents/page";
import { withEmployeeLayout } from "@/app/(protected)/employee/(home)/components/EmployeeLayoutWrapper";
import { ContentCard } from "@/app/(protected)/employee/(home)/components/ContentCard";
import { useCurrentUser } from "@/hooks/use-current-user";

const IncidentsContent = () => {
  const { user } = useCurrentUser();

  return (
    <ContentCard>
      <EmployeesIncidents role={user?.role_name} />
    </ContentCard>
  );
};

export default withEmployeeLayout(IncidentsContent, "Incidents", "Employee Incidents");
