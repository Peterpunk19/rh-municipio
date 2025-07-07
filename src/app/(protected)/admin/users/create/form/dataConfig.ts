export interface FormErrors {
  username?: string;
  password?: string;
  role_id?: string;
  direcciones_ids?: number[];
  secretaria_id?: string;
  [key: string]: string | string[] | number[] | number | undefined;
}

export const initialFormData = {
  username: "",
  role_id: "0",
  password: "",
  direcciones_ids: [] as number[],
  secretaria_id: 0,
};
