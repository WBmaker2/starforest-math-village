(function () {
  var muted = false;
  var actx = null;
  try { muted = localStorage.getItem("math-walk-g3-mute") === "1"; } catch (e) {}
  function sfx(kind) {
    if (muted) return;
    try {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      if (!actx) actx = new Ctx();
      if (actx.state === "suspended") actx.resume();
      var notes = kind === "ok" ? [523.25, 659.25, 783.99] :
                  kind === "fanfare" ? [523.25, 659.25, 783.99, 1046.5] :
                  kind === "no" ? [280, 220] : [440];
      var now = actx.currentTime;
      for (var i = 0; i < notes.length; i++) {
        var osc = actx.createOscillator();
        var gain = actx.createGain();
        osc.type = kind === "no" ? "triangle" : "sine";
        osc.frequency.setValueAtTime(notes[i], now + i * 0.09);
        gain.gain.setValueAtTime(0.08, now + i * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.18);
        osc.connect(gain);
        gain.connect(actx.destination);
        osc.start(now + i * 0.09);
        osc.stop(now + i * 0.09 + 0.19);
      }
    } catch (e) {}
  }
  function initSfxBtn() {
    var purse = document.querySelector(".purse");
    if (!purse || document.getElementById("sfxBtn")) return;
    var btn = document.createElement("button");
    btn.id = "sfxBtn";
    btn.type = "button";
    btn.className = "sfx-btn";
    function syncText() {
      btn.textContent = muted ? "🔇 소리 끔" : "🔊 소리 켬";
      btn.setAttribute("aria-pressed", muted ? "false" : "true");
    }
    syncText();
    btn.addEventListener("click", function () {
      muted = !muted;
      try { localStorage.setItem("math-walk-g3-mute", muted ? "1" : "0"); } catch (e) {}
      syncText();
      if (!muted) sfx("ok");
    });
    purse.appendChild(btn);
  }
  function initBoardBtn() {
    var purse = document.querySelector(".purse");
    if (!purse || document.getElementById("boardBtn")) return;
    var btn = document.createElement("button");
    btn.id = "boardBtn";
    btn.type = "button";
    btn.className = "sfx-btn";
    function syncText() {
      var on = document.body.classList.contains("board-mode");
      btn.textContent = on ? "📺 칠판 끄기" : "📺 칠판 모드";
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    }
    syncText();
    btn.addEventListener("click", function () {
      var on = document.body.classList.toggle("board-mode");
      try {
        if (on && document.documentElement.requestFullscreen) document.documentElement.requestFullscreen();
        else if (!on && document.exitFullscreen && document.fullscreenElement) document.exitFullscreen();
      } catch (e) {}
      syncText();
      toast(on ? "칠판 발표 모드! 글자와 그림이 커졌습니다." : "칠판 모드를 껐습니다.");
    });
    purse.appendChild(btn);
  }
  function toast(m) {
    var t = document.getElementById("toast");
    if (!t) return;
    t.textContent = m;
    t.classList.add("show");
    setTimeout(function () { t.classList.remove("show"); }, 2400);
  }
  function stars() {
    var d = window.G3Store.load();
    var a = document.getElementById("starCount");
    if (a) a.textContent = "별 " + d.stars;
    var b = document.getElementById("seedTop");
    if (b) b.textContent = "씨앗 " + d.seeds;
    if (window.G3Map && window.G3Map.syncTodo) window.G3Map.syncTodo();
    if (window.G3Report && window.G3Report.render) window.G3Report.render();
  }
  function zoneTabs() {
    var bar = document.getElementById("zoneBar");
    if (!bar || bar.dataset.ready) return;
    bar.dataset.ready = "1";
    bar.addEventListener("click", function (e) {
      var b = e.target.closest ? e.target.closest("[data-zone]") : null;
      if (!b) return;
      var z = b.getAttribute("data-zone");
      var tabs = bar.querySelectorAll("[data-zone]");
      for (var i = 0; i < tabs.length; i++) tabs[i].classList.toggle("sel", tabs[i] === b);
      var cards = document.querySelectorAll("main.wrap section.card[data-zone]");
      for (var j = 0; j < cards.length; j++) {
        var cz = cards[j].getAttribute("data-zone");
        cards[j].hidden = !(z === "all" || cz === z);
      }
      var first = document.querySelector("main.wrap section.card[data-zone='" + z + "']");
      if (z !== "all" && first) first.scrollIntoView({ behavior: "smooth" });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
  function tabs() {
    initSfxBtn();
    initBoardBtn();
    zoneTabs();
    var btns = document.querySelectorAll("[data-tab]");
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener("click", function () {
        var id = this.getAttribute("data-tab");
        var secs = document.querySelectorAll(".panel");
        for (var j = 0; j < secs.length; j++) secs[j].classList.remove("on");
        document.getElementById(id).classList.add("on");
        for (var k = 0; k < btns.length; k++) btns[k].classList.remove("sel");
        this.classList.add("sel");
      });
    }
  }
  window.G3UI = { toast: toast, stars: stars, tabs: tabs, sfx: sfx };
})();
