(function () {
  function init() {
    window.G3UI.tabs();
    window.G3UI.stars();
    window.G3Avatar.init();
    if (window.G3Map) window.G3Map.init();
    window.G3Farm.render();
    window.G3Deco.render();
    if (window.G3Play) window.G3Play.render();
    window.G3Journal.render();
    if (window.G3Report) window.G3Report.render();
    window.G3Quests.render();
    if (window.G3Gacha) window.G3Gacha.render();
    window.G3Collect.render();
    if (window.G3Pet) window.G3Pet.render();
    if (window.G3Friend) window.G3Friend.render();
    if (window.G3Relay) window.G3Relay.render();
    if (window.G3Sheet) window.G3Sheet.render();
    if (window.G3Slots) window.G3Slots.render();
    // 첫 실행 안내는 village-shell.js가 지도 위에서 보여 줍니다.
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
