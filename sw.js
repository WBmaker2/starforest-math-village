/* 별숲 수학마을 서비스워커 (오프라인 학습 지원) */
var CACHE = "starforest-v5";
var CORE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./assets/css/styles.css",
  "./assets/css/g3.css",
  "./assets/css/landing.css?v=2",
  "./assets/js/grades.js?v=20",
  "./assets/js/history.js?v=20",
  "./assets/js/app.js?v=22",
  "./assets/js/pwa.js?v=2",
  "./assets/img/landing/town-g3-564.webp",
  "./assets/img/landing/town-g4-640.webp",
  "./assets/img/landing/town-g5-640.webp",
  "./assets/img/landing/town-g6-640.webp",
  "./assets/img/landing/map-g2-640.webp",
  "./assets/img/landing/lesson-quiz-640.webp",
  "./assets/img/landing/hero-640.webp",
  "./assets/css/village.css?v=1",
  "./assets/js/village-shell.js?v=1",
  "./lower/index.html",
  "./grade3/index.html",
  "./grade4/index.html",
  "./grade5/index.html",
  "./grade6/index.html"
];
self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) { return c.addAll(CORE); }).then(function () { return self.skipWaiting(); })
  );
});
self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) { return k === CACHE ? null : caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  var url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  e.respondWith(
    caches.match(e.request).then(function (hit) {
      var net = fetch(e.request).then(function (res) {
        if (res && res.ok) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
        }
        return res;
      }).catch(function () { return hit; });
      return hit || net;
    })
  );
});
