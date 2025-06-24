import React from "react";
import { Text } from "@react-pdf/renderer";
import { formatDate } from "@/utils/formatter";
import { IncidentItemProps } from "./types";

const IncidentDays: React.FC<IncidentItemProps> = ({ data, styles }) => {
  return (
    <Text style={[styles.cell, styles.uppercase, styles.italic, { flex: 2 }]}>
      {data.incident?.type ?
        data.employee_incident_days
          .map((days: any) => formatDate(days.date, "dd/MM/yyyy"))
          .join(" - ")
        : formatDate(data.start_date, "dd/MM/yyyy") === formatDate(data.end_date, "dd/MM/yyyy")
          ? formatDate(data.start_date, "dd/MM/yyyy")
          : `${formatDate(data.start_date, "dd/MM/yyyy")} - ${formatDate(data.end_date, "dd/MM/yyyy")}`
      }
    </Text>
  );
};

export default IncidentDays;
