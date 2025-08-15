import React, { useMemo } from "react";
import { Box, Typography, Paper } from "@mui/material";
import type { IResponse } from "@/utils/types";
import { IncidentValidationResponse } from "@/services/incident-validation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface IncidentDaysInfoProps {
  validationData: IResponse | null;
  isLoading?: boolean;
  error?: string | null;
}

const IncidentDaysInfo = ({ validationData, isLoading = false, error = null }: IncidentDaysInfoProps) => {
  const { formData } = useSelector((state: RootState) => state.createEmployeeIncident);

  const selectedDaysCount = useMemo(() => {
    if (!formData.incidentDates || formData.incidentDates.length === 0) return 0;
    return formData.incidentDates.length;
  }, [formData.incidentDates]);

  if (isLoading) {
    return (
      <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: "#f8f9fa" }}>
        <Typography variant="body2" color="text.secondary">
          Validando datos de incidencia...
        </Typography>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: "#fff8f8", borderLeft: "4px solid #ff3d00" }}>
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      </Paper>
    );
  }

  if (!validationData?.responseObject) return null;

  const { allowed_days, used_days, remaining_days, hasRules } =
    validationData.responseObject as IncidentValidationResponse;

  if (hasRules === false) return null;

  const remainingDays = remaining_days - selectedDaysCount;
  const remainingColor = remainingDays <= 0 ? "error.main" : "success.main";
  const borderColor = remainingDays <= 0 ? "#ff3d00" : "#1976d2";

  const rows = [
    { label: "Días permitidos:", value: allowed_days },
    { label: "Días usados:", value: used_days + selectedDaysCount },
    { label: "Días restantes:", value: remainingDays, color: remainingColor },
  ];

  return (
    <Paper
      elevation={0}
      sx={{ p: 2, mb: 2, bgcolor: "#f8f9fa", borderLeft: `4px solid ${borderColor}`, width: "100%", maxWidth: "350px" }}
    >
      {rows.map(({ label, value }, index) => (
        <Box key={label} display="flex" justifyContent="space-between" mb={index < rows.length - 1 ? 1 : 0}>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 24,
              height: 24,
              borderRadius: "50%",
              backgroundColor: value > 0 ? "primary.main" : "error.main",
              color: "white",
            }}
          >
            <Typography variant="body2" fontWeight="medium" color="white">
              {value}
            </Typography>
          </Box>
        </Box>
      ))}
    </Paper>
  );
};

export default IncidentDaysInfo;
