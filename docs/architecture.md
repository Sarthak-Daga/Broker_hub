# BrokerHub --- Current Project State Snapshot

> Updated: 2026-10-07\
> This section is the authoritative current-state addendum for
> continuing development. Older sections describe the original
> requirements and should not override decisions recorded here.

## Current stack

-   Next.js App Router
-   TypeScript
-   Tailwind CSS
-   PostgreSQL in Docker
-   Prisma 8
-   Next.js Server Actions for mutations
-   Dark professional CRM UI

## Current implementation status

### Completed and working

-   Project documentation structure exists: PRD, architecture, rules,
    design, task, memory.
-   PostgreSQL/Docker infrastructure is working.
-   Prisma 8 contract/database workflow is established.
-   Contacts module is working.
-   Employees module is working.
-   Follow-ups module is working, including status transitions, overdue
    derivation, postponing, cancellation, historical records, and
    future-date validation.
-   Properties page exists.
-   Properties page loads Area, Colony, Wing, Floor, and Flat records.
-   `PropertyTypeModal` supports choosing Flat vs Plot/Land.
-   `FlatForm` has cascading searchable selectors.
-   Area creation through the Flat property flow is implemented and
    tested successfully.
-   Colony creation through the same inline pattern is the intended and
    current creation UX.
-   `Colony.areaId` has been added to the database and the required
    migration has been applied successfully.
-   `Floor.floorNumber` has been added and migrated successfully.

## Property hierarchy decision --- IMPORTANT

The physical hierarchy is:

``` text
Area
  ↓
Colony
  ↓
Wing
  ↓
Floor
  ↓
Flat
```

However, the creation UX is intentionally NOT generic CRUD at every
level.

### Inline creation

Only these should use the small searchable-select + inline creation
pattern in the initial Flat/property flow:

``` text
Area     → searchable select + New Area
Colony   → searchable select + New Colony
```

### Property Structure Generator

Wing, Floor, and Flat creation must use a separate Property Structure
Generator UI.

Do NOT add: - `+ New Wing` inline under Wing - `+ New Floor` inline
under Floor - `+ New Flat` inline under Flat

The generator should configure and create the entire physical structure
for a selected Colony.

## Property Structure Generator --- intended workflow

``` text
Select Area
    ↓
Select/Create Colony
    ↓
Configure Property Structure
    ↓
Configure Wings
    ↓
Configure Floors per Wing
    ↓
Configure Flats per Floor
    ↓
Review generated structure
    ↓
Generate
```

The generator must support different configurations, for example:

``` text
Colony: Shantigram

Wing A → 10 floors
Wing B → 8 floors
Wing C → 12 floors

Floor 1 of Wing A → 4 flats
Floor 2 of Wing A → 6 flats
...
```

Different wings may have different floor counts, and different floors
may have different flat counts.

Actual `Wing`, `Floor`, and `Flat` database records are the source of
truth after generation.

## Important correction to recent implementation

A previous attempted implementation added `createWing`, `createFloor`,
and `createFlat` as inline creation actions. That was the wrong UX
direction and should be removed/reverted.

Do not continue or repair that inline creation approach.

The recent `Wing.update({ where: ... })` attempt also exposed that
mutation API syntax must not be guessed. Once the generator is
implemented, use the actual Prisma 8 generated API already established
by the project.

## Current property UI direction

The Properties page should eventually support:

``` text
Properties
  ├── All
  ├── Flats
  └── Plots / Land

+ Add Property
```

For a Flat:

``` text
Area
[ Search area... ]
+ New Area

Colony
[ Search colony... ]
+ New Colony

[ Configure Property Structure ]
```

The exact visual design should remain consistent with the existing dark
BrokerHub design system.

## Important domain distinction

Keep these concepts separate:

1.  Physical property hierarchy:

``` text
Area → Colony → Wing → Floor → Flat
```

2.  CRM property records: A Seller record represents a specific property
    being offered for sale.

3.  Property generation: The generator creates the physical
    Wing/Floor/Flat structure; it should not silently create Seller
    records.

This distinction is important for future Buyers/Sellers integration.

## Current immediate next step

Build the Property Structure Generator for a selected Colony.

Before implementing it: 1. Remove/revert the incorrect inline
`+ New Wing`, `+ New Floor`, and `+ New Flat` UX. 2. Keep the working
Area and Colony inline creation. 3. Design the generator
screens/components. 4. Confirm the generator data model and validation.
5. Generate Wing → Floor → Flat records in a controlled server-side
operation. 6. Add duplicate-generation protection. 7. Verify the
generated hierarchy.

