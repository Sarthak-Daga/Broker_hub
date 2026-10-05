```md
# BrokerHub — Development Rules

This document contains the development rules and guardrails for BrokerHub.

These rules exist to keep the project consistent, maintainable, secure, and aligned with the original product requirements.

---

# 1. General Development Rules

## Rule 1 — Keep the architecture simple

BrokerHub is designed for a small real estate business.

Do not introduce unnecessary complexity such as:

- Microservices
- Kubernetes
- Message queues
- Multiple backend services
- Separate frontend and backend applications
- Complex distributed systems

unless a genuine requirement appears.

Preferred architecture:

```text
Next.js
   ↓
Prisma
   ↓
PostgreSQL
   ↓
Docker
```

---

## Rule 2 — Build for the actual business

Every feature should solve a real business problem.

Before implementing a new feature, ask:

```text
Does the Owner need this?

Does an Employee need this?

Does it reduce manual work?

Does it improve organization?

Does it improve client/property management?
```

Avoid adding features simply because they are technically interesting.

---

## Rule 3 — Do not over-engineer

Prefer the simplest solution that correctly solves the problem.

For example:

- Simple search is sufficient for ~100–200 clients.
- Simple rule-based matching is sufficient initially.
- Follow-ups do not require a separate notification infrastructure.
- PostgreSQL is sufficient for the expected scale.

Advanced solutions can be introduced when actual requirements justify them.

---

# 2. Database Rules

## Rule 4 — PostgreSQL is the source of truth

Persistent business data must be stored in PostgreSQL.

Do not create a second persistent data source for the same business information without a clear reason.

---

## Rule 5 — Use Prisma for database access

Application code should access PostgreSQL through the centralized Prisma database layer.

Preferred:

```text
Next.js
   ↓
Prisma
   ↓
PostgreSQL
```

Avoid scattering independent database connections throughout the application.

---

## Rule 6 — Preserve relationships

Database relationships should represent actual business relationships.

Examples:

```text
Client → Seller
Client → Buyer
Client → FollowUp
Employee → FollowUp
Employee → Marketing
Colony → Wing
Wing → Floor
Floor → Flat
```

Do not duplicate data unnecessarily.

---

## Rule 7 — Client represents the person

A Client record represents a person.

Do not create separate copies of the same person's basic information for:

- Buyer
- Seller
- Marketing
- Follow-up

Instead, reference the Client.

---

## Rule 8 — Buyer represents a requirement

A Buyer record represents a specific buying requirement.

One Client may have multiple Buyer records.

Example:

```text
Client A
 ├── Buyer Requirement 1
 ├── Buyer Requirement 2
 └── Buyer Requirement 3
```

Do not assume one client can only have one requirement.

---

## Rule 9 — Seller represents a property

A Seller record represents a specific property.

One Client may have multiple Seller records.

Example:

```text
Client A
 ├── Property 1
 ├── Property 2
 └── Property 3
```

Do not treat the Client record itself as the property.

---

# 3. Marketing Rules

## Rule 10 — Marketing is a relationship

Marketing records represent a relationship between:

```text
Client
   ↕
Marketing
   ↕
Colony
```

A client may be interested in multiple colonies.

A colony may have multiple interested clients.

---

## Rule 11 — Marketing status belongs to the relationship

The marketing status belongs to the specific Client–Colony relationship.

Example:

```text
Client A
 ├── Colony X → VISITED
 └── Colony Y → CALLED_NOT_VISITED
```

Do not store one global marketing status on the Client.

---

## Rule 12 — Marketing status must not move backwards

The intended workflow is:

```text
NONE
  ↓
CALLED_NOT_VISITED
  ↓
