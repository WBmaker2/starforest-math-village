(function () {
  var FEEDBACK_KEY = "starforest-feedback";
  function toast(msg) {
    var t = document.getElementById("toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    setTimeout(function () { t.classList.remove("show"); }, 2200);
  }
  function copyText(value, okMsg) {
    function done(m) { toast(m); }
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(function () { done(okMsg); }, function () { done(value); });
      } else { done(value); }
    } catch (e) { done(value); }
  }
  function demoUrl(n) {
    var base = "";
    try { base = location.href.split("#")[0]; } catch (e) { base = ""; }
    return base + "#grade-" + n;
  }
  var gradeDialog = document.getElementById("gradeDialog");
  var gradeTitle = document.getElementById("gradeTitle");
  var gradeBody = document.getElementById("gradeBody");
  var tState = { grade: 1, idx: 0 };
  function renderTrial() {
    var box = document.getElementById("gradeTrialBox");
    if (!box) return;
    var tr = window.StarforestGrades && window.StarforestGrades.trials && window.StarforestGrades.trials[tState.grade];
    if (!tr || !tr.list || !tr.list.length) { box.innerHTML = ""; return; }
    var qObj = tr.list[tState.idx % tr.list.length];
    var html = "<div class='trial-card'><div class='trial-top'><span class='tag'>" + tr.unit + "</span><small>체험 " + ((tState.idx % tr.list.length) + 1) + "/" + tr.list.length + "</small></div>";
    html += "<div class='trial-svg'>" + qObj.svg + "</div>";
    html += "<p class='trial-q'>" + qObj.q + "</p>";
    html += "<div class='trial-choices " + (tr.mode === "low" ? "low-mode" : "") + "'>";
    for (var i = 0; i < qObj.choices.length; i++) {
      html += "<button type='button' class='trial-choice btn-pulse' data-tchoice='" + qObj.choices[i] + "'>" + qObj.choices[i] + "</button>";
    }
    html += "</div><p id='trialFb' class='trial-fb' aria-live='polite'></p></div>";
    box.innerHTML = html;
  }
  function openGrade(n) {
    tState.grade = n; tState.idx = 0;
    var item = null;
    try { item = window.StarforestGrades.text(n); } catch (e) { item = null; }
    if (gradeTitle) gradeTitle.textContent = n + "학년 마을 · 수업 체험";
    if (gradeBody) gradeBody.textContent = item ? item.demo : "별숲 마을 입구입니다.";
    var trialBox = document.getElementById("gradeTrialBox");
    if (!trialBox && gradeBody) {
      trialBox = document.createElement("div");
      trialBox.id = "gradeTrialBox";
      gradeBody.parentNode.insertBefore(trialBox, gradeBody.nextSibling);
    }
    renderTrial();
    var enter = document.getElementById("gradeEnter");
    if (!enter && gradeBody) {
      enter = document.createElement("a");
      enter.id = "gradeEnter";
      enter.className = "go btn-pulse";
      enter.style.marginTop = "12px";
      gradeBody.parentNode.insertBefore(enter, trialBox ? trialBox.nextSibling : gradeBody.nextSibling);
    }
    if (enter) {
      enter.style.display = "inline-flex";
      if (n === 1 || n === 2) {
        enter.href = "lower/index.html";
        enter.textContent = "1·2학년 새싹숲 입장하기 (산책·큰 단추)";
      } else {
        enter.href = "grade3/index.html";
        enter.textContent = n === 3 ? "3학년 마을 입장하기 (전체 산책·6단원)" : "3학년 별숲 마을(전체 산책·아바타)도 둘러보기";
      }
    }
    if (gradeDialog && gradeDialog.showModal) gradeDialog.showModal();
    else toast(n + "학년 마을 안내입니다.");
  }
  document.addEventListener("click", function (ev) {
    var tc = ev.target.closest ? ev.target.closest("[data-tchoice]") : null;
    if (tc) {
      var tr = window.StarforestGrades && window.StarforestGrades.trials && window.StarforestGrades.trials[tState.grade];
      if (!tr) return;
      var qObj = tr.list[tState.idx % tr.list.length];
      var pick = tc.getAttribute("data-tchoice");
      var fb = document.getElementById("trialFb");
      if (pick === qObj.a) {
        if (fb) fb.innerHTML = "<b>정답입니다! ★+10</b> · " + qObj.exp + (tr.list.length > 1 ? " <button type='button' class='trial-next btn-pulse' data-tnext='1'>다음 체험 문제 →</button>" : "");
      } else {
        if (fb) fb.textContent = "다시 한번 그림을 살펴볼까요? (" + qObj.exp + ")";
      }
      return;
    }
    var tn = ev.target.closest ? ev.target.closest("[data-tnext]") : null;
    if (tn) {
      tState.idx++;
      renderTrial();
      return;
    }
    var b = ev.target.closest ? ev.target.closest("[data-grade]") : null;
    if (!b) return;
    if (b.classList.contains("copy-link")) {
      var n = parseInt(b.getAttribute("data-grade"), 10);
      copyText(demoUrl(n), n + "학년 학급 주소를 복사했습니다.");
    } else {
      var m = parseInt(b.getAttribute("data-grade"), 10);
      openGrade(m);
    }
  });
  var guide = document.getElementById("guideDialog");
  var openGuide = document.getElementById("openGuide");
  if (openGuide) openGuide.addEventListener("click", function () {
    if (guide && guide.showModal) guide.showModal(); else toast("이용 흐름 안내입니다.");
  });
  var closeGuide = document.getElementById("closeGuide");
  if (closeGuide) closeGuide.addEventListener("click", function () { if (guide) guide.close(); });
  var closeGrade = document.getElementById("closeGrade");
  if (closeGrade) closeGrade.addEventListener("click", function () { if (gradeDialog) gradeDialog.close(); });
  var historyDialog = document.getElementById("historyDialog");
  var historyList = document.getElementById("historyList");
  function renderHistory() {
    if (!historyList) return;
    historyList.innerHTML = "";
    var items = window.StarforestHistory || [];
    for (var i = 0; i < items.length; i++) {
      var d = document.createElement("div");
      var h = document.createElement("b");
      h.textContent = items[i].date + " · " + items[i].title;
      var p = document.createElement("p");
      p.textContent = items[i].desc;
      p.style.margin = "6px 0 0";
      d.appendChild(h);
      d.appendChild(p);
      historyList.appendChild(d);
    }
  }
  renderHistory();
  var historyBtn = document.getElementById("historyBtn");
  if (historyBtn) historyBtn.addEventListener("click", function () {
    renderHistory();
    if (historyDialog && historyDialog.showModal) historyDialog.showModal();
  });
  var closeHistory = document.getElementById("closeHistory");
  if (closeHistory) closeHistory.addEventListener("click", function () { if (historyDialog) historyDialog.close(); });
  function readFeedback() {
    try {
      var arr = JSON.parse(localStorage.getItem(FEEDBACK_KEY) || "[]");
      if (arr.length) return arr;
      var legacy = JSON.parse(localStorage.getItem("math-walk-demo-feedback") || "[]");
      return legacy;
    } catch (e) { return []; }
  }
  var copyMail = document.getElementById("copyMail");
  if (copyMail) copyMail.addEventListener("click", function () {
    copyText("별숲 수학마을 교실 의견함에 의견을 남겨 주세요.", "안내 문구를 복사했습니다.");
  });
  var teacherDialog = document.getElementById("teacherDialog");
  function renderTeacherBox() {
    var links = document.getElementById("teacherLinks");
    if (links) {
      var html = "";
      for (var g = 1; g <= 6; g++) {
        html += "<div class='tbox-row'><b>" + g + "학년</b><span class='mail'>" + demoUrl(g) + "</span><button type='button' class='copy' data-copy-grade='" + g + "'>복사</button></div>";
      }
      html += "<div class='tbox-row'><b>1·2학년 마을</b><span class='mail'>lower/index.html</span><button type='button' class='copy' data-copy-low='1'>복사</button></div>";
      html += "<div class='tbox-row'><b>3학년 전체마을</b><span class='mail'>grade3/index.html</span><button type='button' class='copy' data-copy-g3='1'>복사</button></div>";
      links.innerHTML = html;
    }
    var fbBox = document.getElementById("teacherFeedback");
    if (fbBox) {
      var arr = readFeedback();
      if (!arr.length) fbBox.innerHTML = "<p class='form-note'>아직 저장된 의견이 없습니다. 아래 의견함에 남기면 여기에서 모아볼 수 있습니다.</p>";
      else {
        var fh = "";
        for (var i = arr.length - 1; i >= 0; i--) {
          var at = "";
          try { var dt = new Date(arr[i].at); at = (dt.getMonth() + 1) + "/" + dt.getDate() + " " + dt.getHours() + ":" + String(dt.getMinutes()).padStart(2, "0"); } catch (e2) {}
          fh += "<div class='tbox-fbitem'><b>[" + (arr[i].grade || "") + "]</b> " + (arr[i].text || "") + " <small>" + at + "</small></div>";
        }
        fbBox.innerHTML = fh;
      }
    }
  }
  var openTeacherBox = document.getElementById("openTeacherBox");
  if (openTeacherBox) openTeacherBox.addEventListener("click", function () {
    renderTeacherBox();
    if (teacherDialog && teacherDialog.showModal) teacherDialog.showModal();
    else toast("선생님 교실 도구함입니다.");
  });
  var closeTeacher = document.getElementById("closeTeacher");
  if (closeTeacher) closeTeacher.addEventListener("click", function () { if (teacherDialog) teacherDialog.close(); });
  var clearFeedback = document.getElementById("clearFeedback");
  if (clearFeedback) clearFeedback.addEventListener("click", function () {
    try { localStorage.removeItem(FEEDBACK_KEY); localStorage.removeItem("math-walk-demo-feedback"); } catch (e) {}
    renderTeacherBox();
    toast("저장된 의견을 모두 비웠습니다.");
  });
  document.addEventListener("click", function (ev2) {
    var cg = ev2.target.closest ? ev2.target.closest("[data-copy-grade],[data-copy-g3],[data-copy-low]") : null;
    if (!cg) return;
    if (cg.hasAttribute("data-copy-grade")) {
      var n = parseInt(cg.getAttribute("data-copy-grade"), 10);
      copyText(demoUrl(n), n + "학년 주소를 복사했습니다.");
    } else if (cg.hasAttribute("data-copy-low")) {
      copyText("lower/index.html", "1·2학년 마을 주소를 복사했습니다.");
    } else {
      copyText("grade3/index.html", "3학년 전체마을 주소를 복사했습니다.");
    }
  });
  var form = document.getElementById("demoForm");
  if (form) form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var g = document.getElementById("demoGrade");
    var tx = document.getElementById("demoText");
    var note = document.getElementById("formNote");
    var gv = g ? g.value : "";
    var tv = tx ? tx.value.trim() : "";
    if (!tv) { if (note) note.textContent = "의견을 한 줄 이상 적어 주세요."; return; }
    try {
      var arr = JSON.parse(localStorage.getItem(FEEDBACK_KEY) || "[]");
      arr.push({ grade: gv, text: tv, at: new Date().toISOString() });
      localStorage.setItem(FEEDBACK_KEY, JSON.stringify(arr));
    } catch (e) {}
    if (note) note.textContent = gv + " 의견이 이 브라우저에 저장되었습니다. 고맙습니다.";
    if (tx) tx.value = "";
    toast("교실 의견이 저장되었습니다.");
  });
  function checkHashGrade() {
    try {
      var h = (location.hash || "").replace("#", "");
      var m = h.match(/^grade-([1-6])$/);
      if (m) {
        var n = parseInt(m[1], 10);
        openGrade(n);
        var g = document.getElementById("grades");
        if (g) g.scrollIntoView({ behavior: "smooth" });
      }
    } catch (e) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", checkHashGrade);
  else checkHashGrade();
  window.addEventListener("hashchange", checkHashGrade);
  try {
    var blocks = document.querySelectorAll(".rise");
    if (!("IntersectionObserver" in window)) {
      for (var i = 0; i < blocks.length; i++) blocks[i].classList.add("in");
    } else {
      var io = new IntersectionObserver(function (entries) {
        for (var k = 0; k < entries.length; k++) {
          if (entries[k].isIntersecting) { entries[k].target.classList.add("in"); io.unobserve(entries[k].target); }
        }
      }, { threshold: 0.15 });
      for (var j = 0; j < blocks.length; j++) io.observe(blocks[j]);
    }
  } catch (e) {}
})();
