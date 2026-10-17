(function () {
  // 종이 학습지 인쇄: 단원 선택 → 10문제 + 정답지(풀이 포함).
  // 문제 생성기(g3-pad / LowPad)를 재사용하므로 앱과 같은 유형이 나옵니다.
  var COUNT = 10;
  function toast(m) { if (window.G3UI) window.G3UI.toast(m); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function houses() {
    try {
      if (window.LowData) {
        var g = "1";
        try {
          var q = (location.search || "").match(/[?&]grade=([12])/);
          if (q) g = q[1];
        } catch (e) {}
        var arr = g === "2" ? window.LowData.g2 : window.LowData.g1;
        return arr.map(function (h) { return { id: h.id, name: h.name, low: true }; });
      }
      var u = window.G3Units || {};
      var out = [];
      for (var k in u) out.push({ id: k, name: u[k].name || k, low: false });
      return out;
    } catch (e) { return []; }
  }
  function buildItems(houseId, serial) {
    var items = [];
    var seen = {};
    function push(q, a, steps, choices) {
      if (items.length >= COUNT || !q || seen[q]) return;
      seen[q] = 1;
      items.push({ q: q, a: a, steps: steps || [], choices: choices || null });
    }
    try {
      if (window.LowData) {
        var hs = houses();
        var h = null;
        for (var i = 0; i < hs.length; i++) if (hs[i].id === houseId) h = hs[i];
        var fixed = [];
        try {
          var g = "1";
          try {
            var q = (location.search || "").match(/[?&]grade=([12])/);
            if (q) g = q[1];
          } catch (e) {}
          var arr = g === "2" ? window.LowData.g2 : window.LowData.g1;
          for (var a2 = 0; a2 < arr.length; a2++) if (arr[a2].id === houseId) fixed = arr[a2].list;
        } catch (e2) {}
        for (var f = 0; f < fixed.length; f++) push(fixed[f].q, fixed[f].a, [fixed[f].exp], fixed[f].choices);
        var guard = 0;
        while (items.length < COUNT && guard < 10 && window.LowPad && window.LowPad.generate) {
          guard++;
          var gen = window.LowPad.generate(g, houseId);
          for (var gi = 0; gi < gen.length; gi++) push(gen[gi].q, gen[gi].a, [gen[gi].exp], gen[gi].choices);
        }
      } else {
        var U = (window.G3Units || {})[houseId];
        var ls = (U && U.lessons) || [];
        for (var li = 0; li < ls.length && items.length < COUNT; li++) {
          var list = ls[li].list || [];
          for (var qi = 0; qi < list.length; qi++) push(list[qi].q, list[qi].a, list[qi].steps);
        }
        var g2 = 0;
        while (items.length < COUNT && g2 < 10 && window.G3Pad && window.G3Pad.generateSet) {
          g2++;
          var gen2 = window.G3Pad.generateSet(houseId);
          for (var gj = 0; gj < gen2.length; gj++) push(gen2[gj].q, gen2[gj].a, gen2[gj].steps);
        }
      }
    } catch (e) {}
    return items;
  }
  function houseName(id) {
    var hs = houses();
    for (var i = 0; i < hs.length; i++) if (hs[i].id === id) return hs[i].name;
    return id;
  }
  function render() {
    try {
      var host = document.getElementById("note") || document.getElementById("lowProgress");
      if (host && !document.getElementById("sheetBox")) {
        var box = document.createElement("div");
        box.id = "sheetBox";
        host.appendChild(box);
      }
    } catch (e) {}
    var el = document.getElementById("sheetBox");
    if (!el) return;
    var hs = houses();
    if (!hs.length) return;
    var opts = "";
    for (var i = 0; i < hs.length; i++) {
      opts += "<option value='" + esc(hs[i].id) + "'>" + esc(hs[i].name) + "</option>";
    }
    el.innerHTML = "<div class='pal-sec'><b>🖨️ 종이 학습지 만들기</b>"
      + "<p class='hint'>단원을 고르면 문제 10개 + 정답지를 인쇄합니다. 앱과 같은 유형이 나와요.</p>"
      + "<div class='relay-row'><span>단원</span><select id='sheetHouse' aria-label='학습지 단원'>" + opts + "</select></div>"
      + "<div class='prow'><button type='button' class='go btn-pulse' data-sheet-make='1'>학습지 미리보기</button></div>"
      + "<div id='sheetPreview'></div></div>";
  }
  function serial() {
    try {
      var t = new Date();
      return t.getFullYear() + String(t.getMonth() + 1).padStart(2, "0") + String(t.getDate()).padStart(2, "0")
        + "-" + String(t.getHours()).padStart(2, "0") + String(t.getMinutes()).padStart(2, "0");
    } catch (e) { return "0000"; }
  }
  function make(houseId) {
    if (!houseId) {
      var sel = document.getElementById("sheetHouse");
      houseId = sel ? sel.value : null;
    }
    if (!houseId) { toast("단원을 골라 주세요."); return; }
    var items = buildItems(houseId, serial());
    if (!items.length) { toast("문제를 만들지 못했어요."); return; }
    var sn = serial();
    var html = "";
    for (var i = 0; i < items.length; i++) {
      html += "<li><b>" + (i + 1) + ".</b> " + esc(items[i].q);
      if (items[i].choices) {
        html += "<br><span class='sheet-choices'>① " + esc(items[i].choices[0]) + "　② " + esc(items[i].choices[1]) + "　③ " + esc(items[i].choices[2]) + "</span>";
      } else {
        html += "<br><span class='sheet-answer-line'>답: </span>";
      }
      html += "</li>";
    }
    var key = "";
    for (var k = 0; k < items.length; k++) {
      key += "<li><b>" + (k + 1) + ".</b> " + esc(items[k].a)
        + (items[k].steps && items[k].steps.length ? " <small>(" + esc(items[k].steps.join(" → ")) + "</small>" : "") + "</li>";
    }
    var pv = document.getElementById("sheetPreview");
    if (pv) {
      pv.innerHTML = "<div class='sheet-prev'><b>" + esc(houseName(houseId)) + " 학습지 (No." + esc(sn) + ")</b>"
        + "<ol>" + html + "</ol>"
        + "<button type='button' class='go btn-pulse' data-sheet-print='1'>🖨️ 인쇄하기 (정답지 포함)</button></div>";
    }
    var old = document.getElementById("sheetPrint");
    if (old && old.parentNode) old.parentNode.removeChild(old);
    var pr = document.createElement("div");
    pr.id = "sheetPrint";
    pr.innerHTML = "<div class='sheet-page'><h2>별숲 수학마을 학습지 · " + esc(houseName(houseId)) + "</h2>"
      + "<p>이름: ______　날짜: ______　No." + esc(sn) + "</p><ol>" + html + "</ol></div>"
      + "<div class='sheet-page sheet-key'><h2>정답지 · " + esc(houseName(houseId)) + " (No." + esc(sn) + ")</h2><ol>" + key + "</ol></div>";
    document.body.appendChild(pr);
  }
  function doPrint() {
    try {
      document.body.classList.add("print-sheet");
      window.print();
      setTimeout(function () { document.body.classList.remove("print-sheet"); }, 800);
    } catch (e) {}
  }
  try {
    window.addEventListener("afterprint", function () {
      document.body.classList.remove("print-sheet");
    });
  } catch (e) {}
  document.addEventListener("click", function (e) {
    var h = e.target.closest ? e.target.closest("[data-sheet-house]") : null;
    if (h) {
      render();
      var sel = document.getElementById("sheetHouse");
      if (sel) sel.value = h.getAttribute("data-sheet-house");
      var box = document.getElementById("sheetBox");
      if (box && box.scrollIntoView) box.scrollIntoView({ behavior: "smooth" });
      var dlg = document.getElementById("dlg");
      if (dlg) dlg.classList.remove("show");
      make(h.getAttribute("data-sheet-house"));
      return;
    }
    var t = e.target.closest ? e.target.closest("[data-sheet-make],[data-sheet-print]") : null;
    if (!t) return;
    if (t.hasAttribute("data-sheet-make")) {
      var sel2 = document.getElementById("sheetHouse");
      make(sel2 ? sel2.value : null);
    }
    else if (t.hasAttribute("data-sheet-print")) doPrint();
  });
  window.G3Sheet = { render: render, make: make };
})();
