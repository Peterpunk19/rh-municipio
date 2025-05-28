"use client";

import CustomCalendarAttendance from "@/components/customComponents/CustomCalendarAttendance";
import { withEmployeeLayout } from "@/app/(protected)/employee/(home)/components/EmployeeLayoutWrapper";
import { ContentCard } from "@/app/(protected)/employee/(home)/components/ContentCard";

const AttendanceContent = () => {
  return (
    <ContentCard>
      <CustomCalendarAttendance />
    </ContentCard>
  );
};

export default withEmployeeLayout(AttendanceContent, "Incidents", "Employee Incidents");
