/**
 * Логика выпадения призов.
 * rewardType: branch_progress (приз убирается из пула глобально по всем кейсам прокачки) | branch_reset | lbz.
 */

import { getMainPrizes, getRegularPrizes } from "../config/prizes.js";
import { getBranchProgressWonIds } from "../config/cases.js";

const MAIN_PRIZE_CHANCE = 0.02;
const GUARANTEED_AFTER = 30;

/** Идентификатор приза для учёта выигранных (backendId или id) */
const getPrizeId = (p) => p?.backendId ?? p?.id ?? "";

/**
 * Текущий пул для ролла с учётом rewardType.
 * branch_progress: убираем главные призы, уже выигранные в ЛЮБОМ кейсе прокачки (нации + классы).
 * branch_reset, lbz: полный пул.
 */
export const getPoolForCase = (prizePool, caseState, rewardType, state = null) => {
  const pool = prizePool || [];
  if (rewardType !== "branch_progress") return pool;
  const wonIds = new Set(state ? getBranchProgressWonIds(state) : []);
  if (wonIds.size === 0) return pool;
  return pool.filter((p) => {
    if (!p.isGuaranteed) return true;
    return !wonIds.has(getPrizeId(p));
  });
};

const normalizeWeights = (items) => {
  const total = items.reduce((sum, p) => sum + p.chance, 0);
  return items.map((p) => ({ ...p, weight: (p.chance || 0) / (total || 1) }));
};

const weightedRandom = (items) => {
  if (!items.length) return null;
  const totalWeight = items.reduce((sum, p) => sum + p.weight, 0);
  let r = Math.random() * totalWeight;
  for (const item of items) {
    r -= item.weight;
    if (r <= 0) return item;
  }
  return items[items.length - 1];
};

export const rollPrize = (casesUntilGuaranteed, prizePool) => {
  const pool = prizePool || [];
  const main = normalizeWeights(getMainPrizes(pool));
  const regular = normalizeWeights(getRegularPrizes(pool));

  const isForcedGuaranteed = casesUntilGuaranteed <= 1;
  const rollForMain = Math.random() < MAIN_PRIZE_CHANCE;

  if (main.length === 0) {
    return {
      prize: weightedRandom(regular) || pool[0],
      isGuaranteed: false,
    };
  }

  if (isForcedGuaranteed) {
    return {
      prize: weightedRandom(main),
      isGuaranteed: true,
    };
  }

  if (rollForMain) {
    return {
      prize: weightedRandom(main),
      isGuaranteed: false,
    };
  }

  return {
    prize: weightedRandom(regular) || pool[0],
    isGuaranteed: false,
  };
};

export const applyDrop = (state, result, caseId, caseCost = 0, rewardType = "branch_reset") => {
  const caseState = state.cases?.[caseId] || {
    totalOpened: 0,
    casesUntilGuaranteed: GUARANTEED_AFTER,
    history: [],
    wonMainPrizeIds: [],
    closed: false,
  };

  const newCaseState = {
    ...caseState,
    totalOpened: caseState.totalOpened + 1,
    history: [
      { prize: result.prize, isGuaranteed: result.isGuaranteed, caseId },
      ...(caseState.history || []),
    ].slice(0, 50),
  };

  if (rewardType === "branch_progress" && result.prize?.isGuaranteed) {
    const id = getPrizeId(result.prize);
    if (id && !(caseState.wonMainPrizeIds || []).includes(id)) {
      newCaseState.wonMainPrizeIds = [...(caseState.wonMainPrizeIds || []), id];
    }
  }
  if (rewardType === "lbz" && result.prize?.isGuaranteed) {
    newCaseState.closed = true;
  }

  if (result.isGuaranteed) {
    newCaseState.casesUntilGuaranteed = GUARANTEED_AFTER;
  } else {
    const wasMain = result.prize?.isGuaranteed;
    newCaseState.casesUntilGuaranteed = wasMain
      ? GUARANTEED_AFTER
      : Math.max(0, (caseState.casesUntilGuaranteed ?? GUARANTEED_AFTER) - 1);
  }

  const inventory = [...(state.inventory || [])];
  inventory.push({
    prize: result.prize,
    isGuaranteed: result.isGuaranteed,
    caseId,
    timestamp: Date.now(),
  });

  const newAchievements = [...(state.achievements || [])];
  const totalOpened = (state.totalOpened ?? 0) + 1;
  if (totalOpened >= 1 && !newAchievements.includes("first_case"))
    newAchievements.push("first_case");
  if (result.prize?.isGuaranteed && !newAchievements.includes("first_main"))
    newAchievements.push("first_main");
  if (result.isGuaranteed && !newAchievements.includes("first_guaranteed"))
    newAchievements.push("first_guaranteed");

  const balance = Math.max(0, (state.balance ?? 0) - caseCost);

  let branchProgressWonPrizeIds = state.branchProgressWonPrizeIds ?? [];
  if (rewardType === "branch_progress" && result.prize?.isGuaranteed) {
    const id = getPrizeId(result.prize);
    if (id && !branchProgressWonPrizeIds.includes(id)) {
      branchProgressWonPrizeIds = [...branchProgressWonPrizeIds, id];
    }
  }

  return {
    ...state,
    balance,
    totalOpened,
    inventory,
    achievements: newAchievements,
    branchProgressWonPrizeIds,
    cases: {
      ...(state.cases || {}),
      [caseId]: newCaseState,
    },
  };
};

export const getInitialState = () => ({
  totalOpened: 0,
  inventory: [],
  achievements: [],
  cases: {},
  balance: 1000,
  branchProgressWonPrizeIds: [],
});

export const buildRouletteItems = (winningPrize, prizePool, count = 45) => {
  const pool = prizePool || [];
  const all = [...getMainPrizes(pool), ...getRegularPrizes(pool)];
  const items = all.length ? all : [winningPrize];

  const winningIndex = Math.floor(count * 0.75);
  const result = [];

  for (let i = 0; i < count; i++) {
    if (i === winningIndex) {
      result.push(winningPrize);
    } else {
      const idx = Math.floor(Math.random() * items.length);
      result.push(items[idx]);
    }
  }

  return result;
};

export { GUARANTEED_AFTER, MAIN_PRIZE_CHANCE };
