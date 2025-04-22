export interface HttpResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  responseObject?: T;
}
