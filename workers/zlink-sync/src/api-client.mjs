import { setTimeout as sleep } from "node:timers/promises";

export class ApiError extends Error {
  constructor(kind, { http, code, method, path } = {}) {
    super(`${kind}${http ? ` (HTTP ${http})` : ""}${code ? ` [${code}]` : ""}`);
    this.name = "ApiError";
    this.kind = kind; this.http = http; this.code = code; this.method = method; this.path = path;
  }
}
export class ZlinkApi {
  constructor(config, { fetcher = globalThis.fetch, sleeper = sleep } = {}) {
    this.config=config; this.fetcher=fetcher; this.sleep=sleeper;
  }
  headers(session, { csrf=true } = {}) {
    const c = this.config;
    const cookie = [
      `deviceNniqueid=${c.deviceId}`,
      `ZlinkAuthorization=${session.access_token}`,
      `ZlinkRefreshToken=${session.refresh_token}`,
      `companyId=${c.companyId}`
    ].join("; ");
    return {
      Accept:"application/json",
      Authorization:`Bearer ${session.access_token}`,
      "Content-Type":"application/json",
      "current-timezone":c.timezoneHeader,
      "device-uniqueid":c.deviceId,
      source:"pc",
      Origin:c.apiBaseUrl,
      Referer:`${c.apiBaseUrl}/login`,
      Cookie:cookie,
      ...(csrf && c.csrfToken ? {"x-csrf-token":c.csrfToken} : {}),
    };
  }
  async request(path, { method="GET", session, body, csrf=true, retries=0 }={}) {
    for(let attempt=0;;attempt++) {
      let response;
      try {
        response=await this.fetcher(`${this.config.apiBaseUrl}${path}`, {
          method, headers:this.headers(session,{csrf}),
          ...(body !== undefined ? {body:JSON.stringify(body)} : {}),
          signal:AbortSignal.timeout(this.config.timeoutMs),
        });
      } catch(e) {
        if (attempt < retries) { await this.sleep(Math.min(2000*2**attempt,8000)); continue; }
        throw new ApiError("Error de red/timeout",{method,path});
      }
      let json=null;
      try { json=await response.json(); } catch { /* HTML puede ser bloqueo del gateway */ }
      if (!response.ok) {
        if ((response.status === 429 || response.status >= 500) && attempt < retries) {
          await this.sleep(Math.min(2000*2**attempt,8000)); continue;
        }
        throw new ApiError(response.status === 401 ? "Autenticacion rechazada" : "Solicitud rechazada",{
          http:response.status, code:json?.code, method,path,
        });
      }
      if(!json || typeof json !== "object") throw new ApiError("Respuesta no JSON",{http:response.status,method,path});
      return json;
    }
  }
  async refresh(session) {
    // No reintentar automaticamente: el refresh token puede rotarse.
    const json = await this.request("/zlink-api/v1.0/zlink/customer/sso/refresh_token",{
      method:"POST",session,csrf:false,retries:0,
      body:{refreshToken:session.refresh_token}
    });
    if(!json.data?.access_token || !json.data?.refresh_token) {
      throw new ApiError("Refresh fallido",{code:json.code,method:"POST",path:"refresh_token"});
    }
    return {
      access_token:json.data.access_token,
      refresh_token:json.data.refresh_token,
      expires_at:Date.now()+Number(json.data.expires_in||3600)*1000,
      company_selected:false,
    };
  }
  async switchCompany(session) {
    const json=await this.request("/zlink-api/v1.0/zlink/customer/sso/user/switchCompany",{
      method:"PUT",session,retries:0,
      body:{companyId:this.config.companyId,fromType:"PC"}
    });
    if(json.code !== "UASI0011" || !json.data?.access_token || !json.data?.refresh_token) {
      throw new ApiError("Switch company fallido",{code:json.code,method:"PUT",path:"switchCompany"});
    }
    return {
      access_token:json.data.access_token,
      refresh_token:json.data.refresh_token,
      expires_at:Date.now()+Number(json.data.expires_in||3600)*1000,
      company_selected:true,
    };
  }
  async transactions(session,date,page) {
    const url=new URL("/api/v1.0/transaction/",this.config.apiBaseUrl);
    url.searchParams.set("pageSize",String(this.config.pageSize));
    url.searchParams.set("pageNumber",String(page));
    url.searchParams.set("start_date",date);
    url.searchParams.set("end_date",date);
    url.searchParams.set("ordering","-punch_time,");
    const json=await this.request(`${url.pathname}${url.search}`, {
      method:"POST",session,csrf:false,retries:this.config.retries,
      body:{start_date:date,end_date:date,employee_ids:[],department_ids:[],group_ids:[],designation_ids:[],timestamp:Date.now()},
    });
    if(json.status!=="SUCCESS" || !Array.isArray(json.result?.data) || !Number.isSafeInteger(json.result?.total)) {
      throw new ApiError("Respuesta de transacciones inesperada",{code:json.code,method:"POST",path:"transaction"});
    }
    return json.result;
  }
}
