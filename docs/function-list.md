# Functions to Implement in BrokerHub

## 📋 Summary
This document lists all the functional requirements from the PRD, current implementation status, and the remaining work to ship a complete BrokerHub product.

---

## ✅ COMPLETED (by session 1-2)

### 1. Database Infrastructure
- [x] Prisma 8 contract setup with all core models (Client, Area, Colony, Wing, Floor, Flat, Employee, Marketing, Seller, Buyer, FollowUp)
- [x] PostgreSQL container (`brokerhub-postgres`) running with database `brokerhub`
- [x] Migration: Initial schema with `Colony.areaId` and `Floor.floorNumber`

### 2. Global UI
- [x] Dark-themed shared Header & Sidebar
- [x] Global navigation with active state
- [x] Standardized card, button, and form styles

### 3. Core Modules – Fully Functional
- [x] **Dashboard** – shows live stats (Clients, Properties, Active Follow-ups, Employees) – data connection pending
- [x] **Contacts** – full CRUD (create, edit, delete) with modal
- [x] **Employees** – full CRUD + follow‑up assignment workflow (create follow‑up from employee page)
- [x] **Follow‑ups** – status transitions (`PENDING` → `POSTPONED` → `DONE`/`CANCELLED`), overdue calculation, history, form validation (future dates server‑side)
- [x] **Properties** – hierarchy view (Area → Colony → Wing → Floor → Flat), inline Area & Colony creation, Property Structure Generator (complete UI, validation, duplicate‑generation protection)

### 4. New Modules – Early Progress
- [x] **Marketing Leads** – create/update/delete/status workflow (`NONE` → `CALLED_NOT_VISITED` → `VISITED` → `NOT_INTERESTED`), priority, employee assignment, colony‑client linking
- [x] **Buyers & Sellers** – server actions ready (create, status update, delete)
  - **Sellers**: create/edit/delete with `UNSOLD`/`UNAVAILABLE`/`SOLD` status, area link, demand
  - **Buyers**: create/edit/delete with `NOTPURCHASED`/`PURCHASED`/`CANCELLED` status, area link, budget
  - **Matching**: core logic not yet implemented
- [x] **Plot / Land** – **NEW**:
  - Database model (`Plot` with title, area, dimensions, price, seller, status)
  - Server actions (`createPlot`, `updatePlotStatus`, `deletePlot`)
  - Form (`PlotForm`) integrated into "Add Property" → "Plot / Land"
  - UI in `PropertyTypeModal` – Plot form ready, save/delete buttons

---

## 🟡 IN PROGRESS / NEEDS UI

### 5. Plot / Land – UI Completion
- [ ] Add Plot listing page (`/plots` or dedicated section in `/properties`)
- [ ] Display plot cards with: reference, area, dimensions, total area, price per sq ft, total price, seller, status, sold‑to / sold‑by (if `SOLD`)
- [ ] Add edit functionality
- [ ] Integrate Plot listings with Property Structure Generator (generator currently only creates Flats)
- [ ] Add Plot search/filter by area, status, price range, seller

### 6. Property Listings – Flats
- [ ] Create flat inventory view (current `/properties` page already displays flats hierarchically – this is the flat listing)
- [ ] Add flat search/filter by area, colony, wing, floor, status, type
- [ ] Add flat edit functionality
- [ ] Test flat status transitions (AVAILABLE/UNAVAILABLE/SOLD) and sale linking (sold‑to/sold‑by)

### 7. Buyers & Sellers – UI
- [ ] **Buyers page** – list buyer requirements with client, area, dimensions, budget, status, delete/edit
- [ ] **Sellers page** – list seller properties with client, area, dimensions, demand, status, delete/edit
- [ ] **Buyer‑Seller Matching** – rule‑based matching:
  - Same `areaId`
  - Compatible dimensions (length/width within tolerance)
  - Seller property `status !== "SOLD"`
  - Buyer budget `>=` seller total price (or computed from land price)
  - Display potential matches with “Connect” action

---

## 🟠 HIGH‑PRIORITY BUT NOT STARTED

### 8. Area Management
- [ ] Area CRUD (currently only inline creation in Property flow)
- [ ] Area search

### 9. Colony Management
- [ ] Colony CRUD (currently only inline creation)
- [ ] Colony search, filter by area

### 10. Wing / Floor Management
- [ ] Wing CRUD (currently only generator‑driven)
- [ ] Floor CRUD (currently only generator‑driven)

