(function () {
  var CROPS = {
    lettuce: { name: "아삭 상추", min: 3, star: 6, img: "../assets/img/flow/crop-lettuce.jpg" },
    tomato: { name: "동글 토마토", min: 10, star: 12, img: "../assets/img/flow/crop-tomato.jpg" },
    pumpkin: { name: "둥실 호박", min: 30, star: 25, img: "../assets/img/flow/crop-pumpkin.jpg" }
  };
  var SOIL_SVG = "<svg class='plot-ico' viewBox='0 0 64 48' aria-hidden='true'><ellipse cx='32' cy='38' rx='26' ry='8' fill='#C9AE7E'/><ellipse cx='32' cy='36' rx='20' ry='5' fill='#A6895B'/></svg>";
  var SPROUT_SVG = "<svg class='plot-ico' viewBox='0 0 64 48' aria-hidden='true'><ellipse cx='32' cy='40' rx='24' ry='7' fill='#A6895B'/><path d='M32 38 V20' stroke='#2F7A40' stroke-width='3' stroke-linecap='round'/><ellipse cx='24' cy='22' rx='8' ry='5' transform='rotate(-20 24 22)' fill='#4FA85E'/><ellipse cx='40' cy='20' rx='8' ry='5' transform='rotate(20 40 20)' fill='#5BB86A'/></svg>";
  function toast(m) { if (window.G3UI) window.G3UI.toast(m); }
  function render() {
    var box = document.getElementById("farmPlots");
    if (!box) return;
    var d = window.G3Store.load();
    var now = Date.now();
    var html = "";
    for (var i = 0; i < 4; i++) {
      var p = d.farm.plots[i];
      html += "<div class='plot'>";
      if (!p) {
        html += "<div class='plot-head'>" + SOIL_SVG + "<div><b>빈 밭 " + (i + 1) + "</b><span>씨앗 1개로 작물을 심어 보세요</span></div></div><div class='prow'>";
        for (var k in CROPS) {
          html += "<button data-plant='" + i + ":" + k + "'><img class='crop-mini' src='" + CROPS[k].img + "' alt=''> " + CROPS[k].name + " (" + CROPS[k].min + "분/★" + CROPS[k].star + ")</button>";
        }
        html += "</div>";
      } else {
        var c = CROPS[p.crop] || CROPS.lettuce;
        var totalMs = c.min * 60000;
        var remMs = Math.max(0, p.readyAt - now);
        var pct = Math.min(100, Math.max(8, Math.round((1 - remMs / totalMs) * 100)));
        var left = Math.max(0, Math.ceil(remMs / 60000));
        if (now >= p.readyAt) {
          html += "<div class='plot-head'><img class='crop-thumb' src='" + c.img + "' alt='" + c.name + "'><div><b>" + c.name + " 수확 준비 완료!</b><span>수확 보상: 별 +" + c.star + "</span></div></div>";
          html += "<div class='pbar'><i style='width:100%'></i></div>";
          html += "<button class='go gi-pulse' data-harvest='" + i + "'>거두기</button>";
        } else {
          html += "<div class='plot-head'>" + SPROUT_SVG + "<img class='crop-thumb growing' src='" + c.img + "' alt='" + c.name + "'><div><b>" + c.name + " 자라는 중 (" + pct + "%)</b><span>약 " + left + "분 남음 · 별 +" + c.star + "</span></div></div>";
          html += "<div class='pbar'><i style='width:" + pct + "%'></i></div>";
          html += "<button data-water='" + i + "'>물주기 (1분 단축)</button>";
        }
      }
      html += "</div>";
    }
    box.innerHTML = html;
    var s = document.getElementById("seedCount");
    if (s) s.textContent = "보유 씨앗 " + d.seeds + "개";
  }
  function plant(i, crop) {
    var d = window.G3Store.load();
    if (d.seeds < 1) { toast("씨앗이 없습니다. 차시를 끝내면 씨앗을 받습니다."); return; }
    if (d.farm.plots[i]) return;
    d.seeds -= 1;
    d.farm.plots[i] = { crop: crop, readyAt: Date.now() + CROPS[crop].min * 60000 };
    window.G3Store.save(d);
    if (window.G3Journal) window.G3Journal.log("농사", CROPS[crop].name + " 심기");
    render();
    if (window.G3UI) window.G3UI.stars();
    toast(CROPS[crop].name + "을 심었습니다.");
  }
  function water(i) {
    var d = window.G3Store.load();
    var p = d.farm.plots[i];
    if (!p) return;
    p.readyAt = Math.max(Date.now(), p.readyAt - 60000);
    window.G3Store.save(d);
    render();
  }
  function harvest(i) {
    var d = window.G3Store.load();
    var p = d.farm.plots[i];
    if (!p || Date.now() < p.readyAt) return;
    d.farm.plots[i] = null;
    d.stars += CROPS[p.crop].star;
    if (!d.basket) d.basket = { lettuce: 0, tomato: 0, pumpkin: 0 };
    d.basket[p.crop] = (d.basket[p.crop] || 0) + 1;
    d.harvests += 1;
    if (d.harvests === 1) d.deco.owned.push("pinwheel");
    if (d.harvests === 3) d.deco.owned.push("pond");
    window.G3Store.save(d);
    if (window.G3Journal) window.G3Journal.log("농사", CROPS[p.crop].name + " 수확, 별 +" + CROPS[p.crop].star);
    if (window.G3Collect) window.G3Collect.unlock(p.crop);
    if (window.G3Quests) window.G3Quests.poke();
    if (window.G3Deco) window.G3Deco.render();
    if (window.G3Play) window.G3Play.render();
    render();
    if (window.G3UI) { window.G3UI.stars(); if (window.G3UI.sfx) window.G3UI.sfx("fanfare"); }
    toast(CROPS[p.crop].name + " 수확! 별 +" + CROPS[p.crop].star + " · 바구니 +1");
  }
  function onLesson(first) {
    if (first) { render(); toast("씨앗 2개를 받았습니다. 텃밭에 심어 보세요."); }
  }
  document.addEventListener("click", function (e) {
    var t = e.target.closest ? e.target.closest("[data-plant],[data-water],[data-harvest]") : null;
    if (!t) return;
    if (t.hasAttribute("data-plant")) {
      var a = t.getAttribute("data-plant").split(":");
      plant(parseInt(a[0], 10), a[1]);
    }
    else if (t.hasAttribute("data-water")) water(parseInt(t.getAttribute("data-water"), 10));
    else harvest(parseInt(t.getAttribute("data-harvest"), 10));
  });
  setInterval(function () {
    var box = document.getElementById("farmPlots");
    if (box && box.children.length) render();
  }, 30000);
  window.G3Farm = { render: render, onLesson: onLesson };
})();
