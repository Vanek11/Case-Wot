/**
 * Конфигурация кейсов.
 * Типы: nation — по нации, class — по классу, personalMission — ЛБЗ 1.0/2.0/3.0, personalMissionSpecial — ARMT / TF-2 Clark / Project Murat (последовательное открытие).
 */

import { tanks, commonResources, specialLbzTanks } from "./tanks.js";

const NATIONS = ["ussr", "usa", "germany", "uk", "france", "czechoslovakia", "china", "japan", "poland", "sweden", "italy", "alliance"];

/** Классы: тяжёлые, средние, лёгкие, ПТ-САУ, САУ */
const CLASSES = [
  { id: "ht", nameKey: "class_ht" },
  { id: "mt", nameKey: "class_mt" },
  { id: "lt", nameKey: "class_lt" },
  { id: "td", nameKey: "class_td" },
  { id: "spg", nameKey: "class_spg" },
];

/** Танки без спец. ЛБЗ (ARMT/TF-2/Murat) — для наций, классов и ЛБЗ 1.0–3.0 */
const baseTanks = tanks.filter((t) => t.unlockRequires === undefined);

const getTanksByNation = (nation) =>
  baseTanks.filter((t) => t.nation === nation && !t.personalMissionCategory);
const getTanksByClass = (cls) =>
  baseTanks.filter((t) => t.class === cls && !t.personalMissionCategory);
const getTanksByCategory = (cat) =>
  baseTanks.filter((t) => t.personalMissionCategory === cat);

/** Собрать призы кейса: танки + общие ресурсы */
const buildCasePool = (caseTanks) => {
  const pool = [...caseTanks];
  const hasMain = pool.some((p) => p.isGuaranteed);
  if (!hasMain && pool.length > 0) {
    const firstMain = baseTanks.find((t) => t.isGuaranteed);
    if (firstMain) pool.push(firstMain);
  }
  return [...pool, ...commonResources];
};

/** Кейсы по нациям */
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
    prizes: buildCasePool(caseTanks.length ? caseTanks : baseTanks.slice(0, 3)),
  };
});

/** Кейсы по классам */
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
    prizes: buildCasePool(caseTanks.length ? caseTanks : baseTanks.slice(0, 3)),
  };
});

/** Кейсы ЛБЗ 1.0, 2.0, 3.0 */
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

/** Спецкейсы ЛБЗ: ARMT (всегда), TF-2 Clark (после ARMT), Project Murat (после TF-2 Clark) */
const specialLbzCases = specialLbzTanks.map((tank) => ({
  id: `lbz_${tank.backendId}`,
  nameKey: `lbt_${tank.backendId}`,
  type: "personalMissionSpecial",
  filter: tank.backendId,
  cost: 10,
  image: tank.image,
  prizes: buildCasePool([tank]),
  unlockRequires: tank.unlockRequires ?? null,
}));

export const cases = [...nationCases, ...classCases, ...personalMissionCases, ...specialLbzCases];

export const getCaseById = (id) => cases.find((c) => c.id === id);
export const getCasesByType = (type) => cases.filter((c) => c.type === type);

/** Проверка: есть ли в инвентаре приз с данным backendId */
export const hasPrizeInInventory = (inventory, backendId) =>
  (inventory || []).some(
    (entry) => entry.prize?.backendId === backendId || entry.prize?.id === backendId
  );

/** Доступен ли спецкейс с unlockRequires при данном инвентаре */
export const isSpecialLbzCaseUnlocked = (caseItem, inventory) => {
  if (caseItem.type !== "personalMissionSpecial" || !caseItem.unlockRequires) return true;
  return hasPrizeInInventory(inventory, caseItem.unlockRequires);
};
