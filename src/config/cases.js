/**
 * Конфигурация кейсов.
 * type: nation | class | personalMission | personalMissionSpecial (UI-группировка).
 * rewardType: branch_progress (приз убирается из пула) | branch_reset (пул не меняется) | lbz (один главный приз — кейс закрывается навсегда).
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

/** Кейсы по нациям — прокачка ветки (выигранный танк убирается из пула) */
const nationCases = NATIONS.filter(
  (n) => getTanksByNation(n).length > 0
).map((nation) => {
  const caseTanks = getTanksByNation(nation);
  return {
    id: `nation_${nation}`,
    nameKey: `nation_${nation}`,
    type: "nation",
    rewardType: "branch_progress",
    filter: nation,
    cost: 10,
    image: `/images/cases/${nation}.png`,
    prizes: buildCasePool(caseTanks.length ? caseTanks : baseTanks.slice(0, 3)),
  };
});

/** Кейсы по классам — прокачка ветки */
const classCases = CLASSES.filter(
  (c) => getTanksByClass(c.id).length > 0
).map((cls) => {
  const caseTanks = getTanksByClass(cls.id);
  return {
    id: `class_${cls.id}`,
    nameKey: cls.nameKey,
    type: "class",
    rewardType: "branch_progress",
    filter: cls.id,
    cost: 10,
    image: `/images/cases/${cls.id}.png`,
    prizes: buildCasePool(caseTanks.length ? caseTanks : baseTanks.slice(0, 3)),
  };
});

/** Кейсы ЛБЗ 1.0, 2.0, 3.0 — один главный приз, после выигрыша кейс закрывается навсегда */
const personalMissionCases = [1, 2, 3].map((cat) => {
  const caseTanks = getTanksByCategory(cat);
  return {
    id: `lbt_${cat}`,
    nameKey: `lbt_category_${cat}`,
    type: "personalMission",
    rewardType: "lbz",
    filter: cat,
    cost: 10,
    image: `/images/cases/lbt_${cat}.png`,
    prizes: buildCasePool(caseTanks),
  };
});

/** Спецкейсы ЛБЗ: ARMT, TF-2 Clark, Project Murat — один главный приз, кейс закрывается навсегда */
const specialLbzCases = specialLbzTanks.map((tank) => ({
  id: `lbz_${tank.backendId}`,
  nameKey: `lbt_${tank.backendId}`,
  type: "personalMissionSpecial",
  rewardType: "lbz",
  filter: tank.backendId,
  cost: 10,
  image: tank.image,
  prizes: buildCasePool([tank]),
  unlockRequires: tank.unlockRequires ?? null,
}));

/** Кейсы для сброса ветки — пул не меняется, главный приз можно выиграть многократно */
const resetCases = NATIONS.filter((n) => getTanksByNation(n).length > 0).slice(0, 3).map((nation) => {
  const caseTanks = getTanksByNation(nation);
  return {
    id: `reset_${nation}`,
    nameKey: `reset_${nation}`,
    type: "branch_reset",
    rewardType: "branch_reset",
    filter: nation,
    cost: 10,
    image: `/images/cases/${nation}.png`,
    prizes: buildCasePool(caseTanks.length ? caseTanks : baseTanks.slice(0, 3)),
  };
});

export const cases = [...nationCases, ...classCases, ...personalMissionCases, ...specialLbzCases, ...resetCases];

export const getCaseById = (id) => cases.find((c) => c.id === id);

/** Найти кейс по id среди обычных и сезонных (seasonalList — результат resolveSeasonalCases). */
export const getCaseByIdWithSeasonal = (id, seasonalList = []) =>
  seasonalList.find((c) => c.id === id) || cases.find((c) => c.id === id);

/**
 * Превращает сырой список сезонных кейсов из хранилища в полные объекты кейсов с пулом призов (commonResources).
 * @param raw Array<{ id, name, image?, cost?, rewardType? }>
 */
export const resolveSeasonalCases = (raw) => {
  if (!Array.isArray(raw)) return [];
  return raw.map((r) => ({
    id: r.id,
    name: r.name,
    nameKey: r.name,
    image: r.image || "/images/cases/seasonal.png",
    cost: r.cost ?? 10,
    rewardType: r.rewardType ?? "branch_reset",
    type: "seasonal",
    filter: r.id,
    prizes: [...commonResources],
  }));
};

export const getCasesByType = (type) => cases.filter((c) => c.type === type);

/** ID кейсов с прокачкой — для глобального учёта выигранных танков */
export const getBranchProgressCaseIds = () =>
  cases.filter((c) => c.rewardType === "branch_progress").map((c) => c.id);

/** Собрать все ID главных призов, выигранных в любом кейсе прокачки. Объединяем оба источника, чтобы ничего не потерять. */
export const getBranchProgressWonIds = (state) => {
  const won = new Set(state?.branchProgressWonPrizeIds || []);
  const caseIds = getBranchProgressCaseIds();
  for (const cid of caseIds) {
    for (const id of state?.cases?.[cid]?.wonMainPrizeIds || []) {
      won.add(id);
    }
  }
  return [...won];
};

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
