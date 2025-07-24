import React from "react";
import { Document, Page, Text, View, Image } from "@react-pdf/renderer";
import { formatDateToText } from "@/utils/formatter";
import { RequestChangeTemplateProps } from "./types";
import styles from "@/components/shared/pdfs/styles/RequestChangeStyle";

const EmployeeRequestChangeTemplate: React.FC<RequestChangeTemplateProps> = ({ data }) => {
  if (!data?.employee || !data?.destinationDirector || !data?.rhDirector || !data?.requestDetail?.new_direccion || !data?.changeDate) {
    throw new Error('Datos incompletos para generar el PDF');
  }

  const employeeName = `${data.employee.name} ${data.employee.paternal_last_name} ${data.employee.maternal_last_name}`;
  const destinationDirector = data.destinationDirector;
  const directorName = `${destinationDirector.name} ${destinationDirector.paternal_last_name} ${destinationDirector.maternal_last_name}`;
  const destinationDirection = data.requestDetail.new_direccion.display_name;
  const changeDate = formatDateToText(data.changeDate);
  const rhDirector = data.rhDirector;
  const rhDirectorName = `${rhDirector.name} ${rhDirector.paternal_last_name} ${rhDirector.maternal_last_name}`;
  
  const currentDate = formatDateToText(data.created_at, true);
  const officioNumber = `OM/DRH/${data.folio}/${new Date().getFullYear()}`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Background Image */}
        <View style={{ position: "absolute", top: 0, left: 0, right: -30, bottom: 0 }}>
          <Image src="/images/backgrounds/bg_rh.png" style={styles.backgroundImage} />
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Image src="/images/logos/logo_municipio_2024.jpg" style={styles.logo} />
          <View style={styles.headerTextContainer}>
            <View style={styles.leftTextContainer}>
              <Text style={styles.officialiaText}>OFICIALÍA</Text>
              <Text style={styles.mayorText}>MAYOR</Text>
            </View>
            <View style={styles.rightTextContainer}>
              <Text style={styles.direccionRecursosText}>DIRECCIÓN DE RECURSOS</Text>
              <Text style={styles.humanosText}>HUMANOS</Text>
            </View>
          </View>
        </View>

        {/* Year Text */}
        <Text style={styles.yearText}>"2025, AÑO DE ROSARIO CASTELLANOS FIGUEROA"</Text>

        {/* Date Section */}
        <View style={styles.dateSection}>
          <Text style={styles.date}>Tuxtla Gutiérrez, Chiapas a {currentDate}</Text>
          <Text style={styles.officeNumber}>Oficio N° {officioNumber}</Text>
        </View>

        {/* Recipient */}
        <View style={styles.recipient}>
          <Text style={styles.recipientName}>C. {employeeName.toUpperCase()}</Text>
          <Text style={styles.recipientTitle}>NÚMERO DE EMPLEADO {data.employee.number_employee}</Text>
          <Text style={styles.present}>PRESENTE</Text>
        </View>

        {/* Body */}
        <View style={styles.body}>
          <Text style={styles.bodyText}>
            En atención al Oficio N°. HAMTG/CM/{data.folio}/{new Date().getFullYear()}, mediante el cual solicitan se le autorice el cambio 
            de adscripción a la Dirección de {destinationDirection}; hago de su conocimiento que se autoriza 
            dicho movimiento; por lo que a partir de esta fecha deberá presentarse, bajo las órdenes del C. 
            {directorName.toUpperCase()}.
          </Text>

          <Text style={styles.bodyText}>
            Por lo anterior, a partir del {changeDate}, queda adscrito a la nómina de la 
            Dirección de {destinationDirection}.
          </Text>

          <Text style={styles.bodyText}>
            Exhortándolo a cumplir sus labores, con disposición, responsabilidad y ética, sujetándose a la 
            dirección de sus superiores de acuerdo a lo estipulado en el Artículo 52, de la Ley del Servicio Civil 
            del Estado y los Municipios de Chiapas.
          </Text>

          <Text style={styles.greeting}>
            Sin otro particular por el momento, reciba un cordial saludo.
          </Text>
        </View>

        {/* Signature */}
        <View style={styles.signature}>
          <Text style={styles.center}>ATENTAMENTE</Text>
          <View style={styles.signatureLine}>
            <Text style={styles.signatureName}>LIC. {rhDirectorName.toUpperCase()}</Text>
            <Text style={styles.signatureTitle}>DIRECTOR DE RECURSOS HUMANOS</Text>
          </View>
        </View>

        {/* Copy Section - después de la firma */}
        <View style={styles.copyText}>
          <Text>C.c.p.RAFAEL TIMOTEO FRANCO GURRIA OFICIAL MAYOR-Para su conocimiento</Text>
          <Text>Expediente del Trabajador</Text>
          <Text>Archivo/Minutario</Text>
          <Text>CFLM/SGH/LPC*</Text>
        </View>

        {/* Footer - al final con logo y dirección */}
        <View style={styles.footer}>
          <View style={styles.footerRow}>
            <View>
              <Text style={styles.footerText}>Calle Central S/N, Col. Centro, Tuxtla Gutiérrez, Chiapas. C.P. 29000</Text>
              <Text style={styles.footerText}>Atención: (961) 61 25511 | www.tuxtla.gob.mx</Text>
            </View>
            <Image src="/images/logos/municipio.png" style={styles.footerLogo} />
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default EmployeeRequestChangeTemplate;
