/* C语言备考系统 Service Worker
   策略：网络优先（保证题库更新直达），失败时回退缓存（离线可打开） */
const CACHE = 'cstudy-v2';
const ASSETS = [
  './',
  './index.html',
  './学习系统.html',
  './app.js',
  './style.css',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './data/ch1.js', './data/ch2.js', './data/ch3.js', './data/ch4.js', './data/ch5.js',
  './data/ch6.js', './data/ch7.js', './data/ch8.js', './data/ch9.js', './data/ch10.js',
  './data/extra.js', './data/hard.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  e.respondWith(
    fetch(req).then(res => {
      if (res && res.status === 200 && res.type === 'basic') {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(req, clone));
      }
      return res;
    }).catch(() =>
      caches.match(req, { ignoreSearch: true })
        .then(m => m || caches.match('./index.html'))
    )
  );
});
