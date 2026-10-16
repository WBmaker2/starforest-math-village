(function () {
  var HAIR_C = ["#5B3A29", "#2F2F2F", "#B5651D", "#7A9E7E"];
  var CLOTH_C = ["#4FA85E", "#6FBAD2", "#EE7F62", "#9C86E0", "#F5B23A"];
  var ACCS = [
    { id: "none", name: "없음", card: null },
    { id: "pin", name: "별머리핀", card: "pinwheel" },
    { id: "glasses", name: "별안경", card: "wheat" },
    { id: "crown", name: "반짝왕관", card: "map" },
    { id: "glass-star", name: "초롱안경", card: null },
    { id: "glass-heart", name: "하트안경", card: null }
  ];
  function norm(a) {
    a = a || {};
    return {
      name: a.name || "",
      hairImg: a.hairImg || "hair-long",
      face: a.face || 0,
      color: (typeof a.color === "string") ? a.color : "top-stripe",
      bottom: a.bottom || "bot-jeans",
      shoe: a.shoe || "shoe-sneakers",
      hat: a.hat || "none",
      acc: a.acc || "none"
    };
  }
  function hairSvg(style, color) {
    if (style === 1) return "<path d='M38 40 L34 22 L46 32 L52 14 L58 32 L66 16 L70 34 L82 26 L78 44 q-20 -16 -40 0 z' fill='" + color + "'/>";
    if (style === 2) return "<circle cx='34' cy='34' r='10' fill='" + color + "'/><circle cx='86' cy='34' r='10' fill='" + color + "'/><path d='M38 44 q22 -30 44 0 l0 -12 q-22 -18 -44 0 z' fill='" + color + "'/>";
    return "<path d='M38 44 q22 -30 44 0 l0 -12 q-22 -18 -44 0 z' fill='" + color + "'/>";
  }
  function faceSvg(face) {
    var blush = "<ellipse cx='82' cy='87' rx='5.5' ry='3.2' fill='#FF9E9E' opacity='.55'/><ellipse cx='118' cy='87' rx='5.5' ry='3.2' fill='#FF9E9E' opacity='.55'/>";
    if (face === 1) return blush + "<path d='M82 80 q6 -7 12 0' stroke='#3E3428' stroke-width='2.8' stroke-linecap='round' fill='none'/><path d='M106 80 q6 -7 12 0' stroke='#3E3428' stroke-width='2.8' stroke-linecap='round' fill='none'/><path d='M92 92 q8 8 16 0' stroke='#3E3428' stroke-width='2.6' stroke-linecap='round' fill='none'/>";
    if (face === 2) return blush + "<circle cx='88' cy='80' r='4.2' fill='#3E3428'/><circle cx='89.5' cy='78.5' r='1.5' fill='#fff'/><path d='M105 80 l10 -3.5 M105 80 l10 3.5' stroke='#3E3428' stroke-width='2.8' stroke-linecap='round'/><path d='M93 92 q7 6 14 0' stroke='#3E3428' stroke-width='2.6' stroke-linecap='round' fill='none'/>";
    return blush + "<circle cx='88' cy='80' r='4.4' fill='#3E3428'/><circle cx='112' cy='80' r='4.4' fill='#3E3428'/><circle cx='89.6' cy='78.3' r='1.6' fill='#fff'/><circle cx='113.6' cy='78.3' r='1.6' fill='#fff'/><path d='M93 92 q7 6 14 0' stroke='#3E3428' stroke-width='2.6' stroke-linecap='round' fill='none'/>";
  }
  function accSvg(acc) {
    if (acc === "pin") return "<path d='M124 58 l4 8 8 2 -8 2 -4 8 -2 -8 -8 -2 8 -2 z' fill='#F5B23A' stroke='#C98A2B' stroke-width='1.5'/>";
    if (acc === "glasses") return "<circle cx='88' cy='80' r='10' fill='rgba(255,255,255,.25)' stroke='#2F2F2F' stroke-width='2.6'/><circle cx='112' cy='80' r='10' fill='rgba(255,255,255,.25)' stroke='#2F2F2F' stroke-width='2.6'/><path d='M98 80 h4 M78 80 l-7 -2 M122 80 l7 -2' stroke='#2F2F2F' stroke-width='2.6' stroke-linecap='round'/>";
    if (acc === "crown") return "<path d='M82 42 L85 24 L94 35 L100 20 L106 35 L115 24 L118 42 z' fill='#F5B23A' stroke='#C98A2B' stroke-width='2' stroke-linejoin='round'/>";
    return "";
  }
  var HAT_STYLE = {
    "hat-beanie": { top: "-4px", width: "86px", height: "66px" },
    "hat-cap": { top: "4px", width: "88px", height: "58px" },
    "hat-straw": { top: "2px", width: "104px", height: "58px" },
    "hat-safari": { top: "2px", width: "100px", height: "58px" },
    "set-gold-hat": { top: "4px", width: "82px", height: "62px" }
  };
  var TOP_STYLE = {
    "top-stripe": { top: "111px", width: "94px", height: "62px", zIndex: "3" },
    "top-denim": { top: "109px", width: "98px", height: "65px", zIndex: "4" },
    "top-raincoat": { top: "107px", width: "100px", height: "70px", zIndex: "4" },
    "top-hoodie": { top: "106px", width: "100px", height: "68px", zIndex: "4" },
    "top-vest": { top: "109px", width: "82px", height: "64px", zIndex: "4" },
    "top-chef": { top: "108px", width: "98px", height: "66px", zIndex: "4" },
    "set-gold-cape": { top: "105px", width: "112px", height: "76px", zIndex: "4" }
  };
  var BOT_STYLE = {
    "bot-jeans": { top: "156px", width: "68px", height: "52px", zIndex: "3" },
    "bot-skirt": { top: "153px", width: "82px", height: "48px", zIndex: "3" },
    "bot-shorts": { top: "156px", width: "72px", height: "46px", zIndex: "3" },
    "bot-overalls": { top: "120px", width: "78px", height: "86px", zIndex: "4" }
  };
  function bodySvgMarkup(a) {
    var armSvg = "";
    if (a.color === "top-vest") {
      armSvg = "<path d='M75 120 Q64 138 66 156' stroke='#FFDCB8' stroke-width='11' stroke-linecap='round' fill='none'/>"
        + "<path d='M125 120 Q136 138 134 156' stroke='#FFDCB8' stroke-width='11' stroke-linecap='round' fill='none'/>";
    } else if (a.color === "top-stripe") {
      armSvg = "<path d='M70 136 L66 150' stroke='#FFDCB8' stroke-width='9' stroke-linecap='round' fill='none'/>"
        + "<path d='M130 136 L134 150' stroke='#FFDCB8' stroke-width='9' stroke-linecap='round' fill='none'/>";
    }
    return "<ellipse cx='100' cy='224' rx='42' ry='8' fill='rgba(62,52,40,.12)'/>"
      + "<rect x='79' y='164' width='14' height='42' rx='6' fill='#FFDCB8' stroke='#5A4638' stroke-width='2'/>"
      + "<rect x='107' y='164' width='14' height='42' rx='6' fill='#FFDCB8' stroke='#5A4638' stroke-width='2'/>"
      + armSvg
      + "<rect x='82' y='114' width='36' height='52' rx='10' fill='#FFDCB8' stroke='#5A4638' stroke-width='1.8'/>"
      + "<rect x='91' y='98' width='18' height='24' rx='4' fill='#FFDCB8'/>"
      + "<line x1='91' y1='102' x2='91' y2='114' stroke='#5A4638' stroke-width='2' stroke-linecap='round'/>"
      + "<line x1='109' y1='102' x2='109' y2='114' stroke='#5A4638' stroke-width='2' stroke-linecap='round'/>"
      + "<rect x='83' y='124' width='34' height='18' rx='5' fill='#FFFDF6' stroke='#D8CEBE' stroke-width='1.4'/>"
      + "<rect x='82' y='144' width='36' height='18' rx='6' fill='#E8EEF5' stroke='#B8C4D4' stroke-width='1.4'/>"
      + "<circle cx='100' cy='78' r='32.5' fill='#FFDCB8'/>";
  }
  function mountRig(el, rawAvatar) {
    if (!el) return;
    var a = norm(rawAvatar || window.G3Store.load().avatar);
    var ts = TOP_STYLE[a.color] || TOP_STYLE["top-stripe"];
    var bs = BOT_STYLE[a.bottom] || BOT_STYLE["bot-jeans"];
    var hs = HAT_STYLE[a.hat] || { top: "0px", width: "92px", height: "60px" };
    var sp = "../assets/img/flow/parts/" + a.shoe + ".png";
    var singleShoe = a.shoe === "set-gold-boots" ? " single-pair" : "";
    var isPngAcc = a.acc && a.acc.indexOf("glass-") === 0;
    var hatHtml = a.hat !== "none"
      ? "<img class='av-hat-img' src='../assets/img/flow/parts/" + a.hat + ".png' alt='' style='top:" + hs.top + ";width:" + hs.width + ";height:" + hs.height + ";display:block'>"
      : "<img class='av-hat-img' alt='' style='display:none'>";
    var accHtml = isPngAcc
      ? "<img class='av-acc-img' src='../assets/img/flow/parts/" + a.acc + ".png' alt='' style='display:block'>"
      : "<img class='av-acc-img' alt='' style='display:none'>";
    el.innerHTML = "<div class='av-rig'>"
      + "<svg class='av-body-svg' viewBox='0 0 200 250' aria-hidden='true'>" + bodySvgMarkup(a) + "</svg>"
      + "<span class='av-shoe-pair" + singleShoe + "'><img class='av-shoe-l' src='" + sp + "' alt=''><img class='av-shoe-r' src='" + sp + "' alt=''></span>"
      + "<img class='av-bot-img' src='../assets/img/flow/parts/" + a.bottom + ".png' alt='' style='top:" + bs.top + ";width:" + bs.width + ";height:" + bs.height + ";z-index:" + bs.zIndex + "'>"
      + "<img class='av-top-img' src='../assets/img/flow/parts/" + a.color + ".png' alt='' style='top:" + ts.top + ";width:" + ts.width + ";height:" + ts.height + ";z-index:" + ts.zIndex + "'>"
      + "<img class='av-hair-img' src='../assets/img/flow/parts/" + a.hairImg + ".png' alt=''>"
      + "<svg class='av-face-svg' viewBox='0 0 200 250' aria-hidden='true'>" + faceSvg(a.face % 3) + accSvg(a.acc) + "</svg>"
      + accHtml
      + hatHtml
      + "</div>";
  }
  function preview() {
    var d = window.G3Store.load();
    var a = norm(d.avatar);
    var svg = document.getElementById("avatarSvg");
    if (!svg) return;
    svg.innerHTML = bodySvgMarkup(a);
    var fsvg = document.getElementById("faceOverlaySvg");
    if (fsvg) fsvg.innerHTML = faceSvg(a.face % 3) + accSvg(a.acc);
    var hi = document.getElementById("hairImg");
    if (hi) { hi.style.display = "block"; hi.src = "../assets/img/flow/parts/" + a.hairImg + ".png"; }
    var ti = document.getElementById("topImg");
    if (ti) {
      ti.src = "../assets/img/flow/parts/" + a.color + ".png";
      var ts = TOP_STYLE[a.color] || TOP_STYLE["top-stripe"];
      ti.style.top = ts.top; ti.style.width = ts.width; ti.style.height = ts.height; ti.style.zIndex = ts.zIndex;
    }
    var bi = document.getElementById("botImg");
    if (bi) {
      bi.src = "../assets/img/flow/parts/" + a.bottom + ".png";
      var bs = BOT_STYLE[a.bottom] || BOT_STYLE["bot-jeans"];
      bi.style.top = bs.top; bi.style.width = bs.width; bi.style.height = bs.height; bi.style.zIndex = bs.zIndex;
    }
    var spair = document.getElementById("shoePair");
    var sl = document.getElementById("shoeL");
    var sr = document.getElementById("shoeR");
    var sp = "../assets/img/flow/parts/" + a.shoe + ".png";
    if (spair) spair.classList.toggle("single-pair", a.shoe === "set-gold-boots");
    if (sl) sl.src = sp;
    if (sr) sr.src = sp;
    var hi2 = document.getElementById("hatImg");
    if (hi2) {
      hi2.style.display = a.hat === "none" ? "none" : "block";
      if (a.hat !== "none") {
        hi2.src = "../assets/img/flow/parts/" + a.hat + ".png";
        var hs = HAT_STYLE[a.hat] || { top: "0px", width: "92px", height: "60px" };
        hi2.style.top = hs.top; hi2.style.width = hs.width; hi2.style.height = hs.height;
      }
    }
    var ai = document.getElementById("accImg");
    if (ai) {
      var isPng = a.acc && a.acc.indexOf("glass-") === 0;
      ai.style.display = isPng ? "block" : "none";
      if (isPng) ai.src = "../assets/img/flow/parts/" + a.acc + ".png";
    }
    var dlgAv = document.getElementById("dlgAvatar");
    if (dlgAv) mountRig(dlgAv, a);
    if (window.G3Report && window.G3Report.render) window.G3Report.render();
  }
  var sel = null;
  var IMG = "../assets/img/flow/parts/";
  var PICKS = {
    hair: { field: "hairImg", items: [
      { v: "hair-long", n: "긴 생머리" }, { v: "hair-spiky", n: "뾰족" }, { v: "hair-twintails", n: "양갈래" },
      { v: "hair-bob", n: "둥실 단발" }, { v: "hair-afro", n: "곱슬" }, { v: "hair-sidepony", n: "옆포니" } ] },
    face: { field: "face", items: [ { v: 0, n: "반짝" }, { v: 1, n: "웃음" }, { v: 2, n: "윙크" } ] },
    top: { field: "color", items: [
      { v: "top-stripe", n: "줄무늬티" }, { v: "top-denim", n: "데님재킷" }, { v: "top-raincoat", n: "노랑우비" },
      { v: "top-hoodie", n: "분홍후드" }, { v: "top-vest", n: "초록조끼" }, { v: "top-chef", n: "요리사복" } ] },
    bottom: { field: "bottom", items: [
      { v: "bot-jeans", n: "청바지" }, { v: "bot-skirt", n: "분홍치마" },
      { v: "bot-shorts", n: "초록반바지" }, { v: "bot-overalls", n: "노랑멜빵" } ] },
    shoe: { field: "shoe", items: [
      { v: "shoe-sneakers", n: "빨강 운동화" }, { v: "shoe-boots", n: "갈색 부츠" }, { v: "shoe-rainboots", n: "노랑 장화" } ] },
    hat: { field: "hat", items: [
      { v: "none", n: "없음" }, { v: "hat-cap", n: "빨강 모자" }, { v: "hat-straw", n: "밀짚모자" },
      { v: "hat-beanie", n: "파랑 비니" }, { v: "hat-safari", n: "탐험모자" } ] },
    acc: { field: "acc", items: null }
  };
  function faceThumb(i) {
    return "<svg viewBox='72 64 56 38'><circle cx='100' cy='82' r='24' fill='#FFDCB8'/>" + faceSvg(i) + "</svg>";
  }
  function accThumb(id) {
    if (id === "none") return "<svg viewBox='0 0 40 40'><circle cx='20' cy='20' r='12' fill='none' stroke='#9A8568' stroke-width='3'/><line x1='11' y1='29' x2='29' y2='11' stroke='#9A8568' stroke-width='3'/></svg>";
    if (id === "pin") return "<svg viewBox='108 46 36 32'>" + accSvg("pin") + "</svg>";
    if (id === "glasses") return "<svg viewBox='70 64 60 32'>" + accSvg("glasses") + "</svg>";
    if (id === "crown") return "<svg viewBox='76 14 48 34'>" + accSvg("crown") + "</svg>";
    return "";
  }
  function thumb(cat, it) {
    var pic = "";
    if (it.v === "none") pic = accThumb("none");
    else if (cat === "face") pic = faceThumb(it.v);
    else if (cat === "acc" && !it.img) pic = accThumb(it.v);
    else if (it.img === false) pic = accThumb(it.v);
    else pic = "<img src='" + IMG + it.v + ".png' alt='" + it.n + "'>";
    return pic;
  }
  var curCat = "hair";
  function renderPicker(cat) {
    curCat = cat || curCat || "hair";
    cat = curCat;
    var grid = document.getElementById("pickGrid");
    if (!grid) return;
    var tabs = document.querySelectorAll("#pickTabs button");
    for (var t = 0; t < tabs.length; t++) tabs[t].classList.toggle("sel", tabs[t].getAttribute("data-ptab") === cat);
    var def = PICKS[cat];
    var items = def.items ? def.items.slice() : [];
    if (cat === "acc") {
      var has = cardsOf();
      items = [];
      for (var i = 0; i < ACCS.length; i++) {
        var locked = ACCS[i].card && has.indexOf(ACCS[i].card) < 0;
        items.push({ v: ACCS[i].id, n: ACCS[i].name, lock: locked, img: ACCS[i].id.indexOf("glass-") === 0 });
      }
    }
    if (cat === "hat" || cat === "top" || cat === "shoe") {
      var sets = window.G3Store.load().sets || [];
      var gold = { hat: [{ v: "set-gold-hat", n: "황금 모자" }], top: [{ v: "set-gold-cape", n: "황금 망토" }], shoe: [{ v: "set-gold-boots", n: "황금 부츠" }] }[cat];
      for (var g = 0; g < gold.length; g++) {
        var has = sets.indexOf(gold[g].v) >= 0;
        items.push({ v: gold[g].v, n: gold[g].n, lock: !has, lockNote: "뽑기 필요" });
      }
    }
    grid.innerHTML = "";
    for (var j = 0; j < items.length; j++) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "th" + (sel[def.field] === items[j].v ? " sel" : "");
      b.innerHTML = thumb(cat, items[j]) + "<span>" + items[j].n + "</span>" + (items[j].lock ? ("<small>" + (items[j].lockNote || "카드 필요") + "</small>") : "");
      if (items[j].lock) b.disabled = true;
      (function (f, v) {
        b.addEventListener("click", function () {
          sel[f] = v;
          saveSel();
          renderPicker(cat);
        });
      })(def.field, items[j].v);
      grid.appendChild(b);
    }
  }
  function saveSel() {
    var d = window.G3Store.load();
    var nm = document.getElementById("avName");
    sel.name = nm ? nm.value.trim().slice(0, 8) : sel.name;
    d.avatar = sel;
    window.G3Store.save(d);
    preview();
    if (window.G3TokenRefresh) window.G3TokenRefresh();
  }
  function current() {
    var nm = document.getElementById("avName");
    if (nm) sel.name = nm.value.trim().slice(0, 8);
    return sel;
  }
  function cardsOf() {
    var d = window.G3Store.load();
    return d.cards || [];
  }
  function init() {
    var d = window.G3Store.load();
    var a = norm(d.avatar);
    sel = { name: a.name, hairImg: a.hairImg, face: a.face, color: a.color, bottom: a.bottom, shoe: a.shoe, hat: a.hat, acc: a.acc };
    var nm = document.getElementById("avName");
    if (nm) nm.value = a.name;
    var tabs = document.querySelectorAll("#pickTabs button");
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].addEventListener("click", function () { renderPicker(this.getAttribute("data-ptab")); });
    }
    renderPicker("hair");
    var hi = document.getElementById("hairImg");
    if (hi) hi.src = "../assets/img/flow/parts/" + (a.hairImg || "hair-long") + ".png";
    var form = document.getElementById("avatarForm");
    function onForm() {
      var a = current();
      var dd = window.G3Store.load();
      dd.avatar = a;
      window.G3Store.save(dd);
      preview();
      if (window.G3TokenRefresh) window.G3TokenRefresh();
    }
    if (form) {
      form.addEventListener("input", onForm);
      form.addEventListener("change", onForm);
    }
    if (form) form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var a = current();
      if (!a.name) { toast("이름을 먼저 적어 주세요."); return; }
      var dd = window.G3Store.load();
      dd.avatar = a;
      window.G3Store.save(dd);
      document.getElementById("village").scrollIntoView({ behavior: "smooth" });
      toast(a.name + " 주민, 마을로 나갑니다.");
    });
    preview();
  }
  function toast(m) {
    if (window.G3UI && window.G3UI.toast) window.G3UI.toast(m);
  }
  window.G3Avatar = { init: init, preview: preview, mountRig: mountRig, refreshPicker: function () { renderPicker(curCat); } };
})();
