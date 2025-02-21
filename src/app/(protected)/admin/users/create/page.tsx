import React from "react";
import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb";
import UserCreateForm from "./form/page";
const CreateUser = () => {
  return (
    <PageContainer title="Crear nuevo usuario">
      <Breadcrumb title="Crear nuevo usuario" />
      <UserCreateForm></UserCreateForm>
    </PageContainer>
  );
};

export default CreateUser;
