(function () {
  // 한 기기 다중 프로필: 주민 최대 4명 전환 (공용 태블릿용).
  // 릴레이 기록·음소거는 기기 공용으로 유지됩니다.
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function render() {
    try {
      var host = document.getElementById("avatar") || document.getElementById("lowAvatar");
      if (!host || document.getElementById("slotBox")) return;
      var cur = 1;
      try { cur = window.G3Store.slot(); } catch (e) {}
      var html = "<div class='pal-sec' id='slotBox'><b>👥 주민 바꾸기 (이 기기 공용)</b>"
        + "<p class='hint'>한 기기에서 최대 4명까지 주민을 바꿔 쓸 수 있어요.</p><div class='prow'>";
      for (var n = 1; n <= 4; n++) {
        var nm = "";
        try { nm = window.G3Store.slotName(n); } catch (e) {}
        html += "<button type='button' class='mini-act" + (n === cur ? " sel btn-pulse" : "") + "' data-slot='" + n + "'>"
          + n + "번 " + (nm ? esc(nm) : "(비어 있음)") + (n === cur ? " ◀ 지금" : "") + "</button>";
      }
      html += "</div></div>";
      var box = document.createElement("div");
      box.innerHTML = html;
      host.appendChild(box.firstChild);
    } catch (e) {}
  }
  document.addEventListener("click", function (e) {
    var t = e.target.closest ? e.target.closest("[data-slot]") : null;
    if (!t) return;
    var n = parseInt(t.getAttribute("data-slot"), 10);
    var cur = 1;
    try { cur = window.G3Store.slot(); } catch (e) {}
    if (n === cur) return;
    if (window.G3Store.switchSlot(n)) {
      try { location.reload(); } catch (e) {}
    } else if (window.G3UI) window.G3UI.toast("주민을 바꾸지 못했어요.");
  });
  window.G3Slots = { render: render };
})();
