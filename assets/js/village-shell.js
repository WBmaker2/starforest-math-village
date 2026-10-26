(function () {
  var body = document.body;
  if (!body || !body.hasAttribute("data-village")) return;

  var path = location.pathname || "";
  var isLower = /\/lower\//.test(path) || /lower\/index\.html$/.test(path);
  var qGrade = (location.search || "").match(/[?&]grade=([12])/);
  var pathGrade = path.match(/grade([1-6])/);
  var grade = pathGrade ? pathGrade[1] : (isLower ? ((qGrade && qGrade[1] === "2") ? "2" : "1") : "3");
  var isLow = Number(grade) <= 2;
  var sem = window.STARFOREST_SEM || "2";
  body.setAttribute("data-grade", "g" + grade);
  body.setAttribute("data-sem", sem);

  var pinBypass = null;
  var sheetPin = null;
  var groupOpen = false;
  var frOpen = false;
  var frFinished = false;
  var frStep = 1;
  var frName = "";
  var selectedLook = 0;
  var mapRefreshTimer = null;
  var todoObserved = false;
  var dock = null;
  var groupBar = null;
  var groupLabel = null;
  var primary = null;
  var primaryText = null;
  var primaryKicker = null;
  var sheet = null;

  var LOOKS = [
    {
      label: "산책 모자",
      avatar: { hairImg: "hair-long", face: 0, color: "top-stripe", bottom: "bot-jeans", shoe: "shoe-sneakers", hat: "none", acc: "none" }
    },
    {
      label: "별빛 모험가",
      avatar: { hairImg: "hair-twintails", face: 1, color: "top-hoodie", bottom: "bot-skirt", shoe: "shoe-rainboots", hat: "hat-straw", acc: "none" }
    },
    {
      label: "숲속 친구",
      avatar: { hairImg: "hair-spiky", face: 2, color: "top-raincoat", bottom: "bot-shorts", shoe: "shoe-boots", hat: "hat-cap", acc: "none" }
    }
  ];

  var GRADE_GROUPS = {
    avatar: ["avatar", "gachaSec"],
    farm: ["farm", "playSec"],
    quest: ["deco", "quests", "collect"],
    note: ["note"]
  };
  var LOW_GROUPS = {
    avatar: ["lowAvatar"],
    progress: ["lowProgress"],
    play: ["lowPlay"]
  };
  var GROUP_TITLES = {
    avatar: "내 주민",
    farm: "텃밭·부엌",
    quest: "꾸미기·부탁",
    note: "도감·기록",
    progress: "탐험 현황",
    play: "새싹 놀이터",
    map: "마을 산책"
  };

  function byId(id) { return document.getElementById(id); }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function groups() { return isLow ? LOW_GROUPS : GRADE_GROUPS; }

  function store() {
    try { return window.G3Store ? window.G3Store.load() : null; } catch (e) { return null; }
  }
  function isFirstRun() {
    var d = store();
    return !(d && d.avatar && d.avatar.name);
  }
  function toast(msg) {
    if (window.G3UI && window.G3UI.toast) window.G3UI.toast(msg);
  }

  var SEALS = {
    "1": "<svg viewBox=\"0 0 48 48\" aria-hidden=\"true\"><path d=\"M24 42c0-12 8-19 20-20-1 12-8 20-20 20Z\"/><path d=\"M24 42c4-8 9-13 16-16\"/></svg>",
    "2": "<svg viewBox=\"0 0 48 48\" aria-hidden=\"true\"><circle cx=\"24\" cy=\"24\" r=\"15\"/><path d=\"M24 13v11l8 5\"/><path d=\"M24 7v2M24 39v2M7 24h2M39 24h2\"/></svg>"
  };
  function syncBarHeight() {
    var h = document.querySelector(".village-bar");
    if (h) document.body.style.setProperty("--village-bar-h", h.offsetHeight + "px");
  }
  function initHeaderMeta() {
    var label = grade + "학년 " + (isLow ? "새싹숲" : "별숲");
    var seal = document.querySelector(".village-seal");
    if (seal && isLow && SEALS[grade]) seal.innerHTML = SEALS[grade];
    var el = byId("villageGradeLabel");
    if (el) el.textContent = label;
    var chips = byId("villageSignChips");
    if (chips) {
      chips.innerHTML = "<span class=\"village-chip\">" + label + "</span>"
        + "<span class=\"village-chip\">" + sem + "학기</span>"
        + "<span class=\"village-chip\">" + (isLow ? "큰 그림 산책" : "단원 장소 6곳") + "</span>";
    }
    syncBarHeight();
    var note = $(".village-panel-note");
    if (note) note.textContent = "학기는 오른쪽 단추에서 바꿀 수 있어요. 지금은 " + sem + "학기예요.";
    var links = $$("#villageGradeLinks a[data-grade-link]");
    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute("href") || "";
      var current = isLow
        ? href.indexOf("grade=" + grade) >= 0 && href.indexOf("grade3") < 0 && href.indexOf("grade4") < 0 && href.indexOf("grade5") < 0 && href.indexOf("grade6") < 0
        : href.indexOf("grade" + grade + "/") >= 0;
      if (current) links[i].setAttribute("aria-current", "page");
      else links[i].removeAttribute("aria-current");
    }
  }

  function initHeaderActions() {
    document.addEventListener("click", function (e) {
      var open = $$(".village-bar details[open]");
      for (var i = 0; i < open.length; i++) {
        var d = open[i];
        if (!d.contains(e.target)) d.open = false;
        else if (e.target.closest("a, button") && !e.target.closest("summary")) d.open = false;
      }
    });
    var install = byId("villageInstallBtn");
    if (install) install.addEventListener("click", function () {
      if (window.StarforestPWA && window.StarforestPWA.install()) return;
      toast("브라우저 메뉴에서 '홈 화면에 추가'를 눌러 주세요.");
    });
  }

  function moveControls() {
    var slot = byId("villageSettingsSlot");
    if (!slot) return;
    ["sfxBtn", "boardBtn", "historyBtn"].forEach(function (id) {
      var el = byId(id);
      if (el && el.parentNode !== slot) slot.appendChild(el);
    });
  }

  function syncHubMode() {
    body.classList.toggle("village-hub-mode", groupOpen);
  }

  function setActive(id) {
    $$(".hub-tile").forEach(function (b) {
      b.classList.toggle("is-active", b.getAttribute("data-hub") === id);
    });
    if (dock) {
      $$("button", dock).forEach(function (b) {
        b.classList.toggle("is-active", b.getAttribute("data-hub") === id);
      });
    }
  }

  function showGroup(id, scroll) {
    var defs = groups();
    var ids = defs[id] || [];
    var sections = $$("main.wrap section[data-village-group]");
    var isMap = !ids.length;
    if (isMap) {
      sections.forEach(function (s) {
        s.hidden = true;
        s.classList.remove("is-open");
      });
      groupOpen = false;
      body.classList.remove("village-group-open");
      if (groupBar) groupBar.hidden = true;
      setActive("map");
      syncHubMode();
      if (scroll) {
        var map = byId(isLow ? "lowVillage" : "village");
        if (map) map.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return;
    }
    sections.forEach(function (s) {
      var on = ids.indexOf(s.id) >= 0;
      s.hidden = !on;
      s.classList.toggle("is-open", on);
    });
    groupOpen = true;
    body.classList.add("village-group-open");
    if (groupBar) {
      groupBar.hidden = false;
      if (groupLabel) groupLabel.textContent = GROUP_TITLES[id] || id;
    }
    setActive(id);
    syncHubMode();
    refreshHub();
    if (scroll) {
      var first = byId(ids[0]);
      if (first) first.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function initHub() {
    var hub = byId("villageHub");
    if (!hub) return;
    groupBar = byId("villageGroupBar");
    groupLabel = byId("villageGroupLabel");
    var back = byId("villageBack");
    if (back) back.addEventListener("click", function () { showGroup("map", true); });
    $$(".hub-tile", hub).forEach(function (b) {
      b.addEventListener("click", function () {
        showGroup(b.getAttribute("data-hub"), true);
      });
    });

    var items = isLow
      ? [
          ["map", "지도", "마을"],
          ["avatar", "주민", "내 모습"],
          ["progress", "탐험", "현황"],
          ["play", "놀이", "펫"]
        ]
      : [
          ["map", "지도", "마을"],
          ["avatar", "주민", "꾸미기"],
          ["farm", "텃밭", "부엌"],
          ["quest", "꾸미기", "부탁"],
          ["note", "기록", "도감"]
        ];
    dock = document.createElement("nav");
    dock.id = "villageDock";
    dock.className = "village-dock";
    dock.setAttribute("aria-label", "마을 살림 바로가기");
    for (var i = 0; i < items.length; i++) {
      (function (item) {
        var b = document.createElement("button");
        b.type = "button";
        b.setAttribute("data-hub", item[0]);
        b.innerHTML = "<b>" + item[1] + "</b><span>" + item[2] + "</span>";
        b.addEventListener("click", function () { showGroup(item[0], true); });
        dock.appendChild(b);
      })(items[i]);
    }
    body.appendChild(dock);

    $$("main.wrap section[data-village-group]").forEach(function (s) {
      s.hidden = true;
      s.classList.remove("is-open");
    });
    if (groupBar) groupBar.hidden = true;
    setActive("map");

    var hash = (location.hash || "").replace("#", "");
    if (hash) {
      var target = byId(hash);
      if (target) {
        var section = target.closest("[data-village-group]");
        if (section) {
          showGroup(section.getAttribute("data-village-group"), false);
          setTimeout(function () { target.scrollIntoView({ behavior: "auto", block: "start" }); }, 60);
        } else if (hash === "village" || hash === "lowVillage") {
          showGroup("map", false);
        }
      }
    }
    refreshHub();
  }

  function setStatus(id, text) {
    var el = byId(id);
    if (el) el.textContent = text || "";
  }

  function refreshHub() {
    if (isLow) {
      var nm = byId("lowAvName") ? byId("lowAvName").textContent.trim() : "";
      setStatus("hubAvatarStatus", isFirstRun() ? "이름 짓기" : (nm || "내 주민"));
      var prog = byId("lowProgText") ? byId("lowProgText").textContent : "";
      var pm = prog.match(/푼 문제\s*\d+\s*\/\s*\d+/);
      setStatus("hubProgressStatus", pm ? pm[0] : "탐험 현황");
      setStatus("hubPlayStatus", "펫 · 보물상자");
      setStatus("hubMapStatus", "지도로 돌아가기");
    } else {
      var name = byId("avName") ? byId("avName").value.trim() : "";
      setStatus("hubAvatarStatus", isFirstRun() ? "이름 짓기" : (name ? name + " 주민" : "내 주민"));
      var seeds = byId("seedCount") ? byId("seedCount").textContent.trim() : "";
      setStatus("hubFarmStatus", seeds || "씨앗 0");
      var cards = byId("cardCount") ? byId("cardCount").textContent.trim() : "";
      setStatus("hubQuestStatus", cards || "도감 0/10");
      setStatus("hubNoteStatus", "일지 · 주민증");
    }
  }

  function pinName(pin) {
    if (!pin) return "";
    var c = pin.cloneNode(true);
    var junk = c.querySelectorAll(".lv-badge, .pin-flag");
    for (var i = 0; i < junk.length; i++) junk[i].remove();
    return (c.textContent || "").replace(/\s+/g, " ").trim();
  }

  function firstLowPin() {
    var pins = $$("#lowMapwrap .low-pin");
    for (var i = 0; i < pins.length; i++) {
      if (pins[i].getAttribute("data-village-state") !== "max") return pins[i];
    }
    return null;
  }

  function setPrimary() {
    if (!primary || !primaryText) return;
    var text = "";
    var kicker = "오늘의 길";
    var act = "none";
    if (isFirstRun()) {
      kicker = "처음 오셨네요";
      text = "주민 만들고 마을로 들어가기";
      act = "first";
    } else if (byId(isLow ? "lowEnter" : "enterBtn") && !byId(isLow ? "lowEnter" : "enterBtn").hidden) {
      kicker = "지금";
      text = (byId(isLow ? "lowEnter" : "enterBtn").textContent || "들어가기").trim();
      act = "enter";
    } else if (isLow) {
      var lp = firstLowPin();
      if (lp) {
        kicker = "오늘의 집";
        text = pinName(lp) + " 들어가기";
        act = "low-pin";
      } else {
        kicker = "오늘의 놀이";
        text = "새싹 놀이터 열기";
        act = "low-play";
      }
    } else {
      var todo = byId("todoCompass");
      if (todo) {
        var b = todo.querySelector("b");
        text = (b ? b.textContent : todo.textContent || "").replace(/\s*→\s*$/, "").trim();
        if (text) {
          kicker = "오늘의 길";
          act = "todo";
        }
      }
      if (!text) {
        kicker = "마을 산책";
        text = "지도를 눌러 오늘의 집을 찾아보세요";
      }
    }
    if (primaryKicker) primaryKicker.textContent = kicker;
    primaryText.textContent = text;
    primary.setAttribute("aria-label", text);
    primary.setAttribute("data-village-act", act);
  }

  function openGroupForSection(id) {
    if (isLow) {
      if (id === "lowAvatar") return showGroup("avatar", false);
      if (id === "lowProgress") return showGroup("progress", false);
      if (id === "lowPlay") return showGroup("play", false);
      return false;
    }
    if (id === "avatar" || id === "gachaSec") return showGroup("avatar", false);
    if (id === "farm" || id === "playSec") return showGroup("farm", false);
    if (id === "deco" || id === "quests" || id === "collect") return showGroup("quest", false);
    if (id === "note") return showGroup("note", false);
    return false;
  }

  function decoratePins() {
    var map = byId(isLow ? "lowMapwrap" : "mapwrap");
    if (!map) return;
    var pins = $$("[data-pin], [data-lowpin]", map);
    var nextId = "";
    var todo = byId("todoCompass");
    if (!isLow && todo) {
      var act = todo.getAttribute("data-todo-act") || "";
      if (act.indexOf("pin:") === 0) nextId = act.slice(4);
    }
    var firstOpenLow = null;
    for (var i = 0; i < pins.length; i++) {
      var pin = pins[i];
      var id = pin.getAttribute("data-pin") || pin.getAttribute("data-lowpin") || "";
      var badge = pin.querySelector(".lv-badge");
      var raw = badge ? (badge.textContent || "").trim() : "";
      var state = "new";
      var label = "";
      var prog = raw.match(/(\d+)\s*\/\s*(\d+)/);
      if (raw.indexOf("마스터") >= 0 || raw.indexOf("꽃핀") >= 0) {
        state = "max";
        label = isLow ? "완료" : "마스터";
      } else if (raw.indexOf("성장중") >= 0 || raw.indexOf("자라는") >= 0) {
        state = "ing";
        label = prog ? prog[1] + "/" + prog[2] : "진행 중";
      }
      if (pin.getAttribute("data-village-state") !== state) pin.setAttribute("data-village-state", state);
      if (badge && badge.textContent !== label) badge.textContent = label;
      if (!isLow && nextId && id === nextId) {
        if (!pin.classList.contains("is-next")) pin.classList.add("is-next");
      } else if (pin.classList.contains("is-next")) {
        pin.classList.remove("is-next");
      }
      if (isLow && !firstOpenLow && state !== "max") firstOpenLow = pin;
    }
    if (isLow && firstOpenLow && !firstOpenLow.classList.contains("is-next")) firstOpenLow.classList.add("is-next");
    if (isLow && !firstOpenLow) {
      var any = $$("#lowMapwrap .low-pin");
      for (var j = 0; j < any.length; j++) {
        if (any[j].classList.contains("is-next")) any[j].classList.remove("is-next");
      }
    }
  }

  function refreshMap() {
    if (mapRefreshTimer) {
      clearTimeout(mapRefreshTimer);
      mapRefreshTimer = null;
    }
    var todo = byId("todoCompass");
    if (todo && !todoObserved) {
      todoObserved = true;
      var to = new MutationObserver(scheduleMapRefresh);
      to.observe(todo, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["data-todo-act", "class"] });
      todo.addEventListener("click", function () {
        var a = todo.getAttribute("data-todo-act") || "";
        if (a.indexOf("scroll:") === 0) openGroupForSection(a.slice(7));
      });
    }
    decoratePins();
    setPrimary();
  }

  function scheduleMapRefresh() {
    if (mapRefreshTimer) return;
    mapRefreshTimer = setTimeout(refreshMap, 40);
  }

  function initMap() {
    var map = byId(isLow ? "lowMapwrap" : "mapwrap");
    if (!map) return;
    primary = byId("villagePrimary");
    primaryText = byId("villagePrimaryText");
    primaryKicker = byId("villagePrimaryKicker");
    if (!primary || !primaryText) return;

    var mapImg = map.querySelector("img");
    if (mapImg) {
      if (!mapImg.complete) map.classList.add("map-loading");
      mapImg.addEventListener("load", function () { map.classList.remove("map-loading"); });
    }
    var mo = new MutationObserver(scheduleMapRefresh);
    mo.observe(map, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "hidden", "data-todo-act", "data-near", "data-pin", "data-lowpin"]
    });
    var enter = byId(isLow ? "lowEnter" : "enterBtn");
    if (enter) {
      var eo = new MutationObserver(scheduleMapRefresh);
      eo.observe(enter, { attributes: true, attributeFilter: ["hidden", "data-near", "class"] });
    }

    primary.addEventListener("click", function () {
      if (isFirstRun()) {
        openFirstRun(true);
        return;
      }
      var act = primary.getAttribute("data-village-act") || "";
      if (act === "enter") {
        var e = byId(isLow ? "lowEnter" : "enterBtn");
        if (e) e.click();
        return;
      }
      if (isLow) {
        var lp = firstLowPin();
        if (lp) {
          enterPinDirect(lp);
          return;
        }
        showGroup("play", true);
        return;
      }
      var todo = byId("todoCompass");
      if (!todo) {
        showGroup("farm", true);
        return;
      }
      var ta = todo.getAttribute("data-todo-act") || "";
      if (ta.indexOf("scroll:") === 0) openGroupForSection(ta.slice(7));
      todo.click();
    });

    document.addEventListener("click", function (e) {
      var pin = e.target.closest ? e.target.closest("[data-pin], [data-lowpin]") : null;
      if (!pin) return;
      if (pinBypass === pin) {
        pinBypass = null;
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      openPlaceSheet(pin);
    }, true);

    if (isLow) {
      var mapHead = document.querySelector("#lowVillage .village-map-head");
      if (mapHead && !byId("villageSpeak")) {
        var sp = document.createElement("button");
        sp.id = "villageSpeak";
        sp.type = "button";
        sp.className = "village-speak-btn";
        sp.setAttribute("aria-label", "오늘의 집 읽어주기");
        sp.innerHTML = "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M4 9h4l5-4v14l-5-4H4z\"/><path d=\"M16 8a5 5 0 0 1 0 8\"/></svg>";
        sp.addEventListener("click", function () {
          var t = primaryText ? primaryText.textContent.trim() : "";
          if (window.G3UI && window.G3UI.speak && t) window.G3UI.speak(t);
        });
        mapHead.appendChild(sp);
      }
    }
    refreshMap();
    window.addEventListener("resize", function () { syncBarHeight(); });
    setTimeout(syncBarHeight, 300);
    setTimeout(refreshMap, 250);
    setTimeout(refreshMap, 800);
    setTimeout(refreshMap, 1600);
  }

  function initTimeChip() {
    var card = byId("village");
    var chip = byId("villageTimeChip");
    var tbar = byId("mapTimeBar");
    if (!card || !chip || !tbar) return;
    function clean() {
      $$("[data-maptime]", tbar).forEach(function (b) {
        var t = b.getAttribute("data-maptime");
        b.textContent = t === "day" ? "낮" : (t === "sunset" ? "노을" : "밤");
      });
    }
    function sync() {
      var sel = tbar.querySelector("[data-maptime].sel") || tbar.querySelector("[data-maptime]");
      var label = sel ? sel.textContent.trim() : "낮";
      chip.textContent = label;
      chip.setAttribute("aria-label", "시간대: " + label + ". 눌러서 바꾸기");
    }
    clean();
    sync();
    chip.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = card.classList.toggle("time-open");
      chip.setAttribute("aria-expanded", open ? "true" : "false");
    });
    tbar.addEventListener("click", function (e) {
      var b = e.target.closest ? e.target.closest("[data-maptime]") : null;
      if (!b) return;
      setTimeout(function () {
        clean();
        sync();
        card.classList.remove("time-open");
        chip.setAttribute("aria-expanded", "false");
      }, 60);
    });
    document.addEventListener("click", function (e) {
      if (!card.contains(e.target)) {
        card.classList.remove("time-open");
        chip.setAttribute("aria-expanded", "false");
      }
    });
    var to = new MutationObserver(function () { sync(); });
    to.observe(tbar, { attributes: true, subtree: true, attributeFilter: ["class"] });
    setTimeout(function () { clean(); sync(); }, 300);
  }

  function enterPinDirect(pin) {
    pinBypass = pin;
    try { pin.click(); } catch (e) {}
    setTimeout(function () { pinBypass = null; }, 0);
  }

  function initPlaceSheet() {
    if (sheet) return;
    sheet = document.createElement("dialog");
    sheet.id = "villagePlaceSheet";
    sheet.className = "village-place-sheet";
    sheet.setAttribute("aria-labelledby", "villageSheetTitle");
    sheet.innerHTML = "<div class=\"village-sheet-head\"><div><h3 id=\"villageSheetTitle\"></h3><p id=\"villageSheetSub\"></p></div>"
      + "<button class=\"village-sheet-close\" id=\"villageSheetClose\" type=\"button\" aria-label=\"장소 시트 닫기\"><svg viewBox=\"0 0 20 20\" aria-hidden=\"true\"><path d=\"M4 4l12 12M16 4L4 16\"/></svg></button></div>"
      + "<div class=\"village-sheet-body\">"
      + "<div class=\"village-sheet-row\"><span>진행</span><b id=\"villageSheetProgress\"></b></div>"
      + "<div class=\"village-sheet-progress\"><i id=\"villageSheetBar\"></i></div>"
      + "<div class=\"village-sheet-row\"><span>다음 할 일</span><b id=\"villageSheetNext\"></b></div>"
      + "<div class=\"village-sheet-actions\"><button class=\"go\" id=\"villageSheetEnter\" type=\"button\">들어가기</button><button class=\"mini-act\" id=\"villageSheetRecord\" type=\"button\">이 집 기록</button></div>"
      + "</div>";
    body.appendChild(sheet);
    byId("villageSheetClose").addEventListener("click", function () { sheet.close(); });
    sheet.addEventListener("click", function (e) { if (e.target === sheet) sheet.close(); });
    sheet.addEventListener("close", function () {
      if (sheetPin) {
        var p = sheetPin;
        setTimeout(function () { try { p.focus(); } catch (e) {} }, 0);
        sheetPin = null;
      }
    });
    byId("villageSheetEnter").addEventListener("click", function () {
      var p = sheetPin;
      sheet.close();
      if (p) enterPinDirect(p);
    });
    byId("villageSheetRecord").addEventListener("click", function () {
      sheet.close();
      if (isLow) showGroup("progress", true);
      else {
        showGroup("note", true);
        setTimeout(function () {
          var tab = document.querySelector("[data-tab=\"journalPane\"]");
          if (tab) tab.click();
        }, 120);
      }
    });
  }

  function openPlaceSheet(pin) {
    initPlaceSheet();
    sheetPin = pin;
    var name = pinName(pin) || "이 집";
    var badge = pin.querySelector(".lv-badge");
    var raw = badge ? (badge.textContent || "").trim() : "";
    var state = pin.getAttribute("data-village-state") || (pin.classList.contains("lv-max") ? "max" : (pin.classList.contains("lv-1") ? "ing" : "new"));
    var prog = raw.match(/(\d+)\s*\/\s*(\d+)/);
    var progressText = state === "max" ? (isLow ? "완료" : "마스터") : (state === "ing" ? ("성장 중 · " + (prog ? prog[1] + "/" + prog[2] : "진행 중")) : "아직 시작 전");
    var pct = state === "max" ? 100 : (prog ? Math.round(Number(prog[1]) / Math.max(1, Number(prog[2])) * 100) : 0);
    byId("villageSheetTitle").textContent = name;
    byId("villageSheetSub").textContent = isLow ? "저학년 단원 집" : "별숲 단원 장소";
    byId("villageSheetProgress").textContent = progressText;
    byId("villageSheetBar").style.width = pct + "%";
    byId("villageSheetNext").textContent = pin.classList.contains("is-next") ? "오늘의 길 · 지금 들어가기" : "이 집을 둘러보기";
    if (typeof sheet.showModal === "function") sheet.showModal();
    else sheet.setAttribute("open", "");
    setTimeout(function () { var b = byId("villageSheetEnter"); if (b) b.focus(); }, 30);
  }

  function updateLowerAvatar(a) {
    if (!isLow || !window.G3Avatar) return;
    var mini = byId("lowAvMini");
    if (mini) window.G3Avatar.mountRig(mini, a);
    var nm = byId("lowAvName");
    if (nm) nm.textContent = (a.name || "산책 주민") + (a.name ? " 주민" : "");
    var rig = byId("lowTokenRig");
    if (rig) window.G3Avatar.mountRig(rig, a);
    var token = byId("lowToken");
    if (token) {
      var em = token.querySelector("em");
      if (em) em.textContent = a.name || "주민";
    }
  }

  function mountLook(rig, index, name) {
    if (!rig || !window.G3Avatar) return;
    var a = {};
    var base = LOOKS[index] ? LOOKS[index].avatar : LOOKS[0].avatar;
    for (var k in base) if (Object.prototype.hasOwnProperty.call(base, k)) a[k] = base[k];
    a.name = name || "";
    window.G3Avatar.mountRig(rig, a);
  }

  function initFirstRun() {
    if (byId("villageFirstRun")) return;
    var d = document.createElement("dialog");
    d.id = "villageFirstRun";
    d.className = "village-first-run";
    d.setAttribute("aria-labelledby", "villageFRTitle");
    d.innerHTML = "<div class=\"village-fr-head\"><p>처음 오셨네요</p><h3 id=\"villageFRTitle\">마을에 들어갈 주민을 만들어요</h3></div>"
      + "<div class=\"village-fr-body\">"
      + "<div class=\"village-fr-step is-on\" data-fr-step=\"1\"><label class=\"village-fr-field\">주민 이름<input id=\"villageFRName\" maxlength=\"8\" autocomplete=\"off\" placeholder=\"예: 별빛이\"></label><p class=\"village-fr-hint\">한글·영문 1~8자. 나중에 주민 카드에서 바꿀 수 있어요.</p><div class=\"village-fr-actions\"><button class=\"village-fr-skip\" type=\"button\" data-fr-skip=\"1\">나중에</button><button class=\"play-btn\" type=\"button\" data-fr-next=\"2\">다음</button></div></div>"
      + "<div class=\"village-fr-step\" data-fr-step=\"2\"><p class=\"village-fr-hint\">마을에서 입을 모습을 골라요. 뽑기와 긴 옷장은 내 주민에서 이어서 할 수 있어요.</p><div class=\"village-fr-looks\">"
      + LOOKS.map(function (l, i) { return "<button class=\"fr-look" + (i === 0 ? " sel" : "") + "\" type=\"button\" data-look=\"" + i + "\"><span class=\"fr-rig\" data-fr-rig=\"" + i + "\"></span><span>" + l.label + "</span></button>"; }).join("")
      + "</div><div class=\"village-fr-actions\"><button class=\"mini-act\" type=\"button\" data-fr-back=\"1\">이전</button><button class=\"play-btn\" type=\"button\" data-fr-next=\"3\">다음</button></div></div>"
      + "<div class=\"village-fr-step\" data-fr-step=\"3\"><div class=\"village-fr-preview\"><div class=\"fr-rig\" id=\"villageFRPreview\"></div><div><b id=\"villageFRPreviewName\"></b><p>이 모습으로 마을을 걸어요. 별과 씨앗을 모아 마을을 가꿔 보세요.</p></div></div><div class=\"village-fr-actions\"><button class=\"mini-act\" type=\"button\" data-fr-back=\"2\">모습 다시 고르기</button><button class=\"play-btn\" type=\"button\" data-fr-finish=\"1\">마을로 들어가기</button></div></div>"
      + "</div>";
    body.appendChild(d);

    function goStep(n) {
      frStep = n;
      $$("[data-fr-step]", d).forEach(function (s) {
        s.classList.toggle("is-on", Number(s.getAttribute("data-fr-step")) === n);
      });
      if (n === 2) {
        $$("[data-fr-rig]", d).forEach(function (rig) {
          mountLook(rig, Number(rig.getAttribute("data-fr-rig")), byId("villageFRName").value.trim());
        });
      }
      if (n === 3) {
        mountLook(byId("villageFRPreview"), selectedLook, frName);
        byId("villageFRPreviewName").textContent = frName;
      }
    }
    function skip() {
      frFinished = true;
      frOpen = false;
      try { localStorage.setItem("starforest-onboard-skip", "1"); } catch (e) {}
      d.close();
      setPrimary();
      refreshHub();
    }
    function finish() {
      var a = {};
      var base = LOOKS[selectedLook] ? LOOKS[selectedLook].avatar : LOOKS[0].avatar;
      for (var k in base) if (Object.prototype.hasOwnProperty.call(base, k)) a[k] = base[k];
      a.name = frName;
      if (window.G3Avatar && window.G3Avatar.apply) window.G3Avatar.apply(a);
      else {
        var st = store();
        if (st) { st.avatar = a; try { window.G3Store.save(st); } catch (e) {} }
      }
      updateLowerAvatar(a);
      try { localStorage.setItem("starforest-onboard-done", "1"); localStorage.removeItem("starforest-onboard-skip"); } catch (e) {}
      frFinished = true;
      frOpen = false;
      d.close();
      try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch (e) { window.scrollTo(0, 0); }
      if (window.G3Map && window.G3Map.syncTodo) window.G3Map.syncTodo();
      setPrimary();
      refreshHub();
      toast((frName || "새 주민") + " 주민, 마을로 들어왔어요.");
    }
    d.addEventListener("click", function (e) {
      var t = e.target;
      if (t.closest("[data-fr-skip]")) { skip(); return; }
      if (t.closest("[data-fr-finish]")) { finish(); return; }
      var look = t.closest("[data-look]");
      if (look) {
        selectedLook = Number(look.getAttribute("data-look")) || 0;
        $$(".fr-look", d).forEach(function (b) { b.classList.toggle("sel", b === look); });
        return;
      }
      var next = t.closest("[data-fr-next]");
      if (next) {
        var n = Number(next.getAttribute("data-fr-next")) || 2;
        if (n === 2) {
          var name = byId("villageFRName").value.trim();
          if (!name) { byId("villageFRName").focus(); toast("주민 이름을 먼저 적어 주세요."); return; }
          frName = name;
        }
        goStep(n);
        return;
      }
      var back = t.closest("[data-fr-back]");
      if (back) goStep(Number(back.getAttribute("data-fr-back")) || 1);
    });
    d.addEventListener("close", function () {
      frOpen = false;
      if (!frFinished) {
        try { localStorage.setItem("starforest-onboard-skip", "1"); } catch (e) {}
        setPrimary();
      }
    });
  }

  function openFirstRun(force) {
    var d = byId("villageFirstRun");
    if (!d) return;
    if (!force) {
      if (!isFirstRun()) return;
      try { if (localStorage.getItem("starforest-onboard-skip") === "1") return; } catch (e) {}
    }
    var a = store() && store().avatar ? store().avatar : {};
    frName = a.name || "";
    selectedLook = 0;
    frFinished = false;
    frStep = 1;
    byId("villageFRName").value = frName;
    goFirstStep();
    function goFirstStep() {
      $$("[data-fr-step]", d).forEach(function (s) { s.classList.toggle("is-on", s.getAttribute("data-fr-step") === "1"); });
      $$(".fr-look", d).forEach(function (b) { b.classList.toggle("sel", b.getAttribute("data-look") === "0"); });
    }
    frOpen = true;
    if (typeof d.showModal === "function") d.showModal();
    else d.setAttribute("open", "");
    setTimeout(function () { try { byId("villageFRName").focus(); } catch (e) {} }, 30);
  }

  function init() {
    initHeaderMeta();
    initHeaderActions();
    moveControls();
    initHub();
    initMap();
    initTimeChip();
    initPlaceSheet();
    initFirstRun();
    setTimeout(function () {
      moveControls();
      refreshHub();
      setPrimary();
    }, 400);
    setTimeout(refreshHub, 1200);
    window.addEventListener("offline", function () { toast("인터넷이 끊겨도 지도와 저장된 기록은 그대로 열려요."); });
    window.addEventListener("online", function () { toast("다시 연결됐어요."); });
    if (isFirstRun()) {
      try { window.scrollTo(0, 0); } catch (e) {}
      setTimeout(function () { openFirstRun(false); }, 500);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else setTimeout(init, 0);
})();
