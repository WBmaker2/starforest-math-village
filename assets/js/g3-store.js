(function () {
  var KEY = "starforest-g3";
  var LEGACY_KEY = "math-walk-g3";
  var SLOT_CUR = "starforest-slot-cur";
  function slot() {
    try {
      var n = parseInt(localStorage.getItem(SLOT_CUR) || "1", 10);
      if (n >= 1 && n <= 4) return n;
    } catch (e) {}
    return 1;
  }
  function keyFor(n) {
    return n === 1 ? KEY : ("starforest-slot-" + n);
  }
  function slotName(n) {
    try {
      var raw = localStorage.getItem(keyFor(n)) || (n === 1 ? localStorage.getItem(LEGACY_KEY) : null);
      if (!raw) return "";
      var d = JSON.parse(raw);
      return (d && d.avatar && d.avatar.name) || "";
    } catch (e) { return ""; }
  }
  function seasonalSem() {
    try {
      var m = (new Date()).getMonth() + 1;
      return (m >= 2 && m <= 8) ? "1" : "2";
    } catch (e) { return "2"; }
  }
  function currentSem() {
    try {
      var q = (location.search || "").match(/[?&]sem=([12])/);
      if (q) return q[1];
      var m = document.querySelector('meta[name="starforest-sem"]');
      if (m && m.getAttribute("content")) return m.getAttribute("content");
      if (window.STARFOREST_SEM) return String(window.STARFOREST_SEM);
    } catch (e) {}
    return seasonalSem();
  }
  function currentGrade() {
    try {
      var base = null;
      if (window.STARFOREST_GRADE) base = window.STARFOREST_GRADE;
      var m = document.querySelector('meta[name="starforest-grade"]');
      if (!base && m && m.getAttribute("content")) base = m.getAttribute("content");
      if (!base) {
        var q = (location.search || "").match(/[?&]grade=([1-6])/);
        if (q) base = "g" + q[1];
      }
      if (!base) {
        var h = (location.pathname || "");
        if (h.indexOf("grade4") >= 0) base = "g4";
        else if (h.indexOf("grade5") >= 0) base = "g5";
        else if (h.indexOf("grade6") >= 0) base = "g6";
        else if (h.indexOf("lower") >= 0) {
          var qq = (location.search || "").match(/[?&]grade=([12])/);
          base = qq ? ("g" + qq[1]) : "g1";
        }
        else if (h.indexOf("grade3") >= 0) base = "g3";
      }
      if (!base) base = "g3";
      // 구 키(g3 등)가 들어오면 학기를 붙여 정규화. 기존 기록은 2학기로 간주.
      var mm = String(base).match(/^(g[1-6])(s[12])?$/);
      if (mm) return mm[1] + "s" + currentSem();
      return base;
    } catch (e) {}
    return "g3s2";
  }
  function blankGrade() {
    return { done: {}, wrong: [], visits: {}, quests: { done: [] }, lowDone: {}, journal: [], stars2: {}, recent: [], adaptLevel: 2 };
  }
  function blank() {
    return { avatar: null, stars: 0, seeds: 0, done: {}, wrong: [],
      farm: { plots: [null, null, null, null] },
      basket: { lettuce: 0, tomato: 0, pumpkin: 0 },
      deco: { owned: ["flowerpot"], placed: [] },
      friends: { mong: 0, chick: 0, bunny: 0 },
      mapTime: "day",
      journal: [], visits: {}, harvests: 0,
      grades: { g1s1: blankGrade(), g1s2: blankGrade(), g2s1: blankGrade(), g2s2: blankGrade(), g3s1: blankGrade(), g3s2: blankGrade(), g4s1: blankGrade(), g4s2: blankGrade(), g5s1: blankGrade(), g5s2: blankGrade(), g6s1: blankGrade(), g6s2: blankGrade() } };
  }
  var GRADE_IDS = ["g1s1", "g1s2", "g2s1", "g2s2", "g3s1", "g3s2", "g4s1", "g4s2", "g5s1", "g5s2", "g6s1", "g6s2"];
  var LEGACY_GRADE_IDS = ["g1", "g2", "g3", "g4", "g5", "g6"];
  function ensureGrades(d) {
    if (!d.grades || typeof d.grades !== "object") d.grades = {};
    for (var i = 0; i < GRADE_IDS.length; i++) {
      var g = d.grades[GRADE_IDS[i]] || {};
      if (!g.done) g.done = {};
      if (!g.wrong) g.wrong = [];
      if (!g.visits) g.visits = {};
      if (!g.quests || !g.quests.done) g.quests = { done: [] };
      if (!g.lowDone) g.lowDone = {};
      if (!g.journal) g.journal = [];
      if (!g.stars2) g.stars2 = {};
      if (!g.recent) g.recent = [];
      if (!g.adaptLevel) g.adaptLevel = 2;
      d.grades[GRADE_IDS[i]] = g;
    }
    // 구 저장 데이터(학기 구분 없음, g1..g6)를 2학기 칸으로 옮기기 (하위 호환)
    for (var li = 0; li < LEGACY_GRADE_IDS.length; li++) {
      var lg = LEGACY_GRADE_IDS[li];
      var src = d.grades[lg];
      if (!src || typeof src !== "object") continue;
      var dst = d.grades[lg + "s2"];
      if (src.done && Object.keys(src.done).length && !Object.keys(dst.done).length) dst.done = src.done;
      if (src.wrong && src.wrong.length && !dst.wrong.length) dst.wrong = src.wrong;
      if (src.visits && Object.keys(src.visits).length && !Object.keys(dst.visits).length) dst.visits = src.visits;
      if (src.quests && src.quests.done && src.quests.done.length && !dst.quests.done.length) dst.quests = src.quests;
      if (src.lowDone && Object.keys(src.lowDone).length && !Object.keys(dst.lowDone).length) dst.lowDone = src.lowDone;
      if (src.stars2 && Object.keys(src.stars2).length && !Object.keys(dst.stars2).length) dst.stars2 = src.stars2;
      if (src.journal && src.journal.length && !dst.journal.length) dst.journal = src.journal;
    }
    // 구 저장 데이터(g3 단일 구조)를 g3s2 칸으로 옮기기 (하위 호환)
    if (d.done && Object.keys(d.done).length && !Object.keys(d.grades.g3s2.done).length) {
      d.grades.g3s2.done = d.done;
    }
    if (d.wrong && d.wrong.length && !d.grades.g3s2.wrong.length) {
      d.grades.g3s2.wrong = d.wrong;
    }
    if (d.visits && Object.keys(d.visits).length && !Object.keys(d.grades.g3s2.visits).length) {
      d.grades.g3s2.visits = d.visits;
    }
    if (d.quests && d.quests.done && d.quests.done.length && !d.grades.g3s2.quests.done.length) {
      d.grades.g3s2.quests = d.quests;
    }
    if (d.lowDone && Object.keys(d.lowDone).length) {
      for (var k in d.lowDone) {
        if (!d.grades.g1s2.lowDone[k]) d.grades.g1s2.lowDone[k] = d.lowDone[k];
        if (!d.grades.g2s2.lowDone[k]) d.grades.g2s2.lowDone[k] = d.lowDone[k];
      }
    }
    return d;
  }
  function applyGradeView(d) {
    var g = currentGrade();
    var gd = (d.grades && d.grades[g]) || blankGrade();
    d.done = gd.done || {};
    d.wrong = gd.wrong || [];
    d.visits = gd.visits || {};
    d.quests = gd.quests || { done: [] };
    d.lowDone = gd.lowDone || {};
    d.stars2 = gd.stars2 || {};
    d.recent = gd.recent || [];
    d.adaptLevel = gd.adaptLevel || 2;
    d._grade = g;
    return d;
  }
  function load() {
    try {
      var raw = localStorage.getItem(keyFor(slot())) || (slot() === 1 ? localStorage.getItem(LEGACY_KEY) : null);
      var d;
      if (!raw) d = blank();
      else {
        d = JSON.parse(raw);
        if (!d || typeof d !== "object") d = blank();
      }
      d.stars = d.stars || 0; d.seeds = d.seeds || 0;
      if (!d.farm || !d.farm.plots) d.farm = { plots: [null, null, null, null] };
      if (!d.basket) d.basket = { lettuce: 0, tomato: 0, pumpkin: 0 };
      if (!d.deco) d.deco = { owned: ["flowerpot"], placed: [] };
      if (!d.friends) d.friends = { mong: 0, chick: 0, bunny: 0 };
      if (!d.mapTime) d.mapTime = "day";
      if (!d.journal) d.journal = [];
      if (!d.sets) d.sets = [];
      d.harvests = d.harvests || 0;
      if (!d.cards) d.cards = [];
      ensureGrades(d);
      applyGradeView(d);
      return d;
    } catch (e) { var b = blank(); applyGradeView(b); return b; }
  }
  function save(d) {
    try {
      var g = (d && d._grade) || currentGrade();
      ensureGrades(d);
      d.grades[g].done = d.done || {};
      d.grades[g].wrong = d.wrong || [];
      d.grades[g].visits = d.visits || {};
      d.grades[g].quests = d.quests || { done: [] };
      d.grades[g].lowDone = d.lowDone || {};
      d.grades[g].stars2 = d.stars2 || {};
      d.grades[g].recent = (d.recent || []).slice(-20);
      d.grades[g].adaptLevel = d.adaptLevel || 2;
      var copy = {};
      for (var k in d) {
        if (k === "_grade" || k === "done" || k === "wrong" || k === "visits" || k === "quests" || k === "lowDone" || k === "stars2" || k === "recent" || k === "adaptLevel") continue;
        copy[k] = d[k];
      }
      copy.grades = d.grades;
      // 구 버전 호환용 평탄 필드도 함께 보관 (g3s2 기준)
      if (g === "g3s2" || g === "g3") {
        copy.done = d.done; copy.wrong = d.wrong; copy.visits = d.visits; copy.quests = d.quests;
      } else {
        copy.done = (d.grades.g3s2 && d.grades.g3s2.done) || {};
        copy.wrong = (d.grades.g3s2 && d.grades.g3s2.wrong) || [];
        copy.visits = (d.grades.g3s2 && d.grades.g3s2.visits) || {};
        copy.quests = (d.grades.g3s2 && d.grades.g3s2.quests) || { done: [] };
      }
      localStorage.setItem(keyFor(slot()), JSON.stringify(copy));
    } catch (e) {}
  }
  function switchSlot(n) {
    try {
      n = parseInt(n, 10);
      if (!(n >= 1 && n <= 4)) return false;
      localStorage.setItem(SLOT_CUR, String(n));
      return true;
    } catch (e) { return false; }
  }
  function exportData() {
    try {
      var data = load();
      var copy = JSON.parse(JSON.stringify(data));
      var blob = new Blob([JSON.stringify(copy, null, 2)], { type: "application/json" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      var ts = new Date().toISOString().replace(/[:.]/g, "-");
      a.href = url;
      a.download = "starforest-math-village-backup-" + ts + ".json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () { try { URL.revokeObjectURL(url); } catch (e) {} }, 1000);
      return true;
    } catch (e) { return false; }
  }
  function importData(file) {
    return new Promise(function (resolve) {
      try {
        if (!file) { resolve(false); return; }
        var reader = new FileReader();
        reader.onload = function (e) {
          try {
            var obj = JSON.parse(e.target.result);
            if (!obj || typeof obj !== "object") { resolve(false); return; }
            localStorage.setItem(keyFor(slot()), JSON.stringify(obj));
            resolve(true);
          } catch (err) { resolve(false); }
        };
        reader.onerror = function () { resolve(false); };
        reader.readAsText(file);
      } catch (e) { resolve(false); }
    });
  }
  window.G3Store = { load: load, save: save, grade: currentGrade, sem: currentSem, seasonal: seasonalSem,
    slot: slot, slotName: slotName, switchSlot: switchSlot, exportData: exportData, importData: importData };
})();
