import React from "react";
import PageContainer from "@/app/components/container/PageContainer";
import Breadcrumb from "@/components/shared/breadcrumb/Breadcrumb";
import UserCreateForm from "./form/page";

const BCrumb = [
  {
    to: "/admin/users",
    title: "Listado de usuarios",
  },
  {
    title: "Crear nuevo usuario",
  },
];

const CreateUser = () => {
  return (
    <PageContainer title="Crear nuevo usuario">
      <Breadcrumb title="Crear nuevo usuario" items={BCrumb} />
      <UserCreateForm></UserCreateForm>
    </PageContainer>
  );
};

export default CreateUser;
