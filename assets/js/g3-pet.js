(function () {
  function TUNE() { return window.G3TUNE || {}; }
  function TN(key, fallback) {
    var t = TUNE();
    return (t[key] == null) ? fallback : t[key];
  }
  var PETS = [
    { id: "pet-egg", name: "신비한 별빛 알", emoji: "🥚", need: 0 },
    { id: "pet-sprout", name: "새싹 정령", emoji: "🌱", need: 3 },
    { id: "pet-fox", name: "아기 별여우", emoji: "🦊", need: 7 },
    { id: "pet-owl", name: "지혜 부엉이", emoji: "🦉", need: 12 },
    { id: "pet-dragon", name: "꼬마 수호룡", emoji: "🐲", need: 18 },
    { id: "pet-star", name: "전설의 별빛 수호룡", emoji: "🌟", need: 25 }
  ];
  (function applyPetNeed() {
    try {
      var need = TN("petNeed", null);
      if (need && need.length === PETS.length) {
        for (var i = 0; i < PETS.length; i++) PETS[i].need = need[i];
      }
    } catch (e) {}
  })();
  var TITLES = [
    { id: "sprout", name: "새싹 탐험가", desc: "첫 문제 해결" },
    { id: "combo3", name: "연속정답 번개손", desc: "3콤보 달성" },
    { id: "streak3", name: "매일 출석 챔피언", desc: "3일 연속 출석" },
    { id: "boss1", name: "수호자 정복자", desc: "단원 수호자 1마리 격파" },
    { id: "farmer", name: "전설의 농부", desc: "수확 5회" },
    { id: "master", name: "별숲 대마법사", desc: "차시 10개 완료" }
  ];
  function todayStr() {
    try {
      var d = new Date();
      return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
    } catch (e) { return "day"; }
  }
  function store() { return window.G3Store.load(); }
  function ensurePet(d) {
    if (!d.pet) d.pet = {};
    var p = d.pet;
    if (typeof p.exp !== "number") p.exp = 0;
    if (typeof p.candies !== "number") p.candies = 0;
    if (typeof p.combo !== "number") p.combo = 0;
    if (typeof p.bestCombo !== "number") p.bestCombo = 0;
    if (typeof p.streak !== "number") p.streak = 0;
    if (typeof p.todaySolved !== "number") p.todaySolved = 0;
    if (!p.lastSolveDay) p.lastSolveDay = "";
    if (!p.lastStreakDay) p.lastStreakDay = "";
    if (!p.day) p.day = todayStr();
    if (!p.missions) p.missions = { lesson: false, farm: false, play: false };
    if (!p.chestOpenedDay) p.chestOpenedDay = "";
    if (!p.bosses) p.bosses = {};
    if (!p.titles) p.titles = [];
    if (typeof p.rainbow !== "number") p.rainbow = 0;
    if (p.day !== todayStr()) {
      p.day = todayStr();
      p.missions = { lesson: false, farm: false, play: false };
      p.todaySolved = 0;
    }
    return p;
  }
  function stageIndex(exp) {
    var idx = 0;
    for (var i = 0; i < PETS.length; i++) if (exp >= PETS[i].need) idx = i;
    return idx;
  }
  function petImg(stage, cls) {
    var id = PETS[stage].id;
    return "<img class='" + (cls || "pet-img") + "' src='../assets/img/flow/parts/" + id + ".png' alt='" + PETS[stage].name + "' onerror=\"this.style.display='none';this.nextSibling.style.display='inline'\">"
      + "<span class='pet-emoji' style='display:none'>" + PETS[stage].emoji + "</span>";
  }
  function toast(m) { if (window.G3UI) window.G3UI.toast(m); }
  function weekKey() {
    try {
      var d = new Date();
      var onejan = new Date(d.getFullYear(), 0, 1);
      var week = Math.ceil((((d - onejan) / 86400000) + onejan.getDay() + 1) / 7);
      return d.getFullYear() + "-W" + week;
    } catch (e) { return "W"; }
  }
  function ensureWeekly(p) {
    var wk = weekKey();
    if (!p.weekly || p.weekly.week !== wk) {
      p.weekly = { week: wk, boss: 0, perfect: 0, done: false };
    }
    return p.weekly;
  }
  function festMult() {
    try {
      var d = store();
      var p = ensurePet(d);
      if (p.festUntil && Date.now() < p.festUntil) {
        var t = (window.G3TUNE || {});
        return (t.festMult == null) ? 2 : t.festMult;
      }
    } catch (e) {}
    return 1;
  }
  function maybeFestival(p) {
    try {
      var day = new Date().getDay();
      var today = todayStr();
      if (day === 5 && p.festDay !== today) {
        p.festDay = today;
        var mins = TN("festMins", 10);
        p.festUntil = Date.now() + mins * 60000;
        toast("🎆 금요 별빛 축제! " + mins + "분 동안 별 " + TN("festMult", 2) + "배!");
        if (window.G3Journal) window.G3Journal.log("축제", "별빛 축제 시작 (" + mins + "분 별 " + TN("festMult", 2) + "배)");
        return true;
      }
    } catch (e) {}
    return false;
  }
  function checkWeekly(d, p) {
    var w = ensureWeekly(p);
    if (w.done) return;
    var t = TUNE();
    var needBoss = (t.weeklyBoss == null) ? 3 : t.weeklyBoss;
    var needPerfect = (t.weeklyPerfect == null) ? 3 : t.weeklyPerfect;
    if (w.boss >= needBoss && w.perfect >= needPerfect) {
      w.done = true;
      d.stars = (d.stars || 0) + ((t.weeklyStars == null) ? 30 : t.weeklyStars);
      d.seeds = (d.seeds || 0) + ((t.weeklySeeds == null) ? 3 : t.weeklySeeds);
      toast("📅 주간 미션 완성! 별 +" + ((t.weeklyStars == null) ? 30 : t.weeklyStars) + "·씨앗 +" + ((t.weeklySeeds == null) ? 3 : t.weeklySeeds));
      if (window.G3Journal) window.G3Journal.log("주간", "주간 미션 완성! 수호자 " + w.boss + "·실수제로 " + w.perfect);
      if (window.G3Confetti) window.G3Confetti.burst();
    }
  }
  function unlockTitle(d, p, id) {
    if (p.titles.indexOf(id) < 0) {
      p.titles.push(id);
      var t = null;
      for (var i = 0; i < TITLES.length; i++) if (TITLES[i].id === id) t = TITLES[i];
      if (t) {
        if (window.G3Journal) window.G3Journal.log("칭호", "새 칭호 획득: " + t.name);
        toast("🏅 새 칭호 획득! [" + t.name + "]");
      }
      return true;
    }
    return false;
  }
  function checkTitles(d, p) {
    var doneCnt = Object.keys(d.done || {}).length;
    if ((p.exp || 0) >= 1) unlockTitle(d, p, "sprout");
    if ((p.bestCombo || 0) >= 3) unlockTitle(d, p, "combo3");
    if ((p.streak || 0) >= 3) unlockTitle(d, p, "streak3");
    var bossN = 0;
    for (var k in (p.bosses || {})) bossN += p.bosses[k] ? 1 : 0;
    if (bossN >= 1) unlockTitle(d, p, "boss1");
    if ((d.harvests || 0) >= 5) unlockTitle(d, p, "farmer");
    if (doneCnt >= 10) unlockTitle(d, p, "master");
  }
  function onSolve(ok) {
    var d = store();
    var p = ensurePet(d);
    var today = todayStr();
    if (p.lastSolveDay !== today) { p.lastSolveDay = today; p.todaySolved = 0; }
    var fever = false;
    if (ok) {
      p.combo = (p.combo || 0) + 1;
      if (p.combo > p.bestCombo) p.bestCombo = p.combo;
      p.exp = (p.exp || 0) + 1;
      p.todaySolved = (p.todaySolved || 0) + 1;
      if (p.todaySolved === TN("streakAt", 3)) {
        var yesterday = "";
        try {
          var dt = new Date(); dt.setDate(dt.getDate() - 1);
          yesterday = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
        } catch (e) {}
        if (p.lastStreakDay === yesterday) p.streak = (p.streak || 0) + 1;
        else if (p.lastStreakDay !== today) p.streak = 1;
        p.lastStreakDay = today;
        if (window.G3Journal) window.G3Journal.log("출석", "오늘 문제 3개 해결! 연속 출석 " + p.streak + "일");
        toast("📅 오늘의 출석 도장! 🔥 " + p.streak + "일 연속 공부 중!");
      }
      if (p.todaySolved % TN("candyEvery", 3) === 0) { p.candies = (p.candies || 0) + 1; }
      if (p.combo >= TN("comboFeverAt", 3)) {
        fever = true;
        d.stars = (d.stars || 0) + TN("comboBonus", 4);
        if (window.G3Journal) window.G3Journal.log("콤보", p.combo + "콤보 피버! 별 +" + TN("comboBonus", 4) + " 보너스");
      }
      var before = stageIndex(p.exp - 1);
      var after = stageIndex(p.exp);
      if (after > before) {
        toast("🐾 짝꿍 펫 진화! [" + PETS[after].name + "]이(가) 태어났어요!");
        if (window.G3Confetti) window.G3Confetti.burst();
        if (window.G3Journal) window.G3Journal.log("펫", PETS[after].name + "으로 진화!");
      }
    } else {
      p.combo = 0;
    }
    checkTitles(d, p);
    window.G3Store.save(d);
    if (window.G3UI) window.G3UI.stars();
    render();
    syncFollow();
    return { combo: p.combo || 0, fever: fever };
  }
  function mark(kind) {
    var d = store();
    var p = ensurePet(d);
    if (kind === "lesson") p.missions.lesson = true;
    if (kind === "farm") p.missions.farm = true;
    if (kind === "play") p.missions.play = true;
    window.G3Store.save(d);
    render();
  }
  function missionsDone(p) {
    return !!(p.missions.lesson && p.missions.farm && p.missions.play);
  }
  function openChest() {
    var d = store();
    var p = ensurePet(d);
    var today = todayStr();
    if (p.chestOpenedDay === today) { toast("오늘의 보물상자는 이미 열었어요. 내일 다시 도전!"); return; }
    if (!missionsDone(p)) { toast("일일 미션 3개를 모두 끝내면 보물상자가 열려요!"); return; }
    p.chestOpenedDay = today;
    var roll = Math.random();
    var msg = "별 20개!";
    var table = TN("chest", null);
    if (table && table.length) {
      var pick = table[table.length - 1];
      for (var ci = 0; ci < table.length; ci++) {
        if (roll < table[ci].upto) { pick = table[ci]; break; }
      }
      if (pick.stars) d.stars = (d.stars || 0) + pick.stars;
      if (pick.seeds) d.seeds = (d.seeds || 0) + pick.seeds;
      if (pick.candies) p.candies = (p.candies || 0) + pick.candies;
      if (pick.rainbow) p.rainbow = (p.rainbow || 0) + pick.rainbow;
      msg = pick.msg || msg;
    } else if (roll < 0.4) { d.stars = (d.stars || 0) + 20; msg = "별 20개!"; }
    else if (roll < 0.7) { d.seeds = (d.seeds || 0) + 3; msg = "씨앗 3개!"; }
    else if (roll < 0.85) { p.candies = (p.candies || 0) + 2; msg = "별사탕 2개!"; }
    else { p.rainbow = (p.rainbow || 0) + 1; d.seeds = (d.seeds || 0) + 1; msg = "🌈 무지개 씨앗 1개! 텃밭에 심어 보세요!"; }
    if (window.G3Journal) window.G3Journal.log("보물상자", "황금 보물상자 개봉: " + msg);
    window.G3Store.save(d);
    if (window.G3UI) { window.G3UI.stars(); if (window.G3UI.sfx) window.G3UI.sfx("fanfare"); }
    if (window.G3Confetti) window.G3Confetti.burst();
    toast("🎁 보물상자 개봉! " + msg);
    render();
  }
  function feed() {
    var d = store();
    var p = ensurePet(d);
    if ((p.candies || 0) < 1) { toast("별사탕이 없어요. 문제를 풀면 " + TN("candyEvery", 3) + "문제마다 별사탕 1개를 받아요!"); return; }
    p.candies -= 1;
    p.exp += TN("feedExp", 2);
    window.G3Store.save(d);
    toast("🍬 별사탕을 먹였어요! 펫 경험치 +" + TN("feedExp", 2));
    if (window.G3UI) window.G3UI.sfx("ok");
    render();
    syncFollow();
  }
  function setTitle(id) {
    var d = store();
    var p = ensurePet(d);
    if (id && p.titles.indexOf(id) < 0 && id !== "") { toast("아직 획득하지 못한 칭호예요."); return; }
    p.title = id || "";
    window.G3Store.save(d);
    toast(id ? "칭호를 변경했어요!" : "칭호를 해제했어요.");
    render();
  }
  function bossWin(house) {
    var d = store();
    var p = ensurePet(d);
    var w = ensureWeekly(p);
    w.boss = (w.boss || 0) + 1;
    checkWeekly(d, p);
    p.bosses[house] = (p.bosses[house] || 0) + 1;
    p.exp = (p.exp || 0) + TN("bossExp", 3);
    p.rainbow = (p.rainbow || 0) + TN("bossRainbow", 1);
    d.stars = (d.stars || 0) + TN("bossStars", 25);
    d.seeds = (d.seeds || 0) + TN("bossSeeds", 2);
    checkTitles(d, p);
    window.G3Store.save(d);
    if (window.G3UI) window.G3UI.stars();
    render();
  }
  function comboBar() {
    var d = store();
    var p = ensurePet(d);
    var c = p.combo || 0;
    if (c < 2) return "";
    var fever = c >= TN("comboFeverAt", 3);
    return "<div class='combo-bar" + (fever ? " fever btn-pulse" : "") + "' aria-live='polite'>"
      + (fever ? "🌟 STAR FEVER! " + c + " COMBO · 별 2배 보너스 중!" : "🔥 " + c + " COMBO!") + "</div>";
  }
  function petCardHtml(p) {
    var stage = stageIndex(p.exp || 0);
    var next = PETS[stage + 1];
    var nextTxt = next ? ("다음 진화 [" + next.name + "]까지 " + (next.need - p.exp) + " EXP") : "최종 진화 달성! 전설의 수호룡!";
    return "<div class='pet-card'><div class='pet-face'>" + petImg(stage, "pet-img-lg") + "</div>"
      + "<div class='pet-meta'><b>🐾 " + PETS[stage].name + "</b>"
      + "<span>EXP " + p.exp + " · 별사탕 " + (p.candies || 0) + "개 · 콤보 최고 " + (p.bestCombo || 0) + "</span>"
      + "<span>" + nextTxt + "</span>"
      + "<span>🔥 " + (p.streak || 0) + "일 연속 출석 · 오늘 푼 문제 " + (p.todaySolved || 0) + "/" + TN("streakAt", 3) + "</span>"
      + "<div class='prow'><button type='button' class='go btn-pulse' data-pet-feed='1'>🍬 별사탕 주기 (EXP+2)</button></div>"
      + "</div></div>";
  }
  function chestHtml(p) {
    var m = p.missions || {};
    function li(ok, t) { return "<li>" + (ok ? "✅ " : "⬜ ") + t + "</li>"; }
    var can = missionsDone(p) && p.chestOpenedDay !== todayStr();
    var opened = p.chestOpenedDay === todayStr();
    return "<div class='chest-card'><b>🎁 오늘의 별숲 보물상자</b>"
      + "<ul class='checks'>"
      + li(m.lesson, "단원 문제 1차시 풀기") + li(m.farm, "텃밭 심기·물주기·수확 1회") + li(m.play, "놀이·오답·도전 중 1회")
      + "</ul>"
      + (opened ? "<p class='hint'>오늘은 이미 열었어요! 내일 다시 도전!</p>"
        : (can ? "<button type='button' class='go btn-pulse' data-chest-open='1'>🎁 황금 보물상자 열기!</button>"
          : "<p class='hint'>3개를 모두 달성하면 황금 보물상자가 열려요!</p>"))
      + (p.rainbow ? "<p class='hint'>🌈 무지개 씨앗 보유 " + p.rainbow + "개 — 텃밭에서 심을 수 있어요!</p>" : "")
      + "</div>";
  }
  function titleHtml(p) {
    var html = "<div class='title-card'><b>🏅 나의 칭호</b><div class='prow'>";
    html += "<button type='button' class='mini-act' data-title-set=''>칭호 없음</button>";
    for (var i = 0; i < TITLES.length; i++) {
      var got = p.titles.indexOf(TITLES[i].id) >= 0;
      var sel = p.title === TITLES[i].id ? " sel" : "";
      html += "<button type='button' class='mini-act" + sel + "' data-title-set='" + TITLES[i].id + "'" + (got ? "" : " disabled") + ">"
        + (got ? "🏅 " : "🔒 ") + TITLES[i].name + "<small>" + TITLES[i].desc + "</small></button>";
    }
    html += "</div></div>";
    return html;
  }
  function ensureBoxes() {
    try {
      var av = document.getElementById("avatar");
      if (av && !document.getElementById("petBox")) {
        var pb = document.createElement("div");
        pb.id = "petBox";
        av.appendChild(pb);
      }
      var play = document.getElementById("playSec");
      if (play && !document.getElementById("chestBox")) {
        var cb = document.createElement("div");
        cb.id = "chestBox";
        play.appendChild(cb);
      }
      var note = document.getElementById("note");
      if (note && !document.getElementById("titleBox")) {
        var tb = document.createElement("div");
        tb.id = "titleBox";
        note.appendChild(tb);
      }
    } catch (e) {}
  }
  function render() {
    ensureBoxes();
    var d = store();
    var p = ensurePet(d);
    ensureWeekly(p);
    maybeFestival(p);
    window.G3Store.save(d);
    var html = petCardHtml(p);
    var ids = ["petBox", "petBoxLow"];
    for (var i = 0; i < ids.length; i++) {
      var el = document.getElementById(ids[i]);
      if (el) el.innerHTML = html;
    }
    var ch = chestHtml(p) + weeklyHtml(p);
    var cids = ["chestBox", "chestBoxLow"];
    for (var j = 0; j < cids.length; j++) {
      var ce = document.getElementById(cids[j]);
      if (ce) ce.innerHTML = ch;
    }
    var tb = document.getElementById("titleBox");
    if (tb) tb.innerHTML = titleHtml(p);
    syncFollow();
  }
  function followEmoji() {
    var d = store();
    var p = ensurePet(d);
    var stage = stageIndex(p.exp || 0);
    return { emoji: PETS[stage].emoji, id: PETS[stage].id, name: PETS[stage].name };
  }
  function syncFollow() {
    try {
      var f = followEmoji();
      var wraps = [document.getElementById("mapwrap"), document.getElementById("lowMapwrap")];
      for (var i = 0; i < wraps.length; i++) {
        var wrap = wraps[i];
        if (!wrap) continue;
        var el = wrap.querySelector(".pet-follow");
        if (!el) {
          el = document.createElement("div");
          el.className = "pet-follow";
          el.title = "짝꿍 펫";
          wrap.appendChild(el);
        }
        el.innerHTML = "<img src='../assets/img/flow/parts/" + f.id + ".png' alt='" + f.name + "' onerror=\"this.style.display='none'\">"
          + "<span>" + f.emoji + "</span>";
        el.title = f.name;
      }
    } catch (e) {}
  }
  document.addEventListener("click", function (e) {
    var t = e.target.closest ? e.target.closest("[data-pet-feed],[data-chest-open],[data-title-set]") : null;
    if (!t) return;
    if (t.hasAttribute("data-pet-feed")) feed();
    else if (t.hasAttribute("data-chest-open")) openChest();
    else if (t.hasAttribute("data-title-set")) setTitle(t.getAttribute("data-title-set"));
  });
  function notePerfect() {
    var d = store();
    var p = ensurePet(d);
    var w = ensureWeekly(p);
    w.perfect = (w.perfect || 0) + 1;
    checkWeekly(d, p);
    window.G3Store.save(d);
    render();
  }
  function weeklyHtml(p) {
    var w = (p.weekly && p.weekly.week === weekKey()) ? p.weekly : { boss: 0, perfect: 0, done: false };
    var t = TUNE();
    var needBoss = (t.weeklyBoss == null) ? 3 : t.weeklyBoss;
    var needPerfect = (t.weeklyPerfect == null) ? 3 : t.weeklyPerfect;
    var fest = "";
    try {
      if (p.festUntil && Date.now() < p.festUntil) {
        var left = Math.max(1, Math.ceil((p.festUntil - Date.now()) / 60000));
        fest = "<span>🎆 별빛 축제 중! 약 " + left + "분 동안 별 " + TN("festMult", 2) + "배!</span>";
      }
    } catch (e) {}
    return "<div class='chest-card'><b>📅 이번 주 별숲 미션</b>"
      + "<ul class='checks'>"
      + "<li>" + (w.boss >= needBoss ? "✅ " : "⬜ ") + "수호자 격파 " + Math.min(w.boss, needBoss) + "/" + needBoss + "</li>"
      + "<li>" + (w.perfect >= needPerfect ? "✅ " : "⬜ ") + "실수 없이 차시 끝내기 " + Math.min(w.perfect, needPerfect) + "/" + needPerfect + "</li>"
      + "</ul>"
      + (w.done ? "<p class='hint'>주간 미션 완성! 다음 주 월요일에 새로 시작해요.</p>" : "<p class='hint'>둘 다 마치면 별 +" + ((t.weeklyStars == null) ? 30 : t.weeklyStars) + "·씨앗 +" + ((t.weeklySeeds == null) ? 3 : t.weeklySeeds) + "!</p>")
      + fest + "</div>";
  }
  window.G3Pet = {
    render: render, onSolve: onSolve, mark: mark, openChest: openChest,
    feed: feed, setTitle: setTitle, bossWin: bossWin, comboBar: comboBar,
    syncFollow: syncFollow, PETS: PETS, TITLES: TITLES,
    festMult: festMult, weeklyHtml: weeklyHtml, weekKey: weekKey, notePerfect: notePerfect
  };
})();