VISITED
```

A status should not casually move backwards.

`NOT_INTERESTED` is retained as a meaningful historical state.

---

## Rule 13 — Employee assignment is Owner-controlled

Only the Owner can:

- Assign employees
- Change assignments
- Remove assignments

Employees cannot change assignments.

---

## Rule 14 — Employees only modify assigned marketing leads

Employees may update the status of marketing relationships assigned to them.

They should not be able to modify another employee's assignments.

---

# 4. Property Rules

## Rule 15 — Maintain the property hierarchy

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

Do not bypass this hierarchy without a genuine requirement.

---

## Rule 16 — Store actual Flat records

Individual flats should be represented as database records.

Do not rely exclusively on calculated counts.

Example:

```text
Flat 101
Flat 102
Flat 103
```

Each can independently have:

- Type
- Number
- Status

---

## Rule 17 — Flat status is the source of availability

Property availability should be derived from individual Flat records.

For example:

```text
AVAILABLE flats
=
count(Flat where status = AVAILABLE)
```

Do not maintain a separate manually edited colony availability number unless there is a future requirement for it.

---

## Rule 18 — Flat type belongs to Flat

Examples:

```text
1BHK
2BHK
3BHK
```

The system should not assume that every flat in a floor has the same type.

---

## Rule 19 — Support different wing configurations

Different wings may have different numbers of floors.

Example:

```text
Wing A → 10 floors
Wing B → 8 floors
Wing C → 12 floors
```

The property generator must support this.

---

# 5. Buyer and Seller Rules

## Rule 20 — Dimensions are explicit

Seller and Buyer records store:

```text
Length
Width
```

Area is calculated as:

```text
Length × Width
```

Example:

```text
30 × 40 = 1200 sq ft
```

---

## Rule 21 — Seller demand is per square foot

Seller demand represents the asking rate per square foot.

Example:

```text
Area = 1200 sq ft
Demand = ₹200/sq ft

Total = ₹2,40,000
```

The UI may calculate and display the total value.

---

## Rule 22 — Do not assume property uniqueness

Do not enforce uniqueness based only on:

```text
Client
Area
Length
Width
```

The same client may legitimately have multiple properties with identical dimensions.

If necessary, the UI may warn the user that a similar property already exists.

The warning should not automatically prevent creation.

---

## Rule 23 — Buyer and seller matching starts simple

Initial matching may use:

- Same area
- Compatible dimensions
- Available seller property
- Seller property not marked SOLD
- Buyer budget compatibility

Do not introduce AI or complex ranking unless explicitly required.

---

# 6. Property Subdivision Rules

## Rule 24 — Do not implement automatic geometry initially

For the first version, property subdivision is handled manually.

Example:

```text
Original:
30 × 100
```

becomes:

```text
30 × 25
30 × 75
```

The application may create new seller records for the resulting pieces.

---

## Rule 25 — Preserve the original property history

When a property is subdivided, the original record should not simply disappear.

It should be marked appropriately, such as:

```text
SOLD
```

or another future unavailable state.

The resulting pieces can then be represented as new records.

---

# 7. Follow-up Rules

## Rule 26 — Follow-ups are first-class records

Follow-ups must be represented by their own database entity.

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

---

## Rule 27 — Active follow-ups

Only these statuses are considered active:

```text
PENDING
POSTPONED
```

---

## Rule 28 — Historical follow-ups

These statuses are considered historical:

```text
DONE
CANCELLED
```

Historical follow-ups should remain in the database.

They should not automatically be deleted.

---

## Rule 29 — Deletion must be explicit

Historical follow-ups may be deleted manually.

Deletion should happen only through an explicit user action.

Important historical data must never disappear simply because a follow-up was completed.

---

## Rule 30 — DONE means completed

When a user marks a follow-up as Done:

```text
status = DONE
```

The record must remain in the database.

Do not delete it.

---

## Rule 31 — CANCELLED means cancelled

When a user cancels a follow-up:

```text
status = CANCELLED
```

The record must remain in the database.

Do not delete it automatically.

---

## Rule 32 — OVERDUE is derived

Do not create a separate database status called `OVERDUE`.

A follow-up is overdue when:

```text
status = PENDING
AND
dateTime < current time
```

The UI should display:

```text
OVERDUE
```

but the database should continue to store:

```text
PENDING
```

---

## Rule 33 — Follow-up date must be in the future

When creating or rescheduling an active follow-up, the selected date/time must be in the future.

This applies to:

- Creating
- Editing
- Postponing
- Restoring to Pending

---

## Rule 34 — Validate dates on the server

Client-side validation is useful for UX but is not sufficient.

The Server Action must independently validate the date.

Example:

```text
User Input
    ↓
