/**
 * Экспорт статистики в CSV/JSON
 */

export const exportToJson = (state) => {
  const data = {
    totalOpened: state.totalOpened,
    inventory: state.inventory,
    cases: state.cases,
    achievements: state.achievements,
    exportedAt: new Date().toISOString(),
  };
  return JSON.stringify(data, null, 2);
};

export const exportToCsv = (state) => {
  const rows = [["Приз", "Редкость", "Гарант", "Кейс", "Дата"]];
  (state.inventory || []).forEach((e) => {
    rows.push([
      e.prize?.name ?? "",
      e.prize?.rarity ?? "",
      e.isGuaranteed ? "Да" : "Нет",
      e.caseId ?? "",
      e.timestamp ? new Date(e.timestamp).toLocaleString() : "",
    ]);
  });
  return rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
};

export const downloadFile = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
