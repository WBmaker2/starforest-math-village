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
  function render(house, lid, item) {
    var q = (item && item.q) || "";
    var inner = "", after = "";
    if (house === "mul") {
      var p = parseMul(q);
      inner = mulSvg(q);
      after = msgHtml("묶음 상자를 눌러 보세요! (0/" + p.b + "묶음 선택됨)");
    } else if (house === "divi") {
      var d = parseDivi(q);
      inner = diviSvg(q);
      after = msgHtml("바구니를 눌러 나누어 보세요! (0/" + d.b + "곳 나눔됨)");
    } else if (house === "circ") {
      var c = circSvg(lid, q);
      if (lid === "circ-2") {
        inner = c;
        after = "";
      } else {
        return "<div class='q-vis' aria-hidden='true'>" + c + "</div>"
          + msgHtml("단추를 눌러 원의 크기를 바꾸면 반지름과 지름이 어떻게 변할까요?");
      }
    } else if (house === "frac") {
      var f = fracSvg(q);
      inner = f.svg;
      after = msgHtml("색칠된 조각: " + Math.min(f.num, f.den) + "/" + f.den + " · 칸을 눌러 색칠하거나 비워 보세요!");
    } else if (house === "mea") {
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
    if (house === "mul") {
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
    } else if (house === "divi") {
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
    } else if (house === "circ" && lid !== "circ-2") {
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
    } else if (house === "frac") {
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
    } else if (house === "mea") {
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
    } else if (house === "gra") {
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
