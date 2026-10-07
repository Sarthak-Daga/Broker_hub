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

## Current Design Addendum --- Property Structure Generator

The property hierarchy UI has two distinct interaction patterns.

### Searchable hierarchy selection

Area and Colony use the compact searchable-select pattern:

``` text
Area
[ Search area... ]
+ New Area

Colony
[ Search colony... ]
+ New Colony
```

The inline creation box is intentionally small and fast.

### Generator interaction

Wing, Floor, and Flat are configured through a dedicated Property
Structure Generator, not through repeated inline CRUD controls.

The generator should feel like a focused multi-step configuration
workflow:

``` text
Step 1 — Colony
Step 2 — Wings
Step 3 — Floors
Step 4 — Flats
Step 5 — Review
Step 6 — Generate
```

The UI should make the hierarchy visually obvious and should allow the
user to understand the final structure before committing it.

Example:

``` text
Shantigram
├── Wing A
│   ├── Floor 1 → 4 flats
│   ├── Floor 2 → 6 flats
│   └── Floor 3 → 6 flats
├── Wing B
│   ├── Floor 1 → 4 flats
│   └── Floor 2 → 4 flats
└── Wing C
    └── ...
```

The generator should prioritize clarity, fast configuration,
review-before-submit, and prevention of accidental duplicate generation.

Do not add unnecessary animation or decorative UI.

------------------------------------------------------------------------

``` md
# BrokerHub — Design System

## 1. Design Overview

BrokerHub uses a clean, professional dark interface designed for frequent internal business use.

The design should feel:

- Professional
- Modern
- Simple
- Fast
- Consistent
- Easy to scan
- Suitable for long work sessions

The application should avoid unnecessary visual decoration.

The interface should prioritize business information and actions.

---

# 2. Design Philosophy

BrokerHub follows five primary design principles:

### Clarity

Users should immediately understand:

- What page they are on
- What information they are viewing
- What actions are available

### Consistency

Similar actions should look and behave the same throughout the application.

For example:

- Add buttons should use the same visual style.
- Delete actions should use the same destructive styling.
- Status badges should follow the same pattern.

### Density

The application should display enough information to be useful without becoming visually crowded.

### Simplicity

The interface should avoid unnecessary animations, gradients, illustrations, or decorative elements.

### Speed

Common operations should require minimal clicks.

---

# 3. Theme

BrokerHub uses a dark theme as the default.

Primary background:

```text
bg-slate-950
```

Secondary surfaces:

``` text
bg-slate-900
bg-slate-900/50
```

Borders:

``` text
border-slate-800
border-slate-700
```

Primary text:

``` text
text-white
```

Secondary text:

``` text
text-slate-400
text-slate-500
```

Primary accent:

``` text
blue
```

The blue accent is primarily used for:

-   Primary actions
-   Active navigation
-   Important interactive elements
-   Focus states
-   Selected elements

------------------------------------------------------------------------

# 4. Color System

The UI should use a restrained color palette.

## Background

``` text
Slate 950
```

Used for:

-   Main application background
-   Header
-   Sidebar

## Surface

``` text
Slate 900
```

Used for:

-   Cards
-   Tables
-   Panels
-   Modals

## Border

``` text
Slate 800
```

Used for:

-   Card borders
-   Dividers
-   Table borders
-   Header/sidebar separation

## Primary

``` text
Blue
```

Used for:

-   Primary buttons
-   Active navigation
-   Important links
-   Interactive highlights

## Success

Used for:

-   Completed operations
-   DONE status
-   Successful states

## Warning

Used for:

-   POSTPONED status
-   Important warnings
-   Attention-required states

## Danger

Used for:

-   Delete actions
-   CANCELLED status
-   Destructive operations

------------------------------------------------------------------------

# 5. Typography

The application should use a clean sans-serif font.

Typography should have clear hierarchy.

## Page Title

Example:

``` text
Contacts
```

Recommended style:

``` text
text-3xl
font-semibold
tracking-tight
```

## Section Heading

Example:

``` text
Active Follow-ups
```

Recommended style:

``` text
text-lg
font-semibold
```

## Body Text

Used for:

-   Descriptions
-   Table information
-   Form labels

Recommended:

``` text
text-sm
```

## Secondary Text

Used for:

-   Explanations
-   Metadata
-   Helper text

Recommended:

``` text
text-sm
text-slate-400
```

## Labels

Form labels should generally use:

``` text
text-sm
font-medium
text-slate-300
```

------------------------------------------------------------------------

# 6. Application Layout

The primary desktop layout consists of:

``` text
┌─────────────────────────────────────────────────────┐
│                     Header                          │
├───────────────┬─────────────────────────────────────┤
│               │                                     │
│   Sidebar     │             Main Content            │
│               │                                     │
│               │                                     │
│               │                                     │
└───────────────┴─────────────────────────────────────┘
```

------------------------------------------------------------------------

# 7. Header

The Header is shared across the application.

It contains:

-   BrokerHub logo
-   Application name
-   Application description
-   Current user information

Example:

``` text
┌─────────────────────────────────────────────────────┐
│ 🏠 BrokerHub                         Owner   👤     │
│    Real Estate CRM                   Administrator  │
└─────────────────────────────────────────────────────┘
```

Header height:

``` text
h-16
```

Header styling:

``` text
border-b border-slate-800
bg-slate-950
```

The Header should remain visually simple.

------------------------------------------------------------------------

# 8. Logo

The BrokerHub logo currently uses a house symbol.

Example:

``` text
🏠
```

The icon is displayed inside a blue rounded square.

Recommended styling:

``` text
h-9
w-9
rounded-lg
bg-blue-600
```

The logo should communicate the real estate nature of the application
without requiring a large graphical logo.

------------------------------------------------------------------------

# 9. Sidebar

The Sidebar provides primary navigation.

Navigation items:

``` text
Dashboard
Marketing
Buyers / Sellers
Contacts
Follow-ups
Employees
```

Example:

``` text
Workspace

