# StockSimple — ניהול מלאי לעסקים קטנים

## About

**עברית:** StockSimple היא אפליקציית ניהול מלאי לעסקים קטנים. המערכת מאפשרת מעקב אחר מוצרים, דיווח על פחת, הזמנות מספקים דרך WhatsApp, וצפייה בדוחות — הכל בממשק פשוט ומהיר בעברית.

**English:** StockSimple is an inventory management web app for small businesses. It provides real-time stock tracking, waste reporting, supplier ordering via WhatsApp, and business analytics — all in a clean, mobile-first Hebrew interface.

---

## Live Demo

**URL:** https://stock-simple-beige.vercel.app

**Test credentials:**
- Email: `test@stocksimple.dev`
- Password: `Test1234!`

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite + Tailwind CSS v4 |
| Backend | Supabase (PostgreSQL + Auth + RLS) |
| Deployment | Vercel (CDN, automatic deploys) |
| Testing | Vitest — 46 unit tests |
| Routing | React Router v7 |

---

## Features

1. **Dashboard** — Live KPIs: total products, shortage count (qty = 0), and warning count (qty < min)
2. **Inventory Management** — Browse all products with real-time status badges (OK / Warning / Error), update quantities inline
3. **Add Product** — Form to create a product with name, quantity, minimum threshold, unit, category, and supplier
4. **Waste Reporting** — Log stock losses with reason and notes; automatically decrements product quantity in real time
5. **Supplier Orders via WhatsApp** — Groups all low-stock items by supplier and generates a pre-filled WhatsApp message sent directly to the supplier's phone
6. **Reports** — Business-level reports on inventory movement and waste over time
7. **Authentication** — Full auth flow: register, login, forgot password; every user is scoped to their own business via RLS
8. **Profile & Settings** — Manage user profile and business-level preferences

---

## Database Schema (ERD)

| Entity | Main Attributes |
|--------|----------------|
| `businesses` | id, name, owner_id, created_at |
| `profiles` | id (= auth.uid), full_name, business_id, created_at |
| `categories` | id, name, business_id |
| `suppliers` | id, name, phone, business_id |
| `products` | id, name, qty, min_qty, unit, category_id, supplier_id, business_id |
| `waste_reports` | id, product_id, qty, reason, notes, reported_by, business_id, created_at |
| `orders` | id, supplier_id, business_id, status, created_at |
| `order_items` | id, order_id, product_id, qty, unit |

All tables are protected by **Row Level Security (RLS)** — users can only access data belonging to their own business.

---

## External Services & Integrations

| Service | Type | Purpose |
|---------|------|---------|
| Supabase | BaaS | PostgreSQL database, Auth, RLS policies, Storage |
| Vercel | Hosting | Frontend deployment, global CDN, env var management |
| WhatsApp (wa.me) | Messaging | Deep-link to send pre-filled order messages to suppliers |

---

## Setup & Installation

### Prerequisites
- Node.js 18+
- A free [Supabase](https://supabase.com) project

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/Snir1812/StockSimple.git
cd StockSimple/stocksimple

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env and fill in your Supabase project URL and anon key:
# VITE_SUPABASE_URL=https://<your-project>.supabase.co
# VITE_SUPABASE_ANON_KEY=<your-anon-key>

# 4. Start the development server
npm run dev

# 5. Run the test suite
npm test
```

The app will be available at `http://localhost:5173`.

---

## Security

- **RLS enabled** on all 8 database tables — every query is automatically scoped to the authenticated user's business
- **Environment variables** store all secrets (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) — never hard-coded
- **No API keys in source code** — `.env` is git-ignored; `.env.example` contains only placeholder values
- **Auth handled by Supabase** — passwords are never stored or transmitted by the application

---

## Project Structure

```
StockSimple/
└── stocksimple/                  # React application (git root)
    ├── src/
    │   ├── __tests__/            # 46 Vitest unit tests
    │   │   ├── dashboard.test.js
    │   │   ├── orders.test.js
    │   │   ├── products.test.js
    │   │   └── waste.test.js
    │   ├── assets/               # Static images and icons
    │   ├── components/           # Shared UI components
    │   │   ├── Badge/
    │   │   ├── BottomNavBar/
    │   │   ├── Footer/
    │   │   ├── ProductCard/
    │   │   ├── SideNavBar/
    │   │   ├── StatCard/
    │   │   └── TopAppBar/
    │   ├── context/
    │   │   └── AuthContext.jsx   # Global auth state
    │   ├── lib/                  # Supabase data helpers
    │   │   ├── supabase.js
    │   │   ├── dashboard.js
    │   │   ├── inventory.js
    │   │   ├── orders.js
    │   │   └── waste.js
    │   └── pages/                # Route-level page components
    │       ├── LandingPage.jsx
    │       ├── LoginPage.jsx
    │       ├── RegisterPage.jsx
    │       ├── ForgotPasswordPage.jsx
    │       ├── DashboardPage.jsx
    │       ├── InventoryPage.jsx
    │       ├── AddProductPage.jsx
    │       ├── OrdersPage.jsx
    │       ├── WastePage.jsx
    │       ├── ReportsPage.jsx
    │       ├── SettingsPage.jsx
    │       └── ProfilePage.jsx
    ├── .env.example
    ├── package.json
    ├── vercel.json
    └── vite.config.js
```
