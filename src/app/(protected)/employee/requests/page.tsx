"use client";

import EmployeeRequests from "@/app/(protected)/admin/employees-requests/page";
import { withEmployeeLayout } from "@/app/(protected)/employee/(home)/components/EmployeeLayoutWrapper";
import { ContentCard } from "@/app/(protected)/employee/(home)/components/ContentCard";

const RequestsContent = () => (
  <ContentCard>
    <EmployeeRequests />
  </ContentCard>
);

export default withEmployeeLayout(RequestsContent, "Incidents", "Employee Incidents");
