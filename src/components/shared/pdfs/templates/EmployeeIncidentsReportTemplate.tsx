import React from "react";
import { Document, Page, View, Text, Image } from "@react-pdf/renderer";
import styles from "@/components/shared/pdfs/styles/EmployeeIncidentsReportsStyle";
import {formatDate, formatDateToText} from "@/utils/formatter";

type EmployeeIncidentItem = {
  employee: {
    number_employee: string;
    name: string;
    paternal_last_name: string;
    maternal_last_name: string;
  };
  oficio: string;
  incident: {
    display_name: string;
  };
  incident_status: {
    display_name: string;
  };
  start_date: string | Date | null;
  end_date: string | Date | null;
  created_at: string | Date | null;
};

interface EmployeeIncidentReportsData {
  items: EmployeeIncidentItem[];
  date: string;
}

const urlLogo = `${process.env.NEXT_PUBLIC_BASE_URL}/images/logos/logo_municipio_2024.jpg`;

const EmployeeIncidentsReportTemplate: React.FC<{ data: EmployeeIncidentReportsData }> = ({ data }) => {
  const rows = data.items;
  const date = data.date;

  let n = 1;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.logoSection}>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image src={urlLogo} style={styles.logoImage} />
          </View>
          <View style={styles.centerSection}>
            <Text style={styles.titleBold}>H. AYUNTAMIENTO DE TUXTLA GUTIÉRREZ</Text>
            <Text style={styles.titleBold}>OFICIALIA MAYOR</Text>
            <Text style={styles.titleBold}>DIRECCIÓN DE RECURSOS HUMANOS</Text>
            <Text style={[styles.titleBold, { marginTop: 10 }]}>REPORTE DEL {formatDateToText(date, true).toUpperCase()}</Text>
          </View>
          <View style={styles.rightSection} />
        </View>

        <View style={[styles.bodyContainer, styles.table]}>
          <View style={styles.tableHeaderRow}>
            <View style={[styles.cellView, styles.colIncrement]}>
              <Text style={[styles.cellText, styles.boldText]}>#</Text>
            </View>
            <View style={[styles.cellView, styles.colNumberEmployee]}>
              <Text style={[styles.cellText, styles.boldText]}>N <br/> EMPLEADO</Text>
            </View>
            <View style={[styles.cellView, styles.colFullName]}>
              <Text style={[styles.cellText, styles.boldText]}>NOMBRE</Text>
            </View>
            <View style={[styles.cellView, styles.colOficio]}>
              <Text style={[styles.cellText, styles.boldText]}>OFICIO O LIC. MEDICA</Text>
            </View>
            <View style={[styles.cellView, styles.colIncident]}>
              <Text style={[styles.cellText, styles.boldText]}>INCIDENCIA</Text>
            </View>
            <View style={[styles.cellView, styles.colDate]}>
              <Text style={[styles.cellText, styles.boldText]}>FECHA CAPTURA</Text>
            </View>
            <View style={[styles.cellView, styles.colDate]}>
              <Text style={[styles.cellText, styles.boldText]}>FECHA INICIAL</Text>
            </View>
            <View style={[styles.cellView, styles.colDate]}>
              <Text style={[styles.cellText, styles.boldText]}>FECHA FINAL</Text>
            </View>
            <View style={[styles.cellView, styles.colStatus, styles.lastCell]}>
              <Text style={[styles.cellText, styles.boldText]}>ESTATUS</Text>
            </View>
          </View>
          {rows.map((r, idx) => (
            <View key={idx} style={[styles.tableRow, idx === rows.length - 1 ? styles.lastRow : {}]} wrap={false}>
              <View style={[styles.cellView, styles.colIncrement]}>
                <Text style={styles.cellText}>{n++}</Text>
              </View>
              <View style={[styles.cellView, styles.colNumberEmployee]}>
                <Text style={styles.cellText}>{r.employee.number_employee}</Text>
              </View>
              <View style={[styles.cellView, styles.colFullName]}>
                <Text style={styles.cellText}>{`${r.employee.name} ${r.employee.paternal_last_name} ${r.employee.maternal_last_name}`}</Text>
              </View>
              <View style={[styles.cellView, styles.colOficio]}>
                <Text style={styles.cellText}>{r.oficio}</Text>
              </View>
              <View style={[styles.cellView, styles.colIncident]}>
                <Text style={styles.cellText}>{r.incident.display_name}</Text>
              </View>
              <View style={[styles.cellView, styles.colDate]}>
                <Text style={styles.cellText}>{formatDate(r.created_at as any, "dd/MM/yyyy")}</Text>
              </View>
              <View style={[styles.cellView, styles.colDate]}>
                <Text style={styles.cellText}>{formatDate(r.start_date as any, "dd/MM/yyyy")}</Text>
              </View>
              <View style={[styles.cellView, styles.colDate]}>
                <Text style={styles.cellText}>{formatDate(r.end_date as any, "dd/MM/yyyy")}</Text>
              </View>

              <View style={[styles.cellView, styles.colStatus, styles.lastCell]}>
                <Text style={styles.cellText}>{r.incident_status.display_name}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text>Calle Central S/N, Col. Centro, Tuxtla Gutiérrez, Chiapas. C.P. 29000</Text>
          <Text>Atención: (961) 61 25511 | www.tuxtla.gob.mx</Text>
        </View>
      </Page>
    </Document>
  );
};

export default EmployeeIncidentsReportTemplate;
