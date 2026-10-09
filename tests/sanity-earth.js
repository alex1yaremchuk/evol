const assert = require("node:assert/strict");

global.window = {};
require("../earth-history.js");

const history = window.EVOL_EARTH_HISTORY;
const snapshots = history.snapshots || [];

assert.ok(snapshots.length >= 10, "Earth panorama needs enough distinct intervals");
assert.equal(snapshots[0].fromMa, history.oldestMa, "First snapshot must start at the oldest time");
assert.equal(snapshots.at(-1).toMa, history.youngestMa, "Last snapshot must end at the youngest time");

const transitionDates = new Set();
for (const transition of history.transitions || []) {
  assert.ok(transition.ma <= history.oldestMa && transition.ma >= history.youngestMa, `Transition ${transition.ma} is outside the panorama`);
  assert.ok(transition.label?.ru && transition.label?.en, `Transition ${transition.ma} needs a bilingual label`);
  assert.ok(!transitionDates.has(transition.ma), `Duplicate transition at ${transition.ma} Ma`);
  transitionDates.add(transition.ma);
}

for (let index = 0; index < snapshots.length; index += 1) {
  const snapshot = snapshots[index];
  assert.ok(snapshot.fromMa > snapshot.toMa, `Invalid interval at snapshot ${index}`);
  assert.ok(snapshot.title?.ru && snapshot.title?.en, `Missing bilingual title at snapshot ${index}`);
  assert.ok(snapshot.period?.ru && snapshot.period?.en, `Missing bilingual period at snapshot ${index}`);
  assert.ok(snapshot.atmosphere?.ru && snapshot.land?.ru && snapshot.sea?.ru, `Missing environment at snapshot ${index}`);
  assert.ok(!(snapshot.airLife || []).some((item) => item.marker === "oxygen"), `Atmospheric chemistry must not be listed as air life at snapshot ${index}`);
  if (snapshot.transition) {
    assert.ok(snapshot.transition.label?.ru && snapshot.transition.label?.en, `Missing bilingual transition label at snapshot ${index}`);
    assert.ok(snapshot.transition.effect?.ru && snapshot.transition.effect?.en, `Missing bilingual transition effect at snapshot ${index}`);
    assert.ok(transitionDates.has(snapshot.fromMa), `Snapshot ${index} transition must match a marked boundary`);
  }
  if (index < snapshots.length - 1) {
    assert.equal(snapshot.toMa, snapshots[index + 1].fromMa, `Gap or overlap after snapshot ${index}`);
  }
}

console.log("sanity-earth ok");
