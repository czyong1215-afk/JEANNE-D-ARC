
// 彻底旁路模式：不拦截请求，只为了满足 PWA 安装要求
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(keys.map(key => caches.delete(key))))
    );
});
// No fetch handler to ensure maximum compatibility and speed
