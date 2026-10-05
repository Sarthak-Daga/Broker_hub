```md
# BrokerHub — Project Memory

This document records important project decisions, assumptions, and reasoning that should remain consistent throughout the development of BrokerHub.

It acts as a long-term memory of the project so that future development does not repeatedly revisit already-settled decisions.

---

# 1. Project Identity

**Project Name:** BrokerHub

**Tagline:**

> One place to manage every property relationship.

BrokerHub is a self-hosted real estate CRM designed for a small real estate business.

The project is intended to be both:

- A practical real-world application
- A serious Software Project Management / engineering project

---

# 2. Target Business

The intended business structure is:

```text
1 Owner
   +
~5 Employees
   +
~100–200 Clients per year
```

The business does not require enterprise-scale infrastructure.

Therefore, the architecture should remain simple and maintainable.

---

# 3. Core Business Problem

The business needs one centralized place to manage:

- General contacts
- Marketing leads
- Buyers
- Sellers
- Properties
- Employees
- Employee assignments
- Follow-ups
- Reminders

The application should reduce dependence on:

- Notebooks
- Spreadsheets
- Scattered contact lists
- Manual reminders
- Unstructured messages

---

# 4. College Project Alignment

BrokerHub aligns strongly with the CRM-oriented college problem statement:

> SmartConnect CRM is a web-based system that centralizes customer data, tracks interactions and leads, manages follow-ups, and helps businesses build stronger customer relationships efficiently.

The project also has overlap with the real-estate property management problem statement.

BrokerHub therefore combines:

```text
CRM
+
Real Estate Management
```

rather than becoming only a generic property listing website.

---

# 5. Product Direction

BrokerHub is an **internal business CRM**.

It is not primarily intended to be:

- A public property marketplace
- A public property listing website
- A social platform
- A property advertisement portal

The primary users are the Owner and employees of the real estate business.

---

# 6. Technology Decisions

The current stack is:

```text
Next.js
TypeScript
Tailwind CSS
PostgreSQL
Prisma 8
Docker
Docker Compose
```

The application uses the Next.js App Router.

---

# 7. Why Next.js

Next.js was selected because it provides:

- React-based UI
- Server Components
- Server Actions
- Routing
- Server-side database access
- Easy deployment
- A single application for frontend and backend logic

For the scale of BrokerHub, a separate frontend and backend service would introduce unnecessary complexity.

---

# 8. Why PostgreSQL

PostgreSQL was selected as the primary database because BrokerHub contains strongly relational data.

Important relationships include:

```text
Client ↔ Marketing ↔ Colony

Client → Seller Property

Client → Buyer Requirement

Client → Follow-up ← Employee

Colony → Wing → Floor → Flat
```

A relational database is therefore a natural fit.

PostgreSQL also provides a good path for future expansion.

---

# 9. Why Prisma

Prisma provides a structured database access layer between Next.js and PostgreSQL.

The intended architecture is:

```text
Next.js
   ↓
Prisma
   ↓
PostgreSQL
```

The application should avoid scattering raw database queries throughout UI components.

---

# 10. Why Docker

Docker was selected primarily for:

- Reproducible database setup
- Easy development
- Easy migration
- Simple self-hosting
- Future Raspberry Pi deployment

The PostgreSQL database runs in a Docker container.

---

# 11. Self-Hosting Decision

BrokerHub is intended to be self-hosted.

Initial deployment:

```text
Owner's Laptop
```

Future deployment:

```text
Raspberry Pi
```

The application should therefore avoid unnecessary dependency on a specific cloud provider.

---

# 12. Migration Strategy

The intended migration path is:

```text
Development PC
       ↓
Owner Laptop
       ↓
Raspberry Pi
```

Docker Compose should make this migration relatively straightforward.

The application architecture should not need major changes when moving between these environments.

---

# 13. Remote Access

The database should never be directly exposed to the internet.

The intended architecture is:

```text
Internet
   ↓
Secure Tunnel
   ↓
BrokerHub Server
   ↓
Next.js
   ↓
PostgreSQL
```

Potential technologies:

- Cloudflare Tunnel
- Tailscale

The final choice can be made during deployment.

---

# 14. Database Security Decision

PostgreSQL must remain private.

Do not expose:

```text
5432
```

directly to the public internet.

Only the application/server should communicate with PostgreSQL.

---

# 15. Client Model

A `Client` represents the person.

Basic client information is centralized:

```text
Name
Address
Mobile Number
Remarks
```

The same client can participate in multiple workflows.

For example:

```text
Client
 ├── Marketing
 ├── Buyer
 ├── Seller
 └── Follow-up
