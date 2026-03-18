# ✦ Vishaknotes — Full Stack Notes Application

<div align="center">

![Vishaknotes Banner](https://img.shields.io/badge/Vishaknotes-Full%20Stack%20Notes%20App-a855f7?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyTDIgN2wxMCA1IDEwLTV6TTIgMTdsOSA0LjUgOS00LjV2LThsLTkgNC41TDIgOXoiLz48L3N2Zz4=)

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5-6DB33F?style=flat-square&logo=springboot)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-17-ED8B00?style=flat-square&logo=openjdk)](https://openjdk.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat-square&logo=mysql)](https://mysql.com/)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=flat-square&logo=jsonwebtokens)](https://jwt.io/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

**A production-grade, full-stack notes application with JWT authentication, premium dark/light mode, 16 card color themes, and pixel-perfect mobile responsiveness.**

[🚀 Live Demo](#) · [📖 Documentation](#table-of-contents) · [🐛 Report Bug](https://github.com/vishaldeshmukh34/Vishaknotes/issues) · [✨ Request Feature](https://github.com/vishaldeshmukh34/Vishaknotes/issues)

</div>

---

## 📋 Table of Contents

- [About The Project](#-about-the-project)
- [Screenshots](#-screenshots)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Database Schema](#-database-schema)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#-environment-variables)
- [How It Works](#-how-it-works)
- [Design System](#-design-system)
- [Security](#-security)
- [What I Learned](#-what-i-learned)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🎯 About The Project

**Vishaknotes** is a full-stack web application that allows authenticated users to create, manage, organize, and personalize their notes. Every user's notes are completely private and protected — only the authenticated owner can view, edit, or delete their notes.

### Why I Built This

I wanted to build something real — not just a tutorial clone. This project was my way of learning how a production application actually works end-to-end: from database design and REST APIs to JWT security and responsive UI design. Every feature was researched, implemented, debugged, and refined from scratch.

### Key Highlights

- 🔐 **Zero trust architecture** — JWT protects every protected endpoint
- 🎨 **16 unique card themes** — 8 dark + 8 light palettes
- 🌙 **True dual-identity design** — not just a color swap, two completely different aesthetics
- 📱 **Mobile-first** — bottom nav, FAB, responsive grid with zero CSS frameworks
- ⚡ **Real-time search** — no API calls, instant frontend filtering
- 💾 **Persistent preferences** — theme, view mode, dark/light all saved to localStorage

---

## 📸 Screenshots

### 🌙 Dark Mode
| Login Page | Notes Dashboard | Mobile View |
|---|---|---|
| Deep cosmic aesthetic | 16 card themes + mesh gradients | Bottom nav + FAB |

### ☀️ Light Mode
| Register Page | Notes Dashboard | Profile Modal |
|---|---|---|
| Clean editorial design | Soft pastel card themes | Stats + avatar upload |

---

## ✨ Features

### 🔐 Authentication & Security
- **User Registration** — email + username + password (BCrypt hashed, never stored plain)
- **User Login** — returns JWT token with 24-hour expiry
- **JWT Protected Routes** — every note endpoint requires a valid Bearer token
- **User Isolation** — accessing another user's note returns HTTP 403 Forbidden
- **Frontend Route Guards** — `ProtectedRoute` component redirects unauthenticated users to `/login`
- **Axios Interceptors** — auto-attaches `Authorization: Bearer {token}` to every request

### 📝 Notes Management (Full CRUD)
- **Create** notes with title and content
- **Read** all your notes in grid or list view
- **Update** any of your notes
- **Delete** notes with confirmation dialog
- **Toast notifications** on every action (saved / updated / deleted)

### 📌 Pin System
- Toggle pin on any note with one click
- Pinned notes auto-sort to the top of the grid
- Visual `◆ PINNED` badge on pinned cards
- Pin count displayed in sidebar and profile modal
- Toast notification on pin/unpin actions

### 🔍 Real-time Search
- Searches both **title** and **content** simultaneously
- Zero delay — purely frontend filtering, no extra API calls
- Clear (×) button appears when search is active
- Filter works across both All Notes and Pinned views
- Friendly empty state message when no results found

### 🌙 Dark / Light Mode — Two Design Identities
**Dark Mode — "Cosmic" Identity:**
- Deep space black `#0a0a14` base with animated floating orbs
- Subtle noise grain texture overlay for atmospheric depth
- 8 dark card themes with unique mesh gradient overlays
- Glowing accent dots that pulse per card theme

**Light Mode — "Editorial" Identity:**
- Soft lavender `#f7f5ff` base with gentle color blobs
- 8 light card themes with soft tinted backgrounds
- Subtle radial highlight on cards

**Toggle Features:**
- Animated sliding pill switch (🌙 moon / ☀️ sun)
- Available in: Header · Drawer Sidebar · Profile Modal · Mobile Bottom Nav
- Smooth 500ms CSS transition on mode switch
- Preference saved in `localStorage` — persists on page refresh

### 🎨 16 Card Color Themes
| Dark Mode (8 themes) | Light Mode (8 themes) |
|---|---|
| 🌌 Cosmos `#e2e2e2` | 📄 Paper `#6366f1` |
| 🔴 Crimson `#ff6b6b` | 🌸 Rose `#f43f5e` |
| 🔥 Ember `#ff9f43` | 🍊 Amber `#d97706` |
| 🌿 Forest `#34d399` | 🌿 Sage `#059669` |
| 🌊 Ocean `#45aaf2` | 💙 Azure `#2563eb` |
| 🔮 Nebula `#a29bfe` | 💜 Mauve `#7c3aed` |
| 🌸 Sakura `#fd79a8` | 🌺 Blush `#a21caf` |
| ⭐ Gold `#fbbf24` | 🩶 Dusk `#475569` |

Each dark-mode card also gets a **random mesh gradient overlay** — making every note visually unique.

### 📱 Full Mobile Responsiveness (Zero CSS Frameworks)
- **Bottom Navigation Bar** with 4 tabs: Notes · Pinned · Dark/Light Toggle · Profile
- **Floating Action Button (FAB)** — glowing purple button for adding new notes
- Desktop "New Note" button hidden on mobile (FAB takes over)
- Desktop hamburger menu hidden on mobile (bottom nav takes over)
- **Responsive grid**: 1-column mobile → 2-column tablet → 3+ column desktop
- Sticky glassmorphism header with `backdrop-filter: blur(24px)`

### ⊞ Grid & List View Toggle
- **Grid View**: `repeat(auto-fill, minmax(290px, 1fr))` — responsive card grid
- **List View**: Compact single-column rows with left accent bar
- View preference saved in `localStorage`
- Text clamped at 2-3 lines — no overflow, always clean

### 👤 Profile Page
- Upload custom avatar photo (FileReader API, stored in `localStorage`)
- View stats: Total notes · Pinned count · Themed count
- Dark/Light mode toggle with animated switch
- Username display + Sign out button

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React.js | 18 | UI library |
| Vite | 5 | Build tool & dev server |
| React Router DOM | 6 | Client-side routing + protected routes |
| Axios | 1.x | HTTP client + JWT interceptors |
| CSS (Pure) | — | Styling — zero frameworks |
| Syne Font | — | Display/heading typography |
| DM Sans Font | — | Body text typography |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Spring Boot | 3.5.11 | Application framework |
| Java | 17 | Programming language |
| Spring Security | 6 | JWT authentication filter chain |
| Spring Data JPA | — | ORM and database operations |
| Hibernate | 6.6 | JPA implementation |
| JJWT | 0.12.3 | JWT token generation & validation |
| Lombok | — | Boilerplate reduction (@Data, @Builder) |
| Maven | 3.x | Dependency & build management |

### Database
| Technology | Version | Purpose |
|---|---|---|
| MySQL | 8.0.44 | Relational database |
| HikariCP | — | Connection pooling |
| JPA/Hibernate | — | ORM with auto DDL |

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT SIDE                          │
│                                                             │
│  ┌─────────────┐    ┌──────────────┐    ┌───────────────┐  │
│  │  React App  │    │ Protected    │    │    Axios      │  │
│  │  localhost  │───▶│   Routes     │    │ Interceptor   │  │
│  │    :5173    │    │ (JWT check)  │    │ (add Bearer)  │  │
│  └─────────────┘    └──────────────┘    └───────┬───────┘  │
└────────────────────────────────────────────────-│───────────┘
                                                  │ HTTP Request
                                                  │ Authorization: Bearer {jwt}
┌─────────────────────────────────────────────────│───────────┐
│                       SERVER SIDE               │           │
│                                                 ▼           │
│  ┌──────────────┐    ┌──────────────┐    ┌───────────────┐ │
│  │  JwtFilter   │    │  Controller  │    │    Service    │ │
│  │ (validate    │───▶│  (REST API)  │───▶│  (business    │ │
│  │   token)     │    │  :8080       │    │    logic)     │ │
│  └──────────────┘    └──────────────┘    └───────┬───────┘ │
│                                                  │         │
│                                          ┌───────▼───────┐ │
│                                          │  Repository   │ │
│                                          │  (JPA/ORM)    │ │
│                                          └───────┬───────┘ │
└──────────────────────────────────────────────────│─────────┘
                                                   │ SQL
┌──────────────────────────────────────────────────│─────────┐
│                      DATABASE                    │         │
│                                                  ▼         │
│              ┌──────────┐      ┌──────────────┐           │
│              │  users   │◀────▶│    notes     │           │
│              │  table   │      │    table     │           │
│              └──────────┘      └──────────────┘           │
└─────────────────────────────────────────────────────────────┘
```

### Request Flow
1. User logs in → Spring Boot validates credentials → generates JWT token
2. React stores token in `localStorage`
3. Every subsequent request: Axios interceptor adds `Authorization: Bearer {token}`
4. `JwtFilter` (extends `OncePerRequestFilter`) validates token on every request
5. If token valid → sets `SecurityContextHolder` → request proceeds
6. If token invalid/missing → returns `401 Unauthorized`
7. Controllers use `SecurityContextHolder.getContext().getAuthentication().getName()` to get user email
8. All data operations are scoped to the authenticated user only

---

## 🗄 Database Schema

### `users` table
```sql
CREATE TABLE users (
    id       BIGINT        NOT NULL AUTO_INCREMENT,
    username VARCHAR(255)  NOT NULL UNIQUE,
    email    VARCHAR(255)  NOT NULL UNIQUE,
    password VARCHAR(255)  NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB;
```

### `notes` table
```sql
CREATE TABLE notes (
    id         BIGINT        NOT NULL AUTO_INCREMENT,
    title      VARCHAR(255)  NOT NULL,
    content    TEXT,
    created_at DATETIME(6),
    updated_at DATETIME(6),
    user_id    BIGINT        NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_notes_user
        FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;
```

### Entity Relationship
```
users                    notes
──────────               ──────────────────
id (PK)         1──────∞ id (PK)
username                 title
email                    content
password                 created_at
                         updated_at
                         user_id (FK → users.id)
```

> **Note:** Tables are auto-created by Hibernate with `ddl-auto: update`. You only need to create the database manually.

---

## 📡 API Documentation

### Base URL
```
http://localhost:8080/api
```

### Authentication Endpoints

#### Register New User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "vishal",
  "email": "vishal@example.com",
  "password": "password123"
}
```
**Response 200:**
```json
{
  "message": "User registered successfully!"
}
```
**Response 400 (duplicate):**
```json
{
  "message": "Email already exists!"
}
```

---

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "vishal@example.com",
  "password": "password123"
}
```
**Response 200:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ2aXNoYWxAZ...",
  "username": "vishal",
  "email": "vishal@example.com"
}
```

---

### Notes Endpoints
> ⚠️ All notes endpoints require: `Authorization: Bearer {token}`

#### Get All Notes
```http
GET /api/notes
Authorization: Bearer {token}
```
**Response 200:**
```json
[
  {
    "id": 1,
    "title": "My First Note",
    "content": "This is the content of my note",
    "createdAt": "2026-03-18T12:00:00",
    "updatedAt": "2026-03-18T12:00:00"
  }
]
```

---

#### Get Single Note
```http
GET /api/notes/{id}
Authorization: Bearer {token}
```
**Response 200:** Note object  
**Response 403:** `{ "message": "Access denied!" }` (if not your note)  
**Response 404:** Not found

---

#### Create Note
```http
POST /api/notes
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "My New Note",
  "content": "Write something worth remembering..."
}
```
**Response 200:** Created note object with id + timestamps

---

#### Update Note
```http
PUT /api/notes/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content..."
}
```
**Response 200:** Updated note object  
**Response 403:** Access denied (if not your note)

---

#### Delete Note
```http
DELETE /api/notes/{id}
Authorization: Bearer {token}
```
**Response 200:** `{ "message": "Note deleted successfully!" }`  
**Response 403:** Access denied (if not your note)

---

### API Summary Table
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | ❌ Public | Register new user |
| `POST` | `/api/auth/login` | ❌ Public | Login & get JWT |
| `GET` | `/api/notes` | ✅ JWT | Get all your notes |
| `GET` | `/api/notes/{id}` | ✅ JWT | Get single note |
| `POST` | `/api/notes` | ✅ JWT | Create note |
| `PUT` | `/api/notes/{id}` | ✅ JWT | Update note |
| `DELETE` | `/api/notes/{id}` | ✅ JWT | Delete note |

---

## 📁 Project Structure

```
vishaknotes/
│
├── 📁 backend/                          ← Spring Boot Application
│   ├── 📁 src/main/java/com/notesapp/backend/
│   │   ├── 📁 config/
│   │   │   ├── JwtUtil.java             ← JWT generate/validate/extract
│   │   │   ├── JwtFilter.java           ← OncePerRequestFilter implementation
│   │   │   └── SecurityConfig.java      ← SecurityFilterChain + CORS config
│   │   ├── 📁 controller/
│   │   │   ├── AuthController.java      ← POST /register, POST /login
│   │   │   └── NoteController.java      ← Full CRUD for notes
│   │   ├── 📁 model/
│   │   │   ├── User.java                ← @Entity users table
│   │   │   └── Note.java                ← @Entity notes table
│   │   ├── 📁 repository/
│   │   │   ├── UserRepository.java      ← findByEmail, existsByEmail
│   │   │   └── NoteRepository.java      ← findByUser
│   │   ├── 📁 service/                  ← Business logic layer (extensible)
│   │   └── BackendApplication.java      ← @SpringBootApplication entry point
│   ├── 📁 src/main/resources/
│   │   └── application.properties       ← DB config, JWT secret, port
│   └── pom.xml                          ← Maven dependencies
│
├── 📁 frontend/                         ← React + Vite Application
│   ├── 📁 src/
│   │   ├── 📁 api/
│   │   │   └── axios.js                 ← Axios instance + JWT interceptor
│   │   ├── 📁 utils/
│   │   │   └── auth.js                  ← saveAuth, getToken, logout helpers
│   │   ├── 📁 pages/
│   │   │   ├── 📁 auth/
│   │   │   │   ├── Login.jsx            ← Login page (dark luxury split layout)
│   │   │   │   └── Register.jsx         ← Register page with password strength
│   │   │   └── 📁 notes/
│   │   │       └── NotesList.jsx        ← Main notes page (all features)
│   │   ├── 📁 components/               ← Reusable components (extensible)
│   │   ├── App.jsx                      ← Router + ProtectedRoute
│   │   ├── main.jsx                     ← ReactDOM entry point
│   │   └── index.css                    ← Global reset styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have these installed:

| Tool | Version | Download |
|---|---|---|
| Java JDK | 17+ | [Adoptium](https://adoptium.net/) |
| Node.js | 18+ | [nodejs.org](https://nodejs.org/) |
| MySQL | 8.0+ | [mysql.com](https://dev.mysql.com/downloads/) |
| Maven | 3.8+ | Included with Spring Boot (mvnw) |
| Git | Any | [git-scm.com](https://git-scm.com/) |

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/vishaldeshmukh34/Vishaknotes.git
cd Vishaknotes
```

---

### Backend Setup

#### Step 2 — Create MySQL Database

Open MySQL command line and run:

```sql
CREATE DATABASE notesapp;
USE notesapp;
```

> ✅ That's it! Hibernate will auto-create the `users` and `notes` tables on first run.

#### Step 3 — Configure Application Properties

Open `backend/src/main/resources/application.properties` and update:

```properties
# ── DATABASE ──────────────────────────────────
spring.datasource.url=jdbc:mysql://localhost:3306/notesapp
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD_HERE

# ── JPA / HIBERNATE ───────────────────────────
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
spring.jpa.open-in-view=false

# ── SERVER ────────────────────────────────────
server.port=8080

# ── JWT ───────────────────────────────────────
jwt.secret=notesapp_super_secret_key_123456789_abcdefgh
jwt.expiration=86400000
```

> ⚠️ Replace `YOUR_MYSQL_PASSWORD_HERE` with your actual MySQL password

#### Step 4 — Run the Backend

```bash
cd backend

# Windows
mvnw spring-boot:run

# Mac/Linux
./mvnw spring-boot:run
```

✅ You should see:
```
Started BackendApplication in 3.5 seconds (JVM running for 4.0)
Tomcat started on port 8080
```

---

### Frontend Setup

#### Step 5 — Install Dependencies

```bash
cd frontend
npm install
```

#### Step 6 — Run the Frontend

```bash
npm run dev
```

✅ Open your browser at: **http://localhost:5173**

---

### Step 7 — Test the App

1. Go to `http://localhost:5173/register`
2. Create a new account
3. Login with your credentials
4. Start creating notes! 🎉

---

## 🔑 Environment Variables

### Backend (`application.properties`)

| Property | Description | Default |
|---|---|---|
| `spring.datasource.url` | MySQL connection URL | `jdbc:mysql://localhost:3306/notesapp` |
| `spring.datasource.username` | MySQL username | `root` |
| `spring.datasource.password` | MySQL password | — |
| `spring.jpa.hibernate.ddl-auto` | Table creation mode | `update` |
| `server.port` | Backend port | `8080` |
| `jwt.secret` | JWT signing secret (min 32 chars) | — |
| `jwt.expiration` | JWT expiry in milliseconds | `86400000` (24hr) |

### Frontend — No `.env` needed
The API base URL is configured directly in `src/api/axios.js`:
```javascript
baseURL: 'http://localhost:8080/api'
```

---

## 🔒 How It Works

### JWT Authentication Flow

```
1. Register:
   POST /api/auth/register
   → Validate uniqueness → BCrypt hash password → Save to DB → Return success

2. Login:
   POST /api/auth/login
   → Find user by email → BCryptPasswordEncoder.matches() → Generate JWT → Return token

3. Protected Request:
   GET /api/notes
   → JwtFilter intercepts → Extract "Bearer {token}" → JwtUtil.validateToken()
   → Extract email → Set SecurityContextHolder → Controller proceeds
   → NoteRepository.findByUser(currentUser) → Return only THIS user's notes
```

### BCrypt Password Hashing
Passwords are never stored in plain text. BCrypt applies a one-way hash with a random salt:
```java
// On register:
user.setPassword(passwordEncoder.encode(body.get("password")));

// On login:
passwordEncoder.matches(rawPassword, hashedPassword); // true/false
```

### User Data Isolation
Every note operation verifies ownership:
```java
// Get logged-in user from JWT
String email = SecurityContextHolder.getContext()
    .getAuthentication().getName();
User user = userRepository.findByEmail(email).orElseThrow();

// Query only THIS user's notes
List<Note> notes = noteRepository.findByUser(user);

// For single note — check ownership
if (!note.getUser().getId().equals(user.getId())) {
    return ResponseEntity.status(403)
        .body(Map.of("message", "Access denied!"));
}
```

---

## 🎨 Design System

### Typography
| Font | Usage | Source |
|---|---|---|
| **Syne** (800 weight) | Headings, logo, card titles | Google Fonts |
| **DM Sans** (400/500/600) | Body text, descriptions, labels | Google Fonts |
| **JetBrains Mono** | Code, timestamps | Google Fonts |

### Color Tokens (Dark Mode)
```javascript
const D = {
  pageBg:    '#07070f',  // Deep space black
  surface:   '#11111f',  // Card surfaces
  border:    'rgba(255,255,255,0.07)',
  t1:        '#f0ecff',  // Primary text
  t2:        '#6b6490',  // Secondary text
  accent:    '#a855f7',  // Purple accent
  accentAlt: '#06b6d4',  // Cyan accent
  danger:    '#f87171',  // Red for delete
  success:   '#34d399',  // Green for success
}
```

### Color Tokens (Light Mode)
```javascript
const D = {
  pageBg:    '#f7f5ff',  // Soft lavender
  surface:   '#ffffff',  // Pure white cards
  border:    'rgba(124,58,237,0.1)',
  t1:        '#1e1340',  // Deep purple-black
  t2:        '#8b7bb0',  // Muted purple-gray
  accent:    '#7c3aed',  // Deep purple
  accentAlt: '#0ea5e9',  // Sky blue
  danger:    '#e11d48',  // Rose red
  success:   '#059669',  // Emerald green
}
```

### CSS Animations Used
| Animation | Usage |
|---|---|
| `fadeUp` | Page load card stagger |
| `cardPop` | Note cards appearing |
| `drawerIn` | Sidebar slide |
| `toastPop` | Toast notifications |
| `glowPulse` | FAB button, logo icon |
| `orbFloat` | Background atmospheric orbs |
| `shimmer` | Logo gradient text |
| `spin` | Loading spinner |

---

## 🔐 Security

| Concern | Solution |
|---|---|
| Password storage | BCrypt hash (cost factor 10, random salt) |
| Token forgery | HMAC-SHA256 signed JWT |
| Token expiry | 24-hour expiry (`86400000ms`) |
| Cross-user access | Owner check on every note operation |
| CORS | Configured for `localhost:5173` only |
| Session | Stateless — `SessionCreationPolicy.STATELESS` |
| CSRF | Disabled (JWT-based, no cookies) |

### Production Recommendations
- ⚠️ Change `jwt.secret` to a strong random string (min 64 chars)
- ⚠️ Store secrets in environment variables, not `application.properties`
- ⚠️ Enable HTTPS in production
- ⚠️ Update CORS `allowedOrigins` to your production domain
- ⚠️ Consider reducing JWT expiry for sensitive applications

---

## 💡 What I Learned

### Backend
- **Spring Security 6** — SecurityFilterChain configuration, custom `OncePerRequestFilter`, stateless session management
- **JWT implementation** — Token generation with JJWT 0.12.3, claims extraction, signature validation
- **CORS setup** — Allowing cross-origin requests between different ports (5173 → 8080)
- **JPA relationships** — `@ManyToOne`, `@JoinColumn`, `@PrePersist`, `@PreUpdate` lifecycle hooks
- **BCrypt** — One-way password hashing with `BCryptPasswordEncoder`
- **HikariCP** — Connection pooling for MySQL

### Frontend
- **React Router v6** — Nested routes, `<Navigate>`, protected route pattern
- **Axios interceptors** — Auto-attaching JWT without repeating headers in every request
- **CSS design tokens** — Building a theming system with a single object swap
- **CSS Grid** — `repeat(auto-fill, minmax(290px, 1fr))` for responsive layouts without media queries
- **localStorage** — Managing auth state, preferences, and note metadata client-side
- **FileReader API** — Converting image files to base64 for avatar storage

### Architecture
- **Separation of concerns** — Controller → Service → Repository layers
- **Stateless authentication** — Each request is independently authenticated via JWT
- **User data isolation** — Querying data scoped to the authenticated user
- **Frontend-backend decoupling** — React can be deployed independently from Spring Boot

---

## 🗺 Roadmap

### Version 1.1
- [ ] Note categories / folders
- [ ] Rich text editor (bold, italic, bullet lists)
- [ ] Note color customization (currently per-theme)
- [ ] Drag-and-drop note reordering

### Version 1.2
- [ ] Note sharing (view-only link)
- [ ] Export notes as PDF
- [ ] Note character/word count
- [ ] Auto-save with debounce

### Version 2.0
- [ ] Backend deployment (Railway / Render)
- [ ] Frontend deployment (Vercel / Netlify)
- [ ] PostgreSQL support (in addition to MySQL)
- [ ] Email verification on register
- [ ] Password reset via email
- [ ] Refresh token rotation

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/AmazingFeature`
3. **Commit** your changes: `git commit -m 'Add some AmazingFeature'`
4. **Push** to the branch: `git push origin feature/AmazingFeature`
5. **Open** a Pull Request

### Reporting Bugs
Open an issue at [github.com/vishaldeshmukh34/Vishaknotes/issues](https://github.com/vishaldeshmukh34/Vishaknotes/issues) with:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

```
MIT License — you are free to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of this software.
```

---

## 📬 Contact

**Vishal Deshmukh**

[![GitHub](https://img.shields.io/badge/GitHub-vishaldeshmukh34-181717?style=flat-square&logo=github)](https://github.com/vishaldeshmukh34)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=flat-square&logo=linkedin)](https://linkedin.com/in/vishaldeshmukh34)

**Project Link:** [https://github.com/vishaldeshmukh34/Vishaknotes](https://github.com/vishaldeshmukh34/Vishaknotes)

---

## ⭐ Show Your Support

If this project helped you learn something new, please give it a **⭐ star** on GitHub!

It motivates me to keep building and sharing. 🙌

---

<div align="center">

**Built with 💜 by Vishal Deshmukh**

*"Theory only gets you so far. Projects teach you EVERYTHING."*

</div>
