(function () {
  function sem() {
    try {
      var q = (location.search || "").match(/[?&]sem=([12])/);
      if (q) return q[1];
      if (window.G3Store && window.G3Store.seasonal) return window.G3Store.seasonal();
    } catch (e) {}
    try {
      var m = (new Date()).getMonth() + 1;
      return (m >= 2 && m <= 8) ? "1" : "2";
    } catch (e2) { return "2"; }
  }
  var S = sem();
  window.STARFOREST_SEM = S;
  try {
    var m = document.querySelector('meta[name="starforest-grade"]');
    if (m) {
      var base = m.getAttribute("content") || "g3";
      base = String(base).replace(/s[12]$/, "");
      m.setAttribute("content", base + "s" + S);
    }
    var m2 = document.querySelector('meta[name="g3"]');
    if (m2) m2.setAttribute("content", S === "1" ? "1d" : "2d");
  } catch (e) {}
  function swapHigh() {
    if (S !== "1") return;
    if (window.G3S1Units) window.G3Units = window.G3S1Units;
    if (window.GRADE_PINS_S1) window.GRADE_PINS = window.GRADE_PINS_S1;
    if (window.GRADE_FRIENDS_S1) window.GRADE_FRIENDS = window.GRADE_FRIENDS_S1;
    if (window.GRADE_PORTRAITS_S1) window.GRADE_PORTRAITS = window.GRADE_PORTRAITS_S1;
    if (window.GRADE_NPCS_S1) window.GRADE_NPCS = window.GRADE_NPCS_S1;
    if (window.GRADE_UNIT_ORDER_S1) window.GRADE_UNIT_ORDER = window.GRADE_UNIT_ORDER_S1;
    if (window.GRADE_QUESTS_S1) window.GRADE_QUESTS = window.GRADE_QUESTS_S1;
  }
  function swapLow() {
    if (S !== "1") return;
    if (window.LowS1Data) window.LowData = window.LowS1Data;
    if (window.LOWGEN_S1) window.LOWGEN = window.LOWGEN_S1;
  }
  swapHigh();
  swapLow();
  function label() {
    try {
      var h1 = document.querySelector(".g3head h1");
      var lead = document.querySelector(".g3head .lead");
      if (!h1) return;
      var path = location.pathname || "";
      var grade = "3학년";
      if (path.indexOf("grade4") >= 0) grade = "4학년";
      else if (path.indexOf("grade5") >= 0) grade = "5학년";
      else if (path.indexOf("grade6") >= 0) grade = "6학년";
      else if (path.indexOf("lower") >= 0) {
        var q = (location.search || "").match(/[?&]grade=([12])/);
        grade = ((q && q[1] === "2") ? "2학년" : "1학년");
        h1.textContent = grade + " " + (S === "1" ? "1학기" : "2학기") + " 새싹숲 마을";
        document.title = grade + " " + (S === "1" ? "1학기" : "2학기") + " 새싹숲 마을 · 별숲 수학마을";
      } else {
        var names = { "3학년": "덧셈과 나눗셈이 열리는 마을", "4학년": "큰 수와 각도를 재는 마을", "5학년": "약수와 분수를 나누는 마을", "6학년": "비율과 부피를 재는 마을" };
        if (S === "1") {
          h1.textContent = (names[grade] || "1학기 마을이 열리는 마을");
          if (lead) lead.textContent = "주민을 만들고 마을을 걸어 단원 집에 들어가면 대화로 문제를 풉니다. 1학기 여섯 단원 장소입니다.";
          document.title = grade + " 1학기 별숲 마을 · 별숲 수학마을";
        } else {
          document.title = grade + " 2학기 별숲 마을 · 별숲 수학마을";
        }
      }
    } catch (e) {}
    try {
      var path0 = location.pathname || "";
      if (S === "1") {
        var gm = path0.indexOf("grade4") >= 0 ? "g4" : (path0.indexOf("grade5") >= 0 ? "g5" : (path0.indexOf("grade6") >= 0 ? "g6" : (path0.indexOf("grade3") >= 0 ? "g3" : null)));
        if (gm) {
          var mi = document.getElementById("mapimg");
          if (mi) { mi.src = "../assets/img/flow/town-" + gm + "s1.jpg"; mi.alt = gm.replace("g", "") + "학년 1학기 마을 지도"; }
        }
      }
      var links = document.querySelectorAll("#villageGradeLinks a[data-grade-link]");
      var curGrade = null, curIsLower = false;
      try {
        var gq = (location.search || "").match(/[?&]grade=([12])/);
        if (path0.indexOf("lower") >= 0) { curIsLower = true; curGrade = gq ? gq[1] : "1"; }
        else if (path0.indexOf("grade3") >= 0) curGrade = "3";
        else if (path0.indexOf("grade4") >= 0) curGrade = "4";
        else if (path0.indexOf("grade5") >= 0) curGrade = "5";
        else if (path0.indexOf("grade6") >= 0) curGrade = "6";
      } catch (e3) {}
      for (var i = 0; i < links.length; i++) {
        var href = links[i].getAttribute("href") || "";
        var sep = (href.indexOf("?") >= 0) ? "&" : "?";
        if (href.indexOf("sem=") < 0) links[i].setAttribute("href", href + sep + "sem=" + S);
        if (curGrade) {
          var isCur;
          if (curIsLower) {
            isCur = href.indexOf("grade=" + curGrade) >= 0
              && href.indexOf("grade3") < 0 && href.indexOf("grade4") < 0
              && href.indexOf("grade5") < 0 && href.indexOf("grade6") < 0;
          } else {
            isCur = href.indexOf("grade" + curGrade + "/") >= 0;
          }
          if (isCur) links[i].setAttribute("aria-current", "page");
          else links[i].removeAttribute("aria-current");
        }
      }
      var slot = document.getElementById("semSwitchSlot");
      if (slot && !document.getElementById("semSwitchBtn")) {
        var path = location.pathname || "";
        var q = location.search || "";
        for (var ss = 1; ss <= 2; ss++) {
          var ssv = String(ss);
          if (ssv === S) {
            var current = document.createElement("span");
            current.className = "village-sem-choice is-current";
            current.setAttribute("aria-current", "page");
            current.textContent = ssv + "학기";
            slot.appendChild(current);
          } else {
            var nq = q.replace(/([?&])sem=[12]/, "$1sem=" + ssv);
            if (nq.indexOf("sem=") < 0) nq += (nq.indexOf("?") >= 0 ? "&" : "?") + "sem=" + ssv;
            var next = document.createElement("a");
            next.id = "semSwitchBtn";
            next.className = "village-sem-choice";
            next.href = path + nq;
            next.textContent = ssv + "학기";
            next.setAttribute("aria-label", ssv + "학기 마을로 가기");
            slot.appendChild(next);
          }
        }
      }
    } catch (e2) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", label);
  else label();
})();