```

This avoids duplicating the same person's basic information.

---

# 16. Why Buyer and Seller Are Separate Records

A Client represents a person.

A Buyer represents a specific buying requirement.

A Seller represents a specific property being sold.

Therefore:

```text
Client ID
=
Who?
```

while:

```text
Buyer ID
=
Which requirement?
```

and:

```text
Seller ID
=
Which property?
```

This is important because:

```text
One client
   ↓
multiple properties
```

and:

```text
One client
   ↓
multiple buying requirements
```

must be supported.

---

# 17. Seller Property Decision

A seller property is treated as its own record.

Example:

```text
Client A
 ├── Property 1
 ├── Property 2
 └── Property 3
```

The system must not assume one seller can only have one property.

---

# 18. Buyer Requirement Decision

A buyer requirement is also treated as its own record.

Example:

```text
Client A
 ├── Requirement 1
 ├── Requirement 2
 └── Requirement 3
```

This allows a client to have different requirements for different areas or property sizes.

---

# 19. Area Decision

The current design uses a single `Area` entity.

Both buyers and sellers reference an Area.

```text
Area
 ├── Seller
 └── Buyer
```

The system should not introduce additional geographical entities unless an actual business requirement appears.

The goal is to avoid unnecessary database complexity.

---

# 20. Marketing Relationship Decision

Marketing uses a separate relationship record between Client and Colony.

Conceptually:

```text
Client
   ↕
Marketing
   ↕
Colony
```

This is intentionally many-to-many.

A client may be interested in multiple colonies.

A colony may have multiple interested clients.

---

# 21. Why Marketing Is Not Stored Directly on Client

Marketing information such as:

- Colony
- Employee
- Status
- Priority
- Remarks

belongs to a specific client-colony relationship.

For example:

```text
Client A
 ├── Colony X → VISITED
 └── Colony Y → CALLED_NOT_VISITED
```

Therefore, storing one global marketing status directly on the Client would be incorrect.

---

# 22. Marketing Status Decision

Marketing statuses are:

```text
NONE
CALLED_NOT_VISITED
VISITED
NOT_INTERESTED
```

The status represents the current state of a lead for a specific marketing relationship.

The status should not move backwards.

---

# 23. Marketing Assignment Decision

Only the Owner controls employee assignments.

Employees can work on their assigned marketing leads but cannot reassign themselves or other employees.

This provides a clear separation between:

```text
Management
```

and:

```text
Execution
```

---

# 24. Marketing Interaction History

The first version does not maintain a complete call/visit history.

The Marketing record stores the current status.

For example:

```text
VISITED
```

means the lead is currently in the visited state.

A detailed interaction timeline may be added later.

---

# 25. Priority Decision

Marketing leads support a five-level priority:

```text
1 Star
2 Stars
3 Stars
4 Stars
5 Stars
```

The purpose is to allow employees and the Owner to quickly identify more important leads.

---

# 26. Property Hierarchy Decision

The property hierarchy is:

```text
Colony
   ↓
Wing
   ↓
Floor
   ↓
