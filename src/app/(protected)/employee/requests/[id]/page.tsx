"use client";

import React, { useState, useCallback } from "react";
import { Grid2 as Grid, Divider, Typography, Button, Stack, Chip, Box, Paper } from "@mui/material";
import BlankCard from "@/components/shared/BlankCard";
import { useParams, useRouter } from "next/navigation";
import { getEmployeeRequestById } from "@/services/employee-requests";
import { logger } from "@/lib/logger";
import CardContent from "@mui/material/CardContent";
import { IconDownload } from "@tabler/icons-react";
import LoadingComponent from "@/components/customComponents/LoadingComponent";
import RequestDetails from "@/components/customComponents/RequestDetails";
import RequestStatusHistory from "@/components/customComponents/RequestStatusHistory";

const EmployeeRequest = () => {
  const [loading, setLoading] = useState(false);
  const [employeeRequestData, setEmployeeRequestData] = useState<any>(null);
  const { id } = useParams();
  const router = useRouter();

  const fetchEmployeeRequestById = useCallback(
    (id: any) => {
      try {
        if (id) {
          setLoading(true);
          getEmployeeRequestById(id as string).then((data) => {
            if (data.success) {
              setEmployeeRequestData(data.responseObject);
            } else {
              setEmployeeRequestData(null);
              router.push("/admin/employees-requests");
            }
          });
        }
      } catch (error: any) {
        logger.error({ error: error.message, stack: error.stack });
        setLoading(false);
        router.push("/admin/employees-requests");
      }
    },
    [router],
  );

  React.useEffect(() => {
    fetchEmployeeRequestById(id);
  }, [id, fetchEmployeeRequestById]);

  React.useEffect(() => {
    if (employeeRequestData) {
      setLoading(false);
    }
  }, [employeeRequestData]);

  if (loading || !employeeRequestData) return <LoadingComponent />;

  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <Grid container>
          <Grid size={{ lg: 12, xs: 12 }}>
            <Stack direction={{ xs: "column", sm: "row" }} justifyContent="flex-end" sx={{ width: "100%" }}>
              <Box display="flex" gap={1}>
                <Button variant="outlined" color="secondary" startIcon={<IconDownload width={18} />}>
                  Descargar formato
                </Button>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Grid>

      <Grid size={12}>
        <BlankCard>
          <CardContent>
            <Stack direction={{ xs: "column", sm: "row" }} alignItems="center" justifyContent="space-between" mb={2}>
              <Box
                sx={{
                  textAlign: {
                    xs: "center",
                    sm: "left",
                  },
                }}
              >
                <Typography variant="h5">Folio: {employeeRequestData.folio}</Typography>

                <Box mt={1}>
                  <Chip
                    size="medium"
                    color={employeeRequestData.request_status.btn_color}
                    label={employeeRequestData.request_status.display_name}
                  />
                </Box>
              </Box>
            </Stack>
            <Divider />

            <Grid container spacing={3} mt={2} mb={4}>
              <Grid size={12}>
                <RequestDetails data={employeeRequestData} />
              </Grid>
            </Grid>

            <Grid mb={3} size={12}>
              <Paper variant="outlined" sx={{ height: "100%" }}>
                <Box p={3} display="flex" flexDirection="column" gap="4px" height="100%">
                  <Grid container>
                    <Grid size={{ lg: 12, xs: 12 }} mb={2}>
                      <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
                        JUSTIFICACIÓN
                      </Typography>
                      <Divider />
                    </Grid>
                    <Grid size={{ lg: 9, xs: 12 }}>
                      <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
                        {employeeRequestData.justification}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Grid>

            <Grid size={12}>
              <RequestStatusHistory data={employeeRequestData} />
            </Grid>
          </CardContent>
        </BlankCard>
      </Grid>
    </Grid>
  );
};

export default EmployeeRequest;
