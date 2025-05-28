export interface IDireccion {
  id: number;
  name: string;
  display_name: string;
  director: { id: number; name: string };
  deputy_director: { id: number; name: string };
  startDate: string;
  endDate: string;
}

export interface IAdministrativeOrganization {
  id: number;
  name: string;
  display_name: string;
  direcciones?: IDireccion[];
}
