import React from "react";
import { Document, Page, View, Text, Image } from "@react-pdf/renderer";
import styles from "@/components/shared/pdfs/styles/AttendanceStyle";
import { formatDate, formatScheduleText } from "@/utils/formatter";

type AttendanceItem = {
  check_in: string | Date | null;
  check_out: string | Date | null;
  location?: { display_name?: string };
  type_attendance?: { display_name?: string };
  employee?: {
    fullName?: string;
    number_employee?: string;
  };
  organism_public?: { display_name?: string };
  organism_administrative?: { display_name?: string };
};

interface AttendanceReportData {
  items: AttendanceItem[];
  title?: string;
}

const urlLogo = `${process.env.NEXT_PUBLIC_BASE_URL}/images/logos/municipio.png`;
const urlBackground = `${process.env.NEXT_PUBLIC_BASE_URL}/images/backgrounds/bg_rh.png`;

const AttendanceReportTemplate: React.FC<{ data: AttendanceReportData }> = ({ data }) => {
  const employeeData = data?.employeeData;

  const rows: Array<{
    date: string | Date;
    entry?: string | Date | null;
    exit?: string | Date | null;
    mode: string;
    location: string;
  }> = [];
  data.items.forEach((it) => {
    const date = (it.check_in || it.check_out) as any;
    rows.push({
      date,
      entry: it.check_in,
      exit: it.check_out,
      mode: (it.type_attendance?.display_name as any) || "",
      location: (it.location?.display_name as any) || "",
    });
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} fixed>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image src={urlBackground} style={styles.backgroundImage} />
        </View>

        <View style={styles.header} fixed>
          <View style={styles.logo}>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image src={urlLogo} />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.titleBold}>H. AYUNTAMIENTO CONSTITUCIONAL DE TUXTLA GUTIÉRREZ</Text>
            <Text style={styles.titleBold}>OFICIALIA MAYOR</Text>
            <Text style={styles.titleBold}>Dirección de Recursos Humanos</Text>
            <Text style={styles.titleBold}>Departamento de Control de Incidencias</Text>
            <Text style={[styles.titleBold, { marginTop: 4 }]}>REPORTE DE ASISTENCIAS</Text>
          </View>
        </View>

        <View style={[styles.bodyContainer, { marginBottom: 10 }]}>
          <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
            <Text>
              <Text style={styles.boldText}>NOMBRE COMPLETO: </Text>
              <Text>
                {[employeeData?.name, employeeData?.paternal_last_name, employeeData?.maternal_last_name]
                  .filter(Boolean)
                  .join(" ") || "No disponible"}
              </Text>
            </Text>
            <Text>
              <Text style={styles.boldText}>NUM. DE EMP. </Text>
              <Text>{employeeData?.number_employee}</Text>
            </Text>
          </View>
          <Text>
            <Text style={styles.boldText}>SECRETARÍA: </Text>
            <Text>{employeeData?.employee_hiring[0]?.direccion?.secretaria?.display_name}</Text>
          </Text>
          <Text>
            <Text style={styles.boldText}>DIRECTOR: </Text>
            <Text>{employeeData?.employee_hiring[0]?.direccion?.display_name}</Text>
          </Text>
          <View style={styles.row}>
            <Text style={[styles.boldText, styles.labelCol]}>HORARIO:</Text>
            <Text style={styles.valueCol}>{formatScheduleText(employeeData?.job_schedule_employee)}</Text>
          </View>
        </View>

        <View style={[styles.bodyContainer, styles.table]}>
          <View style={styles.tableHeaderRow}>
            <View style={[styles.cellView, styles.colDate]}>
              <Text style={[styles.cellText, styles.boldText]}>FECHA</Text>
            </View>
            <View style={[styles.cellView, styles.colEntry]}>
              <Text style={[styles.cellText, styles.boldText]}>ENTRADA</Text>
            </View>
            <View style={[styles.cellView, styles.colExit]}>
              <Text style={[styles.cellText, styles.boldText]}>SALIDA</Text>
            </View>
            <View style={[styles.cellView, styles.colMode]}>
              <Text style={[styles.cellText, styles.boldText]}>MODO DE CHECADO</Text>
            </View>
            <View style={[styles.cellView, styles.colLocation, styles.lastCell]}>
              <Text style={[styles.cellText, styles.boldText]}>UBICACIÓN</Text>
            </View>
          </View>
          {rows.map((r, idx) => (
            <View key={idx} style={[styles.tableRow, idx === rows.length - 1 ? styles.lastRow : {}]} wrap={false}>
              <View style={[styles.cellView, styles.colDate]}>
                <Text style={styles.cellText}>{formatDate(r.date, "dd/MM/yyyy")}</Text>
              </View>
              <View style={[styles.cellView, styles.colEntry]}>
                <Text style={styles.cellText}>{r.entry ? formatDate(r.entry as any, "HH:mm:ss") : ""}</Text>
              </View>
              <View style={[styles.cellView, styles.colExit]}>
                <Text style={styles.cellText}>{r.exit ? formatDate(r.exit as any, "HH:mm:ss") : ""}</Text>
              </View>
              <View style={[styles.cellView, styles.colMode]}>
                <Text style={styles.cellText}>{r.mode}</Text>
              </View>
              <View style={[styles.cellView, styles.colLocation, styles.lastCell]}>
                <Text style={styles.cellText}>{r.location}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.footer} fixed>
          <Text>Calle Central S/N, Col. Centro, Tuxtla Gutiérrez, Chiapas. C.P. 29000</Text>
          <Text>Atención: (961) 61 25511 | www.tuxtla.gob.mx</Text>
        </View>

        <Text
          style={{ position: "absolute", bottom: 10, right: 30, fontSize: 10, fontStyle: "italic" }}
          render={({ pageNumber }) => `Página ${pageNumber}`}
          fixed
        />
      </Page>
    </Document>
  );
};

export default AttendanceReportTemplate;
