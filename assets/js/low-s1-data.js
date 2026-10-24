(function () {
  // 1·2학년 1학기 (아이스크림 순서). sem=1일 때 g3-sem.js가 LowData와 LOWGEN을 교체한다.
  function svgBox(text) {
    return "<svg viewBox='0 0 300 90'><rect x='60' y='18' width='180' height='54' rx='12' fill='#FFF0CC' stroke='#F5B23A' stroke-width='2'/><text x='150' y='52' text-anchor='middle' font-family='Jua' font-size='18'>" + text + "</text></svg>";
  }
  var G1S1 = [
    { id: "s1-nine", name: "씨앗 숫자밭", x: 50, y: 14, npc: "화단지기 씨앗이", npcImg: "npc-mole", houseImg: "house-low-num",
      list: [
        { q: "사과가 5개 있습니다. 1개 더 가져오면 몇 개일까요?", svg: svgBox("🍎×5 + 1"), choices: ["5개", "6개", "7개"], a: "6개", exp: "5에서 1만큼 더 크면 6이에요!" },
        { q: "9, 8, 7 순서대로 작아집니다. 7 다음에 올 수는 몇일까요?", svg: svgBox("9 → 8 → 7 → ?"), choices: ["5", "6", "8"], a: "6", exp: "1만큼 더 작아지니까 6이에요!" },
        { q: "0은 1보다 클까요, 작을까요?", svg: svgBox("0 ○ 1"), choices: ["크다", "같다", "작다"], a: "작다", exp: "0은 1보다 1만큼 작아요!" }
      ] },
    { id: "s1-shape", name: "모양 공작소", x: 23, y: 30, npc: "그림 화가 팔레트", npcImg: "npc-bunny", houseImg: "house-low-clock",
      list: [
        { q: "둥글고 모서리가 없는 모양은 무엇일까요?", svg: svgBox("○ △ □"), choices: ["동그라미", "세모", "네모"], a: "동그라미", exp: "모서리 없이 둥근 것은 동그라미예요!" },
        { q: "상자 모양(네모)을 옆에서 보면 어떤 모양일까요?", svg: svgBox("📦 → □"), choices: ["세모", "네모", "동그라미"], a: "네모", exp: "상자 면은 네모예요!" },
        { q: "공 모양을 정면에서 보면 무엇일까요?", svg: svgBox("⚽ → ?"), choices: ["세모", "네모", "동그라미"], a: "동그라미", exp: "공은 어느 방향에서도 둥글어요!" }
      ] },
    { id: "s1-addsub", name: "모으기 나눔터", x: 80, y: 30, npc: "장난감 목수 뚝딱이", npcImg: "npc-chick", houseImg: "house-low-add",
      list: [
        { q: "3과 4를 모으면 얼마일까요? (3 + 4)", svg: svgBox("3 + 4"), choices: ["6", "7", "8"], a: "7", exp: "3 + 4 = 7이에요! 모으기는 덧셈이에요." },
        { q: "7을 3과 몇으로 가를 수 있을까요? (7 - 3 = ?)", svg: svgBox("7 - 3"), choices: ["3", "4", "5"], a: "4", exp: "7에서 3을 덜면 4가 남아요!" },
        { q: "5 + 2는 얼마일까요?", svg: svgBox("5 + 2"), choices: ["6", "7", "8"], a: "7", exp: "5 + 2 = 7이에요!" }
      ] },
    { id: "s1-compare", name: "자 비교다리", x: 79, y: 59, npc: "다람쥐 아줌마 토실이", npcImg: "npc-chick", houseImg: "house-low-deck",
      list: [
        { q: "연필과 지우개 중 더 긴 것은 무엇일까요? (연필이 더 깁니다)", svg: svgBox("✏️ ＞ 🧽"), choices: ["연필", "지우개", "같다"], a: "연필", exp: "길이를 나란히 대면 연필이 더 길어요!" },
        { q: "사과 3개와 배 5개 중 더 많은 것은 무엇일까요?", svg: svgBox("🍎3 ○ 🍐5"), choices: ["사과", "배", "같다"], a: "배", exp: "5가 3보다 크니 배가 더 많아요!" },
        { q: "키가 120cm와 115cm인 친구 중 더 큰 친구는 몇 cm일까요?", svg: svgBox("120 ○ 115"), choices: ["115cm", "120cm", "같다"], a: "120cm", exp: "120이 115보다 크니 120cm 친구가 더 커요!" }
      ] },
    { id: "s1-fifty", name: "50 열매밭", x: 24, y: 59, npc: "산책 안내원 나뭇잎", npcImg: "npc-bunny", houseImg: "house-low-num",
      list: [
        { q: "10개씩 4묶음은 모두 몇 개일까요?", svg: svgBox("10 × 4"), choices: ["30", "40", "50"], a: "40", exp: "10이 4묶음이면 40이에요!" },
        { q: "42, 43, 44 다음에 올 수는 몇일까요?", svg: svgBox("42 → 43 → 44 → ?"), choices: ["43", "45", "46"], a: "45", exp: "하나씩 커지니까 다음은 45예요!" },
        { q: "38과 41 중 더 큰 수는 몇일까요?", svg: svgBox("38 ○ 41"), choices: ["38", "41", "같다"], a: "41", exp: "십의 자리가 4인 41이 더 커요!" }
      ] }
  ];
  var G2S1 = [
    { id: "s1-three", name: "자리수 논밭", x: 30, y: 20, npc: "밭지기 두더지", npcImg: "npc-mole", houseImg: "house-low-num",
      list: [
        { q: "100 모형이 3개이면 얼마일까요?", svg: svgBox("100 × 3"), choices: ["200", "300", "400"], a: "300", exp: "100이 3개이면 300이에요!" },
        { q: "245에서 백의 자리 숫자는 얼마를 나타낼까요?", svg: svgBox("245"), choices: ["40", "200", "5"], a: "200", exp: "백의 자리 2는 200을 나타내요!" },
        { q: "389와 398 중 더 큰 수는 몇일까요?", svg: svgBox("389 ○ 398"), choices: ["389", "398", "같다"], a: "398", exp: "십의 자리가 9인 398이 더 커요!" }
      ] },
    { id: "s1-fig", name: "도형 놀이집", x: 70, y: 20, npc: "그림 화가 팔레트", npcImg: "npc-bunny", houseImg: "house-low-clock",
      list: [
        { q: "네 각이 모두 직각인 사각형은 무엇일까요?", svg: svgBox("▭ ?"), choices: ["직사각형", "세모", "동그라미"], a: "직사각형", exp: "네 각이 직각이면 직사각형이에요!" },
        { q: "원뿔을 옆에서 보면 어떤 모양일까요?", svg: svgBox("🍦 → ?"), choices: ["세모", "네모", "동그라미"], a: "세모", exp: "원뿔 옆모습은 세모처럼 보여요!" },
        { q: "상자를 쌓아 만든 모양에서 보이는 도형은?", svg: svgBox("🧱🧱"), choices: ["네모", "세모", "동그라미"], a: "네모", exp: "상자 면은 네모로 보여요!" }
      ] },
    { id: "s1-add", name: "덧뺄셈 물레방아", x: 22, y: 55, npc: "장난감 목수 뚝딱이", npcImg: "npc-chick", houseImg: "house-low-add",
      list: [
        { q: "23 + 14는 얼마일까요?", svg: svgBox("23 + 14"), choices: ["36", "37", "38"], a: "37", exp: "20+10=30, 3+4=7 → 37이에요!" },
        { q: "45 - 12는 얼마일까요?", svg: svgBox("45 - 12"), choices: ["32", "33", "34"], a: "33", exp: "40-10=30, 5-2=3 → 33이에요!" },
        { q: "34 + 25는 얼마일까요?", svg: svgBox("34 + 25"), choices: ["58", "59", "60"], a: "59", exp: "30+20=50, 4+5=9 → 59예요!" }
      ] },
    { id: "s1-len", name: "자 대여소", x: 78, y: 55, npc: "자 장수 길쭉이", npcImg: "npc-mole", houseImg: "house-low-deck",
      list: [
        { q: "연필 길이가 자 눈금 0부터 12까지입니다. 몇 cm일까요?", svg: svgBox("0 → 12cm"), choices: ["11cm", "12cm", "13cm"], a: "12cm", exp: "0부터 12까지이면 12cm예요!" },
        { q: "리본 20cm와 15cm를 이으면 모두 몇 cm일까요?", svg: svgBox("20 + 15cm"), choices: ["34cm", "35cm", "36cm"], a: "35cm", exp: "20 + 15 = 35cm예요!" },
        { q: "지우개 길이가 약 몇 cm일까요? (손가락 두 마디쯤)", svg: svgBox("🧽 ≈ ?cm"), choices: ["3cm", "30cm", "3m"], a: "3cm", exp: "지우개는 3cm쯤이 어울려요!" }
      ] },
    { id: "s1-sort", name: "분류 우체통", x: 50, y: 75, npc: "우체국 집배원 빠름이", npcImg: "npc-bunny", houseImg: "house-low-deck",
      list: [
        { q: "빨간 공과 파란 공을 색깔대로 나누면 기준은 무엇일까요?", svg: svgBox("🔴🔵 → ?"), choices: ["색깔", "크기", "모양"], a: "색깔", exp: "색깔이 다르면 색깔대로 나눠요!" },
        { q: "동물과 식물 카드를 나누면 기준은 무엇일까요?", svg: svgBox("🐶🌷 → ?"), choices: ["종류", "색깔", "크기"], a: "종류", exp: "사는 것이 다르면 종류대로 나눠요!" },
        { q: "네모와 세모를 나누면 기준은 무엇일까요?", svg: svgBox("□△ → ?"), choices: ["모양", "색깔", "크기"], a: "모양", exp: "생긴 게 다르면 모양대로 나눠요!" }
      ] },
    { id: "s1-mul", name: "묶음 노래방앗간", x: 50, y: 40, npc: "노래방 주인 흥얼이", npcImg: "npc-chick", houseImg: "house-low-add",
      list: [
        { q: "한 접시에 사과가 4개씩 3접시 있습니다. 모두 몇 개일까요? (4 × 3)", svg: svgBox("🍎×4 × 3접시"), choices: ["8개", "12개", "16개"], a: "12개", exp: "4씩 3묶음은 4 × 3 = 12개예요!" },
        { q: "2씩 5묶음은 얼마일까요? (2 × 5)", svg: svgBox("2 × 5"), choices: ["8", "10", "12"], a: "10", exp: "2를 5번 더하면 10이에요!" },
        { q: "3 × 4는 얼마일까요?", svg: svgBox("3 × 4"), choices: ["11", "12", "13"], a: "12", exp: "3씩 4묶음이면 12예요!" }
      ] }
  ];
  window.LowS1Data = { g1: G1S1, g2: G2S1 };
  function sRnd(n, m) { return n + Math.floor(Math.random() * (m - n + 1)); }
  function sNumSvg(text) {
    return "<svg viewBox='0 0 300 90'><rect x='60' y='18' width='180' height='54' rx='12' fill='#FFF0CC' stroke='#F5B23A' stroke-width='2'/><text x='150' y='52' text-anchor='middle' font-family='Jua' font-size='18'>" + text + "</text></svg>";
  }
  function sMk(q, a, exp, svg, distract) {
    var arr = [a].concat(distract).slice(0, 3);
    for (var i = arr.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = arr[i]; arr[i] = arr[j]; arr[j] = t; }
    return { q: q, a: a, exp: exp, svg: svg, choices: arr };
  }
  window.LOWGEN_S1 = {
    "s1-nine": function () {
      var out = [];
      for (var i = 0; i < 3; i++) { var a = sRnd(2, 9); out.push(sMk(a + " 다음에 올 수는 몇일까요?", String(a + 1), a + "에서 1만큼 더 크면 " + (a + 1) + "예요!", sNumSvg(a + " → ?"), [String(a + 2), String(a - 1), String(a)])); }
      return out;
    },
    "s1-shape": function () {
      var out = [];
      var shapes = ["동그라미", "세모", "네모"];
      for (var i = 0; i < 3; i++) { var s = shapes[sRnd(0, 2)]; out.push(sMk("모서리 없이 둥근 모양은 무엇일까요?", "동그라미", "모서리 없이 둥근 것은 동그라미예요!", sNumSvg("○ △ □"), shapes.filter(function (x) { return x !== "동그라미"; }))); }
      return out;
    },
    "s1-addsub": function () {
      var out = [];
      for (var i = 0; i < 3; i++) { var a = sRnd(2, 9), b = sRnd(2, 9); out.push(sMk(a + " + " + b + "는 얼마일까요?", String(a + b), a + " + " + b + " = " + (a + b) + "예요!", sNumSvg(a + " + " + b), [String(a + b + 1), String(a + b - 1), String(a + b + 2)])); }
      return out;
    },
    "s1-compare": function () {
      var out = [];
      for (var i = 0; i < 3; i++) { var a = sRnd(10, 49), b = sRnd(10, 49); if (a === b) b = a + 1; var ans = a > b ? String(a) : String(b); var dis = [String(a), String(b), "같다"].filter(function (x) { return x !== ans; }); out.push(sMk(a + "와 " + b + " 중 더 큰 수는 몇일까요?", ans, "수를 비교하면 " + ans + "이(가) 더 커요!", sNumSvg(a + " ○ " + b), dis)); }
      return out;
    },
    "s1-fifty": function () {
      var out = [];
      for (var i = 0; i < 3; i++) { var k = sRnd(2, 5), n = sRnd(1, 9); var ans = String(k * 10 + n); out.push(sMk("10개씩 " + k + "묶음과 낱개 " + n + "개는 모두 몇 개일까요?", ans, "10이 " + k + "묶음이면 " + (k * 10) + ", 낱개 " + n + "개를 더하면 " + ans + "예요!", sNumSvg("10 × " + k + " + " + n), [String(k * 10 + n + 1), String(k * 10 + n - 1), String(k * 10 + n + 10)])); }
      return out;
    },
    "s1-three": function () {
      var out = [];
      for (var i = 0; i < 3; i++) { var k = sRnd(2, 5); out.push(sMk("100 모형이 " + k + "개이면 얼마일까요?", String(k * 100), "100이 " + k + "개이면 " + (k * 100) + "이에요!", sNumSvg("100 × " + k), [String(k * 100 + 100), String(k * 100 - 100), String(k * 10)])); }
      return out;
    },
    "s1-fig": function () {
      var out = [];
      for (var i = 0; i < 3; i++) out.push(sMk("네 각이 모두 직각인 사각형은 무엇일까요?", "직사각형", "네 각이 직각이면 직사각형이에요!", sNumSvg("▭"), ["세모", "동그라미", "마름모"]));
      return out;
    },
    "s1-add": function () {
      var out = [];
      for (var i = 0; i < 3; i++) { var a = sRnd(11, 40), b = sRnd(11, 40); out.push(sMk(a + " + " + b + "는 얼마일까요?", String(a + b), a + " + " + b + " = " + (a + b) + "예요!", sNumSvg(a + " + " + b), [String(a + b + 1), String(a + b - 1), String(a + b + 10)])); }
      return out;
    },
    "s1-len": function () {
      var out = [];
      for (var i = 0; i < 3; i++) { var L = sRnd(5, 20); out.push(sMk("자 눈금 0부터 " + L + "까지입니다. 몇 cm일까요?", L + "cm", "0부터 " + L + "까지이면 " + L + "cm예요!", sNumSvg("0 → " + L + "cm"), [(L + 1) + "cm", (L - 1) + "cm", (L + 2) + "cm"])); }
      return out;
    },
    "s1-sort": function () {
      var out = [];
      for (var i = 0; i < 3; i++) out.push(sMk("빨간 공과 파란 공을 나누는 기준은 무엇일까요?", "색깔", "색이 다르면 색깔대로 나눠요!", sNumSvg("🔴 🔵"), ["크기", "모양", "무게"]));
      return out;
    },
    "s1-mul": function () {
      var out = [];
      for (var i = 0; i < 3; i++) { var a = sRnd(2, 5), b = sRnd(2, 4); out.push(sMk(a + "씩 " + b + "묶음은 얼마일까요? (" + a + " × " + b + ")", String(a * b), a + "씩 " + b + "묶음이면 " + (a * b) + "예요!", sNumSvg(a + " × " + b), [String(a * b + a), String(a * b - a), String(a * b + 1)])); }
      return out;
    }
  };
  if (window.LowPad && window.LowPad.generate) {
    var _origGen = window.LowPad.generate;
    window.LowPad.generate = function (grade, houseId, level) {
      var s = "2";
      try { var q = (location.search || "").match(/[?&]sem=([12])/); if (q) s = q[1]; } catch (e) {}
      if (s === "1" && window.LOWGEN_S1 && window.LOWGEN_S1[houseId]) return window.LOWGEN_S1[houseId]();
      return _origGen(grade, houseId, level);
    };
  }
})();
