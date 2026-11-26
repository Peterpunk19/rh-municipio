#!/usr/bin/env node
import { config as loadDotenv } from "dotenv";
import { resolve, dirname } from "node:path";
import { mkdir } from "node:fs/promises";
import { setTimeout as sleep } from "node:timers/promises";
import { readConfig } from "../src/config.mjs";
import { ZlinkApi } from "../src/api-client.mjs";
import { FileSessionStore } from "../src/session-store.mjs";
import { AuthManager } from "../src/auth-manager.mjs";
import { PrismaStore } from "../src/prisma-store.mjs";
import { ZlinkSyncService } from "../src/sync-service.mjs";
import { acquireLock } from "../src/lock.mjs";
import { timestampLogger } from "../src/logger.mjs";
import { datesBetween } from "../src/dates.mjs";

// Ejecutar desde la raiz del proyecto RH Municipio.
loadDotenv({ path: process.env.ZLINK_ENV_FILE || "workers/zlink-sync/.env" });

function usage() {
  console.log(`Uso desde la raiz de RH Municipio:\n  node workers/zlink-sync/bin/sync.mjs --once [--dry-run]\n  node workers/zlink-sync/bin/sync.mjs --daemon\n  node workers/zlink-sync/bin/sync.mjs --backfill YYYY-MM-DD YYYY-MM-DD [--dry-run]`);
}
const args = process.argv.slice(2);
if (args.includes("--help")) { usage(); process.exit(0); }
const daemon = args.includes("--daemon");
const once = args.includes("--once");
const backfillAt = args.indexOf("--backfill");
const dryRun = args.includes("--dry-run");
if ([daemon, once, backfillAt >= 0].filter(Boolean).length !== 1 || (daemon && dryRun)) {
  usage(); process.exit(2);
}
let range = null;
if (backfillAt >= 0) {
  const from = args[backfillAt + 1];
  const to = args[backfillAt + 2];
  if (!from || !to || from.startsWith("--") || to.startsWith("--")) throw new Error("--backfill requiere dos fechas");
  datesBetween(from, to);
  range = { from, to, reconcile: false };
}
const config = readConfig();
const lockFile = resolve(process.env.ZLINK_LOCK_FILE || "workers/zlink-sync/.data/sync.lock");
const sessionFile = resolve(process.env.ZLINK_SESSION_FILE || "workers/zlink-sync/.data/session.json");
await mkdir(dirname(lockFile), { recursive: true, mode: 0o700 });
await mkdir(dirname(sessionFile), { recursive: true, mode: 0o700 });
const release = await acquireLock(lockFile);
let db;
let stopped = false;
process.on("SIGINT", () => { stopped = true; console.log("Deteniendo al terminar el ciclo actual"); });
process.on("SIGTERM", () => { stopped = true; console.log("Deteniendo al terminar el ciclo actual"); });
try {
  const api = new ZlinkApi(config);
  const sessionStore = new FileSessionStore(sessionFile);
  const auth = new AuthManager(config, api, sessionStore, timestampLogger);
  if (!dryRun) db = await PrismaStore.connect(config.databaseUrl, config.companyId);
  const service = new ZlinkSyncService(config, auth, api, db, { log: timestampLogger });
  if (!daemon) {
    await service.run({ range, dryRun });
  } else {
    while (!stopped) {
      try { await service.run(); }
      catch (error) {
        console.error(`[${new Date().toISOString()}] Fallo sincronizacion: ${error.kind || error.message} ${error.code || ""}`);
        // No entrar en un bucle de tokens invalidos; requieren intervencion operativa.
        if (error.kind?.includes("Autenticacion") || error.kind?.includes("Refresh") || error.kind?.includes("Switch")) {
          console.error("Autenticacion detenida. Revisar cuenta dedicada y metodo oficial de acceso a Zlink.");
          process.exitCode = 78;
          break;
        }
      }
      if (!stopped) await sleep(config.everySeconds * 1_000);
    }
  }
} catch (error) {
  console.error(`ERROR: ${error.kind || error.message}${error.code ? ` [${error.code}]` : ""}`);
  process.exitCode = error.kind?.includes("Refresh") || error.kind?.includes("Autenticacion") ? 78 : 1;
} finally {
  if (db) await db.close();
  await release();
}
