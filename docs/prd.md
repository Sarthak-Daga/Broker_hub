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

## Current Product Decision Addendum --- Property Creation UX

The property hierarchy requirements are refined as follows.

### Area and Colony

The Flat/property flow provides searchable selection for Area and
Colony.

The user can create: - Area inline - Colony inline

Newly created records should be selected automatically.

### Wing, Floor, and Flat

These are NOT created individually from the searchable selector.

Instead, the Owner uses a Property Structure Generator after selecting a
Colony.

The generator must support: - Multiple wings - Custom wing names -
Different floor counts per wing - Different flat counts per floor - Flat
numbering generation - Flat type configuration - Review before
generation - Duplicate-generation protection

The resulting database records are:

``` text
Colony
  ↓
Wing
  ↓
Floor
  ↓
Flat
```

Actual Flat records remain the source of truth for availability.

The generator must not create Seller or Buyer records automatically.

------------------------------------------------------------------------

``` md
# BrokerHub — Product Requirements Document

## 1. Product Overview

**Product Name:** BrokerHub

**Tagline:** One place to manage every property relationship.

BrokerHub is a self-hosted real estate Customer Relationship Management (CRM) system designed for a small real estate business.

The system centralizes client information, property-related requirements, marketing leads, buyer and seller records, employees, and follow-ups in one place.

The primary goal is to replace scattered notebooks, spreadsheets, messages, and manual reminders with a single structured system.

---

## 2. Problem Statement

Small real estate businesses often manage customer information and property relationships manually.

Information about:

- Clients
- Buyers
- Sellers
- Properties
- Marketing leads
- Employee assignments
- Follow-ups
- Reminders

can become scattered across different places.

This makes it difficult to:

- Know which clients are currently active
- Track buyer requirements
- Track seller properties
- Follow up with clients on time
- Assign leads to employees
- Know the status of marketing leads
- Search historical client information
- Maintain a centralized source of truth

BrokerHub solves this by providing a centralized CRM specifically tailored to the workflow of a small real estate business.

---

## 3. Target Users

BrokerHub is designed for a small real estate business consisting of:

- 1 Owner / Administrator
- Approximately 5 Employees
- Approximately 100–200 clients per year

The system is intended for internal business use rather than a public real estate listing website.

---

## 4. User Roles

### 4.1 Owner

The Owner has full access to the system.

The Owner can:

- Add clients
- Remove clients
- Add colonies/societies
- Manage properties
- Add employees
- Remove employees
- Assign employees
- Create follow-ups
- Manage marketing leads
- Manage buyers
- Manage sellers
- View all records
- Modify assignments
- Manage the overall CRM

### 4.2 Employee

Employees have restricted access.

Employees can:

- View records assigned to them
- Work on assigned marketing leads
- Update the status of assigned marketing leads
- View their follow-ups
- Manage follow-up statuses where permitted

Employees cannot:

- Add or remove clients
- Add or remove colonies
- Assign leads to other employees
- Modify employee assignments
- Perform administrative operations

---

# 5. Core Modules

BrokerHub consists of the following major modules:

1. Dashboard
2. Contacts
3. Employees
4. Follow-ups
5. Marketing
6. Buyers & Sellers
7. Property / Colony Management

---

# 6. Dashboard

The Dashboard provides a high-level overview of the business.

It should display important statistics such as:

- Total Clients
- Total Properties
- Active Follow-ups
- Total Employees

The dashboard should also provide visibility into important upcoming or overdue follow-ups.

### Dashboard Requirements

The dashboard must:

- Display live data from the database
- Show important business statistics
- Highlight active follow-ups
- Highlight overdue follow-ups
- Provide navigation to major modules
- Avoid requiring the user to manually refresh data where possible

---

# 7. Contacts

The Contacts module stores general business contacts.

A contact represents a person who may not currently be an active buyer, seller, or marketing lead but may be useful for future business opportunities.

### Contact Fields

Each contact should contain:

- Name
- Address
- Mobile Number
- Remarks

### Contact Operations

The system should support:

- Create contact
- View contacts
- Search contacts
- Delete contact

The system should provide a simple and fast interface because the expected dataset is relatively small.

---

# 8. Employees

The Employees module manages employees working in the real estate business.

### Employee Fields

Each employee should contain:

- Employee ID
- Name
- Phone Number

Employee IDs should be displayed in a human-readable format such as:

```text
001
002
003
```

### Employee Features

The Owner should be able to:

-   Add employees
-   View employees
-   Remove employees
-   View employee-related follow-ups

The employee dashboard should provide visibility into active follow-ups
assigned to each employee.

------------------------------------------------------------------------

# 9. Follow-ups

Follow-ups are a core part of BrokerHub.

A follow-up represents a scheduled action that needs to happen for a
client.

Examples:

-   Call a client tomorrow
-   Follow up after a property visit
-   Contact a buyer next week
-   Contact a seller regarding a property
-   Follow up with a marketing lead

### Follow-up Fields

Each follow-up should contain:

-   Client
-   Employee
-   Date and Time
-   Notes
-   Purpose
-   Status

### Follow-up Purpose

Supported purposes include:

-   General
-   Marketing
-   Buyer
-   Seller

### Follow-up Statuses

The system uses four database statuses:

``` text
PENDING
POSTPONED
DONE
CANCELLED
```

#### Active Statuses

``` text
PENDING
POSTPONED
```

These represent follow-ups that still require attention.

#### Historical Statuses

``` text
DONE
CANCELLED
```

These are retained as historical records.

Historical follow-ups should not disappear automatically.

They may be explicitly deleted by the user when required.

### Overdue Follow-ups

An overdue follow-up is not stored as a separate database status.

A follow-up is considered overdue when:

``` text
status = PENDING
AND
dateTime < current time
```

The UI should display such follow-ups as:

``` text
OVERDUE
```

while the underlying database status remains:

``` text
PENDING
```

### Follow-up Operations

The system should support:

-   Create follow-up
-   Edit follow-up
-   Mark as Done
-   Postpone
-   Restore to Pending
-   Cancel
-   Delete historical follow-up

### Date Validation

Follow-up dates must be in the future when:

-   Creating a follow-up
-   Postponing a follow-up
-   Restoring a cancelled/postponed follow-up to Pending
-   Editing a follow-up date

Date validation should be performed on both:

-   Client side
-   Server side

------------------------------------------------------------------------

# 10. Marketing

The Marketing module manages clients generated through property/project
marketing campaigns.

Marketing leads may be interested in one or more colonies/societies.

A client can therefore have multiple marketing relationships.

For example:

``` text
Client XYZ
 ├── Colony A
 ├── Colony B
 └── Colony C