Client Validation
    ↓
Server Action
    ↓
Server Validation
    ↓
Database
```

---

## Rule 35 — Follow-up sorting

Follow-ups should be ordered by urgency.

Preferred order:

```text
Overdue Pending
Pending
Postponed
Done
Cancelled
```

Within each status group, sort by date/time.

---

## Rule 36 — Employee follow-up count means active work

Employee follow-up counts should include:

```text
PENDING
POSTPONED
```

and exclude:

```text
DONE
CANCELLED
```

---

# 8. Employee Rules

## Rule 37 — Employee IDs are formatted for display

Database IDs remain numeric.

The UI should display employee IDs as three-digit values.

Example:

```text
1   → 001
2   → 002
15  → 015
```

---

## Rule 38 — Employee administration is Owner-controlled

Only the Owner should manage employee records.

This includes:

- Add employee
- Remove employee
- Modify employee information
- Assign employees

---

## Rule 39 — Employees have restricted permissions

Employees should not be able to:

- Add clients
- Delete clients
- Add colonies
- Delete colonies
- Assign employees
- Modify other employee assignments

Final enforcement must happen on the server.

---

# 9. Contacts Rules

## Rule 40 — Contacts are general business contacts

A Contact is intended for people who are not necessarily active:

- Buyers
- Sellers
- Marketing leads

They may be retained for future opportunities.

---

## Rule 41 — Contact fields

The current Contact information is:

```text
Name
Address
Mobile Number
Remarks
```

Remarks are optional.

---

## Rule 42 — Keep Contact management simple

The Contacts module should support:

- Create
- View
- Search
- Delete

Additional complexity should only be introduced when required.

---

# 10. UI Rules

## Rule 43 — Use the established dark theme

The primary visual language is:

```text
Slate 950
Slate 900
Slate 800
Blue accent
White text
Slate secondary text
```

Do not introduce unrelated color schemes on individual pages.

---

## Rule 44 — Reuse Header and Sidebar

All major pages should use the shared:

```text
Header
Sidebar
```

components.

Do not create independent versions of the global navigation for individual pages.

---

## Rule 45 — Use consistent cards

Cards should generally use:

```text
rounded-xl
border-slate-800
bg-slate-900/50
```

Avoid creating a different card style for every module.

---

## Rule 46 — Primary actions use blue

Examples:

```text
+ Add Contact
+ Add Employee
+ Add Follow-up
Save
```

should use the primary blue action style.

---

## Rule 47 — Destructive actions must look destructive

Examples:

```text
Delete
Remove
Cancel
```

should use a danger/red visual treatment where appropriate.

Do not style Delete buttons identically to Save buttons.

---

## Rule 48 — Status colors must remain consistent

Use consistent semantic meaning:

```text
PENDING     → Blue
POSTPONED   → Amber
DONE        → Green
CANCELLED   → Red
OVERDUE     → Red / Attention
```

Do not randomly change status colors between pages.

---

# 11. Forms and Modals

## Rule 49 — Keep forms focused

Only ask for information required for the current operation.

Avoid unnecessary fields.

---

## Rule 50 — Labels must be clear

Every input should have a meaningful label.

Do not rely only on placeholder text.

---

## Rule 51 — Successful creation should close the modal

After a successful Server Action:

```text
Create
  ↓
Database
  ↓
Revalidate
  ↓
Close Modal
  ↓
