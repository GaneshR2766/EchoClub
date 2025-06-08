// src/pages/Chat.js
import React, { useEffect, useState, useRef } from "react";
import { auth, db } from "../firebase";

import {
  addDoc,
  collection,
  query,
  orderBy,
  serverTimestamp,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../ThemeContext";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const bottomRef = useRef(null);
  const navigate = useNavigate();

  const { darkMode, toggleTheme } = useTheme();
  const theme = darkMode ? darkStyles : lightStyles;

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      navigate("/");
      return;
    }

    const onlineUserRef = doc(db, "onlineUsers", user.uid);
    setDoc(onlineUserRef, {
      uid: user.uid,
      displayName: user.displayName,
      lastActive: serverTimestamp(),
    });

    addDoc(collection(db, "messages"), {
      text: `${user.displayName} joined the chat`,
      system: true,
      timestamp: serverTimestamp(),
    });

    const unsubscribeOnline = onSnapshot(collection(db, "onlineUsers"), (snapshot) => {
      const users = snapshot.docs.map((doc) => doc.data());
      setOnlineUsers(users);
    });

    return () => {
      deleteDoc(onlineUserRef);
      addDoc(collection(db, "messages"), {
        text: `${user.displayName} left the chat`,
        system: true,
        timestamp: serverTimestamp(),
      });
      unsubscribeOnline();
    };
  }, [navigate]);

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => doc.data());
      setMessages(msgs);
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    });

    return () => unsubscribe();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    await addDoc(collection(db, "messages"), {
      text: message,
      uid: auth.currentUser.uid,
      displayName: auth.currentUser.displayName,
      timestamp: serverTimestamp(),
    });

    setMessage("");
  };

  const handleClearAllMessages = async () => {
    if (!window.confirm("Are you sure you want to clear all messages?")) return;

    try {
      const snapshot = await getDocs(collection(db, "messages"));
      const deletePromises = snapshot.docs.map((d) =>
        deleteDoc(doc(db, "messages", d.id))
      );
      await Promise.all(deletePromises);
      alert("Messages cleared!");
    } catch (err) {
      alert("Failed to clear messages.");
    }
  };

  const handleLogout = async () => {
    const user = auth.currentUser;
    if (!user) return;

    await deleteDoc(doc(db, "onlineUsers", user.uid));
    await addDoc(collection(db, "messages"), {
      text: `${user.displayName} left the chat`,
      system: true,
      timestamp: serverTimestamp(),
    });
    await signOut(auth);
    navigate("/");
  };

  const pulseAnimation = `
@keyframes pulse {
  0% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.4); opacity: 1; }
  100% { transform: scale(1); opacity: 0.6; }
}
`;

