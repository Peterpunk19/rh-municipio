import { open, unlink } from "node:fs/promises";
export async function acquireLock(path) {
  let fh;
  try { fh=await open(path,"wx",0o600); }
  catch(err) {
    if(err.code === "EEXIST") throw new Error(`Ya existe ${path}. Verifica que no haya otra instancia antes de eliminarlo.`);
    throw err;
  }
  try {await fh.writeFile(`${process.pid}\n`);}
  finally {await fh.close();}
  return async()=>{try {await unlink(path);} catch(err) {if(err.code!=="ENOENT") throw err;}};
}
