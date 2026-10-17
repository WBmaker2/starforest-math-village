(function () {
  var CARDS = {
    mong: { name: "몽실", sub: "곱셈 방앗간", img: "../assets/img/flow/npc-mole.jpg", art: "<circle cx='30' cy='34' r='20' fill='#8A6A4A'/><ellipse cx='30' cy='40' rx='8' ry='6' fill='#FFD9C2'/><circle cx='23' cy='30' r='3' fill='#3E3428'/><circle cx='37' cy='30' r='3' fill='#3E3428'/>" },
    lettuce: { name: "아삭 상추", sub: "첫 수확", img: "../assets/img/flow/crop-lettuce.jpg", art: "<ellipse cx='30' cy='36' rx='18' ry='12' fill='#5BB86A'/>" },
    tomato: { name: "동글 토마토", sub: "토마토 수확", img: "../assets/img/flow/crop-tomato.jpg", art: "<circle cx='30' cy='36' r='16' fill='#E4574D'/>" },
    pumpkin: { name: "둥실 호박", sub: "호박 수확", img: "../assets/img/flow/crop-pumpkin.jpg", art: "<ellipse cx='30' cy='36' rx='20' ry='14' fill='#F5A23A'/>" },
    pinwheel: { name: "바람개비", sub: "꾸미기 2곳", img: "../assets/img/flow/parts/deco-pinwheel.png", art: "<path d='M30 30 L48 12 L48 30 Z' fill='#EE7F62'/><path d='M30 30 L48 48 L30 48 Z' fill='#6FBAD2'/><path d='M30 30 L12 48 L12 30 Z' fill='#F5B23A'/><path d='M30 30 L12 12 L30 12 Z' fill='#9C86E0'/><rect x='28' y='30' width='4' height='22' fill='#8A6A4A'/>" },
    wheat: { name: "황금밀", sub: "올림 정복", img: "../assets/img/flow/parts/play-wheat.png", art: "<path d='M30 52 L30 14' stroke='#C98A2B' stroke-width='4'/><ellipse cx='22' cy='22' rx='6' ry='9' fill='#F5B23A'/><ellipse cx='38' cy='22' rx='6' ry='9' fill='#F5B23A'/><ellipse cx='30' cy='12' rx='6' ry='8' fill='#F7C95B'/>" },
    map: { name: "마을 지도", sub: "6곳 방문", img: "../assets/img/flow/parts/play-map.png", art: "<rect x='10' y='16' width='40' height='30' rx='4' fill='#FFFDF6' stroke='#E6DFC9'/><circle cx='22' cy='28' r='4' fill='#EE7F62'/><circle cx='36' cy='34' r='4' fill='#6FBAD2'/><path d='M14 40 L46 24' stroke='#9CCB8E' stroke-dasharray='4 3'/>" },
    chick: { name: "삐약이 역장", sub: "나눗셈 첫걸음", img: "../assets/img/flow/npc-chick.jpg", art: "<circle cx='30' cy='32' r='18' fill='#F5B23A'/>" },
    clockpizza: { name: "시계와 피자", sub: "원·분수 해결", img: "../assets/img/flow/npc-bunny.jpg", art: "<circle cx='30' cy='30' r='18' fill='#EE7F62'/>" },
    scaleletter: { name: "저울과 우체통", sub: "측정·그래프 해결", img: "../assets/img/flow/house-gra.jpg", art: "<rect x='14' y='16' width='32' height='28' rx='4' fill='#6FBAD2'/>" }
  };
  var LEGENDS = {
    g1: [
      { id: "g1-sprout", name: "새싹 탐험왕", sub: "1학년 6곳 입장", emoji: "🌱" },
      { id: "g1-bloom", name: "꽃핀 새싹", sub: "1학년 문제 18개 해결", emoji: "🌸" },
      { id: "g1-sun", name: "햇살 친구", sub: "연속 출석 2일", emoji: "🌞" }
    ],
    g2: [
      { id: "g2-sprout", name: "자리수 박사", sub: "2학년 6곳 입장", emoji: "🌿" },
      { id: "g2-bloom", name: "구구단 가수", sub: "2학년 문제 18개 해결", emoji: "🎤" },
      { id: "g2-sun", name: "시계 지기", sub: "연속 출석 2일", emoji: "🕐" }
    ],
    g3: [
      { id: "g3-mill", name: "방앗간 주인", sub: "곱셈 집 마스터", emoji: "🏭" },
      { id: "g3-dragon", name: "수호룡 친구", sub: "3학년 수호자 격파", emoji: "🐲" },
      { id: "g3-crown", name: "별숲 스타", sub: "도전왕 1개", emoji: "🌟" }
    ],
    g4: [
      { id: "g4-scope", name: "전망대지기", sub: "4학년 6곳 입장", emoji: "🔭" },
      { id: "g4-knight", name: "도형 기사", sub: "4학년 수호자 격파", emoji: "🛡️" },
      { id: "g4-crown", name: "그래프 박사", sub: "도전왕 1개", emoji: "📈" }
    ],
    g5: [
      { id: "g5-farm", name: "과수원 주인", sub: "5학년 6곳 입장", emoji: "🍎" },
      { id: "g5-alche", name: "배합 마법사", sub: "5학년 수호자 격파", emoji: "⚗️" },
      { id: "g5-crown", name: "평균 왕", sub: "도전왕 1개", emoji: "👑" }
    ],
    g6: [
      { id: "g6-atel", name: "아틀리에 주인", sub: "6학년 6곳 입장", emoji: "🎨" },
      { id: "g6-wiz", name: "별자리 마법사", sub: "6학년 수호자 격파", emoji: "🧙" },
      { id: "g6-crown", name: "입체 장인", sub: "도전왕 1개", emoji: "🧊" }
    ]
  };
  function curGrade() {
    try { return window.G3Store.grade(); } catch (e) { return "g3"; }
  }
  function legendCheck(id) {
    try {
      var d = window.G3Store.load();
      var g = curGrade();
      if (id === g + "-sprout" || id === "g4-scope" || id === "g5-farm" || id === "g6-atel") {
        var vs = d.visits || {};
        return Object.keys(vs).length >= 6;
      }
      if (id === "g1-bloom" || id === "g2-bloom") {
        var ld = d.lowDone || {};
        return Object.keys(ld).length >= 18;
      }
      if (id === "g1-sun" || id === "g2-sun") {
        return ((d.pet || {}).streak || 0) >= 2;
      }
      if (id === "g3-mill") {
        var U = window.G3Units || {};
        var first = null;
        for (var k in U) { first = k; break; }
        if (!first) return false;
        var ls = (U[first] && U[first].lessons) || [];
        if (!ls.length) return false;
        for (var i = 0; i < ls.length; i++) if (!d.done || !d.done[ls[i].id]) return false;
        return true;
      }
      if (id === "g3-dragon" || id === "g4-knight" || id === "g5-alche" || id === "g6-wiz") {
        var bs = (d.pet && d.pet.bosses) || {};
        var U2 = window.G3Units || {};
        for (var h in U2) if (bs[h]) return true;
        return false;
      }
      if (id === "g3-crown" || id === "g4-crown" || id === "g5-crown" || id === "g6-crown") {
        var s2 = d.stars2 || {};
        for (var sk in s2) if (s2[sk] >= 3) return true;
        return false;
      }
    } catch (e) {}
    return false;
  }
  function legendDef(id) {
    for (var g in LEGENDS) {
      for (var i = 0; i < LEGENDS[g].length; i++) {
        if (LEGENDS[g][i].id === id) return LEGENDS[g][i];
      }
    }
    return null;
  }
  function owned() {
    var d = window.G3Store.load();
    if (!d.cards) { d.cards = []; window.G3Store.save(d); }
    return d.cards;
  }
  function unlock(id) {
    var def = CARDS[id] || legendDef(id);
    if (!def) return;
    var d = window.G3Store.load();
    if (!d.cards) d.cards = [];
    if (d.cards.indexOf(id) >= 0) return;
    d.cards.push(id);
    window.G3Store.save(d);
    if (window.G3Journal) window.G3Journal.log("수집", def.name + " 카드 획득");
    render();
    if (window.G3Avatar && window.G3Avatar.refreshPicker) window.G3Avatar.refreshPicker();
    if (window.G3Confetti) window.G3Confetti.burst();
  }
  function cardFace(def, got) {
    if (!got) return "<circle cx='30' cy='30' r='18' fill='#E6DFC9'/><text x='30' y='38' text-anchor='middle' font-size='24' fill='#9A8568'>?</text>";
    if (def.img) return "<img src='" + def.img + "' alt='" + def.name + "'>";
    if (def.emoji) return "<text x='30' y='42' text-anchor='middle' font-size='30'>" + def.emoji + "</text>";
    return def.art;
  }
  function render() {
    var box = document.getElementById("cardBox");
    if (!box) return;
    var has = owned();
    var g = curGrade();
    var legends = LEGENDS[g] || [];
    for (var li = 0; li < legends.length; li++) {
      if (has.indexOf(legends[li].id) < 0 && legendCheck(legends[li].id)) {
        has.push(legends[li].id);
      }
    }
    if (legends.length) {
      var d = window.G3Store.load();
      d.cards = has;
      window.G3Store.save(d);
    }
    var html = "";
    function tile(def, isLegend) {
      var got = has.indexOf(isLegend ? def.id : def._id) >= 0;
      var face = cardFace(def, got);
      var frame = (def.img && got) ? ("<div class='cardimg'>" + face + "</div>") : ("<svg viewBox='0 0 60 60'>" + face + "</svg>");
      html += "<div class='card2" + (got ? "" : " locked") + (isLegend ? " legend" : "") + "'>" + frame;
      html += "<b>" + (got ? def.name : "???") + "</b><span>" + def.sub + "</span></div>";
    }
    for (var id in CARDS) {
      CARDS[id]._id = id;
      tile(CARDS[id], false);
    }
    var total = Object.keys(CARDS).length + legends.length;
    var mine = 0;
    for (var c = 0; c < has.length; c++) {
      if (CARDS[has[c]]) mine++;
      else for (var l2 = 0; l2 < legends.length; l2++) if (legends[l2].id === has[c]) mine++;
    }
    for (var l = 0; l < legends.length; l++) tile(legends[l], true);
    box.innerHTML = html;
    var n = document.getElementById("cardCount");
    if (n) n.textContent = "모은 카드 " + mine + "/" + total + " (전설 " + legends.length + "종)";
  }
  window.G3Collect = { render: render, unlock: unlock };
})();