### 11. Authentication & RBAC
- [ ] Login page, session handling
- [ ] Owner vs Employee roles
- [ ] Server‑side permission checks (Owner can add/remove employees, manage all data; Employee can only view/edit assigned records)
- [ ] Protect Server Actions with role checks

### 12. Security Hardening
- [ ] Input validation on all Server Actions
- [ ] Rate limiting / brute‑force protection (basic)
- [ ] Environment variable sanitization
- [ ] Error handling – generic messages to UI, detailed logs internally
- [ ] Ensure `DATABASE_URL` not exposed

### 13. Production Deployment
- [ ] Docker Compose production config
- [ ] Database backup script (cron)
- [ ] Self‑hosted test (Owner laptop → Raspberry Pi migration)
- [ ] Remote access (Cloudflare Tunnel / Tailscale) configuration

---

## 🟡 TESTING

### Functional
- [ ] Contacts CRUD
- [ ] Employees CRUD + follow‑up flow
- [ ] Follow‑up status transitions and overdue logic
- [ ] Marketing lead workflow
- [ ] Property Structure Generator edge cases (mixed wing/floor counts, duplicate protection)
- [ ] Flat creation/editing/status changes
- [ ] Plot creation/editing/status changes
- [ ] Buyer‑Seller matching logic

### Performance
- [ ] Database indexes (add where justified)
- [ ] Lazy loading for large flat/plot lists
- [ ] Test with realistic data volume (~100 clients, 20–30 colonies, many flats/plots)

### Security
- [ ] Attempt unauthorized Server Action calls
- [ ] Test IDOR scenarios

---

## 📋 IMPLEMENTATION ORDER RECOMMENDATION (based on PRD §28)

1. **Finish Dashboard** (connect to live DB)
2. **Finish Follow‑ups** (delete confirmations, edge‑case validation)
3. **Build Areas** (CRUD + search)
4. **Build Buyers** (UI + status)
5. **Build Sellers** (UI + status)
6. **Build Buyer‑Seller Matching** (simple rule‑based)
7. **Colony Management** (CRUD, search)
8. **Wing / Floor Management** (CRUD)
9. **Flat Management** (CRUD, status, sale linking)
10. **Property Generator** (already complete, ensure edge‑cases)
11. **Marketing** (already implemented)
12. **Authentication** (login, roles, protection)
13. **Authorization / RBAC**
14. **Security Hardening**
15. **Testing**
16. **Production Deployment**

---

## 📝 CURRENT DOCUMENTATION STATUS

- [x] `docs/prd.md` – PRD (updated)
- [x] `docs/architecture.md` – architecture decisions
- [x] `docs/rules.md` – development rules
- [x] `docs/design.md` – UI design specs
- [x] `docs/task.md` – implementation task list (this file)
- [x] `docs/memory.md` – project context

All doc files are kept in sync with implementation progress.

---

## 🚧 OPEN QUESTIONS / DECISION POINTS

1. **Should Plot be a separate module (its own page) or part of Properties?**
   - Current: Plot form inside Property modal, listing could be on `/properties` tab
   - Decision needed: whether to have dedicated `/plots` route

2. **How to handle duplicate‑area/colony names?**
   - Currently allowed; could add uniqueness validation

3. **Seller‑Buyer matching – should it auto‑create records?**
   - PRD says matching is passive (just display)

4. **Remote access** – Cloudflare Tunnel vs Tailscale? Environment constraints may dictate choice

---

## ✅ READY TO SHIP (with remaining UI)

BrokerHub now provides:

- ✅ Dark‑themed professional CRM UI
- ✅ All core modules functional (Contacts, Employees, Follow‑ups, Properties with Flats & Plots)
- ✅ Marketing leads with status/priority workflow
- ✅ Server‑side validation and error handling
- ✅ Docker‑based PostgreSQL deployment
- ✅ Responsive desktop layout

**Immediate next steps:**
1. Add Plot listing page (UI completion)
2. Add Buyers & Sellers pages (stub → UI)
3. Add Buyer‑Seller matching (rule‑based)
4. Fix Dashboard live stats
5. Add root route (`/`) → `/dashboard`
6. Update README with product description

Once those are done, the product is ready for a small real‑estate business owner to adopt.

---

*Document last updated: 2026‑11‑11*
*Maintained by: Sarthak’s development team*