Flat
```

This reflects how residential projects are commonly organized.

---

# 27. Why Actual Flat Records Are Stored

The system should store individual `Flat` records.

For example:

```text
Flat 101
Flat 102
Flat 103
```

rather than storing only:

```text
Total flats = 3
```

This is necessary because individual flats can have different:

- Numbers
- Types
- Statuses

---

# 28. Availability Decision

Colony availability should not be stored as a manually maintained number.

Instead, availability should be derived from Flat records.

For example:

```text
AVAILABLE flats
=
count(Flat where status = AVAILABLE)
```

This avoids inconsistent data.

---

# 29. Wing and Floor Configuration

Wing and Floor contain configuration-related fields such as:

```text
Wing.numberOfFloors
Floor.numberOfFlats
```

However, actual generated records are the important source of truth.

The application should avoid creating conflicting sources of truth.

---

# 30. Property Generator Decision

A property generator should allow the Owner to quickly create:

```text
Wings
Floors
Flats
```

for a colony.

Different wings may have different numbers of floors.

Different floors may have different numbers of flats.

Example:

```text
Wing A → 10 floors
Wing B → 8 floors
Wing C → 12 floors
```

The generator should support this.

---

# 31. Flat Type Decision

Flat type belongs to the Flat itself.

Examples:

```text
1BHK
2BHK
3BHK
```

The system should not assume that every flat on a floor or in a wing has the same type.

---

# 32. Property Splitting Decision

Property subdivision is intentionally simple in the first version.

Example:

```text
Original:
30 × 100
```

Two buyers:

```text
30 × 25
30 × 75
```

The initial implementation does not perform automatic geometry calculations.

Instead:

1. Mark the original property as sold/unavailable.
2. Create new property records representing the resulting pieces.

More advanced geometry can be added later.

---

# 33. Follow-up Decision

Follow-ups are first-class entities.

A FollowUp belongs to:

```text
Client
Employee
```

and contains:

```text
Date/time
Notes
Purpose
Status
```

This makes follow-up management independent from any single CRM module.

---

# 34. Follow-up Status Decision

Active statuses:

```text
PENDING
POSTPONED
```

Historical statuses:

```text
DONE
CANCELLED
```

DONE and CANCELLED records remain in the database.

They are not automatically deleted.

---

# 35. Why Historical Follow-ups Are Retained

Automatically deleting completed follow-ups would destroy useful business history.

Keeping them allows the Owner to understand:

- What happened previously
- Which clients were contacted
- How often follow-ups occurred
- Which tasks were cancelled
- Past employee activity

Historical records can be explicitly deleted if necessary.

---

# 36. Overdue Decision

OVERDUE is not a database status.

Instead:

```text
status = PENDING
AND
dateTime < current time
```

means the follow-up is overdue.

The UI displays:

```text
OVERDUE
```

while the database continues to store:

```text
PENDING
```

This keeps the data model clean.

---

# 37. Follow-up Date Decision

Past dates should not be accepted for active follow-ups.

Future date validation must exist at both:

```text
Client
+
Server
```

Client-side validation improves usability.

Server-side validation protects the database.

---

# 38. Follow-up Sorting Decision

Follow-ups should prioritize urgency.

General order:

```text
Overdue Pending
      ↓
Pending
      ↓
Postponed
      ↓
Done
      ↓
Cancelled
```

Within each group, records should be ordered by date/time.

---

# 39. Employee Follow-up Count

Employee follow-up counts represent active work.

Therefore, the count includes:

```text
PENDING
POSTPONED
```

and excludes:

```text
DONE
CANCELLED
```

This prevents employees from appearing to have outstanding tasks when they only have historical records.

---

# 40. Employee ID Decision

Employee IDs are stored numerically but displayed in a formatted three-digit form.

Example:

```text
Database ID: 1
Displayed:   001
```

This makes employee identifiers look cleaner and more business-friendly.

---

# 41. Search Decision

The expected initial dataset is relatively small.

Approximately:

```text
100–200 clients/year
```

Therefore, simple client-side search is acceptable for many modules.

The system does not need an advanced search engine initially.

If the dataset grows significantly, server-side filtering and indexing can be introduced.

---

# 42. File Storage Decision

The initial system does not require photo or document storage.

Current business data is primarily:

- Text
- Numbers
- Dates
- Relationships
- Statuses

Therefore, object/file storage is unnecessary for the initial version.

---

# 43. Supabase Decision

Supabase was considered during architecture planning.

The final architecture uses:

```text
PostgreSQL
+
Prisma
+
Docker
```

rather than depending on Supabase for the primary database infrastructure.

This better supports the self-hosted requirement.

---

# 44. Cloud Storage Decision

No separate cloud storage is currently required.

If files or property images are introduced later, storage can be reconsidered.

Possible future solutions may include:

- Local storage
- S3-compatible storage
- Cloud storage

This decision is intentionally deferred.

---

# 45. Authentication Decision

Authentication is planned but not part of the initial CRUD foundation.

The eventual system should distinguish:

```text
OWNER
EMPLOYEE
```

and enforce permissions on the server.

The UI should not be considered a security boundary.

---

# 46. Google Calendar Decision

Google Calendar integration was considered for follow-ups.

It is intentionally deferred.

The initial system manages follow-ups internally.

Calendar integration can be added later without changing the fundamental FollowUp model.

---

# 47. Notification Decision

The initial reminder system is based on FollowUps.

Future possibilities include:

- Browser notifications
- Email
- WhatsApp
- Google Calendar

These are not required for the first production version.

---

# 48. UI Design Decision

BrokerHub uses a dark dashboard-style interface.

Primary characteristics:

```text
Dark
Clean
Professional
Information-focused
Minimal
```

Primary styling uses:

```text
Slate backgrounds
Blue accents
Rounded cards
Subtle borders
Compact controls
```

---

# 49. Header and Sidebar Decision

Header and Sidebar are shared components.

This ensures navigation and branding remain consistent across modules.

The main navigation is:

```text
Dashboard
Marketing
Buyers / Sellers
Contacts
Follow-ups
Employees
```

---

# 50. Documentation Decision

The project documentation is stored inside:

```text
docs/
```

Current documentation:

```text
docs/
├── prd.md
├── architecture.md
├── rules.md
├── design.md
├── task.md
└── memory.md
```

These files are project source documentation and should be committed to Git.

They should NOT be added to `.gitignore`.

---

# 51. Git Decision

The project source code, documentation, database schema, Docker configuration, and package configuration should be committed.

Examples:

```text
app/
prisma/
docs/
docker-compose.yml
package.json
package-lock.json
tsconfig.json
```

Environment files containing secrets should not be committed.

---

# 52. Environment Variables

Environment-specific secrets such as:

```text
DATABASE_URL
```

belong in `.env`.

`.env` should remain ignored by Git.

Example:

```text
.env
.env.local
.env.*.local
```

should be ignored.

---

# 53. Current Database Philosophy

The database should remain normalized enough to represent real business relationships but should not be over-engineered.

The goal is:

```text
Correct relationships
+
Clear ownership
+
Simple queries
+
Easy maintenance
```

rather than maximum theoretical normalization.

---

# 54. Current Business Data Model

The current conceptual model is:

```text
Client
 │
 ├────────────── Marketing ────────────── Colony
 │                                         │
 │                                         └── Wing
 │                                              │
 │                                              └── Floor
 │                                                   │
 │                                                   └── Flat
 │
 ├────────────── Seller ─────────────── Area
 │
 ├────────────── Buyer ───────────────── Area
 │
 └────────────── FollowUp ───────────── Employee
                                      │
                                      └── Marketing
