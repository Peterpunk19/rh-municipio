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
  IconAward,
  IconBoxMultiple,
  IconPoint,
  IconAlertCircle,
  IconNotes,
  IconCalendar,
  IconMail,
  IconTicket,
  IconEdit,
  IconGitMerge,
  IconCurrencyDollar,
  IconApps,
  IconFileDescription,
  IconFileDots,
  IconFiles,
  IconBan,
  IconStar,
  IconMoodSmile,
  IconBorderAll,
  IconBorderHorizontal,
  IconBorderInner,
  IconBorderVertical,
  IconBorderTop,
  IconUserCircle,
  IconPackage,
  IconMessage2,
  IconBasket,
  IconChartLine,
  IconChartArcs,
  IconChartCandle,
  IconChartArea,
  IconChartDots,
  IconChartDonut3,
  IconChartRadar,
  IconLogin,
  IconUserPlus,
  IconRotate,
  IconBox,
  IconShoppingCart,
  IconAperture,
  IconLayout,
  IconSettings,
  IconHelp,
  IconZoomCode,
  IconBoxAlignBottom,
  IconBoxAlignLeft,
  IconBorderStyle2,
  IconLockAccess,
  IconAppWindow,
  IconNotebook,
  IconFileCheck,
  IconChartHistogram,
  IconListTree,
  IconChartArcs3,
  IconChartPpf,
  IconChartScatter,
  IconChartPie2,
  IconHome2,
  IconUser,
  IconBrandGolang,
  IconUsers,
} from "@tabler/icons-react";

const Menuitems: MenuitemsType[] = [
  {
    id: uniqueId(),
    title: "Inicio",
    icon: IconHome2,
    href: "/",
    //chip: "New",
    chipColor: "secondary",
  },

  {
    id: uniqueId(),
    title: "Incidencias",
    icon: IconAlertCircle,
    href: "/admin/incidents",
    chipColor: "secondary",
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
        title: "Ver Empleados",
        icon: IconPoint,
        href: "/admin/employees",
      },
      {
        id: uniqueId(),
        title: "Crear Empleado",
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
