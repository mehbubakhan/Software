# Smart Nanny Platform — Implementation Plan
> Last updated: 2026-06-03 | DB: Railway (zephyr proxy, port 17102) | Backend PORT: 5001

---

## Project Overview

**Stack:** React (Vite/CRA) frontend + Node.js/Express backend + MySQL (Railway)  
**Key Roles:** Parent · Nanny · Daycare · Admin · Adoption staff · Marketplace Seller  
**Current DB:** Railway MySQL via `zephyr.proxy.rlwy.net:17102`  
**API base:** `http://localhost:5001/api` (frontend hardcoded to port 5000 — needs update)

---

## 🚨 IMMEDIATE FIX (Do First)

### Fix frontend API port mismatch
- **File:** `src/services/api.js` line 3
- Change fallback port from `5000` → `5001`
- ```js
  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5001/api'
  ```

---

## Tier 1 — Critical Fixes (High Impact, Quick Wins)

| # | Task | File(s) | Status |
|---|------|---------|--------|
| 1 | **Fix API port** — frontend calls port 5000, backend runs on 5001 | `src/services/api.js` | ❌ Todo |
| 2 | **Add DB fallback to remaining controllers** — `activityController`, `admissionController`, `childController`, `jobController`, `safetyController`, `messagingController` have no try/catch mock data | `backend/controllers/*` | ❌ Todo |
| 3 | **Parent Profile Save** — currently uses `alert()`, already wired to `/families/my/profile` but save fails silently; replace alerts with toast notifications | `src/pages/dashboard/ParentDashboard.jsx` (ProfileView) | ❌ Todo |
| 4 | **FamilySchedule route** — `FamilySchedule.jsx` exists and is already routed at `schedule` path in ParentDashboard ✅ — verify it renders correctly | `src/pages/dashboard/parent/FamilySchedule.jsx` | ✅ Already done |
| 5 | **JobRequests & Interviews** — pages exist and are routed ✅ — verify backend endpoints (`/jobs` route) are wired | `src/pages/dashboard/parent/JobRequests.jsx` | ✅ Routed |

---

## Tier 2 — High Priority (Backend Wiring)

| # | Task | File(s) | Status |
|---|------|---------|--------|
| 6 | **Daycare Booking approve/reject** — buttons in BookingManagement.jsx call no API | `src/pages/dashboard/daycare/BookingManagement.jsx` + `backend/controllers/daycareController.js` | ❌ Todo |
| 7 | **Daycare Staff CRUD** — Add/edit/delete buttons in StaffManagement.jsx are non-functional | `src/pages/dashboard/daycare/StaffManagement.jsx` + `daycareController.js` | ❌ Todo |
| 8 | **Marketplace Seller product CRUD** — hardcoded product arrays; wire add/edit/delete to backend | `src/pages/dashboard/MarketplaceSellerDashboard.jsx` + `marketplaceController.js` | ❌ Todo |
| 9 | **Marketplace order status save** — "Save Status" button has no API call | `MarketplaceSellerDashboard.jsx` | ❌ Todo |
| 10 | **Nanny Payments** — static mock data, no DB/API call | `src/pages/dashboard/nanny/Payments.jsx` + `nannyController.getPayments` | ⚠️ Has mock endpoint |
| 11 | **Nanny Settings persistence** — 29KB page, nothing saves | `src/pages/dashboard/nanny/Settings.jsx` | ❌ Todo |
| 12 | **Messaging (basic REST)** — all message UIs are static; add in-memory message store with REST polling | `backend/controllers/messagingController.js` + frontend | ❌ Todo |

---

## Tier 3 — Medium Priority (Feature Gaps)

