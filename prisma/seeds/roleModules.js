const adminRoleModules = Array.from({ length: 15 }, (_, index) => ({
  role_id: 1,
  module_id: index + 1,
  can_view: true,
  can_create: true,
  can_edit: true,
  can_delete: true,
}));

const adminIncidenciaRoleModules = [
  { role_id: 7, module_id: 2, can_view: true, can_create: true, can_edit: true, can_delete: true },
  { role_id: 7, module_id: 3, can_view: true },
  { role_id: 7, module_id: 4, can_view: true, can_create: true },
  { role_id: 7, module_id: 5, can_view: true, can_create: true, can_edit: true },
  { role_id: 7, module_id: 6, can_view: true },
  { role_id: 7, module_id: 7, can_view: true, can_create: true },
  { role_id: 7, module_id: 8, can_view: true, can_create: true, can_edit: true },
  { role_id: 7, module_id: 9, can_view: true },
];

const empleadoRoleModules = [
  { role_id: 3, module_id: 2, can_view: true },
  { role_id: 3, module_id: 3, can_view: true },
  { role_id: 3, module_id: 4, can_view: true, can_create: true },
  { role_id: 3, module_id: 8, can_view: true },
  { role_id: 3, module_id: 9, can_view: true },
];

const enlaceRoleModules = [
  { role_id: 4, module_id: 2, can_view: true, can_create: true, can_edit: true, can_delete: true },
  { role_id: 4, module_id: 3, can_view: true },
  { role_id: 4, module_id: 4, can_view: true, can_create: true },
  { role_id: 4, module_id: 5, can_view: true, can_create: true, can_edit: true },
  { role_id: 4, module_id: 6, can_view: true },
  { role_id: 4, module_id: 7, can_view: true, can_create: true },
  { role_id: 4, module_id: 8, can_view: true, can_create: true, can_edit: true },
  { role_id: 4, module_id: 9, can_view: true },
];

const subEnlaceRoleModules = [
  { role_id: 13, module_id: 2, can_view: true, can_create: true, can_edit: true, can_delete: true },
  { role_id: 13, module_id: 3, can_view: true },
  { role_id: 13, module_id: 4, can_view: true, can_create: true },
  { role_id: 13, module_id: 5, can_view: true, can_create: true, can_edit: true },
  { role_id: 13, module_id: 6, can_view: true },
  { role_id: 13, module_id: 7, can_view: true, can_create: true },
  { role_id: 13, module_id: 8, can_view: true, can_create: true, can_edit: true },
  { role_id: 13, module_id: 9, can_view: true },
];

module.exports = [
  ...adminRoleModules,
  ...adminIncidenciaRoleModules,
  ...empleadoRoleModules,
  ...enlaceRoleModules,
  ...subEnlaceRoleModules,
];
