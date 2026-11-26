function numberEnv(env, name, defaultValue, min, max) {
  const raw = env[name];
  const n = raw === undefined || raw === "" ? defaultValue : Number(raw);
  if (!Number.isSafeInteger(n) || n < min || n > max) {
    throw new Error(`${name} debe ser un entero entre ${min} y ${max}`);
  }
  return n;
}
export function readConfig(env = process.env) {
  const base = env.ZLINK_API_BASE_URL || "https://zlink.minervaiot.com";
  const baseUrl = new URL(base);
  if (baseUrl.protocol !== "https:" && !(baseUrl.hostname === "localhost" || baseUrl.hostname === "127.0.0.1")) {
    throw new Error("La URL de Zlink debe usar HTTPS");
  }
  if (!env.ZLINK_COMPANY_ID || !env.ZLINK_DEVICE_ID) {
    throw new Error("Faltan ZLINK_COMPANY_ID o ZLINK_DEVICE_ID en .env");
  }
  return {
    apiBaseUrl: baseUrl.origin,
    companyId: env.ZLINK_COMPANY_ID,
    deviceId: env.ZLINK_DEVICE_ID,
    csrfToken: env.ZLINK_CSRF_TOKEN || "",
    timezoneHeader: env.ZLINK_TIMEZONE_HEADER || "America/Mexico_City;dst=0;UTC=-06:00;",
    localTimezone: env.ZLINK_LOCAL_TIMEZONE || "America/Mexico_City",
    databaseUrl: env.DATABASE_URL || "",
    accessToken: env.ZLINK_ACCESS_TOKEN || "",
    refreshToken: env.ZLINK_REFRESH_TOKEN || "",
    everySeconds: numberEnv(env,"SYNC_EVERY_SECONDS",120,30,86400),
    lookbackDays: numberEnv(env,"SYNC_LOOKBACK_DAYS",3,1,60),
    reconcileDays: numberEnv(env,"SYNC_RECONCILE_DAYS",14,1,366),
    reconcileHours: numberEnv(env,"SYNC_RECONCILE_HOURS",24,1,168),
    pageSize: numberEnv(env,"SYNC_PAGE_SIZE",100,1,1000),
    maxPagesPerDay: numberEnv(env,"SYNC_MAX_PAGES_PER_DAY",1000,1,100000),
    requestDelayMs: numberEnv(env,"SYNC_REQUEST_DELAY_MS",100,0,30000),
    timeoutMs: numberEnv(env,"SYNC_TIMEOUT_MS",15000,1000,120000),
    refreshMarginSeconds: numberEnv(env,"SYNC_REFRESH_MARGIN_SECONDS",300,30,1800),
    retries: numberEnv(env,"SYNC_RETRIES",3,0,10),
  };
}
