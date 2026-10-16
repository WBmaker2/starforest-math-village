(function () {
  function grade() {
    try {
      var q = (location.search || "").match(/[?&]grade=([12])/);
      if (q) return q[1];
      if (window.STARFOREST_GRADE === "g2") return "2";
      return "1";
    } catch (e) { return "1"; }
  }
  var G = grade();
  function HOUSES() {
    try {
      if (window.LowData) return G === "2" ? window.LowData.g2 : window.LowData.g1;
    } catch (e) {}
    return [];
  }
  var FRIENDS = [
    { name: "몽실", line: "10 모형 상자를 눌러 세어 봐!", x: 38, y: 44 },
    { name: "반짝이", line: "규칙 산책로에서 규칙을 찾으면 별을 줘!", x: 62, y: 60 }
  ];
  var pos = { x: 50, y: 50 };
  var cur = { house: 0, qi: 0, touch: 0 };
  function store() { return window.G3Store.load(); }
  function toast(m) { if (window.G3UI) window.G3UI.toast(m); }
  function lowDone() {
    var d = store();
    if (!d.lowDone) { d.lowDone = {}; window.G3Store.save(d); }
    return d.lowDone;
  }
  function manipHint(id) {
    if (id.indexOf("num") >= 0 || id.indexOf("place") >= 0) return "10 모형·100 모형 상자를 손가락으로 눌러 세어 보세요!";
    if (id.indexOf("shape") >= 0 || id.indexOf("time") >= 0) return "시계 바늘과 모양 카드를 눌러 읽어 보세요!";
    if (id.indexOf("length") >= 0) return "자 눈금을 눌러 길이를 재어 보세요!";
    if (id.indexOf("table") >= 0) return "표 칸과 ○ 그래프 도장을 눌러 세어 보세요!";
    if (id.indexOf("rule") >= 0 || id.indexOf("pattern") >= 0 || id.indexOf("song") >= 0) return "그림 카드를 순서대로 눌러 규칙을 찾아보세요!";
    return "그림을 눌러보고 큰 단추 3개 중 하나를 골라보세요!";
  }
  function growthBadge(h) {
    var done = lowDone();
    var c = 0;
    for (var j = 0; j < h.list.length; j++) if (done[h.id + "-" + j]) c++;
    if (c >= h.list.length) return "👑 꽃핀 집";
    if (c > 0) return "🌼 자라는 중 " + c + "/" + h.list.length;
    return "🌱 시작전";
  }
  function refreshAvatar() {
    var d = store();
    var a = d.avatar || {};
    var mini = document.getElementById("lowAvMini");
    if (mini && window.G3Avatar && window.G3Avatar.mountRig) window.G3Avatar.mountRig(mini, a);
    var nm = document.getElementById("lowAvName");
    if (nm) nm.textContent = (a.name || "산책 주민") + (a.name ? " 주민" : "");
  }
  function refreshToken() {
    var token = document.getElementById("lowToken");
    if (!token) return;
    var a = store().avatar || {};
    token.innerHTML = "<div class='tk-fig' id='lowTokenRig'></div><em>" + (a.name || "주민") + "</em>";
    var rig = document.getElementById("lowTokenRig");
    if (rig && window.G3Avatar && window.G3Avatar.mountRig) window.G3Avatar.mountRig(rig, a);
  }
  function buildTabs() {
    var sec = document.getElementById("lowVillage");
    if (!sec || document.getElementById("lowGradeTabs")) return;
    var bar = document.createElement("div");
    bar.id = "lowGradeTabs";
    bar.className = "zonebar";
    bar.setAttribute("role", "group");
    bar.setAttribute("aria-label", "새싹숲 학년 바꾸기");
    bar.innerHTML = "<button type='button' data-lowgrade='1' class='" + (G === "1" ? "sel" : "") + "'>🌱 1학년 새싹숲 (6곳)</button>"
      + "<button type='button' data-lowgrade='2' class='" + (G === "2" ? "sel" : "") + "'>🌿 2학년 새싹숲 (6곳)</button>";
    sec.insertBefore(bar, sec.querySelector("#lowMapwrap"));
  }
  function build() {
    var wrap = document.getElementById("lowMapwrap");
    if (!wrap) return;
    var mapSrc = G === "2" ? "../assets/img/flow/map-g2.jpg" : "../assets/img/flow/map-g1.jpg";
    var mapAlt = G === "2" ? "2학년 새싹숲 마을 지도" : "1학년 새싹숲 마을 지도";
    wrap.innerHTML = "<img id='lowMapimg' src='" + mapSrc + "' alt='" + mapAlt + "'>";
    wrap.dataset.built = "1";
    var token = document.createElement("div");
    token.id = "lowToken";
    wrap.appendChild(token);
    refreshToken();
    moveToken(pos.x, pos.y, true);
    var hs = HOUSES();
    for (var i = 0; i < hs.length; i++) {
      var b = document.createElement("button");
      b.className = "pin low-pin lv-0";
      b.style.left = hs[i].x + "%";
      b.style.top = hs[i].y + "%";
      b.innerHTML = hs[i].name + "<span class='lv-badge'>" + growthBadge(hs[i]) + "</span>";
      b.setAttribute("data-lowpin", hs[i].id);
      b.setAttribute("aria-label", hs[i].name + " 들어가기");
      wrap.appendChild(b);
    }
    for (var j = 0; j < FRIENDS.length; j++) {
      var f = document.createElement("button");
      f.className = "friend";
      f.style.left = FRIENDS[j].x + "%";
      f.style.top = FRIENDS[j].y + "%";
      f.textContent = FRIENDS[j].name;
      f.setAttribute("data-say", FRIENDS[j].line);
      f.setAttribute("aria-label", FRIENDS[j].name + "의 말 듣기");
      wrap.appendChild(f);
    }
    renderProgress();
    syncGrowth();
  }
  function syncGrowth() {
    var hs = HOUSES();
    var pins = document.querySelectorAll("#lowMapwrap [data-lowpin]");
    for (var i = 0; i < pins.length; i++) {
      var id = pins[i].getAttribute("data-lowpin");
      var h = findHouse(id);
      if (!h) continue;
      var badge = pins[i].querySelector(".lv-badge");
      var txt = growthBadge(h);
      if (badge) badge.textContent = txt;
      pins[i].classList.remove("lv-0", "lv-1", "lv-max");
      if (txt.indexOf("꽃핀") >= 0) pins[i].classList.add("lv-max");
      else if (txt.indexOf("자라는") >= 0) pins[i].classList.add("lv-1");
      else pins[i].classList.add("lv-0");
    }
  }
  function moveToken(x, y, instant) {
    pos.x = Math.max(4, Math.min(96, x));
    pos.y = Math.max(6, Math.min(94, y));
    var token = document.getElementById("lowToken");
    if (!token) return;
    token.style.transition = instant ? "none" : "left .45s ease-out, top .45s ease-out";
    token.style.left = pos.x + "%";
    token.style.top = pos.y + "%";
    checkNear();
  }
  function checkNear() {
    var hs = HOUSES();
    var best = null, bd = 13;
    for (var i = 0; i < hs.length; i++) {
      var d = Math.hypot(pos.x - hs[i].x, pos.y - hs[i].y);
      if (d < bd) { bd = d; best = hs[i]; }
    }
    var label = document.getElementById("lowNear");
    var btn = document.getElementById("lowEnter");
    if (best) {
      if (label) label.textContent = best.name + " 앞입니다";
      if (btn) { btn.hidden = false; btn.textContent = best.name + " 들어가기"; btn.setAttribute("data-near", best.id); }
    } else {
      if (label) label.textContent = "지도를 눌러 산책하세요";
      if (btn) btn.hidden = true;
    }
  }
  function findHouse(id) {
    var hs = HOUSES();
    for (var i = 0; i < hs.length; i++) if (hs[i].id === id) return hs[i];
    return hs[0];
  }
  function houseIndex(id) {
    var hs = HOUSES();
    for (var i = 0; i < hs.length; i++) if (hs[i].id === id) return i;
    return 0;
  }
  function open(id) {
    var hs = HOUSES();
    cur.house = houseIndex(id);
    cur.qi = 0; cur.touch = 0;
    var h = hs[cur.house];
    var ov = document.getElementById("dlg");
    if (ov) ov.classList.add("show");
    var ni = document.getElementById("npcImg");
    if (ni) ni.src = "../assets/img/flow/" + (h.npcImg || "npc-mole") + ".jpg";
    var hi = document.getElementById("lowHouseImg");
    if (hi) { hi.src = "../assets/img/flow/" + (h.houseImg || "house-low-num") + ".jpg"; hi.alt = h.name + " 그림"; }
    var a = store().avatar || {};
    var av = document.getElementById("dlgAvatar");
    if (av && window.G3Avatar && window.G3Avatar.mountRig) window.G3Avatar.mountRig(av, a);
    var an = document.getElementById("dlgAvName");
    if (an) an.textContent = a.name || "주민";
    say(h.npc + ": 어서 오렴! " + h.name + "이란다.");
    renderQ();
  }
  function say(t) {
    var p = document.getElementById("npcText");
    if (p) p.textContent = t;
  }
  function renderQ() {
    var hs = HOUSES();
    var h = hs[cur.house];
    var item = h.list[cur.qi];
    var box = document.getElementById("dlgBody");
    if (!box) return;
    var html = "<p class='crumb'>" + (G === "2" ? "2학년 새싹숲" : "1학년 새싹숲") + " · " + h.name + " · " + (cur.qi + 1) + "/" + h.list.length + "</p>";
    html += "<div class='trial-svg' data-lowtouch>" + item.svg + "</div>";
    html += "<p class='hint' id='lowTouchMsg'>" + manipHint(h.id) + "</p>";
    html += "<p class='trial-q'>" + item.q + "</p><div class='trial-choices low-mode'>";
    for (var i = 0; i < item.choices.length; i++) {
      html += "<button type='button' class='trial-choice btn-pulse' data-lowchoice='" + item.choices[i] + "'>" + item.choices[i] + "</button>";
    }
    html += "</div><p id='lowFb' class='trial-fb' aria-live='polite'></p>";
    box.innerHTML = html;
  }
  function answer(pick) {
    var hs = HOUSES();
    var h = hs[cur.house];
    var item = h.list[cur.qi];
    var fb = document.getElementById("lowFb");
    if (pick === item.a) {
      var key = h.id + "-" + cur.qi;
      var d = store();
      if (!d.lowDone) d.lowDone = {};
      var first = !d.lowDone[key];
      if (first) {
        d.lowDone[key] = true;
        d.stars += 10;
        d.seeds += 1;
        window.G3Store.save(d);
        if (window.G3UI) window.G3UI.stars();
      }
      if (window.G3UI && window.G3UI.sfx) window.G3UI.sfx("ok");
      renderProgress();
      syncGrowth();
      if (fb) fb.innerHTML = "<b>정답! ★+10 · 씨앗 +1</b> " + item.exp + " <button type='button' class='trial-next btn-pulse' data-lownext='1'>" + (cur.qi + 1 < h.list.length ? "다음 문제 →" : "마을로 돌아가기") + "</button>";
    } else {
      if (window.G3UI && window.G3UI.sfx) window.G3UI.sfx("no");
      if (fb) fb.textContent = "그림을 다시 살펴볼까요? " + item.exp;
    }
  }
  function next() {
    var hs = HOUSES();
    var h = hs[cur.house];
    if (cur.qi + 1 < h.list.length) { cur.qi++; renderQ(); }
    else {
      var ov = document.getElementById("dlg");
      if (ov) ov.classList.remove("show");
      toast(h.name + " 탐험 완료! 참 잘했어요!");
      if (window.G3Confetti && window.G3Confetti.burst) window.G3Confetti.burst();
    }
  }
  function renderProgress() {
    var done = lowDone();
    var hs = HOUSES();
    var total = hs.length * 3;
    var n = 0;
    for (var i = 0; i < hs.length; i++) {
      for (var j = 0; j < hs[i].list.length; j++) if (done[hs[i].id + "-" + j]) n++;
    }
    var t = document.getElementById("lowProgText");
    if (t) t.textContent = (G === "2" ? "2학년 새싹숲" : "1학년 새싹숲") + " 푼 문제 " + n + "/" + total + " · 별과 씨앗이 전 학년 마을과 함께 쌓입니다!";
    var grid = document.getElementById("lowProgGrid");
    if (grid) {
      var html = "";
      for (var k = 0; k < hs.length; k++) {
        var c = 0;
        for (var m = 0; m < hs[k].list.length; m++) if (done[hs[k].id + "-" + m]) c++;
        var st = c >= hs[k].list.length ? "👑 꽃핀 집 완료!" : (c > 0 ? "🌼 자라는 중 (" + c + "/3)" : "🌱 시작전");
        html += "<button class='mapcell' data-lowenter='" + hs[k].id + "'><b>" + hs[k].name + "</b><span>" + st + "</span></button>";
      }
      grid.innerHTML = html;
    }
  }
  function switchGrade(ng) {
    if (ng === G) return;
    try {
      var url = new URL(location.href);
      url.searchParams.set("grade", ng);
      location.href = url.pathname + "?grade=" + ng;
    } catch (e) {
      location.href = "index.html?grade=" + ng;
    }
  }
  function init() {
    window.STARFOREST_GRADE = G === "2" ? "g2" : "g1";
    try {
      var meta = document.querySelector('meta[name="starforest-grade"]');
      if (meta) meta.setAttribute("content", window.STARFOREST_GRADE);
    } catch (e) {}
    buildTabs();
    build();
    refreshAvatar();
    if (window.G3UI) { window.G3UI.tabs(); window.G3UI.stars(); }
    var head = document.querySelector(".g3head h1");
    if (head) head.textContent = G === "2" ? "그림을 누르고 고르는 2학년 마을" : "그림을 누르고 고르는 1학년 마을";
    var wrap = document.getElementById("lowMapwrap");
    if (wrap) wrap.addEventListener("click", function (e) {
      var pin = e.target.closest ? e.target.closest("[data-lowpin]") : null;
      if (pin) {
        var id = pin.getAttribute("data-lowpin");
        var h = findHouse(id);
        moveToken(h.x, h.y + 7);
        open(id);
        return;
      }
      var s = e.target.closest ? e.target.closest("[data-say]") : null;
      if (s) { toast(s.textContent + ": " + s.getAttribute("data-say")); return; }
      if (e.target.closest && e.target.closest("#lowToken")) return;
      var r = wrap.getBoundingClientRect();
      moveToken((e.clientX - r.left) / r.width * 100, (e.clientY - r.top) / r.height * 100);
    });
    var btn = document.getElementById("lowEnter");
    if (btn) btn.addEventListener("click", function () {
      var id = btn.getAttribute("data-near");
      if (id) open(id);
    });
    var KEYMAP = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right", w: "up", s: "down", a: "left", d: "right", W: "up", S: "down", A: "left", D: "right" };
    window.addEventListener("keydown", function (e) {
      var tag = (e.target && e.target.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (e.target && e.target.isContentEditable)) return;
      var ov = document.getElementById("dlg");
      if (ov && ov.classList.contains("show")) return;
      var dir = KEYMAP[e.key];
      if (!dir) return;
      e.preventDefault();
      step(dir);
    });
    document.addEventListener("pointerdown", function (e) {
      var t = e.target.closest ? e.target.closest(".dpad [data-move]") : null;
      if (t) step(t.getAttribute("data-move"));
    });
    document.addEventListener("click", function (e) {
      var g = e.target.closest ? e.target.closest("[data-lowgrade]") : null;
      if (g) { switchGrade(g.getAttribute("data-lowgrade")); return; }
      var tt = e.target.closest ? e.target.closest("[data-lowtouch]") : null;
      if (tt) {
        cur.touch++;
        var msg = document.getElementById("lowTouchMsg");
        var hs = HOUSES();
        var h = hs[cur.house];
        if (msg) msg.textContent = "그림을 " + cur.touch + "번 만져보았어요! " + manipHint(h.id);
        if (window.G3UI && window.G3UI.sfx) window.G3UI.sfx("ok");
        return;
      }
      var c = e.target.closest ? e.target.closest("[data-lowchoice]") : null;
      if (c) { answer(c.getAttribute("data-lowchoice")); return; }
      var n = e.target.closest ? e.target.closest("[data-lownext]") : null;
      if (n) { next(); return; }
      var ge = e.target.closest ? e.target.closest("[data-lowenter]") : null;
      if (ge) { open(ge.getAttribute("data-lowenter")); return; }
    });
    var x = document.getElementById("dlgClose");
    if (x) x.addEventListener("click", function () {
      var ov = document.getElementById("dlg");
      if (ov) ov.classList.remove("show");
    });
  }
  function step(dir) {
    var s = 2.6;
    if (dir === "up") moveToken(pos.x, pos.y - s);
    if (dir === "down") moveToken(pos.x, pos.y + s);
    if (dir === "left") moveToken(pos.x - s, pos.y);
    if (dir === "right") moveToken(pos.x + s, pos.y);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
