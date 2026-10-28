(function () {
  var toastTimer = null;

  function toast(msg) {
    var t = document.getElementById("toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, 2600);
  }
  window.StarforestToast = toast;

  function copyText(value, okMsg) {
    function fallback() {
      try {
        var ta = document.createElement("textarea");
        ta.value = value;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.top = "-1000px";
        ta.style.left = "-1000px";
        document.body.appendChild(ta);
        ta.select();
        var ok = document.execCommand("copy");
        document.body.removeChild(ta);
        toast(ok ? okMsg : value);
      } catch (e) {
        toast(value);
      }
    }
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(function () { toast(okMsg); }, fallback);
      } else {
        fallback();
      }
    } catch (e) {
      fallback();
    }
  }

  function seasonalSem() {
    try {
      var m = (new Date()).getMonth() + 1;
      return (m >= 2 && m <= 8) ? "1" : "2";
    } catch (e) {
      return "2";
    }
  }

  function demoUrl(n, sem) {
    var base = "";
    try { base = location.href.split("#")[0]; } catch (e) { base = ""; }
    sem = (String(sem) === "1") ? "1" : "2";
    return base + "#grade-" + n + "-s" + sem;
  }

  function villageUrl(n, sem) {
    sem = (String(sem) === "1") ? "1" : "2";
    if (n === 1 || n === 2) return "lower/index.html?grade=" + n + "&sem=" + sem;
    return "grade" + n + "/index.html?sem=" + sem;
  }

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }
  // 교실 도구함 백업/복원 (localStorage 기반)
  try {
    var exp = document.getElementById("exportBackup");
    if (exp) exp.addEventListener("click", function(){
      try {
        if (window.G3Store && window.G3Store.exportData) {
          window.G3Store.exportData();
          toast("데이터를 JSON으로 내보냈어요");
        } else {
          toast("백업 기능을 사용할 수 없어요");
        }
      } catch(e){ toast("내보내기 실패"); }
    });
    var imp = document.getElementById("importBackup");
    if (imp) imp.addEventListener("change", function(){
      var f = imp.files && imp.files[0];
      if (!f) return;
      if (window.G3Store && window.G3Store.importData) {
        window.G3Store.importData(f).then(function(ok){
          if (ok) { toast("가져오기 완료. 새로고침하면 반영돼요"); } else { toast("가져오기 실패"); }
          imp.value = "";
        });
      } else {
        toast("가져오기 기능을 사용할 수 없어요");
        imp.value = "";
      }
    });
  } catch(e){}

  var state = { grade: 3, sem: seasonalSem() };

  function dataFor(n, sem) {
    try {
      return window.StarforestGrades ? window.StarforestGrades.text(n, sem) : null;
    } catch (e) {
      return null;
    }
  }

  function applyState() {
    var item = dataFor(state.grade, state.sem);
    if (!item) return;
    var first = item.places[0];
    var count = item.places.length;

    $$(".grade-cell").forEach(function (cell) {
      var n = parseInt(cell.getAttribute("data-grade"), 10);
      var it = dataFor(n, state.sem);
      var unit = $(".cell-unit", cell);
      if (it && unit) unit.textContent = it.places[0][0] + " · " + it.places[0][1];
      var selected = n === state.grade;
      cell.setAttribute("aria-pressed", selected ? "true" : "false");
      cell.classList.toggle("is-selected", selected);
    });

    $$(".sem-btn").forEach(function (btn) {
      var selected = btn.getAttribute("data-sem") === state.sem;
      btn.setAttribute("aria-pressed", selected ? "true" : "false");
      btn.classList.toggle("is-selected", selected);
    });

    var plan = document.getElementById("planList");
    if (plan) {
      var html = "";
      for (var i = 0; i < item.places.length; i++) {
        html += "<li><span class=\"plan-num\" aria-hidden=\"true\">" + (i + 1) + "</span>"
          + "<span class=\"plan-place\">" + item.places[i][0] + "</span>"
          + "<span class=\"plan-unit\">" + item.places[i][1] + "</span></li>";
      }
      plan.innerHTML = html;
    }

    var planMeta = document.getElementById("planMeta");
    if (planMeta) {
      planMeta.textContent = state.grade + "학년 · " + state.sem + "학기 · " + item.tag + " · " + count + "곳";
    }

    var heroNote = document.getElementById("heroNote");
    if (heroNote) {
      heroNote.textContent = state.grade + "학년 " + state.sem + "학기는 " + first[0] + "에서 시작해요.";
    }

    var longLabel = state.grade + "학년 " + state.sem + "학기 마을 열기";
    $$(".enter-label").forEach(function (el) { el.textContent = longLabel; });
    $$("[data-enter]").forEach(function (a) { a.href = villageUrl(state.grade, state.sem); });
    $$("[data-copy]").forEach(function (btn) {
      btn.setAttribute("aria-label", state.grade + "학년 " + state.sem + "학기 학급 주소 복사");
    });

    var dockGrade = document.getElementById("dockGrade");
    var dockSem = document.getElementById("dockSem");
    if (dockGrade) dockGrade.textContent = state.grade + "학년";
    if (dockSem) dockSem.textContent = state.sem + "학기 · " + item.tag;

    var live = document.getElementById("selectionStatus");
    if (live) {
      live.textContent = state.grade + "학년 " + state.sem + "학기, 단원 장소 " + count + "곳. " + first[0] + "에서 시작합니다.";
    }
  }

  document.addEventListener("click", function (ev) {
    var target = ev.target;
    if (!target || !target.closest) return;

    var cell = target.closest(".grade-cell");
    if (cell) {
      state.grade = parseInt(cell.getAttribute("data-grade"), 10);
      applyState();
      return;
    }

    var sem = target.closest(".sem-btn");
    if (sem) {
      state.sem = sem.getAttribute("data-sem") === "1" ? "1" : "2";
      applyState();
      return;
    }

    var copy = target.closest("[data-copy]");
    if (copy) {
      copyText(demoUrl(state.grade, state.sem), state.grade + "학년 " + state.sem + "학기 학급 주소를 복사했습니다.");
      return;
    }

    var copyAddr = target.closest("[data-copy-address]");
    if (copyAddr) {
      copyText(copyAddr.getAttribute("data-copy-address"), copyAddr.getAttribute("data-copy-label") || "주소를 복사했습니다.");
    }
  });

  function setDate() {
    var d = new Date();
    var dateEl = document.getElementById("boardDate");
    var semEl = document.getElementById("boardSem");
    if (dateEl) dateEl.textContent = d.getFullYear() + ". " + (d.getMonth() + 1) + ". " + d.getDate() + ".";
    if (semEl) semEl.textContent = seasonalSem() + "학기";
    $$(".sem-btn").forEach(function (btn) {
      btn.classList.toggle("is-now", btn.getAttribute("data-sem") === seasonalSem());
    });
  }

  var teacherDialog = document.getElementById("teacherDialog");
  var guideDialog = document.getElementById("guideDialog");
  var historyDialog = document.getElementById("historyDialog");

  function openDialog(d) {
    if (!d) return;
    if (d.showModal) {
      if (!d.open) d.showModal();
    } else {
      d.setAttribute("open", "");
    }
    document.body.classList.add("dialog-open");
  }

  function closeDialog(d) {
    if (!d) return;
    if (d.close) d.close();
    else d.removeAttribute("open");
    document.body.classList.remove("dialog-open");
  }

  $$("dialog").forEach(function (d) {
    d.addEventListener("close", function () {
      document.body.classList.remove("dialog-open");
    });
    d.addEventListener("click", function (ev) {
      if (ev.target === d) closeDialog(d);
    });
  });

  function renderTeacherBox() {
    var box = document.getElementById("teacherLinks");
    if (!box) return;
    box.innerHTML = "";
    for (var g = 1; g <= 6; g++) {
      for (var s = 1; s <= 2; s++) {
        var sem = String(s);
        var row = document.createElement("div");
        row.className = "tbox-row";

        var label = document.createElement("b");
        label.textContent = g + "학년 " + sem + "학기";

        var code = document.createElement("code");
        code.textContent = demoUrl(g, sem);

        var copy = document.createElement("button");
        copy.type = "button";
        copy.className = "tbox-copy";
        copy.setAttribute("data-copy-address", demoUrl(g, sem));
        copy.setAttribute("data-copy-label", g + "학년 " + sem + "학기 학급 주소를 복사했습니다.");
        copy.textContent = "복사";

        var open = document.createElement("a");
        open.className = "tbox-open";
        open.href = villageUrl(g, sem);
        open.target = "_blank";
        open.rel = "noopener";
        open.textContent = "마을 열기";

        row.appendChild(label);
        row.appendChild(code);
        row.appendChild(copy);
        row.appendChild(open);
        box.appendChild(row);
      }
    }
  }

  function renderHistory() {
    var list = document.getElementById("historyList");
    if (!list) return;
    list.innerHTML = "";
    var items = window.StarforestHistory || [];
    for (var i = 0; i < items.length; i++) {
      var wrap = document.createElement("div");
      wrap.className = "history-item";
      var title = document.createElement("b");
      title.textContent = items[i].date + " · " + items[i].title;
      var desc = document.createElement("p");
      desc.textContent = items[i].desc;
      wrap.appendChild(title);
      wrap.appendChild(desc);
      list.appendChild(wrap);
    }
  }

  var openTeacherBox = document.getElementById("openTeacherBox");
  if (openTeacherBox) openTeacherBox.addEventListener("click", function () {
    renderTeacherBox();
    openDialog(teacherDialog);
  });

  var openGuide = document.getElementById("openGuide");
  if (openGuide) openGuide.addEventListener("click", function () { openDialog(guideDialog); });

  var historyBtn = document.getElementById("historyBtn");
  if (historyBtn) historyBtn.addEventListener("click", function () {
    renderHistory();
    openDialog(historyDialog);
  });

  function bindClose(id, d) {
    var el = document.getElementById(id);
    if (el) el.addEventListener("click", function () { closeDialog(d); });
  }
  bindClose("closeTeacher", teacherDialog);
  bindClose("closeTeacherX", teacherDialog);
  bindClose("closeGuide", guideDialog);
  bindClose("closeGuideX", guideDialog);
  bindClose("closeHistory", historyDialog);
  bindClose("closeHistoryX", historyDialog);

  function checkHashGrade() {
    try {
      var h = (location.hash || "").replace("#", "");
      var m = h.match(/^grade-([1-6])(?:-s([12]))?$/);
      if (m) {
        var n = parseInt(m[1], 10);
        var s = (m[2] === "1" || m[2] === "2") ? m[2] : seasonalSem();
        location.href = villageUrl(n, s);
      }
    } catch (e) {}
  }

  var footer = document.querySelector(".site-foot");
  if (footer && "IntersectionObserver" in window) {
    var footerObserver = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        document.body.classList.toggle("footer-in-view", entries[i].isIntersecting);
      }
    }, { threshold: 0.12 });
    footerObserver.observe(footer);
  }

  function init() {
    setDate();
    applyState();
    checkHashGrade();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
  window.addEventListener("hashchange", checkHashGrade);
})();
