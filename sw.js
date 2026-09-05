const CACHE='cci8-fase2-v32';
const BASE='/CCI8-CREPDEC8-FASE2-NOVA/';
const ASSETS=[BASE,BASE+'index.html',BASE+'manifest.json',BASE+'icon-192.png',BASE+'icon-512.png',BASE+'config.js'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('cci8-fase2-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  const u=new URL(e.request.url);
  if(u.origin!==location.origin) return;
  if(u.pathname.endsWith('/config.js')){e.respondWith(fetch(e.request,{cache:'no-store'}));return;}
  e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{
    if(r.ok && ['document','script','style','image','manifest'].includes(e.request.destination)){
      const c=r.clone(); caches.open(CACHE).then(cache=>cache.put(e.request,c));
    }
    return r;
  }).catch(()=>caches.match(e.request)));
});
