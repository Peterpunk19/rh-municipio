import React from "react";
import { Text, View } from "@react-pdf/renderer";
import { formatDateToText } from "@/utils/formatter";
import { RequestTemplateProps } from "./types";

const ChangeSchedule: React.FC<RequestTemplateProps> = ({ data, type, styles }) => {
  const combineStyles = (...styleArgs: any[]) => {
    return styleArgs.filter((style) => style !== undefined && style !== null);
  };

  return (
    <>
      <View style={combineStyles(styles?.relative, styles?.flexColumn, styles?.alignItemsEnd, { fontSize: 12 })}>
        <Text>Oficio No. {data.folio ? `OM/DRH/${data.folio}/${new Date().getFullYear()}` : ""}</Text>
        <Text>Tuxtla Gutiérrez, Chiapas</Text>
        <Text>{formatDateToText(data.created_at, true)}</Text>
        <Text style={styles?.boldText}>Folio Electrónico: {data.folio || ""}</Text>
      </View>
      <View
        style={combineStyles(styles?.relative, styles?.flexColumn, styles?.alignItemsStart, {
          fontSize: 10,
          marginVertical: 5,
        })}
      >
        <Text>
          {data?.rhDirector
            ? `${data?.rhDirector.name} ${data?.rhDirector.paternal_last_name} ${data?.rhDirector.maternal_last_name}`
            : ""}
        </Text>
        <Text>DIRECTOR(A) DE RECURSOS HUMANOS</Text>
        <Text>PRESENTE</Text>
      </View>
      <View style={combineStyles(styles?.flexColumn, styles?.alignItemsEnd, { fontSize: 12 })}>
        <Text style={combineStyles(styles?.textUpperCase, styles?.boldText, { marginBottom: 5 })}>
          ASUNTO: {data.request.display_name}
        </Text>
      </View>
      <View style={combineStyles(styles?.flexColumn, styles?.alignItemsStart, { fontSize: 10, marginVertical: 15 })}>
        <Text>
          Por medio del presente, informo a usted la Jornada, Horario y tipo de registro de asistencia del siguiente
          trabajador.
        </Text>
      </View>
      <View style={styles?.table}>
        <View style={styles?.row}>
          <View style={combineStyles(styles?.cell, { width: "25%" })}>
            <Text style={styles?.textUpperCase}>No. Empleado</Text>
          </View>
          <View style={combineStyles(styles?.cell, styles?.lastCell, { width: "75%" })}>
            <Text style={styles?.textUpperCase}>{data.employee.number_employee}</Text>
          </View>
        </View>

        <View style={styles?.row}>
          <View style={combineStyles(styles?.cell, { width: "25%" })}>
            <Text style={styles?.textUpperCase}>Nombre</Text>
          </View>
          <View style={combineStyles(styles?.cell, styles?.lastCell, { width: "75%" })}>
            <Text style={styles?.textUpperCase}>
              {data.employee.name} {data.employee.paternal_last_name} {data.employee.maternal_last_name}
            </Text>
          </View>
        </View>

        <View style={styles?.row}>
          <View style={combineStyles(styles?.cell, { width: "25%" })}>
            <Text style={styles?.textUpperCase}>Jornadas y Horarios</Text>
          </View>
          <View style={combineStyles(styles?.cell, { width: "37.50%" })}>
            <Text style={styles?.textUpperCase}>Días</Text>
          </View>
          <View style={combineStyles(styles?.cell, { width: "37.50%" })}>
            <Text style={styles?.textUpperCase}>Horarios</Text>
          </View>
        </View>

        <View style={styles?.row}>
          <View style={combineStyles(styles?.cell, { width: "25%" })}>
            <Text style={styles?.textUpperCase}>Anterior</Text>
          </View>
          <View style={combineStyles(styles?.cell, { width: "37.50%" })}>
            {data.requestDetail?.prevSchedule &&
              data.requestDetail?.prevSchedule.map((item: any, index: number) => (
                <Text key={index}>
                  {item.start_day.display_name != item.end_day.display_name
                    ? `${item.start_day.display_name} a ${item.end_day.display_name}`
                    : item.start_day.display_name}
                </Text>
              ))}
          </View>
          <View style={combineStyles(styles?.cell, styles?.lastCell, { width: "37.50%" })}>
            {data.requestDetail?.prevSchedule &&
              data.requestDetail?.prevSchedule.map((item: any, index: number) => (
                <Text key={index}>
                  {item.start_hour.display_name} a {item.end_hour.display_name}
                </Text>
              ))}
          </View>
        </View>

        <View style={styles?.row}>
          <View style={combineStyles(styles?.cell, { width: "25%" })}>
            <Text style={styles?.textUpperCase}>Nuevo:</Text>
          </View>
          <View style={combineStyles(styles?.cell, { width: "37.50%" })}>
            {data.requestDetail?.schedule &&
              data.requestDetail.schedule.map((item: any, index: number) => (
                <Text key={index}>
                  {item.start_day.display_name != item.end_day.display_name
                    ? `${item.start_day.display_name} a ${item.end_day.display_name}`
                    : item.start_day.display_name}
                </Text>
              ))}
          </View>
          <View style={combineStyles(styles?.cell, styles?.lastCell, { width: "37.50%" })}>
            {data.requestDetail?.schedule &&
              data.requestDetail.schedule.map((item: any, index: number) => (
                <Text key={index}>
                  {item.start_hour.display_name} a {item.end_hour.display_name}
                </Text>
              ))}
          </View>
        </View>

        <View style={styles?.row}>
          <View style={combineStyles(styles?.cell, { width: "25%" })}>
            <Text style={styles?.textUpperCase}>Registro Asistencia</Text>
          </View>
          <View style={combineStyles(styles?.cell, styles?.lastCell, { width: "75%" })}>
            <Text style={styles?.textUpperCase}>
              {data.employee?.employee_attendance_type?.attendance?.display_name}
            </Text>
          </View>
        </View>

        <View style={styles?.row}>
          <View style={combineStyles(styles?.cell, { width: "25%" })}>
            <Text style={styles?.textUpperCase}>Estatus</Text>
          </View>
          <View style={combineStyles(styles?.cell, styles?.lastCell, { width: "75%" })}>
            <Text style={styles?.textUpperCase}>
              {data.employee?.employee_hiring?.[0]?.employee_type?.display_name}
            </Text>
          </View>
        </View>

        <View style={styles?.row}>
          <View style={combineStyles(styles?.cell, { width: "25%" })}>
            <Text style={styles?.textUpperCase}>Secretaría</Text>
          </View>
          <View style={combineStyles(styles?.cell, styles?.lastCell, { width: "75%" })}>
            <Text style={styles?.textUpperCase}>
              {data.employee?.employee_hiring?.[0]?.direccion?.secretaria?.display_name}
            </Text>
          </View>
        </View>

        <View style={styles?.row}>
          <View style={combineStyles(styles?.cell, { width: "25%" })}>
            <Text style={styles?.textUpperCase}>Dirección</Text>
          </View>
          <View style={combineStyles(styles?.cell, styles?.lastCell, { width: "75%" })}>
            <Text style={styles?.textUpperCase}>{data.employee?.employee_hiring?.[0]?.direccion?.display_name}</Text>
          </View>
        </View>

        <View style={styles?.row}>
          <View style={combineStyles(styles?.cell, { width: "25%" })}>
            <Text style={styles?.textUpperCase}>Departamento o Área</Text>
          </View>
          <View style={combineStyles(styles?.cell, styles?.lastCell, { width: "75%" })}>
            <Text style={styles?.textUpperCase}></Text>
          </View>
        </View>

        <View style={styles?.row}>
          <View style={combineStyles(styles?.cell, { width: "25%" })}>
            <Text style={styles?.textUpperCase}>Actividad</Text>
          </View>
          <View style={combineStyles(styles?.cell, styles?.lastCell, { width: "75%" })}>
            <Text style={styles?.textUpperCase}>{data.employee?.employee_hiring?.[0]?.category?.display_name}</Text>
          </View>
        </View>

        <View style={styles?.row}>
          <View style={combineStyles(styles?.cell, { width: "25%" })}>
            <Text style={styles?.textUpperCase}>Ubicación</Text>
          </View>
          <View style={combineStyles(styles?.cell, styles?.lastCell, { width: "75%" })}>
            <Text style={styles?.textUpperCase}>{data.requestDetail?.location?.display_name}</Text>
          </View>
        </View>
        <View style={styles?.row}>
          <View style={combineStyles(styles?.cell, { width: "25%" })}>
            <Text style={styles?.textUpperCase}>Detallar la actividad</Text>
          </View>
          <View style={combineStyles(styles?.cell, styles?.lastCell, { width: "75%" })}>
            <Text style={styles?.textUpperCase}>{data.description}</Text>
          </View>
        </View>
        <View style={styles?.row}>
          <View style={combineStyles(styles?.cell, styles?.lastRow, { width: "25%" })}>
            <Text style={styles?.textUpperCase}>A partir del</Text>
          </View>
          <View style={combineStyles(styles?.cell, styles?.lastCell, styles?.lastRow, { width: "75%" })}>
            <Text style={styles?.textUpperCase}>{formatDateToText(data.requestDetail?.start_date, true)}</Text>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 10, marginBottom: 20 }}>
        <Text>Sin otro en particular, aprovecho la ocasión para enviarle un cordial saludo.</Text>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 60 }}>
        <View style={{ width: "33.33%", alignItems: "center" }}>
          <Text style={{ fontWeight: "bold", fontSize: 10, marginBottom: 50 }}>Trabajador</Text>
          <Text style={{ borderTop: "1px solid black", width: "80%", textAlign: "center", paddingTop: 5 }}>
            {data.employee.name} {data.employee.paternal_last_name} {data.employee.maternal_last_name}
          </Text>
        </View>
        <View style={{ width: "33.33%", alignItems: "center" }}>
          <Text style={{ fontWeight: "bold", fontSize: 10, marginBottom: 50 }}>Vo. Bo.</Text>
          <Text style={{ borderTop: "1px solid black", width: "80%", textAlign: "center", paddingTop: 5 }}>
            {data.vobo
              ? `${data.vobo.employee.name} ${data.vobo.employee.paternal_last_name} ${data.vobo.employee.maternal_last_name}`.toUpperCase()
              : `${data.rhDirector?.name || ""} ${data.rhDirector?.paternal_last_name || ""} ${data.rhDirector?.maternal_last_name || ""}`}
          </Text>
          <Text style={{ fontSize: 8, textAlign: "center", marginTop: 2 }}>
            Jefe(a) de Departamento y/o Jefe(a) Inmediato
          </Text>
        </View>
        <View style={{ width: "33.33%", alignItems: "center" }}>
          <Text style={{ fontWeight: "bold", fontSize: 10, marginBottom: 50 }}>Autoriza</Text>
          <Text style={{ borderTop: "1px solid black", width: "80%", textAlign: "center", paddingTop: 5 }}>
            {data.signatory
              ? `${data.signatory.employee.name} ${data.signatory.employee.paternal_last_name} ${data.signatory.employee.maternal_last_name}`.toUpperCase()
              : `${data.rhDirector?.name || ""} ${data.rhDirector?.paternal_last_name || ""} ${data.rhDirector?.maternal_last_name || ""}`}
          </Text>
          <Text style={{ fontSize: 8, textAlign: "center", marginTop: 2 }}>
            {data.signatory ? data.signatory.role.display_name : "Director(a)"}
          </Text>
        </View>
      </View>
    </>
  );
};

export default ChangeSchedule;
