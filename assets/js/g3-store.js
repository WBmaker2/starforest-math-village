(function () {
  var KEY = "starforest-g3";
  var LEGACY_KEY = "math-walk-g3";
  function currentGrade() {
    try {
      if (window.STARFOREST_GRADE) return window.STARFOREST_GRADE;
      var m = document.querySelector('meta[name="starforest-grade"]');
      if (m && m.getAttribute("content")) return m.getAttribute("content");
      var q = (location.search || "").match(/[?&]grade=([1-6])/);
      if (q) return "g" + q[1];
      var h = (location.pathname || "");
      if (h.indexOf("grade4") >= 0) return "g4";
      if (h.indexOf("grade5") >= 0) return "g5";
      if (h.indexOf("grade6") >= 0) return "g6";
      if (h.indexOf("lower") >= 0) {
        var qq = (location.search || "").match(/[?&]grade=([12])/);
        return qq ? ("g" + qq[1]) : "g1";
      }
      if (h.indexOf("grade3") >= 0) return "g3";
    } catch (e) {}
    return "g3";
  }
  function blankGrade() {
    return { done: {}, wrong: [], visits: {}, quests: { done: [] }, lowDone: {}, journal: [] };
  }
  function blank() {
    return { avatar: null, stars: 0, seeds: 0, done: {}, wrong: [],
      farm: { plots: [null, null, null, null] },
      basket: { lettuce: 0, tomato: 0, pumpkin: 0 },
      deco: { owned: ["flowerpot"], placed: [] },
      friends: { mong: 0, chick: 0, bunny: 0 },
      mapTime: "day",
      journal: [], visits: {}, harvests: 0,
      grades: { g1: blankGrade(), g2: blankGrade(), g3: blankGrade(), g4: blankGrade(), g5: blankGrade(), g6: blankGrade() } };
  }
  function ensureGrades(d) {
    if (!d.grades || typeof d.grades !== "object") d.grades = {};
    var ids = ["g1", "g2", "g3", "g4", "g5", "g6"];
    for (var i = 0; i < ids.length; i++) {
      var g = d.grades[ids[i]] || {};
      if (!g.done) g.done = {};
      if (!g.wrong) g.wrong = [];
      if (!g.visits) g.visits = {};
      if (!g.quests || !g.quests.done) g.quests = { done: [] };
      if (!g.lowDone) g.lowDone = {};
      if (!g.journal) g.journal = [];
      d.grades[ids[i]] = g;
    }
    // 구 저장 데이터(g3 단일 구조)를 g3 칸으로 옮기기 (하위 호환)
    if (d.done && Object.keys(d.done).length && !Object.keys(d.grades.g3.done).length) {
      d.grades.g3.done = d.done;
    }
    if (d.wrong && d.wrong.length && !d.grades.g3.wrong.length) {
      d.grades.g3.wrong = d.wrong;
    }
    if (d.visits && Object.keys(d.visits).length && !Object.keys(d.grades.g3.visits).length) {
      d.grades.g3.visits = d.visits;
    }
    if (d.quests && d.quests.done && d.quests.done.length && !d.grades.g3.quests.done.length) {
      d.grades.g3.quests = d.quests;
    }
    if (d.lowDone && Object.keys(d.lowDone).length) {
      for (var k in d.lowDone) {
        if (!d.grades.g1.lowDone[k]) d.grades.g1.lowDone[k] = d.lowDone[k];
        if (!d.grades.g2.lowDone[k]) d.grades.g2.lowDone[k] = d.lowDone[k];
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
    d._grade = g;
    return d;
  }
  function load() {
    try {
      var raw = localStorage.getItem(KEY) || localStorage.getItem(LEGACY_KEY);
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
      var copy = {};
      for (var k in d) {
        if (k === "_grade" || k === "done" || k === "wrong" || k === "visits" || k === "quests" || k === "lowDone") continue;
        copy[k] = d[k];
      }
      copy.grades = d.grades;
      // 구 버전 호환용 평탄 필드도 함께 보관 (g3 기준)
      if (g === "g3") {
        copy.done = d.done; copy.wrong = d.wrong; copy.visits = d.visits; copy.quests = d.quests;
      } else {
        copy.done = (d.grades.g3 && d.grades.g3.done) || {};
        copy.wrong = (d.grades.g3 && d.grades.g3.wrong) || [];
        copy.visits = (d.grades.g3 && d.grades.g3.visits) || {};
        copy.quests = (d.grades.g3 && d.grades.g3.quests) || { done: [] };
      }
      localStorage.setItem(KEY, JSON.stringify(copy));
    } catch (e) {}
  }
  window.G3Store = { load: load, save: save, grade: currentGrade };
})();
