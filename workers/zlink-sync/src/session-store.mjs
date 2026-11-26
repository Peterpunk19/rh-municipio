import { readFile, open, rename, chmod } from "node:fs/promises";
import { dirname, basename, join } from "node:path";

export function jwtExpiryMs(token) {
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString("utf8"));
    return Number.isFinite(payload.exp) ? payload.exp * 1000 : null;
  } catch { return null; }
}
export class FileSessionStore {
  constructor(file) { this.file = file; }
  async load() {
    try { return JSON.parse(await readFile(this.file, "utf8")); }
    catch (err) { if (err.code === "ENOENT") return null; throw err; }
  }
  async save(session) {
    if (!session.access_token || !session.refresh_token) throw new Error("Sesion sin tokens");
    const path = join(dirname(this.file), `${basename(this.file)}.tmp`);
    const fh = await open(path, "w", 0o600);
    try {
      await fh.truncate(0);
      await fh.writeFile(JSON.stringify(session), "utf8");
      await fh.sync();
    } finally { await fh.close(); }
    await chmod(path, 0o600);
    await rename(path, this.file);
  }
}