| # | Task | File(s) | Status |
|---|------|---------|--------|
| 13 | **Admin Dashboard expand** — sidebar links for Organizations, Admissions, Children, Safety, Support have no content panels | `src/pages/dashboard/AdminDashboard.jsx` | ❌ Todo |
| 14 | **Child Mode PIN validation** — currently uses raw `prompt()` to accept any input | `src/pages/dashboard/ChildDashboard.jsx` | ❌ Todo |
| 15 | **Notifications system** — all hardcoded; build shared in-memory store triggered by real actions | `backend/` + all dashboards | ❌ Todo |
| 16 | **GPS / Safety map** — SafetyMonitoring.jsx has placeholder; add Leaflet mock map with safe-zone | `src/pages/dashboard/parent/SafetyMonitoring.jsx` | ❌ Todo |
| 17 | **Video Library** — Child dashboard video page needs embedded educational content | `src/pages/dashboard/child/` | ❌ Todo |
| 18 | **Daycare CCTV page** — placeholder text; add mock camera feed grid | `src/pages/dashboard/daycare/` | ❌ Todo |
| 19 | **Report generation** — "Generate Final Report" (Adoption), "Open Full Analytics" (Admin) are non-functional | `AdoptionDashboard.jsx`, `AdminDashboard.jsx` | ❌ Todo |

---

## Tier 4 — Polish & UX

| # | Task | File(s) | Status |
|---|------|---------|--------|
| 20 | **Home page** — current `Home.jsx` is a basic card; `Welcome.jsx` is a beautiful animated page — swap them or merge | `src/pages/Home.jsx` ↔ `src/pages/Welcome.jsx` | ❌ Todo |
| 21 | **Design unification** — Parent uses dark `#0B0E14`, Nanny uses white, Admin uses `bg-slate-50`, Daycare uses white; define one design token system | All dashboards | ❌ Todo |
| 22 | **Loading skeletons** — pages that fetch from API show nothing while loading | All dashboard pages | ❌ Todo |
| 23 | **Error toast notifications** — API failures silently log to console | All pages using `api.js` | ❌ Todo |
| 24 | **Responsive mobile sidebar** — Nanny dashboard uses its own sidebar with possible mobile gaps | `src/pages/dashboard/NannyDashboard.jsx` | ❌ Todo |
| 25 | **SEO meta tags** — no `<title>` or `<meta>` per page | All pages | ❌ Todo |

---

## Architecture Notes

### Backend Controllers State

| Controller | Has DB Fallback? | Notes |
|---|---|---|
| `authController.js` | ✅ | Full DB implementation |
| `adminController.js` | ✅ | In-memory mock only (no DB attempt) |
| `adoptionController.js` | ✅ | DB with mock fallback |
| `daycareController.js` | ✅ | DB with mock fallback (mock returns empty `[]`) |
| `nannyController.js` | ✅ | DB with mock fallback |
| `marketplaceController.js` | ✅ | DB with mock fallback |
| `dashboardController.js` | ✅ | DB with mock fallback |
| `familyController.js` | ✅ | DB with mock fallback |
| `sosController.js` | ⚠️ | No fallback — DB must be live |
| `activityController.js` | ❌ | Missing try/catch |
| `admissionController.js` | ❌ | Missing try/catch |
| `childController.js` | ❌ | Missing try/catch |
| `jobController.js` | ❌ | Missing try/catch |
| `safetyController.js` | ❌ | Minimal stub, no mock |
| `messagingController.js` | ❌ | Missing try/catch |

### Frontend Routing Status

| Route | Component | Status |
|---|---|---|
| `/dashboard/parent/schedule` | `FamilySchedule.jsx` | ✅ Wired |
| `/dashboard/parent/job-requests` | `JobRequests.jsx` | ✅ Wired |
| `/dashboard/parent/interviews` | `Interviews.jsx` | ✅ Wired |
| `/dashboard/parent/messages` | `MessagesView` (inline) | ⚠️ Static mock |
| `/dashboard/parent/notifications` | `NotificationsView` (inline) | ⚠️ Static mock |
| `/dashboard/parent/settings` | `SettingsView` (inline) | ⚠️ No persistence |

---

## Recommended Execution Order

```
Phase 1 (Today):
  [1] Fix API port 5000 → 5001
  [2] Add DB fallback to 6 controllers missing try/catch

Phase 2 (Next):
  [6] Daycare Booking approve/reject wiring
  [7] Daycare Staff CRUD wiring
  [8–9] Marketplace Seller product & order CRUD

Phase 3:
  [13] Admin Dashboard section expansion
  [14] Child Mode PIN validation
  [20] Home page → Welcome page swap
  [23] Error toast system

Phase 4 (Polish):
  [21] Design token unification
  [22] Loading skeletons
  [25] SEO meta tags
```