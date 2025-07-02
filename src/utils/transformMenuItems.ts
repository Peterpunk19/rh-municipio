import { iconMap } from "@/utils/iconMap";

export function transformMenuItems(menuItems: any[]): any[] {
  if (!Array.isArray(menuItems)) return [];
  return menuItems.map((item) => {
    const iconComponent = item.icon && iconMap[item.icon] ? iconMap[item.icon] : undefined;
    const children = item.children ? transformMenuItems(item.children) : undefined;

    return {
      ...item,
      icon: iconComponent,
      children,
    };
  });
}
