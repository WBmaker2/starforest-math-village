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
    var html = "<div class='rep-grid'>"
      + "<div class='idcard'>"
      + "<div class='id-head'><div id='idCardAvatar' class='id-av'></div>"
      + "<div class='id-meta'><span class='tag sun'>" + title + "</span><h3>" + nm + "</h3>"
      + "<p>누적 별 <b>" + d.stars + "</b> · 완료 차시 <b>" + doneCnt + "/" + totalLessons + "</b></p>"
      + "<p>도감 카드 <b>" + cardsCnt + "/10</b> · 황금 세트 <b>" + setsCnt + "/3</b></p></div></div>"
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
      + "</div>";
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
    });
  } catch (e) {}
  document.addEventListener("click", function (e) {
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
