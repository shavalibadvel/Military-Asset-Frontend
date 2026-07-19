import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert
} from "@mui/material";
import { useAuth } from "../context/AuthContext";

function Login() {
  var { login } = useAuth();

  var [username, setUsername] = useState("");
  var [password, setPassword] = useState("");
  var [error, setError] = useState("");
  var [loading, setLoading] = useState(false);

  var handleSubmit = async function (e) {
    e.preventDefault(); 
    setError("");
    setLoading(true);

    try {
      var response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });

      var data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }
      login(data.token, data.user);
    } catch (err) {
      setError("Cannot connect to server. Is the backend running on port 8085?");
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1a1a2e"
      }}
    >
      <Card sx={{ width: 400, padding: 2 }}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            Military Asset Management
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
            Secure login to asset tracking system
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
              label="Username"
              fullWidth
              margin="normal"
              value={username}
              onChange={function (e) { setUsername(e.target.value); }}
              required
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={function (e) { setPassword(e.target.value); }}
              required
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ mt: 2, mb: 2, backgroundColor: "#0f3460" }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <Box sx={{ backgroundColor: "#f5f5f5", padding: 2, borderRadius: 1 }}>
            <Typography variant="caption" display="block">
              <strong>Test accounts</strong> (password: password123)
            </Typography>
            <Typography variant="caption" display="block">
              admin · cmdr_alpha · cmdr_bravo · logistics1
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Login;
