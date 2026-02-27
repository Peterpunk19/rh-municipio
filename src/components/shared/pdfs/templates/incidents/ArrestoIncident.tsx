import { formatDate } from "@/utils/formatter";
import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import { IncidentData } from "@/components/shared/pdfs/templates/incidents/types";

interface ArrestoIncidentProps {
  data: IncidentData & {
    signatory?: {
      name: string;
      role: string;
    };
    immediateResponsible?: {
      name: string;
      role: string;
    };
    arrest_hours?: number;
  };
  directorName?: string;
}

const arrestoStyles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: "Helvetica",
    position: "relative",
    lineHeight: 1.6,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  headerLogoLeft: {
    width: 80,
    height: 80,
  },
  headerCenter: {
    flex: 1,
    textAlign: "center",
    paddingHorizontal: 10,
  },
  headerRight: {
    width: 140,
    textAlign: "right",
    fontSize: 9,
  },
  headerTitle: {
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  headerSubtitle: {
    fontSize: 9,
    textTransform: "uppercase",
  },
  dateSection: {
    textAlign: "right",
    fontSize: 10,
    marginBottom: 20,
    marginTop: 10,
    lineHeight: 1.5,
  },
  employeeInfo: {
    marginBottom: 5,
    fontSize: 11,
    lineHeight: 1.5,
  },
  bodyText: {
    fontSize: 11,
    textAlign: "justify",
    lineHeight: 1.5,
    marginBottom: 10,
  },
  boldText: {
    fontFamily: "Helvetica-Bold",
    fontWeight: "bold",
  },
  signatureSection: {
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  signatureLine: {
    marginTop: 5,
    fontSize: 10,
  },
  signatureName: {
    fontSize: 10,
    fontWeight: "bold",
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
  },
  signatureRole: {
    fontSize: 9,
    textTransform: "uppercase",
  },
  receiptSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 5,
  },
  receiptLeft: {
    width: "50%",
    fontSize: 10,
  },
  receiptRight: {
    width: "50%",
    textAlign: "right",
    fontSize: 10,
  },
  qualifiesSection: {
    textAlign: "center",
    marginTop: 10,
    marginBottom: 5,
  },
  ccpSection: {
    marginTop: 50,
    fontSize: 9,
  },
  footer: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    paddingHorizontal: 40,
  },
  footerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  footerAddress: {
    fontSize: 8,
    width: "60%",
  },
  footerLogo: {
    width: 100,
    height: 40,
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    opacity: 0.8,
  },
});

