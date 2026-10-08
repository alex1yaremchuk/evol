const assert = require("node:assert/strict");

global.window = {};
require("../earth-history.js");

const history = window.EVOL_EARTH_HISTORY;
const snapshots = history.snapshots || [];

assert.ok(snapshots.length >= 10, "Earth panorama needs enough distinct intervals");
assert.equal(snapshots[0].fromMa, history.oldestMa, "First snapshot must start at the oldest time");
assert.equal(snapshots.at(-1).toMa, history.youngestMa, "Last snapshot must end at the youngest time");

for (let index = 0; index < snapshots.length; index += 1) {
  const snapshot = snapshots[index];
  assert.ok(snapshot.fromMa > snapshot.toMa, `Invalid interval at snapshot ${index}`);
  assert.ok(snapshot.title?.ru && snapshot.title?.en, `Missing bilingual title at snapshot ${index}`);
  assert.ok(snapshot.period?.ru && snapshot.period?.en, `Missing bilingual period at snapshot ${index}`);
  assert.ok(snapshot.atmosphere?.ru && snapshot.land?.ru && snapshot.sea?.ru, `Missing environment at snapshot ${index}`);
  if (index < snapshots.length - 1) {
    assert.equal(snapshot.toMa, snapshots[index + 1].fromMa, `Gap or overlap after snapshot ${index}`);
  }
}

console.log("sanity-earth ok");
