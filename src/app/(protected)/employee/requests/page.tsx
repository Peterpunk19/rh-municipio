"use client";

import EmployeeRequests from "@/app/(protected)/admin/employees-requests/page";
import { withEmployeeLayout } from "@/app/(protected)/employee/(home)/components/EmployeeLayoutWrapper";
import { ContentCard } from "@/app/(protected)/employee/(home)/components/ContentCard";
import { useCurrentUser } from "@/hooks/use-current-user";
import { header as employeeHeader } from "@/app/(protected)/employee/requests/(list)/Header";

const RequestsContent = () => {
  const { user } = useCurrentUser();

  return (
    <ContentCard>
      <EmployeeRequests role={user?.role_name} header={employeeHeader} />
    </ContentCard>
  );
};

export default withEmployeeLayout(RequestsContent, "Incidents", "Employee Incidents");
