"use client";

import React from "react";
import { Button } from "@mui/material";
import { IconDownload } from "@tabler/icons-react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { PDFGeneratorProps } from "@/interfaces/PDFGeneratorProps";

const PDFGenerator: React.FC<PDFGeneratorProps> = ({
  data,
  fileName = "documento",
  title = "Formato",
  template: CustomTemplate,
  buttonProps = {},
}) => {
  return (
    <PDFDownloadLink document={<CustomTemplate data={data} title={title} />} fileName={`${fileName}.pdf`}>
      {({ loading }) => (
        <Button variant="outlined" color="primary" disabled={loading} startIcon={<IconDownload />} {...buttonProps}>
          {loading ? "Generando PDF..." : "Descargar Formato"}
        </Button>
      )}
    </PDFDownloadLink>
  );
};

export default PDFGenerator;
