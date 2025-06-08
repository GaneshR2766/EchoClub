import React, { useState } from "react";
import Signup from "./Signup";
import Login from "./Login";
import { useTheme } from "../ThemeContext";

const AuthPage = () => {
  const [mode, setMode] = useState("login");
  const { darkMode, toggleTheme } = useTheme();
  const theme = darkMode ? darkTheme : lightTheme;

  return (
    <div style={theme.container}>
      <div style={theme.logoSection}>
  <img src="/logo19234.png" alt="Logo" style={theme.logoImage} />
  <span style={theme.logoText}>EchoClub</span>
</div>

      <div style={theme.panel}>
        <div style={theme.header}>
          <div style={theme.toggleButtons}>
            <button
              onClick={() => setMode("login")}
              style={{
                ...theme.toggleBtn,
                ...(mode === "login" ? theme.activeBtn : {}),
              }}
            >
              Log In
            </button>
            <button
              onClick={() => setMode("signup")}
              style={{
                ...theme.toggleBtn,
                ...(mode === "signup" ? theme.activeBtn : {}),
              }}
            >
              Sign Up
            </button>
          </div>
          <button
            onClick={toggleTheme}
            style={theme.darkModeBtn}
            title="Toggle dark mode"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
        <div style={theme.formBox}>
          {mode === "login" ? <Login /> : <Signup />}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

const lightTheme = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #d3d3d3, #f0f0f0)",
    transition: "0.3s",
  },
  logoSection: {
  position: "absolute",
  top: "20px",
  left: "20px",
  display: "flex",
  alignItems: "center",
  gap: "12px",
},

logoImage: {
  width: "40px",
  height: "40px",
  objectFit: "contain",
  borderRadius: "50%",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
},

logoText: {
  fontFamily: "'Ethnocentric', sans-serif",
  fontSize: "1.5rem",
  fontWeight: "bold",
  color: "#0096ff",
  textShadow: "1px 1px 3px rgba(0,0,0,0.3)",
},

  panel: {
    width: "100%",
    maxWidth: "420px",
    padding: "2rem",
    borderRadius: "20px",
    background: "linear-gradient(145deg, #e6e6e6, #ffffff)",
    boxShadow: "10px 10px 30px #b8b8b8, -10px -10px 30px #ffffff",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  toggleButtons: {
    display: "flex",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "inset 2px 2px 4px #bfbfbf, inset -2px -2px 4px #ffffff",
  },
  toggleBtn: {
    flex: 1,
    padding: "0.75rem 1rem",
    background: "transparent",
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.2s",
    color: "#333",
  },
  activeBtn: {
    background: "linear-gradient(145deg, #d4d4d4, #ffffff)",
    boxShadow: "inset 2px 2px 5px #bcbcbc, inset -2px -2px 5px #ffffff",
  },
  darkModeBtn: {
    padding: "0.5rem",
    background: "transparent",
    border: "none",
    fontSize: "1.2rem",
    cursor: "pointer",
  },
  formBox: {
    background: "#f9f9f9",
    borderRadius: "16px",
    padding: "1rem",
    boxShadow: "inset 3px 3px 6px #d0d0d0, inset -3px -3px 6px #ffffff",
  },
};

const darkTheme = {
  ...lightTheme,
  container: {
    ...lightTheme.container,
    background: "linear-gradient(135deg, #1f1f1f, #2c2c2c)",
  },
  panel: {
    ...lightTheme.panel,
    background: "linear-gradient(145deg, #2a2a2a, #1f1f1f)",
    boxShadow: "10px 10px 30px #121212, -10px -10px 30px #333",
  },
  toggleBtn: {
    ...lightTheme.toggleBtn,
    color: "#eee",
  },
  activeBtn: {
    background: "linear-gradient(145deg, #333, #1e1e1e)",
    boxShadow: "inset 2px 2px 5px #000, inset -2px -2px 5px #444",
  },
  formBox: {
    ...lightTheme.formBox,
    background: "#1c1c1c",
    boxShadow: "inset 3px 3px 6px #0f0f0f, inset -3px -3px 6px #2f2f2f",
  },
};
