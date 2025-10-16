export interface IDirector {
  id: number;
  name: string;
  startDate?: string;
  endDate?: string;
}

export interface IDireccion {
  id: number;
  name: string;
  director: IDirector;
  secretary: IDirector;
  coordinator: IDirector;
  immediateResponsible: IDirector;
  enlace?: IEnlace;
  subenlace?: IEnlace;
  signatories: {
    incidentSigner: number | null;
    requestSigner: number | null;
  };
}

export interface IAdministrativeOrganization {
  id: number;
  name: string;
  display_name: string;
  direcciones?: IDireccion[];
}

export interface DirectorFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  secretaria: string;
  direccion: IDireccion | null;
}

export interface FormErrors {
  director_id?: string;
  deputy_director_id?: string;
  startDate?: string;
  endDate?: string;
  [key: string]: string | undefined;
}

export interface IEnlace {
  id: number;
  username: string;
}
