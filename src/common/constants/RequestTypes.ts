const REQUEST_TYPES = {
  SCHEDULE: 1,
  LOCATION: 2,
  ATTENDANCE: 3,
  FINGERPRINT: 4,
  ADSCRIPTION: 5,
  RELEASE: 6,
  UNION_LEAVE: 7,
  SCHEDULE_ATTENDANCE: 8,
};

export default REQUEST_TYPES;

export enum REQUEST_TYPES_NAME {
  SCHEDULE = "schedule_change_request",
  LOCATION = "location_change_request",
  ATTENDANCE = "checker_change_request",
  FINGERPRINT = "fingerprint_registration_request",
  ADSCRIPTION = "adscription_change_request",
  RELEASE = "release_request",
  UNION_LEAVE = "union_leave_request",
  SCHEDULE_ATTENDANCE = "schedule_attendance_change_request",
}
