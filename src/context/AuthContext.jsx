import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { loadAuth, saveAuth } from "../utils/authStorage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = loadAuth();
    if (saved) setUser(saved);
  }, []);

  const login = useCallback((loginName, password) => {
    const u = AuthProvider.loginUser(loginName, password);
    if (u) {
      setUser(u);
      saveAuth(u);
      return true;
    }
    return false;
  }, []);

  const register = useCallback((loginName, password) => {
    return AuthProvider.registerUser(loginName, password);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    saveAuth(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.loginUser = (loginName, password) => {
  const users = AuthProvider.getUsers();
  const u = users.find(
    (x) =>
      x.login.toLowerCase() === loginName.toLowerCase() &&
      x.password === password
  );
  return u ? { id: u.id, login: u.login, role: u.role } : null;
};

AuthProvider.getUsers = () => {
  try {
    const raw = localStorage.getItem("case-wot-users");
    if (raw) return JSON.parse(raw);
  } catch {}
  const defaultUsers = [
    { id: "admin", login: "admin", password: "admin", role: "admin" },
    { id: "player1", login: "player", password: "player", role: "player" },
  ];
  localStorage.setItem("case-wot-users", JSON.stringify(defaultUsers));
  return defaultUsers;
};

AuthProvider.registerUser = (loginName, password) => {
  const users = AuthProvider.getUsers();
  if (!loginName?.trim() || !password?.trim()) return { ok: false, error: "Заполните логин и пароль" };
  if (users.some((u) => u.login.toLowerCase() === loginName.toLowerCase())) {
    return { ok: false, error: "Логин уже занят" };
  }
  const id = "user_" + Date.now();
  const newUser = { id, login: loginName.trim(), password: password.trim(), role: "player" };
  users.push(newUser);
  localStorage.setItem("case-wot-users", JSON.stringify(users));
  return { ok: true };
};

export const useAuth = () => useContext(AuthContext);
