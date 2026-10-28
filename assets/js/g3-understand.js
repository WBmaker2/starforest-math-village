(function () {
  // 개념 이해도 추적: 태그별 최근 시도(최대 12개)와 누적 성공/시도를 저장합니다.
  // 저장 위치는 최상위 d.tagStats / d.tagDaily (태그 ID에 학년이 이미 포함됨).
  var WINDOW = 12;
  var WEAK_RATE = 0.6;
  var WEAK_MIN = 3;
  var MASTER_RATE = 0.9;
  var MASTER_MIN = 5;

  function store() { return window.G3Store.load(); }
  function save(d) { window.G3Store.save(d); }
  function todayKey() {
    var d = new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }
  function grade() {
    try { return (window.G3Store && window.G3Store.grade) ? window.G3Store.grade() : "g3"; } catch (e) { return "g3"; }
  }
  function isLowGrade(g) { return g === "g1" || g === "g2"; }
  function ensure(d) {
    if (!d.tagStats || typeof d.tagStats !== "object") d.tagStats = {};
    if (!d.tagDaily || typeof d.tagDaily !== "object") d.tagDaily = {};
    return d;
  }
  function record(tag, ok) {
    if (!tag || !tag.id) return;
    try {
      var d = ensure(store());
      var st = d.tagStats[tag.id];
      if (!st) st = { name: tag.name || tag.id, unitId: tag.unitId || "", unitName: tag.unitName || "", ok: 0, total: 0, recent: [], lastAt: 0 };
      st.name = tag.name || st.name;
      st.unitId = tag.unitId || st.unitId;
      st.unitName = tag.unitName || st.unitName;
      st.total += 1;
      if (ok) st.ok += 1;
      st.recent.push(ok ? 1 : 0);
      if (st.recent.length > WINDOW) st.recent = st.recent.slice(st.recent.length - WINDOW);
      st.lastAt = Date.now();
      d.tagStats[tag.id] = st;
      var k = todayKey();
      var day = d.tagDaily[k] || { ok: 0, total: 0 };
      day.total += 1;
      if (ok) day.ok += 1;
      d.tagDaily[k] = day;
      var keys = Object.keys(d.tagDaily);
      if (keys.length > 21) {
        keys.sort();
        for (var i = 0; i < keys.length - 21; i++) delete d.tagDaily[keys[i]];
      }
      save(d);
    } catch (e) {}
  }
  function rateOf(st) {
    if (!st || !st.total) return null;
    var win = st.recent && st.recent.length ? st.recent : null;
    if (!win) return st.ok / st.total;
    var sum = 0;
    for (var i = 0; i < win.length; i++) sum += win[i];
    return sum / win.length;
  }
  function tagsForGrade() {
    var g = grade();
    var all = (window.G3Tags && window.G3Tags.allForGrade) ? window.G3Tags.allForGrade() : [];
    var out = [];
    var lowPrefix = "low:g" + lowGradeNum() + "-";
    for (var i = 0; i < all.length; i++) {
      var t = all[i];
      if (isLowGrade(g)) {
        if (String(t.id).indexOf(lowPrefix) === 0) out.push(t);
      } else {
        if (String(t.id).indexOf(g + "-") === 0) out.push(t);
      }
    }
    return out;
  }
  function decorate(t, st) {
    var rate = rateOf(st);
    return {
      id: t.id,
      name: (st && st.name) || t.name,
      unitId: (st && st.unitId) || t.unitId,
      unitName: (st && st.unitName) || t.unitName,
      ok: st ? st.ok : 0,
      total: st ? st.total : 0,
      rate: rate == null ? null : rate,
      lastAt: st ? st.lastAt : 0
    };
  }
  function weakTags(limit) {
    var d = ensure(store());
    var list = tagsForGrade();
    var out = [];
    for (var i = 0; i < list.length; i++) {
      var st = d.tagStats[list[i].id];
      if (!st || st.total < WEAK_MIN) continue;
      var r = rateOf(st);
      if (r == null || r >= WEAK_RATE) continue;
      out.push(decorate(list[i], st));
    }
    out.sort(function (a, b) { return (a.rate - b.rate) || (b.total - a.total); });
    return limit ? out.slice(0, limit) : out;
  }
  function masteredTags(limit) {
    var d = ensure(store());
    var list = tagsForGrade();
    var out = [];
    for (var i = 0; i < list.length; i++) {
      var st = d.tagStats[list[i].id];
      if (!st || st.total < MASTER_MIN) continue;
      var r = rateOf(st);
      if (r == null || r < MASTER_RATE) continue;
      out.push(decorate(list[i], st));
    }
    out.sort(function (a, b) { return (b.total - a.total) || (b.rate - a.rate); });
    return limit ? out.slice(0, limit) : out;
  }
  function allStats() {
    var d = ensure(store());
    var list = tagsForGrade();
    var out = [];
    for (var i = 0; i < list.length; i++) {
      var st = d.tagStats[list[i].id];
      if (!st) continue;
      out.push(decorate(list[i], st));
    }
    out.sort(function (a, b) { return (b.total - a.total) || (b.lastAt - a.lastAt); });
    return out;
  }
  function unitBoard() {
    var d = ensure(store());
    var units = window.G3Units || {};
    var board = [];
    var seen = {};
    var order = (window.GRADE_UNIT_ORDER && window.GRADE_UNIT_ORDER.length) ? window.GRADE_UNIT_ORDER : null;
    function unitName(id) {
      if (units[id] && units[id].name) return units[id].name;
      var lowData = window.LowData || {};
      var lows = (lowData.g1 || []).concat(lowData.g2 || []);
      for (var li2 = 0; li2 < lows.length; li2++) if (lows[li2].id === id && lows[li2].name) return lows[li2].name;
      if (window.G3Tags && window.G3Tags.unit) {
        var u = window.G3Tags.unit(id);
        if (u && u.name && u.name !== id) return u.name;
      }
      if (order) for (var i = 0; i < order.length; i++) if (order[i][0] === id) return order[i][1];
      return id;
    }
    var ids = [];
    if (order) {
      for (var oi = 0; oi < order.length; oi++) ids.push(order[oi][0]);
    } else {
      for (var k in units) ids.push(k);
    }
    var g = grade();
    if (isLowGrade(g)) {
      var low = window.LowData || {};
      var arr = (g === "g2") ? (low.g2 || []) : (low.g1 || []);
      ids = [];
      for (var li = 0; li < arr.length; li++) ids.push(arr[li].id);
    }
    for (var i2 = 0; i2 < ids.length; i2++) {
      var uid = ids[i2];
      var sumOk = 0, sumTot = 0;
      for (var tid in d.tagStats) {
        var st = d.tagStats[tid];
        if (!st || st.unitId !== uid) continue;
        sumOk += st.ok; sumTot += st.total;
      }
      var rate = sumTot ? sumOk / sumTot : null;
      board.push({
        id: uid,
        name: unitName(uid),
        ok: sumOk,
        total: sumTot,
        rate: rate,
        state: rate == null ? "none" : (rate >= MASTER_RATE ? "master" : (rate < WEAK_RATE ? "weak" : "normal"))
      });
    }
    return board;
  }
  function dayStats(offsetDays) {
    var d = ensure(store());
    var dt = new Date();
    if (offsetDays) dt.setDate(dt.getDate() - offsetDays);
    var k = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
    return d.tagDaily[k] || { ok: 0, total: 0 };
  }
  function weekStats() {
    var d = ensure(store());
    var ok = 0, total = 0;
    for (var i = 0; i < 7; i++) {
      var s = dayStats(i);
      ok += s.ok; total += s.total;
    }
    return { ok: ok, total: total };
  }
  function summary() {
    var today = dayStats(0);
    var week = weekStats();
    var all = allStats();
    var ok = 0, total = 0;
    for (var i = 0; i < all.length; i++) { ok += all[i].ok; total += all[i].total; }
    return {
      today: today,
      week: week,
      total: total,
      ok: ok,
      weak: weakTags(3),
      mastered: masteredTags(),
      units: unitBoard(),
      tags: all
    };
  }
  function lowGradeNum() { return grade() === "g2" ? "2" : "1"; }
  function pickDistinct(list, q, max) {
    for (var i = 0; i < list.length && list.length < max; i++) {
      var dup = false;
      for (var j = 0; j < list.length; j++) if (list[j].q === q) { dup = true; break; }
      if (!dup) list.push(q);
    }
  }
  function focusQuestions(n) {
    n = n || 10;
    var out = [];
    var seen = {};
    var weak = weakTags(3);
    var g = grade();
    var level = 2;
    try { if (window.G3Adapt && window.G3Adapt.level) level = window.G3Adapt.level(); } catch (e) {}
    function add(q, tag, house, lid) {
      if (!q || seen[q.q]) return;
      seen[q.q] = 1;
      out.push({ q: q.q, a: q.a, steps: q.steps || (q.exp ? [q.exp] : []), exp: q.exp, svg: q.svg, choices: q.choices, house: house, lid: lid || "focus", tagId: tag.id, tagName: tag.name });
    }
    for (var i = 0; i < weak.length && out.length < n; i++) {
      var tag = weak[i];
      var house = tag.unitId;
      if (!house) continue;
      var gen = [];
      try {
        if (isLowGrade(g)) gen = (window.LowPad && window.LowPad.generate) ? window.LowPad.generate(lowGradeNum(), house, level) : [];
        else gen = (window.G3Pad && window.G3Pad.generateSet) ? window.G3Pad.generateSet(house, level) : [];
      } catch (e) { gen = []; }
      var added = 0;
      for (var gi = 0; gi < gen.length && added < 2 && out.length < n; gi++) {
        if (seen[gen[gi].q]) continue;
        add(gen[gi], tag, house);
        added++;
      }
    }
    var pool = [];
    try {
      if (isLowGrade(g)) {
        var arr = (window.LowData || {})[g === "g2" ? "g2" : "g1"] || [];
        for (var ai = 0; ai < arr.length; ai++) {
          var items = arr[ai].list || [];
          for (var ii = 0; ii < items.length; ii++) pool.push({ q: items[ii].q, a: items[ii].a, exp: items[ii].exp, svg: items[ii].svg, choices: items[ii].choices, house: arr[ai].id });
        }
      } else {
        var units = window.G3Units || {};
        for (var hid in units) {
          var ls = units[hid].lessons || [];
          for (var li = 0; li < ls.length; li++) {
            for (var qi = 0; qi < ls[li].list.length; qi++) {
              var it = ls[li].list[qi];
              pool.push({ q: it.q, a: it.a, steps: it.steps, house: hid, lid: ls[li].id });
            }
          }
        }
      }
    } catch (e) {}
    pool.sort(function () { return Math.random() - 0.5; });
    for (var pi = 0; pi < pool.length && out.length < n; pi++) {
      var pq = pool[pi];
      var t = (window.G3Tags && window.G3Tags.forQuestion) ? window.G3Tags.forQuestion(pq.house, pq.lid, pq) : null;
      if (!t) t = (window.G3Tags && window.G3Tags.low) ? window.G3Tags.low(pq.house) : null;
      add(pq, t || { id: pq.house || "misc", name: "복습" }, pq.house, pq.lid);
    }
    return out;
  }
  function wrongForestList(limit) {
    try {
      var d = window.G3Store ? window.G3Store.load() : { wrong: [] };
      var arr = d.wrong || [];
      var map = {};
      for (var i = 0; i < arr.length; i++) {
        var w = arr[i] || {};
        var key = w.tag || w.lid || ("q:" + (w.q || ""));
        if (!map[key]) map[key] = { key: key, tag: w.tag || "", lid: w.lid || "", q: w.q || "", count: 0, lastAt: w.at || 0, item: w };
        map[key].count += 1;
        if ((w.at || 0) > map[key].lastAt) { map[key].lastAt = w.at || 0; map[key].item = w; }
      }
      var out = [];
      for (var k in map) out.push(map[k]);
      out.sort(function (a, b) { return (b.count - a.count) || (b.lastAt - a.lastAt); });
      return limit ? out.slice(0, limit) : out;
    } catch (e) { return []; }
  }
  function clearWrongForest(keys) {
    try {
      if (!Array.isArray(keys) || !keys.length) return false;
      var d = window.G3Store ? window.G3Store.load() : { wrong: [] };
      var set = {};
      for (var i = 0; i < keys.length; i++) set[keys[i]] = true;
      var arr = d.wrong || [];
      var next = [];
      for (var j = 0; j < arr.length; j++) {
        var w = arr[j] || {};
        var key = w.tag || w.lid || ("q:" + (w.q || ""));
        if (!set[key]) next.push(w);
      }
      d.wrong = next;
      if (window.G3Store) window.G3Store.save(d);
      return true;
    } catch (e) { return false; }
  }
  window.G3Understand = {
    record: record,
    weakTags: weakTags,
    masteredTags: masteredTags,
    allStats: allStats,
    unitBoard: unitBoard,
    summary: summary,
    today: function () { return dayStats(0); },
    week: weekStats,
    focusQuestions: focusQuestions,
    wrongForestList: wrongForestList,
    clearWrongForest: clearWrongForest
  };
})();
