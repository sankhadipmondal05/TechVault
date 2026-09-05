<div align="center">

# ⚡ TechVault

### Curated Technical Learning Library & Revision Portal

[![Live Demo](https://img.shields.io/badge/Live%20Demo-vault--one--blush.vercel.app-7047eb?style=for-the-badge&logo=vercel&logoColor=white)](https://vault-one-blush.vercel.app/)
[![Portfolio](https://img.shields.io/badge/Author-Sankhadip%20Mondal-24292e?style=for-the-badge&logo=github&logoColor=white)](https://sankhadipmondal.vercel.app/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React 18](https://img.shields.io/badge/React%2018-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB%20Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

<p align="center">
  <strong>A high-performance, privacy-first full-stack technical education hub aggregating world-class engineering lectures into structured curricula and high-yield one-shot revision marathons.</strong>
</p>

[Explore Live Demo](https://vault-one-blush.vercel.app/) • [Case Study](./TechVault_Case_Study.txt) • [Interview Cheat Sheet](./INTERVIEW_PREP.md) • [Report Bug](https://github.com/sankhadipmondal05/TechVault/issues)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Design Philosophy & UI](#-design-philosophy--ui)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Database Models](#-database-models)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Seeding](#database-seeding)
  - [Running the Application](#running-the-application)
- [API Reference](#-api-reference)
- [Author & License](#-author--license)

---

## 🌟 Overview

**TechVault** solves the fragmentation and distraction inherent in self-taught software engineering. While platforms like YouTube host exceptional university lectures and masterclasses from world-renowned educators, content is frequently lost in algorithmic rabbit holes, split across broken playlists, or bloated with clickbait.

TechVault curates and structures these lectures into complete, cohesive tracks (Data Structures, System Design, Operating Systems, Machine Learning, Web Engineering, and DevOps), accompanied by an **Automated 92% Video Completion Engine** and a **Zero-Auth client persistence model**.

---

## ✨ Key Features

- 🔒 **Zero-Auth, Frictionless Onboarding**:
  - No signups, no passwords, and zero tracking cookies.
  - Progress tracking, completed lessons, and bookmarks persist instantly via resilient client-side `localStorage`.
- ⏱️ **Automated 92% Progress Engine**:
  - Integrates the official **YouTube IFrame Player API** to measure live playback duration.
  - Automatically marks lessons complete when the student crosses the $\ge 92\%$ completion threshold, recalculating module and course progression without stopping playback.
- 📚 **Structured Curricula & Modules**:
  - Multi-level courses organized chronologically into sequential modules, complete with instructor credits, duration timestamps, and curated resource links.
  - **High-Yield Markers**: Highlights must-watch lessons for high-impact exam or interview review.
- ⚡ **High-Yield One-Shot Marathons**:
  - Dedicated repository of comprehensive, multi-hour one-shot revision lectures tailored for quick turnaround before technical interviews or semester finals.
- 🎨 **Tactile Clay Neumorphic UI**:
  - Fully custom design system featuring convex raised cards, concave inset wells, debossed text shadows, kinetic floating spheres, and an ambient violet accent glow.
- 🔍 **Live Search & Dynamic Category Filtering**:
  - Fast client and server search across technical subjects, instructor names, levels (Beginner, Intermediate, Advanced), and duration.
- 📱 **Mobile-First & Fully Responsive**:
  - Seamless layout adaptation with proportional hero geometries, responsive clock sculptures, and touch-friendly controls.

---

## 🎨 Design Philosophy & UI

TechVault embraces modern **Neumorphism (Soft Clay UI)** to recreate the sensory tactility of physical learning devices while preserving readability and speed:

```
┌─────────────────────────────────────────────────────────────┐
│  Convex Card (.neu-card)        Concave Sunken (.neu-inset)  │
│  ┌───────────────────────────┐  ┌────────────────────────┐  │
│  │ ╭───────────────────────╮ │  │ ╭────────────────────╮ │  │
│  │ │ Raised Tactile Surface│ │  │ │ Inset Progress Well│ │  │
│  │ ╰───────────────────────╯ │  │ ╰────────────────────╯ │  │
│  └───────────────────────────┘  └────────────────────────┘  │
│                                                             │
│  Debossed Indented Typography    Kinetic Orbit Sculptures   │
│  .neu-text-indent                Submerged Clock & Spheres   │
└─────────────────────────────────────────────────────────────┘
```

- **Tokens**: Soft light-mode dual box shadows with calibrated light and dark offsets.
- **Accents**: Electric violet gradient (`from-[#7047eb] via-[#855fed] to-[#9066ff]`).
- **Feedback**: Active press micro-animations (`neu-btn` active states, smooth scale transitions).

---

## 🏗️ System Architecture

```
                                  TECHVAULT ARCHITECTURE
                                  
   ┌───────────────────────────────────────────────────────────────────────────┐
   │                         Client Application (Vercel)                       │
   │                                                                           │
   │   ┌─────────────────────┐   ┌──────────────────────┐   ┌──────────────┐   │
   │   │   React 18 + Vite   │   │  Neumorphic Design   │   │  Zero-Auth   │   │
   │   │     TypeScript      │   │   Tailwind + Lucide  │   │ LocalStorage │   │
   │   └──────────┬──────────┘   └──────────────────────┘   └──────┬───────┘   │
   └──────────────┼────────────────────────────────────────────────┼───────────┘
                  │ Axios REST Calls                               │ Synchronous
                  ▼                                                ▼ Local Cache
   ┌────────────────────────────────────────────────────────┐  ┌───────────────┐
   │                   Backend API (Render)                 │  │ Instant Local │
   │                                                        │  │ State Updates │
   │   ┌────────────────────────────────────────────────┐   │  └───────────────┘
   │   │     Node.js + Express REST API (TypeScript)    │   │
   │   │  • Helmet Security   • Express Rate Limiting   │   │
   │   │  • Morgan Logger     • CORS Allowlist Rules    │   │
   │   └───────────────────────┬────────────────────────┘   │
   └───────────────────────────┼────────────────────────────┘
                               │ Mongoose ODM
                               ▼
   ┌───────────────────────────────────────────────────────────────────────────┐
   │                          Database (MongoDB Atlas)                         │
   │                                                                           │
   │   ┌───────────────────┐    ┌───────────────────┐    ┌─────────────────┐   │
   │   │      Courses      │    │     One-Shots     │    │    Subjects     │   │
   │   │ (Nested Modules & │    │  (Revision Videos │    │   & Categories  │   │
   │   │  Lessons Schemas) │    │   & Tag Search)   │    │  (Disciplines)  │   │
   │   └───────────────────┘    └───────────────────┘    └─────────────────┘   │
   └───────────────────────────────────────────────────────────────────────────┘
```

---

## 💻 Tech Stack

| Layer | Technologies | Role & Purpose |
|---|---|---|
| **Frontend** | React 18, TypeScript, Vite | Ultra-fast SPA development, strict type safety, fast page loads |
| **Styling** | Tailwind CSS, Lucide Icons | Utility styling combined with handcrafted Neumorphic CSS classes |
| **Media Player** | YouTube IFrame Player API | Dynamic iframe player lifecycle with decoupled `useRef` polling |
| **State & Storage** | LocalStorage API + React Hooks | Instant zero-auth progress sync, favorites, and resume flags |
| **Backend** | Node.js, Express.js, TypeScript | Modular REST controllers, route validation, error handling |
| **Security** | Helmet, CORS, Rate Limiters | Production-grade HTTP headers and request throttling |
| **Database** | MongoDB Atlas, Mongoose | Hierarchical schemas, compound search indexes, fast queries |
| **Deployments** | Vercel (Client), Render (API) | Global edge CDN caching and scalable container hosting |

---

## 🗄️ Database Models

### 1. `Course`
- **Fields**: `title`, `slug`, `instructor`, `description`, `thumbnail`, `level`, `language`, `totalLessons`, `totalDuration`, `isFeatured`, `categorySlug`, `subjectSlug`.
- **Nested `modules` array**:
  - `title`, `description`, `order`.
  - **`lessons` array**: `title`, `youtubeVideoId`, `duration`, `important` (High-Yield flag), `resources` (`title`, `url`).

### 2. `OneShot`
- **Fields**: `title`, `slug`, `instructor`, `youtubeVideoId`, `duration`, `level`, `subjectSlug`, `tags`, `isFeatured`, `viewCount`.

### 3. `Subject` & `Category`
- Groupings for technical disciplines (Computer Science, Data Science & AI, Core Engineering, System Design & DevOps).

---

## 📁 Project Structure

```
TechVault/
├── package.json               # Root workspace runner (concurrently scripts)
├── README.md                  # Main project documentation
├── TechVault_Case_Study.txt   # Structured engineering case study
├── INTERVIEW_PREP.md          # Technical interview cheat sheet
│
├── client/                    # React 18 + Vite SPA
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── src/
│       ├── components/
│       │   ├── common/        # Buttons, Badges, Modals, Progress bars
│       │   ├── courses/       # Course cards, Video player, Module accordion
│       │   ├── layout/        # Navbar, Footer, SearchBar
│       │   └── oneshots/      # One-shot cards, category pills
│       ├── pages/             # HomePage, CourseDetailPage, ExplorePage, etc.
│       ├── services/          # Axios API client & localStorage helpers
│       ├── types/             # TypeScript domain interfaces
│       └── index.css          # Neumorphic clay utilities & keyframe animations
│
└── server/                    # Node.js + Express API
    ├── package.json
    ├── tsconfig.json
    └── src/
        ├── config/            # DB connection & environment variables
        ├── controllers/       # Course, OneShot, Subject controllers
        ├── middleware/        # Error handler, rate limiters
        ├── models/            # Mongoose schemas (Course, OneShot, Subject)
        ├── routes/            # REST API endpoints
        ├── scripts/           # seed.ts database populator
        └── server.ts          # Server entry point & Express setup
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: A running local MongoDB instance or a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) connection URI.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sankhadipmondal05/TechVault.git
   cd TechVault
   ```

2. **Install all dependencies** (root, client, and server):
   ```bash
   # Install root dependencies
   npm install

   # Install server & client dependencies
   cd server && npm install
   cd ../client && npm install
   cd ..
   ```

### Environment Variables

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/technical-learning-platform
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

*(Optional)* Create a `.env` file in the `client` directory if overriding default API base URLs:
```env
VITE_API_URL=http://localhost:5000/api
```

### Database Seeding

Populate your database with curated courses, one-shots, and technical subjects:

```bash
# Run seed script from root
npm run seed

# Or run directly inside the server folder
cd server && npm run seed
```

### Running the Application

Run both frontend and backend concurrently in development mode from the root directory:

```bash
npm run dev
```

- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`
- **API Health Check**: `http://localhost:5000/api/health`

---

## 📡 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status |
| `GET` | `/api/courses` | List courses with pagination, search, and category filters |
| `GET` | `/api/courses/featured` | Fetch high-yield featured courses |
| `GET` | `/api/courses/:slug` | Retrieve complete course details with nested modules & lessons |
| `GET` | `/api/one-shots` | List one-shot revision videos with filters |
| `GET` | `/api/one-shots/featured` | Fetch featured one-shots |
| `GET` | `/api/one-shots/:slug` | Retrieve single one-shot details |
| `GET` | `/api/subjects` | List technical subjects grouped by category |
| `GET` | `/api/subjects/:slug` | Retrieve subject details with related courses & one-shots |
| `GET` | `/api/search` | Global unified search across courses, one-shots, and subjects |

---

## 👨‍💻 Author & Attribution

- **Developed by**: [Sankhadip Mondal](https://sankhadipmondal.vercel.app/)
- **Live Application**: [TechVault on Vercel](https://vault-one-blush.vercel.app/)
- **GitHub**: [@sankhadipmondal05](https://github.com/sankhadipmondal05)

### Attribution
All lecture video content is embedded from and hosted by **YouTube**. Video creators and educators retain all intellectual property rights, views, and monetization.

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).
