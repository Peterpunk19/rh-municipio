"use client";

import { Button } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";

const AppDD = () => {
  const pathname = usePathname();

  const buttons = [
    { label: "Asistencia", href: "/employee/attendance" },
    { label: "Incidencias", href: "/employee/incidents" },
    { label: "Solicitudes", href: "/employee/requests" },
  ];

  return (
    <>
      {buttons.map(({ label, href }) => {
        const isActive = pathname === href;

        return (
          <Button
            key={href}
            color="inherit"
            component={Link}
            href={href}
            variant="text"
            sx={{
              color: isActive
                ? "#5D87FF"
                : (theme) => theme.palette.text.secondary,
              backgroundColor: isActive ? "#ECF2FF" : "transparent",
              "&:hover": {
                backgroundColor: "#ECF2FF",
                color: "#5D87FF",
              },
            }}
          >
            {label}
          </Button>
        );
      })}
    </>
  );
};

export default AppDD;
