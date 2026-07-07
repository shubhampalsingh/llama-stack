// DeadLimit service worker — receives the Reaper's push notifications.
self.addEventListener("push", (event) => {
  let data = { title: "💀 DeadLimit", body: "A deadline stirs…", url: "/app" };
  try {
    data = { ...data, ...event.data.json() };
  } catch {}
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icon.png",
      badge: "/icon.png",
      data: { url: data.url },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/app";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((tabs) => {
      for (const tab of tabs) {
        if (tab.url.includes(self.location.origin)) return tab.focus();
      }
      return clients.openWindow(url);
    })
  );
});
