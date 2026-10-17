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
      var win = (t.adaptWindow == null) ? 10 : t.adaptWindow;
      var up = (t.adaptUp == null) ? 0.8 : t.adaptUp;
      var dn = (t.adaptDown == null) ? 0.4 : t.adaptDown;
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
    else out = genMul();
    PAD_LEVEL = keep;
    return out;
  }
  window.G3Pad = { mountKeypad: mountKeypad, mountCanvas: mountCanvas, generateSet: generateSet, setLevel: setLevel };
  window.G3Adapt = { record: recordFirst, level: level };
})();
