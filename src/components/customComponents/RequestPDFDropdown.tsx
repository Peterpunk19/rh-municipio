"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@mui/material";
import { IconDownload } from "@tabler/icons-react";
import { pdf } from "@react-pdf/renderer";
import { normalizeText } from "@/common/utils";
import type { RequestTemplateData } from "@/components/shared/pdfs/templates/requests/types";
import RequestTemplate from "../shared/pdfs/templates/RequestTemplate";

interface RequestPDFButtonProps {
  requestId: string;
  createdDate: string;
  buttonText?: string;
  variant?: "contained" | "outlined" | "text";
  color?: "primary" | "secondary" | "inherit";
  fullWidth?: boolean;
}

const RequestPDFButton: React.FC<RequestPDFButtonProps> = ({
                                                             requestId,
                                                             createdDate,
                                                             buttonText = "Generar PDF",
                                                             variant = "outlined",
                                                             color = "secondary",
                                                             fullWidth = false,
                                                           }) => {
  const [isLoading, setIsLoading] = useState(false);

  const generateFileName = useCallback(
    (data: RequestTemplateData) => {
      const normalizedRequest = normalizeText(data.request.display_name).toUpperCase();

      if (!data.employee) return normalizedRequest;

      const employeeName = `${data.employee.name}_${data.employee.paternal_last_name}`;
      const date = new Date().toISOString().split("T")[0];

      return `${normalizedRequest}_${employeeName}_${date}`;
    },
    []
  );

  const handleDownload = useCallback(async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);

      const response = await fetch(
        `/api/employee-requests/${requestId}/pdf?isPDF=true&requestDate=${createdDate}`
      );

      const result = await response.json();

      if (!result.success || !result.responseObject) return;

      const data: RequestTemplateData = result.responseObject;

      const blob = await pdf(
        <RequestTemplate data={data} type="director" />
      ).toBlob();

      const fileName = `${generateFileName(data)}.pdf`;

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generando PDF:", error);
    } finally {
      setIsLoading(false);
    }
  }, [requestId, createdDate, generateFileName, isLoading]);

  return (
    <Button
      variant={variant}
      color={color}
      fullWidth={fullWidth}
      startIcon={<IconDownload size={18} />}
      onClick={handleDownload}
      disabled={isLoading}
    >
      {isLoading ? "Generando PDF..." : buttonText}
    </Button>
  );
};

export default RequestPDFButton;