▦  Dashboard
📢 Marketing
🏠 Buyers / Sellers
👥 Contacts
↻  Follow-ups
♙  Employees
```

The Sidebar should:

-   Remain visually consistent across pages
-   Clearly highlight the current page
-   Provide sufficient spacing between navigation items
-   Remain compact

------------------------------------------------------------------------

# 10. Active Navigation

The current page should be clearly identifiable.

Active navigation uses:

``` text
bg-blue-600/10
text-blue-400
```

Inactive navigation uses:

``` text
text-slate-400
```

On hover:

``` text
hover:bg-slate-900
hover:text-white
```

------------------------------------------------------------------------

# 11. Main Content Area

The main content should occupy the remaining horizontal space after the
Sidebar.

Recommended layout:

``` text
flex-1
overflow-auto
```

Content width:

``` text
max-w-7xl
```

Typical padding:

``` text
p-6
lg:p-8
```

This provides comfortable spacing on large displays while keeping the
content focused.

------------------------------------------------------------------------

# 12. Page Header

Each major page should have a consistent header.

Example:

``` text
Workspace

Contacts

Manage your general business contacts.
```

The page header should contain:

1.  Small contextual label
2.  Page title
3.  Short description
4.  Primary action when applicable

Example:

``` text
Workspace
Contacts
Manage your general business contacts.        + Add Contact
```

------------------------------------------------------------------------

# 13. Cards

Cards are the primary surface for displaying grouped information.

Recommended styling:

``` text
rounded-xl
border
border-slate-800
bg-slate-900/50
```

Cards should have:

-   Comfortable internal padding
-   Clear visual hierarchy
-   Consistent spacing

Typical padding:

``` text
p-5
```

Cards may have subtle hover effects when interactive.

Example:

``` text
hover:border-slate-700
hover:bg-slate-900
```

------------------------------------------------------------------------

# 14. Dashboard Statistic Cards

Dashboard statistics should be displayed as compact cards.

Example:

``` text
┌──────────────────┐
│ Total Clients    │
│                  │
│       124        │
│                  │
└──────────────────┘
```

Primary information should be visually dominant.

Example metrics:

-   Total Clients
-   Properties
-   Active Follow-ups
-   Employees

The cards should use the same visual language as other application
cards.

------------------------------------------------------------------------

# 15. Tables

Tables should be used when users need to scan multiple records.

Examples:

-   Contacts
-   Employees
-   Seller properties
-   Buyer requirements
-   Marketing records

Tables should use:

``` text
border-slate-800
```

Header rows should be visually distinct without becoming overly bright.

Example:

``` text
┌────────────┬──────────────┬───────────────┬─────────┐
│ Name       │ Mobile       │ Address       │ Actions │
├────────────┼──────────────┼───────────────┼─────────┤
│ Rahul      │ 98xxxxxxx    │ Ahmedabad     │ Edit    │
│ Amit       │ 97xxxxxxx    │ Vadodara      │ Delete  │
└────────────┴──────────────┴───────────────┴─────────┘
```

------------------------------------------------------------------------

# 16. Table Actions

Actions should be visually separated from the main information.

Common actions:

``` text
Edit
Delete
View
```

Destructive actions such as Delete should use danger styling.

Actions should not dominate the table visually.

------------------------------------------------------------------------

# 17. Search

Search controls should appear near the top of modules containing many
records.

Example:

``` text
┌──────────────────────────────────────────┐
│ 🔍 Search contacts...                    │
└──────────────────────────────────────────┘
```

Search should:

-   Be easy to find
-   Have clear placeholder text
-   Provide immediate filtering
-   Avoid unnecessary controls

For the expected dataset size, simple client-side search is acceptable
in several modules.

------------------------------------------------------------------------

# 18. Buttons

Buttons should have clear hierarchy.

## Primary Button

Used for important actions such as:

``` text
+ Add Contact
+ Add Employee
+ Add Follow-up
Save
```

Primary buttons use the blue accent.

Example:

``` text
bg-blue-600
hover:bg-blue-500
```

------------------------------------------------------------------------

## Secondary Button

Used for less important actions.

Examples:

``` text
Cancel
Back
Close
```

These should use neutral slate styling.

------------------------------------------------------------------------

## Danger Button

Used for destructive operations.

Examples:

``` text
Delete
Cancel Follow-up
Remove Employee
```

Danger actions should be visually distinguishable from normal actions.

------------------------------------------------------------------------

# 19. Button Sizing

Buttons should generally be compact but comfortable.

Typical styling:

``` text
rounded-lg
px-3
py-2
text-sm
```

Primary actions in page headers may use slightly larger horizontal
padding.

Buttons should provide sufficient clickable area.

------------------------------------------------------------------------

# 20. Forms

Forms should be simple and vertically structured.

Example:

``` text
Name
[________________________]