```

and:

``` text
Client PQS
 ├── Colony B
 ├── Colony D
 └── Colony E
```

This means the same colony can be associated with many clients, and the
same client can be interested in many colonies.

This relationship is therefore many-to-many.

------------------------------------------------------------------------

## 10.1 Marketing Client Information

A marketing client should contain:

-   Name
-   Current Address
-   Mobile Number
-   Remarks

------------------------------------------------------------------------

## 10.2 Colony / Society Information

A colony/society should contain:

-   Name
-   Location

Property availability should be derived from the actual properties/flats
associated with the colony rather than manually maintained as a single
availability number.

------------------------------------------------------------------------

## 10.3 Marketing Relationship

Each client-colony relationship should maintain information such as:

-   Client
-   Colony
-   Employee assignment
-   Status
-   Priority
-   Remarks

Property details and requirements may be added during creation or later.

------------------------------------------------------------------------

## 10.4 Marketing Status

Marketing relationships use the following statuses:

``` text
NONE
CALLED_NOT_VISITED
VISITED
NOT_INTERESTED
```

The status represents the current state of the lead.

The status should not move backwards through the workflow.

For example:

``` text
NONE
  ↓
CALLED_NOT_VISITED
  ↓
VISITED
```

Once a client reaches:

``` text
NOT_INTERESTED
```

that state should be retained historically.

------------------------------------------------------------------------

## 10.5 Marketing Priority

Marketing leads may have a priority rating from one to five stars:

``` text
ONE_STAR
TWO_STAR
THREE_STAR
FOUR_STAR
FIVE_STAR
```

This allows employees and the Owner to distinguish between
lower-priority and higher-priority leads.

------------------------------------------------------------------------

## 10.6 Marketing Employee Assignment

The Owner controls employee assignments.

The Owner can:

-   Assign an employee
-   Change an assignment
-   Remove an assignment

Employees cannot change assignments.

Employees are responsible for working on leads assigned to them.

Employees may update the status of assigned marketing leads.

------------------------------------------------------------------------

# 11. Buyers & Sellers

The Buyers & Sellers module manages actual property requirements and
property listings.

A client may have multiple properties or multiple buying requirements.

Therefore, the system separates:

``` text
Client
```

from:

``` text
Seller Property
Buyer Requirement
```

This allows one client to own multiple properties or maintain multiple
requirements.

------------------------------------------------------------------------

# 12. Seller Properties

A seller record represents one property being offered for sale.

### Seller Property Fields

Each seller property should contain:

-   Seller Property ID
-   Client
-   Area
-   Length
-   Width
-   Demand
-   Status
-   Remarks

### Property Dimensions

Area is calculated using:

``` text
Area = Length × Width
```

For example:

``` text
Length = 30
Width  = 40

