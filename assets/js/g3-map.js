(function () {
  var PINS = [
    { id: "mul", name: "곱셈 방앗간", x: 50, y: 12 },
    { id: "divi", name: "나눔 과일정거장", x: 80, y: 28 },
    { id: "circ", name: "동그라미 시계소", x: 80, y: 72 },
    { id: "frac", name: "조각 피자부엌", x: 50, y: 88 },
    { id: "mea", name: "되와 무게 실험실", x: 20, y: 72 },
    { id: "gra", name: "그림소식 우체통", x: 20, y: 28 }
  ];
  var FRIENDS = [
    { name: "몽실", line: "방앗간 1차시를 끝내 주면 씨앗을 줄게!", x: 38, y: 30 },
    { name: "햇살이", line: "텃밭에서 무언가 거두면 카드를 준다!", x: 62, y: 66 },
    { name: "반짝이", line: "빈터 2곳을 꾸미면 바람개비 카드를 줘!", x: 30, y: 62 }
  ];
  var DECO_SPOTS = [
    { x: 42, y: 44 }, { x: 58, y: 44 }, { x: 42, y: 58 },
    { x: 58, y: 58 }, { x: 34, y: 48 }, { x: 66, y: 48 }
  ];
  var pos = { x: 50, y: 50 };
  var walkTimer = null;
  function store() { return window.G3Store.load(); }
  function build() {
    var wrap = document.getElementById("mapwrap");
    if (!wrap || wrap.dataset.built) return;
    wrap.dataset.built = "1";
    var token = document.createElement("div");
    token.id = "token";
    wrap.appendChild(token);
    refreshToken();
    moveToken(pos.x, pos.y, true);
    for (var i = 0; i < PINS.length; i++) {
      var b = document.createElement("button");
      b.className = "pin";
      b.style.left = PINS[i].x + "%";
      b.style.top = PINS[i].y + "%";
      b.textContent = PINS[i].name;
      b.setAttribute("data-pin", PINS[i].id);
      b.setAttribute("aria-label", PINS[i].name + " 들어가기");
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
    var decoLayer = document.createElement("div");
    decoLayer.id = "mapDecoLayer";
    wrap.appendChild(decoLayer);
    var compass = document.createElement("button");
    compass.id = "todoCompass";
    compass.type = "button";
    compass.className = "todo-compass btn-pulse";
    wrap.appendChild(compass);
    var tbar = document.createElement("div");
    tbar.id = "mapTimeBar";
    tbar.className = "maptime-bar";
    tbar.setAttribute("role", "group");
    tbar.setAttribute("aria-label", "마을 시간대 바꾸기");
    tbar.innerHTML = "<button type='button' data-maptime='day'>☀️ 낮</button>"
      + "<button type='button' data-maptime='sunset'>🌇 노을</button>"
      + "<button type='button' data-maptime='night'>🌙 밤</button>";
    wrap.appendChild(tbar);
    syncDeco();
    syncTodo();
    syncBuildingGrowth();
    applyMapTime(store().mapTime || "day", true);
    syncFriends();
  }
  var FRIEND_META = [
    { key: "mong", name: "몽실" },
    { key: "chick", name: "삐약이" },
    { key: "bunny", name: "톡톡이" }
  ];
  function hearts(n) {
    n = Math.max(0, Math.min(5, n || 0));
    var s = "";
    for (var i = 0; i < 3; i++) s += i < Math.min(3, n) ? "♥" : "♡";
    return s;
  }
  function syncFriends() {
    var bar = document.getElementById("friendBar");
    if (!bar) {
      var card = document.getElementById("village");
      if (!card) return;
      bar = document.createElement("div");
      bar.id = "friendBar";
      bar.className = "friend-bar";
      var hud = card.querySelector(".hud");
      if (hud && hud.parentNode) hud.parentNode.insertBefore(bar, hud);
      else card.appendChild(bar);
    }
    var d = store();
    var fr = d.friends || { mong: 0, chick: 0, bunny: 0 };
    var html = "<span class='friend-bar-title'>주민 친밀도</span>";
    for (var i = 0; i < FRIEND_META.length; i++) {
      var k = FRIEND_META[i].key;
      html += "<span class='friend-heart' title='" + FRIEND_META[i].name + "에게 요리 선물·부탁 해결로 하트를 모아 보세요'>" + FRIEND_META[i].name + " <i>" + hearts(fr[k]) + "</i></span>";
    }
    bar.innerHTML = html;
  }
  function applyMapTime(t, silent) {
    var wrap = document.getElementById("mapwrap");
    if (!wrap) return;
    if (t !== "day" && t !== "sunset" && t !== "night") t = "day";
    wrap.classList.remove("time-day", "time-sunset", "time-night");
    wrap.classList.add("time-" + t);
    var btns = wrap.querySelectorAll("#mapTimeBar [data-maptime]");
    for (var i = 0; i < btns.length; i++) {
      btns[i].classList.toggle("sel", btns[i].getAttribute("data-maptime") === t);
    }
    if (!silent) {
      var d = store();
      d.mapTime = t;
      window.G3Store.save(d);
      if (window.G3UI) window.G3UI.toast(t === "day" ? "☀️ 낮 마을입니다!" : (t === "sunset" ? "🌇 노을이 깔린 마을입니다!" : "🌙 별빛 밤 마을! 가로등과 분수대에 불이 켜졌어요!"));
    }
  }
  function nextTodoTask() {
    var d = store();
    if (!d.avatar || !d.avatar.name) return { text: "나만의 주민 이름 짓기", act: "scroll:avatar" };
    var now = Date.now();
    var hasEmpty = false;
    for (var f = 0; f < 4; f++) {
      var p = d.farm.plots[f];
      if (p && now >= p.readyAt) return { text: "텃밭 작물 수확하기!", act: "scroll:farm" };
      if (!p) hasEmpty = true;
    }
    if (d.seeds > 0 && hasEmpty) return { text: "씨앗 " + d.seeds + "개 텃밭에 심기", act: "scroll:farm" };
    if (d.wrong && d.wrong.length > 0) return { text: "오답 교실 " + d.wrong.length + "문제 해결하기", act: "wrong" };
    var units = window.G3Units || {};
    for (var i = 0; i < PINS.length; i++) {
      var u = units[PINS[i].id];
      var ls = (u && u.lessons) || [];
      for (var j = 0; j < ls.length; j++) {
        if (!d.done[ls[j].id]) return { text: PINS[i].name + " · " + ls[j].title.split(" · ")[0] + " 풀기", act: "pin:" + PINS[i].id };
      }
    }
    if (d.stars >= 30 && (d.sets || []).length < 3) return { text: "별 30개로 황금 세트 뽑기", act: "scroll:gachaSec" };
    return { text: "오늘의 도전 5문제 풀기", act: "daily" };
  }
  function syncTodo() {
    var btn = document.getElementById("todoCompass");
    if (btn) {
      var t = nextTodoTask();
      btn.setAttribute("data-todo-act", t.act);
      btn.innerHTML = "<i>🧭 오늘 할 일</i><b>" + t.text + " →</b>";
    }
    syncBuildingGrowth();
  }
  function syncDeco() {
    var layer = document.getElementById("mapDecoLayer");
    if (!layer) return;
    var d = store();
    var placed = (d.deco && d.deco.placed) || [];
    var shop = (window.G3Deco && window.G3Deco.shop) || {};
    var html = "";
    for (var i = 0; i < placed.length; i++) {
      var sp = DECO_SPOTS[placed[i].spot];
      var it = shop[placed[i].id];
      if (!sp || !it) continue;
      var face = (window.G3Deco && window.G3Deco.face) ? window.G3Deco.face(it) : it.svg;
      html += "<span class='map-deco' title='" + it.name + "' style='left:" + sp.x + "%;top:" + sp.y + "%'>" + face + "</span>";
    }
    layer.innerHTML = html;
  }
  function unitProgress(id) {
    var u = (window.G3Units || {})[id];
    var ls = (u && u.lessons) || [];
    var d = store().done || {};
    var c = 0;
    for (var i = 0; i < ls.length; i++) if (d[ls[i].id]) c++;
    return { done: c, tot: ls.length || 1 };
  }
  function syncBuildingGrowth() {
    var pins = document.querySelectorAll("#mapwrap [data-pin]");
    if (!pins || !pins.length) return;
    for (var i = 0; i < pins.length; i++) {
      var id = pins[i].getAttribute("data-pin");
      var pr = unitProgress(id);
      pins[i].classList.remove("lv-0", "lv-1", "lv-max");
      var badge = pins[i].querySelector(".lv-badge");
      if (!badge) {
        badge = document.createElement("span");
        badge.className = "lv-badge";
        pins[i].appendChild(badge);
      }
      if (pr.done >= pr.tot && pr.tot > 0) {
        pins[i].classList.add("lv-max");
        badge.textContent = "👑 마스터";
      } else if (pr.done > 0) {
        pins[i].classList.add("lv-1");
        badge.textContent = "🌼 성장중 " + pr.done + "/" + pr.tot;
      } else {
        pins[i].classList.add("lv-0");
        badge.textContent = "🌱 시작전";
      }
    }
  }
  function moveToken(x, y, instant) {
    var prevX = pos.x;
    pos.x = Math.max(4, Math.min(96, x));
    pos.y = Math.max(6, Math.min(94, y));
    var token = document.getElementById("token");
    if (!token) return;
    if (instant) {
      token.style.transition = "none";
    } else {
      token.style.transition = "left .45s ease-out, top .45s ease-out";
      if (Math.abs(pos.x - prevX) > 0.2) {
        token.classList.toggle("face-left", pos.x < prevX);
      }
      token.classList.add("walking");
      if (walkTimer) clearTimeout(walkTimer);
      walkTimer = setTimeout(function () { token.classList.remove("walking"); }, 460);
    }
    token.style.left = pos.x + "%";
    token.style.top = pos.y + "%";
    checkNear();
  }
  function checkNear() {
    var best = null, bd = 12;
    for (var i = 0; i < PINS.length; i++) {
      var d = Math.hypot(pos.x - PINS[i].x, pos.y - PINS[i].y);
      if (d < bd) { bd = d; best = PINS[i]; }
    }
    var label = document.getElementById("nearLabel");
    var btn = document.getElementById("enterBtn");
    if (best) {
      if (label) label.textContent = best.name + " 앞입니다";
      if (btn) {
        btn.hidden = false;
        btn.textContent = best.name + " 들어가기";
        btn.setAttribute("data-near", best.id);
      }
    } else {
      if (label) label.textContent = "지도를 눌러 산책하세요";
      if (btn) btn.hidden = true;
    }
  }
  function burst() {
    var wrap = document.getElementById("mapwrap");
    if (!wrap) return;
    var colors = ["#F5B23A", "#EE7F62", "#6FBAD2", "#4FA85E"];
    for (var i = 0; i < 40; i++) {
      var s = document.createElement("span");
      s.className = "confetti";
      s.style.left = pos.x + "%";
      s.style.top = pos.y + "%";
      s.style.background = colors[i % 4];
      wrap.appendChild(s);
      (function (el) {
        var dx = (Math.random() - 0.5) * 160, dy = -Math.random() * 120 - 20;
        requestAnimationFrame(function () {
          el.style.transform = "translate(" + dx + "px," + dy + "px) rotate(180deg)";
          el.style.opacity = "0";
        });
        setTimeout(function () { el.remove(); }, 1100);
      })(s);
    }
  }
  function enter(id) {
    if (window.G3Journal) window.G3Journal.visit(id);
    if (window.G3Quests) window.G3Quests.poke();
    if (window.G3Dlg) window.G3Dlg.open(id);
  }
  function init() {
    build();
    var wrap = document.getElementById("mapwrap");
    if (wrap) wrap.addEventListener("click", function (e) {
      var mt = e.target.closest ? e.target.closest("[data-maptime]") : null;
      if (mt) {
        applyMapTime(mt.getAttribute("data-maptime"));
        return;
      }
      var td = e.target.closest ? e.target.closest("#todoCompass") : null;
      if (td) {
        var act = td.getAttribute("data-todo-act") || "";
        if (act.indexOf("scroll:") === 0) {
          var el = document.getElementById(act.slice(7));
          if (el) el.scrollIntoView({ behavior: "smooth" });
        } else if (act.indexOf("pin:") === 0) {
          var pid = act.slice(4);
          for (var p = 0; p < PINS.length; p++) if (PINS[p].id === pid) moveToken(PINS[p].x, PINS[p].y + 6);
          enter(pid);
        } else if (act === "wrong" && window.G3Dlg) window.G3Dlg.openWrong();
        else if (act === "daily" && window.G3Dlg) window.G3Dlg.openDaily();
        return;
      }
      var pin = e.target.closest ? e.target.closest("[data-pin]") : null;
      if (pin) {
        var id = pin.getAttribute("data-pin");
        for (var i = 0; i < PINS.length; i++) if (PINS[i].id === id) moveToken(PINS[i].x, PINS[i].y + 6);
        enter(id);
        return;
      }
      var say = e.target.closest ? e.target.closest("[data-say]") : null;
      if (say) {
        if (window.G3UI) window.G3UI.toast(say.textContent + ": " + say.getAttribute("data-say"));
        return;
      }
      if (e.target.closest && e.target.closest("#token")) return;
      var r = wrap.getBoundingClientRect();
      moveToken((e.clientX - r.left) / r.width * 100, (e.clientY - r.top) / r.height * 100);
    });
    var btn = document.getElementById("enterBtn");
    if (btn) btn.addEventListener("click", function () {
      var id = btn.getAttribute("data-near");
      if (id) enter(id);
    });
    var held = { up: false, down: false, left: false, right: false };
    var KEYMAP = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right", w: "up", s: "down", a: "left", d: "right", W: "up", S: "down", A: "left", D: "right" };
    window.addEventListener("keydown", function (e) {
      var tag = (e.target && e.target.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (e.target && e.target.isContentEditable)) return;
      var ov = document.getElementById("dlg");
      if (ov && ov.classList.contains("show")) return;
      var dir = KEYMAP[e.key];
      if (!dir) return;
      e.preventDefault();
      if (!held[dir]) { held[dir] = true; step(dir); }
    });
    window.addEventListener("keyup", function (e) {
      var dir = KEYMAP[e.key];
      if (dir) held[dir] = false;
    });
    setInterval(function () {
      if (held.up) step("up");
      if (held.down) step("down");
      if (held.left) step("left");
      if (held.right) step("right");
    }, 130);
    document.addEventListener("pointerdown", function (e) {
      var t = e.target.closest ? e.target.closest(".dpad [data-move]") : null;
      if (t) { held[t.getAttribute("data-move")] = true; step(t.getAttribute("data-move")); }
    });
    document.addEventListener("pointerup", function () { held.up = held.down = held.left = held.right = false; });
    document.addEventListener("pointercancel", function () { held.up = held.down = held.left = held.right = false; });
    window.G3MapReady = true;
  }
  function step(dir) {
    var s = 2.4;
    if (dir === "up") moveToken(pos.x, pos.y - s);
    if (dir === "down") moveToken(pos.x, pos.y + s);
    if (dir === "left") moveToken(pos.x - s, pos.y);
    if (dir === "right") moveToken(pos.x + s, pos.y);
  }
  function refreshToken() {
    var token = document.getElementById("token");
    if (!token) return;
    var a = store().avatar || {};
    var nm = a.name || "주민";
    token.innerHTML = "<div class='tk-fig' id='tokenRig'></div><em>" + nm + "</em>";
    var rigBox = document.getElementById("tokenRig");
    if (rigBox && window.G3Avatar && window.G3Avatar.mountRig) {
      window.G3Avatar.mountRig(rigBox, a);
    }
  }
  window.G3Confetti = { burst: burst };
  window.G3TokenRefresh = function () { refreshToken(); syncTodo(); syncFriends(); };
  window.G3Map = { init: init, move: moveToken, syncDeco: syncDeco, syncTodo: syncTodo, syncBuildingGrowth: syncBuildingGrowth, syncFriends: syncFriends, applyMapTime: applyMapTime };
})();
