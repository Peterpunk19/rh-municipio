export function validateDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error(`Fecha invalida: ${value}`);
  const t = new Date(`${value}T12:00:00Z`);
  if (!Number.isFinite(t.valueOf()) || t.toISOString().slice(0,10) !== value) {
    throw new Error(`Fecha invalida: ${value}`);
  }
  return value;
}
export function shiftDay(date, n) {
  validateDate(date);
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
export function datesBetween(from, to, maxDays = 366) {
  validateDate(from); validateDate(to);
  if (from > to) throw new Error("Fecha inicial posterior a final");
  const days=[];
  for (let d=from; d<=to; d=shiftDay(d, 1)) {
    days.push(d);
    if (days.length > maxDays) throw new Error(`Rango maximo: ${maxDays} dias`);
  }
  return days;
}
export function todayInZone(zone, at = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: zone, year:"numeric", month:"2-digit", day:"2-digit"
  }).formatToParts(at);
  const val = Object.fromEntries(parts.filter(p=>p.type!=="literal").map(p=>[p.type,p.value]));
  return `${val.year}-${val.month}-${val.day}`;
}
