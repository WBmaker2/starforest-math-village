(function () {
  function rnd(n, m) { return n + Math.floor(Math.random() * (m - n + 1)); }
  var PAD_LEVEL = 2;
  function RL(lo, hi) {
    lo = Math.max(0, lo); hi = Math.max(lo, hi);
    if (PAD_LEVEL <= 1) {
      var h1 = lo + Math.ceil((hi - lo) * 0.5);
      return rnd(lo, h1);
    }
    if (PAD_LEVEL >= 3) {
      var l3 = lo + Math.floor((hi - lo) * 0.3);
      var h3 = hi + Math.ceil((hi - lo) * 0.3);
      return rnd(l3, h3);
    }
    return rnd(lo, hi);
  }
  function setLevel(lv) {
    PAD_LEVEL = (lv < 1) ? 1 : ((lv > 3) ? 3 : lv);
  }
  function recordFirst(ok) {
    try {
      var d = window.G3Store.load();
      if (!d.recent) d.recent = [];
      d.recent.push(ok ? 1 : 0);
      if (d.recent.length > 20) d.recent = d.recent.slice(d.recent.length - 20);
      window.G3Store.save(d);
    } catch (e) {}
  }
  function level() {
    try {
      var t = window.G3TUNE || {};
      var win = (t.adaptWindow == null) ? 12 : t.adaptWindow;
      var up = (t.adaptUp == null) ? 0.82 : t.adaptUp;
      var dn = (t.adaptDown == null) ? 0.38 : t.adaptDown;
      var d = window.G3Store.load();
      var r = d.recent || [];
      if (r.length < 4) return d.adaptLevel || 2;
      var tail = r.slice(-win);
      var sum = 0;
      for (var i = 0; i < tail.length; i++) sum += tail[i];
      var avg = sum / tail.length;
      var lv = avg >= up ? 3 : (avg < dn ? 1 : 2);
      if (lv !== d.adaptLevel) {
        d.adaptLevel = lv;
        window.G3Store.save(d);
        if (window.G3UI) {
          window.G3UI.toast(lv === 1 ? "🌱 조금 더 쉬운 문제로 낼게!" : (lv === 3 ? "🚀 조금 더 어려운 문제에 도전!" : "😊 지금 난이도를 유지할게!"));
        }
      }
      return lv;
    } catch (e) { return 2; }
  }
  function mountKeypad(boxId, inputId) {
    var box = document.getElementById(boxId);
    var inp = document.getElementById(inputId);
    if (!box || !inp) return;
    var keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "back", "clear"];
    var html = "";
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      var label = k === "back" ? "← 지우기" : (k === "clear" ? "C 모두지우기" : (k === "." ? ". 소수점" : k));
      var cls = k === "back" || k === "clear" ? "keypad-key keypad-fn" : "keypad-key";
      html += "<button type='button' class='" + cls + "' data-key='" + k + "'>" + label + "</button>";
    }
    box.innerHTML = html;
    box.addEventListener("click", function (e) {
      var t = e.target.closest ? e.target.closest("[data-key]") : null;
      if (!t) return;
      var k2 = t.getAttribute("data-key");
      var cur = (inp.value || "").replace(/[^0-9.]/g, "");
      if (k2 === "back") cur = cur.slice(0, -1);
      else if (k2 === "clear") cur = "";
      else if (k2 === ".") { if (cur.indexOf(".") < 0 && cur.length < 6) cur += "."; }
      else if (cur.replace(".", "").length < 6) cur += k2;
      inp.value = cur;
      inp.focus();
    });
  }
  var PENS = {
    black: { color: "#3E3428", width: 3, label: "⚫ 검정펜" },
    red: { color: "#E4574D", width: 3, label: "🔴 빨강펜" },
    blue: { color: "#2B6CB0", width: 3, label: "🔵 파랑펜" },
    eraser: { color: "#FFFFFF", width: 16, label: "🧽 지우개" }
  };
  function mountCanvas(canvasId, clearId, toolsId) {
    var cv = document.getElementById(canvasId);
    if (!cv) return;
    var ctx = cv.getContext("2d");
    ctx.lineCap = "round";
    var pen = "black";
    function applyPen() {
      var p = PENS[pen] || PENS.black;
      ctx.strokeStyle = p.color;
      ctx.lineWidth = p.width;
      if (toolsId) {
        var btns = document.querySelectorAll("#" + toolsId + " [data-pen]");
        for (var bi = 0; bi < btns.length; bi++) {
          btns[bi].classList.toggle("sel", btns[bi].getAttribute("data-pen") === pen);
        }
      }
    }
    applyPen();
    if (toolsId) {
      var tools = document.getElementById(toolsId);
      if (tools && !tools.dataset.ready) {
        tools.dataset.ready = "1";
        tools.addEventListener("click", function (e) {
          var t = e.target.closest ? e.target.closest("[data-pen]") : null;
          if (!t) return;
          pen = t.getAttribute("data-pen") || "black";
          if (!PENS[pen]) pen = "black";
          applyPen();
        });
      }
    }
    var drawing = false, last = null;
    function posOf(e) {
      var r = cv.getBoundingClientRect();
      var cx = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
      var cy = (e.touches && e.touches[0]) ? e.touches[0].clientY : e.clientY;
      return { x: (cx - r.left) * (cv.width / r.width), y: (cy - r.top) * (cv.height / r.height) };
    }
    cv.addEventListener("pointerdown", function (e) {
      e.preventDefault();
      drawing = true;
      last = posOf(e);
      try { cv.setPointerCapture(e.pointerId); } catch (err) {}
    });
    cv.addEventListener("pointermove", function (e) {
      if (!drawing) return;
      e.preventDefault();
      var p = posOf(e);
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      last = p;
    });
    function stop() { drawing = false; }
    cv.addEventListener("pointerup", stop);
    cv.addEventListener("pointercancel", stop);
    var clr = clearId ? document.getElementById(clearId) : null;
    if (clr) clr.addEventListener("click", function () {
      ctx.clearRect(0, 0, cv.width, cv.height);
    });
  }
  function genMul() {
    var out = [];
    for (var i = 0; i < 6; i++) {
      var a = RL(2, 9) * 10, b = RL(2, 5);
      var ans = a * b;
      out.push({ q: a + " × " + b + " = ?", a: String(ans),
        steps: [(a / 10) + " × " + b + " = " + (ans / 10), "0을 붙이면 " + ans] });
    }
    return out;
  }
  function genDivi() {
    var out = [];
    for (var i = 0; i < 6; i++) {
      var d = RL(2, 5), q = RL(2, 9);
      var top = d * q * 10;
      out.push({ q: top + " ÷ " + d + " = ?", a: String(q * 10),
        steps: [(top / 10) + " ÷ " + d + " = " + q, "십의 자리이므로 " + (q * 10)] });
    }
    return out;
  }
  function genCirc() {
    var out = [];
    for (var i = 0; i < 6; i++) {
      var r = RL(3, 9);
      if (i % 2 === 0) {
        out.push({ q: "반지름이 " + r + "cm인 원의 지름은 몇 cm?", a: String(r * 2),
          steps: ["지름은 반지름의 2배", r + " × 2 = " + (r * 2) + "cm"] });
      } else {
        out.push({ q: "지름이 " + (r * 2) + "cm인 원의 반지름은 몇 cm?", a: String(r),
          steps: ["반지름은 지름의 절반", (r * 2) + " ÷ 2 = " + r + "cm"] });
      }
    }
    return out;
  }
  function genFrac() {
    var out = [];
    for (var i = 0; i < 6; i++) {
      var den = RL(2, 5), num = RL(1, den), k = RL(2, 4);
      var tot = den * k, ans = num * k;
      out.push({ q: "과자 " + tot + "개의 " + num + "/" + den + "은 몇 개?", a: String(ans),
        steps: [tot + " ÷ " + den + " = " + k + "개가 1/" + den, k + " × " + num + " = " + ans + "개"] });
    }
    return out;
  }
  function genMea() {
    var out = [];
    for (var i = 0; i < 6; i++) {
      if (i % 2 === 0) {
        var ml = RL(1, 9) * 100 + RL(0, 9) * 10;
        var L = RL(1, 2);
        out.push({ q: L + "L " + ml + "mL는 모두 몇 mL?", a: String(L * 1000 + ml),
          steps: [L + "L = " + (L * 1000) + "mL", (L * 1000) + " + " + ml + " = " + (L * 1000 + ml) + "mL"] });
      } else {
        var g = RL(1, 9) * 100 + RL(0, 9) * 10;
        var kg = RL(1, 2);
        out.push({ q: kg + "kg " + g + "g은 모두 몇 g?", a: String(kg * 1000 + g),
          steps: [kg + "kg = " + (kg * 1000) + "g", (kg * 1000) + " + " + g + " = " + (kg * 1000 + g) + "g"] });
      }
    }
    return out;
  }
  function genGra() {
    var out = [];
    for (var i = 0; i < 6; i++) {
      var big = RL(1, 5), small = RL(0, 9);
      out.push({ q: "큰 그림(10) " + big + "개와 작은 그림(1) " + small + "개는 얼마를 나타낼까?", a: String(big * 10 + small),
        steps: ["10 × " + big + " = " + (big * 10), (big * 10) + " + " + small + " = " + (big * 10 + small)] });
    }
    return out;
  }
  function genDeciAdd() {
    var out = [];
    for (var i = 0; i < 6; i++) {
      var a = RL(1, 9) / 10, b = RL(1, 9) / 10;
      var ans = Math.round((a + b) * 10) / 10;
      out.push({ q: a.toFixed(1) + " + " + b.toFixed(1) + " = ?", a: String(ans),
        steps: ["소수점을 맞추어 계산", a.toFixed(1) + " + " + b.toFixed(1) + " = " + ans] });
    }
    return out;
  }
  function genLineDiff() {
    var out = [];
    for (var i = 0; i < 6; i++) {
      var a = RL(10, 20), b = a + RL(2, 9);
      out.push({ q: "월요일 " + a + "°C, 화요일 " + b + "°C일 때 오른 기온은 몇 °C?", a: String(b - a),
        steps: [b + " - " + a + " = " + (b - a) + "°C"] });
    }
    return out;
  }
  function genAvg() {
    var out = [];
    for (var i = 0; i < 6; i++) {
      var a = RL(4, 10), b = RL(4, 10), c = 24 - a - b;
      if (c < 2 || c > 12) { c = RL(4, 10); }
      var sum = a + b + c;
      var avg = Math.round(sum / 3);
      if (sum % 3 !== 0) { a = 6; b = 8; c = 10; sum = 24; avg = 8; }
      out.push({ q: a + "개, " + b + "개, " + c + "개의 평균은 몇 개?", a: String(avg),
        steps: ["합 " + sum + " ÷ 3", "평균 " + avg + "개"] });
    }
    return out;
  }
  function genRatio() {
    var out = [];
    for (var i = 0; i < 6; i++) {
      var a = RL(2, 4), b = RL(3, 5), k = RL(2, 4);
      out.push({ q: a + " : " + b + " = " + (a * k) + " : ?  (? 구하기)", a: String(b * k),
        steps: ["전항이 " + k + "배", "후항도 " + b + " × " + k + " = " + (b * k)] });
    }
    return out;
  }
  function genCircle() {
    var out = [];
    for (var i = 0; i < 6; i++) {
      var r = RL(4, 10);
      if (i % 2 === 0) out.push({ q: "반지름 " + r + "cm인 원의 지름은 몇 cm?", a: String(r * 2), steps: [r + " × 2 = " + (r * 2) + "cm"] });
      else out.push({ q: "지름 " + (r * 2) + "cm인 원의 원주는 몇 cm? (원주율 3.14)", a: String(Math.round(r * 2 * 3.14 * 10) / 10).replace(/\.0$/, ""), steps: ["원주 = 지름 × 3.14", (r * 2) + " × 3.14"] });
    }
    return out;
  }
  function genTri() {
    var out = [];
    for (var i = 0; i < 6; i++) {
      var kind = i % 4;
      if (kind === 0) {
        var s = RL(4, 9);
        out.push({ q: "정삼각형 한 변이 " + s + "cm일 때 둘레는 몇 cm?", a: String(s * 3),
          steps: [s + " × 3 = " + (s * 3) + "cm"] });
      } else if (kind === 1) {
        var e = RL(5, 9), b = RL(3, 7);
        out.push({ q: "이등변삼각형의 같은 변이 " + e + "cm씩, 아래변이 " + b + "cm일 때 둘레는 몇 cm?", a: String(e * 2 + b),
          steps: [e + " + " + e + " + " + b + " = " + (e * 2 + b) + "cm"] });
      } else if (kind === 2) {
        var a1 = RL(30, 80), a2 = RL(30, 80);
        var rest = 180 - a1 - a2;
        if (rest < 20 || rest > 120) { a1 = 50; a2 = 70; rest = 60; }
        out.push({ q: "삼각형의 두 각이 " + a1 + "도와 " + a2 + "도입니다. 나머지 한 각은 몇 도?", a: String(rest),
          steps: ["180 - " + a1 + " - " + a2 + " = " + rest + "도"] });
      } else {
        out.push({ q: "삼각형의 세 각의 합은 몇 도?", a: "180", steps: ["삼각형 내각의 합은 180도"] });
      }
    }
    return out;
  }
  function genQuad() {
    var out = [];
    for (var i = 0; i < 6; i++) {
      var kind = i % 4;
      if (kind === 0) {
        var s = RL(4, 12);
        out.push({ q: "정사각형 한 변이 " + s + "cm일 때 둘레는 몇 cm?", a: String(s * 4),
          steps: [s + " × 4 = " + (s * 4) + "cm"] });
      } else if (kind === 1) {
        var w = RL(5, 12), h = RL(3, 9);
        out.push({ q: "가로 " + w + "cm, 세로 " + h + "cm 직사각형의 둘레는 몇 cm?", a: String((w + h) * 2),
          steps: ["(" + w + " + " + h + ") × 2 = " + ((w + h) * 2) + "cm"] });
      } else if (kind === 2) {
        var r = RL(5, 10);
        out.push({ q: "마름모 한 변이 " + r + "cm일 때 둘레는 몇 cm?", a: String(r * 4),
          steps: [r + " × 4 = " + (r * 4) + "cm"] });
      } else {
        out.push({ q: "직사각형의 직각은 모두 몇 개?", a: "4", steps: ["직사각형은 직각 4개"] });
      }
    }
    return out;
  }
  function genPoly() {
    var out = [];
    var names = { 5: "오각형", 6: "육각형", 7: "칠각형", 8: "팔각형" };
    for (var i = 0; i < 6; i++) {
      var n = RL(5, 8);
      var kind = i % 3;
      if (kind === 0) out.push({ q: names[n] + "의 변은 모두 몇 개?", a: String(n), steps: [names[n] + "은 변 " + n + "개"] });
      else if (kind === 1) out.push({ q: names[n] + "의 한 꼭짓점에서 그을 수 있는 대각선은 몇 개?", a: String(n - 3), steps: [n + " - 3 = " + (n - 3) + "개"] });
      else {
        var k = RL(2, 3);
        out.push({ q: "정" + names[n] + " 타일 " + k + "개의 변의 수 합은 몇 개?", a: String(n * k), steps: [n + " × " + k + " = " + (n * k) + "개"] });
      }
    }
    return out;
  }
  function genRange() {
    var out = [];
    for (var i = 0; i < 6; i++) {
      if (i % 3 === 0) {
        var lo = RL(2, 6) * 100;
        out.push({ q: lo + " 이상 " + (lo + 100) + " 미만의 수 중 가장 작은 수는?", a: String(lo),
          steps: ["이상은 그 수 포함", "가장 작은 수는 " + lo] });
      } else if (i % 3 === 1) {
        var v = RL(300, 900);
        var tens = Math.round(v / 10) * 10;
        out.push({ q: v + "를 십의 자리에서 반올림하면?", a: String(Math.round(v / 10) * 10),
          steps: ["일의 자리를 보고 올림·버림", "약 " + (Math.round(v / 10) * 10)] });
      } else {
        var w = RL(1200, 1800);
        out.push({ q: w + "을 백의 자리에서 반올림하면?", a: String(Math.round(w / 100) * 100),
          steps: ["십의 자리를 보고 올림·버림", "약 " + (Math.round(w / 100) * 100)] });
      }
    }
    return out;
  }
  function genFracMul() {
    var out = [];
    for (var i = 0; i < 6; i++) {
      if (i % 2 === 0) {
        var den = RL(2, 6), k = RL(2, 5), num = RL(1, den - 1);
        var whole = den * k;
        out.push({ q: "과자 " + whole + "개의 " + num + "/" + den + "은 몇 개?", a: String(num * k),
          steps: [whole + " ÷ " + den + " = " + k, k + " × " + num + " = " + (num * k) + "개"] });
      } else {
        var d2 = RL(2, 5), n2 = 1, t = RL(2, 6);
        out.push({ q: n2 + "/" + d2 + " × " + t + " = " + d2 + "분의 몇?", a: String(t),
          steps: ["분모는 그대로 " + d2, "1 × " + t + " = " + t + "이므로 " + t + "/" + d2] });
      }
    }
    return out;
  }
  function genSymm() {
    var out = [];
    for (var i = 0; i < 6; i++) {
      var kind = i % 3;
      if (kind === 0) out.push({ q: "정사각형의 대칭축은 모두 몇 개?", a: "4", steps: ["정사각형은 대칭축 4개"] });
      else if (kind === 1) out.push({ q: "정삼각형의 대칭축은 모두 몇 개?", a: "3", steps: ["정삼각형은 대칭축 3개"] });
      else out.push({ q: "원작과 칸 수가 똑같은 합동 그림 찾기: 원작 5칸 십자가와 합동인 것은 몇 칸?", a: "5", steps: ["합동은 칸 수와 모양이 같음", "5칸"] });
    }
    return out;
  }
  function genDeciMul() {
    var out = [];
    for (var i = 0; i < 6; i++) {
      var a = (RL(1, 9) / 10), t = RL(2, 5);
      var ans = Math.round(a * t * 10) / 10;
      out.push({ q: a.toFixed(1) + " × " + t + " = ?", a: String(ans),
        steps: [(a * 10) + " × " + t + " = " + (a * 10 * t), "10으로 나누면 " + ans] });
    }
    return out;
  }
  function genCuboid() {
    var out = [];
    for (var i = 0; i < 6; i++) {
      var kind = i % 3;
      if (kind === 0) out.push({ q: "직육면체의 면은 모두 몇 개?", a: "6", steps: ["위·아래·앞·뒤·왼쪽·오른쪽 = 6개"] });
      else if (kind === 1) out.push({ q: "직육면체의 모서리는 모두 몇 개?", a: "12", steps: ["모서리는 12개"] });
      else out.push({ q: "직육면체의 꼭짓점은 모두 몇 개?", a: "8", steps: ["꼭짓점은 8개"] });
    }
    return out;
  }
  function genFracDiv() {
    var out = [];
    for (var i = 0; i < 6; i++) {
      if (i % 2 === 0) {
        var d = RL(2, 6), top = RL(2, 5), bot = 1;
        out.push({ q: top + "/" + d + " ÷ " + bot + "/" + d + "는 몇 묶음?", a: String(top),
          steps: [top + " ÷ " + bot + " = " + top + "묶음"] });
      } else {
        var w = RL(2, 4), u = RL(2, 4);
        out.push({ q: w + " ÷ 1/" + u + "는 몇 묶음?", a: String(w * u),
          steps: [w + " × " + u + " = " + (w * u) + "묶음"] });
      }
    }
    return out;
  }
  function genDecDiv() {
    var out = [];
    for (var i = 0; i < 6; i++) {
      var a = RL(2, 9), b = RL(2, 4);
      var qv = (a * 10) / 10;
      out.push({ q: (a * b / 10).toFixed(1) + " ÷ " + (b / 10).toFixed(1) + " = ?", a: String(a),
        steps: ["소수점을 오른쪽으로 한 칸씩 옮기기", (a * b) + " ÷ " + b + " = " + a] });
    }
    return out;
  }
  function genSpace() {
    var out = [];
    for (var i = 0; i < 6; i++) {
      var kind = i % 3;
      if (kind === 0) out.push({ q: "쌓기나무 2층(아래 2개·위 1개)을 위에서 보면 몇 개로 보일까?", a: "3",
        steps: ["위에서 보면 3개가 보임"] });
      else if (kind === 1) out.push({ q: "쌓기나무가 모두 5개입니다. 앞에서 2층이 보일 때 위에서 최소 몇 개?", a: "3",
        steps: ["2층 구조는 위에서 3개 이상 보임"] });
      else out.push({ q: "쌓기나무 4개를 한 층으로 놓으면 위에서 몇 개로 보일까?", a: "4",
        steps: ["한 층이면 놓은 만큼 보임"] });
    }
    return out;
  }
  function genCircleArea() {
    var out = [];
    for (var i = 0; i < 6; i++) {
      var r = RL(4, 10);
      if (i % 2 === 0) out.push({ q: "반지름 " + r + "cm인 원의 지름은 몇 cm?", a: String(r * 2), steps: [r + " × 2 = " + (r * 2) + "cm"] });
      else out.push({ q: "지름 " + (r * 2) + "cm인 원의 원주는 몇 cm? (원주율 3.14)", a: String(Math.round(r * 2 * 3.14 * 10) / 10).replace(/\.0$/, ""), steps: ["원주 = 지름 × 3.14", (r * 2) + " × 3.14"] });
    }
    return out;
  }
  function genCyl() {
    var out = [];
    for (var i = 0; i < 6; i++) {
      var kind = i % 3;
      if (kind === 0) out.push({ q: "원기둥의 평평한 원 모양 면은 몇 개?", a: "2", steps: ["위·아래 원 2개"] });
      else if (kind === 1) out.push({ q: "원뿔의 꼭짓점은 몇 개?", a: "1", steps: ["원뿔은 뾰족점 1개"] });
      else out.push({ q: "구의 둥근 면은 몇 개?", a: "1", steps: ["구는 둥근 면 1개"] });
    }
    return out;
  }
  // ---- 1학기 전용 생성기 (2026-10-24): 단원별 맞춤 무한 연습 ----
  function genS1Add() {
    var out = [];
    for (var i = 0; i < 6; i++) {
      var a = RL(100, 899), b = RL(100, 899);
      if (i % 2 === 0) out.push({ q: a + " + " + b + " = ?", a: String(a + b),
        steps: ["받아올림에 주의", a + " + " + b + " = " + (a + b)] });
      else {
        var t = RL(300, 900), m = RL(100, t - 1);
        out.push({ q: t + " - " + m + " = ?", a: String(t - m),
          steps: ["받아내림에 주의", t + " - " + m + " = " + (t - m)] });
      }
    }
    return out;
  }
  function genS1Shape() {
    var out = [];
    for (var i = 0; i < 6; i++) {
      var kind = i % 4;
      if (kind === 0) out.push({ q: "직각은 몇 도?", a: "90", steps: ["직각 = 90도"] });
      else if (kind === 1) out.push({ q: "평각은 몇 도?", a: "180", steps: ["평각 = 180도"] });
      else if (kind === 2) { var s = RL(3, 6); out.push({ q: "정사각형의 직각은 모두 몇 개?", a: "4", steps: ["직사각형·정사각형은 직각 4개"] }); }
      else { var v = RL(3, 5); out.push({ q: "한 변이 " + v + "cm인 정삼각형의 둘레는 몇 cm?", a: String(v * 3), steps: [v + " × 3 = " + (v * 3) + "cm"] }); }
    }
    return out;
  }
  function genS1Div() {
    var out = [];
    for (var i = 0; i < 6; i++) {
      var d = RL(2, 9), q = RL(2, 9);
      out.push({ q: (d * q) + " ÷ " + d + " = ?", a: String(q),
        steps: [d + " × " + q + " = " + (d * q), "따라서 몫은 " + q] });
    }
    return out;
  }
  function genS1Mul2() {
    var out = [];
    for (var i = 0; i < 6; i++) {
      var a = RL(12, 49), b = RL(2, 9);
      out.push({ q: a + " × " + b + " = ?", a: String(a * b),
        steps: [(Math.floor(a / 10) * 10) + " × " + b + " = " + (Math.floor(a / 10) * 10 * b), (a % 10) + " × " + b + " = " + ((a % 10) * b), "합하면 " + (a * b)] });
    }
    return out;
  }
  function genS1Len() {
    var out = [];
    for (var i = 0; i < 6; i++) {
      var kind = i % 4;
      if (kind === 0) { var c = RL(2, 9); out.push({ q: c + "cm는 몇 mm?", a: String(c * 10), steps: ["1cm = 10mm", c + " × 10 = " + (c * 10) + "mm"] }); }
      else if (kind === 1) { var m = RL(2, 9); out.push({ q: m + "m는 몇 cm?", a: String(m * 100), steps: ["1m = 100cm", m + " × 100 = " + (m * 100) + "cm"] }); }
      else if (kind === 2) { var mi = RL(2, 9); out.push({ q: mi + "분은 몇 초?", a: String(mi * 60), steps: ["1분 = 60초", mi + " × 60 = " + (mi * 60) + "초"] }); }
      else { var h = RL(2, 5); out.push({ q: h + "시간은 몇 분?", a: String(h * 60), steps: ["1시간 = 60분", h + " × 60 = " + (h * 60) + "분"] }); }
    }
    return out;
  }
  function genS1Frac() {
    var out = [];
    for (var i = 0; i < 6; i++) {
      var kind = i % 3;
      if (kind === 0) { var den = RL(2, 8), num = RL(1, den - 1); out.push({ q: "전체를 " + den + "등분 중 " + num + "조각은 " + den + "분의 몇? (분자만 숫자로)", a: String(num), steps: ["조각 수만큼이 분자", "→ " + num] }); }
      else if (kind === 1) { var t = RL(2, 9); out.push({ q: "0.1이 " + t + "개이면 얼마?", a: "0." + t, steps: ["0.1 × " + t + " = 0." + t] }); }
      else { var whole = RL(1, 3), tenth = RL(1, 9); out.push({ q: whole + "." + tenth + "는 0.1이 몇 개?", a: String(whole * 10 + tenth), steps: ["1은 0.1이 10개", (whole * 10) + " + " + tenth + " = " + (whole * 10 + tenth) + "개"] }); }
    }
    return out;
  }
  function genS1Big() {
    var out = [];
    for (var i = 0; i < 6; i++) {
      var kind = i % 3;
      if (kind === 0) { var k = RL(2, 9); out.push({ q: "10000이 " + k + "개이면 얼마?", a: String(k * 10000), steps: ["10000 × " + k + " = " + (k * 10000)] }); }
      else if (kind === 1) { var e = RL(2, 9); out.push({ q: e + "억은 0이 몇 개?", a: "8", steps: ["1억은 0이 8개", "→ 8개"] }); }
      else { var v = RL(10000, 99999); var man = Math.round(v / 10000); out.push({ q: v + "를 만의 자리에서 어림하면 몇 만?", a: String(man), steps: ["천의 자리를 보고 올림·버림", "약 " + man + "만"] }); }
    }
    return out;
  }
  function genS1Angle() {
    var out = [];
    for (var i = 0; i < 6; i++) {
      var kind = i % 4;
      if (kind === 0) { var a1 = RL(20, 70), a2 = RL(20, 70); var rest = 180 - a1 - a2; if (rest < 20 || rest > 120) { a1 = 50; a2 = 70; rest = 60; } out.push({ q: "삼각형의 두 각이 " + a1 + "도와 " + a2 + "도입니다. 나머지 한 각은 몇 도?", a: String(rest), steps: ["180 - " + a1 + " - " + a2 + " = " + rest + "도"] }); }
      else if (kind === 1) { var d = RL(30, 80); out.push({ q: "예각 " + d + "도와 직각 90도의 차는 몇 도?", a: String(90 - d), steps: ["90 - " + d + " = " + (90 - d) + "도"] }); }
      else if (kind === 2) { var t = RL(100, 170); out.push({ q: "둔각 " + t + "도와 180도의 차는 몇 도?", a: String(180 - t), steps: ["180 - " + t + " = " + (180 - t) + "도"] }); }
      else out.push({ q: "사각형 네 각의 합은 몇 도?", a: "360", steps: ["사각형 내각의 합은 360도"] });
    }
    return out;
  }
  function genS1MulDiv() {
    var out = [];
    for (var i = 0; i < 6; i++) {
      if (i % 2 === 0) { var a = RL(102, 329), b = RL(11, 29); out.push({ q: a + " × " + b + " = ?", a: String(a * b), steps: [a + " × " + b + "를 자리대로 계산", "답 " + (a * b)] }); }
      else { var d = RL(11, 25), q = RL(2, 9); out.push({ q: (d * q) + " ÷ " + d + " = ?", a: String(q), steps: [d + " × " + q + " = " + (d * q), "따라서 몫은 " + q] }); }
    }
    return out;
  }
  function genS1Move() {
    var out = [];
    for (var i = 0; i < 6; i++) {
      var kind = i % 3;
      if (kind === 0) { var s = RL(4, 12); out.push({ q: "한 변 " + s + "cm 정사각형을 밀었을 때 둘레는 몇 cm?", a: String(s * 4), steps: ["밀기는 합동 이동", s + " × 4 = " + (s * 4) + "cm"] }); }
      else if (kind === 1) { var w = RL(5, 12), h = RL(3, 9); out.push({ q: "가로 " + w + "cm 세로 " + h + "cm 직사각형을 90도 돌렸을 때 둘레는 몇 cm?", a: String((w + h) * 2), steps: ["돌려도 합동", "(" + w + " + " + h + ") × 2 = " + ((w + h) * 2) + "cm"] }); }
      else { var n = RL(2, 5); out.push({ q: "삼각형 타일 " + n + "개를 밀어 이어 붙이면 변의 수 합은 몇 개?", a: String(3 * n), steps: ["3 × " + n + " = " + (3 * n) + "개"] }); }
    }
    return out;
  }
  function genS1Bar() {
    var out = [];
    for (var i = 0; i < 6; i++) {
      var a = RL(5, 20), b = RL(5, 20);
      if (i % 2 === 0) out.push({ q: "축구 " + a + "명, 농구 " + b + "명이면 차이는 몇 명?", a: String(Math.abs(a - b)), steps: ["큰 수 - 작은 수", "차이 " + Math.abs(a - b) + "명"] });
      else out.push({ q: "월~금 독서량이 " + a + ", " + b + "권이면 합은 몇 권?", a: String(a + b), steps: [a + " + " + b + " = " + (a + b) + "권"] });
    }
    return out;
  }
  function genS1Rule() {
    var out = [];
    for (var i = 0; i < 6; i++) {
      var kind = i % 3;
      if (kind === 0) { var s = RL(1, 20), d = RL(2, 9); out.push({ q: s + ", " + (s + d) + ", " + (s + d * 2) + " 다음 수는?", a: String(s + d * 3), steps: [d + "씩 커짐", "다음은 " + (s + d * 3)] }); }
      else if (kind === 1) { var s2 = RL(50, 100), d2 = RL(3, 10); out.push({ q: s2 + ", " + (s2 - d2) + ", " + (s2 - d2 * 2) + " 다음 수는?", a: String(s2 - d2 * 3), steps: [d2 + "씩 작아짐", "다음은 " + (s2 - d2 * 3)] }); }
      else { var k = RL(2, 9); out.push({ q: "1, 4, 9 자리에서 " + k + "번째 수는? (" + k + "×" + k + ")", a: String(k * k), steps: ["제곱수 배열", k + " × " + k + " = " + (k * k)] }); }
    }
    return out;
  }
  function genS1Mix() {
    var out = [];
    for (var i = 0; i < 6; i++) {
      var kind = i % 4;
      if (kind === 0) { var a = RL(2, 9), b = RL(2, 9), c = RL(2, 9); out.push({ q: a + " + " + b + " × " + c + " = ?", a: String(a + b * c), steps: ["곱셈 먼저 " + b + " × " + c + " = " + (b * c), a + " + " + (b * c) + " = " + (a + b * c)] }); }
      else if (kind === 1) { var d = RL(2, 9), e = RL(2, 9), f = RL(2, 9); out.push({ q: d + " × " + e + " - " + f + " = ?", a: String(d * e - f), steps: ["곱셈 먼저 " + (d * e), (d * e) + " - " + f + " = " + (d * e - f)] }); }
      else if (kind === 2) { var g = RL(2, 9), h = RL(2, 9), j = RL(2, 9); out.push({ q: "(" + g + " + " + h + ") × " + j + " = ?", a: String((g + h) * j), steps: ["괄호 먼저 " + (g + h), (g + h) + " × " + j + " = " + ((g + h) * j)] }); }
      else { var p = RL(3, 9), m = RL(2, 9); out.push({ q: p + " × " + m + " + " + p + " × 2 = ?", a: String(p * m + p * 2), steps: ["곱셈 두 개 먼저", (p * m) + " + " + (p * 2) + " = " + (p * m + p * 2)] }); }
    }
    return out;
  }
  function genS1Divisor() {
    var out = [];
    for (var i = 0; i < 6; i++) {
      var kind = i % 4;
      if (kind === 0) { var n = RL(10, 30); var divs = []; for (var d = 1; d <= n; d++) if (n % d === 0) divs.push(d); var pick = divs[rnd(0, divs.length - 1)]; out.push({ q: n + "의 약수 중 하나는? (힌트: " + pick + " 포함)", a: String(pick), steps: [n + " ÷ " + pick + " = " + (n / pick), "약수 " + pick] }); }
      else if (kind === 1) { var t = RL(2, 9); out.push({ q: t + "의 배수 중 " + t + "보다 큰 가장 작은 수는?", a: String(t * 2), steps: [t + " × 2 = " + (t * 2)] }); }
      else if (kind === 2) { var a2 = RL(2, 9) * 2, b2 = RL(2, 9) * 2; var g = 1; for (var k2 = 2; k2 <= Math.min(a2, b2); k2++) if (a2 % k2 === 0 && b2 % k2 === 0) g = k2; out.push({ q: a2 + "와 " + b2 + "의 최대공약수는?", a: String(g), steps: ["공약수 중 가장 큰 수", "→ " + g] }); }
      else { var c2 = RL(2, 6), e2 = RL(2, 6); var l = c2; while (l % c2 !== 0 || l % e2 !== 0) l++; var l2 = c2 * e2; for (var m2 = Math.max(c2, e2); m2 <= c2 * e2; m2++) if (m2 % c2 === 0 && m2 % e2 === 0) { l2 = m2; break; } out.push({ q: c2 + "와 " + e2 + "의 최소공배수는?", a: String(l2), steps: ["공배수 중 가장 작은 수", "→ " + l2] }); }
    }
    return out;
  }
  function genS1Cor() {
    var out = [];
    for (var i = 0; i < 6; i++) {
      var kind = i % 3;
      if (kind === 0) { var a = RL(2, 9), x = RL(2, 9); out.push({ q: "의자 1개당 다리 " + a + "개, " + x + "개면 다리는 몇 개? (y=" + a + "×x)", a: String(a * x), steps: [a + " × " + x + " = " + (a * x) + "개"] }); }
      else if (kind === 1) { var c = RL(2, 9), x2 = RL(2, 20); out.push({ q: "y = x + " + c + "에서 x=" + x2 + "이면 y는?", a: String(x2 + c), steps: [x2 + " + " + c + " = " + (x2 + c)] }); }
      else { var p2 = RL(50, 200), x3 = RL(2, 9); out.push({ q: "책 1권 " + p2 + "쪽, " + x3 + "권이면 모두 몇 쪽?", a: String(p2 * x3), steps: [p2 + " × " + x3 + " = " + (p2 * x3) + "쪽"] }); }
    }
    return out;
  }
  function genS1Reduce() {
    var out = [];
    for (var i = 0; i < 6; i++) {
      var kind = i % 3;
      if (kind === 0) { var d = RL(2, 9), k = RL(2, 5), n = RL(1, d - 1); out.push({ q: (n * k) + "/" + (d * k) + "를 약분하면 분자는? (기약분수로)", a: String(n), steps: ["분모·분자를 " + k + "(으)로 나눔", "분자 " + n] }); }
      else if (kind === 1) { var d2 = RL(2, 9), k2 = RL(2, 5), n2 = RL(1, d2 - 1); out.push({ q: (n2 * k2) + "/" + (d2 * k2) + "를 약분하면 분모는?", a: String(d2), steps: ["분모·분자를 " + k2 + "(으)로 나눔", "분모 " + d2] }); }
      else { var x = RL(2, 6), y = RL(2, 6); var l = x * y; var m = x * y; for (var t = Math.max(x, y); t <= x * y; t++) if (t % x === 0 && t % y === 0) { l = t; break; } out.push({ q: "분모 " + x + "와 " + y + "를 통분하면 공통분모는? (가장 작은 수)", a: String(l), steps: ["최소공배수", "→ " + l] }); }
    }
    return out;
  }
  function genS1FracAdd() {
    var out = [];
    var pairs = [[2, 4], [3, 6], [2, 6], [3, 9], [4, 8]];
    for (var i = 0; i < 6; i++) {
      var pr = pairs[rnd(0, pairs.length - 1)];
      var d1 = pr[0], d2 = pr[1];
      var l = d2;
      var f1 = l / d1, f2 = l / d2;
      if (i % 2 === 0) {
        var k1 = 1, k2 = 1, guard = 0;
        do { k1 = rnd(1, d1 - 1); k2 = rnd(1, d2 - 1); guard++; } while (k1 * f1 + k2 * f2 >= l && guard < 20);
        if (k1 * f1 + k2 * f2 >= l) { k1 = 1; k2 = 1; }
        var s1 = k1 * f1, s2 = k2 * f2;
        out.push({ q: k1 + "/" + d1 + " + " + k2 + "/" + d2 + " = " + l + "분의 몇? (분자만)", a: String(s1 + s2), steps: [k1 + "/" + d1 + " = " + s1 + "/" + l, s1 + " + " + s2 + " = " + (s1 + s2)] });
      } else {
        var j1 = 1, j2 = 1, gd = 0;
        do { j1 = rnd(1, d1 - 1); j2 = rnd(1, d2 - 1); gd++; } while (j1 * f1 - j2 * f2 <= 0 && gd < 20);
        if (j1 * f1 - j2 * f2 <= 0) { j1 = d1 - 1; j2 = 1; }
        var t1 = j1 * f1, t2 = j2 * f2;
        out.push({ q: "통분하면 " + t1 + "/" + l + " - " + t2 + "/" + l + " = " + l + "분의 몇? (분자만)", a: String(t1 - t2), steps: [t1 + " - " + t2 + " = " + (t1 - t2)] });
      }
    }
    return out;
  }
  function genS1Poly() {
    var out = [];
    for (var i = 0; i < 6; i++) {
      var kind = i % 4;
      if (kind === 0) { var s = RL(4, 12); out.push({ q: "한 변 " + s + "cm 정사각형의 둘레는 몇 cm?", a: String(s * 4), steps: [s + " × 4 = " + (s * 4) + "cm"] }); }
      else if (kind === 1) { var w = RL(5, 15), h = RL(3, 10); out.push({ q: "가로 " + w + "cm 세로 " + h + "cm 직사각형의 넓이는 몇 ㎠?", a: String(w * h), steps: [w + " × " + h + " = " + (w * h) + "㎠"] }); }
      else if (kind === 2) { var w2 = RL(5, 15), h2 = RL(3, 10); out.push({ q: "가로 " + w2 + "cm 세로 " + h2 + "cm 직사각형의 둘레는 몇 cm?", a: String((w2 + h2) * 2), steps: ["(" + w2 + " + " + h2 + ") × 2 = " + ((w2 + h2) * 2) + "cm"] }); }
      else { var s2 = RL(4, 10); out.push({ q: "한 변 " + s2 + "cm 정사각형의 넓이는 몇 ㎠?", a: String(s2 * s2), steps: [s2 + " × " + s2 + " = " + (s2 * s2) + "㎠"] }); }
    }
    return out;
  }
  function genS1FracDiv() {
    var out = [];
    for (var i = 0; i < 6; i++) {
      var den = RL(2, 9), num = RL(2, 8), d = RL(2, 5);
      if (num % d !== 0) num = d * RL(1, 3);
      out.push({ q: num + "/" + den + " ÷ " + d + " = " + den + "분의 몇? (분자만)", a: String(num / d),
        steps: ["분자를 " + d + "(으)로 나눔", num + " ÷ " + d + " = " + (num / d)] });
    }
    return out;
  }
  function genS1Prism() {
    var names = ["삼각기둥", "사각기둥", "오각기둥", "삼각뿔", "사각뿔"];
    var out = [];
    for (var i = 0; i < 6; i++) {
      var nm = names[rnd(0, names.length - 1)];
      var base = nm.indexOf("삼각") === 0 ? 3 : (nm.indexOf("사각") === 0 ? 4 : 5);
      var isPyr = nm.indexOf("뿔") >= 0;
      var kind = i % 3;
      if (kind === 0) out.push({ q: nm + "의 면은 모두 몇 개?", a: String(isPyr ? base + 1 : base + 2), steps: [isPyr ? ("밑면 1 + 옆면 " + base) : ("밑면 2 + 옆면 " + base), "→ " + (isPyr ? base + 1 : base + 2) + "개"] });
      else if (kind === 1) out.push({ q: nm + "의 꼭짓점은 모두 몇 개?", a: String(isPyr ? base + 1 : base * 2), steps: ["→ " + (isPyr ? base + 1 : base * 2) + "개"] });
      else out.push({ q: nm + "의 모서리는 모두 몇 개?", a: String(isPyr ? base * 2 : base * 3), steps: ["→ " + (isPyr ? base * 2 : base * 3) + "개"] });
    }
    return out;
  }
  function genS1DecDiv() {
    var out = [];
    for (var i = 0; i < 6; i++) {
      var b = RL(2, 9);
      var ans = (RL(11, 99) / 10);
      var top = Math.round(ans * b * 10) / 10;
      out.push({ q: top + " ÷ " + b + " = ?", a: String(ans),
        steps: [(top * 10) + " ÷ " + b + " = " + (top * 10 / b), "소수점을 살려 " + ans] });
    }
    return out;
  }
  function genS1Ratio() {
    var out = [];
    for (var i = 0; i < 6; i++) {
      var kind = i % 3;
      if (kind === 0) { var a = RL(2, 9), b = RL(2, 9); var g = 1; for (var d = 2; d <= Math.min(a, b); d++) if (a % d === 0 && b % d === 0) g = d; out.push({ q: a + " : " + b + "를 가장 간단한 자연수의 비로 나타내면 앞수는?", a: String(a / g), steps: ["공약수 " + g + "(으)로 나눔", "→ " + (a / g) + " : " + (b / g)] }); }
      else if (kind === 1) { var t = RL(1, 20), w = RL(20, 200); var pct = Math.round(t / w * 100); out.push({ q: "전체 " + w + "명 중 " + t + "명이면 약 몇 %? (반올림)", a: String(pct), steps: [t + " ÷ " + w + " ≒ " + (t / w).toFixed(2), "약 " + pct + "%"] }); }
      else { var u = RL(1, 9); out.push({ q: "주스 원액과 물을 " + u + " : 4로 섞습니다. 원액 " + u + "컵에 물은 몇 컵?", a: "4", steps: ["비의 뒷항", "→ 4컵"] }); }
    }
    return out;
  }
  function genS1Graph() {
    var out = [];
    for (var i = 0; i < 6; i++) {
      var kind = i % 3;
      if (kind === 0) { var p = RL(1, 9) * 5; out.push({ q: "원그래프에서 " + p + "%가 차지하는 각은 몇 도?", a: String(Math.round(p * 3.6)), steps: ["360 × " + (p / 100) + " = " + Math.round(p * 3.6) + "도"] }); }
      else if (kind === 1) { var a = RL(10, 40), b = RL(10, 40); out.push({ q: "두 반의 인원 " + a + "명과 " + b + "명의 차이는 몇 명?", a: String(Math.abs(a - b)), steps: ["차이 " + Math.abs(a - b) + "명"] }); }
      else { var c = RL(5, 30), d = RL(5, 30); out.push({ q: "기온이 " + c + "도에서 " + (c + d) + "도로 오르면 오른 기온은 몇 도?", a: String(d), steps: [(c + d) + " - " + c + " = " + d + "도"] }); }
    }
    return out;
  }
  function genS1Volume() {
    var out = [];
    for (var i = 0; i < 6; i++) {
      var kind = i % 3;
      if (kind === 0) { var a = RL(2, 9), b = RL(2, 9), c = RL(2, 9); out.push({ q: "가로 " + a + "cm 세로 " + b + "cm 높이 " + c + "cm 직육면체의 부피는 몇 ㎤?", a: String(a * b * c), steps: [a + " × " + b + " × " + c + " = " + (a * b * c) + "㎤"] }); }
      else if (kind === 1) { var s = RL(2, 9); out.push({ q: "한 모서리 " + s + "cm 정육면체의 겉넓이는 몇 ㎠?", a: String(s * s * 6), steps: [s + " × " + s + " × 6 = " + (s * s * 6) + "㎠"] }); }
      else { var w = RL(2, 9), h = RL(2, 9), l = RL(2, 9); out.push({ q: "가로 " + w + "cm 세로 " + h + "cm 높이 " + l + "cm 상자의 겉넓이는 몇 ㎠?", a: String((w * h + h * l + l * w) * 2), steps: ["(앞·옆·위 넓이 합) × 2", "→ " + ((w * h + h * l + l * w) * 2) + "㎠"] }); }
    }
    return out;
  }
  function generateSet(houseId, level) {
    var keep = PAD_LEVEL;
    if (level) setLevel(level);
    var out;
    if (houseId === "divi") out = genDivi();
    else if (houseId === "circ") out = genCirc();
    else if (houseId === "frac") out = genFrac();
    else if (houseId === "mea") out = genMea();
    else if (houseId === "gra") out = genGra();
    else if (houseId === "g4-frac") out = genFrac();
    else if (houseId === "g4-tri") out = genTri();
    else if (houseId === "g4-deci") out = genDeciAdd();
    else if (houseId === "g4-quad") out = genQuad();
    else if (houseId === "g4-line") out = genLineDiff();
    else if (houseId === "g4-poly") out = genPoly();
    else if (houseId === "g5-range") out = genRange();
    else if (houseId === "g5-fracmul") out = genFracMul();
    else if (houseId === "g5-symm") out = genSymm();
    else if (houseId === "g5-decimul") out = genDeciMul();
    else if (houseId === "g5-cuboid") out = genCuboid();
    else if (houseId === "g5-avg") out = genAvg();
    else if (houseId === "g6-fracdiv") out = genFracDiv();
    else if (houseId === "g6-decdiv") out = genDecDiv();
    else if (houseId === "g6-space") out = genSpace();
    else if (houseId === "g6-ratio") out = genRatio();
    else if (houseId === "g6-circle") out = genCircleArea();
    else if (houseId === "g6-cyl") out = genCyl();
    else if (houseId === "s1-add") out = genS1Add();
    else if (houseId === "s1-shape") out = genS1Shape();
    else if (houseId === "s1-div") out = genS1Div();
    else if (houseId === "s1-mul") out = genS1Mul2();
    else if (houseId === "s1-len") out = genS1Len();
    else if (houseId === "s1-frac") out = genS1Frac();
    else if (houseId === "s1-big") out = genS1Big();
    else if (houseId === "s1-angle") out = genS1Angle();
    else if (houseId === "s1-muldiv") out = genS1MulDiv();
    else if (houseId === "s1-move") out = genS1Move();
    else if (houseId === "s1-bar") out = genS1Bar();
    else if (houseId === "s1-rule") out = genS1Rule();
    else if (houseId === "s1-mix") out = genS1Mix();
    else if (houseId === "s1-divisor") out = genS1Divisor();
    else if (houseId === "s1-cor") out = genS1Cor();
    else if (houseId === "s1-reduce") out = genS1Reduce();
    else if (houseId === "s1-fracadd") out = genS1FracAdd();
    else if (houseId === "s1-poly") out = genS1Poly();
    else if (houseId === "s1-fracdiv") out = genS1FracDiv();
    else if (houseId === "s1-prism") out = genS1Prism();
    else if (houseId === "s1-decdiv") out = genS1DecDiv();
    else if (houseId === "s1-ratio") out = genS1Ratio();
    else if (houseId === "s1-graph") out = genS1Graph();
    else if (houseId === "s1-volume") out = genS1Volume();
    else out = genMul();
    PAD_LEVEL = keep;
    return out;
  }
  window.G3Pad = { mountKeypad: mountKeypad, mountCanvas: mountCanvas, generateSet: generateSet, setLevel: setLevel };
  window.G3Adapt = { record: recordFirst, level: level };
})();
