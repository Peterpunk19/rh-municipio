export interface ICatalog {
  id: string;
  name: string;
  display_name: string;
  salary?: string;
}

export interface IResponseObject {
  responseObject: { id: string; name: string; display_name: string }[];
}

export interface ILabelError {
  field?: string;
}

export interface IHelperText {
  field?: string;
}

export interface IResponse {
  success: boolean;
  message: string;
  responseObject: any;
  statusCode: number;
}
