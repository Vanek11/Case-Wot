/**
 * Локальное сохранение состояния через localStorage.
 * Поддержка per-user при передаче userId.
 */

const STORAGE_KEY = "case-wot-state";
const USER_PREFIX = "case-wot-user-";
const SETTINGS_KEY = "case-wot-settings";

const BRANCH_PROGRESS_IDS = ["nation_ussr", "nation_usa", "nation_germany", "nation_uk", "nation_france", "nation_czechoslovakia", "nation_china", "nation_japan", "nation_poland", "nation_sweden", "nation_italy", "nation_alliance", "class_ht", "class_mt", "class_lt", "class_td", "class_spg"];

const migrateState = (parsed) => {
  if (!parsed) return null;
  if (!parsed.cases && parsed.totalOpened !== undefined) {
    parsed.cases = {};
    parsed.inventory = (parsed.history || []).map((h) => ({
      prize: h.prize,
      isGuaranteed: h.isGuaranteed,
      caseId: "default",
      timestamp: Date.now(),
    }));
    parsed.achievements = parsed.achievements || [];
  }
  if (parsed.balance === undefined) parsed.balance = 1000;
  if (!parsed.branchProgressWonPrizeIds || parsed.branchProgressWonPrizeIds.length === 0) {
    const won = new Set();
    for (const cid of BRANCH_PROGRESS_IDS) {
      for (const id of parsed?.cases?.[cid]?.wonMainPrizeIds || []) {
        won.add(id);
      }
    }
    parsed.branchProgressWonPrizeIds = [...won];
  }
  return parsed;
};

export const loadState = (userId = null) => {
  try {
    const key = userId ? USER_PREFIX + userId : STORAGE_KEY;
    const raw = localStorage.getItem(key);
    return migrateState(raw ? JSON.parse(raw) : null);
  } catch {
    return null;
  }
};

export const saveState = (state, userId = null) => {
  try {
    const key = userId ? USER_PREFIX + userId : STORAGE_KEY;
    localStorage.setItem(key, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
};

export const clearState = (userId = null) => {
  try {
    const key = userId ? USER_PREFIX + userId : STORAGE_KEY;
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
};

export const loadSettings = () => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { theme: "dark", lang: "ru" };
    return JSON.parse(raw);
  } catch {
    return { theme: "dark", lang: "ru" };
  }
};

export const saveSettings = (settings) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    return true;
  } catch {
    return false;
  }
};
