(function () {
  var CROPS = [
    { id: "lettuce", name: "아삭 상추", g: 150, minP: 5, maxP: 9, img: "../assets/img/flow/crop-lettuce.jpg" },
    { id: "tomato", name: "동글 토마토", g: 250, minP: 10, maxP: 16, img: "../assets/img/flow/crop-tomato.jpg" },
    { id: "pumpkin", name: "둥실 호박", g: 800, minP: 20, maxP: 32, img: "../assets/img/flow/crop-pumpkin.jpg" }
  ];
  var prices = { lettuce: 7, tomato: 13, pumpkin: 26 };
  var RIVER_QS = [
    {
      npc: "햇살이", cond: "길이가 6cm보다 길고 8cm보다 짧은 무지개 송어를 찾아 주세요! (1cm = 10mm)",
      opts: [
        { name: "피라미", spec: "5cm 4mm (54mm)", ok: false },
        { name: "무지개 송어", spec: "7cm 2mm (72mm)", ok: true, img: "../assets/img/flow/parts/play-trout.png" },
        { name: "메기", spec: "9cm 1mm (91mm)", ok: false }
      ]
    },
    {
      npc: "몽실", cond: "무게가 1kg(1000g)에 가장 가까운 황금 잉어를 찾아 주세요!",
      opts: [
        { name: "은빛 붕어", spec: "650g", ok: false },
        { name: "황금 잉어", spec: "950g", ok: true, img: "../assets/img/flow/parts/play-goldfish.png" },
        { name: "작은 미꾸라지", spec: "200g", ok: false }
      ]
    },
    {
      npc: "반짝이", cond: "길이가 45mm와 같은 사슴벌레를 찾아 주세요! (1cm = 10mm)",
      opts: [
        { name: "넓적사슴벌레", spec: "4cm 5mm", ok: true, img: "../assets/img/flow/parts/play-beetle.png" },
        { name: "무당벌레", spec: "1cm 2mm", ok: false },
        { name: "장수풍뎅이", spec: "7cm 5mm", ok: false }
      ]
    },
    {
      npc: "삐약이", cond: "두 마리의 무게 합이 1kg(1000g)이 되는 짝꿍 물고기를 골라 주세요!",
      opts: [
        { name: "300g + 500g", spec: "합 800g", ok: false },
        { name: "400g + 600g", spec: "합 1000g (1kg)", ok: true },
        { name: "700g + 500g", spec: "합 1200g", ok: false }
      ]
    }
  ];
  var rIdx = 0, fIdx = 0, gIdx = 0;
  function toast(m) { if (window.G3UI) window.G3UI.toast(m); }
  var FLOWER_QS = [
    { cond: "빨간 꽃 2송이·노란 꽃 2송이 중 2송이를 골라 주황빛(빨강+노랑)이 나오게 해 주세요!", img: "../assets/img/flow/parts/play-orange.png",
      opts: [{ name: "빨강 + 빨강", sub: "빨간빛", ok: false }, { name: "빨강 + 노랑", sub: "주황빛!", ok: true }, { name: "노랑 + 노랑", sub: "노란빛", ok: false }] },
    { cond: "분홍 꽃 1송이·흰 꽃 2송이 중 2송이를 골라 가장 나올 가능성이 높은 색을 골라 주세요!", img: "../assets/img/flow/parts/play-pink.png",
      opts: [{ name: "흰 + 흰", sub: "가능성 높음", ok: true }, { name: "분홍 + 분홍", sub: "불가능 (1송이뿐)", ok: false }, { name: "분홍 + 흰", sub: "가능성 보통", ok: false }] },
    { cond: "파랑 꽃 3송이 중 1송이를 고르면 어떤 색이 반드시 나올까요?", img: "../assets/img/flow/parts/play-blue.png",
      opts: [{ name: "파랑", sub: "반드시!", ok: true }, { name: "빨강", sub: "나올 수 없음", ok: false }, { name: "노랑", sub: "나올 수 없음", ok: false }] }
  ];
  function gridSvg(cells) {
    var out = "<svg class='grid-svg' viewBox='0 0 96 96'>";
    for (var y = 0; y < 4; y++) for (var x = 0; x < 4; x++) {
      var on = cells.indexOf(y * 4 + x) >= 0;
      out += "<rect x='" + (x * 24 + 2) + "' y='" + (y * 24 + 2) + "' width='20' height='20' rx='4' fill='" + (on ? "#4FA85E" : "#FFFDF6") + "' stroke='#E6DFC9'/>";
    }
    return out + "</svg>";
  }
  var GRID_QS = [
    { cond: "원작과 칸 수가 똑같은 합동 그림을 골라 주세요! (원작: 5칸 십자가)",
      base: [1, 4, 5, 6, 9],
      opts: [{ cells: [1, 4, 5, 6, 9], sub: "5칸 십자가", ok: true }, { cells: [0, 1, 2, 3], sub: "4칸 막대", ok: false }, { cells: [0, 1, 4, 5, 8, 9], sub: "6칸 네모", ok: false }] },
    { cond: "좌우 대칭이 되는 그림을 골라 주세요!",
      base: [2, 5, 6, 9, 10],
      opts: [{ cells: [0, 1, 4, 7, 8], sub: "왼쪽 치우침", ok: false }, { cells: [2, 5, 6, 9, 10], sub: "좌우 대칭", ok: true }, { cells: [3, 6, 7, 10, 11], sub: "오른쪽 치우침", ok: false }] }
  ];
  function rollPrices() {
    for (var i = 0; i < CROPS.length; i++) {
      var c = CROPS[i];
      prices[c.id] = c.minP + Math.floor(Math.random() * (c.maxP - c.minP + 1));
    }
    render();
    toast("오늘의 장터 시세가 새로 바뀌었습니다!");
  }
  function render() {
    var mbox = document.getElementById("marketBox");
    var rbox = document.getElementById("riverBox");
    var fbox = document.getElementById("flowerBox");
    var gbox = document.getElementById("gridBox");
    var d = window.G3Store.load();
    var b = d.basket || { lettuce: 0, tomato: 0, pumpkin: 0 };
    if (mbox) {
      var totG = (b.lettuce || 0) * 150 + (b.tomato || 0) * 250 + (b.pumpkin || 0) * 800;
      var weightStr = totG >= 1000 ? (Math.floor(totG / 1000) + "kg " + (totG % 1000) + "g (" + totG + "g)") : (totG + "g");
      var html = "<div class='play-sub'><div><b>수확물 바구니 총 무게: " + weightStr + "</b><span class='hint'> · 텃밭에서 수확하면 바구니에 담깁니다</span></div>"
        + "<button type='button' class='mini-act' data-roll-price='1'>장터 시세 갱신</button></div>";
      html += "<div class='mgrid'>";
      for (var i = 0; i < CROPS.length; i++) {
        var c = CROPS[i];
        var cnt = b[c.id] || 0;
        var pr = prices[c.id];
        var barW = Math.round((pr / 34) * 100);
        html += "<div class='mcard'><div class='plot-head'><img class='crop-thumb' src='" + c.img + "' alt='" + c.name + "'>"
          + "<div><b>" + c.name + " · 보유 " + cnt + "개</b><span>개당 " + c.g + "g · 오늘 시세 ★" + pr + "</span></div></div>"
          + "<div class='pbar'><i style='width:" + barW + "%'></i></div>"
          + "<div class='prow'>"
          + "<button type='button' data-sell='" + c.id + "'" + (cnt < 1 ? " disabled" : "") + ">장터 판매 (★+" + pr + ")</button>"
          + "<button type='button' data-cook='" + c.id + "'" + (cnt < 1 ? " disabled" : "") + ">요리·선물 (씨앗+1·★+5)</button>"
          + "</div></div>";
      }
      html += "</div>";
      mbox.innerHTML = html;
    }
    if (rbox) {
      var q = RIVER_QS[rIdx % RIVER_QS.length];
      var rhtml = "<div class='river-card'><div class='trial-top'><span class='tag'>강가 채집 · " + q.npc + "의 부탁</span><small>" + ((rIdx % RIVER_QS.length) + 1) + "/" + RIVER_QS.length + "</small></div>"
        + "<p class='river-q'>" + q.cond + "</p><div class='rchoices'>";
      for (var j = 0; j < q.opts.length; j++) {
        var oimg = q.opts[j].img ? "<img class='rchoice-img' src='" + q.opts[j].img + "' alt='" + q.opts[j].name + "'>" : "";
        rhtml += "<button type='button' class='rchoice btn-pulse' data-rpick='" + j + "'>" + oimg + "<b>" + q.opts[j].name + "</b><span>" + q.opts[j].spec + "</span></button>";
      }
      rhtml += "</div><p id='riverFb' class='fb' aria-live='polite'></p></div>";
      rbox.innerHTML = rhtml;
    }
    if (fbox) {
      var fq = FLOWER_QS[fIdx % FLOWER_QS.length];
      var fhtml = "<div class='river-card'><div class='trial-top'><span class='tag sun'>꽃 배합 화단 · 가능성 놀이</span><small>" + ((fIdx % FLOWER_QS.length) + 1) + "/" + FLOWER_QS.length + "</small></div>"
        + "<p class='river-q'>" + (fq.img ? "<img class='river-qimg' src='" + fq.img + "' alt='꽃다발'>" : "") + fq.cond + "</p><div class='rchoices'>";
      for (var fi = 0; fi < fq.opts.length; fi++) {
        fhtml += "<button type='button' class='rchoice btn-pulse' data-fpick='" + fi + "'><b>" + fq.opts[fi].name + "</b><span>" + fq.opts[fi].sub + "</span></button>";
      }
      fhtml += "</div><p id='flowerFb' class='fb' aria-live='polite'></p></div>";
      fbox.innerHTML = fhtml;
    }
    if (gbox) {
      var gq = GRID_QS[gIdx % GRID_QS.length];
      var ghtml = "<div class='river-card'><div class='trial-top'><span class='tag'>모눈 그림 감별실 · 합동·대칭</span><small>" + ((gIdx % GRID_QS.length) + 1) + "/" + GRID_QS.length + "</small></div>"
        + "<p class='river-q'>" + gq.cond + "</p>"
        + "<div class='grid-row'><div class='grid-base'><b>원작</b>" + gridSvg(gq.base) + "</div><div class='rchoices grid-picks'>";
      for (var gi = 0; gi < gq.opts.length; gi++) {
        ghtml += "<button type='button' class='rchoice' data-gpick='" + gi + "'>" + gridSvg(gq.opts[gi].cells) + "<span>" + gq.opts[gi].sub + "</span></button>";
      }
      ghtml += "</div></div><p id='gridFb' class='fb' aria-live='polite'></p></div>";
      gbox.innerHTML = ghtml;
    }
  }
  function sell(cropId) {
    var d = window.G3Store.load();
    if (!d.basket || (d.basket[cropId] || 0) < 1) return;
    var gain = prices[cropId] || 6;
    d.basket[cropId] -= 1;
    d.stars += gain;
    window.G3Store.save(d);
    if (window.G3Journal) window.G3Journal.log("장터", cropId + " 장터 판매, 별 +" + gain);
    if (window.G3UI) { window.G3UI.stars(); if (window.G3UI.sfx) window.G3UI.sfx("ok"); }
    render();
    toast("장터에 판매해 별 " + gain + "개를 받았습니다!");
  }
  var GIFT_ORDER = ["mong", "chick", "bunny"];
  var GIFT_NAMES = { mong: "몽실", chick: "삐약이", bunny: "톡톡이" };
  function cook(cropId) {
    var d = window.G3Store.load();
    if (!d.basket || (d.basket[cropId] || 0) < 1) return;
    d.basket[cropId] -= 1;
    d.seeds += 1;
    d.stars += 5;
    if (!d.friends) d.friends = { mong: 0, chick: 0, bunny: 0 };
    if (!d.friendsBonus) d.friendsBonus = {};
    var pick = GIFT_ORDER[0];
    for (var gi = 0; gi < GIFT_ORDER.length; gi++) {
      if ((d.friends[GIFT_ORDER[gi]] || 0) < (d.friends[pick] || 0)) pick = GIFT_ORDER[gi];
    }
    d.friends[pick] = Math.min(5, (d.friends[pick] || 0) + 1);
    var bonusMsg = "";
    if (d.friends[pick] >= 3 && !d.friendsBonus[pick]) {
      d.friendsBonus[pick] = true;
      d.stars += 10;
      bonusMsg = " · " + GIFT_NAMES[pick] + " 3하트 달성 보너스 별 +10!";
    }
    window.G3Store.save(d);
    if (window.G3Journal) window.G3Journal.log("부엌", GIFT_NAMES[pick] + "에게 요리 선물! 친밀도 ♥" + d.friends[pick] + ", 씨앗 +1·별 +5" + bonusMsg);
    if (window.G3Farm) window.G3Farm.render();
    if (window.G3Map && window.G3Map.syncFriends) window.G3Map.syncFriends();
    if (window.G3UI) { window.G3UI.stars(); if (window.G3UI.sfx) window.G3UI.sfx("fanfare"); }
    render();
    toast(GIFT_NAMES[pick] + "에게 요리를 선물했습니다! 친밀도 ♥" + d.friends[pick] + " · 씨앗 +1 · 별 +5" + bonusMsg);
  }
  function pickRiver(idx) {
    var q = RIVER_QS[rIdx % RIVER_QS.length];
    var opt = q.opts[idx];
    var fb = document.getElementById("riverFb");
    if (!opt) return;
    if (opt.ok) {
      var d = window.G3Store.load();
      d.stars += 8;
      window.G3Store.save(d);
      if (window.G3Journal) window.G3Journal.log("채집", opt.name + "(" + opt.spec + ") 채집 성공, 별 +8");
      if (window.G3UI) { window.G3UI.stars(); if (window.G3UI.sfx) window.G3UI.sfx("ok"); }
      if (fb) fb.textContent = "정답! " + opt.name + "(" + opt.spec + ")를 잡아 별 +8개를 받았습니다!";
      setTimeout(function () { rIdx++; render(); }, 1100);
    } else {
      if (window.G3UI && window.G3UI.sfx) window.G3UI.sfx("no");
      if (fb) fb.textContent = opt.name + "는 " + opt.spec + "예요. 조건을 다시 확인해 볼까요?";
    }
  }
  function awardPlay(kind, label) {
    var d = window.G3Store.load();
    d.stars += 8;
    window.G3Store.save(d);
    if (window.G3Journal) window.G3Journal.log("놀이", label + " 성공, 별 +8");
    if (window.G3UI) { window.G3UI.stars(); if (window.G3UI.sfx) window.G3UI.sfx("ok"); }
    toast(label + " 성공! 별 +8개를 받았습니다!");
  }
  function pickFlower(idx) {
    var q = FLOWER_QS[fIdx % FLOWER_QS.length];
    var opt = q.opts[idx];
    var fb = document.getElementById("flowerFb");
    if (!opt) return;
    if (opt.ok) {
      awardPlay("flower", "꽃 배합(" + opt.name + ")");
      if (fb) fb.textContent = "정답! " + opt.name + " → " + opt.sub;
      setTimeout(function () { fIdx++; render(); }, 1100);
    } else {
      if (window.G3UI && window.G3UI.sfx) window.G3UI.sfx("no");
      if (fb) fb.textContent = opt.name + "는 " + opt.sub + "이에요. 가능성을 다시 생각해 볼까요?";
    }
  }
  function pickGrid(idx) {
    var q = GRID_QS[gIdx % GRID_QS.length];
    var opt = q.opts[idx];
    var fb = document.getElementById("gridFb");
    if (!opt) return;
    if (opt.ok) {
      awardPlay("grid", "그림 감별(" + opt.sub + ")");
      if (fb) fb.textContent = "정답! 모눈 칸을 세어 보니 똑같은 합동 그림이네요!";
      setTimeout(function () { gIdx++; render(); }, 1100);
    } else {
      if (window.G3UI && window.G3UI.sfx) window.G3UI.sfx("no");
      if (fb) fb.textContent = "칸 수가 달라요. 원작과 한 칸씩 비교해 보세요.";
    }
  }
  document.addEventListener("click", function (e) {
    var t = e.target.closest ? e.target.closest("[data-roll-price],[data-sell],[data-cook],[data-rpick],[data-fpick],[data-gpick]") : null;
    if (!t) return;
    if (t.hasAttribute("data-roll-price")) rollPrices();
    else if (t.hasAttribute("data-sell")) sell(t.getAttribute("data-sell"));
    else if (t.hasAttribute("data-cook")) cook(t.getAttribute("data-cook"));
    else if (t.hasAttribute("data-rpick")) pickRiver(parseInt(t.getAttribute("data-rpick"), 10));
    else if (t.hasAttribute("data-fpick")) pickFlower(parseInt(t.getAttribute("data-fpick"), 10));
    else if (t.hasAttribute("data-gpick")) pickGrid(parseInt(t.getAttribute("data-gpick"), 10));
  });
  window.G3Play = { render: render };
})();
