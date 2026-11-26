import { jwtExpiryMs } from "./session-store.mjs";

export class AuthManager {
  constructor(config, api, store, log = console) {
    this.config=config;this.api=api;this.store=store;this.log=log;
    this.session=null;
  }
  async load() {
    if(this.session) return this.session;
    const saved=await this.store.load();
    if(saved?.access_token && saved?.refresh_token) {
      this.session=saved;
    } else if(this.config.accessToken && this.config.refreshToken) {
      this.session={access_token:this.config.accessToken,refresh_token:this.config.refreshToken,
        expires_at:jwtExpiryMs(this.config.accessToken) ?? 0, company_selected:false};
      await this.store.save(this.session);
      this.log.log("Sesion inicial guardada desde .env (falta confirmar empresa)");
    } else throw new Error("Sin sesion: copia .zlink-session.json o configura tokens iniciales en .env");
    return this.session;
  }
  async ensureActive() {
    await this.load();
    const exp = Math.min(
      Number(this.session.expires_at || Number.POSITIVE_INFINITY),
      jwtExpiryMs(this.session.access_token) ?? Number.POSITIVE_INFINITY
    );
    if(!Number.isFinite(exp) || Date.now() + this.config.refreshMarginSeconds*1000 >= exp) {
      this.log.log("Renovando sesion Zlink");
      // Persistir INMEDIATAMENTE el par rotado. Si switch falla, no reutilizar el refresh antiguo.
      this.session=await this.api.refresh(this.session);
      await this.store.save(this.session);
    }
    if(this.session.company_selected !== true) {
      this.log.log("Seleccionando empresa Zlink");
      this.session=await this.api.switchCompany(this.session);
      await this.store.save(this.session);
    }
    return this.session;
  }
  async recover401() {
    // Una sola renovacion, nunca loop infinito ni reintentos de login.
    await this.load();
    this.log.warn("La API devolvio 401; intentando una renovacion unica");
    this.session=await this.api.refresh(this.session);
    await this.store.save(this.session);
    this.session=await this.api.switchCompany(this.session);
    await this.store.save(this.session);
    return this.session;
  }
}
