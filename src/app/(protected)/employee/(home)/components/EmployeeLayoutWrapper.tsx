"use client";

import { useEmployeeData } from "@/hooks/useEmployeeData";
import LoadingComponent from "@/components/customComponents/LoadingComponent";
import { ProfileLayout } from "@/app/(protected)/employee/(home)/components/ProfileLayout";
import PageContainer from "@/app/components/container/PageContainer";

export const withEmployeeLayout = (Component: React.ComponentType, title: string, description: string) => {
  return function WrappedComponent() {
    const { employeeData, loading, error, sessionStatus } = useEmployeeData();

    if (sessionStatus === "loading" || loading) {
      return <LoadingComponent />;
    }

    if (error || !employeeData) {
      return <div>{error || "Empleado no encontrado"}</div>;
    }

    return (
      <PageContainer title={title} description={description}>
        <ProfileLayout employeeData={employeeData} mainContent={<Component />} />
      </PageContainer>
    );
  };
};
