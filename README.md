<div align="center">

# 🏏 WILLOW — Cricket Stadium Ticket Booking & Gate Verification Engine

**From the Willow to the Stadium Gate.**  
*Every Ball. Every Boundary. Live from the Stands.*

[![React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20TypeScript%20%7C%20Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS%203.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-00E599?style=for-the-badge)](https://github.com/Ujesh2104/Willow-)

</div>

---

## 📌 Executive Summary

**Willow** is a full-stack cricket stadium match ticket booking platform engineered for high-concurrency match fixtures. It solves high-traffic seat contention, multi-tab hoarding, and black-market ticket fraud through distributed seat reservation timers, single-device session enforcement, and dynamic rolling QR gate passes.

---

## ✨ Key Architectural Features

### 1. 🏟️ 100% Backend-Driven Dynamic Match Lifecycle
* **Clean-Slate Guarantee**: The public portal starts with zero hardcoded matches and displays an interactive empty state until fixtures are published by the stadium administrator.
* **Real-Time Synchronisation**: As soon as an Admin creates a match with custom stand pricing, it instantly appears live on the Public Homepage and Fan Portal.
* **1-Click Match Closure**: Finished matches can be closed and archived by the admin, automatically updating all active fan portals in real time.

### 2. 🔐 Role-Based Access Control (RBAC)
* **Fan Portal (`/dashboard`)**: Browse live matches, select seats on an interactive stadium map, auto-fill passenger details from a master list, and access secure digital ticket passes.
* **Admin Command Center (`/admin`)**: Create matches, configure 4 stadium wing tiers (Pavilion VIP, North Stand, East Stand, West Stand), monitor inventory, inspect registered fan identities, and dispatch ticket passes via email.

### 3. ⏳ 3-Minute Distributed Seat Locking
* When a fan selects seats and enters checkout, a distributed **180-second reservation lock** is enforced.
* Locked seats become temporarily unavailable to other users to prevent double-booking. If the reservation expires before payment, seats are immediately released back to the general inventory pool.

### 4. 🎟️ Dynamic Rolling QR Pass Vault
* Tickets feature rotating timestamp-hashed tokens that activate prior to the match, preventing static screenshot sharing and turnstile fraud.
* Equipped with an interactive **Gatekeeper Turnstile Terminal** for stadium gate staff to scan and admit fans with duplicate-attempt detection.

### 5. 👥 Pre-Saved Attendee Master List
* Fans can pre-save up to 4 family members or friends (Name, Age, Gender, Govt ID).
* During high-demand match checkouts, passenger details are auto-filled with a single click, allowing genuine fans to complete bookings in seconds.

### 6. 📱 Single Active Device Session Enforcement
* Restricts each verified user identity to 1 concurrent browser/device session. Duplicate logins automatically revoke older sessions to prevent multi-device bot farming.

---

## 🏗️ System Architecture & Monorepo Structure

```
Willow-/
├── backend/                  # Node.js / Express REST API
│   ├── src/
│   │   ├── controllers/      # Request handlers (auth, matches, bookings, admin)
│   │   ├── services/         # Business logic & seat locking engine
│   │   ├── routes/           # RESTful API endpoints
│   │   ├── data/             # In-memory database store & dynamic seat generator
│   │   └── server.js         # Server entry point (Port 5000)
│   └── package.json
│
├── frontend/                 # React 18 + TypeScript + Vite + TailwindCSS
│   ├── src/
│   │   ├── components/       # Stadium map, Navbar, Pass Vault, Scanner modals
│   │   ├── context/          # AuthContext (sessions) & BookingContext (locks/cart)
│   │   ├── pages/            # PublicHomePage, FanDashboard, AdminPage, Register, Login
│   │   ├── services/         # Typed API client bridge
│   │   ├── types/            # TypeScript data contracts
│   │   ├── App.tsx           # Primary view router & session revocation alerts
│   │   └── main.tsx
│   ├── public/images/        # High-definition widescreen stadium assets
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start & Installation

### Prerequisites
* [Node.js](https://nodejs.org/) (v18.0.0 or higher)
* [npm](https://www.npmjs.com/) (v9.0.0 or higher)
* [Git](https://git-scm.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/Ujesh2104/Willow-.git
cd Willow-
```

### 2. Launch Backend API
```bash
cd backend
npm install
npm start
```
*Backend server runs on `http://localhost:5000`.*

### 3. Launch Frontend Development Server
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
*Frontend application launches on `http://localhost:3000` (or Vite assigned port).*

---

## 🔑 Default Credentials for Testing

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Stadium Admin** | `admin@willow.com` | `admin123` | Full Match Management, Stand Pricing, CRM, Ticket Dispatch |
| **Verified Fan** | `fan@gmail.com` | `fan123` | Seat Booking, Waiting Room, Master Fan List, Pass Vault |

*(The Login page includes 1-Click quick login buttons for instant testing).*

---

## 📡 REST API Reference

### Authentication & Sessions
* `POST /api/auth/register` — Register a new verified fan account.
* `POST /api/auth/login` — Sign in and initialize an active device session.
* `POST /api/auth/save-fan` — Add a passenger to the fan master list.
* `DELETE /api/auth/remove-fan/:id` — Remove a passenger from the master list.

### Match & Seat Management
* `GET /api/matches` — Retrieve all active matches published by the admin.
* `GET /api/matches/:id/stands/:standId/seats` — Fetch real-time seat matrix with active lock states.

### Booking & Gate Turnstiles
* `POST /api/bookings/lock` — Acquire a 3-minute temporary reservation lock on up to 4 seats.
* `POST /api/bookings/create` — Confirm booking, assign passenger details, and issue digital passes.
* `POST /api/bookings/validate-gate-pass` — Validate dynamic ticket token at stadium turnstile.

### Administrator Operations
* `GET /api/admin/stats` — Real-time revenue, occupancy rate, and confirmed bookings overview.
* `POST /api/admin/matches` — Create and publish a new match fixture with stand pricing.
* `PUT /api/admin/matches/:id/stands` — Dynamically update stadium wing prices.
* `DELETE /api/admin/matches/:id` — Close and archive finished match bookings.
* `POST /api/admin/send-email` — Dispatch digital stadium pass directly to customer email.

---

## 🎨 Design System & Aesthetic Principles

* **Palette**: Dark stadium theme (`#060a08` base) with Willow Emerald (`#00E599`) and Electric Neon accents.
* **Atmosphere**: Ultra-HD widescreen panoramic cricket stadium backgrounds with smooth auto-cycling transitions.
* **Layout**: Fully responsive layout optimized for mobile screens, tablets, and desktop displays.
* **Zero 3D Distortion**: Clean, flat, modern glassmorphism panels with high text contrast and accessible typography.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
