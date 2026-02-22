import React, { useState } from "react";
import { t } from "../config/i18n";
import "./LoginPage.css";

export function LoginPage({ onLogin, onRegister, lang }) {
  const [isRegister, setIsRegister] = useState(false);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (isRegister && onRegister) {
      const result = onRegister(login, password);
      if (result?.ok) {
        setError("");
        if (onLogin(login, password)) return;
      }
      setError(result?.error ?? "Ошибка регистрации");
      return;
    }
    if (onLogin(login, password)) return;
    setError("Неверный логин или пароль");
  };

  return (
    <div className="login-page">
      <h1 className="login-page__title">{t("app_title", lang)}</h1>
      <form className="login-page__form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Логин"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          className="login-page__input"
          autoComplete="username"
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-page__input"
          autoComplete={isRegister ? "new-password" : "current-password"}
        />
        {error && <p className="login-page__error">{error}</p>}
        <button type="submit" className="btn btn--primary">
          {isRegister ? "Зарегистрироваться" : "Войти"}
        </button>
      </form>
      <button
        type="button"
        className="login-page__toggle"
        onClick={() => {
          setIsRegister(!isRegister);
          setError("");
        }}
      >
        {isRegister ? "Уже есть аккаунт? Войти" : "Нет аккаунта? Регистрация"}
      </button>
    </div>
  );
}