Mobile Number
[________________________]

Address
[________________________]

Remarks
[________________________]

              Cancel   Save
```

Form fields should have:

-   Clear labels
-   Consistent spacing
-   Visible borders
-   Appropriate input types
-   Clear focus states

------------------------------------------------------------------------

# 21. Input Fields

Input fields should use the dark theme.

Recommended styling:

``` text
rounded-lg
border
border-slate-700
bg-slate-900
text-white
```

Placeholder text should use a muted slate color.

Focus states should use the blue accent.

Example:

``` text
focus:border-blue-500
focus:ring-blue-500
```

------------------------------------------------------------------------

# 22. Modals

Modals are used for short forms and focused actions.

Examples:

-   Add Contact
-   Add Employee
-   Add Follow-up
-   Edit Follow-up
-   Postpone Follow-up
-   Restore Follow-up

Modal structure:

``` text
┌───────────────────────────────────┐
│ Add Contact                    ×  │
├───────────────────────────────────┤
│                                   │
│ Name                              │
│ [_____________________________]   │
│                                   │
│ Mobile Number                     │
│ [_____________________________]   │
│                                   │
│ Address                           │
│ [_____________________________]   │
│                                   │
│              Cancel    Save       │
└───────────────────────────────────┘
```

Modals should:

-   Clearly identify their purpose
-   Keep forms focused
-   Have an obvious close/cancel action
-   Prevent accidental submission where appropriate

------------------------------------------------------------------------

# 23. Modal Behavior

After successful creation:

-   The modal should close.
-   The page should refresh/revalidate.
-   The new record should become visible.

If an operation fails:

-   The modal should remain available.
-   The user should receive useful feedback.

------------------------------------------------------------------------

# 24. Status Badges

Status badges should provide quick visual recognition.

Examples:

``` text
PENDING
POSTPONED
DONE
CANCELLED
```

Badges should be compact.

Example:

``` text
┌───────────┐
│  PENDING  │
└───────────┘
```

Status colors should be consistent throughout the application.

------------------------------------------------------------------------

# 25. Follow-up Status Styling

Recommended visual meaning:

### PENDING

Primary/blue styling.

``` text
PENDING
```

### POSTPONED

Warning/amber styling.

``` text
POSTPONED
```

### DONE

Success/green styling.

``` text
DONE
```

### CANCELLED

Danger/red styling.

``` text
CANCELLED
```

### OVERDUE

Danger/attention styling.

``` text
OVERDUE
```

`OVERDUE` is a UI-derived state and does not replace the database
status.

------------------------------------------------------------------------

# 26. Follow-up Cards

Follow-ups should use cards rather than dense tables because each
follow-up contains several pieces of contextual information.

Example:

``` text
┌────────────────────────────────────────────┐
│ Employee:  Rahul                           │
│ Client:    Amit                            │
│                                            │
│ 📅 Tomorrow, 10:30 AM                      │
│                                            │
│ Purpose: Marketing                         │
│ Notes: Call regarding XYZ colony           │
│                                            │
│ PENDING                                    │
│                                            │
│ [✓ Done] [↻ Postpone] [× Cancel] [Edit]   │
└────────────────────────────────────────────┘
```

------------------------------------------------------------------------

# 27. Follow-up Grid

Follow-up cards should display two per row on medium and larger screens.

Recommended:

``` text
grid-cols-1
md:grid-cols-2
```

On smaller screens:

``` text
1 card per row
```

This keeps the cards readable while efficiently using desktop space.

------------------------------------------------------------------------

# 28. Follow-up Sorting

Follow-ups should automatically be ordered according to urgency.

The general ordering is:

``` text
1. Overdue pending
2. Pending
3. Postponed
4. Done
5. Cancelled
```

Within each category, records should be ordered by date/time.

This ensures that the most important tasks appear first.

------------------------------------------------------------------------

# 29. Historical Follow-ups

Completed and cancelled follow-ups remain visible as history.

Historical cards should be visually de-emphasized.

Recommended styling:

``` text
bg-slate-950/40
border-slate-900
opacity-50
```

This communicates:

> This record is no longer active.

but still allows the user to access its history.

------------------------------------------------------------------------

# 30. Follow-up Actions

Actions should depend on the current status.

## PENDING

Display:

``` text
[✓ Done]
[↻ Postpone]
[× Cancel]
[Edit]
```

## POSTPONED

Display:

``` text
[↻ Postpone]
[↺ Pending]
[× Cancel]
[Edit]
```

## CANCELLED

Display:

``` text
[↺ Pending]
[Delete]
```

## DONE

Display:

``` text
[Delete]
```

The interface should avoid displaying irrelevant actions.

------------------------------------------------------------------------

# 31. Destructive Actions

Destructive actions should be distinguishable.

Examples:

-   Delete Contact
-   Delete Follow-up
-   Remove Employee
-   Cancel Follow-up

Delete actions should not be styled like primary actions.

For particularly destructive operations, a confirmation dialog should be
used.

------------------------------------------------------------------------

# 32. Confirmation Dialogs

Confirmation dialogs should be used when an action can cause meaningful
data loss.

Example:

``` text
Delete Follow-up?

