import React from "react";
import { Text, View } from "@react-pdf/renderer";
import { RequestTemplateProps } from "./types";
import {formatDateToText, toTitleCase} from "@/utils/formatter";

const ChangeAdscription: React.FC<RequestTemplateProps> = ({ data, styles, type }) => {
  console.log("ChangeAdscription", data);
  const employeeName = `${data.employee.name} ${data.employee.paternal_last_name} ${data.employee.maternal_last_name}`;
  const categoryName = data.employee.employee_hiring[0]?.category?.display_name;
  const employeeNumber = data.employee.number_employee;
  const employeeType = data.employee.employee_hiring[0]?.employee_type?.display_name;
  const destinationDirector = data?.destinationDirector;
  const directorName = `${destinationDirector?.name} ${destinationDirector?.paternal_last_name} ${destinationDirector?.maternal_last_name}`;
  const destinationDirection = data.requestDetail?.new_direccion?.display_name;
  const changeDate = formatDateToText(data.changeDate);
  const rhDirector = data?.rhDirector;
  const rhDirectorName = `${rhDirector?.name} ${rhDirector?.paternal_last_name} ${rhDirector?.maternal_last_name}`;

  const currentDate = formatDateToText(data.created_at, true);
  const officioNumber = data.oficio;

  return (
    <>
      {type === "director" && (
        <>
          <Text style={styles?.yearText}>&quot;2026, AÑO DE JAIME SABINES GUTIÉRREZ&quot;</Text>
          <View style={styles?.bodyContainer}>
            <View style={styles?.dateSection}>
              <Text style={styles?.date}>Tuxtla Gutiérrez, Chiapas a {currentDate}</Text>
              <Text style={styles?.officeNumber}>Oficio N° {officioNumber}</Text>
              <Text style={styles?.officeNumber}>Asunto: Notificación de cambio de adscripción</Text>
            </View>

            <View style={styles?.recipient}>
              <Text style={styles?.recipientTitle}>C. {employeeName.toUpperCase()}</Text>
              <Text style={styles?.recipientTitle}>{categoryName}</Text>
              <Text style={styles?.recipientTitle}>Número de empleado {employeeNumber}</Text>
              <Text style={styles?.recipientTitle}>Relacion Laboral {employeeType}</Text>
              <Text style={styles?.present}>P r e s e n t e</Text>
            </View>

            <View style={styles?.body}>
              <Text style={styles?.bodyText}>
                Con el objetivo de fortalecer las estructuras orgánicas que integran la Administración Pública
                Municipal Centralizada y para garantizar la funcionalidad de las mismas, a través de los
                movimientos nominales de las plantillas de plazas; en acatamiento al artículo 98, fracción II, del
                Reglamento de la Administración Pública de Tuxtla Gutiérrez, y en seguimiento al Oficio
                N° {data.oficio}, hago de su conocimiento que, a partir del {data.request.start_date} del presente año,
                quedará adscrito a la {destinationDirection ? toTitleCase(destinationDirection) : ""}.
              </Text>

              <Text style={styles?.bodyText}>
                Por la encomienda antes expresada, lo exhortamos a cumplir con la órdenes o instrucciones
                verbales o escritas en el desemepeño de su empleo, aplicando los principios y directrices que rigen la
                actuación de las personas servidoas públicas, como son la disciplina, legalidad, objetividad,
                profesionalismo, honradez, lealta, imparcialidad, integridad, rendición de cuentas, eficacia y
                eficiencia que rigen el servicio público en las actividades que se le enconmienden, atacando lo
                establecido, en el artículo 7, de la Ley de Responsabilidades Administrativas para el Estado de
                Chiapas; 23, 43, 52, y 53 de la Ley del Servicio Civil del Estado y los Municipios de Chiapas; y
                acreedor a las sanciones administrativas respectivas.
              </Text>

              <Text style={styles?.greeting}>Sin otro particular por el momento, reciba un cordial saludo.</Text>
            </View>

            <View style={styles?.signature}>
              <Text style={styles?.center}>ATENTAMENTE</Text>
              <View style={styles?.signatureLine}>
                <Text style={styles?.signatureName}>LIC. {rhDirectorName.toUpperCase()}</Text>
                <Text style={styles?.signatureTitle}>DIRECTORA</Text>
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
    </>
  );
};

export default ChangeAdscription;