## Documentation rule

These six files are version-controlled project documentation and must
remain committed to Git:

``` text
docs/prd.md
docs/architecture.md
docs/rules.md
docs/design.md
docs/task.md
docs/memory.md
```

Update them when a major product, architecture, UX, or implementation
decision changes.

## Current Architecture Addendum --- Property Structure Generator

The Property Structure Generator is a client-side configuration workflow
backed by a server-side generation action.

Conceptually:

``` text
Properties Page / Property Modal
            ↓
   Generator Client UI
            ↓
   Configuration Object
            ↓
      Server Action
            ↓
   Validate configuration
            ↓
   Create Wing records
            ↓
   Create Floor records
            ↓
   Create Flat records
            ↓
     PostgreSQL
            ↓
      Revalidate UI
```

The generator must support per-wing and per-floor configuration rather
than assuming one global floor count or one global flat count.

The generator should create the physical hierarchy only. CRM
Seller/Buyer records are separate business entities and should not be
implicitly created by physical hierarchy generation.

Do not introduce a separate backend service for generation. Keep it
inside the existing Next.js + Prisma + PostgreSQL architecture.

------------------------------------------------------------------------

Yep --- here's **`docs/architecture.md`**, keeping it aligned with the
BrokerHub architecture we've already established.

``` md
# BrokerHub — System Architecture

## 1. Architecture Overview

BrokerHub follows a simple layered architecture designed for:

- Small-scale business usage
- Self-hosting
- Easy maintenance
- Easy migration between machines
- Strong separation between UI, business logic, and data
- Future expansion without unnecessary complexity

The overall architecture is:

```text
                    ┌─────────────────────┐
                    │       Browser       │
                    │   Owner / Employee  │
                    └──────────┬──────────┘
                               │
                               │ HTTP
                               ▼
                    ┌─────────────────────┐
                    │      Next.js        │
                    │   App Router        │
                    │                     │
                    │  Pages / UI         │
                    │  Server Components  │
                    │  Server Actions     │
                    └──────────┬──────────┘
                               │
                               │ Prisma ORM
                               ▼
                    ┌─────────────────────┐
                    │    PostgreSQL       │
                    │                     │
                    │     BrokerHub DB    │
                    └─────────────────────┘
```

PostgreSQL runs inside Docker during self-hosted deployment.

------------------------------------------------------------------------

# 2. Technology Stack

## Frontend

-   Next.js
-   React
-   TypeScript
-   Tailwind CSS

## Backend

-   Next.js App Router
-   React Server Components
-   Next.js Server Actions

## Database

-   PostgreSQL

## ORM / Database Access

-   Prisma 8

## Containerization

-   Docker
-   Docker Compose

## Development Environment

-   Node.js
-   npm

## Future Remote Access

Potential options:

-   Cloudflare Tunnel
-   Tailscale

------------------------------------------------------------------------

# 3. High-Level Application Architecture

BrokerHub follows a layered flow:

``` text
User
  │
  ▼
Next.js UI
  │
  ├── Server Components
  │
  ├── Client Components
  │
  └── Server Actions
          │
          ▼
      Prisma ORM
          │
          ▼
      PostgreSQL
```

### Responsibilities

### UI Layer

Responsible for:

-   Displaying data
-   Forms
-   Tables
-   Modals
-   Search interfaces
-   Status controls
-   Navigation

### Server Layer

Responsible for:

-   Business logic
-   Validation
-   Mutations
-   Authorization
-   Database operations
-   Revalidation

### Database Layer

Responsible for:

-   Persistent storage
-   Relationships
-   Constraints
-   Historical records
-   Source of truth for business data

------------------------------------------------------------------------

# 4. Next.js Architecture

BrokerHub uses the Next.js App Router.

The application is organized primarily around feature-based routes.

Expected structure:

``` text
app/
├── dashboard/
├── contacts/
├── employees/
├── follow-ups/
├── marketing/
├── buyers-sellers/
│
├── components/
│   ├── header.tsx
│   └── sideBar.tsx
│
└── ...
```

Each major business module has its own route.

Example:

``` text
/dashboard
/contacts
/employees
/follow-ups
/marketing
/buyers-sellers
```

------------------------------------------------------------------------

# 5. Server Components

BrokerHub should prefer React Server Components for pages that primarily
display database information.

Example flow:

``` text
Request
   ↓
