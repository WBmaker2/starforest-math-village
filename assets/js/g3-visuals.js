(function () {
  function parseMul(q) {
    var m = q.match(/(\d+)\s*×\s*(\d+)/);
    var a = m ? parseInt(m[1], 10) : 20;
    var b = m ? Math.min(5, parseInt(m[2], 10)) : 3;
    return { tens: Math.floor(a / 10) * 10, ones: a % 10, b: b };
  }
  function parseDivi(q) {
    var m = q.match(/(\d+)\s*÷\s*(\d+)/);
    var a = m ? parseInt(m[1], 10) : 60;
    var b = m ? Math.min(7, parseInt(m[2], 10)) : 3;
    return { a: a, b: b };
  }
  function mulSvg(q) {
    var p = parseMul(q);
    var step = Math.floor(280 / p.b);
    var out = "<rect x='4' y='4' width='312' height='102' rx='14' fill='#FFFDF6' stroke='#E6DFC9'/>";
    for (var i = 0; i < p.b; i++) {
      var cx = 24 + i * step + Math.floor(step / 2);
      out += "<g data-mul='" + i + "'><rect x='" + (cx - 24) + "' y='18' width='48' height='54' rx='10' fill='#FFF0CC' stroke='#F5B23A' stroke-width='2'/>";
      out += "<text x='" + cx + "' y='42' text-anchor='middle' font-size='14' font-family='Jua' fill='#3E3428'>" + p.tens + "</text>";
      if (p.ones > 0) {
        out += "<text x='" + cx + "' y='62' text-anchor='middle' font-size='13' font-family='Jua' fill='#EE7F62'>+" + p.ones + "</text>";
      }
      out += "<text x='" + cx + "' y='92' text-anchor='middle' font-size='12' fill='#7A6A55'>" + (i + 1) + "묶음</text></g>";
    }
    return out;
  }
  function diviSvg(q) {
    var p = parseDivi(q);
    var tens = Math.floor(p.a / 10) * 10, ones = p.a % 10;
    var out = "<rect x='4' y='4' width='312' height='102' rx='14' fill='#FFFDF6' stroke='#E6DFC9'/>";
    out += "<rect x='70' y='12' width='180' height='28' rx='8' fill='#E3F3DC' stroke='#4FA85E'/>";
    out += "<text x='160' y='31' text-anchor='middle' font-size='14' font-family='Jua' fill='#2F7A40'>전체 " + p.a + " (" + tens + (ones ? " + " + ones : "") + ") → " + p.b + "곳에 똑같이 나눔</text>";
    var step = Math.floor(280 / p.b);
    for (var i = 0; i < p.b; i++) {
      var cx = 20 + i * step + Math.floor(step / 2);
      out += "<g data-div='" + i + "'><path d='M" + (cx - 16) + " 62 h32 l-5 24 h-22 z' fill='#FFF0CC' stroke='#F5B23A' stroke-width='2'/>";
      out += "<text x='" + cx + "' y='79' text-anchor='middle' font-size='13' font-family='Jua' fill='#3E3428' data-divq='" + i + "'>?</text></g>";
    }
    return out;
  }
  function circDynSVG(r) {
    var px = 12 + r * 3;
    var cx = 100, cy = 55;
    var out = "<rect x='4' y='4' width='312' height='102' rx='14' fill='#FFFDF6' stroke='#E6DFC9'/>";
    out += "<circle cx='" + cx + "' cy='" + cy + "' r='" + px + "' fill='rgba(245,178,58,.16)' stroke='#F5B23A' stroke-width='3'/>";
    out += "<line x1='" + (cx - px) + "' y1='" + cy + "' x2='" + (cx + px) + "' y2='" + cy + "' stroke='#6FBAD2' stroke-width='2.5' stroke-dasharray='4 3'/>";
    out += "<line x1='" + cx + "' y1='" + cy + "' x2='" + (cx + px) + "' y2='" + cy + "' stroke='#EE7F62' stroke-width='3.5'/>";
    out += "<circle cx='" + cx + "' cy='" + cy + "' r='3.5' fill='#3E3428'/>";
    out += "<text x='228' y='46' text-anchor='middle' font-size='15' font-family='Jua' fill='#EE7F62'>반지름 " + r + "cm</text>";
    out += "<text x='228' y='68' text-anchor='middle' font-size='14' font-family='Jua' fill='#3E3428'>지름 " + (r * 2) + "cm</text>";
    return out;
  }
  function circSvg(lid, q) {
    if (lid === "circ-2") {
      var out = "<rect x='4' y='4' width='312' height='102' rx='14' fill='#FFFDF6' stroke='#E6DFC9'/>";
      var cnt = q.indexOf("3개") >= 0 ? 3 : 2;
      var r = cnt === 3 ? 26 : 32;
      var startX = 160 - (cnt - 1) * r;
      for (var i = 0; i < cnt; i++) {
        var cx = startX + i * r * 2;
        out += "<circle cx='" + cx + "' cy='52' r='" + r + "' fill='rgba(111,186,210,.18)' stroke='#6FBAD2' stroke-width='2.5'/>";
        out += "<circle cx='" + cx + "' cy='52' r='3' fill='#3E3428'/>";
      }
      out += "<line x1='" + (startX - r) + "' y1='52' x2='" + (startX + (cnt - 1) * r * 2 + r) + "' y2='52' stroke='#EE7F62' stroke-width='2' stroke-dasharray='4 3'/>";
      out += "<text x='160' y='98' text-anchor='middle' font-size='12' fill='#7A6A55'>지름 = 반지름 × 2 · 중심과 중심을 이어 생각해요</text>";
      return out;
    }
    var numM = q.match(/(\d+)\s*cm/);
    var num = numM ? parseInt(numM[1], 10) : 6;
    var r0 = q.indexOf("반지름이") >= 0 ? num : Math.max(2, Math.round(num / 2));
    r0 = Math.max(2, Math.min(12, r0));
    var svg = "<div data-circ-svg><svg viewBox='0 0 320 110'>" + circDynSVG(r0) + "</svg></div>";
    svg += "<div class='manip-row'><button type='button' data-circ='-1'>반지름 −1cm</button>"
      + "<span data-circ-val>반지름 " + r0 + "cm ↔ 지름 " + (r0 * 2) + "cm</span>"
      + "<button type='button' data-circ='1'>반지름 +1cm</button></div>";
    return svg;
  }
  function fracCells(num, den) {
    var bw = Math.floor(240 / den);
    var sx = 160 - Math.floor((bw * den) / 2);
    var out = "";
    for (var i = 0; i < den; i++) {
      var fill = i < Math.min(num, den) ? "#F5B23A" : "#FFFDF6";
      out += "<g data-frac='" + i + "'><rect x='" + (sx + i * bw) + "' y='26' width='" + (bw - 3) + "' height='38' rx='6' fill='" + fill + "' stroke='#C98A2B' stroke-width='2'/></g>";
    }
    return { cells: out, den: den };
  }
  function fracSvg(q) {
    var fm = q.match(/(\d+)\/(\d+)/);
    var num = fm ? parseInt(fm[1], 10) : 1;
    var den = fm ? Math.min(8, parseInt(fm[2], 10)) : 4;
    var c = fracCells(num, den);
    var out = "<rect x='4' y='4' width='312' height='102' rx='14' fill='#FFFDF6' stroke='#E6DFC9'/>" + c.cells;
    out += "<text x='160' y='86' text-anchor='middle' font-size='13' font-family='Jua' fill='#7A6A55' data-fracden='" + den + "'>전체를 똑같이 " + den + "칸으로 나눈 그림 · 칸을 눌러 색칠해 보세요</text>";
    return { svg: out, num: num, den: den };
  }
  function meaVolSVG(ml) {
    ml = Math.max(0, Math.min(2000, ml));
    var h = Math.round(ml / 2000 * 62);
    var out = "<rect x='4' y='4' width='312' height='102' rx='14' fill='#FFFDF6' stroke='#E6DFC9'/>";
    out += "<rect x='58' y='18' width='56' height='70' rx='6' fill='#fff' stroke='#6FBAD2' stroke-width='2.5'/>";
    if (h > 0) out += "<rect x='60' y='" + (84 - h) + "' width='52' height='" + h + "' rx='4' fill='rgba(111,186,210,.55)'/>";
    out += "<line x1='58' y1='32' x2='72' y2='32' stroke='#2F7A40' stroke-width='2'/>";
    out += "<line x1='58' y1='54' x2='70' y2='54' stroke='#2F7A40' stroke-width='2'/>";
    out += "<text x='212' y='46' text-anchor='middle' font-size='16' font-family='Jua' fill='#2F7A40'>현재 " + ml + " mL</text>";
    out += "<text x='212' y='70' text-anchor='middle' font-size='13' fill='#7A6A55'>1 L = 1000 mL</text>";
    return { svg: out, val: ml };
  }
  function meaWtSVG(g) {
    g = Math.max(0, Math.min(2000, g));
    var ang = -45 + (g / 2000) * 90;
    var rad = (ang - 90) * Math.PI / 180;
    var x2 = Math.round(86 + 22 * Math.cos(rad)), y2 = Math.round(58 + 22 * Math.sin(rad));
    var out = "<rect x='4' y='4' width='312' height='102' rx='14' fill='#FFFDF6' stroke='#E6DFC9'/>";
    out += "<circle cx='86' cy='58' r='30' fill='#FFF0CC' stroke='#F5B23A' stroke-width='2.5'/>";
    out += "<line x1='86' y1='58' x2='" + x2 + "' y2='" + y2 + "' stroke='#EE7F62' stroke-width='3' stroke-linecap='round'/>";
    out += "<rect x='66' y='20' width='40' height='8' rx='4' fill='#4FA85E'/>";
    out += "<text x='212' y='46' text-anchor='middle' font-size='16' font-family='Jua' fill='#3E3428'>현재 " + g + " g</text>";
    out += "<text x='212' y='70' text-anchor='middle' font-size='13' fill='#7A6A55'>1 kg = 1000 g</text>";
    return { svg: out, val: g };
  }
  function meaSvg(lid, q) {
    var isVol = (q || "").indexOf("mL") >= 0 || lid === "mea-1";
    var inner, row;
    if (isVol) {
      inner = meaVolSVG(500).svg;
      row = "<div class='manip-row'><button type='button' data-mea='100'>+100mL 붓기</button>"
        + "<button type='button' data-mea='500'>+500mL 붓기</button>"
        + "<button type='button' data-mea='0'>비우기</button></div>";
    } else {
      inner = meaWtSVG(500).svg;
      row = "<div class='manip-row'><button type='button' data-mea='100'>+100g 올리기</button>"
        + "<button type='button' data-mea='500'>+500g 올리기</button>"
        + "<button type='button' data-mea='0'>내리기</button></div>";
    }
    return { svg: inner, vol: isVol, row: row };
  }
  function graDynSVG(big, small) {
    var out = "<rect x='4' y='4' width='312' height='102' rx='14' fill='#FFFDF6' stroke='#E6DFC9'/>";
    for (var i = 0; i < big; i++) {
      var bx = 34 + i * 32;
      out += "<circle cx='" + bx + "' cy='32' r='13' fill='#F5B23A'/><text x='" + bx + "' y='37' text-anchor='middle' font-size='11' font-family='Jua' fill='#fff'>10</text>";
    }
    for (var j = 0; j < small; j++) {
      var sx = 34 + j * 24;
      out += "<circle cx='" + sx + "' cy='72' r='8' fill='#EE7F62'/><text x='" + sx + "' y='76' text-anchor='middle' font-size='9' font-family='Jua' fill='#fff'>1</text>";
    }
    out += "<text x='252' y='48' text-anchor='middle' font-size='14' font-family='Jua' fill='#3E3428'>큰 " + big + "개</text>";
    out += "<text x='252' y='70' text-anchor='middle' font-size='14' font-family='Jua' fill='#3E3428'>작은 " + small + "개</text>";
    out += "<text x='252' y='92' text-anchor='middle' font-size='13' font-family='Jua' fill='#2F7A40'>= " + (big * 10 + small) + "</text>";
    return out;
  }
  function graSvg() {
    var svg = "<div data-gra-svg><svg viewBox='0 0 320 110'>" + graDynSVG(2, 3) + "</svg></div>";
    svg += "<div class='manip-row'><button type='button' data-gra='big'>+큰 그림(10) 도장</button>"
      + "<button type='button' data-gra='small'>+작은 그림(1) 도장</button>"
      + "<button type='button' data-gra='clear'>지우기</button></div>";
    return svg;
  }
  function msgHtml(text) {
    return "<p class='manip-msg' data-manip-msg>" + text + "</p>";
  }
  function X(name) {
    return function () {
      var E = window.GVisualsExtra;
      if (E && E[name]) return E[name].apply(E, arguments);
      return '';
    };
  }
  var shapeSvg = X('shapeSvg'), shapeRow = X('shapeRow'), deciSvg = X('deciSvg'), deciDyn = X('deciDyn');
  var lineSvg = X('lineSvg'), lineDyn = X('lineDyn'), rangeSvg = X('rangeSvg'), cuboidSvg = X('cuboidSvg');
  var avgSvg = X('avgSvg'), avgDyn = X('avgDyn'), ratioSvg = X('ratioSvg'), ratioDyn = X('ratioDyn');
  var spaceSvg = X('spaceSvg'), cylSvg = X('cylSvg');
  var VISUAL_MAP = {
    "g4-frac": "frac", "g5-fracmul": "frac", "g6-fracdiv": "frac",
    "g4-tri": "tri", "g4-quad": "quad", "g4-poly": "poly",
    "g4-deci": "deci", "g5-decimul": "deci", "g6-decdiv": "deci",
    "g4-line": "line", "g5-range": "range", "g5-cuboid": "cuboid",
    "g5-avg": "avg", "g6-ratio": "ratio", "g6-space": "space",
    "g6-cyl": "cyl", "g6-circle": "circ", "g5-symm": "gra"
  };
  function render(house, lid, item) {
    var q = (item && item.q) || "";
    var kind = VISUAL_MAP[house] || house;
    var inner = "", after = "";
    if (kind === "tri" || kind === "quad" || kind === "poly") {
      return "<div class='q-vis' aria-hidden='true'><svg viewBox='0 0 320 110'>" + shapeSvg(kind) + "</svg></div>" + shapeRow(kind)
        + msgHtml("도형의 변과 각을 눌러 세어 보세요!");
    } else if (kind === "deci") {
      return "<div class='q-vis' aria-hidden='true'>" + deciSvg(q) + "</div>"
        + msgHtml("수직선 단추를 눌러 소수의 크기를 직접 옮겨 보세요!");
    } else if (kind === "line") {
      var ln = lineSvg(q);
      return "<div class='q-vis' aria-hidden='true'>" + ln.svg + "</div>"
        + msgHtml("화요일 기온 단추를 눌러 꺾은선의 기울기와 차이 " + (Math.abs(ln.b - ln.a)) + "°C를 확인해요!");
    } else if (kind === "range") {
      return rangeSvg();
    } else if (kind === "cuboid") {
      return cuboidSvg();
    } else if (kind === "avg") {
      return avgSvg(q);
    } else if (kind === "ratio") {
      var rt = ratioSvg(q);
      return "<div class='q-vis' aria-hidden='true'>" + rt.svg + "</div>"
        + msgHtml("스푼 단추를 눌러 비 " + rt.a + " : " + rt.b + "를 직접 만들어 보세요!");
    } else if (kind === "space") {
      return spaceSvg();
    } else if (kind === "cyl") {
      return cylSvg();
    } else if (kind === "mul") {
      var p = parseMul(q);
      inner = mulSvg(q);
      after = msgHtml("묶음 상자를 눌러 보세요! (0/" + p.b + "묶음 선택됨)");
    } else if (kind === "divi") {
      var d = parseDivi(q);
      inner = diviSvg(q);
      after = msgHtml("바구니를 눌러 나누어 보세요! (0/" + d.b + "곳 나눔됨)");
    } else if (kind === "circ") {
      var c = circSvg(lid, q);
      if (String(lid || "").indexOf("circ-2") >= 0 || String(lid || "").indexOf("space") >= 0) {
        inner = (typeof c === "string") ? c : "";
        after = "";
      } else if (typeof c === "string" && c.indexOf("data-circ-svg") < 0) {
        inner = c;
        after = "";
      } else {
        return "<div class='q-vis' aria-hidden='true'>" + c + "</div>"
          + msgHtml("단추를 눌러 원의 크기를 바꾸면 반지름과 지름이 어떻게 변할까요?");
      }
    } else if (kind === "frac") {
      var f = fracSvg(q);
      inner = f.svg;
      after = msgHtml("색칠된 조각: " + Math.min(f.num, f.den) + "/" + f.den + " · 칸을 눌러 색칠하거나 비워 보세요!");
    } else if (kind === "mea") {
      var m = meaSvg(lid, q);
      inner = m.svg;
      after = m.row + msgHtml("단추를 눌러 직접 채워 보고, 1L = 1000mL · 1kg = 1000g을 확인해 보세요!");
    } else {
      return "<div class='q-vis' aria-hidden='true'>" + graSvg() + "</div>"
        + msgHtml("도장 단추를 눌러 그림그래프 숫자를 직접 만들어 보세요!");
    }
    return "<div class='q-vis' aria-hidden='true'><svg viewBox='0 0 320 110'>" + inner + "</svg></div>" + after;
  }
  function setMsg(root, text) {
    var m = root.querySelector("[data-manip-msg]");
    if (m) m.textContent = text;
  }
  function mount(root, house, lid, item) {
    if (!root) return;
    var q = (item && item.q) || "";
    var kind = VISUAL_MAP[house] || house;
    if (kind === "tri" || kind === "quad" || kind === "poly") {
      root.addEventListener("click", function (e) {
        var t = e.target.closest ? e.target.closest("[data-shape]") : null;
        if (!t || !root.contains(t)) return;
        var act = t.getAttribute("data-shape");
        if (act === "v") setMsg(root, kind === "tri" ? "변은 3개, 꼭짓점도 3개예요!" : (kind === "quad" ? "변은 4개, 꼭짓점도 4개예요!" : "정오각형은 변 5개, 꼭짓점 5개예요!"));
        else if (act === "a") setMsg(root, "각의 수도 변의 수와 같아요. 한 바퀴 돌며 세어 보세요!");
        else setMsg(root, "표시된 변처럼 길이가 같은 변을 찾아보세요. 이등변·정삼각형의 힌트예요!");
      });
    } else if (kind === "deci") {
      var m0 = (q || "").match(/(\d+\.\d+)/);
      var dv = m0 ? parseFloat(m0[1]) : 0.8;
      if (!(dv >= 0 && dv <= 2)) dv = 0.8;
      root.addEventListener("click", function (e) {
        var t = e.target.closest ? e.target.closest("[data-deci]") : null;
        if (!t || !root.contains(t)) return;
        dv = Math.round((dv + parseFloat(t.getAttribute("data-deci"))) * 10) / 10;
        dv = Math.max(0, Math.min(2, dv));
        var box = root.querySelector("[data-deci-svg]");
        if (box) box.innerHTML = "<svg viewBox='0 0 320 110'>" + deciDyn(dv) + "</svg>";
        var val = root.querySelector("[data-deci-val]");
        if (val) val.textContent = "현재 " + dv.toFixed(1);
        setMsg(root, "현재 " + dv.toFixed(1) + "! 0.1씩 움직이며 크기를 비교해 보세요.");
      });
    } else if (kind === "line") {
      var nums = (q || "").match(/(\d+)[^0-9]+(\d+)/);
      var la = nums ? parseInt(nums[1], 10) : 14, lb = nums ? parseInt(nums[2], 10) : 19;
      root.addEventListener("click", function (e) {
        var t = e.target.closest ? e.target.closest("[data-line]") : null;
        if (!t || !root.contains(t)) return;
        lb = Math.max(0, Math.min(30, lb + parseInt(t.getAttribute("data-line"), 10)));
        var box = root.querySelector("[data-line-svg]");
        var built = lineDyn(la, lb);
        if (box) box.innerHTML = "<svg viewBox='0 0 320 110'>" + built.svg + "</svg>";
        var val = root.querySelector("[data-line-val]");
        if (val) val.textContent = "월 " + la + "°C · 화 " + lb + "°C";
        setMsg(root, "차이는 " + built.diff + "°C! 꺾은선이 가파를수록 변화가 커요.");
      });
    } else if (kind === "range") {
      root.addEventListener("click", function (e) {
        var t = e.target.closest ? e.target.closest("[data-range]") : null;
        if (!t || !root.contains(t)) return;
        var act = t.getAttribute("data-range");
        setMsg(root, act === "in" ? "300은 '이상'에 포함돼요! (300 ≤ 수)" : "400은 '미만'이라 포함되지 않아요! (수 < 400)");
      });
    } else if (kind === "cuboid") {
      root.addEventListener("click", function (e) {
        var t = e.target.closest ? e.target.closest("[data-cuboid]") : null;
        if (!t || !root.contains(t)) return;
        var act = t.getAttribute("data-cuboid");
        setMsg(root, act === "face" ? "면은 6개! (위·아래·앞·뒤·왼쪽·오른쪽)" : (act === "edge" ? "모서리는 12개! (한 꼭짓점에 3개씩)" : "꼭짓점은 8개!"));
      });
    } else if (kind === "ratio") {
      var mm = (q || "").match(/(\d+)\s*:\s*(\d+)/);
      var ra = mm ? parseInt(mm[1], 10) : 2, rb = mm ? parseInt(mm[2], 10) : 3;
      root.addEventListener("click", function (e) {
        var t = e.target.closest ? e.target.closest("[data-ratio]") : null;
        if (!t || !root.contains(t)) return;
        var act = t.getAttribute("data-ratio");
        if (act === "a") ra = Math.min(12, ra + 1);
        else rb = Math.min(12, rb + 1);
        var box = root.querySelector("[data-ratio-svg]");
        if (box) box.innerHTML = "<svg viewBox='0 0 320 110'>" + ratioDyn(ra, rb) + "</svg>";
        var val = root.querySelector("[data-ratio-val]");
        if (val) val.textContent = ra + " : " + rb;
        setMsg(root, "현재 비 " + ra + " : " + rb + "! 전항·후항에 같은 수를 곱해도 비는 같아요.");
      });
    } else if (kind === "space") {
      root.addEventListener("click", function (e) {
        var t = e.target.closest ? e.target.closest("[data-space]") : null;
        if (!t || !root.contains(t)) return;
        var act = t.getAttribute("data-space");
        setMsg(root, act === "top" ? "위에서 보면 3개가 보여요!" : (act === "front" ? "앞에서 보면 2층이 보여요!" : "옆에서 봐도 2층이 보여요! 쌓기나무는 모두 3개예요."));
      });
    } else if (kind === "cyl") {
      root.addEventListener("click", function (e) {
        var t = e.target.closest ? e.target.closest("[data-cyl]") : null;
        if (!t || !root.contains(t)) return;
        var act = t.getAttribute("data-cyl");
        setMsg(root, act === "roll" ? "직사각형을 돌리면 원기둥, 삼각형을 돌리면 원뿔, 반원을 돌리면 구가 돼요!" : "원기둥은 둥근 면 1개+평평한 원 2개, 원뿔은 원 1개, 구는 둥근 면 1개예요!");
      });
    } else if (kind === "mul") {
      var p = parseMul(q);
      var per = p.tens + p.ones;
      var sel = [];
      for (var i = 0; i < p.b; i++) sel.push(false);
      root.addEventListener("click", function (e) {
        var t = e.target.closest ? e.target.closest("[data-mul]") : null;
        if (!t || !root.contains(t)) return;
        var idx = parseInt(t.getAttribute("data-mul"), 10);
        sel[idx] = !sel[idx];
        var rect = t.querySelector("rect");
        if (rect) rect.setAttribute("fill", sel[idx] ? "#FFDDAA" : "#FFF0CC");
        var n = 0;
        for (var k = 0; k < sel.length; k++) if (sel[k]) n++;
        setMsg(root, "선택한 묶음: " + n + "/" + p.b + "묶음" + (n ? " = " + (per * n) : "") + (n === p.b ? " · 전부 세었어요!" : ""));
      });
    } else if (kind === "divi") {
      var d = parseDivi(q);
      var done = [];
      for (var j = 0; j < d.b; j++) done.push(false);
      root.addEventListener("click", function (e) {
        var t = e.target.closest ? e.target.closest("[data-div]") : null;
        if (!t || !root.contains(t)) return;
        var idx = parseInt(t.getAttribute("data-div"), 10);
        done[idx] = !done[idx];
        var path = t.querySelector("path");
        if (path) path.setAttribute("fill", done[idx] ? "#D8F0DC" : "#FFF0CC");
        var label = root.querySelector("[data-divq='" + idx + "']");
        if (label) label.textContent = done[idx] ? "나눔!" : "?";
        var n = 0;
        for (var k = 0; k < done.length; k++) if (done[k]) n++;
        setMsg(root, "나눈 바구니: " + n + "/" + d.b + "곳" + (n === d.b ? " · 똑같이 나누었어요!" : ""));
      });
    } else if (kind === "circ" && String(lid || "").indexOf("circ-2") < 0 && String(lid || "").indexOf("space") < 0) {
      var numM = q.match(/(\d+)\s*cm/);
      var num = numM ? parseInt(numM[1], 10) : 6;
      var r = q.indexOf("반지름이") >= 0 ? num : Math.max(2, Math.round(num / 2));
      r = Math.max(2, Math.min(12, r));
      root.addEventListener("click", function (e) {
        var t = e.target.closest ? e.target.closest("[data-circ]") : null;
        if (!t || !root.contains(t)) return;
        r = Math.max(2, Math.min(12, r + parseInt(t.getAttribute("data-circ"), 10)));
        var box = root.querySelector("[data-circ-svg]");
        if (box) box.innerHTML = "<svg viewBox='0 0 320 110'>" + circDynSVG(r) + "</svg>";
        var val = root.querySelector("[data-circ-val]");
        if (val) val.textContent = "반지름 " + r + "cm ↔ 지름 " + (r * 2) + "cm";
        setMsg(root, "반지름 " + r + "cm일 때 지름은 " + (r * 2) + "cm! 지름은 항상 반지름의 2배예요.");
      });
    } else if (kind === "frac") {
      var fm = q.match(/(\d+)\/(\d+)/);
      var den = fm ? Math.min(8, parseInt(fm[2], 10)) : 4;
      var filled = [];
      var initN = fm ? Math.min(parseInt(fm[1], 10), den) : 1;
      for (var f = 0; f < den; f++) filled.push(f < initN);
      root.addEventListener("click", function (e) {
        var t = e.target.closest ? e.target.closest("[data-frac]") : null;
        if (!t || !root.contains(t)) return;
        var idx = parseInt(t.getAttribute("data-frac"), 10);
        filled[idx] = !filled[idx];
        var rect = t.querySelector("rect");
        if (rect) rect.setAttribute("fill", filled[idx] ? "#F5B23A" : "#FFFDF6");
        var n = 0;
        for (var k = 0; k < filled.length; k++) if (filled[k]) n++;
        setMsg(root, "색칠된 조각: " + n + "/" + den + (n === 0 ? " · 전부 비웠어요" : "") + (n === den ? " · 전부 색칠했어요!" : ""));
      });
    } else if (kind === "mea") {
      var isVol = (q || "").indexOf("mL") >= 0 || lid === "mea-1";
      var val = 500;
      var cap = 2000;
      root.addEventListener("click", function (e) {
        var t = e.target.closest ? e.target.closest("[data-mea]") : null;
        if (!t || !root.contains(t)) return;
        var step = parseInt(t.getAttribute("data-mea"), 10);
        if (step === 0) val = 0;
        else val = Math.min(cap, val + step);
        var svgBox = root.querySelector(".q-vis svg");
        var built = isVol ? meaVolSVG(val) : meaWtSVG(val);
        if (svgBox) {
          var tmp = document.createElement("div");
          tmp.innerHTML = "<svg viewBox='0 0 320 110'>" + built.svg + "</svg>";
          svgBox.replaceWith(tmp.firstChild);
        }
        setMsg(root, isVol ? ("현재 " + val + "mL" + (val >= 1000 ? " = " + (val / 1000) + "L!" : "")) : ("현재 " + val + "g" + (val >= 1000 ? " = " + (val / 1000) + "kg!" : "")));
      });
    } else if (kind === "gra") {
      var big = 2, small = 3;
      root.addEventListener("click", function (e) {
        var t = e.target.closest ? e.target.closest("[data-gra]") : null;
        if (!t || !root.contains(t)) return;
        var act = t.getAttribute("data-gra");
        if (act === "big") big = Math.min(5, big + 1);
        else if (act === "small") small = Math.min(9, small + 1);
        else { big = 0; small = 0; }
        var box = root.querySelector("[data-gra-svg]");
        if (box) box.innerHTML = "<svg viewBox='0 0 320 110'>" + graDynSVG(big, small) + "</svg>";
        setMsg(root, "큰 그림 " + big + "개(10씩) + 작은 그림 " + small + "개(1씩) = " + (big * 10 + small) + "!");
      });
    }
  }
  window.G3Visuals = { render: render, mount: mount };
})();
