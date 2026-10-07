const assert = require("node:assert/strict");

global.window = {};
require("../games.js");
require("../evolution-model.js");

const games = window.EVOL_GAMES;
const model = window.EVOL_MODEL || { nodeDetails: [] };
const levelIds = games.levels.map((level) => level.id);
const levelRank = (level) => levelIds.indexOf(level);

function commonPrefix(first, second) {
  const result = [];
  const length = Math.min(first.length, second.length);
  for (let i = 0; i < length; i += 1) {
    if (first[i] !== second[i]) break;
    result.push(first[i]);
  }
  return result;
}

function uniquePath(path) {
  return path.filter((item, index) => path.indexOf(item) === index);
}

function nodeLevel(node) {
  return (games.nodeLevels || []).find((item) => item.node === node)?.level || "hard";
}

function pathForLevel(card, level) {
  const path = card.path || [];
  const terminal = path.at(-1);
  return uniquePath(path.filter((node, index) => index === 0 || node === terminal || levelRank(nodeLevel(node)) <= levelRank(level)));
}

function gameCards() {
  return Object.entries(games.cards).map(([id, card]) => ({ id, ...card })).filter((card) => Array.isArray(card.path) && card.path.length);
}

function branchesOverlap(leftItems, rightItems) {
  const right = new Set(rightItems);
  return leftItems.some((item) => right.has(item));
}

function lastCommonRank(first, second) {
  return commonPrefix(first, second).at(-1) || "";
}

function ancestorOptions(answer, firstPath, secondPath) {
  const pool = [...new Set([...firstPath, ...secondPath])].filter((item) => item !== answer);
  const answerIndex = Math.max(firstPath.indexOf(answer), secondPath.indexOf(answer));
  const nearby = pool
    .map((item) => ({ item, distance: Math.abs(Math.max(firstPath.indexOf(item), secondPath.indexOf(item)) - answerIndex) }))
    .filter(({ item }) => item !== "жизнь" && item !== "life")
    .sort((a, b) => a.distance - b.distance)
    .map(({ item }) => item);
  return [answer, ...nearby.slice(0, 3)];
}

function timelineRangeForTime(ranges, timeMa) {
  return ranges.find((range) => timeMa <= range.startMa && timeMa >= range.endMa);
}

function timelineTimeLabel(timeMa) {
  if (timeMa >= 1000) return `~${String(Math.round((timeMa / 1000) * 10) / 10).replace(".", ",")} млрд лет назад`;
  return `~${String(Math.round(timeMa * 10) / 10).replace(".", ",")} млн лет назад`;
}

function timelineDateValue(timeMa) {
  return `date:${Math.round(timeMa * 10) / 10}`;
}

function timelineDateOptions(event) {
  const period = games.timelinePeriods.find((item) => item.id === event.periodId);
  const startMa = period?.startMa ?? event.timeMa + 10;
  const endMa = period?.endMa ?? Math.max(0, event.timeMa - 10);
  const span = Math.max(1, startMa - endMa);
  const candidates = [event.timeMa, event.timeMa + span * 0.22, event.timeMa - span * 0.22, startMa - span * 0.08, endMa + span * 0.12]
    .map((timeMa) => Math.max(endMa, Math.min(startMa, timeMa)))
    .map((timeMa) => Math.round(timeMa * 10) / 10);
  const seenValues = new Set();
  const seenLabels = new Set();
  const unique = candidates.filter((value) => {
    const label = timelineTimeLabel(value);
    if (seenValues.has(value) || seenLabels.has(label)) return false;
    seenValues.add(value);
    seenLabels.add(label);
    return true;
  }).slice(0, 4);
  while (unique.length < 4) {
    const fallback = Math.round((startMa - (span * unique.length) / 4) * 10) / 10;
    if (!unique.some((timeMa) => timelineTimeLabel(timeMa) === timelineTimeLabel(fallback))) unique.push(fallback);
    else break;
  }
  return unique.sort((a, b) => b - a).map((timeMa) => ({ value: timelineDateValue(timeMa), label: timelineTimeLabel(timeMa) }));
}

function timelineEventAliasForModelNode(modelNodeId) {
  const aliases = {
    life: "prokaryotic-cells",
    eukaryotes: "eukaryotic-cell",
    archaeplastids: "chloroplasts",
    "green-plants": "multicellular-algae",
    animals: "multicellular-animals",
    craniates: "vertebrate-skull",
    "jawed-vertebrates": "jaws",
    tetrapods: "tetrapod-limbs",
    "seed-plants": "seeds",
    amniotes: "amniotic-egg",
    synapsids: "synapsid-skull",
    pterosaurs: "pterosaur-flight",
    "flowering-plants": "flowers",
    bats: "bat-flight",
    humans: "homo-sapiens",
    "winged-insects": "insect-wings",
  };
  return aliases[modelNodeId] || modelNodeId;
}

