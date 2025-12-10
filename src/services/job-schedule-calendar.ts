import http from "@/lib/http";
import { IResponse } from "@/utils/types";

export const saveJobScheduleCalendar = async (data: object): Promise<IResponse> => {
  try {
    const response = await http.post<IResponse>("/api/job-schedule-calendar/create", data);
    return response.data;
  } catch (error: any) {
    return error;
  }
};

export const getJobScheduleCalendar = async (data: string): Promise<IResponse> => {
  try {
    const urlParams = new URLSearchParams(data).toString();
    const url = urlParams ? `/api/job-schedule-calendar?${urlParams}` : "/api/job-schedule-calendar";

    const response = await http.get<IResponse>(url);
    return response.data;
  } catch (error: any) {
    return error;
  }
};
