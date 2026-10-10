# 🚀 PrepTrack

**PrepTrack** is a modern, full-stack web application designed to help developers **track, analyze, and improve** their Data Structures & Algorithms (DSA) preparation across multiple platforms—all in one place.

Live link: https://preptrack-c7d42.web.app 

![PrepTrack Dashboard Preview](https://preptrack-c7d42.web.app/login-bg.png)  
*(Login screen illustration used in the app)*

---

## ✨ Key Features

### 📊 Smart Dashboard
- Visualize your progress with interactive charts  
- Difficulty-wise and topic-wise breakdown  
- Real-time stats powered by Firestore  

---

### 📝 Unified Problem Tracking
- Track problems from platforms like:
  - LeetCode  
  - Codeforces  
  - HackerRank  
  - GeeksforGeeks  
- Store:
  - Difficulty, topic, status, revision info  

---

### 🧠 Smart Insights
Get intelligent feedback based on your activity:
- “You are weak in Graphs”  
- “You haven’t revised DP in 10 days”  
- “Strong in Arrays”  

---

### 🔥 Streak & Goals System
- Daily solving streak  
- Weekly goals tracking  
- Longest streak insights  

---

### 🔁 Revision System
- Mark problems for revision  
- Track revision count and last revised date  
- Identify overdue revisions  

---

### 🔗 Add Problems Easily
- Add manually  
- Add via problem link (auto-detect planned)  

---

### ⚡ Auto Sync (Currently Limited)
- Sync your progress directly from platforms  
- ✅ **Currently supported:**  
  - LeetCode profile stats & solved count  
- ⚠️ Full multi-platform auto-sync is under development  

---

### 📓 Personal Notes System
- Create, edit, and manage notes  
- Ideal for:
  - Interview prep  
  - System design concepts  
  - Algorithm tricks  

---

### 🎨 Dual Theme UI
- 🌞 Light mode (clean, minimal)  
- 🌙 Dark mode (developer-friendly)  

---

### 🔐 Authentication
- Firebase Authentication  
- Google Sign-In + Email/Password  

---

## 🛠️ Tech Stack

### Frontend
- React.js (Vite)
- React Router v6
- CSS (Custom + Variables)
- Recharts
- Lucide React Icons

---

### Backend & Services
- Firebase Authentication
- Firebase Firestore (NoSQL DB)
- Firebase Hosting
- *(Optional)* Node.js proxy for API integrations

---

## 🚀 Getting Started

### ✅ Prerequisites
- Node.js (v16+)
- npm or yarn
- Firebase account  

---

### ⚙️ Installation

#### 1. Clone Repository
```bash
git clone https://github.com/Ankur-akr/PrepTrack.git
cd PrepTrack
````

#### 2. Install Dependencies

```bash
cd client
npm install
```

---

#### 3. Firebase Setup

* Create project on Firebase
* Enable:

  * Authentication (Google + Email/Password)
  * Firestore Database
* Copy Firebase config

---

#### 4. Configure Environment

Update:

```
client/src/firebase/config.js
```

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

---

#### 5. Run Locally

```bash
npm run dev
```

👉 Open: [http://localhost:5173](http://localhost:5173)

---

## 🌐 Deployment

Deploy using Firebase:

```bash
cd client
npm run build
firebase login
firebase deploy --only hosting
```

---

## 📂 Project Structure

```
PrepTrack/
├── client/
│   ├── public/          # Static assets (logo, backgrounds)
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # Global state (AuthContext)
│   │   ├── firebase/    # Firebase config & services
│   │   ├── pages/       # Pages (Dashboard, Login, Notes)
│   │   ├── App.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
└── server/              # (Optional) API proxy
```

---

## 🚧 Future Improvements

* Multi-platform auto sync (Codeforces, HackerRank)
* Chrome Extension for real-time tracking
* AI-based recommendations
* Gamification (badges, achievements)

---

## 👨‍💻 Developed By

**Ankur Rai**
B.Tech CSE | Uttaranchal University

GitHub: [https://github.com/Ankur-akr](https://github.com/Ankur-akr)

---

## ⭐ Support

If you found this project useful:

* ⭐ Star the repository
* 🍴 Fork it
* 🛠️ Contribute

---

> *PrepTrack helps you stay consistent, track smarter, and crack coding interviews efficiently.* 🚀