```

This represents the major relationships in BrokerHub.

---

# 55. Design Principle: Do Not Overbuild

BrokerHub is intentionally designed for a small business.

Avoid introducing:

- Microservices
- Message queues
- Kubernetes
- Complex event-driven systems
- Separate frontend/backend deployments
- Advanced search infrastructure
- AI matching

unless the project genuinely requires them.

The preferred architecture is:

```text
One Next.js application
        ↓
One PostgreSQL database
        ↓
Docker
```

---

# 56. Design Principle: Build for the Real User

Features should be evaluated according to whether they solve a real business problem.

Before adding a feature, ask:

```text
Does the Owner need this?

Does an Employee need this?

Does it reduce manual work?

Does it improve data organization?

Does it improve follow-up or property management?
```

If not, it should probably not be part of the core product.

---

# 57. Design Principle: Preserve Flexibility

Although the initial system is intentionally simple, the database and architecture should leave room for:

- Authentication
- Advanced matching
- Interaction history
- Notifications
- Calendar integration
- Analytics
- Cloud backups
- Mobile/PWA support
- Property images
- Advanced property management

Future features should extend the current model rather than require rewriting the entire application.

---

# 58. Important Settled Decisions

The following decisions should be treated as established unless a real requirement changes them:

```text
✓ BrokerHub is a real-estate CRM
✓ Next.js + TypeScript
✓ Tailwind CSS
✓ PostgreSQL
✓ Prisma
✓ Docker
✓ Self-hosted architecture
✓ Client is separate from Buyer/Seller records
✓ Marketing is a Client ↔ Colony relationship
✓ Buyer supports multiple requirements per client
✓ Seller supports multiple properties per client
✓ Colony → Wing → Floor → Flat hierarchy
✓ Flat records are stored individually
✓ Follow-ups are first-class records
✓ PENDING/POSTPONED are active
✓ DONE/CANCELLED are historical
✓ OVERDUE is derived
✓ Historical follow-ups are retained
✓ Future dates are validated
✓ Employee assignment is Owner-controlled
✓ Employee IDs display as 001, 002, etc.
✓ PostgreSQL is never publicly exposed
✓ Documentation belongs in Git
```

---

# 59. Change Management

These decisions are not immutable.

If a real business requirement conflicts with one of them, the architecture may change.

However, before changing an established decision, consider:

1. Why the current decision was made.
2. What new requirement invalidates it.
3. What parts of the system will be affected.
4. Whether the new solution introduces unnecessary complexity.
5. Whether the documentation should be updated.

When a significant architectural decision changes, update:

```text
prd.md
architecture.md
rules.md
design.md
task.md
memory.md
```

where relevant.

---

# 60. Final Project Memory

BrokerHub should remain:

> **A simple, reliable, self-hosted real estate CRM that gives a small real estate business one centralized place to manage clients, properties, leads, employees, and follow-ups.**

The guiding architectural philosophy is:

```text
Keep it simple.
Keep the data structured.
Keep the database private.
Keep the history.
Build what the business actually needs.
```