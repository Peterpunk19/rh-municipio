import { Document, Page, View, Image, Text } from "@react-pdf/renderer";
import styles from "@/components/shared/pdfs/styles/MedicalValidityStyle";
import React from "react";
import { formatDate } from "@/utils/formatter";

const urlLogo = `${process.env.NEXT_PUBLIC_BASE_URL}/images/logos/logo.png`;
const urlBackground = `${process.env.NEXT_PUBLIC_BASE_URL}/images/backgrounds/bg_rh.png`;

interface MedicalValidityProps {
  data: any;
}

const MedicalValidity: React.FC<MedicalValidityProps> = ({ data }) => {
  if (!data) {
    throw new Error("Datos incompletos para generar el PDF");
  }

  const fullName = `${data.name} ${data.paternal_last_name} ${data.maternal_last_name}`;
  const category = data?.employee_hiring?.[0]?.category?.display_name || "";
  const secretary = data?.employee_ascriptions?.[0]?.direccion?.secretaria?.display_name || "";
  const direction = data?.employee_ascriptions?.[0]?.direccion?.display_name || "";
  const employeeType = data?.employee_hiring?.[0]?.employee_type?.display_name || "";
  const startDate = formatDate(data?.employee_hiring?.[0]?.start_job_date) || "";
  const endDate = formatDate(data?.employee_hiring?.[0]?.end_job_date) || "";
  const vigenciaEstado = data?.vigencia?.estado || "No disponible";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={{ position: "absolute", top: 0, left: 0, right: -30, bottom: 0 }}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image src={urlBackground} style={styles.backgroundImage} />
        </View>

        <View style={styles.header}>
          <View style={styles.logoSection}>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image src={urlLogo} style={styles.logoImage} />
          </View>
          <View>
            <Text style={styles.publicOrganization}>{secretary}</Text>
            <Text style={styles.administrativeOrganization}>{direction}</Text>
          </View>
        </View>

        <View style={styles.bodyContainer}>
          <Text style={styles.title}>VIGENCIA MÉDICA</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Datos del Asegurado</Text>
            <Text style={styles.bodyText}>
              <Text style={styles.boldText}>Nombre:</Text> {fullName}
            </Text>
            <Text style={styles.bodyText}>
              <Text style={styles.boldText}>CURP:</Text> {data.curp}
            </Text>
            <Text style={styles.bodyText}>
              <Text style={styles.boldText}>Fecha de nacimiento:</Text> {formatDate(data.birthday) || ""}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Datos del Trabajo</Text>
            <Text style={styles.bodyText}>
              <Text style={styles.boldText}>Adscripción:</Text> {secretary} / {direction}
            </Text>
            <Text style={styles.bodyText}>
              <Text style={styles.boldText}>Categoría:</Text> {category}
            </Text>
            <Text style={styles.bodyText}>
              <Text style={styles.boldText}>Tipo de contrato:</Text> {employeeType}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vigencia de Derechos</Text>
            <Text style={styles.bodyText}>
              <Text style={styles.boldText}>Estado:</Text> {vigenciaEstado}
            </Text>
            <Text style={styles.bodyText}>
              <Text style={styles.boldText}>Inicio:</Text> {startDate}
            </Text>
            <Text style={styles.bodyText}>
              <Text style={styles.boldText}>Fin:</Text> {endDate}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>Calle Central S/N, Col. Centro, Tuxtla Gutiérrez, Chiapas. C.P. 29000</Text>
          <Text>Atención: (961) 61 25511 | www.tuxtla.gob.mx</Text>
        </View>
      </Page>
    </Document>
  );
};

export default MedicalValidity;
