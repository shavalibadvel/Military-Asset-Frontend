import React from "react";
import { AppBar, Toolbar, Typography, Button, Box, Chip } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  var { user, logout } = useAuth();
  var navigate = useNavigate();
  var location = useLocation(); 

  var isActive = function (path) {
    return location.pathname === path;
  };

  var buttonStyle = function (path) {
    return {
      color: "white",
      backgroundColor: isActive(path) ? "rgba(255,255,255,0.2)" : "transparent",
      marginRight: 1
    };
  };

  var handleLogout = function () {
    logout();
    navigate("/login");
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "#1a1a2e" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ marginRight: 3 }}>
          Asset Management
        </Typography>

        <Box sx={{ flexGrow: 1, display: "flex", gap: 1 }}>
          <Button sx={buttonStyle("/")} onClick={function () { navigate("/"); }}>
            Dashboard
          </Button>

          {(user.role === "Admin" || user.role === "Logistics Officer") && (
            <>
              <Button sx={buttonStyle("/purchases")} onClick={function () { navigate("/purchases"); }}>
                Purchases
              </Button>
              <Button sx={buttonStyle("/transfers")} onClick={function () { navigate("/transfers"); }}>
                Transfers
              </Button>
            </>
          )}

          {(user.role === "Admin" || user.role === "Base Commander") && (
            <Button sx={buttonStyle("/assignments")} onClick={function () { navigate("/assignments"); }}>
              Assignments
            </Button>
          )}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ textAlign: "right" }}>
            <Typography variant="body2">{user.full_name}</Typography>
            <Chip
              label={user.role}
              size="small"
              sx={{ color: "white", borderColor: "white", fontSize: "10px", height: "20px" }}
              variant="outlined"
            />
          </Box>
          <Button color="error" variant="outlined" size="small" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
