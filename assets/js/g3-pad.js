(function () {
  function rnd(n, m) { return n + Math.floor(Math.random() * (m - n + 1)); }
  function mountKeypad(boxId, inputId) {
    var box = document.getElementById(boxId);
    var inp = document.getElementById(inputId);
    if (!box || !inp) return;
    var keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "back", "clear"];
    var html = "";
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      var label = k === "back" ? "← 지우기" : (k === "clear" ? "C 모두지우기" : k);
      var cls = k === "back" || k === "clear" ? "keypad-key keypad-fn" : "keypad-key";
      html += "<button type='button' class='" + cls + "' data-key='" + k + "'>" + label + "</button>";
    }
    box.innerHTML = html;
    box.addEventListener("click", function (e) {
      var t = e.target.closest ? e.target.closest("[data-key]") : null;
      if (!t) return;
      var k2 = t.getAttribute("data-key");
      var cur = (inp.value || "").replace(/[^0-9]/g, "");
      if (k2 === "back") cur = cur.slice(0, -1);
      else if (k2 === "clear") cur = "";
      else if (cur.length < 5) cur += k2;
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
      var a = rnd(2, 9) * 10, b = rnd(2, 5);
      var ans = a * b;
      out.push({ q: a + " × " + b + " = ?", a: String(ans),
        steps: [(a / 10) + " × " + b + " = " + (ans / 10), "0을 붙이면 " + ans] });
    }
    return out;
  }
  function genDivi() {
    var out = [];
    for (var i = 0; i < 6; i++) {
      var d = rnd(2, 5), q = rnd(2, 9);
      var top = d * q * 10;
      out.push({ q: top + " ÷ " + d + " = ?", a: String(q * 10),
        steps: [(top / 10) + " ÷ " + d + " = " + q, "십의 자리이므로 " + (q * 10)] });
    }
    return out;
  }
  function genCirc() {
    var out = [];
    for (var i = 0; i < 6; i++) {
      var r = rnd(3, 9);
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
      var den = rnd(2, 5), num = rnd(1, den), k = rnd(2, 4);
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
        var ml = rnd(1, 9) * 100 + rnd(0, 9) * 10;
        var L = rnd(1, 2);
        out.push({ q: L + "L " + ml + "mL는 모두 몇 mL?", a: String(L * 1000 + ml),
          steps: [L + "L = " + (L * 1000) + "mL", (L * 1000) + " + " + ml + " = " + (L * 1000 + ml) + "mL"] });
      } else {
        var g = rnd(1, 9) * 100 + rnd(0, 9) * 10;
        var kg = rnd(1, 2);
        out.push({ q: kg + "kg " + g + "g은 모두 몇 g?", a: String(kg * 1000 + g),
          steps: [kg + "kg = " + (kg * 1000) + "g", (kg * 1000) + " + " + g + " = " + (kg * 1000 + g) + "g"] });
      }
    }
    return out;
  }
  function genGra() {
    var out = [];
    for (var i = 0; i < 6; i++) {
      var big = rnd(1, 5), small = rnd(0, 9);
      out.push({ q: "큰 그림(10) " + big + "개와 작은 그림(1) " + small + "개는 얼마를 나타낼까?", a: String(big * 10 + small),
        steps: ["10 × " + big + " = " + (big * 10), (big * 10) + " + " + small + " = " + (big * 10 + small)] });
    }
    return out;
  }
  function generateSet(houseId) {
    if (houseId === "divi") return genDivi();
    if (houseId === "circ") return genCirc();
    if (houseId === "frac") return genFrac();
    if (houseId === "mea") return genMea();
    if (houseId === "gra") return genGra();
    return genMul();
  }
  window.G3Pad = { mountKeypad: mountKeypad, mountCanvas: mountCanvas, generateSet: generateSet };
})();
