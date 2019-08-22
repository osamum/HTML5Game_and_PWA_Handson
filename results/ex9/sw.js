//キャッシュの名前
const CACHE_NAME = 'html5gameHandson-asset08221139';
//キャッシュするアセット類を指定
var assetsToCache = [
  '/',
  '/default.html',
  '/css/default.css',
  '/scripts/default.js',
  '/img/snow_man.png',
  '/img/snow.png',
  '/img/sp_snow.png',
  '/audio/kiiiin1.mp3',
];

//インストール イベント (キャッシュを行う)
self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(assetsToCache);
        })
    );
});

//アクティベイト イベント (古いキャッシュを削除する)
self.addEventListener('activate', function(e) {
    e.waitUntil(
      caches.keys().then(function(keyList) {
        return Promise.all(keyList.map(function(key) {
          if (key !== CACHE_NAME) {
            //古い
            return caches.delete(key);
          }
        }));
      })
    );
  });

//取り出し時のイベント (キャッシュから取り出す)
self.addEventListener('fetch', function(e) {
  console.log('[ServiceWorker] Fetch', e.request.url);
    e.respondWith(
      caches.match(e.request).then(function(response) {
        return response || fetch(e.request);
      })
    );
  });