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
      var h1 = document.querySelector(".g3head h1");      var eye = document.querySelector(".g3head .eyebrow");
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
        if (h1) h1.textContent = grade + " " + (S === "1" ? "1학기" : "2학기") + " 새싹숲 마을";
        if (eye) eye.textContent = grade + " · " + (S === "1" ? "1학기" : "2학기") + " 저학년 산책";
        return;
      }
      var names = { "3학년": "덧셈과 나눗셈이 열리는 마을", "4학년": "큰 수와 각도를 재는 마을", "5학년": "약수와 분수를 나누는 마을", "6학년": "비율과 부피를 재는 마을" };
      if (S === "1") {
        if (eye) eye.textContent = grade + " 1학기 별숲 마을";
        if (h1) h1.textContent = (names[grade] || "1학기 마을이 열리는 마을");
        if (lead) lead.textContent = "주민을 만들고 마을을 걸어 단원 집에 들어가면 대화로 문제를 풉니다. 1학기 여섯 단원 장소입니다.";
      } else {
        if (eye) eye.textContent = grade + " 2학기 별숲 마을";
      }
      document.title = grade + " " + (S === "1" ? "1학기" : "2학기") + " 별숲 마을 · 별숲 수학마을";
    } catch (e) {}
    try {
      // 마을 상단 내비의 학기 유지 + 학기 전환 버튼 + 1학기 지도 교체
      var path0 = location.pathname || "";
      if (S === "1") {
        var gm = path0.indexOf("grade4") >= 0 ? "g4" : (path0.indexOf("grade5") >= 0 ? "g5" : (path0.indexOf("grade6") >= 0 ? "g6" : (path0.indexOf("grade3") >= 0 ? "g3" : null)));
        if (gm) {
          var mi = document.getElementById("mapimg");
          if (mi) { mi.src = "../assets/img/flow/town-" + gm + "s1.jpg"; mi.alt = gm.replace("g", "") + "학년 1학기 마을 지도"; }
        }
      }
      // 마을 상단 내비의 학기 유지 + 학기 전환 버튼 추가
      var nav = document.querySelector("header.bar nav");
      if (nav) {
        var links = nav.querySelectorAll("a");
        for (var i = 0; i < links.length; i++) {
          var href = links[i].getAttribute("href") || "";
          if (href.indexOf("grade") >= 0 || href.indexOf("lower") >= 0) {
            var sep = (href.indexOf("?") >= 0) ? "&" : "?";
            if (href.indexOf("sem=") < 0) links[i].setAttribute("href", href + sep + "sem=" + S);
          }
        }
        if (!document.getElementById("semSwitchBtn")) {
          var b = document.createElement("a");
          b.id = "semSwitchBtn";
          b.className = "mini-act btn-pulse";
          b.style.marginLeft = "8px";
          var ns = (S === "1") ? "2" : "1";
          var path = location.pathname || "";
          var q = location.search || "";
          var nq = q.replace(/([?&])sem=[12]/, "$1sem=" + ns);
          if (nq.indexOf("sem=") < 0) nq += (nq.indexOf("?") >= 0 ? "&" : "?") + "sem=" + ns;
          b.href = path + nq;
          b.textContent = (S === "1") ? "📚 2학기 마을로 가기" : "📚 1학기 마을로 가기";
          nav.appendChild(b);
        }
      }
    } catch (e2) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", label);
  else label();
})();