This will permanently remove this historical
follow-up record.

                 Cancel    Delete
```

The destructive action should be visually emphasized.

------------------------------------------------------------------------

# 33. Empty States

Modules with no records should not display a completely blank page.

Example:

``` text
No contacts yet.

Add your first contact to start building
your CRM.

             + Add Contact
```

Empty states should:

-   Explain what is missing
-   Provide the relevant action
-   Avoid unnecessary graphics

------------------------------------------------------------------------

# 34. Loading States

Where loading states are required, they should remain subtle.

The UI should avoid large distracting loading animations.

Possible approaches:

-   Skeleton cards
-   Skeleton table rows
-   Disabled submit buttons
-   Small loading indicators

------------------------------------------------------------------------

# 35. Error States

Errors should be understandable to normal users.

Avoid displaying raw database errors such as:

``` text
P2002
Foreign key constraint failed
```

Instead provide useful messages such as:

``` text
Unable to delete this employee because
they still have active follow-ups.
```

Technical details can be logged server-side.

------------------------------------------------------------------------

# 36. Responsive Design

BrokerHub is primarily a desktop application, but the interface should
remain usable on smaller screens.

## Desktop

``` text
Header
Sidebar
Main Content
```

## Tablet

The Sidebar may remain visible depending on available width.

## Mobile

The layout should collapse appropriately.

Possible future mobile layout:

``` text
Header
   ↓
