(function () {
  var SETS = [
    { id: "gold", name: "황금 세트", cost: 30, pieces: [
      { v: "set-gold-hat", n: "황금 모자", slot: "hat" },
      { v: "set-gold-cape", n: "황금 망토", slot: "top" },
      { v: "set-gold-boots", n: "황금 부츠", slot: "shoe" } ] }
  ];
  function owned() {
    var d = window.G3Store.load();
    if (!d.sets) { d.sets = []; window.G3Store.save(d); }
    return d.sets;
  }
  function render() {
    var box = document.getElementById("gachaBox");
    if (!box) return;
    var d = window.G3Store.load();
    var has = owned();
    var html = "";
    for (var i = 0; i < SETS.length; i++) {
      var s = SETS[i];
      var left = 0;
      for (var j = 0; j < s.pieces.length; j++) if (has.indexOf(s.pieces[j].v) < 0) left++;
      html += "<div class='gacha'><b>" + s.name + " 뽑기</b><span>별 " + s.cost + "개로 1회 · 남은 조각 " + left + "개</span>";
      html += "<div class='prow'>";
      for (var k = 0; k < s.pieces.length; k++) {
        var got = has.indexOf(s.pieces[k].v) >= 0;
        html += "<span class='gpiece" + (got ? " got" : "") + "'><img src='../assets/img/flow/parts/" + s.pieces[k].v + ".png' alt='" + s.pieces[k].n + "'>" + s.pieces[k].n + (got ? " 보유" : " 미보유") + "</span>";
      }
      var doneAll = left === 0;
      html += "</div><button class='go gi-pulse' data-gacha='" + s.id + "'" + (doneAll ? " disabled" : "") + ">" + (doneAll ? "컴플리트!" : ("뽑기 (별 " + s.cost + ")")) + "</button></div>";
    }
    box.innerHTML = html;
  }
  function pull(id) {
    var s = null;
    for (var i = 0; i < SETS.length; i++) if (SETS[i].id === id) s = SETS[i];
    if (!s) return;
    var d = window.G3Store.load();
    if (d.stars < s.cost) {
      if (window.G3UI) window.G3UI.toast("별이 모자랍니다. 문제를 풀면 별을 받습니다.");
      return;
    }
    var has = owned();
    var pool = [];
    for (var j = 0; j < s.pieces.length; j++) if (has.indexOf(s.pieces[j].v) < 0) pool.push(s.pieces[j]);
    d.stars -= s.cost;
    var msg;
    if (!pool.length) {
      d.seeds += 5;
      msg = "이미 다 모았습니다. 씨앗 5개를 받았습니다.";
    } else {
      var pick = pool[Math.floor(Math.random() * pool.length)];
      has.push(pick.v);
      d.sets = has;
      msg = pick.n + "이(가) 나왔습니다!";
      if (window.G3Journal) window.G3Journal.log("뽑기", s.name + "에서 " + pick.n + " 획득");
    }
    window.G3Store.save(d);
    if (window.G3UI) { window.G3UI.stars(); window.G3UI.toast(msg); }
    if (window.G3Confetti) window.G3Confetti.burst();
    if (window.G3Avatar && window.G3Avatar.refreshPicker) window.G3Avatar.refreshPicker();
    render();
  }
  document.addEventListener("click", function (e) {
    var t = e.target.closest ? e.target.closest("[data-gacha]") : null;
    if (t) pull(t.getAttribute("data-gacha"));
  });
  window.G3Gacha = { render: render, pull: pull, sets: SETS };
})();
