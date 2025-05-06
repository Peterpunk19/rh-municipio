import { formatDate } from "@/utils/formatter";
import { Document, Page, Text, View, Image } from "@react-pdf/renderer";
import { generateQRBase64 } from "@/utils/qr";
import { IncidentData, INCIDENT_COMPONENTS } from "./incidents/types";
import { IncidentTypes } from "@/common/constants/IncidentTypes";
import styles from "@/components/shared/pdfs/styles/IncidentStyle";

const IncidentTemplate: React.FC<{ data: IncidentData }> = ({ data }) => {
  const qrData = JSON.stringify({
    oficio: data.oficio,
    empleado: data.employee?.name,
    fecha: data.start_date,
    tipo: data.incident?.display_name,
  });
  const qrBase64 = generateQRBase64(qrData);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={{ position: "absolute", top: 0, left: 0, right: -30, bottom: 0 }}>
          <Image src="/images/backgrounds/bg_rh.png" style={styles.backgroundImage} />
        </View>
        <View style={styles.header}>
          <View style={styles.logo}>
            <Image src="/images/logos/municipio.png" />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={[styles.title, styles.italic]}>H. AYUNTAMIENTO DE TUXTLA GUTIÉRREZ, CHIAPAS</Text>
            <Text style={[styles.title, styles.italic]}>OFICIALIA MAYOR</Text>
            <Text style={[styles.title, styles.italic]}>DIRECCIÓN DE RECURSOS HUMANOS</Text>
            <Text style={[styles.title, styles.italic]}>DEPARTAMENTO DE CONTROL DE INCIDENCIAS</Text>
            <Text style={[styles.titleBold]}>FORMATO ÚNICO DE INCIDENCIA ELECTRÓNICO</Text>
          </View>
          <View style={styles.subheaderTextContainer}>
            <Text style={[styles.italic, { fontSize: 11 }]}>
              Secretaría y/o Dirección:{" "}
              <Text
                style={{ textTransform: "uppercase" }}
              >{`Dirección de ${data.employee.employee_hiring[0]?.direccion?.display_name}`}</Text>
            </Text>
            <Text style={[styles.italic, { fontSize: 11 }]}>
              Fecha: {formatDate(data.created_at, "dd/MM/yyyy HH:mm")}
            </Text>
            <Text style={{ fontSize: 12, fontWeight: "bold" }}>Folio Electrónico: {data.folio}</Text>
          </View>
        </View>

        <Text style={styles.tableTitle}>DATOS ACTUALES DEL TRABAJADOR</Text>
        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={[styles.cell, styles.cellHeader, { flex: 1 }]}>No. EMPLEADO</Text>
            <Text style={[styles.cell, styles.cellHeader, styles.lastCell, { flex: 3 }]}>NOMBRE COMPLETO</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.cell, styles.center, styles.italic, { flex: 1 }]}>
              {data.employee.number_employee}
            </Text>
            <Text
              style={[styles.cell, styles.center, styles.uppercase, styles.italic, styles.lastCell, { flex: 3 }]}
            >{`${data.employee.name} ${data.employee.paternal_last_name} ${data.employee.maternal_last_name}`}</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.cell, styles.cellHeader, { flex: 2 }]}>UBICACIÓN</Text>
            <Text style={[styles.cell, styles.cellHeader, styles.lastCell, { flex: 1 }]}>TIPO DE EMPLEADO</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.cell, styles.center, styles.uppercase, styles.italic, { flex: 2 }]}>
              {data.employee.employee_location[0]?.location?.display_name}
            </Text>
            <Text style={[styles.cell, styles.center, styles.uppercase, styles.italic, styles.lastCell, { flex: 1 }]}>
              {data.employee.employee_hiring[0]?.employee_type?.display_name}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.cell, styles.cellHeader, styles.lastCell, { flex: 3 }]}>
              DIRECCIÓN y/o COORDINACIÓN
            </Text>
          </View>
          <View style={styles.row}>
            <Text
              style={[styles.cell, styles.center, styles.uppercase, styles.italic, styles.lastCell, { flex: 3 }]}
            >{`Dirección de ${data.employee.employee_hiring[0]?.direccion?.display_name}`}</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.cell, styles.cellHeader, styles.lastCell, { flex: 3 }]}>SECRETARÍA</Text>
          </View>
          <View style={styles.row}>
            <Text
              style={[
                styles.cell,
                styles.center,
                styles.uppercase,
                styles.italic,
                styles.lastCell,
                styles.lastRow,
                { flex: 3 },
              ]}
            >
              {data.employee.employee_hiring[0]?.direccion?.secretaria?.display_name}
            </Text>
          </View>
        </View>

        <Text style={styles.tableTitle}>JORNADA DE TRABAJO</Text>
        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={[styles.cell, styles.cellHeader, { flex: 1 }]}>JORNADA</Text>
            <Text style={[styles.cell, styles.cellHeader, { flex: 1 }]}>HORA DE ENTRADA</Text>
            <Text style={[styles.cell, styles.cellHeader, { flex: 1 }]}>HORA DE SALIDA</Text>
            <Text style={[styles.cell, styles.cellHeader, styles.lastCell, { flex: 1 }]}>REGISTRO DE ASISTENCIAS</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.cell, styles.center, styles.uppercase, styles.italic, styles.lastRow, { flex: 1 }]}>
              {data.jornada}
            </Text>
            <Text style={[styles.cell, styles.center, styles.uppercase, styles.italic, styles.lastRow, { flex: 1 }]}>
              {data.entrada}
            </Text>
            <Text style={[styles.cell, styles.center, styles.uppercase, styles.italic, styles.lastRow, { flex: 1 }]}>
              {data.salida}
            </Text>
            <Text
              style={[
                styles.cell,
                styles.center,
                styles.uppercase,
                styles.italic,
                styles.lastCell,
                styles.lastRow,
                { flex: 1 },
              ]}
            >
              {data.registro}
            </Text>
          </View>
        </View>

        <Text style={styles.tableTitle}>DATOS DE LA INCIDENCIA</Text>
        <View style={styles.table}>
          {(() => {
            const incidentName = data.incident?.name as IncidentTypes;
            const IncidentComponent =
              incidentName && INCIDENT_COMPONENTS[incidentName]
                ? INCIDENT_COMPONENTS[incidentName]
                : INCIDENT_COMPONENTS[IncidentTypes.JUSTIFICACION_SALIDA];

            return <IncidentComponent data={data} styles={styles} />;
          })()}

          <View style={styles.row}>
            <Text style={[styles.cell, styles.cellHeader, styles.lastCell, { flex: 1 }]}>Justificación</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.cell, styles.uppercase, styles.italic, styles.lastCell, { flex: 1 }]}>
              {data.description}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={[styles.cell, styles.lastCell, { flex: 1, borderBottom: "none", fontWeight: "bold" }]}>
              Observación de la Dirección de Recursos Humanos:
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.cell, styles.lastCell, styles.lastRow, { flex: 1, padding: 6 }]}></Text>
          </View>
        </View>

        <View style={styles.qrSection}>
          <View style={styles.qrBox}>
            <Image src={qrBase64} style={{ width: 80, height: 80 }} />
          </View>

          <View style={styles.signatureBoxQR}>
            <Text style={styles.firmaLineaQR}>_____________________________</Text>
            <Text style={styles.firmaTextQR}>Firma del Trabajador</Text>
            <Text style={[styles.firmaTextQR, styles.italic]}>
              El formato fue requisitado y validado previamente por el trabajador.
            </Text>
          </View>

          <View style={styles.selloBox}>
            <Image src="/images/sello.jpg" style={styles.selloImage} />
            <Text style={{ fontSize: 10, position: "absolute", bottom: 36, left: -10 }}>
              {formatDate(data.created_at, "dd/MM/yyyy")}
            </Text>
          </View>
        </View>

        <View style={styles.authorizationSection}>
          <Text style={{ fontSize: 14, fontWeight: "bold" }}>AUTORIZACIONES</Text>
        </View>

        <View style={styles.signatureSection}>
          <View style={[styles.signatureBox, { width: "30%" }]}>
            <Text>_____________________________</Text>
            <Text style={{ fontSize: 8, fontWeight: "bold" }}>Responsable Inmediato</Text>
          </View>
          <View style={[styles.signatureBox, { width: "40%" }]}>
            <Text style={{ fontSize: 8, fontWeight: "bold", marginBottom: 5 }}>
              C. EDUARDO MAXIMILIANO GARCIA BETANZOS
            </Text>
            <Text>_____________________________</Text>
            <Text style={{ fontSize: 8, fontWeight: "bold" }}>Secretario y/o Director</Text>
          </View>
          <View style={[styles.signatureBox, { width: "30%" }]}>
            <Text style={{ fontSize: 8, fontWeight: "bold", marginBottom: 5 }}>ANA LILIA GUTIERREZ HERNANDEZ</Text>
            <Text>_____________________________</Text>
            <Text style={{ fontSize: 8, fontWeight: "bold" }}>Responsable del control de incidencias</Text>
          </View>
        </View>

        <Text style={styles.footerText}>
          El presente Formato Único de Incidencia Electrónica se encuentra en revisión por el Departamento de Control de
          Incidencias de la Dirección de Recursos Humanos. Una vez recibida la versión impresa, debidamente firmada y
          sellada por el titular de su área, se procederá a su revisión y seguimiento correspondiente.
        </Text>
        <View style={styles.footer}>
          <Text>Calle Central S/N, Col. Centro, Tuxtla Gutiérrez, Chiapas. C.P. 29000</Text>
          <Text>Atención: (961) 61 25511 | www.tuxtla.gob.mx</Text>
        </View>
      </Page>
    </Document>
  );
};

export default IncidentTemplate;