Main Content
   ↓
Mobile Navigation
```

The initial implementation should prioritize desktop usability because
the application is intended primarily for office/business use.

------------------------------------------------------------------------

# 37. Spacing

The interface should use consistent spacing.

Common spacing values:

``` text
gap-2
gap-3
gap-4
gap-6
gap-8
```

Major sections should have more spacing than individual controls.

Example:

``` text
Page Header
      ↓
      32px
      ↓
Search / Actions
      ↓
      24px
      ↓
Content
```

------------------------------------------------------------------------

# 38. Border Radius

BrokerHub uses moderately rounded components.

Recommended:

``` text
rounded-lg
rounded-xl
```

Use:

``` text
rounded-xl
```

for:

-   Cards
-   Main panels
-   Larger containers

Use:

``` text
rounded-lg
```

for:

-   Buttons
-   Inputs
-   Smaller controls

Avoid excessive pill-shaped UI except for status badges.

------------------------------------------------------------------------

# 39. Icons

Icons should primarily communicate actions or categories.

Examples:

``` text
▦ Dashboard
📢 Marketing
🏠 Properties
👥 Contacts
↻ Follow-ups
♙ Employees
```

Icons should remain visually secondary to the text.

The application can eventually use a consistent icon library instead of
Unicode/emoji icons.

------------------------------------------------------------------------

# 40. Navigation Labels

Navigation labels should remain short and understandable.

Current navigation:

``` text
Dashboard
Marketing
Buyers / Sellers
Contacts
Follow-ups
Employees
```

Avoid unnecessarily technical names such as:

``` text
CRM Entity Management
Customer Relationship Operations
Property Transaction Database
```

The interface is for business users, not developers.

------------------------------------------------------------------------

# 41. Dashboard Design

The Dashboard should prioritize quick information retrieval.

Suggested structure:

``` text
Workspace
Dashboard
Your real estate business at a glance.

┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│   Clients   │ │ Properties  │ │ Follow-ups  │ │ Employees   │
│     124     │ │      37     │ │      8      │ │      5      │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘

Upcoming / Overdue Follow-ups
─────────────────────────────────────────────────────────────

Recent / Important Activity
─────────────────────────────────────────────────────────────
```

The most important information should appear near the top.

------------------------------------------------------------------------

# 42. Contacts Design

The Contacts page should prioritize:

1.  Search
2.  Add Contact
3.  Contact list
4.  Actions

Suggested structure:

``` text
Workspace
Contacts
Manage your general business contacts.

                         + Add Contact

[ Search contacts... ]

┌─────────────────────────────────────────────────────┐
│ Name │ Mobile │ Address │ Remarks │ Actions         │
├─────────────────────────────────────────────────────┤
│ ...                                                  │
└─────────────────────────────────────────────────────┘
```

------------------------------------------------------------------------

# 43. Employees Design

Employees should be presented as a manageable list.

Example:

``` text
Workspace
Employees
Manage your team and their responsibilities.

                         + Add Employee

