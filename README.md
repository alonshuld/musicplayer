# 🎵 Music Player

A modern music player built with **Vite**, **React**, **TypeScript**, and **Material UI**, using **React Query** for data fetching and caching.

---

## 🚀 Features

- 🎧 Play and pause songs from a local JSON database
- ⚡ Fast and lightweight setup with Vite
- 🎨 Styled with Material UI components
- 🔄 Data fetching and caching via React Query
- 🧩 Modular TypeScript code structure for scalability

---

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Vite
- **UI Library:** Material UI
- **Data Management:** React Query
- **Backend (Mock API):** JSON Server

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/alonshuld/musicplayer.git
cd musicplayer
```

### 2. Clone the Repository
```bash
npm install
```

### 3. Run the Backend
```bash
json-server ./backend/db.json --watch --port 3001
```

### 4. Start the Frontend
```bash
npm run dev
```

The app will be available at http://localhost:5173.

---

## 📁 Project Structure
```bash
musicplayer/
├── backend/
│   └── db.json           # Mock database
├── src/
│   ├── components/       # UI components
│   ├── pages/            # Main views
│   └── ...
└── vite.config.ts
```

## 🧑‍💻 Development Notes

The app uses a mock backend served via JSON Server.

React Query automatically handles caching and refetching.

Material UI provides consistent and responsive styling.