Next.js Server Component
   ↓
Database Query
   ↓
Render HTML
```

This keeps database access on the server and avoids unnecessarily
exposing database operations to the browser.

Examples of suitable Server Components:

-   Dashboard
-   Contacts page
-   Employees page
-   Follow-ups page
-   Marketing overview
-   Buyers/Sellers overview

------------------------------------------------------------------------

# 6. Client Components

Client Components should be used when browser-side interaction is
required.

Examples:

-   Modals
-   Search interfaces
-   Interactive forms
-   Date/time selectors
-   Buttons requiring local UI state
-   Navigation requiring `usePathname()`

Example:

``` text
Contacts Page
      │
      ├── Server Component
      │       │
      │       └── Fetch contacts
      │
      └── Client Components
              ├── ContactModal
              └── ContactsTable
```

Client Components should not be used unnecessarily.

------------------------------------------------------------------------

# 7. Server Actions

Mutations should use Next.js Server Actions where appropriate.

Typical operations include:

``` text
Create
Update
Delete
Change Status
Assign Employee
Create Follow-up
Postpone Follow-up
Cancel Follow-up
```

Example architecture:

``` text
User clicks "Done"
        │
        ▼
Server Action
        │
        ▼
Validate request
        │
        ▼
Update PostgreSQL
        │
        ▼
Revalidate relevant route
        │
        ▼
Updated UI
```

Server-side validation is required even when client-side validation
already exists.

------------------------------------------------------------------------

# 8. Database Architecture

PostgreSQL is the primary source of truth for BrokerHub.

The database stores:

-   Clients
-   Areas
-   Employees
-   Marketing relationships
-   Seller properties
-   Buyer requirements
-   Colonies
-   Wings
-   Floors
-   Flats
-   Follow-ups

The application should not maintain a separate persistent business-data
store outside PostgreSQL.

------------------------------------------------------------------------

# 9. Core Database Relationships

The major relationships are:

``` text
Client
 ├── Marketing
 ├── Seller
 ├── Buyer
 └── FollowUp
```

``` text
Area
 ├── Seller
 └── Buyer
```

``` text
Colony
 ├── Marketing
 └── Wing
       └── Floor
             └── Flat
```

``` text
Employee
 ├── Marketing
 └── FollowUp
```

------------------------------------------------------------------------

# 10. Client Architecture

The `Client` entity represents the person.

A client may participate in different business workflows.

``` text
Client
   │
   ├── Marketing relationships
   │
   ├── Seller properties
   │
   ├── Buyer requirements
   │
   └── Follow-ups
```

This prevents duplication of basic client information.

For example, if one person is both a seller and a buyer, the same Client
record can be associated with both workflows.

------------------------------------------------------------------------

# 11. Marketing Architecture

Marketing uses a relationship entity between:

``` text
Client
   ↕
Marketing
   ↕
Colony
```

This creates a many-to-many relationship between clients and colonies.

Conceptually:

``` text
Client A ─── Marketing ─── Colony X
Client A ─── Marketing ─── Colony Y
Client B ─── Marketing ─── Colony X
Client B ─── Marketing ─── Colony Z
```

The `Marketing` record additionally stores relationship-specific
information such as:

-   Employee assignment
-   Status
-   Priority
-   Remarks

This information belongs to the relationship rather than directly to the
Client or Colony.

------------------------------------------------------------------------

# 12. Buyer Architecture

A Client may have multiple buyer requirements.

Therefore:

``` text
Client
  │
  ├── Buyer Requirement 1
  ├── Buyer Requirement 2
  └── Buyer Requirement 3
```

Each Buyer record stores:

-   Area
-   Length
-   Width
-   Budget
-   Status
-   Remarks

This allows the same person to maintain multiple requirements.

------------------------------------------------------------------------

# 13. Seller Architecture

A Client may own multiple properties.

Therefore:

``` text
Client
  │
  ├── Seller Property 1
  ├── Seller Property 2
  └── Seller Property 3
```

Each Seller record represents a specific property.

This distinction is important:

``` text
Client ID
    =
Who owns the property?

Seller Property ID
    =
Which property is being listed?
```

The system should therefore not treat the client itself as the property.

------------------------------------------------------------------------

# 14. Property Hierarchy Architecture

The property management system follows:

``` text
Colony
   │
   └── Wing
          │
          └── Floor
                 │
                 └── Flat
