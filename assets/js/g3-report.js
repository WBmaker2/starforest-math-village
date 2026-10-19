(function () {
  var BASE_ORDER = [
    ["mul", "곱셈"], ["divi", "나눗셈"], ["circ", "원"],
    ["frac", "분수"], ["mea", "들이·무게"], ["gra", "그림그래프"]
  ];
  function UNIT_ORDER() {
    if (window.GRADE_UNIT_ORDER && window.GRADE_UNIT_ORDER.length) return window.GRADE_UNIT_ORDER;
    try {
      var u = window.G3Units || {};
      var keys = Object.keys(u);
      if (keys.length && !(keys.length === 6 && u.mul)) {
        var out = [];
        for (var i = 0; i < keys.length; i++) {
          var nm = (u[keys[i]].name || keys[i]).replace(/.*·\s*/, "").slice(0, 6);
          out.push([keys[i], nm || keys[i]]);
        }
        return out;
      }
    } catch (e) {}
    return BASE_ORDER;
  }
  function gradeLabel() {
    try {
      if (window.STARFOREST_GRADE_LABEL) return window.STARFOREST_GRADE_LABEL;
      var g = (window.G3Store && window.G3Store.grade) ? window.G3Store.grade() : "g3";
      var map = { g1: "1학년", g2: "2학년", g3: "3학년", g4: "4학년", g5: "5학년", g6: "6학년" };
      return map[g] || "3학년";
    } catch (e) { return "3학년"; }
  }
  function toast(m) { if (window.G3UI) window.G3UI.toast(m); }
  function encodeSave(d) {
    try { return btoa(unescape(encodeURIComponent(JSON.stringify(d)))); } catch (e) { return ""; }
  }
  function decodeSave(str) {
    try { return JSON.parse(decodeURIComponent(escape(atob(str.trim())))); } catch (e) { return null; }
  }
  function rankTitle(doneCnt, cardsCnt) {
    var gl = gradeLabel();
    if (doneCnt >= 14 || cardsCnt >= 8) return gl + " 수학 보안관";
    if (doneCnt >= 7 || cardsCnt >= 4) return "멋진 마을 탐험가";
    if (doneCnt >= 1) return "부지런한 마을 친구";
    return "새싹 산책 주민";
  }
  function chartSvg(d) {
    var units = window.G3Units || {};
    var order = UNIT_ORDER();
    var out = "<svg class='unit-chart' viewBox='0 0 300 132' role='img' aria-label='단원별 학습 달성도'>";
    for (var i = 0; i < order.length; i++) {
      var id = order[i][0], label = order[i][1];
      var ls = (units[id] && units[id].lessons) || [];
      var tot = ls.length || 1, done = 0;
      for (var j = 0; j < ls.length; j++) if (d.done && d.done[ls[j].id]) done++;
      var pct = Math.round((done / tot) * 100);
      var barW = Math.max(6, Math.round(150 * (done / tot)));
      var y = 12 + i * 20;
      out += "<text x='8' y='" + (y + 11) + "' font-size='12' font-family='Jua' fill='#3E3428'>" + label + "</text>";
      out += "<rect x='76' y='" + y + "' width='150' height='12' rx='6' fill='#E6DFC9'/>";
      out += "<rect x='76' y='" + y + "' width='" + barW + "' height='12' rx='6' fill='#4FA85E'/>";
      out += "<text x='234' y='" + (y + 11) + "' font-size='11' fill='#7A6A55'>" + done + "/" + tot + " (" + pct + "%)</text>";
    }
    out += "</svg>";
    return out;
  }
  function render() {
    var box = document.getElementById("reportBox");
    if (!box) return;
    var d = window.G3Store.load();
    var a = d.avatar || {};
    var nm = a.name ? (a.name + " 주민증") : "별숲 마을 주민증";
    var doneCnt = Object.keys(d.done || {}).length;
    var cardsCnt = (d.cards || []).length;
    var setsCnt = (d.sets || []).length;
    var totalLessons = 0;
    try {
      var _u = window.G3Units || {};
      for (var _hid in _u) totalLessons += ((_u[_hid] && _u[_hid].lessons) || []).length;
    } catch (e) {}
    if (!totalLessons) totalLessons = 13;
    var title = rankTitle(doneCnt, cardsCnt);
    var pet = d.pet || {};
    var myTitle = "";
    if (window.G3Pet && window.G3Pet.TITLES && pet.title) {
      for (var ti = 0; ti < window.G3Pet.TITLES.length; ti++) {
        if (window.G3Pet.TITLES[ti].id === pet.title) myTitle = window.G3Pet.TITLES[ti].name;
      }
    }
    var bossN = 0;
    if (pet.bosses) for (var bk in pet.bosses) bossN++;
    var star3 = 0;
    if (d.stars2) for (var sk in d.stars2) if (d.stars2[sk] >= 3) star3++;
    var html = "<div class='rep-grid'>"
      + "<div class='idcard'>"
      + "<div class='id-head'><div id='idCardAvatar' class='id-av'></div>"
      + "<div class='id-meta'><span class='tag sun'>" + title + "</span>"
      + (myTitle ? "<span class='tag'>🏅 " + myTitle + "</span>" : "")
      + "<h3>" + nm + "</h3>"
      + "<p>누적 별 <b>" + d.stars + "</b> · 완료 차시 <b>" + doneCnt + "/" + totalLessons + "</b></p>"
      + "<p>도감 카드 <b>" + cardsCnt + "/10</b> · 뽑기 세트 <b>" + setsCnt + "/9</b> · 수호자 격파 <b>" + bossN + "</b> · 최고 콤보 <b>" + (pet.bestCombo || 0) + "</b> · 도전왕 <b>" + star3 + "</b></p></div></div>"
      + chartSvg(d)
      + "<button type='button' class='mini-act btn-pulse' data-print-idcard='1'>🖨️ 명예 주민증 인쇄 / PDF 저장</button>"
      + "</div>"
      + diplomaHtml(d, a, title)
      + "<div class='savebox'>"
      + "<b>기기 간 이어하기 코드</b>"
      + "<p class='hint'>코드를 복사해 두면 다른 태블릿이나 PC에서도 내 아바타와 별·카드를 그대로 이어서 플레이할 수 있습니다.</p>"
      + "<textarea id='saveCodeInput' rows='3' placeholder='여기에 이어하기 코드가 표시되거나 붙여넣을 수 있습니다'></textarea>"
      + "<div class='prow'>"
      + "<button type='button' class='go btn-pulse' data-save-export='1'>내 이어하기 코드 만들기·복사</button>"
      + "<button type='button' data-save-import='1'>코드 불러오기</button>"
      + "</div><p id='saveCodeMsg' class='fb' aria-live='polite'></p></div></div>";
    box.innerHTML = html;
    var avBox = document.getElementById("idCardAvatar");
    if (avBox && window.G3Avatar && window.G3Avatar.mountRig) {
      window.G3Avatar.mountRig(avBox, a);
    }
  }
  var STAMP_FALLBACK = { mul: "곱셈", divi: "나눗셈", circ: "원", frac: "분수", mea: "측정", gra: "그래프" };
  function STAMP_NAMES() {
    var order = UNIT_ORDER();
    var out = {};
    for (var i = 0; i < order.length; i++) out[order[i][0]] = order[i][1];
    for (var k in STAMP_FALLBACK) if (!out[k]) out[k] = STAMP_FALLBACK[k];
    return out;
  }
  function unitMaster(d, hid) {
    var ls = ((window.G3Units || {})[hid] && window.G3Units[hid].lessons) || [];
    if (!ls.length) return false;
    for (var i = 0; i < ls.length; i++) if (!d.done || !d.done[ls[i].id]) return false;
    return true;
  }
  function diplomaHtml(d, a, title) {
    var order = UNIT_ORDER().map(function (r) { return r[0]; });
    var names = STAMP_NAMES();
    var got = 0, stamps = "";
    for (var i = 0; i < order.length; i++) {
      var m = unitMaster(d, order[i]);
      if (m) got++;
      stamps += "<span class='stamp" + (m ? " on" : "") + "'>" + (m ? "🏅 " : "☆ ") + (names[order[i]] || order[i]) + "</span>";
    }
    var grad = got >= order.length;
    var nm = (a && a.name) || "별숲 주민";
    return "<div class='diploma' id='diplomaCard'>"
      + "<p class='eyebrow'>별숲 수학마을 · " + gradeLabel() + "</p>"
      + "<h3>" + (grad ? "🎓 명예 졸업 상장" : "🎓 졸업 상장 도전 중") + "</h3>"
      + "<div class='stamp-board'>" + stamps + "</div>"
      + "<p><b>" + nm + "</b> 주민 (" + title + ") · 단원 마스터 " + got + "/" + order.length + "</p>"
      + "<p class='hint'>" + (grad ? order.length + "개 단원을 모두 완주했습니다! 아래 단추로 상장을 인쇄해 보세요." : order.length + "개 단원을 모두 마치면 명예 졸업 상장이 완성됩니다.") + "</p>"
      + "<button type='button' class='mini-act btn-pulse' data-print-diploma='1'>🖨️ 졸업 상장 인쇄 / PDF 저장</button>"
      + "</div>"
      + wrongTopHtml(d)
      + learningReportHtml()
      + newsHtml(d, a);
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function newsHtml(d, a) {
    var games = [];
    try { games = (window.G3Relay && window.G3Relay.history) ? window.G3Relay.history() : []; } catch (e) {}
    var pals = d.pals || [];
    var pet = d.pet || {};
    var titles = (pet.titles || []).join("·") || "아직 없음";
    var doneCnt = Object.keys(d.done || {}).length;
    var dateStr = "";
    try {
      var t = new Date();
      dateStr = t.getFullYear() + "년 " + (t.getMonth() + 1) + "월 " + t.getDate() + "일";
    } catch (e) {}
    var ghtml = "";
    if (games.length) {
      for (var i = 0; i < games.length; i++) {
        var g = games[i];
        var gd = "";
        try { gd = new Date(g.at).getMonth() + 1 + "/" + new Date(g.at).getDate(); } catch (e) {}
        ghtml += "<li>" + esc(gd) + " " + esc(g.houseName || "릴레이") + " · " + esc((g.scores || []).join(" : ")) + "</li>";
      }
    } else {
      ghtml = "<li>아직 열린 릴레이가 없어요. 마을 놀이에서 릴레이를 열어 보세요!</li>";
    }
    var palsTxt = pals.length ? pals.map(function (p) { return p.name; }).join("·") : "아직 없음";
    var rankTop = [];
    try { rankTop = (window.G3Friend && window.G3Friend.rankTop) ? window.G3Friend.rankTop() : []; } catch (e) {}
    if (rankTop.length) palsTxt += " (🏆 " + rankTop.join("·") + ")";
    return "<div class='diploma' id='newsCard'>"
      + "<p class='eyebrow'>우리 반 별숲 신문 · " + esc(dateStr) + "</p>"
      + "<h3>📰 이번 주 우리 반 별숲 소식</h3>"
      + "<p><b>" + esc((a && a.name) || "별숲 주민") + "</b> · 완료 차시 " + doneCnt + " · 최고 콤보 " + (pet.bestCombo || 0) + " · 연속 출석 " + (pet.streak || 0) + "일</p>"
      + "<p>🏅 모은 칭호: " + esc(titles) + "</p>"
      + "<p>👫 놀러 온 친구: " + esc(palsTxt) + "</p>"
      + "<div class='stamp-board' style='display:block;text-align:left'><b>🏁 최근 릴레이</b><ul>" + ghtml + "</ul></div>"
      + "<p class='hint'>이 칠판 기기의 기록으로 만듭니다.</p>"
      + "<button type='button' class='mini-act btn-pulse' data-print-news='1'>🖨️ 별숲 신문 인쇄 / PDF 저장</button>"
      + "</div>";
  }
  function houseNameOf(id) {
    try {
      var u = window.G3Units || {};
      if (u[id]) return u[id].name || id;
      if (window.LowData) {
        var all = (window.LowData.g1 || []).concat(window.LowData.g2 || []);
        for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i].name;
      }
    } catch (e) {}
    return id;
  }
  function wrongTopHtml(d) {
    var cnt = {};
    var wrong = d.wrong || [];
    for (var i = 0; i < wrong.length; i++) {
      var hid = "기타";
      try {
        if (wrong[i].lesson) {
          var U = window.G3Units || {};
          for (var h in U) {
            var ls = (U[h] && U[h].lessons) || [];
            for (var j = 0; j < ls.length; j++) if (ls[j].id === wrong[i].lesson) hid = h;
          }
        }
      } catch (e) {}
      cnt[hid] = (cnt[hid] || 0) + 1;
    }
    var low = d.lowWrong || [];
    for (var k = 0; k < low.length; k++) {
      var lh = (low[k] && low[k].house) || "새싹";
      cnt[lh] = (cnt[lh] || 0) + 1;
    }
    var keys = Object.keys(cnt);
    if (!keys.length) return "";
    keys.sort(function (a, b) { return cnt[b] - cnt[a]; });
    var html = "<div class='pal-sec'><b>😵‍💫 이번 주 헷갈림 TOP 3 (이 기기 기준)</b><ol class='rank-list'>";
    for (var t = 0; t < Math.min(3, keys.length); t++) {
      html += "<li><b>" + esc(houseNameOf(keys[t])) + "</b><span>틀린 문제 " + cnt[keys[t]] + "개</span>";
      if (window.G3Relay) html += " <button type='button' class='mini-act btn-pulse' data-relay-preset='" + esc(keys[t]) + "'>릴레이로 출제</button>";
      html += "</li>";
    }
    html += "</ol></div>";
    return html;
  }
  function learningReportHtml() {
    var s = null;
    try { if (window.G3Understand) s = window.G3Understand.summary(); } catch (e) { s = null; }
    if (!s) return "";
    var a = {};
    try { a = (window.G3Store.load().avatar) || {}; } catch (e) {}
    var dateStr = "";
    try {
      var t = new Date();
      dateStr = t.getFullYear() + "년 " + (t.getMonth() + 1) + "월 " + t.getDate() + "일";
    } catch (e) {}
    function pct(ok, tot) { return tot ? Math.round((ok / tot) * 100) : 0; }
    var today = s.today || { ok: 0, total: 0 };
    var week = s.week || { ok: 0, total: 0 };
    var weak = s.weak || [];
    var mastered = s.mastered || [];
    var html = "<div class='diploma learning-report' id='learningReportCard'>"
      + "<p class='eyebrow'>오늘의 학습 리포트 · " + esc(dateStr) + "</p>"
      + "<h3>📊 " + esc((a.name || "별숲 주민")) + "의 수학 기록</h3>"
      + "<div class='lr-grid'>"
      + "<div class='lr-box'><b>오늘</b><span>" + today.total + "문제 · 성공률 " + pct(today.ok, today.total) + "%</span></div>"
      + "<div class='lr-box'><b>이번 주</b><span>" + week.total + "문제 · 성공률 " + pct(week.ok, week.total) + "%</span></div>"
      + "<div class='lr-box'><b>누적</b><span>" + s.total + "문제 · 성공률 " + pct(s.ok, s.total) + "%</span></div>"
      + "</div>";
    html += "<div class='lr-sec'><b>🌱 잘하고 있는 개념</b>";
    if (mastered.length) {
      html += "<ul class='lr-list'>";
      for (var mi = 0; mi < Math.min(5, mastered.length); mi++) {
        html += "<li><b>" + esc(mastered[mi].name) + "</b><span>" + Math.round(mastered[mi].rate * 100) + "% · " + mastered[mi].total + "문제</span></li>";
      }
      html += "</ul>";
    } else {
      html += "<p class='hint'>조금 더 풀면 잘하는 개념이 나타나요.</p>";
    }
    html += "</div>";
    html += "<div class='lr-sec'><b>🧭 다음에 연습할 개념</b>";
    if (weak.length) {
      html += "<ul class='lr-list'>";
      for (var wi = 0; wi < weak.length; wi++) {
        html += "<li><b>" + esc(weak[wi].name) + "</b><span>" + Math.round(weak[wi].rate * 100) + "% · " + weak[wi].total + "문제</span></li>";
      }
      html += "</ul>";
    } else {
      html += "<p class='hint'>지금은 크게 헷갈리는 개념이 없어요. 스스로 잘하고 있어요!</p>";
    }
    html += "</div>";
    var units = s.units || [];
    if (units.length) {
      html += "<div class='lr-sec'><b>🏘️ 단원별 이해도</b><ul class='lr-list'>";
      for (var ui = 0; ui < units.length; ui++) {
        var u = units[ui];
        var label = u.rate == null ? "기록 없음" : (u.state === "master" ? "숙달 " : (u.state === "weak" ? "취약 " : "보통 ")) + Math.round(u.rate * 100) + "%";
        html += "<li><b>" + esc(u.name) + "</b><span>" + esc(label) + " · " + u.total + "문제</span></li>";
      }
      html += "</ul></div>";
    }
    html += "<p class='hint'>이 리포트는 이 기기에 저장된 학습 기록으로 만듭니다.</p>"
      + "<button type='button' class='mini-act btn-pulse' data-print-learning='1'>🖨️ 학습 리포트 인쇄 / PDF 저장</button>"
      + "</div>";
    return html;
  }
  function exportCode() {
    var d = window.G3Store.load();
    var code = encodeSave(d);
    var inp = document.getElementById("saveCodeInput");
    var msg = document.getElementById("saveCodeMsg");
    if (inp) inp.value = code;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code);
      }
    } catch (e) {}
    if (msg) msg.textContent = "이어하기 코드를 만들고 복사했습니다!";
    toast("이어하기 코드가 복사되었습니다.");
  }
  function importCode() {
    var inp = document.getElementById("saveCodeInput");
    var msg = document.getElementById("saveCodeMsg");
    var raw = inp ? inp.value.trim() : "";
    if (!raw) { if (msg) msg.textContent = "불러올 이어하기 코드를 입력 칸에 붙여넣어 주세요."; return; }
    var d = decodeSave(raw);
    if (!d || typeof d !== "object") {
      if (msg) msg.textContent = "올바른 이어하기 코드가 아닙니다. 다시 확인해 주세요.";
      return;
    }
    window.G3Store.save(d);
    if (window.G3Avatar) window.G3Avatar.init();
    if (window.G3TokenRefresh) window.G3TokenRefresh();
    if (window.G3Farm) window.G3Farm.render();
    if (window.G3Deco) window.G3Deco.render();
    if (window.G3Play) window.G3Play.render();
    if (window.G3Quests) window.G3Quests.render();
    if (window.G3Collect) window.G3Collect.render();
    if (window.G3Gacha) window.G3Gacha.render();
    if (window.G3Journal) window.G3Journal.render();
    if (window.G3UI) { window.G3UI.stars(); if (window.G3UI.sfx) window.G3UI.sfx("fanfare"); }
    render();
    toast("이어하기 코드를 성공적으로 불러왔습니다!");
  }
  function doPrint(cls) {
    try {
      document.body.classList.add(cls);
      window.print();
      setTimeout(function () { document.body.classList.remove(cls); }, 800);
    } catch (e) {}
  }
  try {
    window.addEventListener("afterprint", function () {
      document.body.classList.remove("print-idcard");
      document.body.classList.remove("print-diploma");
      document.body.classList.remove("print-news");
      document.body.classList.remove("print-learning");
    });
  } catch (e) {}
  document.addEventListener("click", function (e) {
    var rp = e.target.closest ? e.target.closest("[data-relay-preset]") : null;
    if (rp) {
      if (window.G3Relay && window.G3Relay.preset) window.G3Relay.preset(rp.getAttribute("data-relay-preset"));
      var rb = document.getElementById("relayBox");
      if (rb && rb.scrollIntoView) rb.scrollIntoView({ behavior: "smooth" });
      if (window.G3UI) window.G3UI.toast("릴레이 단원을 골랐어요!");
      return;
    }
    var nw = e.target.closest ? e.target.closest("[data-print-news]") : null;
    if (nw) { doPrint("print-news"); return; }
    var lr = e.target.closest ? e.target.closest("[data-print-learning]") : null;
    if (lr) { doPrint("print-learning"); return; }
    var pd = e.target.closest ? e.target.closest("[data-print-diploma]") : null;
    if (pd) { doPrint("print-diploma"); return; }
    var p = e.target.closest ? e.target.closest("[data-print-idcard]") : null;
    if (p) { doPrint("print-idcard"); return; }
    var t = e.target.closest ? e.target.closest("[data-save-export],[data-save-import]") : null;
    if (!t) return;
    if (t.hasAttribute("data-save-export")) exportCode();
    else importCode();
  });
  window.G3Report = { render: render };
})();
