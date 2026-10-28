# BrokerHub --- Prisma 8 Commands & Syntax Reference Prompt

You are helping me develop **BrokerHub**, my existing real-estate CRM. I
want you to act as a careful Prisma 8 guide and use this document as a
command/syntax reference.

## 1. Project context

-   Next.js App Router, TypeScript, Tailwind CSS
-   Prisma 8
-   PostgreSQL running in Docker
-   Contract file: `prisma/contract.prisma`
-   Generated contract artifacts include `prisma/contract.json` and
    `prisma/contract.d.ts`
-   Centralized database layer imported as `db` from `@/prisma/db`
    (inspect its actual implementation before assuming its API).
-   The `Colony.areaId` migration has been applied. `Floor.floorNumber`
    has also been added and migrated.

**Important:** This project uses Prisma 8's contract/migration workflow.
Do not blindly give Prisma 5/6/7 commands as though this were a standard
older setup.

## 2. Non-negotiable rules

1.  Before recommending a command, inspect the installed Prisma version
    and configuration.

2.  Use CLI help to verify command availability and flags:

    ``` bash
    npx prisma --version
    npx prisma --help
    npx prisma <command> --help
    ```

3.  Never invent Prisma 8 subcommands, flags, API methods, or generated
    ORM syntax.

4.  In our current setup, the contract-generation command we
    successfully used is:

    ``` bash
    npx prisma contract emit
    ```

    Do not substitute `npx prisma generate` as the default command in
    this project.

5.  `contract emit` refreshes contract artifacts; it does **not** apply
    a database migration.

6.  Planning a migration and applying it are separate operations.

7.  Do not use `db update` as a casual replacement for migrations. It
    can change the database without maintaining the expected migration
    history/signature and may cause a marker mismatch.

8.  Never delete migration history, edit migration markers, reset the
    database, or drop tables without explaining consequences and asking
    first.

9.  For schema changes, inspect `prisma/contract.prisma`,
    `prisma.config.ts`, existing migrations, and the actual CLI help
    first.

10. When a command fails, diagnose the exact error instead of repeating
    older-version commands.

## 3. Prisma 8 commands established in this project

### Help and command discovery

``` bash
npx prisma --help
npx prisma <command> --help
npx prisma contract --help
npx prisma migration --help
npx prisma db --help
```

### Emit contract artifacts

``` bash
npx prisma contract emit
```

Use after changing the contract when generated artifacts need
refreshing. Confirm the output files. This does not change the database
by itself.

### Inspect migration state/history

``` bash
npx prisma migration status
npx prisma migration log
```

Use to inspect migration state and history. Verify exact syntax with the
installed CLI's help if the version/configuration has changed.

### Plan a migration

``` bash
npx prisma migration plan
```

Prepare/inspect the migration plan for a contract change. Planning does
not mean PostgreSQL has been updated. Review the plan before applying
it.

### Apply a migration

``` bash
npx prisma db migrate
```

Use only after reviewing the plan and confirming the installed CLI's
expected workflow.

### Verify consistency

``` bash
npx prisma db verify
```

Use after applying a migration or when diagnosing contract/database
signature mismatches.

### Direct database update --- risky

``` bash
npx prisma db update
```

Do not recommend this as the normal schema-change workflow. It can
update the database directly without expected migration history and may
lead to marker/signature mismatches.

These commands are recorded from the project's Prisma 8 workflow.
Validate exact syntax against the installed CLI, especially if the
installed version or configuration changes.

## 4. Inspect the environment first

``` bash
npx prisma --version
npx prisma --help
npm run
```

Use the project's actual package manager if it uses pnpm or another
tool. Inspect `package.json`, `prisma.config.ts`,
`prisma/contract.prisma`, the database wrapper, and existing migration
files. Never assume Docker service names.

## 5. Safe schema-change workflow

### Step 1 --- Inspect

-   Read `prisma/contract.prisma`.
-   Read `prisma.config.ts`.
-   Inspect the centralized database client.
-   Inspect migration files and current migration status.
-   Confirm whether the field/relation already exists in the contract
    and in PostgreSQL.

### Step 2 --- Explain the change

Explain the model/field/relation being changed, whether it is additive
or destructive, and whether existing data needs a default or backfill.
Show the intended command sequence before running it.

### Step 3 --- Edit the contract

Edit `prisma/contract.prisma` only after the change is clear.

### Step 4 --- Emit artifacts

``` bash
npx prisma contract emit
```

Check generated TypeScript declarations and JSON. Do not assume the
database has changed.

### Step 5 --- Inspect and plan

``` bash
npx prisma migration status
npx prisma migration plan
```

