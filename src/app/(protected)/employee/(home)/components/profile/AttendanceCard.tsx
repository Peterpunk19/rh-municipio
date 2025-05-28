"use client";
import React from "react";
import CustomCalendarAttendance from "@/components/customComponents/CustomCalendarAttendance";

const AttendanceCard = ({ employeeId }: { employeeId: any }) => {
  return <CustomCalendarAttendance employeeId={employeeId} />;
};

export default AttendanceCard;