Show updated data
```

---

## Rule 52 — Failed operations should not silently disappear

If an operation fails, provide useful feedback.

Do not silently close the form while leaving the user uncertain whether the operation succeeded.

---

# 12. Search Rules

## Rule 53 — Keep search simple initially

The expected dataset is relatively small.

Client-side filtering is acceptable for modules such as Contacts.

Do not introduce Elasticsearch or another search service without a real requirement.

---

## Rule 54 — Search should be fast

Search fields should update results without requiring unnecessary navigation.

---

# 13. Security Rules

## Rule 55 — PostgreSQL must remain private

Never expose PostgreSQL directly to the public internet.

Do not expose port:

```text
5432
```

through the public network in production.

---

## Rule 56 — Never trust client-side authorization

Hiding a button is not authorization.

For example, if an Employee should not assign another employee, the Server Action must reject the request even if the user manually constructs the request.

---

## Rule 57 — Validate Server Actions

Every mutation should validate:

- IDs
- Required fields
- Data types
- Dates
- Permissions
- Business rules

before modifying the database.

---

## Rule 58 — Protect environment variables

Never commit secrets such as:

```text
DATABASE_URL
```

to Git.

`.env` must remain ignored.

---

## Rule 59 — Do not log sensitive information unnecessarily

Avoid logging:

- Database credentials
- Authentication secrets
- Sensitive client information

unless necessary for debugging.

---

# 14. Code Organization Rules

## Rule 60 — Keep modules separated

Business logic should remain close to the module that owns it.

Examples:

```text
contacts/
employees/
follow-ups/
marketing/
buyers-sellers/
```

Do not place all business logic into one giant file.

---

## Rule 61 — Reuse shared UI

Shared UI belongs in:

```text
app/components/
```

Examples:

```text
header.tsx
sideBar.tsx
```

Reusable components should be extracted when they are genuinely shared.

---

## Rule 62 — Avoid unnecessary abstraction

Do not create a generic abstraction simply because two components currently share a few lines.

Extract abstractions when they improve:

- Reuse
- Readability
- Consistency
- Maintainability

---

## Rule 63 — Keep Server and Client boundaries intentional

Use Server Components by default.

Use Client Components when browser-side state or interaction requires them.

Do not mark an entire page `"use client"` just because one small component needs client-side state.

---

# 15. Data Integrity Rules

## Rule 64 — Do not silently lose business data

Important business records should not be deleted automatically.

This particularly applies to:

- Completed follow-ups
- Cancelled follow-ups
- Sold properties
- Historical records

---

## Rule 65 — Prefer status changes over deletion

When a record has a meaningful historical state, prefer:

```text
status = DONE
```

over:

```text
DELETE
```

when appropriate.

---

## Rule 66 — Do not create duplicate sources of truth

For example:

Do not store:

```text
Colony.availableFlats = 37
```

and independently maintain:

```text
37 Flat records
```

if the count can be derived from the Flat records.

Avoid storing information that can become inconsistent unnecessarily.

---

# 16. Git Rules

## Rule 67 — Documentation belongs in Git

The following directory should be committed:

```text
docs/
```

Do not add it to `.gitignore`.

---

## Rule 68 — Ignore generated and secret files

The `.gitignore` should include things such as:

```text
node_modules/
.next/
.env
.env.local
*.log
```

---

## Rule 69 — Commit logical checkpoints

Prefer meaningful commits such as:

```text
feat: add contacts module
feat: add follow-up management
feat: add employee management
feat: add dashboard statistics
fix: validate follow-up dates
docs: add project documentation
```

Avoid meaningless commit messages such as:

```text
update
changes
stuff
final
final2
```

---

## Rule 70 — Do not commit broken checkpoints intentionally

Before committing a feature, make sure the application is at least in a reasonably working state.

---

# 17. Documentation Rules

## Rule 71 — Keep documentation synchronized

When an important architectural or product decision changes, update the relevant documentation.

Potential files:

```text
docs/prd.md
docs/architecture.md
docs/rules.md
docs/design.md
docs/task.md
docs/memory.md
```

---

## Rule 72 — Do not document features that do not exist

Documentation should distinguish between:

```text
Implemented
Planned
Future
```

Do not describe a future feature as though it already exists.

---

# 18. Prisma Rules

## Rule 73 — Follow the current Prisma 8 setup

The project currently uses Prisma 8.

Do not blindly apply commands or APIs from older Prisma versions.

The current project uses the Prisma 8 contract/runtime architecture.

---

## Rule 74 — Keep the Prisma contract as the database definition

The main schema definition is:

```text
prisma/contract.prisma
```

Database changes should be reflected there.

---

## Rule 75 — Do not manually modify generated Prisma artifacts unnecessarily

Generated files should generally be treated as generated output.

Modify the source contract/configuration rather than manually patching generated artifacts unless there is a specific reason.

---

# 19. Performance Rules

## Rule 76 — Optimize for actual scale

The initial expected scale is small.

Do not prematurely optimize for:

```text
Millions of clients
Thousands of employees
Massive traffic
```

Focus on correctness and maintainability first.

---

## Rule 77 — Avoid unnecessary client-side JavaScript

Prefer Server Components for static/database-driven pages.

Only introduce client-side interactivity where needed.

---

## Rule 78 — Avoid unnecessary database queries

When implementing a page, retrieve the data actually required.

If multiple related datasets are needed, design the queries intentionally rather than repeatedly fetching the same records.

---

# 20. UX Rules

## Rule 79 — Important information comes first

Pages should prioritize:

```text
Important information
      ↓
