(function () {
  function seasonKey(){
    try {
      var m = (new Date()).getMonth()+1;
      if (m>=3 && m<=5) return "spring";
      if (m>=6 && m<=8) return "summer";
      if (m>=9 && m<=11) return "autumn";
      return "winter";
    } catch(e){ return "spring"; }
  }
  var SEASON_QUESTS = {
    spring: [ { id:"s-spring-1", giver:"햇살이", title:"봄맞이 꽃심기(한정)", desc:"장식 1개 이상 배치해 보자", check:function(d){ return d.deco && d.deco.placed && d.deco.placed.length>=1; }, reward:{stars:3,seeds:2,text:"봄맞이 별 3개 · 씨앗 2개"} } ],
    summer: [ { id:"s-summer-1", giver:"반짝이", title:"여름 물주기(한정)", desc:"텃밭에 작물을 심어 보자", check:function(d){ return d.farm && d.farm.plots && d.farm.plots.some(function(x){return x;}); }, reward:{stars:3,seeds:2,text:"여름 별 3개 · 씨앗 2개"} } ],
    autumn: [ { id:"s-autumn-1", giver:"몽실", title:"가을 수확(한정)", desc:"수확을 1회 이상 해 보자", check:function(d){ return (d.harvests||0)>=1; }, reward:{stars:3,seeds:2,text:"가을 별 3개 · 씨앗 2개"} } ],
    winter: [ { id:"s-winter-1", giver:"반짝이", title:"겨울 별모으기(한정)", desc:"단원 문제를 5문제 이상 풀어 보자", check:function(d){ var s=d.done||{}; var c=0; for(var k in s){ if(s[k]) c++; } return c>=5; }, reward:{stars:4,seeds:2,text:"겨울 별 4개 · 씨앗 2개"} } ]
  };
  function QUESTS() {
    if (window.GRADE_QUESTS && window.GRADE_QUESTS.length) {
      try {
        var base = window.GRADE_QUESTS.slice();
        var sk = seasonKey();
        var sq = SEASON_QUESTS[sk] || [];
        for (var si=0; si<sq.length; si++) {
          var exists = false;
          for (var bi=0; bi<base.length; bi++) if (base[bi].id === sq[si].id) exists = true;
          if (!exists) base.push(sq[si]);
        }
        return base;
      } catch(e) { return window.GRADE_QUESTS; }
    }
    var b2 = BASE_QUESTS.slice();
    try {
      var sk2 = seasonKey();
      var sq2 = SEASON_QUESTS[sk2] || [];
      for (var si2=0; si2<sq2.length; si2++) {
        var exists2 = false;
        for (var bi2=0; bi2<b2.length; bi2++) if (b2[bi2].id === sq2[si2].id) exists2 = true;
        if (!exists2) b2.push(sq2[si2]);
      }
    } catch(e) {}
    return b2;
  }
  var BASE_QUESTS = [
    { id: "q-mul1", giver: "몽실", title: "방앗간 첫 도움", desc: "곱셈 방앗간 1차시를 끝내 주세요.",
      check: function (d) { return !!d.done["mul-1"]; },
      reward: { card: "mong", seeds: 2, text: "몽실 카드와 씨앗 2개" } },
    { id: "q-farm1", giver: "햇살이", title: "텃밭 첫 수확", desc: "작물을 한 번 거두어 주세요.",
      check: function (d) { return d.harvests >= 1; },
      reward: { card: "lettuce", stars: 5, text: "상추 카드와 별 5개" } },
    { id: "q-deco1", giver: "반짝이", title: "우리 집 꾸미기", desc: "빈터 2곳에 소품을 놓아 주세요.",
      check: function (d) { return d.deco.placed.length >= 2; },
      reward: { card: "pinwheel", seeds: 2, text: "바람개비 카드와 씨앗 2개" } },
    { id: "q-mul3", giver: "몽실", title: "올림 정복", desc: "곱셈 방앗간 3차시를 끝내 주세요.",
      check: function (d) { return !!d.done["mul-3"]; },
      reward: { card: "wheat", stars: 15, text: "황금밀 카드와 별 15개" } },
    { id: "q-visit", giver: "지도 탐험대", title: "마을 한 바퀴", desc: "단원 집 6곳을 모두 방문해 주세요.",
      check: function (d) { return Object.keys(d.visits).length >= 6; },
      reward: { card: "map", stars: 10, text: "마을 지도 카드와 별 10개" } },
    { id: "q-divi1", giver: "삐약이", title: "과일 똑같이 나누기", desc: "나눔 과일정거장 1차시를 끝내 주세요.",
      check: function (d) { return !!d.done["divi-1"]; },
      reward: { card: "chick", seeds: 2, text: "삐약이 역장 카드와 씨앗 2개" } },
    { id: "q-circfrac", giver: "톡톡이", title: "둥근 시계와 조각 피자", desc: "동그라미 시계소 1차시와 조각 피자부엌 1차시를 끝내 주세요.",
      check: function (d) { return !!d.done["circ-1"] && !!d.done["frac-1"]; },
      reward: { card: "clockpizza", stars: 15, text: "시계·피자 카드와 별 15개" } },
    { id: "q-meagra", giver: "반짝이", title: "실험실과 우체통 도움", desc: "되와 무게 실험실 1차시와 그림소식 우체통 1차시를 끝내 주세요.",
      check: function (d) { return !!d.done["mea-1"] && !!d.done["gra-1"]; },
      reward: { card: "scaleletter", stars: 20, seeds: 2, text: "저울·우체통 카드와 별 20개·씨앗 2개" } }
  ];
  function toast(m) { if (window.G3UI) window.G3UI.toast(m); }
  function doneIds() {
    var d = window.G3Store.load();
    if (!d.quests) { d.quests = { done: [] }; window.G3Store.save(d); }
    return d.quests.done;
  }
  function render() {
    var box = document.getElementById("questList");
    if (!box) return;
    var d = window.G3Store.load();
    var done = doneIds();
    var list = QUESTS();
    var html = "";
    for (var i = 0; i < list.length; i++) {
      var q = list[i];
      var isDone = done.indexOf(q.id) >= 0;
      var can = !isDone && q.check(d);
      html += "<div class='quest'><b>" + q.title + "</b><span>" + q.giver + "의 부탁: " + q.desc + "</span>";
      html += "<span>보상: " + q.reward.text + "</span>";
      if (isDone) html += "<em>완료!</em>";
      else if (can) html += "<button class='go btn-pulse' data-claim='" + q.id + "'>보상 받기</button>";
      else html += "<em>진행 중…</em>";
      html += "</div>";
    }
    box.innerHTML = html;
  }
  function claim(id) {
    var q = null;
    var list = QUESTS();
    for (var i = 0; i < list.length; i++) if (list[i].id === id) q = list[i];
    if (!q) return;
    var d = window.G3Store.load();
    var done = doneIds();
    if (done.indexOf(id) >= 0 || !q.check(d)) return;
    done.push(id);
    d.quests.done = done;
    if (q.reward.seeds) d.seeds += q.reward.seeds;
    if (q.reward.stars) d.stars += q.reward.stars;
    window.G3Store.save(d);
    if (window.G3Collect) window.G3Collect.unlock(q.reward.card);
    if (window.G3Journal) window.G3Journal.log("부탁", q.title + " 완료, " + q.reward.text);
    if (window.G3UI) window.G3UI.stars();
    render();
    if (window.G3Confetti) window.G3Confetti.burst();
    toast("부탁 완료! " + q.reward.text + "를 받았습니다.");
  }
  function poke() { render(); }
  document.addEventListener("click", function (e) {
    var t = e.target.closest ? e.target.closest("[data-claim]") : null;
    if (t) claim(t.getAttribute("data-claim"));
  });
  window.G3Quests = { render: render, poke: poke };
})();
