/**
 * Конфигурация кейсов.
 * Типы: nation — по нации, class — по классу, personalMission — по категории ЛБЗ
 */

import { tanks, commonResources } from "./tanks.js";

const NATIONS = ["ussr", "usa", "germany", "uk", "france", "japan", "china"];
const CLASSES = [
  { id: "lt", nameKey: "class_lt" },
  { id: "mt", nameKey: "class_mt" },
  { id: "ht", nameKey: "class_ht" },
  { id: "td", nameKey: "class_td" },
  { id: "spg", nameKey: "class_spg" },
];

const getTanksByNation = (nation) =>
  tanks.filter((t) => t.nation === nation && !t.personalMissionCategory);
const getTanksByClass = (cls) =>
  tanks.filter((t) => t.class === cls && !t.personalMissionCategory);
const getTanksByCategory = (cat) =>
  tanks.filter((t) => t.personalMissionCategory === cat);

/** Собрать призы кейса: танки + общие ресурсы */
const buildCasePool = (caseTanks) => {
  const pool = [...caseTanks];
  const hasMain = pool.some((p) => p.isGuaranteed);
  if (!hasMain && pool.length > 0) {
    const firstMain = tanks.find((t) => t.isGuaranteed);
    if (firstMain) pool.push(firstMain);
  }
  return [...pool, ...commonResources];
};

/** Кейсы по нациям — только нации с танками */
const nationCases = NATIONS.filter(
  (n) => getTanksByNation(n).length > 0
).map((nation) => {
  const caseTanks = getTanksByNation(nation);
  return {
    id: `nation_${nation}`,
    nameKey: `nation_${nation}`,
    type: "nation",
    filter: nation,
    cost: 10,
    image: `/images/cases/${nation}.png`,
    prizes: buildCasePool(caseTanks.length ? caseTanks : tanks.slice(0, 3)),
  };
});

/** Кейсы по классам — только классы с танками */
const classCases = CLASSES.filter(
  (c) => getTanksByClass(c.id).length > 0
).map((cls) => {
  const caseTanks = getTanksByClass(cls.id);
  return {
    id: `class_${cls.id}`,
    nameKey: cls.nameKey,
    type: "class",
    filter: cls.id,
    cost: 10,
    image: `/images/cases/${cls.id}.png`,
    prizes: buildCasePool(caseTanks.length ? caseTanks : tanks.slice(0, 3)),
  };
});

/** Кейсы ЛБЗ (3 категории) */
const personalMissionCases = [1, 2, 3].map((cat) => {
  const caseTanks = getTanksByCategory(cat);
  return {
    id: `lbt_${cat}`,
    nameKey: `lbt_category_${cat}`,
    type: "personalMission",
    filter: cat,
    cost: 10,
    image: `/images/cases/lbt_${cat}.png`,
    prizes: buildCasePool(caseTanks),
  };
});

export const cases = [...nationCases, ...classCases, ...personalMissionCases];

export const getCaseById = (id) => cases.find((c) => c.id === id);
export const getCasesByType = (type) => cases.filter((c) => c.type === type);
