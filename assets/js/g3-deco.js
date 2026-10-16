(function () {
  var SHOP = {
    flowerpot: {
      name: "꽃 화분", cond: "처음부터 보유",
      img: "../assets/img/flow/parts/deco-flowerpot.png",
      svg: "<svg viewBox='0 0 48 48'><path d='M14 28 h20 l-3 14 h-14 z' fill='#EE7F62' stroke='#8A4B38' stroke-width='2'/><path d='M24 28 V16' stroke='#2F7A40' stroke-width='3'/><circle cx='24' cy='14' r='7' fill='#F5B23A'/><circle cx='24' cy='14' r='3' fill='#FFF0CC'/></svg>"
    },
    pinwheel: {
      name: "바람개비", cond: "수확 1회",
      img: "../assets/img/flow/parts/deco-pinwheel.png",
      svg: "<svg viewBox='0 0 48 48'><rect x='22' y='22' width='4' height='20' fill='#8A6A4A'/><path d='M24 22 L38 8 L38 22 Z' fill='#EE7F62'/><path d='M24 22 L38 36 L24 36 Z' fill='#6FBAD2'/><path d='M24 22 L10 36 L10 22 Z' fill='#F5B23A'/><path d='M24 22 L10 8 L24 8 Z' fill='#9C86E0'/><circle cx='24' cy='22' r='3' fill='#FFFDF6'/></svg>"
    },
    pond: {
      name: "작은 연못", cond: "수확 3회",
      img: "../assets/img/flow/parts/deco-pond.png",
      svg: "<svg viewBox='0 0 48 48'><ellipse cx='24' cy='28' rx='18' ry='11' fill='#6FBAD2' stroke='#4A90A8' stroke-width='2'/><ellipse cx='18' cy='26' rx='5' ry='3' fill='#4FA85E'/><circle cx='30' cy='29' r='2.5' fill='#F08FB0'/></svg>"
    },
    lamp: {
      name: "밤 가로등", cond: "차시 2개 완료",
      img: "../assets/img/flow/parts/deco-lamp.png",
      svg: "<svg viewBox='0 0 48 48'><rect x='22' y='18' width='4' height='24' fill='#5A4638'/><rect x='16' y='40' width='16' height='4' rx='2' fill='#5A4638'/><circle cx='24' cy='14' r='8' fill='#FFF0CC' stroke='#F5B23A' stroke-width='2.5'/></svg>"
    },
    bench: {
      name: "나무 벤치", cond: "차시 4개 완료",
      img: "../assets/img/flow/parts/deco-bench.png",
      svg: "<svg viewBox='0 0 48 48'><rect x='8' y='20' width='32' height='7' rx='2' fill='#C98A2B' stroke='#8A6A4A' stroke-width='1.5'/><rect x='6' y='28' width='36' height='5' rx='2' fill='#A67023'/><rect x='11' y='33' width='4' height='8' fill='#5A4638'/><rect x='33' y='33' width='4' height='8' fill='#5A4638'/></svg>"
    },
    starstatue: {
      name: "별빛 분수대", cond: "차시 6개 완료",
      img: "../assets/img/flow/parts/deco-starstatue.png",
      svg: "<svg viewBox='0 0 48 48'><ellipse cx='24' cy='36' rx='16' ry='6' fill='#6FBAD2' stroke='#4A90A8' stroke-width='2'/><rect x='20' y='20' width='8' height='16' rx='3' fill='#FFFDF6' stroke='#D8CEBE' stroke-width='1.5'/><path d='M24 6 l3 6 7 1 -5 5 1 7 -6 -3 -6 3 1 -7 -5 -5 7 -1 z' fill='#F5B23A'/></svg>"
    }
  };
  var SPOTS = 6;
  function decoFace(it) {
    if (it.img) return "<img src='" + it.img + "' alt='" + it.name + "'>";
    return it.svg;
  }
  function toast(m) { if (window.G3UI) window.G3UI.toast(m); }
  function render() {
    var box = document.getElementById("decoBox");
    if (!box) return;
    var d = window.G3Store.load();
    var doneCount = Object.keys(d.done).length;
    var changed = false;
    if (doneCount >= 2 && d.deco.owned.indexOf("lamp") < 0) { d.deco.owned.push("lamp"); changed = true; }
    if (doneCount >= 4 && d.deco.owned.indexOf("bench") < 0) { d.deco.owned.push("bench"); changed = true; }
    if (doneCount >= 6 && d.deco.owned.indexOf("starstatue") < 0) { d.deco.owned.push("starstatue"); changed = true; }
    if (changed) window.G3Store.save(d);
    var html = "<p class='hint'>우리 집과 마을 광장 빈터 " + SPOTS + "곳에 소품을 놓으면 위 마을 산책 지도에도 그대로 나타납니다.</p><div class='spots'>";
    for (var i = 0; i < SPOTS; i++) {
      var placed = null;
      for (var j = 0; j < d.deco.placed.length; j++) {
        if (d.deco.placed[j].spot === i) placed = d.deco.placed[j].id;
      }
      var itemObj = placed && SHOP[placed];
      html += "<div class='spot'>";
      if (itemObj) {
        html += "<div class='spot-head'><span class='deco-ico'>" + decoFace(itemObj) + "</span><div><b>빈터 " + (i + 1) + " · " + itemObj.name + "</b><span>마을 지도에 배치됨</span></div></div><button data-unplace='" + i + "'>치우기</button>";
      } else {
        html += "<span>빈터 " + (i + 1) + " (비어 있음)</span><div class='prow'>";
        for (var k = 0; k < d.deco.owned.length; k++) {
          var id = d.deco.owned[k];
          if (!SHOP[id]) continue;
          var used = false;
          for (var m = 0; m < d.deco.placed.length; m++) if (d.deco.placed[m].id === id) used = true;
          if (!used) html += "<button data-place='" + i + ":" + id + "'>" + SHOP[id].name + "</button>";
        }
        html += "</div>";
      }
      html += "</div>";
    }
    html += "</div><p class='hint'>보유 소품: ";
    for (var n = 0; n < d.deco.owned.length; n++) if (SHOP[d.deco.owned[n]]) html += SHOP[d.deco.owned[n]].name + " · ";
    html += " (수확·차시 완료로 새 소품이 열립니다)</p>";
    box.innerHTML = html;
    if (window.G3Map && window.G3Map.syncDeco) window.G3Map.syncDeco();
  }
  function place(spot, id) {
    var d = window.G3Store.load();
    d.deco.placed = d.deco.placed.filter(function (p) { return p.spot !== spot && p.id !== id; });
    d.deco.placed.push({ spot: spot, id: id });
    window.G3Store.save(d);
    if (window.G3Journal) window.G3Journal.log("꾸미기", SHOP[id].name + " 놓기");
    if (window.G3Quests) window.G3Quests.poke();
    render();
    toast(SHOP[id].name + "을(를) 마을 빈터에 놓았습니다!");
  }
  function unplace(spot) {
    var d = window.G3Store.load();
    d.deco.placed = d.deco.placed.filter(function (p) { return p.spot !== spot; });
    window.G3Store.save(d);
    render();
  }
  document.addEventListener("click", function (e) {
    var t = e.target.closest ? e.target.closest("[data-place],[data-unplace]") : null;
    if (!t) return;
    if (t.hasAttribute("data-place")) {
      var a = t.getAttribute("data-place").split(":");
      place(parseInt(a[0], 10), a[1]);
    } else unplace(parseInt(t.getAttribute("data-unplace"), 10));
  });
  window.G3Deco = { render: render, shop: SHOP, face: decoFace };
})();
