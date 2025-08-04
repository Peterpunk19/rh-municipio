import React from "react";
import { Text, View } from "@react-pdf/renderer";
import { RequestTemplateProps } from "./types";
import { formatDateToText } from "@/utils/formatter";

const ChangeAdscription: React.FC<RequestTemplateProps> = ({ data, styles, type }) => {
  const employeeName = `${data.employee.name} ${data.employee.paternal_last_name} ${data.employee.maternal_last_name}`;
  const destinationDirector = data?.destinationDirector;
  const directorName = `${destinationDirector?.name} ${destinationDirector?.paternal_last_name} ${destinationDirector?.maternal_last_name}`;
  const destinationDirection = data.requestDetail?.new_direccion?.display_name;
  const changeDate = formatDateToText(data.changeDate);
  const rhDirector = data?.rhDirector;
  const rhDirectorName = `${rhDirector?.name} ${rhDirector?.paternal_last_name} ${rhDirector?.maternal_last_name}`;

  const currentDate = formatDateToText(data.created_at, true);
  const officioNumber = data.folio ? `OM/DRH/${data.folio}/${new Date().getFullYear()}` : "";

  return (
    <>
      {type === "director" && (
        <>
          <Text style={styles?.yearText}>"2025, AÑO DE ROSARIO CASTELLANOS FIGUEROA"</Text>
          <View style={styles?.bodyContainer}>
            <View style={styles?.dateSection}>
              <Text style={styles?.date}>Tuxtla Gutiérrez, Chiapas a {currentDate}</Text>
              <Text style={styles?.officeNumber}>Oficio N° {officioNumber}</Text>
            </View>

            <View style={styles?.recipient}>
              <Text style={styles?.recipientName}>C. {directorName.toUpperCase()}</Text>
              <Text style={styles?.recipientTitle}>DIRECTOR DE {destinationDirection?.toUpperCase()}</Text>
              <Text style={styles?.present}>PRESENTE</Text>
            </View>

            <View style={styles?.body}>
              <Text style={styles?.bodyText}>
                En atención a su Oficio N°. HAMTG/CM/{data.folio}/{new Date().getFullYear()}, mediante el cual solicitan
                se le autorice el cambio de adscripción a la Dirección a su cargo, hago de su conocimiento que la C.{" "}
                {employeeName.toUpperCase()}, con número de empleado {data?.employee?.number_employee}, a partir de esta
                fecha deberá presentarse, quedando adscrita a la Dirección a su digno, a partir del {changeDate}, para
                realizar las actividades que tenga bien encomendarle, por lo cual solicito a usted reportar a esta
                Dirección a mi cargo, el horario laboral y asistencia del mismo, para darle el debido seguimiento en el
                expediente personal.
              </Text>

              <Text style={styles?.greeting}>Sin otro particular por el momento, reciba un cordial saludo.</Text>
            </View>

            <View style={styles?.signature}>
              <Text style={styles?.center}>ATENTAMENTE</Text>
              <View style={styles?.signatureLine}>
                <Text style={styles?.signatureName}>LIC. {rhDirectorName.toUpperCase()}</Text>
                <Text style={styles?.signatureTitle}>DIRECTOR DE RECURSOS HUMANOS</Text>
              </View>
            </View>

            <View style={styles?.copyText}>
              <Text>C.c.p.RAFAEL TIMOTEO FRANCO GURRIA OFICIAL MAYOR-Para su conocimiento</Text>
              <Text>
                C. MARBELLA CRUZ LARA DIRECTORA DE AUDITORÍAS ADMINISTRATIVAS Y FINANCIERAS-Para su conocimiento
              </Text>
              <Text>Expediente del Trabajador</Text>
              <Text>Archivo/Minutario</Text>
              <Text>CFLM/SGH/LPC*</Text>
            </View>
          </View>
        </>
      )}

      {type === "employee" && (
        <>
          <Text style={styles?.yearText}>"2025, AÑO DE ROSARIO CASTELLANOS FIGUEROA"</Text>

          <View style={styles?.dateSection}>
            <Text style={styles?.date}>Tuxtla Gutiérrez, Chiapas a {currentDate}</Text>
            <Text style={styles?.officeNumber}>Oficio N° {officioNumber}</Text>
          </View>

          <View style={styles?.recipient}>
            <Text style={styles?.recipientName}>C. {employeeName.toUpperCase()}</Text>
            <Text style={styles?.recipientTitle}>NÚMERO DE EMPLEADO {data.employee.number_employee}</Text>
            <Text style={styles?.present}>PRESENTE</Text>
          </View>

          <View style={styles?.body}>
            <Text style={styles?.bodyText}>
              En atención al Oficio N°. HAMTG/CM/{data.folio}/{new Date().getFullYear()}, mediante el cual solicitan se
              le autorice el cambio de adscripción a la Dirección de {destinationDirection}; hago de su conocimiento que
              se autoriza dicho movimiento; por lo que a partir de esta fecha deberá presentarse, bajo las órdenes del
              C.
              {directorName.toUpperCase()}.
            </Text>

            <Text style={styles?.bodyText}>
              Por lo anterior, a partir del {changeDate}, queda adscrito a la nómina de la Dirección de{" "}
              {destinationDirection}.
            </Text>

            <Text style={styles?.bodyText}>
              Exhortándolo a cumplir sus labores, con disposición, responsabilidad y ética, sujetándose a la dirección
              de sus superiores de acuerdo a lo estipulado en el Artículo 52, de la Ley del Servicio Civil del Estado y
              los Municipios de Chiapas.
            </Text>

            <Text style={styles?.greeting}>Sin otro particular por el momento, reciba un cordial saludo.</Text>
          </View>

          <View style={styles?.signature}>
            <Text style={styles?.center}>ATENTAMENTE</Text>
            <View style={styles?.signatureLine}>
              <Text style={styles?.signatureName}>LIC. {rhDirectorName.toUpperCase()}</Text>
              <Text style={styles?.signatureTitle}>DIRECTOR DE RECURSOS HUMANOS</Text>
            </View>
          </View>

          <View style={styles?.copyText}>
            <Text>C.c.p.RAFAEL TIMOTEO FRANCO GURRIA OFICIAL MAYOR-Para su conocimiento</Text>
            <Text>Expediente del Trabajador</Text>
            <Text>Archivo/Minutario</Text>
            <Text>CFLM/SGH/LPC*</Text>
          </View>
        </>
      )}
    </>
  );
};

export default ChangeAdscription;
