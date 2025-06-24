import React from "react";
import { Text, View } from "@react-pdf/renderer";
import { IncidentItemProps } from "./types";
import IncidentDays from "@/components/shared/pdfs/templates/incidents/IncidentDays";

const VacationIncident: React.FC<IncidentItemProps> = ({ data, styles }) => {
  return (
    <>
      <View style={styles.row}>
        <Text style={[styles.cell, styles.cellHeader, { flex: 1, textAlign: "left" }]}>TIPO DE INCIDENCIA</Text>
        <Text style={[styles.cell, styles.cellHeader, { flex: 2, textAlign: "left" }]}>FECHAS</Text>
        <Text style={[styles.cell, styles.cellHeader, styles.lastCell, { flex: 1, textAlign: "left" }]}>No. DÍAS</Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.cell, styles.uppercase, styles.italic, { flex: 1 }]}>{data.incident?.display_name}</Text>
        <IncidentDays data={data} styles={styles} />
        <Text style={[styles.cell, styles.uppercase, styles.italic, styles.lastCell, { flex: 1 }]}>
          {data.employee_incident_days.length}
        </Text>
      </View>
    </>
  );
};

export default VacationIncident;