```

Database relationships:

``` text
Colony
  1
  │
  └────── N Wing

Wing
  1
  │
  └────── N Floor

Floor
  1
  │
  └────── N Flat
```

This allows the application to represent real residential projects in a
structured manner.

------------------------------------------------------------------------

# 15. Property Generation

The application should be able to generate property records based on
configuration.

Example:

``` text
Colony A

3 Wings

Wing A → 10 Floors
Wing B → 8 Floors
Wing C → 12 Floors
```

The generator creates the corresponding database records.

Conceptually:

``` text
Generator Configuration
          │
          ▼
       Wings
          │
          ▼
       Floors
          │
          ▼
        Flats
```

Actual `Flat` records become the source of truth for property
availability.

------------------------------------------------------------------------

# 16. Availability Architecture

Property availability should not be stored as a manually maintained
count on the Colony.

Instead:

``` text
Colony
   ↓
Wing
   ↓
Floor
   ↓
Flat
   ↓
Flat.status
```

Availability can then be derived from flat records.

For example:

``` text
AVAILABLE = count(Flat where status = AVAILABLE)
```

This avoids situations where a manually stored availability number
becomes inconsistent with the actual properties.

------------------------------------------------------------------------

# 17. Follow-up Architecture

Follow-ups are associated with both:

``` text
Client
Employee
```

Relationship:

``` text
Client
   │
   └── FollowUp
          │
          └── Employee
```

Each follow-up stores:

-   Client
-   Employee
-   Date/time
-   Notes
-   Purpose
-   Status

This allows the system to answer:

-   Which client needs a follow-up?
-   Which employee is responsible?
-   When should it happen?
-   Why is the follow-up required?
-   What is its current state?

------------------------------------------------------------------------

# 18. Follow-up Lifecycle

The follow-up lifecycle is:

``` text
                 ┌──────────────┐
                 │   PENDING    │
                 └──────┬───────┘
                        │
              ┌─────────┼─────────┐
              │         │         │
              ▼         ▼         ▼
           DONE     POSTPONED  CANCELLED
                        │
                        ▼
                     PENDING
```

`DONE` and `CANCELLED` are historical states.

They are not automatically deleted.

------------------------------------------------------------------------

# 19. Overdue Follow-ups

Overdue is derived dynamically.

It is not stored as a separate database enum.

Logic:

``` text
if:
    status == PENDING
    AND
    dateTime < currentTime

then:
    display OVERDUE
```

This prevents stale overdue states from being stored in the database.

For example:

``` text
Database:

status = PENDING
dateTime = yesterday
```

UI:

``` text
OVERDUE
```

------------------------------------------------------------------------

# 20. Follow-up Date Validation

The application should validate future dates at two levels.

### Client-side

Prevent the user from selecting a past date/time.

### Server-side

Validate again before modifying the database.

``` text
User Input
    │
    ▼
Client Validation
    │
    ▼
Server Action
    │
    ▼
Server Validation
    │
    ▼
PostgreSQL
```

Server-side validation is the authoritative check.

------------------------------------------------------------------------

# 21. Employee Architecture

Employees are stored separately from Clients.

An employee can be associated with:

``` text
Employee
   ├── Marketing assignments
   └── Follow-ups
```

The Employee ID is internally numeric but displayed in a formatted form.

Example:

``` text
Database ID: 1
Displayed ID: 001
```

------------------------------------------------------------------------

# 22. Authorization Architecture

Authorization should eventually be implemented at the server layer.

The conceptual model is:

``` text
Request
   │
   ▼
Authentication
   │
   ▼
Identify Role
   │
   ├── OWNER
   │
   └── EMPLOYEE
          │
          ▼
     Authorization
          │
          ▼
      Operation
```

The UI should hide unavailable operations for convenience, but
server-side authorization must be the final protection.

------------------------------------------------------------------------

# 23. Docker Architecture

PostgreSQL runs inside Docker.

Current architecture:

``` text
Docker Host
│
└── brokerhub-postgres
       │
       └── PostgreSQL 17
              │
              └── brokerhub database
```

Docker Compose manages the PostgreSQL service.

The application connects through:

``` text
localhost:5432
```

during local development.

------------------------------------------------------------------------

# 24. Docker Volume

PostgreSQL data is stored in a Docker named volume.

Conceptually:

``` text
PostgreSQL Container
        │
        ▼
