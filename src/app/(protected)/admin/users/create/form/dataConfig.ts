export interface FormErrors {
  username?: string;
  password?: string;
  role_id?: string;
  [key: string]: string | undefined;
}

export const initialFormData = {
  username: "",
  role_id: "0",
  password: "",
};
