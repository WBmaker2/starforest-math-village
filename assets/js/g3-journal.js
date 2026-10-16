(function () {
  var FALLBACK_HOUSES = [
    ["mul", "곱셈 방앗간"], ["divi", "나눔 과일정거장"], ["circ", "동그라미 시계소"],
    ["frac", "조각 피자부엌"], ["mea", "되와 무게 실험실"], ["gra", "그림소식 우체통"]
  ];
  function HOUSES() {
    try {
      var u = window.G3Units || {};
      var keys = Object.keys(u);
      if (keys.length) {
        var out = [];
        for (var i = 0; i < keys.length; i++) out.push([keys[i], u[keys[i]].name || keys[i]]);
        return out;
      }
    } catch (e) {}
    return FALLBACK_HOUSES;
  }
  function log(kind, text) {
    var d = window.G3Store.load();
    d.journal.unshift({ kind: kind, text: text, at: Date.now() });
    d.journal = d.journal.slice(0, 50);
    window.G3Store.save(d);
    render();
  }
  function visit(id) {
    var d = window.G3Store.load();
    if (!d.visits[id]) {
      d.visits[id] = Date.now();
      window.G3Store.save(d);
      log("나들이", houseName(id) + " 방문");
      if (window.G3Quests) window.G3Quests.poke();
    }
    render();
  }
  function houseName(id) {
    var hs = HOUSES();
    for (var i = 0; i < hs.length; i++) if (hs[i][0] === id) return hs[i][1];
    return "단원 집";
  }
  function render() {
    var j = document.getElementById("journalList");
    if (j) {
      var d = window.G3Store.load();
      if (!d.journal.length) j.innerHTML = "<p class='hint'>아직 기록이 없습니다. 마을을 돌아다니면 자동으로 적힙니다.</p>";
      else {
        var html = "";
        for (var i = 0; i < d.journal.length; i++) {
          var e = d.journal[i];
          var dt = new Date(e.at);
          html += "<div><b>[" + e.kind + "]</b> " + e.text + " <small>" + (dt.getMonth() + 1) + "/" + dt.getDate() + " " + dt.getHours() + ":" + String(dt.getMinutes()).padStart(2, "0") + "</small></div>";
        }
        j.innerHTML = html;
      }
    }
    var m = document.getElementById("villageMap");
    if (m) {
      var d2 = window.G3Store.load();
      var mh = "";
      var hs = HOUSES();
      for (var k = 0; k < hs.length; k++) {
        var id = hs[k][0];
        var u = window.G3Units && window.G3Units[id];
        var totalL = u && u.lessons ? u.lessons.length : 0;
        var doneL = 0;
        if (u && u.lessons) {
          for (var li = 0; li < u.lessons.length; li++) {
            if (d2.done[u.lessons[li].id]) doneL++;
          }
        }
        var st = doneL > 0 ? (doneL >= totalL ? "완료 (" + doneL + "/" + totalL + ")" : "학습 중 (" + doneL + "/" + totalL + ")") : (d2.visits[id] ? "방문" : "미방문");
        mh += "<button class='mapcell' data-enter='" + id + "'><b>" + hs[k][1] + "</b><span>" + st + "</span></button>";
      }
      m.innerHTML = mh;
    }
    var r = document.getElementById("recordBox");
    if (r) {
      var d3 = window.G3Store.load();
      var ok = 0, tot = 0;
      for (var lid in d3.done) { ok += d3.done[lid].ok; tot += d3.done[lid].total; }
      var acc = tot ? Math.round(ok / tot * 100) : 0;
      r.innerHTML = "<div class='rec'><b>별</b><span>" + d3.stars + "</span></div>"
        + "<div class='rec'><b>씨앗</b><span>" + d3.seeds + "</span></div>"
        + "<div class='rec'><b>첫 성공률</b><span>" + acc + "% (" + ok + "/" + tot + ")</span></div>"
        + "<div class='rec'><b>수확</b><span>" + d3.harvests + "회</span></div>"
        + "<div class='rec'><b>오답 보관</b><span>" + d3.wrong.length + "개 "
        + (d3.wrong.length ? "<button class='mini-act btn-pulse' data-open-wrong='1'>오답 교실 열기</button>" : "")
        + "</span></div>"
        + "<div class='rec'><b>마을 회관 놀이</b><span><button class='mini-act btn-pulse' data-open-daily='1'>오늘의 도전 (5문제)</button></span></div>";
    }
  }
  document.addEventListener("click", function (e) {
    var t = e.target.closest ? e.target.closest("[data-enter]") : null;
    if (!t) return;
    var id = t.getAttribute("data-enter");
    visit(id);
    if (window.G3Dlg) window.G3Dlg.open(id);
  });
  window.G3Journal = { log: log, visit: visit, render: render };
})();