postgres_data
```

This allows the database container to be recreated without losing
persistent database data.

The database itself remains the source of truth.

------------------------------------------------------------------------

# 25. Prisma Architecture

Prisma provides the application's database access layer.

The architecture is:

``` text
Next.js
   │
   ▼
Prisma
   │
   ▼
PostgreSQL
```

The application should interact with the database through the
centralized Prisma database client rather than creating independent
database connections throughout the application.

Current Prisma 8 setup uses the generated contract/runtime architecture.

------------------------------------------------------------------------

# 26. Data Flow --- Reading Data

Example: Dashboard.

``` text
Browser
   │
   ▼
/dashboard
   │
   ▼
Next.js Server Component
   │
   ├── Query Clients
   ├── Query Sellers
   ├── Query Follow-ups
   └── Query Employees
   │
   ▼
Prisma
   │
   ▼
PostgreSQL
   │
   ▼
Dashboard
```

The database is queried on the server.

------------------------------------------------------------------------

# 27. Data Flow --- Creating Data

Example: Creating a contact.

``` text
User
  │
  ▼
Contact Modal
  │
  ▼
Form Submission
  │
  ▼
Server Action
  │
  ▼
Validate Input
  │
  ▼
Prisma
  │
  ▼
PostgreSQL
  │
  ▼
revalidatePath()
  │
  ▼
Updated Contacts Page
```

------------------------------------------------------------------------

# 28. Data Flow --- Updating Status

Example: Completing a follow-up.

``` text
User clicks "Done"
        │
        ▼
Server Action
        │
        ▼
Validate Follow-up ID
        │
        ▼
Update status = DONE
        │
        ▼
PostgreSQL
        │
        ▼
Revalidate /follow-ups
        │
        ▼
UI refreshes
```

The record remains in the database as historical data.

------------------------------------------------------------------------

# 29. Application Structure

The intended project structure is approximately:

``` text
broker_hub/
│
├── app/
│   ├── dashboard/
│   ├── contacts/
│   ├── employees/
│   ├── follow-ups/
│   ├── marketing/
│   ├── buyers-sellers/
│   │
│   └── components/
│       ├── header.tsx
│       └── sideBar.tsx
│
├── prisma/
│   ├── contract.prisma
│   ├── contract.json
│   ├── contract.d.ts
│   └── db.ts
│
├── docs/
│   ├── prd.md
│   ├── architecture.md
│   ├── rules.md
│   ├── design.md
│   ├── task.md
│   └── memory.md
│
├── public/
│
├── docker-compose.yml
├── prisma.config.ts
├── package.json
├── tsconfig.json
└── .gitignore
```

The exact structure may evolve as the application grows.

------------------------------------------------------------------------

# 30. Deployment Architecture

## Development

``` text
Developer PC
│
├── Next.js Dev Server
│
└── Docker
      │
      └── PostgreSQL
```

The developer accesses the application locally:

``` text
localhost:3000
```

------------------------------------------------------------------------

## Self-Hosted Production

The initial production deployment is intended to run on the Owner's
laptop.

``` text
Internet
   │
   ▼
Secure Tunnel
   │
   ▼
Owner Laptop
   │
   ├── Next.js
   │
   └── Docker
        │
        └── PostgreSQL
```

------------------------------------------------------------------------

## Future Raspberry Pi Deployment

The architecture should allow migration to:

``` text
Internet
   │
   ▼
Secure Tunnel
   │
   ▼
Raspberry Pi
   │
   ├── Next.js
   │
   └── Docker
        │
        └── PostgreSQL
```

A USB SSD may be used for persistent database storage when moving to
Raspberry Pi.

------------------------------------------------------------------------

# 31. Remote Access

PostgreSQL must never be exposed directly to the internet.

The intended remote-access flow is:

``` text
User Browser
     │
     ▼
Secure Tunnel
     │
     ▼
BrokerHub Server
     │
     ├── Next.js
     │
     └── PostgreSQL
```

Potential technologies:

-   Cloudflare Tunnel
-   Tailscale

The database remains accessible only to the application/server.

------------------------------------------------------------------------

# 32. Security Boundaries

The system should maintain the following boundary:

``` text
             PUBLIC
                │
                ▼
        ┌───────────────┐
        │    Next.js    │
        └───────┬───────┘
                │
           PRIVATE
                │
                ▼
        ┌───────────────┐
        │  PostgreSQL   │
        └───────────────┘