Area = 30 × 40
     = 1200 sq ft
```

If the demand is ₹200 per sq ft:

``` text
Total Price = 1200 × 200
            = ₹2,40,000
```

The application may calculate and display this value.

------------------------------------------------------------------------

## 12.1 Seller Status

Seller properties may have statuses such as:

``` text
UNSOLD
SOLD
```

The system should retain the property record even after it is sold so
that historical information is not lost.

------------------------------------------------------------------------

# 13. Buyer Requirements

A buyer record represents one property requirement from a client.

A client may have multiple buyer requirements.

### Buyer Requirement Fields

Each requirement should contain:

-   Buyer Requirement ID
-   Client
-   Area
-   Length
-   Width
-   Budget
-   Status
-   Remarks

------------------------------------------------------------------------

## 13.1 Buyer Status

Buyer requirements use statuses such as:

``` text
NOTPURCHASED
PURCHASED
CANCELLED
```

------------------------------------------------------------------------

# 14. Buyer-Seller Matching

BrokerHub should support matching buyer requirements with available
seller properties.

The initial matching system should be simple and deterministic.

Potential matching criteria include:

-   Same area
-   Compatible dimensions
-   Seller property is available
-   Seller property is not marked as SOLD
-   Property price fits within the buyer's budget

The initial version does not need complex AI-based matching.

The matching system can be improved later with ranking and approximate
matching.

------------------------------------------------------------------------

# 15. Property Subdivision

A seller property may sometimes be divided among multiple buyers.

Example:

``` text
Seller Property:
30 × 100
```

Two buyers may require:

``` text
Buyer A → 30 × 25
Buyer B → 30 × 75
```

For the initial version, property subdivision does not need automatic
geometric processing.

Instead:

1.  Mark the original property as SOLD or unavailable.
2.  Create new seller property records representing the resulting
    pieces.

More advanced subdivision and geometry handling can be added in a future
version.

------------------------------------------------------------------------

# 16. Property Hierarchy

BrokerHub supports structured property management using the hierarchy:

``` text
Colony
   ↓
Wing
   ↓
Floor
   ↓
Flat
```

------------------------------------------------------------------------

## 16.1 Colony

A colony represents a residential project, society, or property
development.

A colony contains multiple wings.

------------------------------------------------------------------------

## 16.2 Wing

A wing belongs to a colony.

Each wing contains multiple floors.

The system should support different numbers of floors for different
wings.

Example:

``` text
Colony A

Wing A → 10 floors
Wing B → 8 floors
Wing C → 12 floors
```

------------------------------------------------------------------------

## 16.3 Floor

Each floor belongs to a wing.

A floor contains multiple flats.

Different floors may contain different numbers of flats.

------------------------------------------------------------------------

## 16.4 Flat

Each flat belongs to a floor.

A flat should contain:

-   Flat Number
-   Type
-   Status

Flat types may include:

``` text
1BHK
2BHK
3BHK
```

Flat statuses may include:

``` text
AVAILABLE
SOLD
```

The system should store actual flat records rather than relying only on
calculated counts.

------------------------------------------------------------------------

# 17. Property Generator

BrokerHub should provide a property generation workflow for creating
large property structures efficiently.

The Owner should be able to specify:

1.  Number of wings
2.  Wing names
3.  Number of floors per wing
4.  Number of flats per floor
5.  Flat types / relevant configuration

The system then generates the corresponding:

``` text
Wing
Floor
Flat
```

records.

Example:

``` text
Colony A

Wing A
 ├── Floor 1
 │    ├── Flat 101
 │    ├── Flat 102
 │    └── Flat 103
 │
 ├── Floor 2
 │    ├── Flat 201
 │    ├── Flat 202
 │    └── Flat 203

Wing B
 ├── Floor 1
 ├── Floor 2
 └── Floor 3
