(function () {
  var LOW = [
    { grade: 1, cls: "g1", sem: "2학기", tag: "저학년 흐름", places: [
      ["숫자 화단", "100까지의 수 세기"],
      ["더하기 작업실", "덧셈과 뺄셈 첫걸음"],
      ["모양·시계 아틀리에", "모양과 시각 읽기"],
      ["열매 모으기", "덧셈과 뺄셈 두걸음"],
      ["규칙 산책로", "규칙 찾기"],
      ["모둠 천막", "덧셈과 뺄셈 모으기"]
    ], demo: "1학년 데모입구입니다. 큰 그림과 큰 단추로 시작하는 흐름을 보여 줍니다." },
    { grade: 2, cls: "g2", sem: "2학기", tag: "저학년 흐름", places: [
      ["자리수 텃밭", "네 자리 수"],
      ["곱셈 노래방", "곱셈구구"],
      ["길이 재기소", "길이 재기"],
      ["시계 전망대", "시각과 시간"],
      ["관찰 데크", "표와 그래프"],
      ["무늬 산책로", "규칙 찾기"]
    ], demo: "2학년 데모입구입니다. 표와 시계를 그림으로 읽는 흐름을 보여 줍니다." }
  ];
  var HIGH = [
    { grade: 3, cls: "g3", sem: "2학기", tag: "마을 흐름", places: [
      ["곱셈 방앗간", "곱셈"],
      ["나눔 과일정거장", "나눗셈"],
      ["동그라미 시계소", "원"],
      ["조각 피자부엌", "분수"],
      ["되와 무게 실험실", "들이와 무게"],
      ["그림소식 우체통", "그림그래프"]
    ], demo: "3학년 데모입구입니다. 가게 여섯 곳을 도는 구성을 가정합니다." },
    { grade: 4, cls: "g4", sem: "2학기", tag: "마을 흐름", places: [
      ["조각 빵나눔터", "분수"],
      ["세모 지붕소", "삼각형"],
      ["리본 문구점", "소수"],
      ["네모 설계실", "사각형"],
      ["꺾은길 전망대", "꺾은선그래프"],
      ["모자이크 공방", "다각형"]
    ], demo: "4학년 데모입구입니다. 그래프 읽기와 도형 이름 붙이기를 소개합니다." },
    { grade: 5, cls: "g5", sem: "2학기", tag: "마을 흐름", places: [
      ["어림 전망대", "수의 범위"],
      ["분수 과일농장", "분수의 곱셈"],
      ["거울 정원", "합동과 대칭"],
      ["소수 비닐하우스", "소수의 곱셈"],
      ["쌓기 창고", "직육면체"],
      ["기록 텃밭", "평균"]
    ], demo: "5학년 데모입구입니다. 수확물을 재고 나누는 흐름을 소개합니다." },
    { grade: 6, cls: "g6", sem: "2학기", tag: "마을 흐름", places: [
      ["조각 나눔터", "분수"],
      ["꼼꼼 배달소", "소수"],
      ["차곡 건축창고", "공간과 쌓기"],
      ["물감 배합소", "비와 비례"],
      ["동그라미 화단", "원"],
      ["빙글 입체공방", "입체도형"]
    ], demo: "6학년 데모입구입니다. 비례식으로 나누고 비교하는 흐름을 소개합니다." }
  ];
  var TOWNS = [
    { cls: "g3", tag: "3학년 흐름", title: "방앗간과 부엌이 있는 마을", desc: "곱셈과 나눗셈을 상점 오가며 묻고, 분수는 조각 그림으로 설명하는 흐름입니다.", art: "방앗간 언덕", img: "assets/img/flow/town-g3.jpg" },
    { cls: "g4", tag: "4학년 흐름", title: "그래프를 읽고 이름을 붙이는 마을", desc: "시장 그래프를 읽고 도형 이름표가 맞는지 가려보는 흐름입니다.", art: "전망대 마을", img: "assets/img/flow/town-g4.jpg" },
    { cls: "g5", tag: "5학년 흐름", title: "거두고 기록하는 마을", desc: "수확물을 무게 재기·요리·나눔·판매로 이어 쓰는 흐름입니다.", art: "농장 지도", img: "assets/img/flow/town-g5.jpg" },
    { cls: "g6", tag: "6학년 흐름", title: "비율로 나누는 마을", desc: "요리 인분과 나눔 몫을 비로 계산하는 흐름입니다.", art: "배합소 마을", img: "assets/img/flow/town-g6.jpg" }
  ];
  var PLAYS = [
    { tag: "회관", grades: [3, 4, 5, 6], title: "오늘의 도전", desc: "끝낸 차시에서 하루 몇 문제를 뽑아 푸는 흐름입니다. 감점은 두지 않습니다." },
    { tag: "가판대", grades: [4, 5, 6], title: "장터 시세", desc: "요일별 값이 바뀌는 장터에서 그래프·평균·단위량으로 비교합니다." },
    { tag: "화단", grades: [5, 6], title: "꽃 배합", desc: "두 송이를 고르면 원하는 색이 나올 가능성을 묻는 놀이 흐름입니다." },
    { tag: "감별실", grades: [4, 5], title: "그림 감별", desc: "원작과 가져온 그림이 합동·대칭인지 칸을 세어 가려봅니다." },
    { tag: "강가", grades: [4, 5, 6], title: "부탁 들어주기", desc: "길이·무게 조건에 맞는 물고기와 곤충을 찾아 부탁을 들어줍니다." },
    { tag: "텃밭과 부엌", grades: [5, 6], title: "수확물 쓰기", desc: "재기·요리·선물·판매 네 가지로 수확물을 쓰는 흐름입니다." }
  ];
  function el(name, cls, html) {
    var d = document.createElement(name);
    if (cls) d.className = cls;
    if (html) d.innerHTML = html;
    return d;
  }
  function doorCard(item) {
    var a = el("article", "door rise " + item.cls);
    var top = "<div class='door-top'><span class='grade'><b>" + item.grade + "</b>학년</span>";
    top += "<span class='sem'>" + item.sem + "</span><span class='count'>" + item.tag + "</span></div>";
    var list = "<ul class='places'>";
    for (var i = 0; i < item.places.length; i++) {
      list += "<li><i>" + (i + 1) + "</i><span><b>" + item.places[i][0] + "</b> " + item.places[i][1] + "</span></li>";
    }
    list += "</ul>";
    var acts = "<div class='door-actions'><button class='go gi-pulse' type='button' data-grade='" + item.grade + "'>" + item.grade + "학년 마을 열기</button>";
    acts += "<button class='copy-link' type='button' data-grade='" + item.grade + "'>링크 복사</button></div>";
    acts += "<span class='man-link'>데모용입구 · 실제 게임 서버 없음</span>";
    a.innerHTML = top + list + acts;
    return a;
  }
  function renderDoors() {
    var low = document.getElementById("doorsLow");
    var high = document.getElementById("doorsHigh");
    if (low) { for (var i = 0; i < LOW.length; i++) low.appendChild(doorCard(LOW[i])); }
    if (high) { for (var j = 0; j < HIGH.length; j++) high.appendChild(doorCard(HIGH[j])); }
  }
  function renderTowns() {
    var box = document.getElementById("townRows");
    if (!box) return;
    for (var i = 0; i < TOWNS.length; i++) {
      var t = TOWNS[i];
      var row = el("div", "row town " + t.cls + (i % 2 === 1 ? " flip" : ""));
      row.innerHTML = "<div class='media rise'><div class='shot town-art'>" + (t.img ? "<img src='" + t.img + "' alt='" + t.art + "'>" : t.art) + "<span>" + t.tag + " · 새로 그린 상상도</span></div></div>"
        + "<div class='text'><span class='tag'>" + t.tag + "</span><h3>" + t.title + "</h3><p class='lead'>" + t.desc + "</p></div>";
      box.appendChild(row);
    }
  }
  function renderPlays() {
    var box = document.getElementById("playCards");
    if (!box) return;
    for (var i = 0; i < PLAYS.length; i++) {
      var p = PLAYS[i];
      var chips = "";
      for (var j = 0; j < p.grades.length; j++) {
        chips += "<span class='g" + p.grades[j] + "'>" + p.grades[j] + "</span>";
      }
      var c = el("article", "card rise");
      c.innerHTML = "<div class='meta'><span class='tag'>" + p.tag + "</span><span class='g-chips'>" + chips + "</span></div>"
        + "<h3>" + p.title + "</h3><p>" + p.desc + "</p>";
      box.appendChild(c);
    }
  }
  function renderMini() {
    var box = document.getElementById("miniGrades");
    if (!box) return;
    var all = LOW.concat(HIGH);
    for (var i = 0; i < all.length; i++) {
      var b = el("button", "go " + all[i].cls);
      b.type = "button";
      b.setAttribute("data-grade", String(all[i].grade));
      b.textContent = all[i].grade + "학년";
      box.appendChild(b);
    }
  }
  function gradeText(n) {
    var all = LOW.concat(HIGH);
    for (var i = 0; i < all.length; i++) {
      if (all[i].grade === n) return all[i];
    }
    return null;
  }
  var TRIALS = {
    1: {
      mode: "low", unit: "숫자 화단 · 100까지의 수",
      list: [
        {
          q: "그림의 열매 묶음(10개씩 3묶음과 낱개 4개)은 모두 몇 개일까요?",
          svg: "<svg viewBox='0 0 300 90'><rect x='14' y='18' width='56' height='54' rx='10' fill='#FFF0CC' stroke='#F5B23A' stroke-width='2'/><text x='42' y='50' text-anchor='middle' font-family='Jua' font-size='18'>10</text><rect x='80' y='18' width='56' height='54' rx='10' fill='#FFF0CC' stroke='#F5B23A' stroke-width='2'/><text x='108' y='50' text-anchor='middle' font-family='Jua' font-size='18'>10</text><rect x='146' y='18' width='56' height='54' rx='10' fill='#FFF0CC' stroke='#F5B23A' stroke-width='2'/><text x='174' y='50' text-anchor='middle' font-family='Jua' font-size='18'>10</text><circle cx='226' cy='34' r='9' fill='#EE7F62'/><circle cx='252' cy='34' r='9' fill='#EE7F62'/><circle cx='226' cy='58' r='9' fill='#EE7F62'/><circle cx='252' cy='58' r='9' fill='#EE7F62'/></svg>",
          choices: ["24", "34", "43"], a: "34", exp: "10개씩 3묶음은 30, 낱개 4개를 더하면 34예요!"
        },
        {
          q: "모양·시계 아틀리에: 긴바늘이 12, 짧은바늘이 4를 가리키면 몇 시일까요?",
          svg: "<svg viewBox='0 0 300 90'><circle cx='150' cy='45' r='36' fill='#FFFDF6' stroke='#F08FB0' stroke-width='3'/><line x1='150' y1='45' x2='150' y2='18' stroke='#3E3428' stroke-width='2.5' stroke-linecap='round'/><line x1='150' y1='45' x2='170' y2='56' stroke='#EE7F62' stroke-width='3.5' stroke-linecap='round'/><circle cx='150' cy='45' r='3' fill='#3E3428'/><text x='150' y='16' text-anchor='middle' font-size='10' font-family='Jua'>12</text><text x='178' y='62' text-anchor='middle' font-size='10' font-family='Jua'>4</text></svg>",
          choices: ["3시", "4시", "6시"], a: "4시", exp: "긴바늘이 12를 가리킬 때 짧은바늘의 숫자를 읽으면 4시예요!"
        }
      ]
    },
    2: {
      mode: "low", unit: "곱셈 노래방 · 곱셈구구",
      list: [
        {
          q: "한 접시에 사과가 4개씩 3접시 있습니다. 모두 몇 개일까요? (4 × 3)",
          svg: "<svg viewBox='0 0 300 90'><ellipse cx='65' cy='50' rx='36' ry='22' fill='#E3F3DC' stroke='#4FA85E' stroke-width='2'/><text x='65' y='56' text-anchor='middle' font-family='Jua' font-size='18'>🍎×4</text><ellipse cx='150' cy='50' rx='36' ry='22' fill='#E3F3DC' stroke='#4FA85E' stroke-width='2'/><text x='150' y='56' text-anchor='middle' font-family='Jua' font-size='18'>🍎×4</text><ellipse cx='235' cy='50' rx='36' ry='22' fill='#E3F3DC' stroke='#4FA85E' stroke-width='2'/><text x='235' y='56' text-anchor='middle' font-family='Jua' font-size='18'>🍎×4</text></svg>",
          choices: ["8개", "12개", "16개"], a: "12개", exp: "4씩 3묶음은 4 × 3 = 12개입니다!"
        },
        {
          q: "자리수 텃밭: 1000이 2개, 100이 3개이면 얼마일까요?",
          svg: "<svg viewBox='0 0 300 90'><rect x='40' y='22' width='90' height='46' rx='10' fill='#EDE6FA' stroke='#9C86E0' stroke-width='2'/><text x='85' y='50' text-anchor='middle' font-family='Jua' font-size='16'>1000 × 2</text><rect x='160' y='22' width='90' height='46' rx='10' fill='#FFF0CC' stroke='#F5B23A' stroke-width='2'/><text x='205' y='50' text-anchor='middle' font-family='Jua' font-size='16'>100 × 3</text></svg>",
          choices: ["2030", "2300", "3200"], a: "2300", exp: "2000과 300이 모이면 2300입니다!"
        }
      ]
    },
    3: {
      mode: "high", unit: "곱셈 방앗간 · 3학년 전체 마을 지원",
      list: [
        {
          q: "곱셈 방앗간 맛보기: 한 자루에 20kg씩 4자루면 모두 몇 kg일까요? (20 × 4)",
          svg: "<svg viewBox='0 0 300 90'><rect x='24' y='22' width='252' height='46' rx='10' fill='#FFF0CC' stroke='#F5B23A' stroke-width='2'/><text x='150' y='50' text-anchor='middle' font-family='Jua' font-size='17'>20kg × 4자루 = ? kg</text></svg>",
          choices: ["60", "80", "100"], a: "80", exp: "2 × 4 = 8에 0을 붙이면 80입니다. 아래 '3학년 마을 입장하기'로 전체 마을을 산책해 보세요!"
        }
      ]
    },
    4: {
      mode: "high", unit: "꺾은길 전망대 · 꺾은선그래프와 다각형",
      list: [
        {
          q: "월요일 기온이 14°C, 화요일이 19°C일 때 기온은 몇 °C 올랐을까요?",
          svg: "<svg viewBox='0 0 300 90'><rect x='20' y='12' width='260' height='66' rx='10' fill='#FFFDF6' stroke='#6FBAD2' stroke-width='2'/><polyline points='80,60 210,28' fill='none' stroke='#EE7F62' stroke-width='3'/><circle cx='80' cy='60' r='5' fill='#EE7F62'/><circle cx='210' cy='28' r='5' fill='#EE7F62'/><text x='80' y='74' text-anchor='middle' font-size='12' font-family='Jua'>월(14°C)</text><text x='210' y='22' text-anchor='middle' font-size='12' font-family='Jua'>화(19°C)</text></svg>",
          choices: ["4°C", "5°C", "6°C"], a: "5°C", exp: "19 - 14 = 5°C 올랐습니다!"
        },
        {
          q: "세모 지붕소: 두 변의 길이가 같은 삼각형을 무엇이라 부를까요?",
          svg: "<svg viewBox='0 0 300 90'><polygon points='150,14 110,74 190,74' fill='#E3F3DC' stroke='#4FA85E' stroke-width='2.5'/><line x1='124' y1='42' x2='134' y2='46' stroke='#EE7F62' stroke-width='2.5'/><line x1='176' y1='42' x2='166' y2='46' stroke='#EE7F62' stroke-width='2.5'/></svg>",
          choices: ["이등변삼각형", "직각삼각형", "정사각형"], a: "이등변삼각형", exp: "두 변의 길이가 같은 삼각형은 이등변삼각형입니다!"
        }
      ]
    },
    5: {
      mode: "high", unit: "기록 텃밭 · 평균과 합동",
      list: [
        {
          q: "세 바구니에 토마토가 6개, 8개, 10개 들어 있습니다. 한 바구니당 평균 몇 개일까요?",
          svg: "<svg viewBox='0 0 300 90'><rect x='24' y='24' width='72' height='44' rx='8' fill='#E3F3DC' stroke='#4FA85E'/><text x='60' y='52' text-anchor='middle' font-family='Jua'>6개</text><rect x='114' y='24' width='72' height='44' rx='8' fill='#E3F3DC' stroke='#4FA85E'/><text x='150' y='52' text-anchor='middle' font-family='Jua'>8개</text><rect x='204' y='24' width='72' height='44' rx='8' fill='#E3F3DC' stroke='#4FA85E'/><text x='240' y='52' text-anchor='middle' font-family='Jua'>10개</text></svg>",
          choices: ["7개", "8개", "9개"], a: "8개", exp: "(6 + 8 + 10) ÷ 3 = 24 ÷ 3 = 8개입니다!"
        },
        {
          q: "거울 정원: 대칭축을 따라 접었을 때 완전히 겹치는 도형을 무엇이라 할까요?",
          svg: "<svg viewBox='0 0 300 90'><polygon points='150,14 105,45 150,76 195,45' fill='#FFF0CC' stroke='#F5B23A' stroke-width='2.5'/><line x1='150' y1='8' x2='150' y2='82' stroke='#EE7F62' stroke-width='2' stroke-dasharray='4 3'/></svg>",
          choices: ["선대칭도형", "사다리꼴", "평행사변형"], a: "선대칭도형", exp: "한 직선을 따라 접어서 완전히 겹치는 도형은 선대칭도형입니다!"
        }
      ]
    },
    6: {
      mode: "high", unit: "물감 배합소 · 비와 비례식",
      list: [
        {
          q: "노란 물감과 파란 물감을 2 : 3의 비로 섞습니다. 노란 물감이 6스푼이면 파란 물감은 몇 스푼 필요할까요?",
          svg: "<svg viewBox='0 0 300 90'><rect x='28' y='22' width='244' height='46' rx='10' fill='#FFF0CC' stroke='#F5B23A' stroke-width='2'/><text x='150' y='50' text-anchor='middle' font-family='Jua' font-size='17'>2 : 3 = 6 : ?  (전항과 후항 × 3)</text></svg>",
          choices: ["8스푼", "9스푼", "12스푼"], a: "9스푼", exp: "전항이 2 × 3 = 6이 되었으므로 후항도 3 × 3 = 9스푼입니다!"
        },
        {
          q: "동그라미 화단: 반지름이 10m인 원 모양 화단 지름에 원주율(3.14)을 곱한 원주는 몇 m일까요?",
          svg: "<svg viewBox='0 0 300 90'><circle cx='90' cy='45' r='30' fill='#E3F3DC' stroke='#4FA85E' stroke-width='2.5'/><line x1='60' y1='45' x2='120' y2='45' stroke='#EE7F62' stroke-width='2'/><text x='205' y='44' text-anchor='middle' font-family='Jua' font-size='14'>지름 20m × 3.14</text><text x='205' y='64' text-anchor='middle' font-size='12' fill='#7A6A55'>원주 = 지름 × 원주율</text></svg>",
          choices: ["31.4m", "62.8m", "94.2m"], a: "62.8m", exp: "지름이 20m이므로 20 × 3.14 = 62.8m입니다!"
        }
      ]
    }
  };
  renderDoors();
  renderTowns();
  renderPlays();
  renderMini();
  window.GradesDemo = { all: LOW.concat(HIGH), text: gradeText, trials: TRIALS };
})();
