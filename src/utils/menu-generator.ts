import { uniqueId } from "lodash";

export function generateMenuItems(roleModules: Array<{ module: any }>) {
  const modules = roleModules.map((rm) => rm.module);

  const parents = modules.filter((m) => !m.parent_id);
  const children = modules.filter((m) => m.parent_id);

  return parents.map((parent) => {
    const childItems = children
      .filter((child) => child.parent_id === parent.id)
      .map((child) => ({
        id: uniqueId(),
        title: child.display_name,
        icon: child.icon,
        href: child.route,
      }));

    return {
      id: uniqueId(),
      title: parent.display_name,
      icon: parent.icon,
      href: parent.route,
      ...(childItems.length > 0 ? { children: childItems } : {}),
    };
  });
}