┌──────────────────────────────────────────────────────┐
│ ID   Name       Phone          Active Follow-ups     │
├──────────────────────────────────────────────────────┤
│ 001  Rahul      98xxxxxxx      3                    │
│ 002  Amit       97xxxxxxx      5                    │
└──────────────────────────────────────────────────────┘
```

Active follow-up counts should only include:

``` text
PENDING
POSTPONED
```

------------------------------------------------------------------------

# 44. Marketing Design

The Marketing module should make lead status and assignment easy to
understand.

Important information:

-   Client
-   Colony
-   Employee
-   Status
-   Priority
-   Follow-up

Potential layout:

``` text
Marketing

[ Search leads... ]                    + Add Lead

┌────────────────────────────────────────────────────────┐
│ Client │ Colony │ Employee │ Status │ Priority │ ...  │
├────────────────────────────────────────────────────────┤
│ XYZ    │ A      │ Rahul    │ VISITED │ ★★★     │ ... │
│ PQS    │ B      │ Amit     │ CALLED  │ ★★★★    │ ... │
└────────────────────────────────────────────────────────┘
```

Status and priority should be visually prominent.

------------------------------------------------------------------------

# 45. Buyers & Sellers Design

The Buyers & Sellers module should clearly separate:

``` text
Buyers
Sellers
```

Possible layout:

``` text
Buyers & Sellers

[ Buyers ] [ Sellers ]
```

or a clear two-section layout.

Seller information should emphasize:

-   Property
-   Area
-   Dimensions
-   Demand
-   Status

Buyer information should emphasize:

-   Requirement
-   Area
-   Dimensions
-   Budget
-   Status

------------------------------------------------------------------------

# 46. Property Management Design

Property management should represent the physical hierarchy visually.

Example:

``` text
Colony A

▼ Wing A
   ▼ Floor 1
      101  102  103
   ▼ Floor 2
      201  202  203

▼ Wing B
   ▼ Floor 1
      101  102
```

Available and sold flats should have distinguishable statuses.

------------------------------------------------------------------------

# 47. Data Entry Philosophy

Data entry should be optimized for real-world business usage.

Forms should:

-   Ask only for necessary information
-   Use sensible defaults
-   Avoid unnecessary fields
-   Support later editing
-   Clearly distinguish required and optional fields

For example, remarks should generally be optional.

------------------------------------------------------------------------

# 48. Information Hierarchy

Every screen should follow:

``` text
Context
   ↓
Title
   ↓
Primary Action
   ↓
Search / Filters
   ↓
Important Information
   ↓
Secondary Information
   ↓
Actions
```

Important information should always have stronger visual emphasis than
metadata.

------------------------------------------------------------------------

# 49. Accessibility

The application should maintain basic accessibility standards.

Interactive elements should:

-   Have readable text
-   Have sufficient clickable area
-   Have visible focus states
-   Not rely solely on color to communicate meaning
-   Have descriptive labels where appropriate

Forms should associate labels with their corresponding inputs.

------------------------------------------------------------------------

# 50. UX Rules

The application should follow these general UX rules:

### Rule 1

Never make the user navigate through unnecessary pages for a simple
action.

### Rule 2

Keep important actions near the information they affect.

### Rule 3

Use confirmation for destructive actions.

### Rule 4

Show useful feedback after mutations.

### Rule 5

Do not hide important statuses.

### Rule 6

Keep historical information accessible.

### Rule 7

Prefer predictable behavior over clever UI.

### Rule 8

Use the same interaction patterns throughout the application.

------------------------------------------------------------------------

# 51. Visual Consistency Rules

The following should remain consistent across all modules:

-   Header
-   Sidebar
-   Page spacing
-   Card styling
-   Button styling
-   Form styling
-   Status badges
-   Modal structure
-   Typography
-   Color meaning
-   Empty states
-   Error handling

A user should feel that every page belongs to the same application.

------------------------------------------------------------------------

# 52. Overall Visual Direction

BrokerHub should look like a modern internal SaaS dashboard rather than
a traditional real estate website.

The design should prioritize:

``` text
Professional
     ↓
Information Dense
     ↓
Easy to Scan
     ↓
Fast to Operate
```

It should avoid:

``` text
Large Hero Sections
Heavy Animations
Excessive Gradients
Decorative Illustrations
Unnecessary Effects
```

The final visual identity should be:

> **Dark, clean, structured, professional, and business-focused.**
> \`\`\`
