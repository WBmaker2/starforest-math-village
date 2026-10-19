(function () {
  // 문항 유형 태그: 차시(lid) 하나가 하나의 개념 단위입니다.
  // 개별 문항에 tagId가 있으면 그것을 우선 사용하고, 없으면 차시 태그를 물려받습니다.
  var G3_EXPLICIT = {
    "mul-1": ["g3-mul-tens", "몇십 곱하기 몇"],
    "mul-2": ["g3-mul-two", "두 자리 수 × 한 자리 수"],
    "mul-3": ["g3-mul-carry", "올림이 있는 곱셈"],
    "mul-word": ["g3-mul-word", "곱셈 문장제"],
    "divi-1": ["g3-div-tens", "몇십 나누기 몇"],
    "divi-2": ["g3-div-two", "두 자리 수 ÷ 한 자리 수"],
    "divi-word": ["g3-div-word", "나눗셈 문장제"],
    "circ-1": ["g3-circ-radius", "원의 반지름과 지름"],
    "circ-2": ["g3-circ-length", "이어진 원의 길이"],
    "circ-word": ["g3-circ-word", "원 문장제"],
    "frac-1": ["g3-frac-part", "전체의 분수만큼"],
    "frac-2": ["g3-frac-unit", "단위분수와 가분수"],
    "frac-word": ["g3-frac-word", "분수 문장제"],
    "mea-1": ["g3-mea-volume", "들이(L·mL)"],
    "mea-2": ["g3-mea-weight", "무게(kg·g)"],
    "mea-word": ["g3-mea-word", "측정 문장제"],
    "gra-1": ["g3-gra-read", "그림그래프 읽기"],
    "gra-2": ["g3-gra-compare", "그림그래프 비교"],
    "gra-word": ["g3-gra-word", "그래프 문장제"]
  };
  var index = {};
  var built = false;

  function cleanLessonName(title) {
    var t = String(title || "");
    var i = t.indexOf("·");
    if (i >= 0) t = t.slice(i + 1);
    return t.trim() || "개념";
  }
  function unitInfo(house) {
    var u = (window.G3Units || {})[house];
    if (u && u.name) return { id: house, name: u.name };
    return { id: house, name: house };
  }
  function build() {
    if (built) return;
    built = true;
    var units = window.G3Units || {};
    for (var house in units) {
      var u = units[house] || {};
      var ls = u.lessons || [];
      for (var i = 0; i < ls.length; i++) {
        var lid = ls[i].id;
        var ex = G3_EXPLICIT[lid];
        index[lid] = {
          id: ex ? ex[0] : lid,
          name: ex ? ex[1] : cleanLessonName(ls[i].title),
          unitId: house,
          unitName: u.name || house,
          house: house
        };
      }
    }
    // 저학년: 집 하나가 개념 하나
    var low = window.LowData || {};
    var groups = [low.g1 || [], low.g2 || []];
    for (var gi = 0; gi < groups.length; gi++) {
      for (var k = 0; k < groups[gi].length; k++) {
        var h = groups[gi][k];
        index["low:" + h.id] = { id: "low:" + h.id, name: h.name, unitId: h.id, unitName: h.name, house: h.id, low: true };
      }
    }
  }
  function unit(house) {
    build();
    return unitInfo(house);
  }
  function lesson(house, lid) {
    build();
    if (index[lid]) return index[lid];
    var u = unitInfo(house);
    return { id: u.id, name: u.name, unitId: house, unitName: u.name, house: house };
  }
  function forQuestion(house, lid, item) {
    if (item && item.tagId) {
      var found = find(item.tagId);
      return found || { id: item.tagId, name: item.tagName || item.tagId };
    }
    if (String(house || "").indexOf("g1-") === 0 || String(house || "").indexOf("g2-") === 0) {
      return low(house);
    }
    return lesson(house, lid);
  }
  function low(houseId) {
    build();
    var t = index["low:" + houseId];
    if (t) return t;
    return { id: "low:" + houseId, name: houseId, unitId: houseId, unitName: houseId, house: houseId, low: true };
  }
  function find(tagId) {
    build();
    for (var lid in index) if (index[lid].id === tagId) return index[lid];
    return null;
  }
  function allForGrade() {
    build();
    var out = [];
    var seen = {};
    for (var lid in index) {
      var t = index[lid];
      if (seen[t.id]) continue;
      seen[t.id] = 1;
      out.push({ id: t.id, name: t.name, unitId: t.unitId, unitName: t.unitName, house: t.house });
    }
    return out;
  }
  window.G3Tags = {
    unit: unit,
    lesson: lesson,
    forQuestion: forQuestion,
    low: low,
    find: find,
    allForGrade: allForGrade
  };
})();
