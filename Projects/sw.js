// Sofra Service Worker — background push notifications
const CACHE='sofra-v1';

self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>self.clients.claim());

// Handle push events (future FCM integration)
self.addEventListener('push',e=>{
  const data=e.data?e.data.json():{};
  const title=data.title||'🌙 Sofra';
  const body=data.body||'New announcement';
  e.waitUntil(
    self.registration.showNotification(title,{
      body,
      icon:data.icon||'/favicon.ico',
      badge:data.badge||'/favicon.ico',
      tag:data.tag||'sofra-announcement',
      renotify:true,
      data:{url:data.url||'/'}
    })
  );
});

// Handle notification click
self.addEventListener('notificationclick',e=>{
  e.notification.close();
  const url=e.notification.data?.url||'/';
  e.waitUntil(
    clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>{
      for(const c of list){if(c.url===url&&'focus' in c)return c.focus();}
      if(clients.openWindow)return clients.openWindow(url);
    })
  );
});

// Message from page: show notification directly
self.addEventListener('message',e=>{
  if(e.data&&e.data.type==='SHOW_NOTIFICATION'){
    self.registration.showNotification(e.data.title||'🌙 Sofra',{
      body:e.data.body||'',
      icon:e.data.icon||'',
      tag:'sofra-ann-'+Date.now(),
      renotify:true,
      data:{url:'/'}
    });
  }
});
