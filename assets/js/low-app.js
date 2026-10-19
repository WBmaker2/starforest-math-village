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
  var FRIEND_IMGS = {
    "몽실": "../assets/img/flow/parts/npc-mong.png",
    "햇살이": "../assets/img/flow/parts/npc-haetsal.png",
    "반짝이": "../assets/img/flow/parts/npc-banjjak.png"
  };
  function FRIENDS() {
    if (G === "2") return [
      { name: "몽실", line: "길이 재기소에서 자 눈금을 읽어 봐!", x: 20, y: 42, img: FRIEND_IMGS["몽실"] },
      { name: "햇살이", line: "시계 전망대에서 몇 시 몇 분인지 찾아봐!", x: 84, y: 44, img: FRIEND_IMGS["햇살이"] },
      { name: "반짝이", line: "무늬 산책로에서 곱셈 규칙을 찾아봐!", x: 68, y: 76, img: FRIEND_IMGS["반짝이"] }
    ];
    return [
      { name: "몽실", line: "숫자 화단에서 10 모형을 세어 봐!", x: 37, y: 36, img: FRIEND_IMGS["몽실"] },
      { name: "햇살이", line: "시계탑 바늘을 보고 몇 시인지 읽어 봐!", x: 66, y: 24, img: FRIEND_IMGS["햇살이"] },
      { name: "반짝이", line: "규칙 산책로에서 모양 규칙을 찾아봐!", x: 36, y: 74, img: FRIEND_IMGS["반짝이"] }
    ];
  }
  var pos = { x: 50, y: 50 };
  var cur = { house: 0, qi: 0, touch: 0, mode: "unit", infList: null };
  function activeList() {
    if ((cur.mode === "infinite" || cur.mode === "wrong" || cur.mode === "focus") && cur.infList) return cur.infList;
    var hs = HOUSES();
    return (hs[cur.house] && hs[cur.house].list) || [];
  }
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
    var frs = FRIENDS();
    for (var j = 0; j < frs.length; j++) {
      var f = document.createElement("button");
      f.className = "friend";
      f.style.left = frs[j].x + "%";
      f.style.top = frs[j].y + "%";
      var fimg = frs[j].img ? "<img class='friend-img' src='" + frs[j].img + "' alt=''>" : "";
      f.innerHTML = fimg + "<span class='friend-name'>" + frs[j].name + "</span>";
      f.setAttribute("data-say", frs[j].line);
      f.setAttribute("aria-label", frs[j].name + "의 말 듣기");
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
  function doorOf(h) {
    // 출입구는 집 그림 아래쪽(남쪽). 데이터에 door가 있으면 그 좌표 우선.
    if (h.door) return { x: h.door.x, y: h.door.y };
    return { x: h.x, y: Math.min(94, h.y + 8) };
  }
  function checkNear() {
    var hs = HOUSES();
    var best = null, bd = 10;
    for (var i = 0; i < hs.length; i++) {
      var door = doorOf(hs[i]);
      var d = Math.hypot(pos.x - door.x, pos.y - door.y);
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
    cur.qi = 0; cur.touch = 0; cur.mode = "unit"; cur.infList = null;
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
  function adaptLevel() {
    try {
      if (window.G3Adapt && window.G3Adapt.level) return window.G3Adapt.level();
    } catch (e) {}
    return 2;
  }
  function openInfinite() {
    var hs = HOUSES();
    var h = hs[cur.house];
    var gen = (window.LowPad && window.LowPad.generate) ? window.LowPad.generate(G, h.id, adaptLevel()) : null;
    if (!gen || !gen.length) { toast("무한 문제를 준비 중이에요. 기본 문제를 풀어 보세요!"); return; }
    cur.mode = "infinite";
    cur.infList = gen;
    cur.qi = 0; cur.touch = 0;
    say(h.npc + ": 숫자가 새로 바뀌었다! 같은 방법으로 다시 풀어 보렴. (무한 그림 문제)");
    renderQ();
  }
  function renderQ() {
    var hs = HOUSES();
    var h = hs[cur.house];
    cur.lowFirst = true;
    var list = activeList();
    var item = list[cur.qi];
    if (!item) { next(); return; }
    var box = document.getElementById("dlgBody");
    if (!box) return;
    var modeTag = cur.mode === "infinite" ? " · 🎲 무한 그림 문제" : "";
    var html = "<p class='crumb'>" + (G === "2" ? "2학년 새싹숲" : "1학년 새싹숲") + " · " + h.name + modeTag + " · " + (cur.qi + 1) + "/" + list.length + "</p>";
    html += "<div class='trial-svg' data-lowtouch>" + item.svg + "</div>";
    html += "<p class='hint' id='lowTouchMsg'>" + manipHint(h.id) + "</p>";
    html += "<p class='trial-q'>" + item.q + " <button type='button' class='mini-act' data-say-text=\"" + String(item.q).replace(/&/g, "&amp;").replace(/"/g, "&quot;") + "\" aria-label='문제 읽어주기'>🔊</button></p><div class='trial-choices low-mode'>";
    for (var i = 0; i < item.choices.length; i++) {
      html += "<button type='button' class='trial-choice btn-pulse' data-lowchoice='" + item.choices[i] + "'>" + item.choices[i] + "</button>";
    }
    html += "</div><p id='lowFb' class='trial-fb' aria-live='polite'></p>";
    html += "<div class='prow'><button type='button' class='mini-act btn-pulse' data-lowinfinite='1'>🎲 숫자 바꿔 더 놀기</button>"
      + "<button type='button' class='mini-act' data-lowclose='1'>마을로 돌아가기</button></div>";
    box.innerHTML = html;
  }
  function answer(pick) {
    var hs = HOUSES();
    var h = hs[cur.house];
    var list = activeList();
    var item = list[cur.qi];
    var fb = document.getElementById("lowFb");
    if (!item) return;
    if (pick === item.a) {
      var d = store();
      if (window.G3Adapt && window.G3Adapt.record) window.G3Adapt.record(cur.lowFirst !== false);
      try {
        if (window.G3Understand && window.G3Tags) {
          window.G3Understand.record(window.G3Tags.low(h.id), cur.lowFirst !== false);
        }
      } catch (e) {}
      var fest = (window.G3Pet && window.G3Pet.festMult) ? window.G3Pet.festMult() : 1;
      if (cur.mode === "wrong") {
        var wk = item.wrongKey;
        if (wk) {
          d.lowWrong = (d.lowWrong || []).filter(function (w) { return w.key !== wk; });
          window.G3Store.save(d);
        } else {
          window.G3Store.save(d);
        }
        if (window.G3Pet) window.G3Pet.mark("play");
        d = store();
        d.stars = (d.stars || 0) + 5 * fest;
        window.G3Store.save(d);
        if (window.G3UI) { window.G3UI.stars(); window.G3UI.sfx("ok"); }
        if (window.G3Pet) window.G3Pet.onSolve(true);
        renderProgress();
        if (fb) fb.innerHTML = "<b>정답! 쌍둥이 정복! ★+5</b> " + item.exp + " <button type='button' class='trial-next btn-pulse' data-lownext='1'>" + (cur.qi + 1 < list.length ? "다음 쌍둥이 →" : "마을로 돌아가기") + "</button>";
      } else if (cur.mode === "infinite") {
        d.stars = (d.stars || 0) + 5 * fest;
        window.G3Store.save(d);
        if (window.G3UI) { window.G3UI.stars(); window.G3UI.sfx("ok"); }
        if (window.G3Pet) window.G3Pet.onSolve(true);
        renderProgress();
        if (fb) fb.innerHTML = "<b>정답! ★+5</b> " + item.exp + " <button type='button' class='trial-next btn-pulse' data-lownext='1'>" + (cur.qi + 1 < list.length ? "다음 문제 →" : "한 번 더 놀기") + "</button>";
      } else if (cur.mode === "focus") {
        d.stars = (d.stars || 0) + 6 * fest;
        window.G3Store.save(d);
        if (window.G3UI) { window.G3UI.stars(); window.G3UI.sfx("ok"); }
        if (window.G3Pet) window.G3Pet.onSolve(true);
        renderProgress();
        if (fb) fb.innerHTML = "<b>정답! ★+6</b> " + item.exp + " <button type='button' class='trial-next btn-pulse' data-lownext='1'>" + (cur.qi + 1 < list.length ? "다음 문제 →" : "마을로 돌아가기") + "</button>";
      } else {
        var key = h.id + "-" + cur.qi;
        if (!d.lowDone) d.lowDone = {};
        var first = !d.lowDone[key];
        if (first) {
          d.lowDone[key] = true;
          d.stars += 10 * fest;
          d.seeds += 1;
          window.G3Store.save(d);
          if (window.G3UI) window.G3UI.stars();
        }
        if (window.G3UI && window.G3UI.sfx) window.G3UI.sfx("ok");
        if (window.G3Pet) window.G3Pet.onSolve(true);
        renderProgress();
        syncGrowth();
        if (fb) fb.innerHTML = "<b>정답! ★+10 · 씨앗 +1</b> " + item.exp + " <button type='button' class='trial-next btn-pulse' data-lownext='1'>" + (cur.qi + 1 < list.length ? "다음 문제 →" : "마을로 돌아가기") + "</button>";
      }
    } else {
      cur.lowFirst = false;
      if (window.G3UI && window.G3UI.sfx) window.G3UI.sfx("no");
      if (window.G3Pet) window.G3Pet.onSolve(false);
      try {
        if (window.G3Understand && window.G3Tags) {
          window.G3Understand.record(window.G3Tags.low(h.id), false);
        }
      } catch (e) {}
      if (cur.mode === "unit") {
        try {
          var dd = store();
          if (!dd.lowWrong) dd.lowWrong = [];
          var wk = h.id + "-" + cur.qi;
          var dup = false;
          for (var wi = 0; wi < dd.lowWrong.length; wi++) if (dd.lowWrong[wi].key === wk) dup = true;
          if (!dup) {
            dd.lowWrong.push({ key: wk, house: h.id, tag: "low:" + h.id, tagName: h.name });
            if (dd.lowWrong.length > 20) dd.lowWrong = dd.lowWrong.slice(dd.lowWrong.length - 20);
            window.G3Store.save(dd);
          }
        } catch (e) {}
      }
      if (fb) fb.textContent = "그림을 다시 살펴볼까요? " + item.exp;
    }
  }
  function next() {
    var hs = HOUSES();
    var h = hs[cur.house];
    var list = activeList();
    if (cur.qi + 1 < list.length) { cur.qi++; renderQ(); }
    else if (cur.mode === "infinite") {
      var box = document.getElementById("dlgBody");
      if (box) box.innerHTML = "<h3>🎲 무한 그림 문제 완료!</h3><p>숫자가 바뀐 문제도 훌륭히 풀었어요! 별 +15 · 씨앗 +1 보너스!</p>"
        + "<div class='prow'><button type='button' class='trial-next btn-pulse' data-lowinfinite='1'>🎲 숫자 바꿔 한 번 더</button>"
        + "<button type='button' class='mini-act' data-lowclose='1'>마을로 돌아가기</button></div>";
      var d = store();
      d.stars = (d.stars || 0) + 15; d.seeds = (d.seeds || 0) + 1;
      window.G3Store.save(d);
      if (window.G3UI) window.G3UI.stars();
      if (window.G3Confetti && window.G3Confetti.burst) window.G3Confetti.burst();
    }
    else if (cur.mode === "wrong") {
      var left = 0;
      try { left = (store().lowWrong || []).length; } catch (e) {}
      var ovw = document.getElementById("dlg");
      if (ovw) ovw.classList.remove("show");
      cur.mode = "unit"; cur.infList = null;
      renderProgress();
      toast(left ? ("쌍둥이 " + left + "개 남았어요! 다시 도전해 보세요!") : "틀린 문제 완전 정복! 참 잘했어요!");
      if (window.G3Confetti && window.G3Confetti.burst && !left) window.G3Confetti.burst();
    }
    else if (cur.mode === "focus") {
      var ovf = document.getElementById("dlg");
      if (ovf) ovf.classList.remove("show");
      cur.mode = "unit"; cur.infList = null;
      var df = store();
      df.stars = (df.stars || 0) + 15; df.seeds = (df.seeds || 0) + 1;
      window.G3Store.save(df);
      if (window.G3UI) window.G3UI.stars();
      if (window.G3Confetti && window.G3Confetti.burst) window.G3Confetti.burst();
      renderProgress();
      toast("약한 개념 다시 놀기 완료! 별 +15 · 씨앗 +1 보너스!");
    }
    else {
      var ov = document.getElementById("dlg");
      if (ov) ov.classList.remove("show");
      toast(h.name + " 탐험 완료! 참 잘했어요! 🎲 숫자 바꿔 더 놀기도 있어요!");
      if (window.G3Confetti && window.G3Confetti.burst) window.G3Confetti.burst();
    }
  }
  function renderProgress() {
    try {
      var sec = document.getElementById("lowProgress");
      if (sec && !document.getElementById("lowBigBtn")) {
        var bb = document.createElement("button");
        bb.id = "lowBigBtn";
        bb.type = "button";
        bb.className = "mini-act";
        bb.textContent = "🔍 큰 글자";
        bb.setAttribute("aria-pressed", document.body.classList.contains("low-big") ? "true" : "false");
        sec.insertBefore(bb, sec.querySelector("#lowProgGrid"));
      }
    } catch (e) {}
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
      var lw = [];
      try { lw = store().lowWrong || []; } catch (e) {}
      var weak = [];
      try { if (window.G3Understand) weak = window.G3Understand.weakTags(3); } catch (e) {}
      if (weak.length) {
        var wn = [];
        for (var wi2 = 0; wi2 < weak.length; wi2++) wn.push(weak[wi2].name + " " + Math.round(weak[wi2].rate * 100) + "%");
        html += "<button class='mapcell focus-btn btn-pulse' data-lowfocus='1'><b>🧭 약한 개념 다시 놀기</b><span>" + wn.join(", ") + "</span></button>";
      }
      if (lw.length) {
        html += "<button class='mapcell btn-pulse' data-lowwrong='1'><b>👯 틀린 문제 다시 풀기</b><span>쌍둥이 문제 " + lw.length + "개</span></button>";
      }
      grid.innerHTML = html;
    }
  }
  function openLowFocus() {
    if (!window.G3Understand || !window.G3Understand.focusQuestions) return;
    var list = window.G3Understand.focusQuestions(8);
    if (!list.length) { toast("아직 모은 기록이 적어요. 문제를 조금 더 풀어 보세요!"); return; }
    cur.mode = "focus";
    cur.infList = [];
    for (var i = 0; i < list.length; i++) {
      var it = list[i];
      cur.infList.push({ q: it.q, a: it.a, exp: (it.steps && it.steps[0]) || "", svg: it.svg, choices: it.choices, house: it.house });
    }
    cur.house = houseIndex(list[0].house || HOUSES()[0].id);
    cur.qi = 0; cur.touch = 0;
    var ov = document.getElementById("dlg");
    if (ov) ov.classList.add("show");
    say("지난 기록에서 자주 헷갈린 그림 문제를 모았어! 천천히 다시 풀어 보자.");
    renderQWrong();
  }
  function openLowWrong() {
    var d = store();
    var lw = d.lowWrong || [];
    if (!lw.length) { toast("틀린 문제가 없어요! 참 잘했어요!"); return; }
    var hs = HOUSES();
    cur.mode = "wrong";
    cur.infList = [];
    var want = Math.min(6, lw.length);
    for (var i = 0; i < want; i++) {
      var hid = lw[i].house;
      var gen = (window.LowPad && window.LowPad.generate) ? window.LowPad.generate(G, hid, adaptLevel()) : [];
      var pick = null;
      for (var g = 0; g < gen.length; g++) {
        var dup = false;
        for (var c = 0; c < cur.infList.length; c++) if (cur.infList[c].q === gen[g].q) dup = true;
        if (!dup) { pick = gen[g]; break; }
      }
      if (pick) {
        pick = { q: pick.q, a: pick.a, exp: pick.exp, svg: pick.svg, choices: pick.choices, wrongKey: lw[i].key, isTwin: true };
        cur.infList.push(pick);
      }
    }
    if (!cur.infList.length) { toast("쌍둥이 문제를 만들지 못했어요."); cur.mode = "unit"; return; }
    var h0 = hs[0];
    cur.house = 0;
    cur.qi = 0; cur.touch = 0;
    var ov = document.getElementById("dlg");
    if (ov) ov.classList.add("show");
    say("틀렸던 문제와 같은 유형! 숫자만 바뀐 쌍둥이 문제야. 다 맞히면 목록에서 사라져!");
    renderQWrong();
  }
  function renderQWrong() {
    cur.lowFirst = true;
    var item = cur.infList[cur.qi];
    var box = document.getElementById("dlgBody");
    if (!box || !item) return;
    var html = "<p class='crumb'>" + (G === "2" ? "2학년 새싹숲" : "1학년 새싹숲") + " · " + (cur.mode === "focus" ? "🧭 약한 개념 다시 놀기" : "👯 쌍둥이 문제") + " · " + (cur.qi + 1) + "/" + cur.infList.length + "</p>";
    html += "<div class='trial-svg' data-lowtouch>" + item.svg + "</div>";
    html += "<p class='trial-q'>" + item.q + " <button type='button' class='mini-act' data-say-text=\"" + String(item.q).replace(/&/g, "&amp;").replace(/"/g, "&quot;") + "\" aria-label='문제 읽어주기'>🔊</button></p><div class='trial-choices low-mode'>";
    for (var i = 0; i < item.choices.length; i++) {
      html += "<button type='button' class='trial-choice btn-pulse' data-lowchoice='" + item.choices[i] + "'>" + item.choices[i] + "</button>";
    }
    html += "</div><p id='lowFb' class='trial-fb' aria-live='polite'></p>";
    html += "<div class='prow'><button type='button' class='mini-act' data-lowclose='1'>마을로 돌아가기</button></div>";
    box.innerHTML = html;
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
        var dr = doorOf(h); moveToken(dr.x, dr.y);
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
    var KEYMAP = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
      w: "up", s: "down", a: "left", d: "right", W: "up", S: "down", A: "left", D: "right",
      "ㅈ": "up", "ㄴ": "down", "ㅁ": "left", "ㅇ": "right" };
    var CODEMAP = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
      KeyW: "up", KeyS: "down", KeyA: "left", KeyD: "right" };
    function keyDir(e) {
      // e.code는 자판 배열과 무관하게 물리적 키를 가리켜 한글 모드에서도 동작
      try {
        if (e.code && CODEMAP[e.code]) return CODEMAP[e.code];
      } catch (err) {}
      return KEYMAP[e.key];
    }
    window.addEventListener("keydown", function (e) {
      var tag = (e.target && e.target.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (e.target && e.target.isContentEditable)) return;
      var ov = document.getElementById("dlg");
      if (ov && ov.classList.contains("show")) return;
      var dir = keyDir(e);
      if (!dir) return;
      e.preventDefault();
      step(dir);
    });
    document.addEventListener("pointerdown", function (e) {
      var t = e.target.closest ? e.target.closest(".dpad [data-move]") : null;
      if (t) step(t.getAttribute("data-move"));
    });
    document.addEventListener("click", function (e) {
      var li = e.target.closest ? e.target.closest("[data-lowinfinite]") : null;
      if (li) { openInfinite(); return; }
      var lc = e.target.closest ? e.target.closest("[data-lowclose]") : null;
      if (lc) {
        var ov2 = document.getElementById("dlg");
        if (ov2) ov2.classList.remove("show");
        cur.mode = "unit"; cur.infList = null;
        return;
      }
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
      var gw = e.target.closest ? e.target.closest("[data-lowwrong]") : null;
      if (gw) { openLowWrong(); return; }
      var gf = e.target.closest ? e.target.closest("[data-lowfocus]") : null;
      if (gf) { openLowFocus(); return; }
    });
    document.addEventListener("click", function (e2) {
      if (e2.target && e2.target.id === "lowBigBtn") {
        var on = document.body.classList.toggle("low-big");
        e2.target.setAttribute("aria-pressed", on ? "true" : "false");
        e2.target.textContent = on ? "🔍 보통 글자" : "🔍 큰 글자";
      }
    });
    var x = document.getElementById("dlgClose");
    if (x) x.addEventListener("click", function () {
      var ov = document.getElementById("dlg");
      if (ov) ov.classList.remove("show");
    });
    if (window.G3Sheet) window.G3Sheet.render();
    if (window.G3Slots) window.G3Slots.render();
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
