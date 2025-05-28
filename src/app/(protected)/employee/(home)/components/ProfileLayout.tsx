"use client";

import { Grid2 as Grid, Stack } from "@mui/material";
import BlankCard from "@/components/shared/BlankCard";
import ProfileBanner from "@/app/(protected)/employee/(home)/components/profile/ProfileBanner";
import AddressCard from "@/app/(protected)/employee/(home)/components/profile/Address";
import ScheduleCard from "@/app/(protected)/employee/(home)/components/profile/ScheduleCard";

interface ProfileLayoutProps {
  employeeData: object;
  mainContent: React.ReactNode;
}

export const ProfileLayout = ({ employeeData, mainContent }: ProfileLayoutProps) => {
  return (
    <Grid container spacing={3}>
      <Grid
        size={{ lg: 3 }}
        sx={{
          position: "sticky",
          top: 100,
          alignSelf: "flex-start",
        }}
      >
        <Stack spacing={1}>
          <BlankCard>
            <ProfileBanner employeeData={employeeData} />
          </BlankCard>

          <BlankCard>
            <AddressCard employeeData={employeeData} />
          </BlankCard>

          <BlankCard>
            <ScheduleCard employeeData={employeeData} />
          </BlankCard>
        </Stack>
      </Grid>

      <Grid size={{ lg: 9 }}>
        <Stack spacing={3}>{mainContent}</Stack>
      </Grid>
    </Grid>
  );
};
