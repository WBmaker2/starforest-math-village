(function () {
  // 서비스워커 등록 + 앱 설치 안내 배너
  try {
    if ("serviceWorker" in navigator) {
      var base = "./";
      try {
        if (location.pathname.indexOf("/grade") >= 0 || location.pathname.indexOf("/lower") >= 0) base = "../";
      } catch (e) {}
      navigator.serviceWorker.register(base + "sw.js").catch(function () {});
    }
  } catch (e) {}
  var deferred = null;
  window.addEventListener("beforeinstallprompt", function (e) {
    try { e.preventDefault(); } catch (err) {}
    deferred = e;
    showBanner();
  });
  function showBanner() {
    try {
      if (document.body.classList.contains("landing")) return;
      if (document.getElementById("pwaBanner") || localStorage.getItem("starforest-pwa-hide") === "1") return;
      var bar = document.createElement("div");
      bar.id = "pwaBanner";
      bar.innerHTML = "<b>📲 별숲 수학마을 앱으로 설치하기</b><span>홈 화면에 두면 오프라인에서도 열립니다</span>"
        + "<button type='button' class='go btn-pulse' id='pwaInstall'>설치하기</button>"
        + "<button type='button' class='mini-act' id='pwaLater'>나중에</button>";
      document.body.appendChild(bar);
      document.getElementById("pwaInstall").addEventListener("click", function () {
        if (deferred) {
          try { deferred.prompt(); } catch (e) {}
          deferred = null;
        } else if (window.G3UI) window.G3UI.toast("브라우저 메뉴의 '홈 화면에 추가'를 눌러 주세요.");
        hide();
      });
      document.getElementById("pwaLater").addEventListener("click", function () {
        try { localStorage.setItem("starforest-pwa-hide", "1"); } catch (e) {}
        hide();
      });
      function hide() { if (bar.parentNode) bar.parentNode.removeChild(bar); }
    } catch (e) {}
  }
})();
