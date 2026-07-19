// context/AuthContext.js
// This shares login info (token, user) with ALL components
// Without this, you'd have to pass token as a prop to every single component

import React, { createContext, useContext, useState } from "react";

// Create the context (like a shared storage box)
var AuthContext = createContext();

// Custom hook - shortcut to use the context in any component
// Usage: var { user, token, login, logout, authFetch } = useAuth();
export function useAuth() {
  return useContext(AuthContext);
}

// Provider component - wraps the entire app
export function AuthProvider(props) {
  // Try to load saved login from sessionStorage (survives page refresh)
  var savedToken = sessionStorage.getItem("token");
  var savedUser = sessionStorage.getItem("user");

  var [token, setToken] = useState(savedToken);
  var [user, setUser] = useState(savedUser ? JSON.parse(savedUser) : null);

  // Call this after successful login
  var login = function (newToken, newUser) {
    setToken(newToken);
    setUser(newUser);
    sessionStorage.setItem("token", newToken);
    sessionStorage.setItem("user", JSON.stringify(newUser));
  };

  // Call this to log out
  var logout = function () {
    setToken(null);
    setUser(null);
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
  };var authFetch = async function (url, options) {
    if (!options) options = {};
    if (!options.headers) options.headers = {};
    options.headers["Content-Type"] = "application/json";
    options.headers["Authorization"] = "Bearer " + token;

    var response = await fetch(url, options);
    if (response.status === 401) {
      logout();
      return null;
    }

    return response;
  };
  var value = {
    token: token,
    user: user,
    login: login,
    logout: logout,
    authFetch: authFetch
  };

  return (
    <AuthContext.Provider value={value}>
      {props.children}
    </AuthContext.Provider>
  );
}
