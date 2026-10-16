(function () {
  var KEY = "math-walk-g3";
  function blank() {
    return { avatar: null, stars: 0, seeds: 0, done: {}, wrong: [],
      farm: { plots: [null, null, null, null] },
      basket: { lettuce: 0, tomato: 0, pumpkin: 0 },
      deco: { owned: ["flowerpot"], placed: [] },
      friends: { mong: 0, chick: 0, bunny: 0 },
      mapTime: "day",
      journal: [], visits: {}, harvests: 0 };
  }
  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return blank();
      var d = JSON.parse(raw);
      if (!d || typeof d !== "object") return blank();
      d.stars = d.stars || 0; d.seeds = d.seeds || 0;
      d.done = d.done || {}; d.wrong = d.wrong || [];
      if (!d.farm || !d.farm.plots) d.farm = { plots: [null, null, null, null] };
      if (!d.basket) d.basket = { lettuce: 0, tomato: 0, pumpkin: 0 };
      if (!d.deco) d.deco = { owned: ["flowerpot"], placed: [] };
      if (!d.friends) d.friends = { mong: 0, chick: 0, bunny: 0 };
      if (!d.mapTime) d.mapTime = "day";
      if (!d.journal) d.journal = [];
      if (!d.sets) d.sets = [];
      if (!d.visits) d.visits = {};
      d.harvests = d.harvests || 0;
      return d;
    } catch (e) { return blank(); }
  }
  function save(d) {
    try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {}
  }
  window.G3Store = { load: load, save: save };
})();
