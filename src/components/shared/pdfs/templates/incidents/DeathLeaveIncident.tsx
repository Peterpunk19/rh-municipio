import React from "react";
import { Text, View } from "@react-pdf/renderer";
import { formatDate } from "@/utils/formatter";
import { IncidentItemProps } from "./types";

const DeathLeaveIncident: React.FC<IncidentItemProps> = ({ data, styles }) => {
  return (
    <>
      <View style={styles.row}>
        <Text style={[styles.cell, styles.cellHeader, { flex: 1, textAlign: "left" }]}>TIPO DE INCIDENCIA</Text>
        <Text style={[styles.cell, styles.cellHeader, { flex: 1, textAlign: "left" }]}>FECHA DEL DECESO</Text>
        <Text style={[styles.cell, styles.cellHeader, { flex: 1, textAlign: "left" }]}>PARENTESCO</Text>
        <Text style={[styles.cell, styles.cellHeader, styles.lastCell, { flex: 1, textAlign: "left" }]}>
          DÍAS OTORGADOS
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.cell, styles.uppercase, styles.italic, { flex: 1 }]}>{data.incident?.display_name}</Text>
        <Text style={[styles.cell, styles.uppercase, styles.italic, { flex: 1 }]}>
          {formatDate(data.fecha_deceso || data.start_date, "dd/MM/yyyy")}
        </Text>
        <Text style={[styles.cell, styles.uppercase, styles.italic, { flex: 1 }]}>
          {data.parentesco || "NO ESPECIFICADO"}
        </Text>
        <Text style={[styles.cell, styles.uppercase, styles.italic, styles.lastCell, { flex: 1 }]}>
          {data.employee_incident_days.length}
        </Text>
      </View>
    </>
  );
};

export default DeathLeaveIncident;
