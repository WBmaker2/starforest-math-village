(function () {
  var HOUSES = [
    { id: "num", name: "숫자 화단", x: 50, y: 16, npc: "화단지기 씨앗이", npcImg: "npc-mole", houseImg: "house-low-num",
      list: [
        { q: "10개씩 3묶음과 낱개 4개는 모두 몇 개일까요?",
          svg: "<svg viewBox='0 0 300 90'><rect x='14' y='18' width='56' height='54' rx='10' fill='#FFF0CC' stroke='#F5B23A' stroke-width='2'/><text x='42' y='50' text-anchor='middle' font-family='Jua' font-size='18'>10</text><rect x='80' y='18' width='56' height='54' rx='10' fill='#FFF0CC' stroke='#F5B23A' stroke-width='2'/><text x='108' y='50' text-anchor='middle' font-family='Jua' font-size='18'>10</text><rect x='146' y='18' width='56' height='54' rx='10' fill='#FFF0CC' stroke='#F5B23A' stroke-width='2'/><text x='174' y='50' text-anchor='middle' font-family='Jua' font-size='18'>10</text><circle cx='226' cy='34' r='9' fill='#EE7F62'/><circle cx='252' cy='34' r='9' fill='#EE7F62'/><circle cx='226' cy='58' r='9' fill='#EE7F62'/><circle cx='252' cy='58' r='9' fill='#EE7F62'/></svg>",
          choices: ["24", "34", "43"], a: "34", exp: "10이 3묶음이면 30, 낱개 4개를 더하면 34예요!" },
        { q: "10 모형이 5개이면 얼마일까요?",
          svg: "<svg viewBox='0 0 300 90'><rect x='30' y='22' width='48' height='46' rx='8' fill='#EDE6FA' stroke='#9C86E0' stroke-width='2'/><text x='54' y='50' text-anchor='middle' font-family='Jua' font-size='15'>10</text><rect x='90' y='22' width='48' height='46' rx='8' fill='#EDE6FA' stroke='#9C86E0' stroke-width='2'/><text x='114' y='50' text-anchor='middle' font-family='Jua' font-size='15'>10</text><rect x='150' y='22' width='48' height='46' rx='8' fill='#EDE6FA' stroke='#9C86E0' stroke-width='2'/><text x='174' y='50' text-anchor='middle' font-family='Jua' font-size='15'>10</text><text x='240' y='52' text-anchor='middle' font-size='16' font-family='Jua'>× 5개?</text></svg>",
          choices: ["15", "50", "55"], a: "50", exp: "10이 5개이면 50이에요!" },
        { q: "70, 71, 72 다음에 올 수는 몇일까요?",
          svg: "<svg viewBox='0 0 300 90'><rect x='24' y='24' width='72' height='42' rx='10' fill='#E3F3DC' stroke='#4FA85E' stroke-width='2'/><text x='60' y='51' text-anchor='middle' font-family='Jua' font-size='17'>70</text><rect x='114' y='24' width='72' height='42' rx='10' fill='#E3F3DC' stroke='#4FA85E' stroke-width='2'/><text x='150' y='51' text-anchor='middle' font-family='Jua' font-size='17'>71</text><rect x='204' y='24' width='72' height='42' rx='10' fill='#E3F3DC' stroke='#4FA85E' stroke-width='2'/><text x='240' y='51' text-anchor='middle' font-family='Jua' font-size='17'>72</text></svg>",
          choices: ["69", "73", "75"], a: "73", exp: "하나씩 커지니까 다음은 73이에요!" }
      ] },
    { id: "add", name: "더하기 작업실", x: 82, y: 20, npc: "장난감 목수 뚝딱이", npcImg: "npc-chick", houseImg: "house-low-add",
      list: [
        { q: "사과 3개와 배 4개를 합치면 모두 몇 개일까요?",
          svg: "<svg viewBox='0 0 300 90'><circle cx='60' cy='45' r='13' fill='#EE7F62'/><circle cx='100' cy='45' r='13' fill='#EE7F62'/><circle cx='140' cy='45' r='13' fill='#EE7F62'/><text x='180' y='54' font-size='22' font-family='Jua'>+</text><circle cx='215' cy='45' r='13' fill='#F5B23A'/><circle cx='255' cy='45' r='13' fill='#F5B23A'/></svg>",
          choices: ["6개", "7개", "8개"], a: "7개", exp: "3 + 4 = 7개예요!" },
        { q: "6 + 5는 얼마일까요?",
          svg: "<svg viewBox='0 0 300 90'><rect x='40' y='22' width='100' height='46' rx='10' fill='#FFF0CC' stroke='#F5B23A' stroke-width='2'/><text x='90' y='51' text-anchor='middle' font-family='Jua' font-size='18'>6</text><text x='155' y='52' font-size='20' font-family='Jua'>+</text><rect x='175' y='22' width='100' height='46' rx='10' fill='#FFF0CC' stroke='#F5B23A' stroke-width='2'/><text x='225' y='51' text-anchor='middle' font-family='Jua' font-size='18'>5</text></svg>",
          choices: ["10", "11", "12"], a: "11", exp: "6 + 5 = 11이에요!" },
        { q: "9 - 4는 얼마일까요?",
          svg: "<svg viewBox='0 0 300 90'><circle cx='50' cy='45' r='11' fill='#6FBAD2'/><circle cx='86' cy='45' r='11' fill='#6FBAD2'/><circle cx='122' cy='45' r='11' fill='#6FBAD2'/><circle cx='158' cy='45' r='11' fill='#6FBAD2'/><circle cx='194' cy='45' r='11' fill='#E6DFC9'/><circle cx='230' cy='45' r='11' fill='#E6DFC9'/></svg>",
          choices: ["4", "5", "6"], a: "5", exp: "9에서 4를 덜면 5가 남아요!" }
      ] },
    { id: "clock", name: "모양·시계 아틀리에", x: 84, y: 48, npc: "그림 화가 팔레트", npcImg: "npc-bunny", houseImg: "house-low-clock",
      list: [
        { q: "긴바늘이 12, 짧은바늘이 4를 가리킵니다. 몇 시일까요?",
          svg: "<svg viewBox='0 0 300 90'><circle cx='150' cy='45' r='36' fill='#FFFDF6' stroke='#F08FB0' stroke-width='3'/><line x1='150' y1='45' x2='150' y2='18' stroke='#3E3428' stroke-width='2.5' stroke-linecap='round'/><line x1='150' y1='45' x2='170' y2='56' stroke='#EE7F62' stroke-width='3.5' stroke-linecap='round'/><circle cx='150' cy='45' r='3' fill='#3E3428'/></svg>",
          choices: ["3시", "4시", "6시"], a: "4시", exp: "짧은바늘이 가리키는 숫자를 읽으면 4시예요!" },
        { q: "동그라미, 세모, 네모 중 둥근 모양은 무엇일까요?",
          svg: "<svg viewBox='0 0 300 90'><circle cx='70' cy='45' r='24' fill='#F5B23A'/><polygon points='160,22 136,68 184,68' fill='#6FBAD2'/><rect x='220' y='22' width='46' height='46' rx='6' fill='#EE7F62'/></svg>",
          choices: ["동그라미", "세모", "네모"], a: "동그라미", exp: "모서리 없이 둥근 것은 동그라미예요!" },
        { q: "긴바늘이 12, 짧은바늘이 9를 가리킵니다. 몇 시일까요?",
          svg: "<svg viewBox='0 0 300 90'><circle cx='150' cy='45' r='36' fill='#FFFDF6' stroke='#F08FB0' stroke-width='3'/><line x1='150' y1='45' x2='150' y2='18' stroke='#3E3428' stroke-width='2.5' stroke-linecap='round'/><line x1='150' y1='45' x2='126' y2='45' stroke='#EE7F62' stroke-width='3.5' stroke-linecap='round'/><circle cx='150' cy='45' r='3' fill='#3E3428'/></svg>",
          choices: ["9시", "12시", "6시"], a: "9시", exp: "짧은바늘이 9를 가리키면 9시예요!" }
      ] },
    { id: "place", name: "자리수 텃밭", x: 50, y: 82, npc: "밭주인 이랑이", npcImg: "npc-mole", houseImg: "house-low-place",
      list: [
        { q: "1000 모형이 2개이면 얼마일까요?",
          svg: "<svg viewBox='0 0 300 90'><rect x='50' y='22' width='90' height='46' rx='10' fill='#EDE6FA' stroke='#9C86E0' stroke-width='2'/><text x='95' y='50' text-anchor='middle' font-family='Jua' font-size='16'>1000</text><rect x='160' y='22' width='90' height='46' rx='10' fill='#EDE6FA' stroke='#9C86E0' stroke-width='2'/><text x='205' y='50' text-anchor='middle' font-family='Jua' font-size='16'>1000</text></svg>",
          choices: ["200", "2000", "20000"], a: "2000", exp: "1000이 2개이면 2000이에요!" },
        { q: "100 모형이 3개이면 얼마일까요?",
          svg: "<svg viewBox='0 0 300 90'><rect x='40' y='22' width='70' height='46' rx='10' fill='#FFF0CC' stroke='#F5B23A' stroke-width='2'/><text x='75' y='50' text-anchor='middle' font-family='Jua' font-size='16'>100</text><rect x='120' y='22' width='70' height='46' rx='10' fill='#FFF0CC' stroke='#F5B23A' stroke-width='2'/><text x='155' y='50' text-anchor='middle' font-family='Jua' font-size='16'>100</text><rect x='200' y='22' width='70' height='46' rx='10' fill='#FFF0CC' stroke='#F5B23A' stroke-width='2'/><text x='235' y='50' text-anchor='middle' font-family='Jua' font-size='16'>100</text></svg>",
          choices: ["130", "300", "3000"], a: "300", exp: "100이 3개이면 300이에요!" },
        { q: "2345에서 숫자 3은 어느 자리일까요?",
          svg: "<svg viewBox='0 0 300 90'><rect x='28' y='22' width='56' height='46' rx='8' fill='#EDE6FA' stroke='#9C86E0' stroke-width='2'/><text x='56' y='50' text-anchor='middle' font-family='Jua' font-size='16'>2</text><rect x='92' y='22' width='56' height='46' rx='8' fill='#FFF0CC' stroke='#F5B23A' stroke-width='2'/><text x='120' y='50' text-anchor='middle' font-family='Jua' font-size='16'>3</text><rect x='156' y='22' width='56' height='46' rx='8' fill='#E3F3DC' stroke='#4FA85E' stroke-width='2'/><text x='184' y='50' text-anchor='middle' font-family='Jua' font-size='16'>4</text><rect x='220' y='22' width='56' height='46' rx='8' fill='#FBE3D8' stroke='#EE7F62' stroke-width='2'/><text x='248' y='50' text-anchor='middle' font-family='Jua' font-size='16'>5</text></svg>",
          choices: ["천의 자리", "백의 자리", "십의 자리"], a: "백의 자리", exp: "2345에서 3은 백의 자리예요!" }
      ] },
    { id: "song", name: "곱셈 노래방", x: 18, y: 78, npc: "노래 선생님 도레미", npcImg: "npc-chick", houseImg: "house-low-song",
      list: [
        { q: "한 접시에 사과가 4개씩 3접시 있습니다. 모두 몇 개일까요? (4 × 3)",
          svg: "<svg viewBox='0 0 300 90'><ellipse cx='65' cy='50' rx='36' ry='22' fill='#E3F3DC' stroke='#4FA85E' stroke-width='2'/><text x='65' y='56' text-anchor='middle' font-family='Jua' font-size='18'>🍎×4</text><ellipse cx='150' cy='50' rx='36' ry='22' fill='#E3F3DC' stroke='#4FA85E' stroke-width='2'/><text x='150' y='56' text-anchor='middle' font-family='Jua' font-size='18'>🍎×4</text><ellipse cx='235' cy='50' rx='36' ry='22' fill='#E3F3DC' stroke='#4FA85E' stroke-width='2'/><text x='235' y='56' text-anchor='middle' font-family='Jua' font-size='18'>🍎×4</text></svg>",
          choices: ["8개", "12개", "16개"], a: "12개", exp: "4씩 3묶음은 4 × 3 = 12개예요!" },
        { q: "2 × 5는 얼마일까요?",
          svg: "<svg viewBox='0 0 300 90'><rect x='40' y='22' width='100' height='46' rx='10' fill='#E3F3DC' stroke='#4FA85E' stroke-width='2'/><text x='90' y='51' text-anchor='middle' font-family='Jua' font-size='18'>2 × 5</text><text x='170' y='52' font-size='20' font-family='Jua'>= ?</text></svg>",
          choices: ["7", "10", "12"], a: "10", exp: "2가 5묶음이면 10이에요!" },
        { q: "3 × 3은 얼마일까요?",
          svg: "<svg viewBox='0 0 300 90'><circle cx='80' cy='45' r='14' fill='#F5B23A'/><circle cx='130' cy='45' r='14' fill='#F5B23A'/><circle cx='180' cy='45' r='14' fill='#F5B23A'/><text x='228' y='52' font-size='16' font-family='Jua'>× 3?</text></svg>",
          choices: ["6", "9", "12"], a: "9", exp: "3씩 3묶음은 9예요!" }
      ] },
    { id: "deck", name: "관찰 데크", x: 19, y: 20, npc: "쌍안경 탐험가 룰루", npcImg: "npc-bunny", houseImg: "house-low-deck",
      list: [
        { q: "○ △ ○ △ 다음에 올 모양은 무엇일까요?",
          svg: "<svg viewBox='0 0 300 90'><circle cx='60' cy='45' r='20' fill='#F5B23A'/><polygon points='130,25 110,65 150,65' fill='#6FBAD2'/><circle cx='190' cy='45' r='20' fill='#F5B23A'/><polygon points='260,25 240,65 280,65' fill='#6FBAD2'/></svg>",
          choices: ["○", "△", "□"], a: "○", exp: "○와 △가 번갈아 나오니 다음은 ○예요!" },
        { q: "2, 4, 6 다음에 올 수는 몇일까요?",
          svg: "<svg viewBox='0 0 300 90'><rect x='24' y='24' width='60' height='42' rx='10' fill='#E3F3DC' stroke='#4FA85E' stroke-width='2'/><text x='54' y='51' text-anchor='middle' font-family='Jua' font-size='17'>2</text><rect x='100' y='24' width='60' height='42' rx='10' fill='#E3F3DC' stroke='#4FA85E' stroke-width='2'/><text x='130' y='51' text-anchor='middle' font-family='Jua' font-size='17'>4</text><rect x='176' y='24' width='60' height='42' rx='10' fill='#E3F3DC' stroke='#4FA85E' stroke-width='2'/><text x='206' y='51' text-anchor='middle' font-family='Jua' font-size='17'>6</text></svg>",
          choices: ["7", "8", "10"], a: "8", exp: "2씩 커지니까 다음은 8이에요!" },
        { q: "빨강, 파랑, 빨강, 파랑 다음에 올 색은 무엇일까요?",
          svg: "<svg viewBox='0 0 300 90'><circle cx='60' cy='45' r='20' fill='#EE7F62'/><circle cx='130' cy='45' r='20' fill='#6FBAD2'/><circle cx='200' cy='45' r='20' fill='#EE7F62'/><circle cx='260' cy='45' r='20' fill='#E6DFC9' stroke='#9A8568' stroke-width='2' stroke-dasharray='5 4'/></svg>",
          choices: ["빨강", "파랑", "노랑"], a: "파랑", exp: "빨강과 파랑이 번갈아 나오니 다음은 파랑이에요!" }
      ] }
  ];
  var FRIENDS = [
    { name: "몽실", line: "숫자 화단에서 10 모형을 세어 봐!", x: 38, y: 44 },
    { name: "반짝이", line: "관찰 데크에서 규칙을 찾으면 별을 줘!", x: 62, y: 60 }
  ];
  var pos = { x: 50, y: 50 };
  var cur = { house: 0, qi: 0 };
  function store() { return window.G3Store.load(); }
  function toast(m) { if (window.G3UI) window.G3UI.toast(m); }
  function lowDone() {
    var d = store();
    if (!d.lowDone) { d.lowDone = {}; window.G3Store.save(d); }
    return d.lowDone;
  }
  function refreshAvatar() {
    var d = store();
    var a = d.avatar || {};
    var mini = document.getElementById("lowAvMini");
    if (mini && window.G3Avatar && window.G3Avatar.mountRig) window.G3Avatar.mountRig(mini, a);
    var nm = document.getElementById("lowAvName");
    if (nm) nm.textContent = (a.name || "산책 주민") + (a.name ? " 주민" : "");
  }
  function refreshToken() {
    var token = document.getElementById("lowToken");
    if (!token) return;
    var a = store().avatar || {};
    token.innerHTML = "<div class='tk-fig' id='lowTokenRig'></div><em>" + (a.name || "주민") + "</em>";
    var rig = document.getElementById("lowTokenRig");
    if (rig && window.G3Avatar && window.G3Avatar.mountRig) window.G3Avatar.mountRig(rig, a);
  }
  function build() {
    var wrap = document.getElementById("lowMapwrap");
    if (!wrap || wrap.dataset.built) return;
    wrap.dataset.built = "1";
    var token = document.createElement("div");
    token.id = "lowToken";
    wrap.appendChild(token);
    refreshToken();
    moveToken(pos.x, pos.y, true);
    for (var i = 0; i < HOUSES.length; i++) {
      var b = document.createElement("button");
      b.className = "pin low-pin";
      b.style.left = HOUSES[i].x + "%";
      b.style.top = HOUSES[i].y + "%";
      b.textContent = HOUSES[i].name;
      b.setAttribute("data-lowpin", HOUSES[i].id);
      b.setAttribute("aria-label", HOUSES[i].name + " 들어가기");
      wrap.appendChild(b);
    }
    for (var j = 0; j < FRIENDS.length; j++) {
      var f = document.createElement("button");
      f.className = "friend";
      f.style.left = FRIENDS[j].x + "%";
      f.style.top = FRIENDS[j].y + "%";
      f.textContent = FRIENDS[j].name;
      f.setAttribute("data-say", FRIENDS[j].line);
      f.setAttribute("aria-label", FRIENDS[j].name + "의 말 듣기");
      wrap.appendChild(f);
    }
    renderProgress();
  }
  function moveToken(x, y, instant) {
    pos.x = Math.max(4, Math.min(96, x));
    pos.y = Math.max(6, Math.min(94, y));
    var token = document.getElementById("lowToken");
    if (!token) return;
    token.style.transition = instant ? "none" : "left .45s ease-out, top .45s ease-out";
    token.style.left = pos.x + "%";
    token.style.top = pos.y + "%";
    checkNear();
  }
  function checkNear() {
    var best = null, bd = 13;
    for (var i = 0; i < HOUSES.length; i++) {
      var d = Math.hypot(pos.x - HOUSES[i].x, pos.y - HOUSES[i].y);
      if (d < bd) { bd = d; best = HOUSES[i]; }
    }
    var label = document.getElementById("lowNear");
    var btn = document.getElementById("lowEnter");
    if (best) {
      if (label) label.textContent = best.name + " 앞입니다";
      if (btn) { btn.hidden = false; btn.textContent = best.name + " 들어가기"; btn.setAttribute("data-near", best.id); }
    } else {
      if (label) label.textContent = "지도를 눌러 산책하세요";
      if (btn) btn.hidden = true;
    }
  }
  function findHouse(id) {
    for (var i = 0; i < HOUSES.length; i++) if (HOUSES[i].id === id) return HOUSES[i];
    return HOUSES[0];
  }
  function open(id) {
    var h = findHouse(id);
    cur.house = HOUSES.indexOf(h);
    cur.qi = 0;
    var ov = document.getElementById("dlg");
    if (ov) ov.classList.add("show");
    var ni = document.getElementById("npcImg");
    if (ni) ni.src = "../assets/img/flow/" + (h.npcImg || "npc-mole") + ".jpg";
    var hi = document.getElementById("lowHouseImg");
    if (hi) { hi.src = "../assets/img/flow/" + (h.houseImg || "house-low-num") + ".jpg"; hi.alt = h.name + " 그림"; }
    var a = store().avatar || {};
    var av = document.getElementById("dlgAvatar");
    if (av && window.G3Avatar && window.G3Avatar.mountRig) window.G3Avatar.mountRig(av, a);
    var an = document.getElementById("dlgAvName");
    if (an) an.textContent = a.name || "주민";
    say(h.npc + ": 어서 오렴! " + h.name + "이란다.");
    renderQ();
  }
  function say(t) {
    var p = document.getElementById("npcText");
    if (p) p.textContent = t;
  }
  function renderQ() {
    var h = HOUSES[cur.house];
    var item = h.list[cur.qi];
    var box = document.getElementById("dlgBody");
    if (!box) return;
    var html = "<p class='crumb'>" + h.name + " · " + (cur.qi + 1) + "/" + h.list.length + "</p>";
    html += "<div class='trial-svg'>" + item.svg + "</div>";
    html += "<p class='trial-q'>" + item.q + "</p><div class='trial-choices low-mode'>";
    for (var i = 0; i < item.choices.length; i++) {
      html += "<button type='button' class='trial-choice gi-pulse' data-lowchoice='" + item.choices[i] + "'>" + item.choices[i] + "</button>";
    }
    html += "</div><p id='lowFb' class='trial-fb' aria-live='polite'></p>";
    box.innerHTML = html;
  }
  function answer(pick) {
    var h = HOUSES[cur.house];
    var item = h.list[cur.qi];
    var fb = document.getElementById("lowFb");
    if (pick === item.a) {
      var key = h.id + "-" + cur.qi;
      var d = store();
      if (!d.lowDone) d.lowDone = {};
      var first = !d.lowDone[key];
      if (first) {
        d.lowDone[key] = true;
        d.stars += 10;
        d.seeds += 1;
        window.G3Store.save(d);
        if (window.G3UI) window.G3UI.stars();
      }
      if (window.G3UI && window.G3UI.sfx) window.G3UI.sfx("ok");
      renderProgress();
      if (fb) fb.innerHTML = "<b>정답! ★+10 · 씨앗 +1</b> " + item.exp + " <button type='button' class='trial-next gi-pulse' data-lownext='1'>" + (cur.qi + 1 < h.list.length ? "다음 문제 →" : "마을로 돌아가기") + "</button>";
    } else {
      if (window.G3UI && window.G3UI.sfx) window.G3UI.sfx("no");
      if (fb) fb.textContent = "그림을 다시 살펴볼까요? " + item.exp;
    }
  }
  function next() {
    var h = HOUSES[cur.house];
    if (cur.qi + 1 < h.list.length) { cur.qi++; renderQ(); }
    else {
      var ov = document.getElementById("dlg");
      if (ov) ov.classList.remove("show");
      toast(h.name + " 탐험 완료! 참 잘했어요!");
      if (window.G3Confetti && window.G3Confetti.burst) window.G3Confetti.burst();
    }
  }
  function renderProgress() {
    var done = lowDone();
    var keys = Object.keys(done);
    var t = document.getElementById("lowProgText");
    if (t) t.textContent = "푼 문제 " + keys.length + "/18 · 별과 씨앗이 3학년 마을과 함께 쌓입니다!";
    var grid = document.getElementById("lowProgGrid");
    if (grid) {
      var html = "";
      for (var i = 0; i < HOUSES.length; i++) {
        var c = 0;
        for (var j = 0; j < HOUSES[i].list.length; j++) if (done[HOUSES[i].id + "-" + j]) c++;
        var st = c >= HOUSES[i].list.length ? "완료!" : (c > 0 ? "도전 중 (" + c + "/3)" : "아직 안 풀었어요");
        html += "<button class='mapcell' data-lowenter='" + HOUSES[i].id + "'><b>" + HOUSES[i].name + "</b><span>" + st + "</span></button>";
      }
      grid.innerHTML = html;
    }
  }
  function init() {
    build();
    refreshAvatar();
    if (window.G3UI) { window.G3UI.tabs(); window.G3UI.stars(); }
    var wrap = document.getElementById("lowMapwrap");
    if (wrap) wrap.addEventListener("click", function (e) {
      var pin = e.target.closest ? e.target.closest("[data-lowpin]") : null;
      if (pin) {
        var id = pin.getAttribute("data-lowpin");
        var h = findHouse(id);
        moveToken(h.x, h.y + 7);
        open(id);
        return;
      }
      var s = e.target.closest ? e.target.closest("[data-say]") : null;
      if (s) { toast(s.textContent + ": " + s.getAttribute("data-say")); return; }
      if (e.target.closest && e.target.closest("#lowToken")) return;
      var r = wrap.getBoundingClientRect();
      moveToken((e.clientX - r.left) / r.width * 100, (e.clientY - r.top) / r.height * 100);
    });
    var btn = document.getElementById("lowEnter");
    if (btn) btn.addEventListener("click", function () {
      var id = btn.getAttribute("data-near");
      if (id) open(id);
    });
    var held = { up: false, down: false, left: false, right: false };
    var KEYMAP = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right", w: "up", s: "down", a: "left", d: "right", W: "up", S: "down", A: "left", D: "right" };
    window.addEventListener("keydown", function (e) {
      var dir = KEYMAP[e.key];
      if (!dir) return;
      e.preventDefault();
      step(dir);
    });
    document.addEventListener("pointerdown", function (e) {
      var t = e.target.closest ? e.target.closest(".dpad [data-move]") : null;
      if (t) step(t.getAttribute("data-move"));
    });
    document.addEventListener("click", function (e) {
      var c = e.target.closest ? e.target.closest("[data-lowchoice]") : null;
      if (c) { answer(c.getAttribute("data-lowchoice")); return; }
      var n = e.target.closest ? e.target.closest("[data-lownext]") : null;
      if (n) { next(); return; }
      var g = e.target.closest ? e.target.closest("[data-lowenter]") : null;
      if (g) { open(g.getAttribute("data-lowenter")); return; }
    });
    var x = document.getElementById("dlgClose");
    if (x) x.addEventListener("click", function () {
      var ov = document.getElementById("dlg");
      if (ov) ov.classList.remove("show");
    });
  }
  function step(dir) {
    var s = 2.6;
    if (dir === "up") moveToken(pos.x, pos.y - s);
    if (dir === "down") moveToken(pos.x, pos.y + s);
    if (dir === "left") moveToken(pos.x - s, pos.y);
    if (dir === "right") moveToken(pos.x + s, pos.y);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
