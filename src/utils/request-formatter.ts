import REQUEST_TYPES from "@/common/constants/RequestTypes";
interface Schedule {
  startDayId: number;
  endDayId: number;
  startHourId: number;
  endHourId: number;
}

interface FormData {
  employeeId: string;
  description: string;
  typeRequestId: string;
  fingerprintForm: {
    locationId: number;
    requestDate: string;
  };
  scheduleForm: {
    schedules: Schedule[];
    startDate: string;
    endDate: string;
  };
  locationForm: {
    currentLocationId: number;
    newLocationId: number;
    startDate: string;
    endDate: string;
    unionName: string;
  };
  attendanceTypeForm: {
    attendanceType: string;
    applicationDate: string;
  };
  adscriptionForm: {
    secretariaId: number;
    direccionId: number;
    requestDate: string;
    startDate: string;
    oficio: string;
  };
}

export const formatRequestData = (formData: FormData) => {
  const baseData = {
    description: formData.description,
    requestId: Number(formData.typeRequestId),
    employeeId: Number(formData.employeeId),
  };

  switch (Number(formData.typeRequestId)) {
    case REQUEST_TYPES.SCHEDULE:
      return {
        ...baseData,
        startDate: formData.scheduleForm.startDate,
        endDate: formData.scheduleForm.endDate,
        schedule: formData.scheduleForm.schedules.map((schedule) => ({
          startDayId: schedule.startDayId,
          startHourId: schedule.startHourId,
          endDayId: schedule.endDayId,
          endHourId: schedule.endHourId,
        })),
      };

    case REQUEST_TYPES.LOCATION:
      return {
        ...baseData,
        locationId: formData.locationForm.newLocationId,
        startDate: formData.locationForm.startDate,
        endDate: formData.locationForm.endDate,
      };

    case REQUEST_TYPES.UNION_LEAVE:
      return {
        ...baseData,
        locationId: formData.locationForm.newLocationId,
        startDate: formData.locationForm.startDate,
        endDate: formData.locationForm.endDate,
        unionName: formData.locationForm.unionName,
      };

    case REQUEST_TYPES.ATTENDANCE:
      return {
        ...baseData,
        attendanceId: Number(formData.attendanceTypeForm.attendanceType),
        attendanceDate: formData.attendanceTypeForm.applicationDate,
      };

    case REQUEST_TYPES.FINGERPRINT:
      return {
        ...baseData,
        locationId: formData.fingerprintForm.locationId,
        requestDate: formData.fingerprintForm.requestDate,
      };

    case REQUEST_TYPES.ADSCRIPTION:
      return {
        ...baseData,
        secretariaId: formData.adscriptionForm.secretariaId,
        direccionId: formData.adscriptionForm.direccionId,
        oficio: formData.adscriptionForm.oficio,
        requestDate: formData.adscriptionForm.requestDate,
        startDate: formData.adscriptionForm.startDate,
      };

    default:
      return { ...baseData };
  }
};
