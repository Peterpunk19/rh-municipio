import { datesBetween, shiftDay, todayInZone } from "./dates.mjs";
import { ApiError } from "./api-client.mjs";

const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
export class ZlinkSyncService {
  constructor(config, auth, api, db, { log=console, sleeper=sleep }={}) {
    this.config=config;this.auth=auth;this.api=api;this.db=db;
    this.log=log;this.sleep=sleeper;
  }
  async chooseRange(explicit) {
    if(explicit) return {...explicit,reconcile:false};
    const today=todayInZone(this.config.localTimezone);
    const reconcile=await this.db.needsReconcile(this.config.reconcileHours);
    const days=reconcile ? this.config.reconcileDays : this.config.lookbackDays;
    return {from:shiftDay(today,1-days),to:today,reconcile};
  }
  async run({range=null,dryRun=false}={}) {
    const selected=range || (dryRun ? {
      from:shiftDay(todayInZone(this.config.localTimezone),1-this.config.lookbackDays),
      to:todayInZone(this.config.localTimezone),reconcile:false
    } : await this.chooseRange(null));
    const days=datesBetween(selected.from,selected.to);
    let session=await this.auth.ensureActive();
    const summary={from:selected.from,to:selected.to,days:days.length,fetched:0,inserted:0,dryRun};
    const runId=dryRun ? null : await this.db.startRun(selected.from,selected.to);
    try {
      for(const date of days) {
        let count=0,added=0,page=1;
        let expectedTotal=null;
        while(true) {
          if(page>this.config.maxPagesPerDay) {
            throw new Error(`Excedido SYNC_MAX_PAGES_PER_DAY en ${date}; aumenta limite y reintenta`);
          }
          session=await this.auth.ensureActive();
          let result;
          try { result=await this.api.transactions(session,date,page); }
          catch(err) {
            if(err instanceof ApiError && err.http===401) {
              session=await this.auth.recover401();
              result=await this.api.transactions(session,date,page);
            } else throw err;
          }
          const rows=result.data;
          if(expectedTotal===null) expectedTotal=result.total;
          if(rows.length===0 && page*this.config.pageSize < expectedTotal) {
            throw new Error(`Paginacion inconsistente para ${date}, pagina ${page}`);
          }
          count+=rows.length;
          summary.fetched+=rows.length;
          if(!dryRun) {
            const n=await this.db.savePage(rows);
            added+=n;summary.inserted+=n;
          }
          this.log.log(`[${date}] pagina ${page}: ${rows.length} eventos${dryRun ? " (sin guardar)" : `, ${added} nuevos acumulados`}`);
          // El total puede cambiar durante la consulta; repetir fechas en la proxima vuelta.
          if(page*this.config.pageSize>=result.total || rows.length===0) break;
          page++;
          if(this.config.requestDelayMs) await this.sleep(this.config.requestDelayMs);
        }
        this.log.log(`[${date}] completado, consultados=${count}, nuevos=${dryRun?"n/a":added}`);
      }
      if(!dryRun) {
        await this.db.finishRun(runId,summary);
        if(selected.reconcile) await this.db.markReconciled();
      }
      this.log.log(`Sincronizacion exitosa: ${JSON.stringify(summary)}`);
      return summary;
    } catch(err) {
      if(!dryRun && runId!=null) {
        try {await this.db.finishRun(runId,{...summary,errorCode:err.code || err.kind || "SYNC_ERROR"});}
        catch {this.log.error("No se pudo guardar el error en zlink_sync_runs");}
      }
      throw err;
    }
  }
}
