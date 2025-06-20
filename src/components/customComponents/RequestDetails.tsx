"use client";

import React from "react";
import { Box, Grid2 as Grid, Divider, Typography, Paper } from "@mui/material";
import { RequestScheduleDetails } from "@/components/customComponents/RequestScheduleDetails";
import { RequestLocationDetails } from "@/components/customComponents/RequestLocationDetails";
import { RequestAttendanceDetails } from "@/components/customComponents/RequestAttendanceDetails";
import { RequestFingerprintDetails } from "@/components/customComponents/RequestFingerprintDetails";
import { RequestAdscriptionDetails } from "@/components/customComponents/RequestAdscriptionDetails";

type Props = {
  data: {
    request: {
      display_name: string;
      name: string;
    };
    request_details: any;
    requestedBy?: {
      username: string;
    };
    approvedBy?: {
      name: string;
      paternal_last_name: string;
      maternal_last_name: string;
    };
  };
};

const RequestDetails: React.FC<Props> = ({ data }) => {
  const { request, request_details } = data;
  const isScheduleRequest = request.name === "schedule_change_request";
  const isLocationRequest = request.name === "location_change_request";
  const isCheckerRequest = request.name === "checker_change_request";
  const adscriptionChangeRequest = request.name === "adscription_change_request";
  const isFingerprintRequest =
    request.name === "fingerprint_registration_request";

  return (
    <Paper variant="outlined" sx={{ height: "100%"}}>
      <Box p={3} display="flex" flexDirection="column" gap="4px" height="100%">
        <Grid container>
          <Grid size={{ lg: 12, xs: 12 }} mb={2}>
            <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
              DETALLES DE SOLICITUD
            </Typography>
            <Divider />
          </Grid>

          <Grid container>
            <Grid size={5}>
              <Typography variant="subtitle1" color="text.secondary">
                Tipo de Solicitud:
              </Typography>
            </Grid>
            <Grid size={7}>
              <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
                {data.request.display_name}
              </Typography>
            </Grid>

            {isFingerprintRequest && (
              <RequestFingerprintDetails
                location={request_details.location}
                requestDate={request_details.request_date}
              />
            )}
            {isScheduleRequest && (
              <RequestScheduleDetails
                schedule={request_details.schedule}
                startAt={request_details.start_at}
                endAt={request_details.end_at}
              />
            )}
            {isLocationRequest && (
              <RequestLocationDetails
                currentLocation={request_details.current_location}
                newLocation={request_details.new_location}
                startAt={request_details.start_at}
                endAt={request_details.end_at}
                requestAt={request_details.request_date}
              />
            )}
            {isCheckerRequest && (
              <RequestAttendanceDetails
                currentAttendance={request_details.current_attendance}
                newAttendance={request_details.new_attendance}
                attendanceDate={request_details.attendance_date}
              />
            )}
            {adscriptionChangeRequest && (
              <RequestAdscriptionDetails
                attendance={request_details.attendance}
                currentDireccion={request_details.current_direccion}
                newDireccion={request_details.new_direccion}
                newLocation={request_details.new_location}
              />
            )}

            <Grid size={5}>
              <Typography variant="subtitle1" color="text.secondary">
                Solicitado por
              </Typography>
            </Grid>
            <Grid size={7}>
              <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
                {data.requestedBy?.username || "-"}
              </Typography>
            </Grid>
            
            <Grid size={5}>
              <Typography variant="subtitle1" color="text.secondary">
                Aprobado por
              </Typography>
            </Grid>
            <Grid size={7}>
              <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
                {data.approvedBy && Object.keys(data.approvedBy).length > 0 ? 
                  data.approvedBy.name + " " + data.approvedBy.paternal_last_name + " " + data.approvedBy.maternal_last_name 
                  : "-"}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default RequestDetails;