function gameTimelineEvents() {
  const explicitEvents = games.timelineEvents || [];
  const explicitIds = new Set(explicitEvents.map((event) => event.id));
  const modelEvents = (model.nodeDetails || [])
    .filter((event) => event.id && !explicitIds.has(event.id) && !explicitIds.has(timelineEventAliasForModelNode(event.id)) && event.appearedMa && event.novelty)
    .map((node) => {
      const era = timelineRangeForTime(games.timelineEras || [], node.appearedMa);
      const period = timelineRangeForTime(games.timelinePeriods || [], node.appearedMa);
      if (!era || !period) return null;
      return {
        id: `model:${node.id}`,
        title: node.title || node.node,
        timeMa: node.appearedMa,
        eraId: era.id,
        periodId: period.id,
        level: node.level || "hard",
      };
    })
    .filter(Boolean);
  return [...explicitEvents, ...modelEvents];
}

const timelineEvents = gameTimelineEvents();
assert.equal(new Set(timelineEvents.map((event) => event.id)).size, timelineEvents.length, "Duplicate timeline event ids");
assert.equal(
  new Set(timelineEvents.map((event) => event.id.replace(/^model:/, ""))).size,
  timelineEvents.length,
  "Duplicate canonical timeline event ids",
);

for (const event of timelineEvents) {
  const era = games.timelineEras.find((item) => item.id === event.eraId);
  const period = games.timelinePeriods.find((item) => item.id === event.periodId);
  assert.ok(era, `Missing era for ${event.id}`);
  assert.ok(period, `Missing period for ${event.id}`);
  assert.equal(period.parentId, era.id, `Period ${event.periodId} is not inside era ${event.eraId} for ${event.id}`);
  assert.ok(event.timeMa <= era.startMa && event.timeMa >= era.endMa, `Event ${event.id} time ${event.timeMa} outside era ${event.eraId}`);
  assert.ok(event.timeMa <= period.startMa && event.timeMa >= period.endMa, `Event ${event.id} time ${event.timeMa} outside period ${event.periodId}`);
  const dateOptions = timelineDateOptions(event);
  assert.ok(dateOptions.some((option) => option.value === timelineDateValue(event.timeMa)), `Correct date missing for ${event.id}`);
  assert.equal(new Set(dateOptions.map((option) => option.value)).size, dateOptions.length, `Duplicate date values for ${event.id}`);
  assert.equal(new Set(dateOptions.map((option) => option.label)).size, dateOptions.length, `Duplicate date labels for ${event.id}`);
}

for (const level of levelIds) {
  const cards = gameCards();
  for (let i = 0; i < cards.length; i += 1) {
    for (let j = i + 1; j < cards.length; j += 1) {
      const aPath = pathForLevel(cards[i], level);
      const bPath = pathForLevel(cards[j], level);
      const answer = lastCommonRank(aPath, bPath);
      if (answer && answer !== "жизнь" && answer !== "life") {
        const options = ancestorOptions(answer, aPath, bPath);
        assert.ok(options.includes(answer), `Ancestor answer missing from options: ${level} ${cards[i].id}/${cards[j].id}`);
        assert.equal(new Set(options).size, options.length, `Duplicate ancestor options: ${level} ${cards[i].id}/${cards[j].id}`);
      }

      const prefix = commonPrefix(aPath, bPath);
      if (prefix.length < 3) continue;
      const rawLeftItems = aPath.slice(prefix.length);
      const rawRightItems = bPath.slice(prefix.length);
      const leftItems = rawLeftItems.filter((item) => !rawRightItems.includes(item));
      const rightItems = rawRightItems.filter((item) => !rawLeftItems.includes(item));
      if (leftItems.length < 2 || rightItems.length < 2 || leftItems[0] === rightItems[0]) continue;
      assert.equal(new Set(leftItems).size, leftItems.length, `Duplicate left branch items: ${level} ${cards[i].id}/${cards[j].id}`);
      assert.equal(new Set(rightItems).size, rightItems.length, `Duplicate right branch items: ${level} ${cards[i].id}/${cards[j].id}`);
      assert.equal(branchesOverlap(leftItems, rightItems), false, `Branch overlap: ${level} ${cards[i].id}/${cards[j].id}`);
    }
  }
}

console.log("sanity-games ok");
