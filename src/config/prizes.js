/**
 * Реэкспорт и хелперы для призов.
 * Основные данные в tanks.js (танки + ресурсы)
 */

import { tanks, commonResources } from "./tanks.js";

export const prizes = [...tanks, ...commonResources];

export const getMainPrizes = (prizePool) =>
  (prizePool || prizes).filter((p) => p.isGuaranteed);
export const getRegularPrizes = (prizePool) =>
  (prizePool || prizes).filter((p) => !p.isGuaranteed);
export const getTotalChance = (items) =>
  (items || prizes).reduce((sum, p) => sum + p.chance, 0);
