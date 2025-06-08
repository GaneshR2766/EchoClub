// src/pages/Signup.js
import React, { useState } from "react";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../ThemeContext";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [btnHover, setBtnHover] = useState(false);
  const [btnActive, setBtnActive] = useState(false);
  const [inputFocus, setInputFocus] = useState(null);

  const { darkMode } = useTheme();
  const theme = darkMode ? darkStyles : lightStyles;

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const { name, email, password } = form;

    if (name.length < 3 || password.length < 6) {
      setError("Name must be 3+ chars, Password 6+ chars");
      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(res.user, { displayName: name });

      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        displayName: name,
        email,
      });

      navigate("/chat");
    } catch (err) {
    if (err.code === "auth/email-already-in-use") {
      setError("This email is already registered. Please try logging in or use a different email.");
    } else {
      setError(err.message);
    }
  }
  };

  return (
    <form onSubmit={handleSubmit} style={theme.form}>
      <h2 style={theme.heading}>Sign Up</h2>
      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        onFocus={() => setInputFocus("name")}
        onBlur={() => setInputFocus(null)}
        style={{
          ...theme.input,
          ...(inputFocus === "name" ? theme.inputFocus : {}),
        }}
        required
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        onFocus={() => setInputFocus("email")}
        onBlur={() => setInputFocus(null)}
        style={{
          ...theme.input,
          ...(inputFocus === "email" ? theme.inputFocus : {}),
        }}
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        onFocus={() => setInputFocus("password")}
        onBlur={() => setInputFocus(null)}
        style={{
          ...theme.input,
          ...(inputFocus === "password" ? theme.inputFocus : {}),
        }}
        required
      />
      <button
        type="submit"
        onMouseEnter={() => setBtnHover(true)}
        onMouseLeave={() => {
          setBtnHover(false);
          setBtnActive(false);
        }}
        onMouseDown={() => setBtnActive(true)}
        onMouseUp={() => setBtnActive(false)}
        style={{
          ...theme.button,
          ...(btnHover ? theme.buttonHover : {}),
          ...(btnActive ? theme.buttonActive : {}),
        }}
      >
        Create Account
      </button>
      {error && <p style={theme.error}>{error}</p>}
    </form>
  );
};

const sharedStyles = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    maxWidth: "400px",
    margin: "3rem auto",
    padding: "2rem 3rem",
    borderRadius: "20px",
  },
  heading: {
    textAlign: "center",
    marginBottom: "1rem",
    fontWeight: "700",
  },
  input: {
    padding: "14px 18px",
    fontSize: "1rem",
    borderRadius: "14px",
    outline: "none",
    transition: "all 0.3s ease",
  },
  inputFocus: {
    borderColor: "#7e8fff",
    boxShadow:
      "inset 4px 4px 8px #202553, inset -4px -4px 10px #8189f7, 0 0 8px 2px #5e65ff",
  },
  button: {
    padding: "16px 24px",
    fontSize: "1.15rem",
    fontWeight: "700",
    borderRadius: "20px",
    border: "none",
    cursor: "default",
    userSelect: "none",
    transition: "all 0.3s ease",
  },
  buttonHover: {
    transform: "scale(1.07)",
    cursor: "pointer",
  },
  buttonActive: {
    boxShadow:
      "inset 3px 3px 10px #272d5a, inset -3px -3px 10px #6c72d8",
    transform: "scale(0.95)",
  },
  error: {
    color: "#ff6f6f",
    fontWeight: "600",
    textAlign: "center",
    textShadow: "0 0 3px #ff3b3b",
  },
};

const lightStyles = {
  ...sharedStyles,
  form: {
    ...sharedStyles.form,
    background: "linear-gradient(145deg, #f0f0f0, #ffffff)",
    boxShadow:
      "0 0 20px 2px rgba(99, 102, 255, 0.2), 8px 8px 30px #ccc, -8px -8px 30px #fff",
  },
  heading: {
    ...sharedStyles.heading,
    color: "#222",
  },
  input: {
    ...sharedStyles.input,
    background: "linear-gradient(145deg, #ffffff, #e0e0e0)",
    color: "#222",
    border: "1.5px solid #ccc",
    boxShadow: "inset 4px 4px 8px #d0d0d0, inset -4px -4px 8px #ffffff",
  },
  inputFocus: {
    ...sharedStyles.inputFocus,
    background: "linear-gradient(145deg, #e0eaff, #d0dfff)",
    color: "#111",
  },
  button: {
    ...sharedStyles.button,
    background: "linear-gradient(145deg, #8da2ff, #aebeff)",
    color: "#222",
    boxShadow: "5px 5px 15px #b0bfff, -5px -5px 15px #fff",
  },
  buttonHover: {
    ...sharedStyles.buttonHover,
    boxShadow: "0 0 12px 3px #bbbfff",
    color: "#000",
  },
  buttonActive: sharedStyles.buttonActive,
  error: sharedStyles.error,
};

const darkStyles = {
  ...sharedStyles,
  form: {
    ...sharedStyles.form,
    background: "linear-gradient(145deg, #000000, #1a1a1a)",
    boxShadow:
      "0 0 20px 2px rgba(100, 150, 255, 0.7), 8px 8px 30px #0d0d0d, -8px -8px 30px #262626",
  },
  heading: {
    ...sharedStyles.heading,
    color: "#d0d8ff",
  },
  input: {
    ...sharedStyles.input,
    background: "linear-gradient(145deg, #121212, #1f1f1f)",
    color: "#c8d0ff",
    border: "1.5px solid #444caa",
    boxShadow: "inset 4px 4px 8px #0a0a0a, inset -4px -4px 8px #383f73",
  },
  inputFocus: {
    ...sharedStyles.inputFocus,
    background: "linear-gradient(145deg, #27306d, #1a2461)",
    color: "#e0e7ff",
    borderColor: "#7584ff",
    boxShadow:
      "inset 4px 4px 8px #1e2373, inset -4px -4px 10px #8690ff, 0 0 10px 3px #7f8fff",
  },
  button: {
    ...sharedStyles.button,
    background: "linear-gradient(145deg, #2b2f63, #3e4483)",
    color: "#d0d8ff",
    boxShadow: "5px 5px 15px #1c2060, -5px -5px 15px #5b64b2",
  },
  buttonHover: {
    ...sharedStyles.buttonHover,
    boxShadow:
      "0 0 14px 4px #8a95ff, 5px 5px 22px #4a52b1, -5px -5px 22px #8a91ff",
    color: "#ffffff",
  },
  buttonActive: sharedStyles.buttonActive,
  error: {
    ...sharedStyles.error,
    color: "#ff8383",
    textShadow: "0 0 5px #ff4f4f",
  },
};

export default Signup;