const ArrestoIncident: React.FC<ArrestoIncidentProps> = ({ data }) => {
  const employeeName =
    `${data.employee.name} ${data.employee.paternal_last_name} ${data.employee.maternal_last_name}`.toUpperCase();
  const immediateResponsibleName = data.immediateResponsible?.name || "";
  const immediateResponsibleRole = data.immediateResponsible?.role || "COMANDANTE OPERATIVO";
  const signatoryName = data.signatory?.name || "";
  const signatoryRole = data.signatory?.role || "DIRECTOR DE SEGURIDAD PÚBLICA MUNICIPAL";

  const startDate = data.start_date ? formatDate(data.start_date, "dd 'DE' MMMM 'DE' yyyy") : "";

  return (
    <Document>
      <Page size="A4" style={arrestoStyles.page}>
        <View style={{ position: "absolute", top: 0, left: 0, right: -30, bottom: 0 }}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image src="/images/backgrounds/bg_rh.png" style={arrestoStyles.backgroundImage} />
        </View>
        <View style={arrestoStyles.header}>
          <View style={{ flexDirection: "row", alignItems: "center", width: "35%" }}>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image src="/images/logos/logo_municipio_2024.jpg" />
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "40%",
              justifyContent: "center",
              paddingHorizontal: 5,
            }}
          >
            <View style={{ width: 55 }}>
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <Image src="/images/logos/seguridad_publica.png" style={{ width: 55, height: 55 }} />
            </View>
            <View style={{ lineHeight: 1, justifyContent: "center", flexDirection: "column" }}>
              <Text style={{ fontSize: 9 }}>SECRETARÍA DE</Text>
              <Text style={{ fontWeight: "bold", fontSize: 12, marginTop: -2 }}>SEGURIDAD PÚBLICA</Text>
              <Text style={{ fontWeight: "bold", fontSize: 9, marginTop: 0 }}>DE TUXTLA GUTIÉRREZ</Text>
            </View>
          </View>

          <View style={{ width: "25%", textAlign: "center", lineHeight: 1 }}>
            <Text style={{ fontWeight: "bold", fontSize: 8 }}>DIRECCIÓN DE</Text>
            <Text style={{ fontWeight: "bold", fontSize: 8 }}>SEGURIDAD PÚBLICA DE</Text>
            <Text style={{ fontWeight: "bold", fontSize: 8 }}>TUXTLA GUTIÉRREZ</Text>
          </View>
        </View>

        <View style={arrestoStyles.dateSection}>
          <Text>TUXTLA GUTIÉRREZ, CHIAPAS.</Text>
          <Text>
            {startDate ? startDate.toUpperCase() : formatDate(data.created_at, "dd 'DE' MMMM 'DE' yyyy").toUpperCase()}
          </Text>
          <Text style={arrestoStyles.boldText}>ASUNTO: CORRECTIVO DISCIPLINARIO.</Text>
        </View>

        <View style={arrestoStyles.employeeInfo}>
          <Text>C. {employeeName}.</Text>
          <Text>NUM. DE ORDEN: {data.folio}.</Text>
          <Text>POLICÍA.</Text>
          <Text>PRESENTE.</Text>
        </View>

        <View style={{ marginTop: 10 }}>
          <Text style={arrestoStyles.bodyText}>
            CON FUNDAMENTO EN LOS{" "}
            <Text style={arrestoStyles.boldText}>ARTÍCULOS 53 FRACCION II; 55 Y DEMÁS RELATIVOS</Text> Y DEL REGLAMENTO
            INTERNO DE LA SECRETARÍA DE SEGURIDAD PÚBLICA Y TRÁNSITO MUNICIPAL DE TUXTLA GUTIÉRREZ, CHIAPAS, SIRVA
            PRESENTARSE A CUMPLIR CORRECTIVO DISCIPLINARIO, EN EL LUGAR QUE OCUPA LA GUARDIA EN PREVENCIÓN DE LA
            SECRETARÍA DE SEGURIDAD PÚBLICA Y TRÁNSITO MUNICIPAL A LAS ORDENES Y ACTIVIDADES QUE DETERMINE EL OFICIAL DE
            CUARTEL EN TURNO DE DICHA GUARDIA EN PREVENCIÓN, POR FALTAS GRAVES A LA DISCIPLINA CONSISTENTE EN:{" "}
            <Text style={arrestoStyles.boldText}>{data.description?.toUpperCase() || ""}</Text>
          </Text>
        </View>

        <View style={arrestoStyles.signatureSection}>
          <Text style={{ fontSize: 11, marginBottom: 15 }}>Atentamente.</Text>
          <Text style={arrestoStyles.signatureLine}>_____________________________</Text>
          <Text style={arrestoStyles.signatureName}>C. {immediateResponsibleName}</Text>
          <Text style={arrestoStyles.signatureRole}>{immediateResponsibleRole}</Text>
        </View>

        <View style={arrestoStyles.receiptSection}>
          <View style={arrestoStyles.receiptLeft}>
            <Text>RECIBÍ A LAS: ___________</Text>
            <Text>FECHA: {formatDate(data.created_at, "dd/MM/yyyy")}</Text>
            <Text>FIRMA: ___________</Text>
          </View>
          <View style={arrestoStyles.receiptRight}>
            <Text>
              IMPÓNGASE <Text style={arrestoStyles.boldText}>____</Text> HORAS.
            </Text>
          </View>
        </View>

        <View style={arrestoStyles.qualifiesSection}>
          <Text style={{ fontSize: 11, fontWeight: "bold", fontFamily: "Helvetica-Bold", marginBottom: 10 }}>
            CALIFICA.
          </Text>
          <Text style={arrestoStyles.signatureLine}>_____________________________</Text>
          <Text style={[arrestoStyles.signatureName, { marginTop: 5 }]}>{signatoryName}</Text>
          <Text style={arrestoStyles.signatureRole}>{signatoryRole}</Text>
        </View>

        <View style={arrestoStyles.ccpSection}>
          <Text>C.C.P.- EXPEDIENTE/ MINUTARIO.</Text>
          <Text>C.C.P.- GUARDIA EN PREVENCIÓN.</Text>
        </View>

        <View style={arrestoStyles.footer}>
          <View style={arrestoStyles.footerTop}>
            <View style={arrestoStyles.footerAddress}>
              <Text>Blvd. Salomón González Blanco, esquina Blvd. Tuchtlán S/N,</Text>
              <Text>Fraccionamiento Las Torres, de Tuxtla Gutiérrez, Chiapas.</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ArrestoIncident;
