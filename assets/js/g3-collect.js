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
  function owned() {
    var d = window.G3Store.load();
    if (!d.cards) { d.cards = []; window.G3Store.save(d); }
    return d.cards;
  }
  function unlock(id) {
    if (!CARDS[id]) return;
    var d = window.G3Store.load();
    if (!d.cards) d.cards = [];
    if (d.cards.indexOf(id) >= 0) return;
    d.cards.push(id);
    window.G3Store.save(d);
    if (window.G3Journal) window.G3Journal.log("수집", CARDS[id].name + " 카드 획득");
    render();
    if (window.G3Avatar && window.G3Avatar.refreshPicker) window.G3Avatar.refreshPicker();
    if (window.G3Confetti) window.G3Confetti.burst();
  }
  function render() {
    var box = document.getElementById("cardBox");
    if (!box) return;
    var has = owned();
    var html = "";
    for (var id in CARDS) {
      var got = has.indexOf(id) >= 0;
      var face = "<circle cx='30' cy='30' r='18' fill='#E6DFC9'/><text x='30' y='38' text-anchor='middle' font-size='24' fill='#9A8568'>?</text>";
      if (got) face = CARDS[id].img ? ("<img src='" + CARDS[id].img + "' alt='" + CARDS[id].name + "'>") : CARDS[id].art;
      var frame = CARDS[id].img && got ? ("<div class='cardimg'>" + face + "</div>") : ("<svg viewBox='0 0 60 60'>" + face + "</svg>");
      html += "<div class='card2" + (got ? "" : " locked") + "'>" + frame;
      html += "<b>" + (got ? CARDS[id].name : "???") + "</b><span>" + CARDS[id].sub + "</span></div>";
    }
    box.innerHTML = html;
    var n = document.getElementById("cardCount");
    if (n) n.textContent = "모은 카드 " + has.length + "/" + Object.keys(CARDS).length;
  }
  window.G3Collect = { render: render, unlock: unlock };
})();
