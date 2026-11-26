import { parseEvent } from "./event-parser.mjs";

// Prisma representa fechas como JS Date en UTC. Para columnas DATETIME locales,
// UTC aqui es solo una representacion tecnica del reloj (no una conversion real).
export function localWallDate(value, label = "fecha") {
  if (value == null) return null;
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value)) {
    throw new Error(`${label} invalida`);
  }
  const utcText = `${value.replace(" ", "T")}Z`;
  const date = new Date(utcText);
  if (!Number.isFinite(date.valueOf()) || date.toISOString().slice(0, 19) !== utcText.slice(0, 19)) {
    throw new Error(`${label} invalida`);
  }
  return date;
}

export function mapToPrismaEvent(raw, companyId) {
  const event = parseEvent(raw, companyId);
  return {
    source: event.source,
    companyId: event.companyId,
    eventId: event.eventId,
    employeeCode: event.employeeCode,
    terminalSn: event.terminalSn,
    terminalAlias: event.terminalAlias,
    punchTimeLocal: localWallDate(event.punchLocal, "punch_time"),
    punchTimeUtc: new Date(event.punchUtc),
    timezoneOffset: event.timezoneOffset,
    uploadTimeLocal: localWallDate(event.uploadLocal, "upload_time"),
    verifyType: event.verifyType,
    deviceVerifyType: event.deviceVerifyType,
    sourceCode: event.sourceCode,
    personStatus: event.personStatus,
    raw: event.raw,
  };
}

export class PrismaStore {
  constructor(client, companyId, ownsClient = false) {
    this.client = client;
    this.companyId = companyId;
    this.ownsClient = ownsClient;
  }

  static async connect(databaseUrl, companyId, { PrismaClientCtor } = {}) {
    if (!databaseUrl || !databaseUrl.startsWith("mysql://")) {
      throw new Error("DATABASE_URL debe apuntar a MySQL de RH Municipio (mysql://...)");
    }
    const Ctor = PrismaClientCtor ?? (await import("@prisma/client")).PrismaClient;
    const client = new Ctor({ datasources: { db: { url: databaseUrl } } });
    try {
      await client.$connect();
      await client.zlinkSyncState.findFirst({ select: { companyId: true } });
      return new PrismaStore(client, companyId, true);
    } catch (error) {
      await client.$disconnect();
      throw error;
    }
  }

  async close() {
    if (this.ownsClient) await this.client.$disconnect();
  }

  async needsReconcile(hours) {
    const state = await this.client.zlinkSyncState.findUnique({
      where: { companyId: this.companyId },
      select: { lastReconcileAt: true },
    });
    const last = state?.lastReconcileAt;
    return !last || Date.now() - new Date(last).getTime() >= hours * 3_600_000;
  }

  async markReconciled() {
    await this.client.zlinkSyncState.upsert({
      where: { companyId: this.companyId },
      create: { companyId: this.companyId, lastReconcileAt: new Date() },
      update: { lastReconcileAt: new Date() },
    });
  }

  async startRun(from, to) {
    const run = await this.client.zlinkSyncRun.create({
      data: {
        companyId: this.companyId,
        fromDate: localWallDate(`${from} 00:00:00`),
        toDate: localWallDate(`${to} 00:00:00`),
        status: "RUNNING",
      },
      select: { id: true },
    });
    return run.id;
  }

  async finishRun(id, { fetched, inserted, errorCode } = {}) {
    await this.client.zlinkSyncRun.update({
      where: { id },
      data: {
        finishedAt: new Date(),
        fetchedCount: fetched ?? 0,
        insertedCount: inserted ?? 0,
        status: errorCode ? "ERROR" : "SUCCESS",
        errorCode: errorCode ? String(errorCode).slice(0, 160) : null,
      },
    });
  }

  async savePage(rawEvents) {
    if (!rawEvents.length) return 0;
    const items = rawEvents.map((event) => mapToPrismaEvent(event, this.companyId));
    let inserted = 0;
    // MySQL tiene limites de tamano de consulta; tambien evita transacciones largas.
    for (let index = 0; index < items.length; index += 100) {
      const batch = items.slice(index, index + 100);
      const result = await this.client.zlinkEvent.createMany({
        data: batch,
        skipDuplicates: true,
      });
      inserted += result.count;
    }
    return inserted;
  }
}
