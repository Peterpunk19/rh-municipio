"use client";

import { CardContent } from "@mui/material";
import PageContainer from "@/app/components/container/PageContainer";
import BlankCard from "@/components/shared/BlankCard";
import { useEmployeeData } from "@/hooks/useEmployeeData";
import LoadingComponent from "@/components/customComponents/LoadingComponent";
import CustomCalendarAttendance from "@/components/customComponents/CustomCalendarAttendance";
import { ProfileLayout } from "@/app/(protected)/employee/(home)/components/ProfileLayout";

const UserProfile = () => {
  const { employeeData, loading, error, sessionStatus } = useEmployeeData();

  if (sessionStatus === "loading" || loading) {
    return <LoadingComponent />;
  }

  if (error || !employeeData) {
    return <div>{error || "Empleado no encontrado"}</div>;
  }

  return (
    <PageContainer title="Profile" description="this is Profile">
      <ProfileLayout
        employeeData={employeeData}
        mainContent={
          <BlankCard>
            <CardContent
              sx={{
                maxHeight: "calc(100vh - 150px)",
                overflowY: "auto",
                p: 2,
              }}
            >
              <CustomCalendarAttendance />
            </CardContent>
          </BlankCard>
        }
      />
    </PageContainer>
  );
};

export default UserProfile;
