(function () {
  var state = { mode: "unit", house: "mul", lesson: 0, qi: 0, tries: 0, firstOk: 0, total: 0, customList: null, customTitle: "" };
  var PORTRAIT = {
    mul: "../assets/img/flow/house-mul.jpg", divi: "../assets/img/flow/house-divi.jpg",
    circ: "../assets/img/flow/house-circ.jpg", frac: "../assets/img/flow/house-frac.jpg",
    mea: "../assets/img/flow/house-mea.jpg", gra: "../assets/img/flow/house-gra.jpg"
  };
  var NPC_IMG = { mul: "npc-mole", divi: "npc-chick", circ: "npc-bunny", frac: "npc-mole", mea: "npc-chick", gra: "npc-bunny" };
  function curUnit() {
    var u = window.G3Units && window.G3Units[state.house];
    return u || (window.G3Units ? window.G3Units.mul : { name: "곱셈 방앗간", greet: "어서 오렴!", lessons: window.G3Mul.lessons });
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
  function open(houseId) {
    state.mode = "unit";
    state.house = (window.G3Units && window.G3Units[houseId]) ? houseId : "mul";
    showModal(NPC_IMG[state.house]);
    renderLessons();
  }
  function openWrong() {
    var d = window.G3Store.load();
    if (!d.wrong || !d.wrong.length) {
      if (window.G3UI) window.G3UI.toast("보관된 오답이 없습니다! 모든 문제를 잘 풀었어요.");
      return;
    }
    state.mode = "wrong";
    state.customTitle = "오답 노트 교실";
    state.customList = [];
    for (var i = 0; i < d.wrong.length; i++) {
      var found = findQuestion(d.wrong[i].q);
      state.customList.push({ q: found.item.q, a: found.item.a, steps: found.item.steps, house: found.house, lid: found.lid, wrongIdx: i });
    }
    state.qi = 0; state.tries = 0; state.firstOk = 0; state.total = state.customList.length;
    showModal("npc-bunny");
    npcSay("아까 헷갈렸던 문제를 그림과 함께 천천히 다시 풀어 보자!");
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
  function openInfinite() {
    if (!window.G3Pad || !window.G3Pad.generateSet) return;
    var gen = window.G3Pad.generateSet(state.house);
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
    var html = "<img class='houseimg' src='" + (PORTRAIT[state.house] || PORTRAIT.mul) + "' alt='" + U.name + " 그림'><h3>" + U.name + " · 차시 목록</h3><div class='lessons'>";
    var L = U.lessons;
    for (var i = 0; i < L.length; i++) {
      var done = d.done[L[i].id] ? " · 완료" : "";
      html += "<button class='lesson btn-pulse' data-lesson='" + i + "'>" + L[i].title + done + "</button>";
    }
    html += "</div><p class='hint'>기본 차시는 문제 6개, 실생활 문장제 차시는 4개입니다. 처음 끝내는 차시마다 씨앗 2개를 받습니다.</p>";
    html += "<button class='lesson btn-pulse' data-infinite='1'>🎲 숫자 바꿔 무한 연습하기 (6문제)</button>";
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
    var html = "<p class='crumb'>" + cur.title + " · " + (state.qi + 1) + "/" + cur.len + "</p>";
    html += "<div class='qvis-wrap' data-qvis-wrap>" + vis + "</div>";
    html += "<p class='q'>" + item.q + "</p>";
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
    document.getElementById("ans").addEventListener("keydown", function (e) { if (e.key === "Enter") check(); });
    document.getElementById("ans").focus();
  }
  function check() {
    var cur = activeItem();
    var item = cur.item;
    var v = document.getElementById("ans").value.replace(/[^0-9]/g, "");
    var fb = document.getElementById("fb");
    if (!v) { fb.textContent = "숫자를 입력해 주세요."; return; }
    if (v === item.a) {
      var rate = state.tries === 0 ? 1 : (state.tries === 1 ? 0.6 : 0.3);
      if (state.tries === 0) state.firstOk++;
      var gain = Math.round(10 * rate);
      var d = window.G3Store.load();
      d.stars += gain;
      if (state.mode === "wrong") {
        d.wrong = d.wrong.filter(function (w) { return w.q !== item.q; });
      }
      window.G3Store.save(d);
      if (window.G3UI) { window.G3UI.stars(); if (window.G3UI.sfx) window.G3UI.sfx("ok"); }
      if (window.G3Journal) window.G3Journal.render();
      fb.textContent = "맞았습니다! 별 +" + gain + " · " + item.steps.join(" → ");
      setTimeout(next, 1300);
    } else {
      state.tries++;
      if (window.G3UI && window.G3UI.sfx) window.G3UI.sfx("no");
      if (state.tries >= 3) {
        if (state.mode === "unit") {
          var d2 = window.G3Store.load();
          d2.wrong.push({ lesson: cur.lid, q: item.q, at: Date.now() });
          window.G3Store.save(d2);
          if (window.G3Journal) window.G3Journal.render();
        }
        fb.textContent = "세 번 다르게 적었구나. 풀이: " + item.steps.join(" → ") + " 다음 문제로 넘어간다.";
        setTimeout(next, 2100);
      } else {
        fb.textContent = "힌트: " + (item.steps[0] || "천천히 다시 계산해 보자") + " (" + state.tries + "/3)";
      }
    }
  }
  function next() {
    var cur = activeItem();
    state.qi++; state.tries = 0;
    if (state.qi >= cur.len) {
      if (state.mode === "unit") finish(curUnit(), curUnit().lessons[state.lesson]);
      else finishCustom();
    } else renderQ();
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
    } else {
      if (window.G3Journal) window.G3Journal.log("오답교실", "오답 노트 다시 풀기 완료 (" + state.firstOk + "/" + state.total + ")");
    }
    if (window.G3Confetti) window.G3Confetti.burst();
    if (window.G3UI && window.G3UI.sfx) window.G3UI.sfx("fanfare");
    var againBtn = state.mode === "infinite" ? "<button class='lesson btn-pulse' data-infinite='1'>🎲 숫자 바꿔 한 번 더 연습</button>" : "";
    document.getElementById("dlgBody").innerHTML = "<h3>" + state.customTitle + " 완료!</h3>"
      + "<p>첫 시도 성공 " + state.firstOk + "/" + state.total + "문제! " + bonusMsg + "</p>"
      + "<div class='lessons'>" + againBtn + "<button class='lesson btn-pulse' data-close-dlg='1'>마을로 돌아가기</button></div>";
  }
  function finish(U, L) {
    var d = window.G3Store.load();
    var first = !d.done[L.id];
    d.done[L.id] = { ok: state.firstOk, total: state.total, at: Date.now() };
    if (first) { d.seeds += 2; }
    window.G3Store.save(d);
    if (window.G3UI) { window.G3UI.stars(); if (window.G3UI.sfx) window.G3UI.sfx("fanfare"); }
    if (window.G3Farm) window.G3Farm.onLesson(first);
    if (window.G3Journal) window.G3Journal.log("학습", U.name + " " + L.title + " 완료 " + state.firstOk + "/" + state.total);
    if (window.G3Quests) window.G3Quests.poke();
    npcSay(U.greet);
    var recBtn = (d.wrong && d.wrong.length)
      ? "<button class='lesson btn-pulse' data-open-wrong='1'>추천 갈래 · 오답 노트 교실 풀기 (" + d.wrong.length + "문항)</button>"
      : "<button class='lesson btn-pulse' data-open-daily='1'>추천 갈래 · 심화 오늘의 도전 풀기</button>";
    document.getElementById("dlgBody").innerHTML = "<h3>차시를 마쳤습니다</h3>"
      + "<p>첫 성공 " + state.firstOk + "/" + state.total + ". " + (first ? "처음 끝낸 차시라 씨앗 2개를 받았다." : "복습을 마쳤다.") + "</p>"
      + "<div class='lessons'>" + recBtn + "<button class='lesson' data-back='1'>차시 목록으로</button></div>";
  }
  document.addEventListener("click", function (e) {
    var t = e.target.closest ? e.target.closest("[data-lesson],[data-back],[data-open-wrong],[data-open-daily],[data-close-dlg],[data-infinite]") : null;
    if (!t) return;
    if (t.hasAttribute("data-lesson")) startLesson(parseInt(t.getAttribute("data-lesson"), 10));
    else if (t.hasAttribute("data-open-wrong")) openWrong();
    else if (t.hasAttribute("data-open-daily")) openDaily();
    else if (t.hasAttribute("data-infinite")) openInfinite();
    else if (t.hasAttribute("data-close-dlg")) close();
    else renderLessons();
  });
  var x = document.getElementById("dlgClose");
  if (x) x.addEventListener("click", close);
  window.G3Dlg = { open: open, close: close, openWrong: openWrong, openDaily: openDaily, openInfinite: openInfinite };
})();
