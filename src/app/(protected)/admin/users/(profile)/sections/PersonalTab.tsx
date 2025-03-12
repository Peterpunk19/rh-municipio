"use client";

import * as React from "react";
import Tab from "@/components/shared/tabs/Tab";

const PersonalTab = ({ userData }: UserPageProps) => {
  const displayData = [
    { label: "Usuario", value: `${userData?.username}` },
    { label: "Rol", value: `${userData?.role_display_name}` },
    {
      label: "Nombre completo",
      value:
        [userData?.name, userData?.paternal_last_name, userData?.maternal_last_name].filter(Boolean).join(" ") ||
        "No disponible",
    },
  ];

  return <Tab displayData={displayData} title="Datos personales" />;
};

export default PersonalTab;
