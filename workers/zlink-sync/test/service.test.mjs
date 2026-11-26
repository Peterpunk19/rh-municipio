import test from "node:test";
import assert from "node:assert/strict";
import { readConfig } from "../src/config.mjs";
import { ZlinkApi } from "../src/api-client.mjs";
import { AuthManager } from "../src/auth-manager.mjs";
import { ZlinkSyncService } from "../src/sync-service.mjs";
import { mapToPrismaEvent, PrismaStore, localWallDate } from "../src/prisma-store.mjs";
import { datesBetween } from "../src/dates.mjs";

const jwt = (exp) => `xx.${Buffer.from(JSON.stringify({ exp })).toString("base64url")}.sig`;
const valid = jwt(Math.floor(Date.now() / 1000) + 7200);
const config = () => readConfig({
  ZLINK_COMPANY_ID: "test-company", ZLINK_DEVICE_ID: "test-device",
  ZLINK_CSRF_TOKEN: "test-csrf", ZLINK_ACCESS_TOKEN: valid,
  ZLINK_REFRESH_TOKEN: "test-refresh", SYNC_PAGE_SIZE: "2", SYNC_REQUEST_DELAY_MS: "0",
});
const row = (id, date = "2026-11-15") => ({
  id, employee_code: "100001", terminal_sn: "VDE2252001099",
  punch_time: `${date} 14:09:59`, timezone: "-06:00",
  upload_time: `${date} 14:36:08`, verify_type: 0, source: 5,
});
const response = (obj, http = 200) => ({ ok: http >= 200 && http < 300, status: http, async json() { return obj; } });
class MemorySession {
  constructor(session) { this.session = session; this.saved = []; }
  async load() { return this.session; }
  async save(s) { this.saved.push(structuredClone(s)); this.session = structuredClone(s); }
}
class FakePrisma {
  constructor() {
    this.events = new Map(); this.runs = new Map(); this.states = new Map();
    this.zlinkEvent = {
      createMany: async ({ data, skipDuplicates }) => {
        assert.equal(skipDuplicates, true);
        let count = 0;
        for (const item of data) {
          const key = [item.source, item.companyId, item.eventId].join("|");
          if (this.events.has(key)) continue;
          this.events.set(key, item); count++;
        }
        return { count };
      },
    };
    this.zlinkSyncState = {
      findUnique: async ({ where }) => this.states.get(where.companyId) ?? null,
      upsert: async ({ where, create, update }) => {
        this.states.set(where.companyId, { ...this.states.get(where.companyId), ...create, ...update });
      },
    };
    this.zlinkSyncRun = {
      create: async ({ data }) => {
        const id = BigInt(this.runs.size + 1);
        this.runs.set(id, { ...data });
        return { id };
      },
      update: async ({ where, data }) => this.runs.set(where.id, { ...this.runs.get(where.id), ...data }),
    };
  }
}

test("Prisma conserva hora local, UTC, payload y los ids originales", () => {
  const record = mapToPrismaEvent(row(115127443), "company-1");
  assert.equal(record.punchTimeUtc.toISOString(), "2026-11-15T20:09:59.000Z");
  assert.equal(record.punchTimeLocal.toISOString(), "2026-11-15T14:09:59.000Z");
  assert.equal(record.uploadTimeLocal.toISOString(), "2026-11-15T14:36:08.000Z");
  assert.equal(record.eventId, "115127443");
  assert.equal(record.raw.verify_type, 0);
  assert.throws(() => localWallDate("2026-02-30 00:00:00"), /invalida/);
});

test("Prisma createMany evita duplicados entre ciclos", async () => {
  const p = new FakePrisma();
  const store = new PrismaStore(p, "company-1");
  assert.equal(await store.savePage([row(115127443), row(115127444)]), 2);
  assert.equal(await store.savePage([row(115127443), row(115127444)]), 0);
  assert.equal(p.events.size, 2);
});

test("Token rotado se persiste antes del switchCompany", async () => {
  const c = config(); const calls = [];
  const api = new ZlinkApi(c, { fetcher: async (url, req) => {
    calls.push({ url, method: req.method });
    if (url.endsWith("refresh_token")) return response({ code: "UASI0011", data: { access_token: valid, refresh_token: "rotated", expires_in: 3600 } });
    if (url.endsWith("switchCompany")) return response({ code: "UASI0011", data: { access_token: valid, refresh_token: "company", expires_in: 3600 } });
    throw new Error("Unexpected request");
  } });
  const ss = new MemorySession({ access_token: valid, refresh_token: "old", expires_at: Date.now() + 1000, company_selected: true });
  const auth = new AuthManager(c, api, ss, { log() {}, warn() {} });
  assert.equal((await auth.ensureActive()).refresh_token, "company");
  assert.deepEqual(ss.saved.map((s) => s.refresh_token), ["rotated", "company"]);
  assert.equal(calls.length, 2);
});

test("Reconsulta, paginacion y staging conservan eventos sin duplicarlos", async () => {
  const c = config();
  const fetcher = async (url, req) => {
    assert.ok(url.includes("/transaction/"));
    const page = Number(new URL(url).searchParams.get("pageNumber"));
    return response({ status: "SUCCESS", result: { total: 3, data: page === 1 ? [row(1), row(2)] : [row(3)] } });
  };
  const api = new ZlinkApi(c, { fetcher, sleeper: async () => {} });
  const auth = new AuthManager(c, api, new MemorySession({ access_token: valid, refresh_token: "valid", expires_at: Date.now() + 7000000, company_selected: true }), { log() {} });
  const p = new FakePrisma(); const db = new PrismaStore(p, c.companyId);
  const svc = new ZlinkSyncService(c, auth, api, db, { log: { log() {}, error() {}, warn() {} }, sleeper: async () => {} });
  const run1 = await svc.run({ range: { from: "2026-11-15", to: "2026-11-15", reconcile: false } });
  const run2 = await svc.run({ range: { from: "2026-11-15", to: "2026-11-15", reconcile: false } });
  assert.equal(run1.fetched, 3); assert.equal(run1.inserted, 3);
  assert.equal(run2.inserted, 0); assert.equal(p.events.size, 3);
  assert.equal(p.runs.size, 2);
  assert.deepEqual(datesBetween("2026-11-14", "2026-11-15"), ["2026-11-14", "2026-11-15"]);
});

test("dry-run consulta sin escribir a MySQL", async () => {
  const c = config(); c.pageSize = 100;
  const api = new ZlinkApi(c, { fetcher: async () => response({ status: "SUCCESS", result: { total: 1, data: [row(22)] } }) });
  const auth = new AuthManager(c, api, new MemorySession({ access_token: valid, refresh_token: "valid", expires_at: Date.now() + 7000000, company_selected: true }), { log() {} });
  const svc = new ZlinkSyncService(c, auth, api, null, { log: { log() {}, error() {}, warn() {} } });
  const result = await svc.run({ range: { from: "2026-11-15", to: "2026-11-15" }, dryRun: true });
  assert.equal(result.fetched, 1); assert.equal(result.inserted, 0);
});
