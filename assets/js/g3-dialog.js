(function () {
  var state = { mode: "unit", house: "mul", lesson: 0, qi: 0, tries: 0, firstOk: 0, total: 0, customList: null, customTitle: "" };
  var PORTRAIT_BASE = {
    mul: "../assets/img/flow/house-mul.jpg", divi: "../assets/img/flow/house-divi.jpg",
    circ: "../assets/img/flow/house-circ.jpg", frac: "../assets/img/flow/house-frac.jpg",
    mea: "../assets/img/flow/house-mea.jpg", gra: "../assets/img/flow/house-gra.jpg"
  };
  var NPC_BASE = { mul: "npc-mole", divi: "npc-chick", circ: "npc-bunny", frac: "npc-mole", mea: "npc-chick", gra: "npc-bunny" };
  function PORTRAIT() { return window.GRADE_PORTRAITS || PORTRAIT_BASE; }
  function NPC_IMG() { return window.GRADE_NPCS || NPC_BASE; }
  function portraitFor(id) {
    var p = PORTRAIT();
    if (p[id]) return p[id];
    var base = PORTRAIT_BASE;
    var keys = Object.keys(base);
    return base[keys[id.length % keys.length]];
  }
  function npcFor(id) {
    var n = NPC_IMG();
    if (n[id]) return n[id];
    var keys = ["npc-mole", "npc-chick", "npc-bunny"];
    return keys[id.length % keys.length];
  }
  function curUnit() {
    var u = window.G3Units && window.G3Units[state.house];
    if (u) return u;
    try {
      for (var k in (window.G3Units || {})) return window.G3Units[k];
    } catch (e) {}
    return { name: "단원 집", greet: "어서 오렴!", lessons: [] };
  }
  function findQuestion(qText) {
    var units = window.G3Units || {};
    for (var hid in units) {
      var ls = units[hid].lessons || [];
      for (var i = 0; i < ls.length; i++) {
        for (var j = 0; j < ls[i].list.length; j++) {
          if (ls[i].list[j].q === qText) {
            return { house: hid, lid: ls[i].id, item: ls[i].list[j] };
          }
        }
      }
    }
    return { house: "mul", lid: "mul-1", item: { q: qText, a: "60", steps: ["차근차근 다시 계산해 보자"] } };
  }
  function syncDlgAvatar() {
    var d = window.G3Store.load();
    var a = d.avatar || {};
    var box = document.getElementById("dlgAvatar");
    if (box && window.G3Avatar && window.G3Avatar.mountRig) {
      window.G3Avatar.mountRig(box, a);
    }
    var nm = document.getElementById("dlgAvName");
    if (nm) nm.textContent = a.name || "주민";
  }
  function showModal(npcKey) {
    var ov = document.getElementById("dlg");
    if (!ov) return;
    ov.classList.add("show");
    var ni = document.getElementById("npcImg");
    if (ni) ni.src = "../assets/img/flow/" + (npcKey || "npc-mole") + ".jpg";
    syncDlgAvatar();
  }
  function firstHouse() {
    try {
      var u = window.G3Units || {};
      for (var k in u) return k;
    } catch (e) {}
    return "mul";
  }
  function open(houseId) {
    state.mode = "unit";
    state.house = (window.G3Units && window.G3Units[houseId]) ? houseId : firstHouse();
    showModal(npcFor(state.house));
    renderLessons();
  }
  function twinFor(house, orig) {
    try {
      if (window.G3Pad && window.G3Pad.generateSet) {
        for (var t = 0; t < 8; t++) {
          var gen = window.G3Pad.generateSet(house, adaptLevel());
          for (var i = 0; i < gen.length; i++) {
            if (gen[i].q !== orig.q) {
              return { q: gen[i].q, a: gen[i].a, steps: gen[i].steps, twin: true };
            }
          }
        }
      }
    } catch (e) {}
    return null;
  }
  function openWrong() {
    var d = window.G3Store.load();
    if (!d.wrong || !d.wrong.length) {
      if (window.G3UI) window.G3UI.toast("보관된 오답이 없습니다! 모든 문제를 잘 풀었어요.");
      return;
    }
    state.mode = "wrong";
    state.customTitle = "오답 숲 · 자동 복습 (쌍둥이 문제)";
    state.customList = [];
    // 최근 오답 우선: at 기준 정렬 후 쌍둥이 생성
    var list = d.wrong.slice().sort(function(a,b){ return (b.at||0) - (a.at||0); });
    for (var i = 0; i < list.length; i++) {
      var found = findQuestion(list[i].q);
      var twin = twinFor(found.house, found.item);
      var use = twin || found.item;
      state.customList.push({ q: use.q, a: use.a, steps: use.steps, house: found.house, lid: found.lid, origQ: list[i].q, isTwin: !!twin });
    }
    state.qi = 0; state.tries = 0; state.firstOk = 0; state.total = state.customList.length;
    showModal("npc-bunny");
    npcSay("오답 숲에 모인 문제들을 차근차근 다시 풀어 보자! 틀린 횟수가 많은 문제부터 연습해요.");
    renderQ();
  }
  function openDaily() {
    var pool = [];
    var units = window.G3Units || {};
    for (var hid in units) {
      var ls = units[hid].lessons || [];
      for (var i = 0; i < ls.length; i++) {
        for (var j = 0; j < ls[i].list.length; j++) {
          var it = ls[i].list[j];
          pool.push({ q: it.q, a: it.a, steps: it.steps, house: hid, lid: ls[i].id });
        }
      }
    }
    pool.sort(function () { return Math.random() - 0.5; });
    state.mode = "daily";
    state.customTitle = "오늘의 도전 (5문제)";
    state.customList = pool.slice(0, 5);
    state.qi = 0; state.tries = 0; state.firstOk = 0; state.total = state.customList.length;
    showModal("npc-chick");
    npcSay("오늘의 도전! 여섯 단원에서 고른 다섯 문제를 풀어 보렴. 감점은 없단다!");
    renderQ();
  }
  var BOSS_META = {
    mul: { name: "태엽 연산 골렘", emoji: "🤖" }, divi: { name: "나눔 과일 골렘", emoji: "🍎" },
    circ: { name: "동그라미 수호령", emoji: "⭕" }, frac: { name: "분수 마법사", emoji: "🧙" },
    mea: { name: "황금 저울 연금술사", emoji: "⚖️" }, gra: { name: "별자리 그래프 마법사", emoji: "🔭" }
  };
  function TB(key, fallback) {
    try {
      var t = window.G3TUNE || {};
      return (t[key] == null) ? fallback : t[key];
    } catch (e) { return fallback; }
  }
  function bossFor(house) {
    if (BOSS_META[house]) return BOSS_META[house];
    var keys = ["boss-calc", "boss-shape", "boss-measure", "boss-data"];
    var emojis = ["🤖", "🛡️", "⚗️", "🔭"];
    var names = ["태엽 연산 골렘", "크리스탈 도형 기사", "황금 저울 연금술사", "별자리 그래프 마법사"];
    var i = (String(house).length || 0) % 4;
    try {
      var order = window.GRADE_UNIT_ORDER || [];
      for (var oi = 0; oi < order.length; oi++) {
        if (order[oi] && order[oi][0] === house) { i = oi % 4; break; }
      }
    } catch (e) {}
    return { name: names[i], emoji: emojis[i], img: "../assets/img/flow/parts/" + keys[i] + ".png" };
  }
  function adaptLevel() {
    try {
      if (window.G3Adapt && window.G3Adapt.level) return window.G3Adapt.level();
    } catch (e) {}
    return 2;
  }
  function openFocus() {
    if (!window.G3Understand || !window.G3Understand.focusQuestions) return;
    var list = window.G3Understand.focusQuestions(10);
    if (!list.length) { if (window.G3UI) window.G3UI.toast("아직 모은 학습 기록이 적어요. 문제를 조금 더 풀어 보세요!"); return; }
    state.mode = "focus";
    state.customTitle = "🧭 취약 개념 집중 연습 (10문제)";
    state.customList = list;
    state.qi = 0; state.tries = 0; state.firstOk = 0; state.total = state.customList.length;
    showModal("npc-bunny");
    npcSay("지난 기록에서 자주 헷갈린 개념을 먼저 모았어! 천천히 다시 풀어 보자.");
    renderQ();
  }
  function openInfinite() {
    if (!window.G3Pad || !window.G3Pad.generateSet) return;
    var gen = window.G3Pad.generateSet(state.house, adaptLevel());
    var U = curUnit();
    state.mode = "infinite";
    state.customTitle = U.name + " · 숫자 바꿔 무한 연습";
    state.customList = [];
    for (var i = 0; i < gen.length; i++) {
      state.customList.push({ q: gen[i].q, a: gen[i].a, steps: gen[i].steps, house: state.house, lid: "infinite" });
    }
    state.qi = 0; state.tries = 0; state.firstOk = 0; state.total = state.customList.length;
    npcSay("숫자가 새로 바뀌었다! 같은 방법으로 다시 풀어 보렴.");
    renderQ();
  }
  function close() {
    stopStarTimer();
    var ov = document.getElementById("dlg");
    if (ov) ov.classList.remove("show");
  }
  function npcSay(text) {
    var p = document.getElementById("npcText");
    if (p) p.textContent = text;
  }
  function renderLessons() {
    state.mode = "unit";
    var U = curUnit();
    npcSay(U.greet);
    var box = document.getElementById("dlgBody");
    var d = window.G3Store.load();
    var html = "<img class='houseimg' src='" + portraitFor(state.house) + "' alt='" + U.name + " 그림'><h3>" + U.name + " · 차시 목록</h3><div class='lessons'>";
    var L = U.lessons;
    var S2 = d.stars2 || {};
    function starTxt(id) {
      var n = S2[id] || 0;
      var s = "";
      for (var k = 0; k < 3; k++) s += k < n ? "★" : "☆";
      return " " + s;
    }
    for (var i = 0; i < L.length; i++) {
      var done = d.done[L[i].id] ? " · 완료" : "";
      html += "<button class='lesson btn-pulse' data-lesson='" + i + "'>" + L[i].title + done + starTxt(L[i].id) + "</button>";
      if (d.done[L[i].id]) {
        html += "<button class='lesson boss-btn btn-pulse' data-star='" + i + "'>👑 " + L[i].title.split(" · ")[0] + " 도전왕 (" + TB("starSecs", 20) + "초/문제)</button>";
      }
    }
    html += "</div><p class='hint'>기본 차시는 문제 6개, 실생활 문장제 차시는 4개입니다. 처음 끝내는 차시마다 씨앗 2개를 받습니다. 실수 없이 다 맞히면 🌈 무지개 씨앗!</p>";
    var weak = [];
    try { if (window.G3Understand) weak = window.G3Understand.weakTags(3); } catch (e) {}
    if (weak.length) {
      var wnames = [];
      for (var wi = 0; wi < weak.length; wi++) wnames.push(weak[wi].name + " " + Math.round(weak[wi].rate * 100) + "%");
      html += "<button class='lesson focus-btn btn-pulse' data-open-focus='1'>🧭 취약 개념 집중 연습 (10문제) · " + wnames.join(", ") + "</button>";
    }
    html += "<button class='lesson btn-pulse' data-infinite='1'>🎲 숫자 바꿔 무한 연습하기 (6문제)</button>";
    html += "<button class='lesson' data-sheet-house='" + state.house + "'>🖨️ 이 단원 학습지 인쇄하기 (10문제)</button>";
    var boss = bossFor(state.house);
    var bossImg = boss.img ? ("<img class='boss-mini' src='" + boss.img + "' alt='' onerror=\"this.style.display='none'\">") : "";
    html += "<button class='lesson boss-btn btn-pulse' data-boss='1'>" + bossImg + "⚡ 단원 수호자 대결: " + boss.emoji + " " + boss.name + " (" + TB("bossTotal", 5) + "문제·HP " + TB("bossHp", 3) + ")</button>";
    box.innerHTML = html;
  }
  function startLesson(i) {
    state.mode = "unit";
    var U = curUnit();
    var L = U.lessons[i];
    if (!L) return;
    state.lesson = i; state.qi = 0; state.tries = 0; state.firstOk = 0; state.total = L.list.length;
    npcSay(L.npc || "옆 메모장에 식을 적으며 풀어 보렴.");
    renderQ();
  }
  function activeItem() {
    if (state.mode !== "unit") {
      var c = state.customList[state.qi];
      return { item: c, title: state.customTitle, len: state.customList.length, house: c.house, lid: c.lid };
    }
    var U = curUnit();
    var L = U.lessons[state.lesson];
    return { item: L.list[state.qi], title: U.name + " · " + L.title, len: L.list.length, house: state.house, lid: L.id };
  }
  function renderQ() {
    var cur = activeItem();
    var item = cur.item;
    var steps = item.steps || [];
    var box = document.getElementById("dlgBody");
    var vis = (window.G3Visuals && window.G3Visuals.render) ? window.G3Visuals.render(cur.house, cur.lid, item) : "";
    var html = "";
    if (window.G3Pet && window.G3Pet.comboBar) html += window.G3Pet.comboBar();
    if (state.mode === "boss") {
      var b = bossFor(state.house);
      var maxHp = TB("bossHp", 3);
      var hp = state.bossHp == null ? maxHp : state.bossHp;
      var hearts = "";
      for (var bi = 0; bi < maxHp; bi++) hearts += bi < hp ? "❤️" : "🤍";
      var bimg = b.img ? ("<img class='boss-mini' src='" + b.img + "' alt='' onerror=\"this.style.display='none'\">") : "";
      html += "<div class='boss-bar' aria-live='polite'>" + bimg + "<b>" + b.emoji + " " + b.name + "</b><span>" + hearts + " (남은 HP " + hp + "/" + maxHp + ")</span></div>";
    }
    html += "<p class='crumb'>" + cur.title + " · " + (state.qi + 1) + "/" + cur.len + "</p>";
    if (state.mode === "wrong" && cur.item && cur.item.isTwin) {
      html += "<p class='hint'>👯 지난번에 틀린 문제와 같은 유형! 숫자만 바뀌었어요.</p>";
    }
    html += "<div class='qvis-wrap' data-qvis-wrap>" + vis + "</div>";
    html += "<p class='q'>" + item.q + " <button type='button' class='mini-act' data-say-text=\"" + String(item.q).replace(/&/g, "&amp;").replace(/"/g, "&quot;") + "\" aria-label='문제 읽어주기'>🔊</button></p>";
    html += "<div class='ansrow'><input id='ans' inputmode='none' placeholder='키패드로 답 입력' aria-label='답 입력' readonly>";
    html += "<button id='sendBtn' class='go btn-pulse'>확인</button></div>";
    html += "<div id='padKeypad' class='keypad-grid' aria-label='숫자 키패드'></div>";
    html += "<div class='hint-row'><p class='hint'>기회는 3번입니다. 첫 성공 별 100%, 두 번째 60%, 세 번째 30%.</p>";
    if (steps.length) {
      html += "<button type='button' id='stepHintBtn' class='mini-act'>힌트 한 단계씩 보기 (0/" + steps.length + ")</button>";
    }
    html += "</div><div id='stepHintBox' class='step-hints'></div>";
    html += "<label class='memo'>풀이 메모장<textarea id='memo' rows='2' placeholder='여기에 식을 적어 보세요 (채점 안 함)'></textarea></label>";
    html += "<div class='draw-wrap'><div class='draw-top'><b>손글씨 연습장</b><span class='hint'>손가락·마우스로 식을 써 보세요</span><span class='pen-tools' id='penTools'><button type='button' data-pen='black' class='sel'>⚫ 검정</button><button type='button' data-pen='red'>🔴 빨강</button><button type='button' data-pen='blue'>🔵 파랑</button><button type='button' data-pen='eraser'>🧽 지우개</button></span><button type='button' id='drawClear' class='mini-act'>모두 지우기</button></div><canvas id='drawPad' width='520' height='150'></canvas></div>";
    html += "<p id='fb' class='fb' aria-live='polite'></p>";
    box.innerHTML = html;
    var btn = document.getElementById("sendBtn");
    btn.addEventListener("click", check);
    if (window.G3Pad) {
      if (window.G3Pad.mountKeypad) window.G3Pad.mountKeypad("padKeypad", "ans");
      if (window.G3Pad.mountCanvas) window.G3Pad.mountCanvas("drawPad", "drawClear", "penTools");
    }
    if (window.G3Visuals && window.G3Visuals.mount) {
      var qwrap = box.querySelector("[data-qvis-wrap]");
      if (qwrap) window.G3Visuals.mount(qwrap, cur.house, cur.lid, item);
    }
    var hbtn = document.getElementById("stepHintBtn");
    var hbox = document.getElementById("stepHintBox");
    var shownSteps = 0;
    if (hbtn && hbox) {
      hbtn.addEventListener("click", function () {
        if (shownSteps < steps.length) {
          var sdiv = document.createElement("div");
          sdiv.className = "step-item";
          sdiv.textContent = (shownSteps + 1) + "단계 · " + steps[shownSteps];
          hbox.appendChild(sdiv);
          shownSteps++;
          hbtn.textContent = shownSteps >= steps.length ? "힌트 모두 펼침 (" + shownSteps + "/" + steps.length + ")" : "힌트 한 단계씩 보기 (" + shownSteps + "/" + steps.length + ")";
          if (shownSteps >= steps.length) hbtn.disabled = true;
        }
      });
    }
  var ansInput = document.getElementById("ans");
  if (ansInput) {
    ansInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        check();
      }
    });
    try { ansInput.setAttribute("inputmode", "decimal"); } catch (e) {}
    ansInput.focus();
  }
    if (state.mode === "star") {
      var tbar = document.querySelector("#dlgBody .hint-row");
      if (tbar) {
        var sp = document.createElement("span");
        sp.id = "starTimer";
        sp.className = "relay-timer";
        tbar.appendChild(sp);
      }
      startStarTimer();
    }
  }
  function normAns(s) {
    s = String(s == null ? "" : s).trim().replace(/[^0-9.]/g, "");
    if (!s) return "";
    if (s.indexOf(".") >= 0) {
      var parts = s.split(".");
      var head = parts[0].replace(/^0+(?=\d)/, "") || "0";
      var tail = (parts.slice(1).join("")).replace(/0+$/, "");
      return tail ? (head + "." + tail) : head;
    }
    return s.replace(/^0+(?=\d)/, "");
  }
  function check() {
    var cur = activeItem();
    var item = cur.item;
    var raw = document.getElementById("ans").value;
    var v = normAns(raw);
    var fb = document.getElementById("fb");
    if (!v) { fb.textContent = "숫자를 입력해 주세요."; return; }
    if (v === normAns(item.a)) {
      var rate = state.tries === 0 ? 1 : (state.tries === 1 ? 0.6 : 0.3);
      if (state.tries === 0) state.firstOk++;
      if (window.G3Adapt && window.G3Adapt.record) window.G3Adapt.record(state.tries === 0);
      try {
        if (window.G3Understand && window.G3Tags) {
          window.G3Understand.record(window.G3Tags.forQuestion(cur.house, cur.lid, item), state.tries === 0);
        }
      } catch (e) {}
      var gain = Math.round(10 * rate);
      if (window.G3Pet && window.G3Pet.festMult) gain = gain * window.G3Pet.festMult();
      if (state.mode === "boss" && window.G3Pet && window.G3Pet.comboBar) {
        var _cb = window.G3Store.load();
        var _pc = (_cb.pet && _cb.pet.combo) || 0;
        if (_pc >= TB("bossDoubleFrom", 2)) gain = gain * 2;
      }
      var d = window.G3Store.load();
      d.stars += gain;
      if (state.mode === "wrong") {
        var gone = (cur.item && cur.item.origQ) || item.q;
        d.wrong = d.wrong.filter(function (w) { return w.q !== gone && w.q !== item.q; });
      }
      window.G3Store.save(d);
      var petRes = window.G3Pet ? window.G3Pet.onSolve(true) : null;
      if (window.G3UI) { window.G3UI.stars(); if (window.G3UI.sfx) window.G3UI.sfx("ok"); }
      if (window.G3Journal) window.G3Journal.render();
      var feverTxt = (petRes && petRes.fever) ? " 🌟 FEVER +" + petRes.combo + "콤보!" : "";
      if (window.G3UI && window.G3UI.comboN) window.G3UI.comboN(petRes ? petRes.combo : 0);
      var bossTxt = "";
      if (state.mode === "boss") {
        state.bossHp = Math.max(0, (state.bossHp == null ? TB("bossHp", 3) : state.bossHp) - 1);
        bossTxt = " ⚡ 수호자에게 마법 별빛! (남은 HP " + state.bossHp + "/" + TB("bossHp", 3) + ")";
      }
      fb.textContent = "맞았습니다! 별 +" + gain + feverTxt + bossTxt + " · " + item.steps.join(" → ");
      setTimeout(next, 1300);
    } else {
      state.tries++;
      if (window.G3Pet) window.G3Pet.onSolve(false);
      if (window.G3UI && window.G3UI.sfx) window.G3UI.sfx("no");
      if (state.tries >= 3) {
        if (window.G3Adapt && window.G3Adapt.record) window.G3Adapt.record(false);
        if (state.mode === "unit") {
          var d2 = window.G3Store.load();
          var wt = null;
          try { wt = (window.G3Tags && window.G3Tags.forQuestion(cur.house, cur.lid, item)) || null; } catch (e) { wt = null; }
          d2.wrong.push({ lesson: cur.lid, q: item.q, tag: wt ? wt.id : "", tagName: wt ? wt.name : "", house: cur.house, at: Date.now() });
          window.G3Store.save(d2);
          if (window.G3Journal) window.G3Journal.render();
        }
        fb.textContent = "세 번 다르게 적었구나. 풀이: " + item.steps.join(" → ") + " 다음 문제로 넘어간다.";
        setTimeout(next, 2100);
      } else {
        fb.textContent = "아쉬워요! 다시 계산해 보세요. 힌트: " + (item.steps[0] || "천천히 다시 계산해 보자") + " (" + state.tries + "/3)";
        var ansEl = document.getElementById("ans");
        if (ansEl) { ansEl.value = ""; ansEl.focus(); }
      }
    }
  }
  function startBoss() {
    if (!window.G3Pad || !window.G3Pad.generateSet) return;
    var gen = window.G3Pad.generateSet(state.house).slice(0, TB("bossTotal", 5));
    var U = curUnit();
    var b = bossFor(state.house);
    state.mode = "boss";
    state.customTitle = U.name + " · ⚡ " + b.name + " 대결";
    state.customList = [];
    for (var i = 0; i < gen.length; i++) {
      state.customList.push({ q: gen[i].q, a: gen[i].a, steps: gen[i].steps, house: state.house, lid: "boss" });
    }
    state.qi = 0; state.tries = 0; state.firstOk = 0; state.total = state.customList.length;
    state.bossHp = TB("bossHp", 3);
    npcSay(b.name + "이(가) 나타났다! " + TB("bossTotal", 5) + "문제 중 첫 시도 " + TB("bossWinAt", 3) + "문제를 맞히면 승리! 콤보가 터지면 별 2배!");
    renderQ();
  }
  var starTimerId = null;
  function stopStarTimer() {
    if (starTimerId) { clearInterval(starTimerId); starTimerId = null; }
  }
  function startStarTimer() {
    stopStarTimer();
    var left = TB("starSecs", 20);
    state.starLeft = left;
    paintStarTimer();
    var qiAt = state.qi, triesAt = state.tries;
    starTimerId = setInterval(function () {
      if (state.mode !== "star" || state.qi !== qiAt) { stopStarTimer(); return; }
      state.starLeft -= 1;
      paintStarTimer();
      if (state.starLeft <= 0) {
        stopStarTimer();
        var fb = document.getElementById("fb");
        var cur = null;
        try { cur = activeItem().item; } catch (e) {}
        if (fb && cur && state.tries === triesAt) {
          state.tries = 3;
          fb.textContent = "시간 초과! 풀이: " + (cur.steps || []).join(" → ") + " 다음 문제로 넘어간다.";
          if (window.G3Pet) window.G3Pet.onSolve(false);
          setTimeout(next, 1800);
        }
      }
    }, 1000);
  }
  function paintStarTimer() {
    var el = document.getElementById("starTimer");
    if (el) {
      el.textContent = "⏱️ " + state.starLeft + "초";
      el.classList.toggle("urgent", state.starLeft <= 5);
    }
  }
  function startStar(i) {
    if (!window.G3Pad || !window.G3Pad.generateSet) return;
    var U = curUnit();
    var L = U.lessons[i];
    if (!L || !window.G3Store.load().done[L.id]) return;
    var gen = window.G3Pad.generateSet(state.house).slice(0, TB("starTotal", 5));
    state.mode = "star";
    state.starLid = L.id;
    state.starIdx = i;
    state.customTitle = U.name + " · 👑 " + L.title.split(" · ")[0] + " 도전왕";
    state.customList = [];
    for (var k = 0; k < gen.length; k++) {
      state.customList.push({ q: gen[k].q, a: gen[k].a, steps: gen[k].steps, house: state.house, lid: "star" });
    }
    state.qi = 0; state.tries = 0; state.firstOk = 0; state.total = state.customList.length;
    npcSay("도전왕 모드! 문제당 " + TB("starSecs", 20) + "초! " + TB("starWinAt", 4) + "문제를 첫 시도에 맞히면 ★★★!");
    renderQ();
  }
  function finishStar() {
    stopStarTimer();
    var win = state.firstOk >= TB("starWinAt", 4);
    var d = window.G3Store.load();
    if (!d.stars2) d.stars2 = {};
    if (win) {
      d.stars2[state.starLid] = 3;
      d.stars = (d.stars || 0) + TB("starWinStars", 20);
      if (window.G3Journal) window.G3Journal.log("도전왕", state.customTitle + " 정복! (" + state.firstOk + "/" + state.total + "), 별 +" + TB("starWinStars", 20));
    }
    if (window.G3Pet) window.G3Pet.mark("play");
    window.G3Store.save(d);
    if (window.G3UI) { window.G3UI.stars(); if (window.G3UI.sfx) window.G3UI.sfx(win ? "fanfare" : "no"); }
    if (win && window.G3Confetti) window.G3Confetti.burst();
    document.getElementById("dlgBody").innerHTML = "<h3>" + (win ? "👑 도전왕 등극! ★★★" : "😿 아깝다! ★★☆에 머물렀다") + "</h3>"
      + "<p>첫 시도 성공 " + state.firstOk + "/" + state.total + "문제! " + (win ? "별 +" + TB("starWinStars", 20) + " 획득!" : "다시 도전해 보자!") + "</p>"
      + "<div class='lessons'><button class='lesson btn-pulse' data-star-retry='1'>👑 다시 도전하기</button><button class='lesson' data-back='1'>차시 목록으로</button></div>";
  }
  function next() {
    stopStarTimer();
    var cur = activeItem();
    state.qi++; state.tries = 0;
    if (state.qi >= cur.len) {
      if (state.mode === "unit") finish(curUnit(), curUnit().lessons[state.lesson]);
      else if (state.mode === "boss") finishBoss();
      else if (state.mode === "star") finishStar();
      else finishCustom();
    } else renderQ();
  }
  function finishBoss() {
    var win = state.firstOk >= TB("bossWinAt", 3);
    var b = bossFor(state.house);
    if (win) {
      if (window.G3Pet) window.G3Pet.bossWin(state.house);
      if (window.G3Pet) window.G3Pet.mark("play");
      var d = window.G3Store.load();
      if (window.G3Journal) window.G3Journal.log("보스", b.name + " 격파! (" + state.firstOk + "/" + state.total + "), 별 +" + TB("bossStars", 25) + "·씨앗 +" + TB("bossSeeds", 2) + "·🌈무지개씨앗 +" + TB("bossRainbow", 1));
      if (window.G3Journal) window.G3Journal.render();
    } else {
      var d0 = window.G3Store.load();
      d0.stars = (d0.stars || 0) + TB("bossConsolation", 5);
      window.G3Store.save(d0);
      if (window.G3UI) window.G3UI.stars();
      if (window.G3Pet) window.G3Pet.mark("play");
      if (window.G3Journal) window.G3Journal.log("보스", b.name + "에게 아깝게 패배 (" + state.firstOk + "/" + state.total + "). 위로 별 +" + TB("bossConsolation", 5) + "! 다시 도전!");
    }
    if (window.G3Confetti && win) window.G3Confetti.burst();
    if (window.G3UI && window.G3UI.sfx) window.G3UI.sfx(win ? "fanfare" : "no");
    document.getElementById("dlgBody").innerHTML = "<h3>" + (win ? "🏆 " + b.name + " 격파!" : "😿 아깝다! " + b.name + "이(가) 버텼다") + "</h3>"
      + "<p>첫 시도 성공 " + state.firstOk + "/" + state.total + "문제! " + (win ? "수호자 트로피·별 +" + TB("bossStars", 25) + "·씨앗 +" + TB("bossSeeds", 2) + "·🌈무지개 씨앗 +" + TB("bossRainbow", 1) + " 획득!" : "도전 위로 별 +" + TB("bossConsolation", 5) + "! " + TB("bossWinAt", 3) + "문제를 첫 시도에 맞히면 승리! 다시 도전해 보자!") + "</p>"
      + "<div class='lessons'><button class='lesson btn-pulse' data-boss='1'>⚡ 다시 대결하기</button><button class='lesson' data-back='1'>차시 목록으로</button></div>";
  }
  function finishCustom() {
    var d = window.G3Store.load();
    var bonusMsg = "헷갈리던 문제를 훌륭히 정복했어요!";
    if (state.mode === "daily") {
      d.stars += 15; d.seeds += 1;
      window.G3Store.save(d);
      if (window.G3UI) window.G3UI.stars();
      if (window.G3Journal) window.G3Journal.log("도전", "오늘의 도전 완료 (" + state.firstOk + "/" + state.total + "), 별 +15·씨앗 +1");
      bonusMsg = "보너스 별 15개와 씨앗 1개를 받았습니다.";
    } else if (state.mode === "infinite") {
      d.stars += 10; d.seeds += 1;
      window.G3Store.save(d);
      if (window.G3UI) window.G3UI.stars();
      if (window.G3Journal) window.G3Journal.log("무한연습", state.customTitle + " 완료 (" + state.firstOk + "/" + state.total + "), 별 +10·씨앗 +1");
      bonusMsg = "보너스 별 10개와 씨앗 1개를 받았습니다. 숫자를 바꿔 또 연습할 수 있어요!";
    } else if (state.mode === "focus") {
      d.stars += 12; d.seeds += 1;
      window.G3Store.save(d);
      if (window.G3UI) window.G3UI.stars();
      if (window.G3Journal) window.G3Journal.log("집중연습", state.customTitle + " 완료 (" + state.firstOk + "/" + state.total + "), 별 +12·씨앗 +1");
      bonusMsg = "보너스 별 12개와 씨앗 1개를 받았습니다. 약한 개념을 다시 풀어 보았어요!";
    } else {
      if (window.G3Journal) window.G3Journal.log("오답교실", "오답 노트 다시 풀기 완료 (" + state.firstOk + "/" + state.total + ")");
    }
    if (window.G3Pet) window.G3Pet.mark("play");
    if (window.G3Confetti) window.G3Confetti.burst();
    if (window.G3UI && window.G3UI.sfx) window.G3UI.sfx("fanfare");
    var againBtn = state.mode === "infinite" ? "<button class='lesson btn-pulse' data-infinite='1'>🎲 숫자 바꿔 한 번 더 연습</button>" : (state.mode === "focus" ? "<button class='lesson btn-pulse' data-open-focus='1'>🧭 취약 개념 다시 모아 풀기</button>" : "");    document.getElementById("dlgBody").innerHTML = "<h3>" + state.customTitle + " 완료!</h3>"
      + "<p>첫 시도 성공 " + state.firstOk + "/" + state.total + "문제! " + bonusMsg + "</p>"
      + "<div class='lessons'>" + againBtn + "<button class='lesson btn-pulse' data-close-dlg='1'>마을로 돌아가기</button></div>";
  }
  function finish(U, L) {
    var d = window.G3Store.load();
    var first = !d.done[L.id];
    d.done[L.id] = { ok: state.firstOk, total: state.total, at: Date.now() };
    if (!d.stars2) d.stars2 = {};
    if (first) { d.seeds += 2; d.stars2[L.id] = Math.max(d.stars2[L.id] || 0, 1); }
    var perfect = state.firstOk >= state.total && state.total > 0;
    if (perfect) {
      if (!d.pet) d.pet = {};
      d.pet.rainbow = (d.pet.rainbow || 0) + 1;
      d.stars2[L.id] = Math.max(d.stars2[L.id] || 0, 2);
      if (window.G3Pet && window.G3Pet.notePerfect) {
        window.G3Store.save(d);
        window.G3Pet.notePerfect();
        d = window.G3Store.load();
      }
    }
    window.G3Store.save(d);
    if (window.G3Pet) window.G3Pet.mark("lesson");
    if (window.G3UI) { window.G3UI.stars(); if (window.G3UI.sfx) window.G3UI.sfx("fanfare"); }
    if (window.G3Farm) window.G3Farm.onLesson(first);
    if (window.G3Journal) window.G3Journal.log("학습", U.name + " " + L.title + " 완료 " + state.firstOk + "/" + state.total + (perfect ? " · 🌈무지개 씨앗 +1!" : ""));
    if (window.G3Quests) window.G3Quests.poke();
    npcSay(U.greet);
    var recBtn = (d.wrong && d.wrong.length)
      ? "<button class='lesson btn-pulse' data-open-wrong='1'>추천 갈래 · 오답 노트 교실 풀기 (" + d.wrong.length + "문항)</button>"
      : "<button class='lesson btn-pulse' data-open-daily='1'>추천 갈래 · 심화 오늘의 도전 풀기</button>";
    var boss = bossFor(state.house);
    document.getElementById("dlgBody").innerHTML = "<h3>차시를 마쳤습니다</h3>"
      + "<p>첫 성공 " + state.firstOk + "/" + state.total + ". " + (first ? "처음 끝낸 차시라 씨앗 2개를 받았다." : "복습을 마쳤다.") + (perfect ? " 실수 없이 다 맞춰 🌈 무지개 씨앗 +1!" : "") + "</p>"
      + "<div class='lessons'>" + recBtn + "<button class='lesson boss-btn btn-pulse' data-boss='1'>⚡ " + boss.emoji + " " + boss.name + "에게 대결 신청!</button><button class='lesson' data-back='1'>차시 목록으로</button></div>";
  }
  document.addEventListener("click", function (e) {
    var t = e.target.closest ? e.target.closest("[data-lesson],[data-back],[data-open-wrong],[data-open-daily],[data-open-focus],[data-close-dlg],[data-infinite],[data-boss],[data-star],[data-star-retry],[data-open-wrong-forest]") : null;
    if (!t) return;
    if (t.hasAttribute("data-lesson")) startLesson(parseInt(t.getAttribute("data-lesson"), 10));
    else     if (t.hasAttribute("data-open-wrong")) openWrong();
    else if (t.hasAttribute("data-open-wrong-forest")) {
      try {
        if (window.G3UI) window.G3UI.toast("오답 숲은 '오답 교실'에서 자동 복습으로 이어져요.");
      } catch(e){}
      openWrong();
    }
    else if (t.hasAttribute("data-open-daily")) openDaily();
    else if (t.hasAttribute("data-open-focus")) openFocus();
    else if (t.hasAttribute("data-infinite")) openInfinite();
    else if (t.hasAttribute("data-boss")) startBoss();
    else if (t.hasAttribute("data-star")) startStar(parseInt(t.getAttribute("data-star"), 10));
    else if (t.hasAttribute("data-star-retry")) startStar(state.starIdx || 0);
    else if (t.hasAttribute("data-close-dlg")) close();
    else renderLessons();
  });
  var x = document.getElementById("dlgClose");
  if (x) x.addEventListener("click", close);
  window.G3Dlg = { open: open, close: close, openWrong: openWrong, openDaily: openDaily, openInfinite: openInfinite, openFocus: openFocus, openBoss: startBoss };
})();
