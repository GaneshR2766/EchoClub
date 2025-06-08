
# 💬 EchoClub [Real-Time Chat Application (Serverless)]

A responsive, real-time chat application built using **React** and **Firebase** (Firestore, Authentication, Hosting). This app allows users to sign in, chat in real-time, see who is online, and enjoy light/dark themes — all powered by serverless technology.

## 🚀 Objective

To demonstrate how a real-time chat system can be created using a **serverless architecture** — minimizing backend complexity while delivering dynamic, scalable performance.

---

## 🛠️ Tech Stack

| Component           | Technology                         |
|---------------------|-------------------------------------|
| Frontend            | React                               |
| Backend (Auth + DB) | Firebase Authentication + Firestore |
| Real-Time Updates   | Firestore real-time listeners       |
| Hosting (Optional)  | Firebase Hosting                    |

---

## ✨ Features

- 🔐 Firebase Google Authentication
- 💬 Real-time messaging using Firestore
- 👥 Display active online users
- 🌓 Toggle Light/Dark theme
- 🧹 Clear all messages (admin action)
- 🚪 Logout with session cleanup

---

## 📁 Project Structure

```
realtime-chat/
├── public/
│   └── logoside.png         # Sidebar logo
├── src/
│   ├── pages/
│   │   └── Chat.js          # Main chat component (after login)
│   ├── firebase.js          # Firebase config & initialization
│   ├── ThemeContext.js      # Theme context for dark/light mode
│   ├── App.js               # Main App routing
│   └── index.js             # Entry point
├── .gitignore
├── package.json
├── README.md
└── ...etc.
```

---

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/realtime-chat.git
cd realtime-chat
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Firebase

- Go to [Firebase Console](https://console.firebase.google.com/)
- Create a new project
- Enable **Authentication** → Sign-in method → Google
- Create **Cloud Firestore** in test mode
- Add a **web app** and get the config keys

Replace the content of `src/firebase.js` with your Firebase config:

```js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
```

### 4. Run the App

```bash
npm run dev
# or
npm start
```

---

## 📡 Firebase Hosting (Optional)

To deploy:

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

---

## 🎨 Screenshots

> 📷 Add screenshots of light mode, dark mode, and chat window here.

---

## 🙏 Acknowledgements

- [React](https://reactjs.org)
- [Firebase](https://firebase.google.com/)
- [Material Icons](https://fonts.google.com/icons)

---

## 📃 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## ✍️ Author

Built with ❤️ by [Your Name](https://github.com/yourusername)