```

The browser should never connect directly to PostgreSQL.

Database credentials should remain server-side.

Environment variables such as:

``` text
DATABASE_URL
```

must not be committed to Git.

------------------------------------------------------------------------

# 33. Caching and Revalidation

BrokerHub uses Next.js revalidation after mutations.

Typical flow:

``` text
Mutation
   │
   ▼
Database Update
   │
   ▼
revalidatePath()
   │
   ▼
Next.js fetches current database state
```

Examples:

``` text
revalidatePath("/contacts")
revalidatePath("/employees")
revalidatePath("/follow-ups")
```

When a mutation affects multiple modules, all relevant paths should be
revalidated.

For example, creating a follow-up may require:

``` text
/follow-ups
/employees
/dashboard
```

to reflect the updated state.

------------------------------------------------------------------------

# 34. Search Architecture

For the expected initial dataset size, search can remain simple.

Example:

``` text
Database Records
       │
       ▼
Server Component
       │
       ▼
Client-side Search
       │
       ▼
Filtered Results
```

This approach is acceptable for small datasets such as approximately
100--200 clients.

As the dataset grows significantly, server-side filtering and database
indexing can be introduced.

------------------------------------------------------------------------

# 35. Matching Architecture

The first version of buyer-seller matching should remain rule-based.

Conceptually:

``` text
Buyer Requirement
        │
        ├── Area
        ├── Length
        ├── Width
        └── Budget
        │
        ▼
Available Seller Properties
        │
        ▼
Matching Rules
        │
        ▼
Potential Matches
```

Future versions may introduce:

-   Ranking
-   Approximate dimension matching
-   Price tolerance
-   Preference weighting
-   Match scores

These should not complicate the initial implementation.

------------------------------------------------------------------------

# 36. Architectural Principles

BrokerHub should follow these principles throughout development.

### 1. PostgreSQL is the source of truth

Business data should ultimately come from PostgreSQL.

### 2. Server-side operations are authoritative

Client-side checks improve UX but cannot replace server-side validation.

### 3. Keep the architecture simple

The application is designed for a small business and should not
introduce enterprise complexity without a real requirement.

### 4. Prefer reusable components

Shared UI elements such as:

-   Header
-   Sidebar
-   Modals
-   Buttons
-   Status badges

should be reused where practical.

### 5. Keep business logic close to its module

Marketing logic should remain within the Marketing module.

Follow-up logic should remain within the Follow-ups module.

Property logic should remain within property-related modules.

### 6. Preserve history

Important historical records should not disappear automatically.

### 7. Protect the database

PostgreSQL must remain private and accessible only through the
application/server.

### 8. Design for migration

The system should be capable of moving from a development machine to a
laptop and eventually to a Raspberry Pi with minimal architectural
changes.

------------------------------------------------------------------------

# 37. Final Architecture

The complete intended architecture can be summarized as:

``` text
                         ┌──────────────────────┐
                         │      User Browser    │
                         │                      │
                         │ Owner / Employee     │
                         └──────────┬───────────┘
                                    │
                                    │ HTTPS
                                    ▼
                         ┌──────────────────────┐
                         │   Secure Tunnel      │
                         │ Cloudflare/Tailscale │
                         └──────────┬───────────┘
                                    │
                                    ▼
                  ┌──────────────────────────────────┐
                  │          BrokerHub Server         │
                  │                                  │
                  │             Next.js              │
                  │          App Router              │
                  │                                  │
                  │  ┌────────────┐ ┌─────────────┐ │
                  │  │   Pages    │ │   Server    │ │
                  │  │ Components │ │   Actions   │ │
                  │  └────────────┘ └──────┬──────┘ │
                  │                         │        │
                  │                      Prisma      │
                  └─────────────────────────┼────────┘
                                            │
                                            ▼
                              ┌────────────────────────┐
                              │      PostgreSQL 17     │
                              │                        │
                              │      BrokerHub DB      │
                              └───────────┬────────────┘
                                          │
                                          ▼
                                ┌────────────────────┐
                                │   Docker Volume    │
                                │   postgres_data    │
                                └────────────────────┘
```

The architecture intentionally keeps the system compact:

``` text
Next.js
   ↓
Prisma
   ↓
PostgreSQL
   ↓
Docker
```

This provides a practical foundation for BrokerHub while leaving room
for authentication, advanced matching, notifications, analytics, and
migration to dedicated self-hosted hardware in future versions. \`\`\`