```

The generated flat records are the source of truth for actual property
availability.

------------------------------------------------------------------------

# 18. Search

BrokerHub should provide fast search functionality for commonly accessed
records.

Search should be available for relevant modules such as:

-   Contacts
-   Clients
-   Employees
-   Properties
-   Marketing leads

For the expected business size of approximately 100--200 clients per
year, client-side search may be sufficient for initial versions of some
modules.

------------------------------------------------------------------------

# 19. Notifications and Reminders

Follow-ups act as the primary reminder mechanism.

The system should make upcoming and overdue follow-ups highly visible.

Future versions may support:

-   Browser notifications
-   Email reminders
-   WhatsApp integration
-   Google Calendar integration

These are not required for the initial version.

------------------------------------------------------------------------

# 20. Authentication and Authorization

The system should eventually support authentication.

The system must distinguish between:

``` text
OWNER
EMPLOYEE
```

Authorization rules should be enforced on the server.

UI restrictions alone are not sufficient for access control.

The final system should prevent unauthorized users from directly
invoking administrative operations.

------------------------------------------------------------------------

# 21. Data Storage

BrokerHub uses:

``` text
PostgreSQL
```

as its primary database.

The database runs inside Docker during self-hosted deployment.

The application communicates with PostgreSQL through the Prisma ORM
layer.

The PostgreSQL database must not be directly exposed to the public
internet.

------------------------------------------------------------------------

# 22. Deployment

BrokerHub is designed primarily as a self-hosted application.

Initial deployment target:

``` text
Owner's laptop
```

Future deployment target:

``` text
Raspberry Pi
```

The application should therefore remain portable.

Docker Compose is used to simplify migration between machines.

A future deployment architecture may look like:

``` text
Internet
   ↓
Secure Tunnel
   ↓
Laptop / Raspberry Pi
   ↓
Docker
   ├── Next.js
   └── PostgreSQL
```

Potential remote-access technologies include:

-   Cloudflare Tunnel
-   Tailscale

The final choice can be made during deployment.

------------------------------------------------------------------------

# 23. Non-Functional Requirements

## Performance

The application should feel responsive for the expected business scale.

The expected initial dataset is relatively small, so the system should
prioritize simplicity and reliability over premature optimization.

## Reliability

Business records should persist reliably in PostgreSQL.

Historical follow-ups should not be silently deleted.

## Security

The system should:

-   Protect administrative operations
-   Enforce authorization server-side
-   Keep database credentials private
-   Never expose PostgreSQL directly to the internet
-   Keep environment variables out of Git
-   Validate user input on the server

## Maintainability

The project should have:

-   Clear module separation
-   Reusable UI components
-   Server Actions for mutations where appropriate
-   Centralized database access
-   Project documentation
-   Clear development rules

## Portability

The application should be able to move from:

``` text
Development PC
      ↓
Owner Laptop
      ↓
Raspberry Pi
```

without requiring major architectural changes.

------------------------------------------------------------------------

# 24. Current Scope

The initial production-oriented scope includes:

-   Dashboard
-   Contacts
-   Employees
-   Follow-ups
-   Marketing leads
-   Buyer requirements
-   Seller properties
-   Areas
-   Colonies
-   Wings
-   Floors
-   Flats
-   Property generation
-   Employee assignment
-   Follow-up management
-   Basic buyer-seller matching
-   Role-based access

------------------------------------------------------------------------

# 25. Future Scope

Potential future improvements include:

-   Authentication
-   Advanced role-based access control
-   Google Calendar integration
-   Email reminders
-   WhatsApp integration
-   Advanced property matching
-   Approximate property matching
-   Property map integration
-   Analytics and reports
-   Sales dashboards
-   Revenue tracking
-   Interaction history
-   Call logs
-   Visit history
-   Lead conversion analytics
-   Mobile-friendly PWA
-   Cloud backup
-   Automated database backups
-   Advanced property subdivision
-   Notifications

These features should not complicate the initial implementation unless
they become necessary.

------------------------------------------------------------------------

# 26. Product Design Philosophy

BrokerHub should follow these principles:

### Simple

The system is designed for a small real estate business, not a large
enterprise.

### Fast

Common actions such as searching for a client or checking today's
follow-ups should require minimal interaction.

### Centralized

Business information should exist in one reliable system.

### Practical

Features should solve actual real estate workflow problems rather than
exist only for technical complexity.

### Maintainable

The architecture should remain understandable to a student developer
maintaining the project long-term.

### Self-Hosted

The system should remain capable of running on the business owner's own
hardware.

------------------------------------------------------------------------

# 27. Success Criteria

BrokerHub will be considered successful when the Owner can manage the
majority of daily CRM operations without relying on external
spreadsheets or notebooks.

A successful system should allow the Owner to answer questions such as:

-   Who are my clients?
-   Which clients are interested in a particular colony?
-   Which employees are handling which leads?
-   Which properties are currently available?
-   What does a particular buyer want?
-   Which properties belong to a particular seller?
-   Who needs to be contacted today?
-   Which follow-ups are overdue?
-   Which leads have already been visited?
-   Which clients are no longer interested?
-   Which properties have been sold?

The system should provide these answers from one centralized
application.

------------------------------------------------------------------------

# 28. Project Goal

The ultimate goal of BrokerHub is to provide a **small, reliable,
self-hosted real estate CRM** that organizes client relationships,
property information, employee responsibilities, and follow-ups into a
single system.

> **One place to manage every property relationship.** \`\`\`
