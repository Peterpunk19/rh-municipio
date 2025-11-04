import { Document, Page, View, Image, Text } from "@react-pdf/renderer";
import styles from "@/components/shared/pdfs/styles/RequestStyle";
import { REQUEST_TYPES_NAME } from "@/common/constants/RequestTypes";
import { REQUEST_COMPONENTS, RequestTemplateProps } from "./requests/types";
import React from "react";
import { Font } from "@react-pdf/renderer";

Font.registerHyphenationCallback((word: string) => [word]);

const urlLogo = `${process.env.NEXT_PUBLIC_BASE_URL}/images/logos/logo.png`;
const urlBackground = `${process.env.NEXT_PUBLIC_BASE_URL}/images/backgrounds/bg_rh.png`;
const needDestinationDirector: string[] = [REQUEST_TYPES_NAME.ADSCRIPTION];
const needNewDirection: string[] = [REQUEST_TYPES_NAME.ADSCRIPTION];

const RequestTemplate: React.FC<RequestTemplateProps> = ({ data, type }) => {
  if (!data?.employee || !data?.rhDirector) {
    throw new Error("Datos incompletos para generar el PDF");
  }

  if (needDestinationDirector.includes(data.request.name) && !data?.destinationDirector) {
    throw new Error("Datos incompletos para generar el PDF");
  }

  if (needNewDirection.includes(data.request.name) && !data?.requestDetail?.new_direccion) {
    throw new Error("Datos incompletos para generar el PDF");
  }

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
          <View style={styles.centerSection}>
            <Text style={styles.publicOrganization}>
              {data.employee.employee_hiring?.[0]?.direccion?.secretaria?.display_name}
            </Text>
          </View>
          <View style={styles.rightSection}>
            <Text style={styles.administrativeOrganization}>
              {data.employee.employee_hiring?.[0]?.direccion?.display_name}
            </Text>
          </View>
        </View>
        {(() => {
          const requestId = data.request?.name as REQUEST_TYPES_NAME;
          const RequestComponent =
            requestId && REQUEST_COMPONENTS[requestId]
              ? REQUEST_COMPONENTS[requestId]
              : REQUEST_COMPONENTS[REQUEST_TYPES_NAME.SCHEDULE];

          return <RequestComponent data={data} styles={styles} type={type} />;
        })()}
        <View style={styles.footer}>
          <Text>Calle Central S/N, Col. Centro, Tuxtla Gutiérrez, Chiapas. C.P. 29000</Text>
          <Text>Atención: (961) 61 25511 | www.tuxtla.gob.mx</Text>
        </View>
      </Page>
    </Document>
  );
};

export default RequestTemplate;
