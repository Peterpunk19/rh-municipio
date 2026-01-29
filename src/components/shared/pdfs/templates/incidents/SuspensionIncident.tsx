import React from "react";
import { Text, View } from "@react-pdf/renderer";
import { formatDate } from "@/utils/formatter";
import { IncidentItemProps } from "./types";
import { calculateDaysBetweenDates } from "@/common/utils";

const SuspensionIncident: React.FC<IncidentItemProps> = ({ data, styles }) => {
  return (
    <>
      <View style={styles.row}>
        <Text style={[styles.cell, styles.cellHeader, { flex: 1, textAlign: "center" }]}>TIPO DE INCIDENCIA</Text>
        <Text style={[styles.cell, styles.cellHeader, { flex: 1, textAlign: "center" }]}>FECHA INICIO</Text>
        <Text style={[styles.cell, styles.cellHeader, { flex: 1, textAlign: "center" }]}>FECHA FINAL</Text>
        <Text style={[styles.cell, styles.cellHeader, styles.lastCell, { flex: 1, textAlign: "center" }]}>
          NO. DÍAS
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.cell, styles.uppercase, styles.italic, { flex: 1, textAlign: "center" }]}>
          {data.incident?.display_name}
        </Text>
        <Text style={[styles.cell, styles.uppercase, styles.italic, { flex: 1, textAlign: "center" }]}>
          {formatDate(data.start_date, "dd/MM/yyyy")}
        </Text>
        <Text style={[styles.cell, styles.uppercase, styles.italic, { flex: 1, textAlign: "center" }]}>
          {formatDate(data.end_date, "dd/MM/yyyy")}
        </Text>
        <Text style={[styles.cell, styles.uppercase, styles.italic, styles.lastCell, { flex: 1, textAlign: "center" }]}>
          {calculateDaysBetweenDates(
            formatDate(data.start_date, "dd/MM/yyyy"),
            formatDate(data.end_date, "dd/MM/yyyy"),
          )}
        </Text>
      </View>
    </>
  );
};

export default SuspensionIncident;
