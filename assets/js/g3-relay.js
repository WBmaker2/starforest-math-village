(function () {
  // 모둠 릴레이 퀴즈쇼 (칠판 호스트용).
  // 점수는 이 기기에만 저장되며, 학생 개인 기기에는 반영되지 않습니다.
  // 페이지를 새로고침하면 진행 중인 게임은 사라집니다.
  var game = null;
  var timerId = null;
  function toast(m) { if (window.G3UI) window.G3UI.toast(m); }
  function houses() {
    try {
      var u = window.G3Units || {};
      var out = [];
      for (var k in u) out.push({ id: k, name: u[k].name || k });
      return out;
    } catch (e) { return []; }
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
  function poolFor(house, need) {
    var out = [];
    var guard = 0;
    while (out.length < need && guard < 12) {
      guard++;
      var gen = (window.G3Pad && window.G3Pad.generateSet) ? window.G3Pad.generateSet(house) : [];
      for (var i = 0; i < gen.length && out.length < need; i++) {
        out.push({ q: gen[i].q, a: gen[i].a, steps: gen[i].steps });
      }
    }
    return out;
  }
  function stopTimer() {
    if (timerId) { clearInterval(timerId); timerId = null; }
  }
  function startTimer(sec) {
    stopTimer();
    game.left = sec;
    paintTimer();
    timerId = setInterval(function () {
      if (!game) { stopTimer(); return; }
      game.left -= 1;
      paintTimer();
      if (game.left <= 0) {
        stopTimer();
        resolveTurn(null, true);
      }
    }, 1000);
  }
  function paintTimer() {
    var el = document.getElementById("relayTimer");
    if (el && game) {
      el.textContent = "⏱️ " + game.left + "초";
      el.classList.toggle("urgent", game.left <= 5);
    }
  }
  function setupHtml() {
    var hs = houses();
    var opts = "";
    for (var i = 0; i < hs.length; i++) {
      opts += "<option value='" + hs[i].id + "'>" + hs[i].name + "</option>";
    }
    return "<div class='relay-sec'><b>🏁 모둠 릴레이 퀴즈쇼 (칠판용)</b>"
      + "<p class='hint'>모둠이 돌아가며 문제를 풀어요. 점수는 이 칠판 기기에만 저장됩니다.</p>"
      + "<div class='relay-row'><span>모둠 수</span><span id='relayTeams'>"
      + "<button type='button' data-rset-team='2' class='sel'>2모둠</button>"
      + "<button type='button' data-rset-team='3'>3모둠</button>"
      + "<button type='button' data-rset-team='4'>4모둠</button></span></div>"
      + "<div class='relay-row'><span>모둠당 문제</span><span id='relayRounds'>"
      + "<button type='button' data-rset-round='3'>3문제</button>"
      + "<button type='button' data-rset-round='5' class='sel'>5문제</button>"
      + "<button type='button' data-rset-round='7'>7문제</button></span></div>"
      + "<div class='relay-row'><span>단원 집</span><select id='relayHouse' aria-label='릴레이 단원 집'>" + opts + "</select></div>"
      + "<div class='prow'><button type='button' class='go btn-pulse' data-relay-start='1'>🏁 릴레이 시작하기</button></div></div>";
  }
  function scoreHtml() {
    var html = "<div class='relay-score'>";
    for (var i = 0; i < game.teams; i++) {
      html += "<span class='rteam" + (i === game.turn % game.teams ? " now" : "") + "'>"
        + (i + 1) + "모둠 <b>" + game.scores[i] + "</b>점</span>";
    }
    return html + "</div>";
  }
  function turnHtml() {
    var q = game.pool[game.qi];
    var team = (game.turn % game.teams) + 1;
    return scoreHtml()
      + "<div class='relay-turn'><b>" + team + "모둠 차례! (" + (game.qi + 1) + "/" + game.pool.length + ")</b>"
      + "<span id='relayTimer' class='relay-timer'>⏱️ " + game.left + "초</span></div>"
      + "<p class='q'>" + q.q + "</p>"
      + "<div class='ansrow'><input id='relayAns' inputmode='none' placeholder='키패드로 답 입력' aria-label='릴레이 답 입력' readonly>"
      + "<button id='relaySend' class='go btn-pulse' type='button'>정답 확인</button></div>"
      + "<div id='relayPad' class='keypad-grid' aria-label='릴레이 숫자 키패드'></div>"
      + "<p id='relayFb' class='fb' aria-live='polite'></p>"
      + "<div class='prow'><button type='button' class='mini-act' data-relay-quit='1'>그만하기 (점수 버리기)</button></div>";
  }
  function paintTurn() {
    var box = document.getElementById("relayBox");
    if (!box || !game) return;
    box.innerHTML = turnHtml();
    if (window.G3Pad && window.G3Pad.mountKeypad) window.G3Pad.mountKeypad("relayPad", "relayAns");
    var send = document.getElementById("relaySend");
    if (send) send.addEventListener("click", function () {
      var inp = document.getElementById("relayAns");
      resolveTurn(inp ? inp.value : "", false);
    });
    startTimer(game.secs);
  }
  function resolveTurn(raw, timeout) {
    if (!game) return;
    stopTimer();
    var q = game.pool[game.qi];
    var team = (game.turn % game.teams) + 1;
    var ok = !timeout && normAns(raw) === normAns(q.a);
    var fb = document.getElementById("relayFb");
    if (ok) {
      game.scores[team - 1] += 1;
      if (window.G3UI && window.G3UI.sfx) window.G3UI.sfx("ok");
      if (fb) fb.textContent = "정답! " + team + "모둠 +1점! (" + q.steps.join(" → ") + ")";
    } else {
      if (window.G3UI && window.G3UI.sfx) window.G3UI.sfx("no");
      if (fb) fb.textContent = timeout
        ? ("시간 초과! 정답은 " + q.a + " (" + q.steps.join(" → ") + ")")
        : ("땡! 정답은 " + q.a + " (" + q.steps.join(" → ") + ")");
    }
    var send = document.getElementById("relaySend");
    if (send) send.disabled = true;
    setTimeout(function () {
      if (!game) return;
      game.qi += 1;
      game.turn += 1;
      if (game.qi >= game.pool.length) finishGame();
      else paintTurn();
    }, 1600);
  }
  function saveHistory() {
    try {
      var key = "starforest-relay";
      var arr = [];
      try { arr = JSON.parse(localStorage.getItem(key) || "[]"); } catch (e) { arr = []; }
      if (!arr || !arr.length) arr = [];
      arr.unshift({ at: Date.now(), teams: game.teams, scores: game.scores.slice(), house: game.houseName || "" });
      arr = arr.slice(0, 5);
      localStorage.setItem(key, JSON.stringify(arr));
    } catch (e) {}
  }
  function loadHistory() {
    try {
      var arr = JSON.parse(localStorage.getItem("starforest-relay") || "[]");
      return (arr && arr.length) ? arr : [];
    } catch (e) { return []; }
  }
  function finishGame() {
    stopTimer();
    saveHistory();
    var best = 0, winners = [];
    for (var i = 0; i < game.teams; i++) {
      if (game.scores[i] > best) { best = game.scores[i]; winners = [i + 1]; }
      else if (game.scores[i] === best) winners.push(i + 1);
    }
    var box = document.getElementById("relayBox");
    var winTxt = winners.length === 1
      ? ("🏆 " + winners[0] + "모둠 우승!")
      : ("🤝 " + winners.join("모둠·") + "모둠 공동 우승!");
    if (window.G3Journal) window.G3Journal.log("릴레이", winTxt + " (" + game.scores.join(":") + ")");
    if (window.G3Confetti) window.G3Confetti.burst();
    if (window.G3UI && window.G3UI.sfx) window.G3UI.sfx("fanfare");
    if (box) {
      box.innerHTML = scoreHtml()
        + "<h3>" + winTxt + "</h3>"
        + "<p>최종 점수 " + game.scores.join(" : ") + " (모둠 순서대로)</p>"
        + "<div class='prow'><button type='button' class='go btn-pulse' data-relay-start='1'>🏁 한 번 더 하기</button>"
        + "<button type='button' class='mini-act' data-relay-setup='1'>설정으로 돌아가기</button></div>";
    }
    game = null;
  }
  function startGame() {
    var hs = document.getElementById("relayHouse");
    var house = hs ? hs.value : null;
    if (!house) { toast("단원 집을 골라 주세요."); return; }
    var teams = game && game.teams ? game.teams : 2;
    var rounds = game && game.rounds ? game.rounds : 5;
    var tb = document.querySelector("#relayTeams .sel");
    var rb = document.querySelector("#relayRounds .sel");
    if (tb) teams = parseInt(tb.getAttribute("data-rset-team"), 10) || 2;
    if (rb) rounds = parseInt(rb.getAttribute("data-rset-round"), 10) || 5;
    var pool = poolFor(house, teams * rounds);
    if (!pool.length) { toast("문제를 만들지 못했어요. 다른 단원 집을 골라 주세요."); return; }
    var hsel = document.getElementById("relayHouse");
    var hname = "";
    if (hsel && hsel.options && hsel.selectedIndex >= 0) hname = hsel.options[hsel.selectedIndex].text;
    game = { teams: teams, rounds: rounds, pool: pool, qi: 0, turn: 0, secs: 30, left: 30, scores: [], houseName: hname };
    for (var i = 0; i < teams; i++) game.scores.push(0);
    paintTurn();
    toast("🏁 " + teams + "모둠 릴레이 시작! 1모둠부터 풀어 주세요.");
  }
  function render() {
    try {
      var play = document.getElementById("playSec");
      if (play && !document.getElementById("relayBox")) {
        var sec = document.createElement("div");
        sec.id = "relayBox";
        play.appendChild(sec);
      }
    } catch (e) {}
    var box = document.getElementById("relayBox");
    if (box && !game) box.innerHTML = setupHtml();
  }
  document.addEventListener("click", function (e) {
    var t = e.target.closest ? e.target.closest("[data-rset-team],[data-rset-round],[data-relay-start],[data-relay-setup],[data-relay-quit]") : null;
    if (!t) return;
    if (t.hasAttribute("data-rset-team") || t.hasAttribute("data-rset-round")) {
      var sibs = t.parentNode ? t.parentNode.querySelectorAll("button") : [];
      for (var i = 0; i < sibs.length; i++) sibs[i].classList.toggle("sel", sibs[i] === t);
    }
    else if (t.hasAttribute("data-relay-start")) startGame();
    else if (t.hasAttribute("data-relay-setup")) { stopTimer(); game = null; render(); }
    else if (t.hasAttribute("data-relay-quit")) { stopTimer(); game = null; render(); toast("릴레이를 마쳤어요."); }
  });
  var pendingHouse = null;
  function preset(house) {
    pendingHouse = house;
    render();
    try {
      var sel = document.getElementById("relayHouse");
      if (sel) {
        for (var i = 0; i < sel.options.length; i++) {
          if (sel.options[i].value === house) { sel.selectedIndex = i; break; }
        }
      }
    } catch (e) {}
  }
  var _origRender = render;
  render = function () {
    _origRender();
    if (pendingHouse) {
      try {
        var sel = document.getElementById("relayHouse");
        if (sel) {
          for (var i = 0; i < sel.options.length; i++) {
            if (sel.options[i].value === pendingHouse) { sel.selectedIndex = i; break; }
          }
        }
      } catch (e) {}
      pendingHouse = null;
    }
  };
  window.G3Relay = { render: render, history: loadHistory, preset: preset };
})();
