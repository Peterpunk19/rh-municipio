import { uniqueId } from "lodash";

interface MenuitemsType {
  [x: string]: any;
  id?: string;
  navlabel?: boolean;
  subheader?: string;
  title?: string;
  icon?: any;
  href?: string;
  children?: MenuitemsType[];
  chip?: string;
  chipColor?: string;
  variant?: string;
  external?: boolean;
}
import {
  IconPoint,
  IconAlertCircle,
  IconAppWindow,
  IconHome2,
  IconUser,
  IconUsers,
  IconFileInvoice,
} from "@tabler/icons-react";

const Menuitems: MenuitemsType[] = [
  {
    id: uniqueId(),
    title: "Inicio",
    icon: IconHome2,
    href: "/",
    chipColor: "secondary",
  },
  {
    id: uniqueId(),
    title: "Incidencias",
    icon: IconAlertCircle,
    href: "/employees-incidents/",
    children: [
      {
        id: uniqueId(),
        title: "Ver incidencias",
        icon: IconPoint,
        href: "/admin/employees-incidents",
      },
      {
        id: uniqueId(),
        title: "Crear incidencia",
        icon: IconPoint,
        href: "/admin/employees-incidents/create",
      },
    ],
  },
  {
    id: uniqueId(),
    title: "Solicitudes",
    icon: IconFileInvoice,
    href: "/employees-requests/",
    children: [
      {
        id: uniqueId(),
        title: "Ver solicitudes",
        icon: IconPoint,
        href: "/admin/employees-requests",
      },
      {
        id: uniqueId(),
        title: "Crear solicitud",
        icon: IconPoint,
        href: "/admin/employees-requests/create",
      },
    ],
  },
  {
    id: uniqueId(),
    title: "Usuarios",
    icon: IconUser,
    href: "/admin/users",
  },
  {
    id: uniqueId(),
    title: "Empleados",
    icon: IconUsers,
    href: "/employees/",
    children: [
      {
        id: uniqueId(),
        title: "Ver empleados",
        icon: IconPoint,
        href: "/admin/employees",
      },
      {
        id: uniqueId(),
        title: "Crear empleado",
        icon: IconPoint,
        href: "/admin/employees/create",
      },
    ],
  },
  {
    id: uniqueId(),
    title: "Asistencia",
    icon: IconAppWindow,
    href: "/frontend-pages/",
    children: [
      {
        id: uniqueId(),
        title: "Ver Asistencias",
        icon: IconPoint,
        href: "/frontend-pages/homepage",
      },
      {
        id: uniqueId(),
        title: "Crear Asistencia",
        icon: IconPoint,
        href: "/frontend-pages/about",
      },
    ],
  },
];

export default Menuitems;
