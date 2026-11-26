export function parseEvent(raw, companyId) {
  if (!raw || typeof raw !== "object" || raw.id == null) {
    throw new Error("Evento Zlink sin id");
  }
  const local = raw.punch_time;
  const offset = raw.timezone;
  if (typeof local !== "string" || !/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(local)) {
    throw new Error(`Evento ${String(raw.id)} sin punch_time valido`);
  }
  if (typeof offset !== "string" || !/^[+-](?:0\d|1[0-4]):[0-5]\d$/.test(offset)) {
    throw new Error(`Evento ${String(raw.id)} sin timezone offset valido`);
  }
  const iso = `${local.replace(" ", "T")}${offset}`;
  const utc = new Date(iso);
  if (!Number.isFinite(utc.valueOf())) throw new Error(`Evento ${String(raw.id)} tiene fecha invalida`);
  if (!raw.employee_code || !raw.terminal_sn) throw new Error(`Evento ${String(raw.id)} sin empleado o SN`);
  return {
    source: "zkbio_zlink", companyId, eventId: String(raw.id), employeeCode: String(raw.employee_code),
    terminalSn: String(raw.terminal_sn), terminalAlias: raw.terminal_alias || null,
    punchLocal: local, punchUtc: utc.toISOString(), timezoneOffset: offset,
    uploadLocal: raw.upload_time || null,
    verifyType: raw.verify_type == null ? null : String(raw.verify_type),
    deviceVerifyType: raw.device_verify_type == null ? null : String(raw.device_verify_type),
    sourceCode: raw.source == null ? null : String(raw.source),
    personStatus: raw.status || null, raw,
  };
}