Use CLI help to verify syntax. Review the plan. If it unexpectedly
proposes recreating many existing tables or a full-schema migration,
stop and investigate rather than applying blindly.

### Step 6 --- Apply

``` bash
npx prisma db migrate
```

Apply only after reviewing the migration plan and verifying the
installed CLI workflow.

### Step 7 --- Verify

``` bash
npx prisma migration status
npx prisma migration log
npx prisma db verify
```

Confirm the new column/relation exists in PostgreSQL and the generated
types match the contract.

### Step 8 --- Test

Run the project's existing type-check/lint/test scripts, test the
affected UI/Server Action, check logs, and update documentation.

Never edit the contract and then assume the database was automatically
updated.

## 6. Prisma ORM CRUD syntax

The examples below are **standard Prisma Client patterns for
reference**. They are not a guarantee that this project's generated
Prisma 8 API exposes these exact methods. Inspect the generated API and
`@/prisma/db` before using them. BrokerHub has previously used a
generated API shape such as `db.orm.public.Area.all()`, so do not
replace it with conventional syntax without checking.

``` ts
// Read many
await prisma.area.findMany();

// Read by unique field
await prisma.area.findUnique({
  where: { id: areaId },
});

// Read first matching record
await prisma.area.findFirst({
  where: { name: areaName },
});

// Create
await prisma.area.create({
  data: { name: areaName },
});

// Update
await prisma.area.update({
  where: { id: areaId },
  data: { name: newName },
});

// Delete
await prisma.area.delete({
  where: { id: areaId },
});

// Count
await prisma.area.count();

// Filter related records
await prisma.colony.findMany({
  where: { areaId },
});

// Include related records
await prisma.colony.findMany({
  include: { wing: true },
});

// Sort
await prisma.area.findMany({
  orderBy: { name: "asc" },
});

// Pagination
await prisma.area.findMany({
  skip: 0,
  take: 20,
});
```

Do not paste these examples into BrokerHub until the actual generated
Prisma 8 API and database wrapper are inspected.

### Transactions and bulk generation

A property generator may create many related records. Verify whether the
project's actual generated API supports transactions before using a
transaction API. Do not invent `$transaction` or another transaction
method for a custom/generated wrapper.

Conceptually, generation should: 1. Validate the complete configuration.
2. Check for duplicate generation. 3. Create Wing records. 4. Create
Floor records related to each Wing. 5. Create Flat records related to
each Floor. 6. Commit together if the actual API supports safe
transactions; otherwise use a failure-safe approach. 7. Revalidate the
Properties route.

## 7. Command categories to cover

When I ask for a comprehensive Prisma command reference, organize it by
purpose:

-   CLI help/version/config inspection
-   Contract/schema artifact emission
-   Migration planning
-   Migration application
-   Migration status/history
-   Contract/database verification
-   Direct database update and its risks
-   Seeding/introspection commands only if supported by the installed
    Prisma 8 CLI and configured project
-   ORM read/create/update/delete/filter/relations/transactions
-   Troubleshooting and recovery

Do not claim a command is available merely because it exists in another
Prisma version. If the installed CLI does not support it, say so and
provide the verified alternative.

## 8. BrokerHub-specific constraints

-   PostgreSQL is the source of truth.
-   Keep database access centralized through the existing Prisma
    database layer.
-   Keep architecture simple.
-   Preserve migration history.
-   Physical hierarchy is `Area → Colony → Wing → Floor → Flat`.
-   Physical property hierarchy is separate from CRM Seller/Buyer
    records.
-   The Property Structure Generator creates Wing/Floor/Flat records
    only; it must not silently create Seller or Buyer records.
-   Do not use guessed mutation syntax such as
    `Wing.update({ where: ... })` unless the exact API is verified in
    the project's generated contract.

## 9. Documentation files must remain committed to Git

Keep these files version-controlled and synchronized with
implementation:

``` text
docs/prd.md
docs/architecture.md
docs/rules.md
docs/design.md
docs/task.md
docs/memory.md
```

Update relevant docs after significant schema, migration, or
architectural decisions.

## 10. Required response format for Prisma tasks

For every Prisma-related task, respond with:

1.  **Goal** --- what needs to change.
2.  **Verified current state** --- what the contract, generated API, and
    database show.
3.  **Exact commands** --- in order, with a short explanation of each.
4.  **Expected result** --- which files/database state should change.
5.  **Verification** --- commands and application tests to confirm
    success.
6.  **Risks** --- identify destructive/history-changing operations
    before they happen.

If information is missing, inspect the repository or ask me to share the
relevant file/error output. Never guess.

Use this as the Prisma 8 command and syntax guide for BrokerHub.
