"use client";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import CardMedia from "@mui/material/CardMedia";
import { Divider, Grid2 as Grid } from "@mui/material";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import React from "react";
import BlankCard from "@/components/shared/BlankCard";
import { formatDate } from "@/utils/formatter";

const ProfileBanner = ({ employeeData }: { employeeData: any }) => {
  const ProfileImage = styled(Box)(() => ({
    backgroundImage: "linear-gradient(#50b2fc,#f44c66)",
    borderRadius: "50%",
    width: "110px",
    height: "110px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto",
  }));

  return (
    <>
      <BlankCard>
        <CardMedia
          component="img"
          image={"/images/backgrounds/profilebg.jpg"}
          alt={"profilecover"}
          width="100%"
          height="130px"
        />
        <Grid container spacing={0} justifyContent="center" alignItems="center">
          <Grid
            sx={{
              order: {
                xs: "1",
                sm: "1",
                lg: "2",
              },
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              textAlign="center"
              justifyContent="center"
              sx={{
                mt: "-85px",
              }}
            >
              <Box>
                <ProfileImage>
                  <Avatar
                    src={"/images/profile/user-1.jpg"}
                    alt="profileImage"
                    sx={{
                      borderRadius: "50%",
                      width: "100px",
                      height: "100px",
                      border: "4px solid #fff",
                    }}
                  />
                </ProfileImage>
                <Box mt={1}>
                  <Typography fontWeight={600} variant="h6">
                    {employeeData.name} {employeeData.paternal_last_name} {employeeData.maternal_last_name}
                  </Typography>
                  <Typography color="textSecondary" variant="overline" fontWeight={400}>
                    {employeeData.employee_ascriptions?.[0]?.direccion?.secretaria?.display_name} -{" "}
                    {employeeData.employee_ascriptions?.[0]?.direccion?.display_name}
                  </Typography>
                  <Typography color="textSecondary" variant="h6" fontWeight={400}>
                    {employeeData.number_employee}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Box p={3} display="flex" flexDirection="column" gap="4px" height="100%">
          <Grid container>
            <Grid size={{ lg: 12, xs: 12 }} mb={2}>
              <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
                Datos generales
              </Typography>
              <Divider />
            </Grid>
            <Grid size={{ lg: 5, xs: 12 }}>
              <Typography variant="subtitle1" color="text.secondary">
                RFC:
              </Typography>
            </Grid>
            <Grid size={{ lg: 7, xs: 12 }}>
              <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
                {employeeData.rfc}
              </Typography>
            </Grid>
            <Grid size={{ lg: 5, xs: 12 }}>
              <Typography variant="subtitle1" color="text.secondary">
                Fecha de nacimiento:
              </Typography>
            </Grid>
            <Grid size={{ lg: 7, xs: 12 }}>
              <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
                {formatDate(employeeData.birthday)}
              </Typography>
            </Grid>
            <Grid size={{ lg: 5, xs: 12 }}>
              <Typography variant="subtitle1" color="text.secondary">
                CURP:
              </Typography>
            </Grid>
            <Grid size={{ lg: 7, xs: 12 }}>
              <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
                {employeeData.curp}
              </Typography>
            </Grid>
            <Grid size={{ lg: 5, xs: 12 }}>
              <Typography variant="subtitle1" color="text.secondary">
                Categoría:
              </Typography>
            </Grid>
            <Grid size={{ lg: 7, xs: 12 }}>
              <Typography variant="subtitle1" mb={0.5} fontWeight={600}>
                {employeeData.employee_hiring?.[0]?.category.display_name}
              </Typography>
            </Grid>
          </Grid>
        </Box>
        <Divider />
      </BlankCard>
    </>
  );
};

export default ProfileBanner;
