import React, { createContext, useContext, useState } from "react";
var AuthContext = createContext();
export function useAuth() {
  return useContext(AuthContext);
}
export function AuthProvider(props) {
  var savedToken = sessionStorage.getItem("token");
  var savedUser = sessionStorage.getItem("user");

  var [token, setToken] = useState(savedToken);
  var [user, setUser] = useState(savedUser ? JSON.parse(savedUser) : null);
  var login = function (newToken, newUser) {
    setToken(newToken);
    setUser(newUser);
    sessionStorage.setItem("token", newToken);
    sessionStorage.setItem("user", JSON.stringify(newUser));
  };

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

    var API_URL = "https://military-asset-backend-3-r1z8.onrender.com"; //ouiygrhkjewrgrieyfhkjworwyufgiydhejwqiougi
    var response = await fetch(API_URL + url, options);
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
