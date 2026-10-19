(function () {
  // 친구 초대 코드 (전시용): 아바타+이름+칭호+짝꿍 펫 단계+격파 수만 공유.
  // 진도·별·씨앗은 절대 포함하지 않습니다.
  var ALPHA = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  var HAIR = ["hair-long", "hair-spiky", "hair-twintails", "hair-bob", "hair-afro", "hair-sidepony"];
  var TOP = ["top-stripe", "top-denim", "top-raincoat", "top-hoodie", "top-vest", "top-chef",
    "set-gold-cape", "set-wiz-robe", "set-astro-suit"];
  var BOT = ["bot-jeans", "bot-skirt", "bot-shorts", "bot-overalls"];
  var SHOE = ["shoe-sneakers", "shoe-boots", "shoe-rainboots", "set-gold-boots"];
  var HAT = ["none", "hat-cap", "hat-straw", "hat-beanie", "hat-safari",
    "set-gold-hat", "set-wiz-hat", "set-astro-helm"];
  var ACC = ["none", "pin", "glasses", "crown", "glass-star", "glass-heart",
    "glass-wizard", "set-fairy-wings"];
  var MAX_PALS = 12;
  function store() { return window.G3Store.load(); }
  function toast(m) { if (window.G3UI) window.G3UI.toast(m); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function idx(list, v) {
    var i = list.indexOf(v);
    return i < 0 ? 0 : i;
  }
  function clamp(n, max) {
    n = parseInt(n, 10);
    if (isNaN(n) || n < 0) return 0;
    return Math.min(max, n);
  }
  function titleList() {
    try {
      if (window.G3Pet && window.G3Pet.TITLES) return window.G3Pet.TITLES;
    } catch (e) {}
    return [];
  }
  function petStageOf(d) {
    try {
      var exp = (d.pet && d.pet.exp) || 0;
      var need = (window.G3TUNE && window.G3TUNE.petNeed) || [0, 3, 7, 12, 18, 25];
      var s = 0;
      for (var i = 0; i < need.length; i++) if (exp >= need[i]) s = i;
      return Math.min(5, s);
    } catch (e) { return 0; }
  }
  function bossCountOf(d) {
    try {
      var n = 0;
      var b = (d.pet && d.pet.bosses) || {};
      for (var k in b) n++;
      return Math.min(99, n);
    } catch (e) { return 0; }
  }
  function b64enc(s) {
    try { return btoa(unescape(encodeURIComponent(s))); } catch (e) { return ""; }
  }
  function b64dec(s) {
    try { return decodeURIComponent(escape(atob(s))); } catch (e) { return null; }
  }
  function checksum(body) {
    var sum = 0;
    for (var i = 0; i < body.length; i++) sum += body.charCodeAt(i);
    return ALPHA[sum % ALPHA.length];
  }
  function myCode() {
    var d = store();
    var a = d.avatar || {};
    var titles = titleList();
    var ti = 0;
    if (d.pet && d.pet.title) {
      for (var i = 0; i < titles.length; i++) {
        if (titles[i].id === d.pet.title) { ti = i + 1; break; }
      }
    }
    var payload = [
      idx(HAIR, a.hairImg), clamp(a.face, 2), idx(TOP, a.color),
      idx(BOT, a.bottom), idx(SHOE, a.shoe), idx(HAT, a.hat),
      idx(ACC, a.acc), ti, petStageOf(d), bossCountOf(d),
      String(a.name || "주민").slice(0, 8)
    ];
    var body = b64enc(JSON.stringify(payload));
    body = body.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    if (!body) return "";
    var code = "SF" + body + checksum(body);
    var groups = ["SF"];
    for (var g = 2; g < code.length; g += 4) groups.push(code.slice(g, g + 4));
    return groups.join(" ");
  }
  function parseCode(raw) {
    if (!raw) return null;
    var compact = String(raw).replace(/\s/g, "");
    if (compact.slice(0, 2).toUpperCase() !== "SF" || compact.length < 8) return null;
    var rest = compact.slice(2);
    var body = rest.slice(0, -1);
    var check = rest.slice(-1).toUpperCase();
    if (!/^[A-Za-z0-9\-_]+$/.test(body)) return null;
    if (checksum(body) !== check) return null;
    var b64 = body.replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4) b64 += "=";
    var json = b64dec(b64);
    if (!json) return null;
    var arr;
    try { arr = JSON.parse(json); } catch (e) { return null; }
    if (!arr || !arr.length || arr.length < 11) return null;
    var titles = titleList();
    var ti = clamp(arr[7], titles.length);
    return {
      avatar: {
        name: String(arr[10] || "주민").slice(0, 8),
        hairImg: HAIR[clamp(arr[0], HAIR.length - 1)],
        face: clamp(arr[1], 2),
        color: TOP[clamp(arr[2], TOP.length - 1)],
        bottom: BOT[clamp(arr[3], BOT.length - 1)],
        shoe: SHOE[clamp(arr[4], SHOE.length - 1)],
        hat: HAT[clamp(arr[5], HAT.length - 1)],
        acc: ACC[clamp(arr[6], ACC.length - 1)]
      },
      title: ti > 0 ? titles[ti - 1].name : "",
      petStage: clamp(arr[8], 5),
      bosses: clamp(arr[9], 99)
    };
  }
  function palsOf(d) {
    if (!d.pals) d.pals = [];
    return d.pals;
  }
  function addCode(raw) {
    var pal = parseCode(raw);
    var msg = document.getElementById("palMsg");
    if (!pal) {
      if (msg) msg.textContent = "코드가 올바르지 않아요. SF-로 시작하는 코드를 다시 확인해 주세요.";
      toast("친구 코드를 읽지 못했어요.");
      return;
    }
    var d = store();
    var pals = palsOf(d);
    var norm = String(raw).toUpperCase().replace(/\s/g, "");
    for (var i = 0; i < pals.length; i++) {
      if (String(pals[i].code).toUpperCase().replace(/\s/g, "") === norm) {
        if (msg) msg.textContent = "이미 초대된 친구예요!";
        return;
      }
    }
    if (pals.length >= MAX_PALS) {
      if (msg) msg.textContent = "친구는 최대 " + MAX_PALS + "명까지 초대할 수 있어요.";
      return;
    }
    pals.push({
      code: String(raw).replace(/\s+/g, " ").trim(),
      name: pal.avatar.name, avatar: pal.avatar,
      title: pal.title, petStage: pal.petStage, bosses: pal.bosses
    });
    window.G3Store.save(d);
    if (window.G3Journal) window.G3Journal.log("친구", pal.avatar.name + " 주민 초대!");
    if (msg) msg.textContent = pal.avatar.name + " 주민이 마을에 놀러 왔어요!";
    toast(pal.avatar.name + " 주민이 마을에 놀러 왔어요!");
    render();
  }
  function removePal(code) {
    var d = store();
    var pals = palsOf(d);
    d.pals = pals.filter(function (p) { return p.code !== code; });
    window.G3Store.save(d);
    render();
  }
  function copyMyCode() {
    var code = myCode();
    var msg = document.getElementById("palMsg");
    if (!code) {
      if (msg) msg.textContent = "먼저 옷장에서 주민 이름과 모습을 정해 주세요!";
      return;
    }
    function done(ok) {
      if (msg) msg.textContent = ok ? "내 초대 코드를 복사했어요! 친구에게 알려 주세요." : ("내 초대 코드: " + code);
    }
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(function () { done(true); }, function () { done(false); });
      } else done(false);
    } catch (e) { done(false); }
    var inp = document.getElementById("palCodeInput");
    if (inp) inp.value = code;
  }
  function palCardHtml(p) {
    var badge = p.title ? "<span class='tag'>🏅 " + esc(p.title) + "</span>" : "";
    return "<div class='pal-card'><div class='pal-av' data-pal-av='" + esc(p.code) + "'></div>"
      + "<div class='pal-meta'><b>" + esc(p.name) + " 주민</b>" + badge
      + "<span>🐾 펫 " + (p.petStage + 1) + "/6단계 · 수호자 격파 " + p.bosses + "</span>"
      + "<button type='button' class='mini-act' data-pal-del='" + esc(p.code) + "'>초대 취소</button>"
      + "</div></div>";
  }
  function render() {
    var d = store();
    var pals = palsOf(d);
    try {
      var note = document.getElementById("note");
      if (note && !document.getElementById("palBox")) {
        var box = document.createElement("div");
        box.id = "palBox";
        note.appendChild(box);
      }
    } catch (e) {}
    var el = document.getElementById("palBox");
    if (el) {
      var html = "<div class='pal-sec'><b>👫 친구 초대하기</b>"
        + "<p class='hint'>짧은 코드로 친구의 주민 모습·칭호·짝꿍 펫을 내 마을에 놀러 오게 해요. 공부 기록과 별은 공유되지 않아요.</p>"
        + "<div class='prow'><button type='button' class='go btn-pulse' data-pal-copy='1'>내 초대 코드 만들기·복사</button></div>"
        + "<div class='prow'><input id='palCodeInput' maxlength='72' placeholder='친구 코드 입력 (예: SF XXXX XXXX)' aria-label='친구 코드 입력'>"
        + "<button type='button' class='go btn-pulse' data-pal-add='1'>친구 마을에 초대하기</button></div>"
        + "<p id='palMsg' class='fb' aria-live='polite'></p>";
      if (pals.length) {
        html += "<div class='pal-list'>";
        for (var i = 0; i < pals.length; i++) html += palCardHtml(pals[i]);
        html += "</div>";
      } else {
        html += "<p class='hint'>아직 초대된 친구가 없어요. 코드를 교환해 보세요!</p>";
      }
      html += "</div>" + rankHtml();
      el.innerHTML = html;
      if (window.G3Avatar && window.G3Avatar.mountRig) {
        for (var j = 0; j < pals.length; j++) {
          var av = el.querySelector("[data-pal-av='" + pals[j].code + "']");
          if (av) window.G3Avatar.mountRig(av, pals[j].avatar);
        }
      }
    }
    syncMapPals(pals);
  }
  var PAL_SPOTS = [
    { x: 30, y: 30 }, { x: 70, y: 30 }, { x: 24, y: 55 }, { x: 76, y: 55 },
    { x: 38, y: 68 }, { x: 62, y: 68 }, { x: 30, y: 80 }, { x: 70, y: 80 },
    { x: 45, y: 22 }, { x: 55, y: 78 }, { x: 20, y: 42 }, { x: 80, y: 42 }
  ];
  function syncMapPals(pals) {
    try {
      var wraps = [document.getElementById("mapwrap"), document.getElementById("lowMapwrap")];
      for (var w = 0; w < wraps.length; w++) {
        var wrap = wraps[w];
        if (!wrap) continue;
        var olds = wrap.querySelectorAll(".pal-marker");
        for (var o = 0; o < olds.length; o++) olds[o].remove();
        if (document.getElementById("mapwrap") && wrap.id !== "mapwrap") continue;
        for (var i = 0; i < pals.length && i < PAL_SPOTS.length; i++) {
          var m = document.createElement("button");
          m.type = "button";
          m.className = "pal-marker";
          m.style.left = PAL_SPOTS[i].x + "%";
          m.style.top = PAL_SPOTS[i].y + "%";
          m.setAttribute("data-pal-say", pals[i].code);
          m.setAttribute("aria-label", pals[i].name + " 주민 인사 듣기");
          m.innerHTML = "<span class='pal-face' data-pal-face='" + esc(pals[i].code) + "'></span><em>" + esc(pals[i].name) + "</em>";
          wrap.appendChild(m);
          if (window.G3Avatar && window.G3Avatar.mountRig) {
            var f = m.querySelector("[data-pal-face]");
            if (f) window.G3Avatar.mountRig(f, pals[i].avatar);
          }
        }
      }
    } catch (e) {}
  }
  function sayPal(code) {
    var d = store();
    var pals = palsOf(d);
    for (var i = 0; i < pals.length; i++) {
      if (pals[i].code === code) {
        var p = pals[i];
        toast(p.name + ": " + (p.title ? ("[" + p.title + "] ") : "") + "놀러 왔어요! 🐾 펫 " + (p.petStage + 1) + "/6단계");
        return;
      }
    }
  }
  document.addEventListener("click", function (e) {
    var rt = e.target.closest ? e.target.closest("[data-rank-tab]") : null;
    if (rt) { rankTab = rt.getAttribute("data-rank-tab") || "stars"; render(); return; }
    var t = e.target.closest ? e.target.closest("[data-pal-copy],[data-pal-add],[data-pal-del],[data-pal-say]") : null;
    if (!t) return;
    if (t.hasAttribute("data-pal-copy")) copyMyCode();
    else if (t.hasAttribute("data-pal-add")) {
      var inp = document.getElementById("palCodeInput");
      addCode(inp ? inp.value : "");
    } else if (t.hasAttribute("data-pal-del")) removePal(t.getAttribute("data-pal-del"));
    else if (t.hasAttribute("data-pal-say")) sayPal(t.getAttribute("data-pal-say"));
  });
  var rankTab = "stars";
  function myRow() {
    try {
      var d = store();
      var pet = d.pet || {};
      var bossN = 0;
      if (pet.bosses) for (var k in pet.bosses) bossN++;
      return { name: ((d.avatar || {}).name || "나") + " (나)", stars: d.stars || 0,
        combo: pet.bestCombo || 0, bosses: bossN, me: true };
    } catch (e) { return null; }
  }
  function rankRows() {
    var rows = [];
    var me = myRow();
    if (me) rows.push(me);
    var d = store();
    var pals = palsOf(d);
    for (var i = 0; i < pals.length; i++) {
      // 친구 코드는 별을 포함하지 않으므로 전시는 격파·펫 위주, 별은 미공개로 표시
      rows.push({ name: pals[i].name, stars: -1, combo: -1,
        bosses: pals[i].bosses || 0, petStage: pals[i].petStage || 0, title: pals[i].title || "" });
    }
    return rows;
  }
  function rankItemsHtml() {
    var rows = rankRows();
    function val(r, k) { return (r[k] == null || r[k] < 0) ? "－" : r[k]; }
    var key = rankTab === "combo" ? "combo" : (rankTab === "boss" ? "bosses" : "stars");
    var mine = rows.filter(function (r) { return r.me; });
    var others = rows.filter(function (r) { return !r.me; });
    function eff(r) { return (r[key] == null || r[key] < 0) ? (r.bosses || 0) : r[key]; }
    others.sort(function (a, b) { return eff(b) - eff(a); });
    var ordered = mine.concat(others);
    var medals = ["🥇", "🥈", "🥉"];
    var html = "";
    for (var i = 0; i < ordered.length; i++) {
      var r = ordered[i];
      html += "<li><span>" + (medals[i] || (i + 1) + "위") + "</span><b>" + esc(r.name) + "</b>"
        + "<span>별 " + val(r, "stars") + " · 콤보 " + val(r, "combo") + " · 격파 " + val(r, "bosses") + "</span></li>";
    }
    return html;
  }
  function rankHtml() {
    var html = "<div class='pal-sec'><b>🏆 우리 반 랭킹 (이 기기 기준)</b>"
      + "<div class='prow'>"
      + "<button type='button' class='mini-act" + (rankTab === "stars" ? " sel" : "") + "' data-rank-tab='stars'>별</button>"
      + "<button type='button' class='mini-act" + (rankTab === "combo" ? " sel" : "") + "' data-rank-tab='combo'>최고 콤보</button>"
      + "<button type='button' class='mini-act" + (rankTab === "boss" ? " sel" : "") + "' data-rank-tab='boss'>수호자 격파</button>"
      + "</div><ol class='rank-list' id='rankList'>"
      + rankItemsHtml()
      + "</ol><p class='hint'>친구의 별·콤보는 공유되지 않아 격파 수와 펫으로 응원해요.</p></div>";
    return html;
  }
  // 별·콤보·격파가 바뀌면 목록만 다시 그립니다 (친구 코드 입력칸은 건드리지 않음).
  function refreshRank() {
    try {
      var ol = document.getElementById("rankList");
      if (ol) ol.innerHTML = rankItemsHtml();
    } catch (e) {}
  }
  function top3() {
    try {
      var rows = rankRows().filter(function (r) { return !r.me; });
      rows.sort(function (a, b) { return (b.bosses || 0) - (a.bosses || 0); });
      return rows.slice(0, 3).map(function (r) { return r.name; });
    } catch (e) { return []; }
  }
  window.G3Friend = { render: render, refreshRank: refreshRank, myCode: myCode, addCode: addCode, parseCode: parseCode, rankTop: top3 };
})();
