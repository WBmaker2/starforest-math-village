(function () {
  function shapeSvg(kind) {
    if (kind === "tri") return "<rect x='4' y='4' width='312' height='102' rx='14' fill='#FFFDF6' stroke='#E6DFC9'/><polygon points='160,18 110,84 210,84' fill='#DDEDE4' stroke='#1F6E5C' stroke-width='2.5'/><line x1='128' y1='50' x2='138' y2='54' stroke='#E4695E' stroke-width='2.5'/><line x1='192' y1='50' x2='182' y2='54' stroke='#E4695E' stroke-width='2.5'/><text x='160' y='100' text-anchor='middle' font-size='12' fill='#7A6A55'>표시된 변이 같은 삼각형 · 눌러 변과 각을 확인해요</text>";
    if (kind === "quad") return "<rect x='4' y='4' width='312' height='102' rx='14' fill='#FFFDF6' stroke='#E6DFC9'/><rect x='110' y='26' width='100' height='56' rx='6' fill='#E9E4F5' stroke='#7A6FC0' stroke-width='2.5'/><text x='160' y='100' text-anchor='middle' font-size='12' fill='#7A6A55'>네 변과 수직·평행을 눌러 확인해요</text>";
    return "<rect x='4' y='4' width='312' height='102' rx='14' fill='#FFFDF6' stroke='#E6DFC9'/><polygon points='160,16 210,40 192,84 128,84 110,40' fill='#FDEBCB' stroke='#F2992E' stroke-width='2.5'/><text x='160' y='100' text-anchor='middle' font-size='12' fill='#7A6A55'>정다각형 · 꼭짓점과 변의 수를 세어 보세요</text>";
  }
  function shapeRow(kind) {
    return "<div class='manip-row'><button type='button' data-shape='v'>변의 수 세기</button>"
      + "<button type='button' data-shape='a'>각의 수 세기</button>"
      + "<button type='button' data-shape='eq'>같은 변 찾기</button></div>";
  }
  function deciDyn(v) {
    var x = 20 + (v / 2) * 280;
    x = Math.max(20, Math.min(300, x));
    var out = "<rect x='4' y='4' width='312' height='102' rx='14' fill='#FFFDF6' stroke='#E6DFC9'/>";
    out += "<line x1='20' y1='60' x2='300' y2='60' stroke='#1F6E5C' stroke-width='3'/>";
    for (var i = 0; i <= 4; i++) {
      var tx = 20 + i * 70;
      out += "<line x1='" + tx + "' y1='52' x2='" + tx + "' y2='68' stroke='#1F6E5C' stroke-width='2'/>";
      out += "<text x='" + tx + "' y='84' text-anchor='middle' font-size='12' font-family='Jua'>" + (i * 0.5).toFixed(1) + "</text>";
    }
    out += "<circle cx='" + x + "' cy='60' r='9' fill='#E4695E' stroke='#fff' stroke-width='2'/>";
    out += "<text x='160' y='32' text-anchor='middle' font-size='15' font-family='Jua' fill='#E4695E'>현재 " + v.toFixed(1) + "</text>";
    return out;
  }
  function deciSvg(q) {
    var m = (q || "").match(/(\d+\.\d+)/);
    var v = m ? parseFloat(m[1]) : 0.8;
    if (!(v >= 0 && v <= 2)) v = 0.8;
    var svg = "<div data-deci-svg><svg viewBox='0 0 320 110'>" + deciDyn(v) + "</svg></div>";
    svg += "<div class='manip-row'><button type='button' data-deci='-0.1'>−0.1</button>"
      + "<span data-deci-val>현재 " + v.toFixed(1) + "</span>"
      + "<button type='button' data-deci='0.1'>+0.1</button></div>";
    return svg;
  }
  function lineDyn(a, b) {
    var y1 = 78 - (a / 30) * 50, y2 = 78 - (b / 30) * 50;
    var out = "<rect x='4' y='4' width='312' height='102' rx='14' fill='#FFFDF6' stroke='#E6DFC9'/>";
    out += "<polyline points='90," + y1 + " 230," + y2 + "' fill='none' stroke='#E4695E' stroke-width='3'/>";
    out += "<circle cx='90' cy='" + y1 + "' r='6' fill='#E4695E'/><circle cx='230' cy='" + y2 + "' r='6' fill='#E4695E'/>";
    out += "<text x='90' y='96' text-anchor='middle' font-size='12' font-family='Jua'>월(" + a + "°C)</text>";
    out += "<text x='230' y='96' text-anchor='middle' font-size='12' font-family='Jua'>화(" + b + "°C)</text>";
    out += "<text x='160' y='30' text-anchor='middle' font-size='13' font-family='Jua' fill='#2F7A40'>차이 " + Math.abs(b - a) + "°C</text>";
    return { svg: out, diff: Math.abs(b - a) };
  }
  function lineSvg(q) {
    var nums = (q || "").match(/(\d+)[^0-9]+(\d+)/);
    var a = nums ? parseInt(nums[1], 10) : 14, b = nums ? parseInt(nums[2], 10) : 19;
    var built = lineDyn(a, b);
    var svg = "<div data-line-svg><svg viewBox='0 0 320 110'>" + built.svg + "</svg></div>";
    svg += "<div class='manip-row'><button type='button' data-line='-1'>화 −1°C</button>"
      + "<span data-line-val>월 " + a + "°C · 화 " + b + "°C</span>"
      + "<button type='button' data-line='1'>화 +1°C</button></div>";
    return { svg: svg, a: a, b: b };
  }
  function rangeSvg() {
    var out = "<rect x='4' y='4' width='312' height='102' rx='14' fill='#FFFDF6' stroke='#E6DFC9'/>";
    out += "<line x1='20' y1='58' x2='300' y2='58' stroke='#1F6E5C' stroke-width='3'/>";
    out += "<circle cx='120' cy='58' r='8' fill='#F5B23A'/><circle cx='200' cy='58' r='8' fill='#fff' stroke='#F5B23A' stroke-width='3'/>";
    out += "<text x='120' y='84' text-anchor='middle' font-size='12'>300 이상</text><text x='200' y='84' text-anchor='middle' font-size='12'>400 미만</text>";
    out += "<text x='160' y='30' text-anchor='middle' font-size='13' font-family='Jua'>300 이상 400 미만 · 300은 포함, 400은 제외</text>";
    return "<div class='q-vis' aria-hidden='true'><svg viewBox='0 0 320 110'>" + out + "</svg></div>"
      + "<div class='manip-row'><button type='button' data-range='in'>300은 포함될까?</button>"
      + "<button type='button' data-range='out'>400은 포함될까?</button></div>"
      + msgHtml("이상은 그 수 포함, 미만은 그 수 제외! 단추를 눌러 확인해요.");
  }
  function cuboidSvg() {
    var out = "<rect x='4' y='4' width='312' height='102' rx='14' fill='#FFFDF6' stroke='#E6DFC9'/>";
    out += "<rect x='110' y='28' width='80' height='52' rx='4' fill='#E9E4F5' stroke='#7A6FC0' stroke-width='2.5'/>";
    out += "<path d='M110 28 L130 12 L210 12 L190 28 Z' fill='#D9D2F0' stroke='#7A6FC0' stroke-width='2'/>";
    out += "<path d='M190 28 L210 12 L210 64 L190 80 Z' fill='#CFC6EA' stroke='#7A6FC0' stroke-width='2'/>";
    out += "<text x='160' y='98' text-anchor='middle' font-size='12' fill='#7A6A55'>면 6 · 모서리 12 · 꼭짓점 8</text>";
    return "<div class='q-vis' aria-hidden='true'><svg viewBox='0 0 320 110'>" + out + "</svg></div>"
      + "<div class='manip-row'><button type='button' data-cuboid='face'>면 세기</button>"
      + "<button type='button' data-cuboid='edge'>모서리 세기</button>"
      + "<button type='button' data-cuboid='vertex'>꼭짓점 세기</button></div>"
      + msgHtml("단추를 눌러 직육면체의 면·모서리·꼭짓점을 세어 보세요!");
  }
  function avgDyn(vals) {
    var out = "<rect x='4' y='4' width='312' height='102' rx='14' fill='#FFFDF6' stroke='#E6DFC9'/>";
    var sum = 0;
    for (var i = 0; i < vals.length; i++) sum += vals[i];
    var avg = sum / vals.length;
    for (var j = 0; j < vals.length; j++) {
      var h = Math.round(vals[j] / 12 * 60);
      var x = 70 + j * 70;
      out += "<rect x='" + x + "' y='" + (80 - h) + "' width='36' height='" + h + "' rx='5' fill='#4FA85E'/>";
      out += "<text x='" + (x + 18) + "' y='" + (74 - h) + "' text-anchor='middle' font-size='12' font-family='Jua'>" + vals[j] + "</text>";
    }
    out += "<line x1='40' y1='" + (80 - Math.round(avg / 12 * 60)) + "' x2='280' y2='" + (80 - Math.round(avg / 12 * 60)) + "' stroke='#E4695E' stroke-width='2' stroke-dasharray='5 4'/>";
    out += "<text x='160' y='98' text-anchor='middle' font-size='12' fill='#7A6A55'>평균 " + avg + " (합 " + sum + " ÷ " + vals.length + ")</text>";
    return { svg: out, avg: avg };
  }
  function avgSvg(q) {
    var nums = (q || "").match(/(\d+)[^0-9]+(\d+)[^0-9]+(\d+)/);
    var vals = nums ? [parseInt(nums[1], 10), parseInt(nums[2], 10), parseInt(nums[3], 10)] : [6, 8, 10];
    var built = avgDyn(vals);
    return "<div class='q-vis' aria-hidden='true'><div data-avg-svg><svg viewBox='0 0 320 110'>" + built.svg + "</svg></div></div>"
      + msgHtml("막대 높이의 합을 인원수로 나누면 평균! 고르게 나누면 " + built.avg + "개씩이에요.");
  }
  function ratioDyn(a, b) {
    var out = "<rect x='4' y='4' width='312' height='102' rx='14' fill='#FFFDF6' stroke='#E6DFC9'/>";
    var ax = Math.min(8, a), bx = Math.min(8, b);
    for (var i = 0; i < ax; i++) out += "<circle cx='" + (70 + i * 18) + "' cy='42' r='8' fill='#F5B23A'/>";
    for (var j = 0; j < bx; j++) out += "<circle cx='" + (70 + j * 18) + "' cy='70' r='8' fill='#6FBAD2'/>";
    out += "<text x='230' y='50' text-anchor='middle' font-size='14' font-family='Jua'>노랑 " + a + "스푼</text>";
    out += "<text x='230' y='72' text-anchor='middle' font-size='14' font-family='Jua'>파랑 " + b + "스푼</text>";
    return out;
  }
  function ratioSvg(q) {
    var m = (q || "").match(/(\d+)\s*:\s*(\d+)/);
    var a = m ? parseInt(m[1], 10) : 2, b = m ? parseInt(m[2], 10) : 3;
    var svg = "<div data-ratio-svg><svg viewBox='0 0 320 110'>" + ratioDyn(a, b) + "</svg></div>";
    svg += "<div class='manip-row'><button type='button' data-ratio='a'>노랑 +1스푼</button>"
      + "<span data-ratio-val>" + a + " : " + b + "</span>"
      + "<button type='button' data-ratio='b'>파랑 +1스푼</button></div>";
    return { svg: svg, a: a, b: b };
  }
  function spaceSvg() {
    var out = "<rect x='4' y='4' width='312' height='102' rx='14' fill='#FFFDF6' stroke='#E6DFC9'/>";
    out += "<rect x='120' y='52' width='30' height='30' rx='4' fill='#9C86E0' stroke='#6A5AC9' stroke-width='2'/>";
    out += "<rect x='152' y='52' width='30' height='30' rx='4' fill='#9C86E0' stroke='#6A5AC9' stroke-width='2'/>";
    out += "<rect x='136' y='22' width='30' height='30' rx='4' fill='#F5B23A' stroke='#C98A2B' stroke-width='2'/>";
    out += "<text x='230' y='50' font-size='13' font-family='Jua'>위에서 3개</text>";
    out += "<text x='230' y='70' font-size='13' font-family='Jua'>앞·옆에서 2층</text>";
    return "<div class='q-vis' aria-hidden='true'><svg viewBox='0 0 320 110'>" + out + "</svg></div>"
      + "<div class='manip-row'><button type='button' data-space='top'>위에서 보기</button>"
      + "<button type='button' data-space='front'>앞에서 보기</button>"
      + "<button type='button' data-space='side'>옆에서 보기</button></div>"
      + msgHtml("위·앞·옆에서 본 모양을 눌러 쌓기나무 수를 세어 보세요!");
  }
  function cylSvg() {
    var out = "<rect x='4' y='4' width='312' height='102' rx='14' fill='#FFFDF6' stroke='#E6DFC9'/>";
    out += "<ellipse cx='90' cy='34' rx='26' ry='8' fill='#DDEDE4' stroke='#1F6E5C' stroke-width='2'/><rect x='64' y='34' width='52' height='44' fill='#DDEDE4' stroke='#1F6E5C' stroke-width='2'/><ellipse cx='90' cy='78' rx='26' ry='8' fill='#BFD9C8' stroke='#1F6E5C' stroke-width='2'/>";
    out += "<path d='M170 78 L200 30 L230 78 Z' fill='#FDEBCB' stroke='#F2992E' stroke-width='2'/><ellipse cx='200' cy='78' rx='30' ry='7' fill='#F7C95B' stroke='#F2992E' stroke-width='2'/>";
    out += "<circle cx='272' cy='56' r='24' fill='#D6EAF3' stroke='#4E9BB8' stroke-width='2.5'/>";
    out += "<text x='90' y='98' text-anchor='middle' font-size='11'>원기둥</text><text x='200' y='98' text-anchor='middle' font-size='11'>원뿔</text><text x='272' y='98' text-anchor='middle' font-size='11'>구</text>";
    return "<div class='q-vis' aria-hidden='true'><svg viewBox='0 0 320 110'>" + out + "</svg></div>"
      + "<div class='manip-row'><button type='button' data-cyl='roll'>굴려서 생기는 입체?</button>"
      + "<button type='button' data-cyl='face'>둥근 면 찾기</button></div>"
      + msgHtml("직사각형을 굴리면 원기둥, 삼각형을 돌리면 원뿔이 생겨요!");
  }

  var VISUAL_MAP = {
    "g4-frac": "frac", "g5-fracmul": "frac", "g6-fracdiv": "frac",
    "g4-tri": "tri", "g4-quad": "quad", "g4-poly": "poly",
    "g4-deci": "deci", "g5-decimul": "deci", "g6-decdiv": "deci",
    "g4-line": "line", "g5-range": "range", "g5-cuboid": "cuboid",
    "g5-avg": "avg", "g6-ratio": "ratio", "g6-space": "space",
    "g6-cyl": "cyl", "g6-circle": "circ", "g5-symm": "gra"
  };
  function msgHtml2(text) { return "<p class='manip-msg' data-manip-msg>" + text + "</p>"; }
  window.GVisualsExtra = {
    map: VISUAL_MAP, msg: msgHtml2,
    shapeSvg: shapeSvg, shapeRow: shapeRow, deciSvg: deciSvg, deciDyn: deciDyn,
    lineSvg: lineSvg, lineDyn: lineDyn, rangeSvg: rangeSvg, cuboidSvg: cuboidSvg,
    avgSvg: avgSvg, avgDyn: avgDyn, ratioSvg: ratioSvg, ratioDyn: ratioDyn,
    spaceSvg: spaceSvg, cylSvg: cylSvg
  };
})();
