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
  canCreate: boolean;
  textCreate: string;
}

export const catalogs: Record<string, Catalog> = {
  "employee-type": {
    title: "Tipos de Empleado",
    description: "Catálogo de tipos de empleado",
    href: `${path}/employee-type`,
    icon: IconUsers,
    color: "primary",
    fetch: "employee-type",
    canCreate: true,
    textCreate: "Crear tipo de empleado",
  },
  category: {
    title: "Categorías",
    description: "Catálogo de categorías de empleados",
    href: `${path}/category`,
    icon: IconCategory,
    color: "secondary",
    fetch: "category",
    canCreate: true,
    textCreate: "Crear categoría",
  },
  holiday: {
    title: "Días Festivos",
    description: "Catálogo de días festivos oficiales",
    href: `${path}/holiday`,
    icon: IconCalendarEvent,
    color: "success",
    fetch: "holiday",
    canCreate: true,
    textCreate: "Crear día festivo",
  },
  incident: {
    title: "Tipos de Incidencias",
    description: "Catálogo de tipos de incidencias",
    href: `${path}/incident`,
    icon: IconFileDescription,
    color: "warning",
    fetch: "incidents",
    canCreate: false,
    textCreate: "Crear tipo de incidencia",
  },
  location: {
    title: "Ubicaciones",
    description: "Catálogo de ubicaciones",
    href: `${path}/location`,
    icon: IconMapPin,
    color: "error",
    fetch: "location",
    canCreate: true,
    textCreate: "Crear ubicación",
  },
  "marital-status": {
    title: "Estado Civil",
    description: "Catálogo de estados civiles",
    href: `${path}/marital-status`,
    icon: IconHeart,
    color: "info",
    fetch: "marital-status",
    canCreate: true,
    textCreate: "Crear estado civil",
  },
  schooling: {
    title: "Escolaridad",
    description: "Catálogo de niveles de escolaridad",
    href: `${path}/schooling`,
    icon: IconSchool,
    color: "primary",
    fetch: "schooling",
    canCreate: true,
    textCreate: "Crear nivel de escolaridad",
  },
  occupation: {
    title: "Ocupaciones",
    description: "Catálogo de ocupaciones",
    href: `${path}/occupation`,
    icon: IconBriefcase,
    color: "secondary",
    fetch: "occupation",
    canCreate: true,
    textCreate: "Crear ocupación",
  },
  profession: {
    title: "Profesiones",
    description: "Catálogo de profesiones",
    href: `${path}/profession`,
    icon: IconCertificate,
    color: "success",
    fetch: "profession",
    canCreate: true,
    textCreate: "Crear profesión",
  },
  request: {
    title: "Tipos de Solicitud",
    description: "Catálogo de tipos de solicitudes",
    href: `${path}/request`,
    icon: IconFileText,
    color: "warning",
    fetch: "requests",
    canCreate: false,
    textCreate: "Crear tipo de solicitud",
  },
  secretaria: {
    title: "Secretarías",
    description: "Catálogo de secretarías",
    href: `${path}/secretaria`,
    icon: IconBuilding,
    color: "error",
    fetch: "secretarias",
    canCreate: true,
    textCreate: "Crear secretaría",
  },
  direccion: {
    title: "Direcciones",
    description: "Catálogo de direcciones",
    href: `${path}/direccion`,
    icon: IconBuildingSkyscraper,
    color: "info",
    fetch: "direcciones",
    canCreate: true,
    textCreate: "Crear dirección",
  },
  "trade-union": {
    title: "Sindicatos",
    description: "Catálogo de sindicatos",
    href: `${path}/trade-union`,
    icon: IconUsersGroup,
    color: "primary",
    fetch: "trade-union",
    canCreate: true,
    textCreate: "Crear sindicato",
  },
};
