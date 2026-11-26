#!/usr/bin/env node
// Semilla SOLO la sesion de la cuenta dedicada. No requiere MySQL.
// Ejecutar con el daemon detenido. No imprime secretos.
import { config as loadDotenv } from "dotenv";
import { resolve, dirname } from "node:path";
import { mkdir } from "node:fs/promises";
import { ZlinkApi } from "../src/api-client.mjs";
import { readConfig } from "../src/config.mjs";
import { FileSessionStore, jwtExpiryMs } from "../src/session-store.mjs";

loadDotenv({ path: process.env.ZLINK_ENV_FILE || "workers/zlink-sync/.env" });
const replace = process.argv.includes("--replace");
const config = readConfig();
if (!config.accessToken || !config.refreshToken) {
  throw new Error("Faltan ZLINK_ACCESS_TOKEN / ZLINK_REFRESH_TOKEN de la cuenta exclusiva para sync");
}
const expiry = jwtExpiryMs(config.accessToken);
if (!expiry || expiry < Date.now() + 30_000) {
  throw new Error("Access token expirado o sin exp valido; inicia sesion con la cuenta dedicada");
}
const path = resolve(process.env.ZLINK_SESSION_FILE || "workers/zlink-sync/.data/session.json");
await mkdir(dirname(path), { recursive: true, mode: 0o700 });
const store = new FileSessionStore(path);
if (await store.load() && !replace) {
  throw new Error("Ya hay una sesion. Deten el daemon y usa --replace para recuperarla desde .env");
}
// No modificar el archivo hasta que la seleccion de empresa sea exitosa.
const session = await new ZlinkApi(config).switchCompany({
  access_token: config.accessToken,
  refresh_token: config.refreshToken,
  expires_at: expiry,
  company_selected: false,
});
await store.save(session);
console.log("Cuenta de integracion activada. Sesion persistida, sin revelar tokens.");
