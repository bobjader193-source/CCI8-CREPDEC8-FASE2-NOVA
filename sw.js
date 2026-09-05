const CACHE='cci8-fase2-nova-v2';
const BASE='/CCI8-CREPDEC8-FASE2-NOVA/';
const ASSETS=[BASE,BASE+'index.html',BASE+'manifest.json',BASE+'icon-192.png',BASE+'icon-512.png',BASE+'config.js'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('cci8-fase2-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  const u=new URL(event.request.url);
  if(u.origin!==location.origin) return;
  if(u.pathname.endsWith('/config.js')){event.respondWith(fetch(event.request,{cache:'no-store'}));return;}
  event.respondWith(fetch(event.request,{cache:'no-store'}).then(r=>{
    if(r.ok && ['document','script','style','image','manifest'].includes(event.request.destination)){
      const clone=r.clone(); caches.open(CACHE).then(c=>c.put(event.request,clone)).catch(()=>{});
    }
    return r;
  }).catch(()=>caches.match(event.request)));
});
