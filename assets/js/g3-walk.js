(function () {
  var W = 960, H = 600;
  var HOUSES = [
    { id: "mul", name: "곱셈 방앗간", x: 420, y: 60, c: "#EE7F62" },
    { id: "divi", name: "나눔 과일정거장", x: 700, y: 140, c: "#6FBAD2" },
    { id: "circ", name: "동그라미 시계소", x: 700, y: 360, c: "#9C86E0" },
    { id: "frac", name: "조각 피자부엌", x: 420, y: 450, c: "#F5B23A" },
    { id: "mea", name: "되와 무게 실험실", x: 120, y: 360, c: "#4FA85E" },
    { id: "gra", name: "그림소식 우체통", x: 120, y: 140, c: "#F08FB0" }
  ];
  var NPCS = [
    { name: "몽실", color: "#8A6A4A", hx: 420, hy: 170, r: 60, line: "방앗간 1차시를 끝내 주면 씨앗을 줄게!" },
    { name: "햇살이", color: "#F5B23A", hx: 200, hy: 480, r: 70, line: "텃밭에서 무언가 거두면 카드를 준다!" },
    { name: "반짝이", color: "#F08FB0", hx: 740, hy: 480, r: 70, line: "빈터 2곳을 꾸미면 바람개비 카드를 줘!" }
  ];
  var player = { x: 480, y: 300, vx: 0, vy: 0, hop: 0 };
  var keys = {};
  var pad = { up: false, down: false, left: false, right: false };
  var cv, ctx, parts = [];
  var near = null;
  function store() { return window.G3Store.load(); }
  function avatarColors() {
    var a = store().avatar || { hair: 0, clothes: 0 };
    var hairs = ["#5B3A29", "#2F2F2F", "#B5651D", "#7A9E7E"];
    var clothes = ["#4FA85E", "#6FBAD2", "#EE7F62", "#9C86E0", "#F5B23A"];
    return { hair: hairs[(a.hair || 0) % 4], body: clothes[(a.clothes || 0) % 5], name: a.name || "주민" };
  }
  function rr(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
  function drawHouse(h, t) {
    ctx.fillStyle = "rgba(62,52,40,.12)";
    ctx.beginPath(); ctx.ellipse(h.x, h.y + 52, 62, 12, 0, 0, 7); ctx.fill();
    ctx.fillStyle = "#FFFDF6";
    rr(h.x - 55, h.y - 30, 110, 80, 12); ctx.fill();
    ctx.strokeStyle = "#E6DFC9"; ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = h.c;
    ctx.beginPath();
    ctx.moveTo(h.x - 65, h.y - 28); ctx.lineTo(h.x, h.y - 72); ctx.lineTo(h.x + 65, h.y - 28);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#8A6A4A";
    rr(h.x - 14, h.y + 8, 28, 42, 6); ctx.fill();
    var bob = Math.sin(t / 500 + h.x) * 2;
    ctx.fillStyle = "#FFFDF6";
    rr(h.x - 52, h.y - 62 + bob, 104, 26, 10); ctx.fill();
    ctx.strokeStyle = h.c; ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = "#3E3428"; ctx.font = "17px Jua, sans-serif";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(h.name, h.x, h.y - 48 + bob);
  }
  function drawNPC(n, t) {
    var bounce = Math.abs(Math.sin(t / 300 + n.hx)) * 8;
    var x = n.hx + Math.sin(t / 2000 + n.hy) * 14;
    var y = n.hy - bounce;
    ctx.fillStyle = "rgba(62,52,40,.12)";
    ctx.beginPath(); ctx.ellipse(x, n.hy + 16, 20, 5, 0, 0, 7); ctx.fill();
    ctx.fillStyle = n.color;
    ctx.beginPath(); ctx.arc(x, y, 16, 0, 7); ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.beginPath(); ctx.arc(x - 6, y - 3, 5, 0, 7); ctx.arc(x + 6, y - 3, 5, 0, 7); ctx.fill();
    ctx.fillStyle = "#3E3428";
    ctx.beginPath(); ctx.arc(x - 6, y - 3, 2.4, 0, 7); ctx.arc(x + 6, y - 3, 2.4, 0, 7); ctx.fill();
    ctx.font = "14px Jua, sans-serif"; ctx.textAlign = "center";
    ctx.fillStyle = "#3E3428";
    ctx.fillText(n.name, x, n.hy + 34);
    return { x: x, y: n.hy };
  }
  function drawPlayer(t) {
    var c = avatarColors();
    var hop = (player.vx || player.vy) ? Math.abs(Math.sin(t / 120)) * 6 : Math.sin(t / 600) * 2;
    var x = player.x, y = player.y - hop;
    ctx.fillStyle = "rgba(62,52,40,.15)";
    ctx.beginPath(); ctx.ellipse(player.x, player.y + 20, 18, 5, 0, 0, 7); ctx.fill();
    ctx.fillStyle = c.body;
    rr(x - 14, y - 6, 28, 26, 9); ctx.fill();
    ctx.fillStyle = "#FFDCB8";
    ctx.beginPath(); ctx.arc(x, y - 20, 15, 0, 7); ctx.fill();
    ctx.fillStyle = c.hair;
    ctx.beginPath(); ctx.arc(x, y - 24, 15, Math.PI, 0); ctx.fill();
    ctx.fillStyle = "#3E3428";
    ctx.beginPath(); ctx.arc(x - 5, y - 20, 2.2, 0, 7); ctx.arc(x + 5, y - 20, 2.2, 0, 7); ctx.fill();
    ctx.font = "14px Jua, sans-serif"; ctx.textAlign = "center";
    ctx.fillStyle = "#3E3428";
    ctx.fillText(c.name, x, player.y + 38);
  }
  function drawFarm2d() {
    var d = store();
    var now = Date.now();
    ctx.fillStyle = "#8A6A4A";
    rr(60, 470, 130, 70, 10); ctx.fill();
    ctx.fillStyle = "#fff"; ctx.font = "14px Jua, sans-serif"; ctx.textAlign = "center";
    ctx.fillText("씨앗 텃밭", 125, 462);
    for (var i = 0; i < 4; i++) {
      var px = 80 + (i % 2) * 55, py = 488 + Math.floor(i / 2) * 30;
      var p = d.farm.plots[i];
      if (p && now >= p.readyAt) { ctx.fillStyle = "#F5B23A"; }
      else if (p) { ctx.fillStyle = "#7CCB72"; }
      else { ctx.fillStyle = "#C9AE7E"; }
      ctx.beginPath(); ctx.arc(px, py, 10, 0, 7); ctx.fill();
    }
  }
  function burst() {
    for (var i = 0; i < 60; i++) {
      parts.push({ x: player.x + (Math.random() - 0.5) * 40, y: player.y - 20, vx: (Math.random() - 0.5) * 4, vy: -Math.random() * 4 - 1, life: 50, c: ["#F5B23A", "#EE7F62", "#6FBAD2", "#4FA85E"][i % 4] });
    }
  }
  function tick(t) {
    requestAnimationFrame(tick);
    if (!ctx) return;
    var sp = 2.6;
    var dx = 0, dy = 0;
    if (keys["ArrowUp"] || keys["w"] || keys["W"] || pad.up) dy -= 1;
    if (keys["ArrowDown"] || keys["s"] || keys["S"] || pad.down) dy += 1;
    if (keys["ArrowLeft"] || keys["a"] || keys["A"] || pad.left) dx -= 1;
    if (keys["ArrowRight"] || keys["d"] || keys["D"] || pad.right) dx += 1;
    if (dx || dy) {
      var len = Math.sqrt(dx * dx + dy * dy);
      player.vx = dx / len; player.vy = dy / len;
      player.x += player.vx * sp;
      player.y += player.vy * sp;
      player.x = Math.max(30, Math.min(W - 30, player.x));
      player.y = Math.max(60, Math.min(H - 30, player.y));
      for (var i = 0; i < HOUSES.length; i++) {
        var h = HOUSES[i];
        if (player.x > h.x - 70 && player.x < h.x + 70 && player.y > h.y - 80 && player.y < h.y + 60) {
          player.x -= player.vx * sp;
          player.y -= player.vy * sp;
        }
      }
    } else { player.vx = 0; player.vy = 0; }
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#CDE8BE"; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "#BEE0AE"; ctx.lineWidth = 10;
    ctx.beginPath(); ctx.moveTo(480, 300); ctx.lineTo(420, 130); ctx.moveTo(480, 300); ctx.lineTo(700, 210);
    ctx.moveTo(480, 300); ctx.lineTo(700, 430); ctx.moveTo(480, 300); ctx.lineTo(420, 480);
    ctx.moveTo(480, 300); ctx.lineTo(190, 430); ctx.moveTo(480, 300); ctx.lineTo(190, 210); ctx.stroke();
    ctx.fillStyle = "#EFE3C2";
    ctx.beginPath(); ctx.arc(480, 300, 46, 0, 7); ctx.fill();
    for (var j = 0; j < HOUSES.length; j++) drawHouse(HOUSES[j], t);
    var npcPos = [];
    for (var k = 0; k < NPCS.length; k++) npcPos.push(drawNPC(NPCS[k], t));
    drawFarm2d();
    drawPlayer(t);
    near = null;
    var best = 70;
    for (var m = 0; m < HOUSES.length; m++) {
      var dd = Math.hypot(player.x - HOUSES[m].x, player.y - (HOUSES[m].y + 50));
      if (dd < best) { best = dd; near = { type: "house", id: HOUSES[m].id, name: HOUSES[m].name }; }
    }
    for (var n = 0; n < NPCS.length; n++) {
      var dn = Math.hypot(player.x - npcPos[n].x, player.y - npcPos[n].y);
      if (dn < 60) {
        ctx.fillStyle = "#fff";
        rr(npcPos[n].x - 110, npcPos[n].y - 78, 220, 34, 10); ctx.fill();
        ctx.fillStyle = "#3E3428"; ctx.font = "14px Jua, sans-serif"; ctx.textAlign = "center";
        ctx.fillText(NPCS[n].line, npcPos[n].x, npcPos[n].y - 60);
        if (!near) near = { type: "npc", name: NPCS[n].name, line: NPCS[n].line };
      }
    }
    var label = document.getElementById("nearLabel");
    var btn = document.getElementById("enterBtn");
    if (near && near.type === "house") {
      if (label) label.textContent = near.name + " 앞입니다";
      if (btn) { btn.hidden = false; btn.textContent = near.name + " 들어가기"; }
    } else {
      if (label) label.textContent = near ? near.name + ": " + near.line : "주민에게 다가가면 말이 뜹니다";
      if (btn) btn.hidden = true;
    }
    for (var p = parts.length - 1; p >= 0; p--) {
      var pt = parts[p];
      pt.x += pt.vx; pt.y += pt.vy; pt.vy += 0.15; pt.life--;
      if (pt.life <= 0) { parts.splice(p, 1); continue; }
      ctx.fillStyle = pt.c;
      ctx.fillRect(pt.x, pt.y, 5, 5);
    }
  }
  function init() {
    cv = document.getElementById("walk");
    if (!cv) return;
    ctx = cv.getContext("2d");
    window.addEventListener("keydown", function (e) {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].indexOf(e.key) >= 0) e.preventDefault();
      keys[e.key] = true;
    });
    window.addEventListener("keyup", function (e) { keys[e.key] = false; });
    document.addEventListener("pointerdown", function (e) {
      var t = e.target.closest ? e.target.closest("[data-move]") : null;
      if (t) pad[t.getAttribute("data-move")] = true;
    });
    document.addEventListener("pointerup", function () { pad.up = pad.down = pad.left = pad.right = false; });
    var btn = document.getElementById("enterBtn");
    if (btn) btn.addEventListener("click", function () {
      if (near && near.type === "house") {
        if (window.G3Journal) window.G3Journal.visit(near.id);
        if (window.G3Quests) window.G3Quests.poke();
        if (window.G3Dlg) window.G3Dlg.open(near.id);
      }
    });
    requestAnimationFrame(tick);
    window.G3WalkReady = true;
  }
  window.G3Confetti = { burst: burst };
  window.G3Walk = { init: init };
})();
