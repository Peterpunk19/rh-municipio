import React from "react";
import { Text, View } from "@react-pdf/renderer";
import { formatDateToText } from "@/utils/formatter";
import { RequestTemplateProps } from "./types";

const UnionLeave: React.FC<RequestTemplateProps> = ({ data, styles }) => {
  const employeeName = `${data.employee.name} ${data.employee.paternal_last_name} ${data.employee.maternal_last_name}`;
  const leaveDate = formatDateToText(data.leaveDate);
  const changeDate = formatDateToText(data.changeDate);
  const rhDirector = data?.rhDirector;
  const rhDirectorName = `${rhDirector?.name} ${rhDirector?.paternal_last_name} ${rhDirector?.maternal_last_name}`;

  const currentDate = formatDateToText(data.created_at, true);
  const officioNumber = data.folio ? `OM/DRH/${data.folio}/${new Date().getFullYear()}` : "";

  return (
    <>
      <Text style={styles?.yearText}>&quot;2025, AÑO DE ROSARIO CASTELLANOS FIGUEROA&quot;</Text>
      <View style={styles?.bodyContainer}>
        <View style={styles?.dateSection}>
          <Text style={styles?.date}>Tuxtla Gutiérrez, Chiapas a {currentDate}</Text>
          <Text style={styles?.officeNumber}>Oficio N° {officioNumber}</Text>
        </View>

        <View style={styles?.recipient}>
          <Text style={styles?.recipientName}>C. {employeeName.toUpperCase()}</Text>
          <Text style={styles?.recipientTitle}>NÚMERO DE EMPLEADO {data.employee.number_employee}</Text>
          <Text style={styles?.present}>PRESENTE</Text>
        </View>

        <View style={styles?.bodyText}>
          <Text>
            En atención a su Oficio N°. SEAT/{data.folio}/{new Date().getFullYear()} recepcionado el día {currentDate},
            se le autoriza
          </Text>
        </View>

        <View style={{ fontSize: 16, fontWeight: "bold", textAlign: "center", marginVertical: 15 }}>
          <Text>LICENCIA POR COMISIÓN SINDICAL</Text>
        </View>

        <View style={styles?.body}>
          <Text style={styles?.bodyText}>
            A partir del día {changeDate} hasta {leaveDate}, para el cumplimiento de las obligaciones sindicales en el
            Comité Ejecutivo, de acuerdo a la personalidad jurídica reconocida por el Tribunal del Trabajo Burocrático
            del Estado de Chiapas en la resolución del registro Núm. RS/01/2024. Solicito a usted presentarse al lugar
            antes señalado, debiendo registrar asistencia en los medios establecidos para tales efectos, cabe mencionar
            que, para darle prórroga a esta licencia, deberá solicitarse con 30 días de anticipación en esta Dirección.
          </Text>

          <Text style={styles?.greeting}>Sin otro particular por el momento, reciba un cordial saludo.</Text>
        </View>

        <View style={styles?.signature}>
          <Text style={styles?.center}>ATENTAMENTE</Text>
          <View style={styles?.signatureLine}>
            <Text style={styles?.signatureName}>LIC. {rhDirectorName.toUpperCase()}</Text>
            <Text style={styles?.signatureTitle}>DIRECTOR(A) DE RECURSOS HUMANOS</Text>
          </View>
        </View>

        <View style={styles?.copyText}>
          <Text>Javier Walter Avendaño Córdova.- Oficial Mayor.- Pasa su conocimiento.- Edificio.</Text>
          <Text>Lic. Ana Laura Mondragón Alavat.- Secretaria Técnica del Presidente.- Mismo fin.- Edificio.</Text>
          <Text>C.P. Efraín Díaz Tipa.- Coordinador General de Política Fiscal.- Mismo fin.- Ciudad.</Text>
          <Text>Expediente del Trabajador</Text>
          <Text>Minutario/Expediente</Text>
          <Text>LIC/NPG/ALGH/luvia*</Text>
        </View>
      </View>
    </>
  );
};

export default UnionLeave;
