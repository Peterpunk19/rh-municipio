import React from "react";
import {
  IconUsers,
  IconCategory,
  IconCalendarEvent,
  IconFileDescription,
  IconMapPin,
  IconHeart,
  IconSchool,
  IconBriefcase,
  IconCertificate,
  IconFileText,
  IconBuilding,
  IconBuildingSkyscraper,
  IconUsersGroup,
} from "@tabler/icons-react";

const path = "/admin/reference/catalogs";

export interface Catalog {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<any>;
  color: string;
  fetch: string;
}

export const catalogs: Record<string, Catalog> = {
  "employee-type": {
    title: "Tipos de Empleado",
    description: "Catálogo de tipos de empleado",
    href: `${path}/employee-type`,
    icon: IconUsers,
    color: "primary",
    fetch: "employee-type",
  },
  category: {
    title: "Categorías",
    description: "Catálogo de categorías de empleados",
    href: `${path}/category`,
    icon: IconCategory,
    color: "secondary",
    fetch: "category",
  },
  holiday: {
    title: "Días Festivos",
    description: "Catálogo de días festivos oficiales",
    href: `${path}/holiday`,
    icon: IconCalendarEvent,
    color: "success",
    fetch: "holiday",
  },
  incident: {
    title: "Tipos de Incidencias",
    description: "Catálogo de tipos de incidencias",
    href: `${path}/incident`,
    icon: IconFileDescription,
    color: "warning",
    fetch: "incidents",
  },
  location: {
    title: "Ubicaciones",
    description: "Catálogo de ubicaciones",
    href: `${path}/location`,
    icon: IconMapPin,
    color: "error",
    fetch: "location",
  },
  "marital-status": {
    title: "Estado Civil",
    description: "Catálogo de estados civiles",
    href: `${path}/marital-status`,
    icon: IconHeart,
    color: "info",
    fetch: "marital-status",
  },
  schooling: {
    title: "Escolaridad",
    description: "Catálogo de niveles de escolaridad",
    href: `${path}/schooling`,
    icon: IconSchool,
    color: "primary",
    fetch: "schooling",
  },
  occupation: {
    title: "Ocupaciones",
    description: "Catálogo de ocupaciones",
    href: `${path}/occupation`,
    icon: IconBriefcase,
    color: "secondary",
    fetch: "occupation",
  },
  profession: {
    title: "Profesiones",
    description: "Catálogo de profesiones",
    href: `${path}/profession`,
    icon: IconCertificate,
    color: "success",
    fetch: "profession",
  },
  request: {
    title: "Tipos de Solicitud",
    description: "Catálogo de tipos de solicitudes",
    href: `${path}/request`,
    icon: IconFileText,
    color: "warning",
    fetch: "requests",
  },
  secretaria: {
    title: "Secretarías",
    description: "Catálogo de secretarías",
    href: `${path}/secretaria`,
    icon: IconBuilding,
    color: "error",
    fetch: "secretarias",
  },
  direccion: {
    title: "Direcciones",
    description: "Catálogo de direcciones",
    href: `${path}/direccion`,
    icon: IconBuildingSkyscraper,
    color: "info",
    fetch: "direcciones",
  },
  "trade-union": {
    title: "Sindicatos",
    description: "Catálogo de sindicatos",
    href: `${path}/trade-union`,
    icon: IconUsersGroup,
    color: "primary",
    fetch: "trade-union",
  },
};
