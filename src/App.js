import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Purchases from "./components/Purchases";
import Transfers from "./components/Transfers";
import Assignments from "./components/Assignments";
function ProtectedRoute(props) {
  var { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  if (props.allowedRoles) {
    var hasRole = props.allowedRoles.indexOf(user.role) !== -1;
    if (!hasRole) {
      return <Navigate to="/" />;
    }
  }
  return (
    <div>
      <Navbar />
      <div>{props.children}</div>
    </div>
  );
}

function AppRoutes() {
  var { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" /> : <Login />}
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/purchases"
        element={
          <ProtectedRoute allowedRoles={["Admin", "Logistics Officer"]}>
            <Purchases />
          </ProtectedRoute>
        }
      />
      <Route
        path="/transfers"
        element={
          <ProtectedRoute allowedRoles={["Admin", "Logistics Officer"]}>
            <Transfers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/assignments"
        element={
          <ProtectedRoute allowedRoles={["Admin", "Base Commander"]}>
            <Assignments />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <CssBaseline />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
