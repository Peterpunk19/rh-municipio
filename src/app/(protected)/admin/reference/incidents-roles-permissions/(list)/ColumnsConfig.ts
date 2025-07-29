import type { ColumnTypeConfig } from "@/interfaces/ColumnTypeConfig";
import { fetchData } from "@/store/reference/incidents-roles-permissions/ListSlice";

const entity = "incidentsRolesPermissions";
const url = "/api/catalogs/incidents-roles-permissions";

export const columnTypeConfig: Record<string, ColumnTypeConfig> = {
  "role.display_name": { renderType: "text" },
  "incident.name": { renderType: "text" },
  can_view: {
    renderType: "switch",
    switchConfig: {
      url,
      field: "can_view",
      entity,
      fetchAction: fetchData,
    },
  },
  can_create: {
    renderType: "switch",
    switchConfig: {
      url,
      field: "can_create",
      entity,
      fetchAction: fetchData,
    },
  },
  can_approve: {
    renderType: "switch",
    switchConfig: {
      url,
      field: "can_approve",
      entity,
      fetchAction: fetchData,
    },
  },
  can_reject: {
    renderType: "switch",
    switchConfig: {
      url,
      field: "can_reject",
      entity,
      fetchAction: fetchData,
    },
  },
  can_cancel: {
    renderType: "switch",
    switchConfig: {
      url,
      field: "can_cancel",
      entity,
      fetchAction: fetchData,
    },
  },
  can_delete: {
    renderType: "switch",
    switchConfig: {
      url,
      field: "can_delete",
      entity,
      fetchAction: fetchData,
    },
  },
  can_edit: {
    renderType: "switch",
    switchConfig: {
      url,
      field: "can_edit",
      entity,
      fetchAction: fetchData,
    },
  },
  active: {
    renderType: "switch",
    switchConfig: {
      url,
      field: "active",
      entity,
      fetchAction: fetchData,
    },
  },
};
