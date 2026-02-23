/**
 * Локальное сохранение состояния через localStorage.
 * Поддержка per-user при передаче userId.
 */

import { computeAccumulatedFromInventory } from "./dropLogic.js";

const STORAGE_KEY = "case-wot-state";
const USER_PREFIX = "case-wot-user-";
const SETTINGS_KEY = "case-wot-settings";
const ADMIN_LOG_KEY = "case-wot-admin-log";
const ADMIN_LOG_MAX = 500;

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
  if (!parsed.accumulatedResources) {
    parsed.accumulatedResources = computeAccumulatedFromInventory(parsed.inventory);
  }
  if (!Array.isArray(parsed.deductionLog)) parsed.deductionLog = [];
  if (parsed.lastDailyBonusDate === undefined) parsed.lastDailyBonusDate = null;
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

/**
 * Журнал изменений админа: кто, когда, что менял (баланс, накопленные призы, удаление профиля).
 * @param entry { timestamp, adminLogin, adminId, targetUserId, targetLogin, action: 'balance'|'accumulated'|'delete_profile', details }
 */
export const appendAdminLogEntry = (entry) => {
  try {
    const raw = localStorage.getItem(ADMIN_LOG_KEY);
    const list = raw ? JSON.parse(raw) : [];
    list.unshift({ ...entry, timestamp: entry.timestamp ?? Date.now() });
    const trimmed = list.slice(0, ADMIN_LOG_MAX);
    localStorage.setItem(ADMIN_LOG_KEY, JSON.stringify(trimmed));
    return true;
  } catch {
    return false;
  }
};

export const loadAdminLog = () => {
  try {
    const raw = localStorage.getItem(ADMIN_LOG_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const SEASONAL_CASES_KEY = "case-wot-seasonal-cases";

/** Сезонные кейсы (добавляются/удаляются админом). Формат: { id, name, image, cost, rewardType } */
export const loadSeasonalCases = () => {
  try {
    const raw = localStorage.getItem(SEASONAL_CASES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveSeasonalCases = (list) => {
  try {
    localStorage.setItem(SEASONAL_CASES_KEY, JSON.stringify(list || []));
    return true;
  } catch {
    return false;
  }
};
