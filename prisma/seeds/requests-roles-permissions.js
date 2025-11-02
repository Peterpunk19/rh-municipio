const roles = {
  ADMIN: 1,
  EMPLEADO: 3,
  ENLACE: 4,
  CAPTURISTA: 5,
  ANALISTA: 6,
  ADMIN_INCIDENCIAS: 7,
  SERVICIO_SOCIAL: 9,
  SUBENLACE: 13,
};

const basePermissions = [
  {
    request_id: 1,
    // name: "schedule_change_request",
    can_view: true,
    can_create: true,
    can_approve: false,
    can_cancel: true,
    can_delete: true,
    can_reject: false,
    can_edit: true,
    active: true,
  },
  {
    request_id: 2,
    // name: "location_change_request",
    can_view: true,
    can_create: true,
    can_approve: false,
    can_cancel: true,
    can_delete: true,
    can_reject: false,
    can_edit: true,
    active: true,
  },
  {
    request_id: 3,
    // name: "checker_change_request",
    can_view: true,
    can_create: true,
    can_approve: false,
    can_cancel: true,
    can_delete: true,
    can_reject: false,
    can_edit: true,
    active: true,
  },
  {
    request_id: 4,
    // name: "fingerprint_registration_request",
    can_view: true,
    can_create: true,
    can_approve: false,
    can_cancel: true,
    can_delete: true,
    can_reject: false,
    can_edit: true,
    active: true,
  },
  {
    request_id: 5,
    // name: "adscription_change_request",
    can_view: true,
    can_create: true,
    can_approve: false,
    can_cancel: true,
    can_delete: true,
    can_reject: false,
    can_edit: true,
    active: true,
  },
  {
    request_id: 7,
    // name: "union_leave_request",
    can_view: true,
    can_create: true,
    can_approve: false,
    can_cancel: true,
    can_delete: true,
    can_reject: false,
    can_edit: true,
    active: true,
  },
];

const adminPermissions = basePermissions.map((permission) => ({
  role_id: roles.ADMIN,
  ...permission,
  can_approve: true,
  can_reject: true,
}));

const enlacePermissions = basePermissions.map((permission) => ({
  role_id: roles.ENLACE,
  ...permission,
  can_approve: true,
  can_reject: true,
}));

const analistaPermissions = basePermissions.map((permission) => ({
  role_id: roles.ANALISTA,
  ...permission,
  can_approve: true,
  can_reject: true,
}));

const employeePermissions = basePermissions.map((permission) => ({
  role_id: roles.EMPLEADO,
  ...permission,
  can_approve: false,
  can_reject: false,
  can_edit: false,
  can_delete: false,
}));

const capturistaPermissions = basePermissions.map((permission) => ({
  role_id: roles.CAPTURISTA,
  ...permission,
}));

const adminIncidenciasPermissions = basePermissions.map((permission) => ({
  role_id: roles.ADMIN_INCIDENCIAS,
  ...permission,
  can_approve: true,
  can_reject: true,
}));

const servicioSocialPermissions = basePermissions.map((permission) => ({
  role_id: roles.SERVICIO_SOCIAL,
  ...permission,
  can_approve: false,
  can_reject: false,
  can_edit: false,
  can_delete: false,
}));

const subenlacePermissions = basePermissions.map((permission) => ({
  role_id: roles.SUBENLACE,
  ...permission,
  can_approve: true,
  can_reject: true,
}));

const allPermissions = [
  ...adminPermissions,
  ...enlacePermissions,
  ...analistaPermissions,
  ...employeePermissions,
  ...capturistaPermissions,
  ...adminIncidenciasPermissions,
  ...servicioSocialPermissions,
  ...subenlacePermissions,
];

module.exports = { allPermissions };
