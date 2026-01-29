"use client";

import CustomCalendarAttendance from "@/components/customComponents/CustomCalendarAttendance";
import { withEmployeeLayout } from "@/app/(protected)/employee/(home)/components/EmployeeLayoutWrapper";
import { ContentCard } from "@/app/(protected)/employee/(home)/components/ContentCard";
import { useSession } from "next-auth/react";

const AttendanceContent = () => {
  const { data: session } = useSession();

  return (
    <ContentCard>
      <CustomCalendarAttendance
        employeeData={{
          id: session?.user.employee_id,
        }}
      />
    </ContentCard>
  );
};

export default withEmployeeLayout(AttendanceContent, "Incidents", "Employee Incidents");