Primary actions
      ↓
Secondary information
      ↓
Historical information
```

---

## Rule 80 — Do not make common actions difficult

Common operations such as:

- Adding a contact
- Adding a follow-up
- Completing a follow-up
- Searching for a client

should require minimal interaction.

---

## Rule 81 — Use confirmation for meaningful deletion

Deleting meaningful historical information should generally require confirmation.

Example:

```text
Delete Follow-up?

This action cannot be undone.

Cancel     Delete
```

---

# 21. Future Feature Rules

## Rule 82 — Do not add future features prematurely

Potential features include:

- Google Calendar
- Email reminders
- WhatsApp
- Advanced matching
- Analytics
- Property images
- Cloud backups

These should not complicate the initial system unless required.

---

## Rule 83 — Future features must respect existing architecture

New features should extend the existing architecture rather than bypassing it.

Preferred:

```text
Next.js
   ↓
Server Logic
   ↓
Prisma
   ↓
PostgreSQL
```

---

# 22. Architecture Change Rules

## Rule 84 — Question established decisions before changing them

If a change is proposed to an established architecture decision, first determine:

1. What requirement necessitates the change?
2. Why is the current solution insufficient?
3. What new complexity will be introduced?
4. What existing modules will be affected?
5. Does the benefit justify the complexity?

---

## Rule 85 — Update documentation after major changes

If an architectural decision changes, update the relevant documentation.

At minimum, consider:

```text
architecture.md
rules.md
memory.md
```

Also update:

```text
prd.md
design.md
task.md
```

when their contents are affected.

---

# 23. Final Development Principles

BrokerHub development should follow these principles:

```text
1. Keep it simple.
2. Build for the real business.
3. PostgreSQL is the source of truth.
4. Server-side validation is authoritative.
5. Do not trust client-side authorization.
6. Preserve useful history.
7. Avoid unnecessary duplication.
8. Reuse established UI patterns.
9. Do not over-engineer.
10. Keep the database private.
11. Document important decisions.
12. Prefer maintainability over cleverness.
```

---

# 24. Golden Rule

When uncertain about an implementation decision:

> **Choose the simplest solution that correctly represents the real business workflow, preserves data integrity, and fits the existing BrokerHub architecture.**
```