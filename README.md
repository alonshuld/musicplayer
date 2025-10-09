# 🎵 Music Player

A modern, responsive music player web application built with React, TypeScript, and Material UI. Features a clean interface for playing songs with data fetching powered by React Query.

## ✨ Features

- 🎧 **Play & Pause Controls** - Intuitive playback controls
- 🎨 **Material UI** - Clean, modern interface following Material Design principles
- ⚡ **Fast Performance** - Built with Vite for lightning-fast development and builds
- 🔄 **Smart Caching** - React Query handles data fetching and caching automatically
- 🎵 **Local Music Library** - Browse and play songs from a mock database
- 💪 **Type Safety** - Full TypeScript implementation for reliability
- 🐳 **Docker Ready** - One-command setup with Docker Compose

## 🛠️ Tech Stack

**Frontend:**

- React
- TypeScript
- Vite
- Material UI (MUI)
- React Query (TanStack Query)

**Backend (Mock):**

- JSON Server

**DevOps:**

- Docker & Docker Compose
- Nginx

## 🚀 Quick Start

### Prerequisites

- Docker
- Docker Compose

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/alonshuld/musicplayer.git
cd musicplayer
```

2. **Start the application**

```bash
docker-compose up
```

3. **Open your browser**

Navigate to `http://localhost`

That's it! The application will be running with both the frontend and mock backend fully configured.

### Stopping the application

```bash
docker-compose down
```

## 📁 Project Structure

```
musicplayer/
├── backend/
│   ├── Dockerfile              # Docker image for backend
│   ├── db.json                 # Mock database
│   └── public/
│       ├── songs/              # Available songs
│       └── covers/             # Available covers
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # Reusable components
│   │   │   └── pages/          # Available pages
│   │   ├── hooks/              # Custom React hooks
│   │   ├── types/              # TypeScript type definitions
│   │   ├── App.tsx             # Main application component
│   │   └── main.tsx            # Application entry point
│   ├── Dockerfile              # Docker image for frontend
│   ├── package.json
│   ├── vite.config.ts          # Vite configuration
│   └── tsconfig.json           # TypeScript configuration
└── docker-compose.yml          # Docker Compose configuration
```

## 🎯 Key Implementation Highlights

- **Docker Containerization**: Easy deployment and consistent environment across different machines
- **React Query Integration**: Efficient data fetching with automatic caching and background updates
- **TypeScript**: Fully typed codebase for better developer experience and fewer runtime errors
- **Component Architecture**: Modular, reusable components following React best practices
- **Material UI Theming**: Consistent design system throughout the application
- **Vite Build Tool**: Fast HMR (Hot Module Replacement) and optimized production builds

## 🐳 Docker Configuration

The application uses Docker Compose to orchestrate multiple services:

- **Frontend**: React application served via Nginx on port 80
- **Backend**: JSON Server providing the mock API with songs and cover images

This setup ensures consistent behavior across development and production environments.