// Inject keyframes into document head (only once)
if (typeof document !== "undefined" && !document.getElementById("pulse-animation")) {
  const style = document.createElement("style");
  style.id = "pulse-animation";
  style.innerHTML = pulseAnimation;
  document.head.appendChild(style);
}


  {/*const handleClearOnlineUsers = async () => {
  if (!window.confirm("Are you sure you want to clear all online users?")) return;

  try {
    const snapshot = await getDocs(collection(db, "onlineUsers"));
    const deletePromises = snapshot.docs.map((d) =>
      deleteDoc(doc(db, "onlineUsers", d.id))
    );
    await Promise.all(deletePromises);
    alert("Online users cleared!");
  } catch (err) {
    console.error("Failed to clear online users:", err);
    alert("Failed to clear online users.");
  }
};*/}


  return (
    <div style={theme.container}>
      {/* Left Sidebar */}
      <div style={theme.sidebar}>
        <img src="/logoside.png" alt="Logo" style={theme.logo} />
        <h3 style={theme.sidebarHeader}>Loggedin Members</h3>
        <ul style={theme.userList}>
          {onlineUsers.map((u) => (
            <li key={u.uid} style={theme.userListItem}>
              <span
                style={{
                  ...theme.statusDot,
                  backgroundColor:
                    u.uid === auth.currentUser?.uid ? "#4caf50" : "#bbb",
                }}
              />
              {u.displayName}
            </li>
          ))}
        </ul>
        <button onClick={handleLogout} style={theme.logoutBtn}>Logout</button>
      </div>

      {/* Chat Area */}
      <div style={theme.chatArea}>
        <div style={theme.header}>
          <h2>Chat Room</h2>
          <div>
            <button onClick={handleClearAllMessages} style={theme.controlButton}>🗑️ Clear All</button>
           { /* <button onClick={handleClearOnlineUsers} style={theme.controlButton}>🧹 Clear Online Users</button> */}
            <button onClick={toggleTheme} style={theme.controlButton}>
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>
          </div>
        </div>

        <div style={theme.messages}>
          {messages.map((msg, i) => {
            const isSelf = msg.uid === auth.currentUser?.uid;
            const isSystem = msg.system;
            const time = msg.timestamp?.toDate?.().toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            }) ?? "";

            return (
              <div
                key={i}
                style={{
                  ...theme.message,
                  alignSelf: isSystem
                    ? "center"
                    : isSelf
                    ? "flex-end"
                    : "flex-start",
                  backgroundColor: isSystem
                    ? theme.systemBg
                    : isSelf
                    ? theme.selfBg
                    : theme.otherBg,
                }}
              >
                {!isSystem && <strong>{msg.displayName}</strong>}
                <p>{msg.text}</p>
                <small>{time}</small>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input Box */}
        <form onSubmit={handleSend} style={theme.inputBox}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            style={theme.messageInput}
          />
          <button
            type="submit"
            disabled={!message.trim()}
            style={{
              ...theme.sendButton,
              ...(message.trim() ? {} : theme.sendButtonDisabled),
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="white">
              <path d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;


// ----------- Styles -------------
const sharedStyles = {
  messageInput: {
    flex: 1,
    padding: "0.6rem 1rem",
    fontSize: "1rem",
    borderRadius: "20px",
    border: "1.5px solid #ccc",
    outline: "none",
    transition: "all 0.3s",
    background: "linear-gradient(135deg, #f0f0f0, #ffffff)",
    boxShadow: "inset 1px 1px 3px rgba(0,0,0,0.1)",
  },
  sendButton: {
  background: "linear-gradient(145deg, #0d3bff, #174bff, #1f51ff, #174bff, #0d3bff)",
  border: "none",
  borderRadius: "50%",
  width: 42,
  height: 42,
  color: "white",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 3px 8px rgba(31, 81, 255, 0.6), inset 0 2px 6px rgba(255, 255, 255, 0.5)",
  position: "relative",
  overflow: "hidden",
  transition: "background 0.3s ease, box-shadow 0.3s ease",
  fontWeight: "bold",
  // Pseudo-element for shine effect (works in CSS-in-JS that supports it)
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-70%",
    width: "50%",
    height: "100%",
    background:
      "linear-gradient(120deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.3) 100%)",
    transform: "skewX(-25deg)",
    animation: "shine 2.8s infinite",
  },
},
"@keyframes shine": {
  "0%": { left: "-70%" },
  "100%": { left: "130%" },
},
logo: {
  width: "100%",
  height: "auto",
  marginBottom: "1rem",
  objectFit: "contain",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
},


  sendButtonDisabled: {
    background: "#aaa",
    cursor: "not-allowed",
  },
  controlButton: {
    padding: "0.5rem 0.8rem",
    marginLeft: 10,
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    background: "linear-gradient(145deg, #5e5e5e, #9e9e9e)",
    color: "white",
    fontWeight: "bold",
    boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
  },
};

const lightStyles = {
  container: { display: "flex", height: "100vh", background: "#f8f8f8" },
  sidebar: { width: 220, background: "#ffffff", borderRight: "1px solid #ccc", padding: "1rem", display: "flex", flexDirection: "column" },
  sidebarHeader: { textAlign: "center", fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" },
  userList: { flex: 1, listStyle: "none", padding: 0 },
  userListItem: { display: "flex", alignItems: "center", padding: "0.5rem 0" },
statusDot: {
  width: 10,
  height: 10,
  borderRadius: "50%",
  marginRight: 8,
  backgroundColor: "#4caf50",
  animation: "pulse 1.5s infinite ease-in-out",
},
  logoutBtn: { ...sharedStyles.controlButton, background: "linear-gradient(145deg, #d32f2f, #c2185b)" },
  chatArea: { flex: 1, display: "flex", flexDirection: "column" },
  header: { background: "#eee", padding: "1rem", borderBottom: "1px solid #ccc", display: "flex", justifyContent: "space-between" },
  messages: { flex: 1, padding: "1rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.5rem" },
  message: { padding: "0.6rem 1rem", borderRadius: 10, maxWidth: "70%", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" },
selfBg: "#bbdefb",
  otherBg: "#fff",
  systemBg: "#f0f0f0",
  inputBox: { display: "flex", padding: "1rem", borderTop: "1px solid #ccc", background: "#fff", alignItems: "center", gap: "0.5rem" },
  ...sharedStyles,
};

const darkStyles = {
  ...lightStyles,
  container: { ...lightStyles.container, background: "#121212" },
  sidebar: { ...lightStyles.sidebar, background: "#1f1f1f", borderRight: "1px solid #333" },
  sidebarHeader: { ...lightStyles.sidebarHeader, color: "#eee" },
  userListItem: { ...lightStyles.userListItem, color: "#ccc" },
  logoutBtn: { ...lightStyles.logoutBtn, background: "linear-gradient(145deg, #b71c1c, #7f0000)" },
  chatArea: { ...lightStyles.chatArea },
  header: { ...lightStyles.header, background: "#1e1e1e", color: "#fff", borderBottom: "1px solid #333" },
  messages: { ...lightStyles.messages, backgroundColor: "#181818" },
  message: { ...lightStyles.message, color: "#eee" },
  selfBg: "#1e88e5",
  otherBg: "#333",
  systemBg: "#444",
  inputBox: { ...lightStyles.inputBox, background: "#222", borderTop: "1px solid #333" },
  messageInput: {
    ...lightStyles.messageInput,
    background: "linear-gradient(145deg, #2c2c2c, #1e1e1e)",
    borderColor: "#444",
    color: "#fff",
  },
  logo: {
  width: "100%",
  height: "auto",
  marginBottom: "1rem",
  objectFit: "contain",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
},

  sendButton: {
    ...lightStyles.sendButton,
    background: "linear-gradient(145deg, #2979ff, #1565c0)",
  },
  sendButtonDisabled: {
    ...lightStyles.sendButtonDisabled,
    background: "#555",
  },
  controlButton: {
    ...lightStyles.controlButton,
    background: "linear-gradient(145deg, #444, #666)",
  },
};
