(function () {
  var G1 = [
    { id: "g1-num", name: "숫자 화단", x: 50, y: 14, npc: "화단지기 씨앗이", npcImg: "npc-mole", houseImg: "house-low-num",
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
    { id: "g1-add", name: "더하기 작업실", x: 23, y: 30, npc: "장난감 목수 뚝딱이", npcImg: "npc-chick", houseImg: "house-low-add",
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
    { id: "g1-shape", name: "모양·시계 아틀리에", x: 80, y: 30, npc: "그림 화가 팔레트", npcImg: "npc-bunny", houseImg: "house-low-clock",
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
    { id: "g1-fruit", name: "열매 모으기", x: 79, y: 59, npc: "다람쥐 아줌마 토실이", npcImg: "npc-chick", houseImg: "house-low-add",
      list: [
        { q: "바구니에 밤이 5개, 도토리가 3개 있습니다. 모두 몇 개일까요?",
          svg: "<svg viewBox='0 0 300 90'><ellipse cx='80' cy='50' rx='40' ry='24' fill='#E3F3DC' stroke='#4FA85E' stroke-width='2'/><text x='80' y='56' text-anchor='middle' font-family='Jua' font-size='18'>🌰×5</text><ellipse cx='210' cy='50' rx='40' ry='24' fill='#FFF0CC' stroke='#F5B23A' stroke-width='2'/><text x='210' y='56' text-anchor='middle' font-family='Jua' font-size='18'>🍂×3</text></svg>",
          choices: ["7개", "8개", "9개"], a: "8개", exp: "5 + 3 = 8개예요! 열매를 한데 모아 세어 보세요." },
        { q: "7 + 2 + 1은 얼마일까요? (세 수 더하기)",
          svg: "<svg viewBox='0 0 300 90'><rect x='30' y='22' width='60' height='46' rx='10' fill='#FFF0CC' stroke='#F5B23A' stroke-width='2'/><text x='60' y='51' text-anchor='middle' font-family='Jua' font-size='18'>7</text><text x='100' y='52' font-size='18' font-family='Jua'>+</text><rect x='120' y='22' width='60' height='46' rx='10' fill='#E3F3DC' stroke='#4FA85E' stroke-width='2'/><text x='150' y='51' text-anchor='middle' font-family='Jua' font-size='18'>2</text><text x='190' y='52' font-size='18' font-family='Jua'>+</text><rect x='210' y='22' width='60' height='46' rx='10' fill='#FBE3D8' stroke='#EE7F62' stroke-width='2'/><text x='240' y='51' text-anchor='middle' font-family='Jua' font-size='18'>1</text></svg>",
          choices: ["9", "10", "11"], a: "10", exp: "7 + 2 = 9, 9 + 1 = 10이에요! 10 만들기를 떠올려 보세요." },
        { q: "10개에서 3개를 먹으면 몇 개가 남을까요?",
          svg: "<svg viewBox='0 0 300 90'><circle cx='50' cy='45' r='11' fill='#EE7F62'/><circle cx='86' cy='45' r='11' fill='#EE7F62'/><circle cx='122' cy='45' r='11' fill='#EE7F62'/><circle cx='158' cy='45' r='11' fill='#E6DFC9'/><circle cx='194' cy='45' r='11' fill='#E6DFC9'/><circle cx='230' cy='45' r='11' fill='#E6DFC9'/></svg>",
          choices: ["6개", "7개", "8개"], a: "7개", exp: "10 - 3 = 7개예요!" }
      ] },
    { id: "g1-rule", name: "규칙 산책로", x: 24, y: 59, npc: "산책 안내원 나뭇잎", npcImg: "npc-bunny", houseImg: "house-low-deck",
      list: [
        { q: "○ △ ○ △ 다음에 올 모양은 무엇일까요?",
          svg: "<svg viewBox='0 0 300 90'><circle cx='60' cy='45' r='20' fill='#F5B23A'/><polygon points='130,25 110,65 150,65' fill='#6FBAD2'/><circle cx='190' cy='45' r='20' fill='#F5B23A'/><polygon points='260,25 240,65 280,65' fill='#6FBAD2'/></svg>",
          choices: ["○", "△", "□"], a: "○", exp: "○와 △가 번갈아 나오니 다음은 ○예요!" },
        { q: "1, 3, 5 다음에 올 수는 몇일까요?",
          svg: "<svg viewBox='0 0 300 90'><rect x='24' y='24' width='60' height='42' rx='10' fill='#E3F3DC' stroke='#4FA85E' stroke-width='2'/><text x='54' y='51' text-anchor='middle' font-family='Jua' font-size='17'>1</text><rect x='100' y='24' width='60' height='42' rx='10' fill='#E3F3DC' stroke='#4FA85E' stroke-width='2'/><text x='130' y='51' text-anchor='middle' font-family='Jua' font-size='17'>3</text><rect x='176' y='24' width='60' height='42' rx='10' fill='#E3F3DC' stroke='#4FA85E' stroke-width='2'/><text x='206' y='51' text-anchor='middle' font-family='Jua' font-size='17'>5</text></svg>",
          choices: ["6", "7", "8"], a: "7", exp: "2씩 커지니까 다음은 7이에요!" },
        { q: "빨강, 파랑, 빨강, 파랑 다음에 올 색은 무엇일까요?",
          svg: "<svg viewBox='0 0 300 90'><circle cx='60' cy='45' r='20' fill='#EE7F62'/><circle cx='130' cy='45' r='20' fill='#6FBAD2'/><circle cx='200' cy='45' r='20' fill='#EE7F62'/><circle cx='260' cy='45' r='20' fill='#E6DFC9' stroke='#9A8568' stroke-width='2' stroke-dasharray='5 4'/></svg>",
          choices: ["빨강", "파랑", "노랑"], a: "파랑", exp: "빨강과 파랑이 번갈아 나오니 다음은 파랑이에요!" }
      ] },
    { id: "g1-group", name: "모둠 천막", x: 50, y: 75, npc: "모둠 반장 별님이", npcImg: "npc-mole", houseImg: "house-low-place",
      list: [
        { q: "10을 4와 몇으로 가를 수 있을까요? (4 + ? = 10)",
          svg: "<svg viewBox='0 0 300 90'><rect x='40' y='22' width='100' height='46' rx='10' fill='#FFF0CC' stroke='#F5B23A' stroke-width='2'/><text x='90' y='51' text-anchor='middle' font-family='Jua' font-size='18'>4</text><text x='155' y='52' font-size='20' font-family='Jua'>+</text><rect x='175' y='22' width='100' height='46' rx='10' fill='#E3F3DC' stroke='#4FA85E' stroke-width='2'/><text x='225' y='51' text-anchor='middle' font-family='Jua' font-size='18'>?</text></svg>",
          choices: ["5", "6", "7"], a: "6", exp: "4 + 6 = 10이에요! 10 가르고 모으기를 연습해요." },
        { q: "9 + 4는 얼마일까요? (10 만들어 더하기)",
          svg: "<svg viewBox='0 0 300 90'><rect x='40' y='22' width='100' height='46' rx='10' fill='#FFF0CC' stroke='#F5B23A' stroke-width='2'/><text x='90' y='51' text-anchor='middle' font-family='Jua' font-size='18'>9</text><text x='155' y='52' font-size='20' font-family='Jua'>+</text><rect x='175' y='22' width='100' height='46' rx='10' fill='#FFF0CC' stroke='#F5B23A' stroke-width='2'/><text x='225' y='51' text-anchor='middle' font-family='Jua' font-size='18'>4</text></svg>",
          choices: ["12", "13", "14"], a: "13", exp: "9에 1을 주어 10을 만들고, 10 + 3 = 13이에요!" },
        { q: "13 - 5는 얼마일까요?",
          svg: "<svg viewBox='0 0 300 90'><circle cx='50' cy='45' r='10' fill='#6FBAD2'/><circle cx='82' cy='45' r='10' fill='#6FBAD2'/><circle cx='114' cy='45' r='10' fill='#6FBAD2'/><circle cx='146' cy='45' r='10' fill='#6FBAD2'/><circle cx='178' cy='45' r='10' fill='#E6DFC9'/><circle cx='210' cy='45' r='10' fill='#E6DFC9'/><text x='252' y='52' font-size='14' font-family='Jua'>-5?</text></svg>",
          choices: ["7", "8", "9"], a: "8", exp: "13 - 5 = 8이에요!" }
      ] }
  ];
  var G2 = [
    { id: "g2-place", name: "자리수 텃밭", x: 50, y: 10, npc: "밭주인 이랑이", npcImg: "npc-mole", houseImg: "house-low-place",
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
    { id: "g2-song", name: "곱셈 노래방", x: 72, y: 18, npc: "노래 선생님 도레미", npcImg: "npc-chick", houseImg: "house-low-song",
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
    { id: "g2-length", name: "길이 재기소", x: 31, y: 18, npc: "자 장인 쭉쭉이", npcImg: "npc-bunny", houseImg: "house-low-deck",
      list: [
        { q: "연필 길이가 자 눈금 0부터 12까지입니다. 몇 cm일까요?",
          svg: "<svg viewBox='0 0 300 90'><rect x='20' y='30' width='260' height='26' rx='6' fill='#FFFDF6' stroke='#9A8568' stroke-width='2'/><line x1='40' y1='30' x2='40' y2='44' stroke='#3E3428' stroke-width='2'/><line x1='200' y1='30' x2='200' y2='44' stroke='#3E3428' stroke-width='2'/><text x='40' y='72' text-anchor='middle' font-size='12' font-family='Jua'>0</text><text x='200' y='72' text-anchor='middle' font-size='12' font-family='Jua'>12</text><text x='120' y='50' text-anchor='middle' font-family='Jua' font-size='16'>✏️ 연필</text></svg>",
          choices: ["10cm", "12cm", "20cm"], a: "12cm", exp: "0부터 12까지이면 12cm예요! 자 눈금을 눌러 읽어 보세요." },
        { q: "1m는 몇 cm일까요?",
          svg: "<svg viewBox='0 0 300 90'><rect x='30' y='22' width='240' height='46' rx='10' fill='#E3F3DC' stroke='#4FA85E' stroke-width='2'/><text x='150' y='51' text-anchor='middle' font-family='Jua' font-size='18'>1m = ?cm</text></svg>",
          choices: ["10cm", "100cm", "1000cm"], a: "100cm", exp: "1m는 100cm예요!" },
        { q: "리본 30cm와 25cm를 이으면 모두 몇 cm일까요?",
          svg: "<svg viewBox='0 0 300 90'><rect x='30' y='30' width='120' height='30' rx='8' fill='#FBE3D8' stroke='#EE7F62' stroke-width='2'/><text x='90' y='50' text-anchor='middle' font-family='Jua'>30cm</text><rect x='160' y='30' width='110' height='30' rx='8' fill='#FDEBCB' stroke='#F2992E' stroke-width='2'/><text x='215' y='50' text-anchor='middle' font-family='Jua'>25cm</text></svg>",
          choices: ["50cm", "55cm", "65cm"], a: "55cm", exp: "30 + 25 = 55cm예요!" }
      ] },
    { id: "g2-time", name: "시계 전망대", x: 70, y: 53, npc: "전망대지기 똑딱이", npcImg: "npc-chick", houseImg: "house-low-clock",
      list: [
        { q: "짧은바늘이 3과 4 사이, 긴바늘이 6을 가리킵니다. 몇 시 몇 분일까요?",
          svg: "<svg viewBox='0 0 300 90'><circle cx='150' cy='45' r='36' fill='#FFFDF6' stroke='#4E9BB8' stroke-width='3'/><line x1='150' y1='45' x2='150' y2='75' stroke='#3E3428' stroke-width='2.5' stroke-linecap='round'/><line x1='150' y1='45' x2='168' y2='52' stroke='#EE7F62' stroke-width='3.5' stroke-linecap='round'/><circle cx='150' cy='45' r='3' fill='#3E3428'/></svg>",
          choices: ["3시 30분", "4시 30분", "6시 30분"], a: "3시 30분", exp: "긴바늘이 6이면 30분! 짧은바늘을 보면 3시 30분이에요." },
        { q: "2시부터 3시까지는 몇 시간일까요?",
          svg: "<svg viewBox='0 0 300 90'><rect x='40' y='22' width='100' height='46' rx='10' fill='#E3F3DC' stroke='#4FA85E' stroke-width='2'/><text x='90' y='51' text-anchor='middle' font-family='Jua' font-size='18'>2시</text><text x='155' y='52' font-size='20' font-family='Jua'>→</text><rect x='175' y='22' width='100' height='46' rx='10' fill='#E3F3DC' stroke='#4FA85E' stroke-width='2'/><text x='225' y='51' text-anchor='middle' font-family='Jua' font-size='18'>3시</text></svg>",
          choices: ["30분", "1시간", "2시간"], a: "1시간", exp: "2시에서 3시까지는 1시간이에요!" },
        { q: "긴바늘이 12, 짧은바늘이 9를 가리킵니다. 몇 시일까요?",
          svg: "<svg viewBox='0 0 300 90'><circle cx='150' cy='45' r='36' fill='#FFFDF6' stroke='#4E9BB8' stroke-width='3'/><line x1='150' y1='45' x2='150' y2='18' stroke='#3E3428' stroke-width='2.5' stroke-linecap='round'/><line x1='150' y1='45' x2='126' y2='45' stroke='#EE7F62' stroke-width='3.5' stroke-linecap='round'/><circle cx='150' cy='45' r='3' fill='#3E3428'/></svg>",
          choices: ["9시", "12시", "6시"], a: "9시", exp: "짧은바늘이 9를 가리키면 9시예요!" }
      ] },
    { id: "g2-table", name: "관찰 데크", x: 31, y: 54, npc: "쌍안경 탐험가 룰루", npcImg: "npc-bunny", houseImg: "house-low-deck",
      list: [
        { q: "사과 5개, 바나나 3개입니다. 표에서 사과는 몇 개일까요?",
          svg: "<svg viewBox='0 0 300 90'><rect x='40' y='18' width='110' height='54' rx='8' fill='#FFFDF6' stroke='#9A8568' stroke-width='2'/><text x='95' y='42' text-anchor='middle' font-family='Jua'>🍎 사과 5</text><text x='95' y='62' text-anchor='middle' font-family='Jua'>🍌 바나나 3</text><rect x='170' y='18' width='90' height='54' rx='8' fill='#E3F3DC' stroke='#4FA85E' stroke-width='2'/><text x='215' y='50' text-anchor='middle' font-family='Jua'>○×5?</text></svg>",
          choices: ["3개", "5개", "8개"], a: "5개", exp: "표를 읽으면 사과는 5개예요! ○ 그래프에 도장을 찍어 보세요." },
        { q: "빨간 구슬 4개, 파란 구슬 6개입니다. 모두 몇 개일까요?",
          svg: "<svg viewBox='0 0 300 90'><circle cx='70' cy='45' r='14' fill='#EE7F62'/><circle cx='110' cy='45' r='14' fill='#EE7F62'/><text x='150' y='52' font-size='18' font-family='Jua'>+</text><circle cx='190' cy='45' r='14' fill='#6FBAD2'/><circle cx='230' cy='45' r='14' fill='#6FBAD2'/></svg>",
          choices: ["9개", "10개", "11개"], a: "10개", exp: "4 + 6 = 10개예요!" },
        { q: "우리 반 좋아하는 과일 ○표에서 ○가 7개입니다. 몇 명일까요?",
          svg: "<svg viewBox='0 0 300 90'><circle cx='60' cy='45' r='12' fill='#F5B23A'/><circle cx='100' cy='45' r='12' fill='#F5B23A'/><circle cx='140' cy='45' r='12' fill='#F5B23A'/><circle cx='180' cy='45' r='12' fill='#E6DFC9' stroke='#9A8568' stroke-dasharray='4 3'/><text x='230' y='52' font-size='14' font-family='Jua'>○=1명</text></svg>",
          choices: ["5명", "7명", "10명"], a: "7명", exp: "○ 1개가 1명이면 7개는 7명이에요!" }
      ] },
    { id: "g2-pattern", name: "무늬 산책로", x: 50, y: 68, npc: "무늬 화가 줄무늬", npcImg: "npc-mole", houseImg: "house-low-deck",
      list: [
        { q: "2, 4, 6 다음에 올 수는 몇일까요?",
          svg: "<svg viewBox='0 0 300 90'><rect x='24' y='24' width='60' height='42' rx='10' fill='#E3F3DC' stroke='#4FA85E' stroke-width='2'/><text x='54' y='51' text-anchor='middle' font-family='Jua' font-size='17'>2</text><rect x='100' y='24' width='60' height='42' rx='10' fill='#E3F3DC' stroke='#4FA85E' stroke-width='2'/><text x='130' y='51' text-anchor='middle' font-family='Jua' font-size='17'>4</text><rect x='176' y='24' width='60' height='42' rx='10' fill='#E3F3DC' stroke='#4FA85E' stroke-width='2'/><text x='206' y='51' text-anchor='middle' font-family='Jua' font-size='17'>6</text></svg>",
          choices: ["7", "8", "10"], a: "8", exp: "2씩 커지니까 다음은 8이에요!" },
        { q: "5, 10, 15 다음에 올 수는 몇일까요? (곱셈구구 규칙)",
          svg: "<svg viewBox='0 0 300 90'><rect x='24' y='24' width='60' height='42' rx='10' fill='#FFF0CC' stroke='#F5B23A' stroke-width='2'/><text x='54' y='51' text-anchor='middle' font-family='Jua' font-size='17'>5</text><rect x='100' y='24' width='60' height='42' rx='10' fill='#FFF0CC' stroke='#F5B23A' stroke-width='2'/><text x='130' y='51' text-anchor='middle' font-family='Jua' font-size='17'>10</text><rect x='176' y='24' width='60' height='42' rx='10' fill='#FFF0CC' stroke='#F5B23A' stroke-width='2'/><text x='206' y='51' text-anchor='middle' font-family='Jua' font-size='17'>15</text></svg>",
          choices: ["18", "20", "25"], a: "20", exp: "5씩 커지니까 다음은 20이에요! 5단 곱셈구구예요." },
        { q: "○ ○ □ ○ ○ □ 다음에 올 모양은 무엇일까요?",
          svg: "<svg viewBox='0 0 300 90'><circle cx='50' cy='45' r='16' fill='#F5B23A'/><circle cx='100' cy='45' r='16' fill='#F5B23A'/><rect x='134' y='29' width='32' height='32' rx='6' fill='#6FBAD2'/><circle cx='200' cy='45' r='16' fill='#F5B23A'/><circle cx='250' cy='45' r='16' fill='#E6DFC9' stroke='#9A8568' stroke-dasharray='4 3'/></svg>",
          choices: ["○", "□", "△"], a: "□", exp: "○ ○ □이 반복되니 다음은 □예요!" }
      ] }
  ];
  window.LowData = { g1: G1, g2: G2 };
})();
