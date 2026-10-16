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
    var d = window.G3Store.load();
    if (!d.avatar) document.getElementById("avatar").scrollIntoView();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
