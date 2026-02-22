import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "./context/AuthContext";
import { LoginPage } from "./components/LoginPage";
import { CaseOpener } from "./components/CaseOpener";
import { CaseSelector } from "./components/CaseSelector";
import { DropHistory } from "./components/DropHistory";
import { ChancesPage } from "./components/ChancesPage";
import { Inventory } from "./components/Inventory";
import { ProgressBar } from "./components/ProgressBar";
import { Achievements } from "./components/Achievements";
import { AdminDashboard } from "./components/AdminDashboard";
import {
  getInitialState,
  GUARANTEED_AFTER,
} from "./utils/dropLogic";
import { cases as allCases } from "./config/cases";
import { loadState, saveState, clearState, loadSettings, saveSettings } from "./utils/storage";
import { exportToJson, downloadFile } from "./utils/exportStats";
import { t } from "./config/i18n";
import "./App.css";

function App() {
  const { user, login, register, logout } = useAuth();

  const [state, setState] = useState(() => {
    if (!user) return getInitialState();
    const saved = loadState(user.id);
    return saved || getInitialState();
  });

  const [settings, setSettings] = useState(loadSettings);
  const { theme, lang } = settings;

  const [screen, setScreen] = useState("cases"); // cases | case-detail | opener
  const [mainTab, setMainTab] = useState("cases"); // cases | inventory
  const [selectedCase, setSelectedCase] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showChances, setShowChances] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);

  useEffect(() => {
    if (user) {
      const saved = loadState(user.id);
      setState(saved || getInitialState());
    }
  }, [user?.id]);

  useEffect(() => {
    if (user && state) saveState(state, user.id);
  }, [state, user?.id]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const handleStateChange = useCallback((newState) => {
    setState(newState);
  }, []);

  const handleReset = useCallback(() => {
    if (window.confirm(t("confirm_reset", lang))) {
      clearState(user?.id);
      setState(getInitialState());
    }
  }, [lang, user?.id]);

  const handleSelectCase = useCallback((caseItem) => {
    setSelectedCase(caseItem);
    setScreen("case-detail");
  }, []);

  const handleBackToCases = useCallback(() => {
    setScreen("cases");
    setSelectedCase(null);
  }, []);

  const handleCasesTabClick = useCallback(() => {
    setMainTab("cases");
    setScreen("cases");
    setSelectedCase(null);
  }, []);

  const handleOpenCase = useCallback(() => {
    if (!selectedCase) return;
    const cost = selectedCase.cost ?? 10;
    if ((state.balance ?? 0) < cost) {
      alert("Недостаточно средств на балансе");
      return;
    }
    setScreen("opener");
  }, [selectedCase, state.balance]);

  const caseData = selectedCase;
  const caseId = caseData?.id;
  const caseState = state.cases?.[caseId] ?? {
    casesUntilGuaranteed: GUARANTEED_AFTER,
    totalOpened: 0,
  };
  const isAdmin = user?.role === "admin";

  const handleExportStats = useCallback(() => {
    downloadFile(exportToJson(state), "case-wot-stats.json", "application/json");
  }, [state]);

  const toggleTheme = useCallback(() => {
    setSettings((s) => ({ ...s, theme: s.theme === "dark" ? "light" : "dark" }));
  }, []);

  const setLang = useCallback((l) => {
    setSettings((s) => ({ ...s, lang: l }));
  }, []);

  if (!user) {
    return (
      <div className={`app app--${theme}`}>
        <LoginPage onLogin={login} onRegister={register} lang={lang} />
      </div>
    );
  }

  return (
    <div className={`app app--${theme}`}>
      <header className="app__header">
        <div className="app__header-left">
          <h1 className="app__title">{t("app_title", lang)}</h1>
          <div className="app__header-tabs">
            <button
              className={`btn btn--ghost btn--sm ${mainTab === "cases" ? "active" : ""}`}
              onClick={handleCasesTabClick}
            >
              Кейсы
            </button>
            <button
              className={`btn btn--ghost btn--sm ${mainTab === "inventory" ? "active" : ""}`}
              onClick={() => setMainTab("inventory")}
            >
              {t("inventory", lang)}
            </button>
          </div>
          <div className="app__header-user">
            <span className="app__user">{user.login}{isAdmin && " (админ)"}</span>
            <span className="app__balance">Баланс: {state.balance ?? 0}</span>
          </div>
        </div>
        <div className="app__header-right">
          {isAdmin && (
            <button
              className={`btn btn--ghost btn--sm app__admin-trigger ${showAdmin ? "active" : ""}`}
              onClick={() => setShowAdmin(!showAdmin)}
            >
              {t("admin", lang)}
            </button>
          )}
          <button className="btn btn--ghost btn--sm" onClick={logout}>
            Выход
          </button>
          <button className="btn btn--ghost btn--sm" onClick={toggleTheme}>
            {theme === "dark" ? "☀" : "☾"}
          </button>
          <button
            className={`btn btn--ghost btn--sm ${lang === "ru" ? "active" : ""}`}
            onClick={() => setLang("ru")}
          >
            RU
          </button>
          <button
            className={`btn btn--ghost btn--sm ${lang === "en" ? "active" : ""}`}
            onClick={() => setLang("en")}
          >
            EN
          </button>
        </div>
      </header>

      {showAdmin && isAdmin && (
        <div className="app__admin-wrap">
          <AdminDashboard onClose={() => setShowAdmin(false)} lang={lang} />
        </div>
      )}

      <main className="app__main">
        {mainTab === "inventory" && (
          <div className="app__inventory-tab">
            <Inventory inventory={state.inventory} lang={lang} />
          </div>
        )}

        {mainTab === "cases" && screen === "cases" && (
          <>
            <CaseSelector
              selectedCaseId={null}
              onSelect={handleSelectCase}
              lang={lang}
              casesStats={Object.fromEntries(
                allCases.map((c) => [
                  c.id,
                  state.cases?.[c.id]
                    ? {
                        totalOpened: state.cases[c.id].totalOpened ?? 0,
                        casesUntilGuaranteed: state.cases[c.id].casesUntilGuaranteed ?? GUARANTEED_AFTER,
                      }
                    : { totalOpened: 0, casesUntilGuaranteed: GUARANTEED_AFTER },
                ])
              )}
            />
            <p className="app__hint">{t("choose_case", lang)}</p>
          </>
        )}

        {mainTab === "cases" && screen === "case-detail" && caseData && (
          <>
            <div className="app__case-detail">
              <button className="btn btn--ghost app__back-btn" onClick={handleBackToCases}>
                ← {t("back", lang)}
              </button>
              <h2 className="app__case-name">{t(caseData.nameKey, lang)}</h2>
              <p className="app__case-cost">Стоимость: {caseData.cost ?? 10}</p>
              <div className="app__stats">
                <div className="stat-card">
                  <span className="stat-card__label">{t("total_opened", lang)}</span>
                  <span className="stat-card__value">{caseState.totalOpened ?? 0}</span>
                </div>
                <div className="stat-card stat-card--highlight">
                  <span className="stat-card__label">{t("until_guarantee", lang)}</span>
                  <span className="stat-card__value">
                    {caseState.casesUntilGuaranteed ?? GUARANTEED_AFTER}
                  </span>
                </div>
              </div>
              <div className="app__buttons">
                  <button
                    className="btn btn--primary btn--lg"
                    onClick={handleOpenCase}
                    disabled={(state.balance ?? 0) < (caseData?.cost ?? 10)}
                  >
                    {t("open_case", lang)}
                  </button>
                  <label className="app__quick-open">
                    <input
                      type="checkbox"
                      checked={quickOpen}
                      onChange={(e) => setQuickOpen(e.target.checked)}
                    />
                    {t("quick_open", lang)}
                  </label>
                </div>

                {showChances && caseData && (
                  <ChancesPage caseData={caseData} lang={lang} />
                )}
                <button
                  className="btn btn--ghost"
                  onClick={() => setShowChances(!showChances)}
                >
                  {showChances ? "−" : "+"} {t("chances", lang)}
                </button>

                <DropHistory
                  inventory={state.inventory}
                  history={caseState.history}
                  maxItems={10}
                  lang={lang}
                />

                <Achievements achievements={state.achievements} lang={lang} />

                <div className="app__actions">
                  <button className="btn btn--ghost" onClick={handleReset}>
                    {t("reset_progress", lang)}
                  </button>
                  <button className="btn btn--ghost" onClick={handleExportStats}>
                    {t("export_stats", lang)}
                  </button>
                </div>
            </div>
          </>
        )}

        {mainTab === "cases" && screen === "opener" && (
          <CaseOpener
            state={state}
            caseData={selectedCase}
            onStateChange={handleStateChange}
            onClose={() => setScreen("case-detail")}
            quickOpen={quickOpen}
            lang={lang}
          />
        )}
      </main>
    </div>
  );
}

export default App;
