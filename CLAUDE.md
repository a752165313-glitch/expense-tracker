# ExpenseAI — Developer Guide

## Project Overview

ExpenseAI is a personal expense tracker built with Next.js 14 App Router, TypeScript, and Tailwind CSS. It is a **fully client-side application** — there is no backend, no database, and no API server. All data lives in the browser's `localStorage`. Keep this constraint in mind at every decision point.

---

## Tech Stack

| Layer | Library / Version |
|---|---|
| Framework | Next.js 14.2.5 (App Router) |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS 3.4 + `clsx` |
| Charts | Recharts 2.12 |
| Dates | date-fns 3.6 |
| Icons | lucide-react 0.400 |
| Notifications | react-hot-toast 2.4 |
| State | React Context + custom hooks |

---

## Architecture

### Directory Map

```
types/          — shared TypeScript types and interfaces (single source of truth)
lib/            — app-wide constants (categories, colors, icons, storage keys)
utils/          — pure utility functions (formatting, dates, CSV export)
hooks/          — reusable React hooks (useLocalStorage, useExpenses)
context/        — React Context providers (ExpenseContext wraps useExpenses)
components/
  ui/           — primitive UI building blocks (Button, Input, Select, Modal, Badge)
  layout/       — shell components (AppShell, Sidebar, Topbar)
  expenses/     — expense-domain components (ExpenseList, ExpenseItem, ExpenseForm, ExpenseFilters)
  dashboard/    — analytics and summary widgets (SummaryCards, SpendingChart, etc.)
app/            — Next.js App Router pages
```

### Data Flow

```
localStorage
    ↓
useLocalStorage (hooks/useLocalStorage.ts)
    ↓
useExpenses (hooks/useExpenses.ts)  ← all business logic + useMemo derivations
    ↓
ExpenseProvider (context/ExpenseContext.tsx)
    ↓
Page components → feature components via useExpenseContext()
```

Pages never interact with `localStorage` or data logic directly. All reads and writes go through `useExpenseContext()`.

---

## Patterns to Continue

### 1. Type-first development
Define or update `types/expense.ts` before writing any feature code. Every new data shape gets a named interface. `Category` is a union type — not an enum — so it can be extended without runtime overhead.

### 2. Constants in `lib/constants.ts`
All category metadata (colors, icons, bg-colors, the storage key) lives here. When adding a new category or display property, add it to `CATEGORY_COLORS`, `CATEGORY_ICONS`, and `CATEGORY_BG_COLORS` together so they stay in sync. Never hard-code a category name or color inside a component.

### 3. Business logic belongs in `useExpenses`
Filtering, sorting, derived stats (`categorySummaries`, `monthlySummaries`, `pieData`), and CRUD operations all live in `hooks/useExpenses.ts`. Wrap expensive derivations in `useMemo`. Pages and components should receive data and callbacks — they should not compute summaries themselves.

### 4. The `isLoaded` hydration guard
`useLocalStorage` sets `isLoaded = true` only after the `useEffect` reads from `localStorage`. Every page must check `isLoaded` and render a spinner until it is `true`. This prevents SSR/hydration mismatches. The spinner pattern is a `w-8 h-8 border-[3px] border-primary-200 border-t-primary-600 rounded-full animate-spin` centered inside an `h-64` container.

### 5. UI primitive components
All form controls go through `components/ui/` (`Button`, `Input`, `Select`, `Modal`). These use `forwardRef` and extend native HTML attributes. Use the `variant` and `size` props rather than overriding styles with inline Tailwind on every call site.

### 6. `AppShell` for every page
Every page wraps its content with `<AppShell title="..." subtitle="...">`. This ensures consistent `Sidebar` + `Topbar` layout and the correct scroll container.

### 7. `clsx` for conditional classes
Use `clsx` whenever class names are conditional. Never concatenate class strings with template literals or `+`.

### 8. Utility functions for formatting
Use `formatCurrency` / `formatCompactCurrency` from `utils/formatCurrency.ts` for every monetary value. Use the date helpers from `utils/dateUtils.ts` (`formatDate`, `getTodayISO`, `getMonthRange`, etc.) for every date operation. Do not call `Intl` or `date-fns` directly inside components.

### 9. Toast notifications for user actions
Every successful mutation (add, update, delete, export) gets a `toast.success()`. Every blocked action (e.g. exporting with zero results) gets a `toast.error()`. Import `toast` from `react-hot-toast`.

### 10. Tailwind design tokens
The design language is:
- Card container: `bg-white rounded-2xl border border-gray-100 p-5` (or `p-6`)
- Rounded interactive elements: `rounded-xl`
- Primary color scale: `primary-50` through `primary-900` (indigo, defined in `tailwind.config.ts`)
- Body text: `text-gray-900` (bold values), `text-gray-500` (labels), `text-gray-400` (meta)
- Hover shadows: `hover:shadow-md transition-shadow duration-200`

Stick to this vocabulary. Do not introduce raw hex colors or ad-hoc `bg-indigo-*` — use the `primary-*` alias instead.

### 11. Feature branches
All non-trivial work branches off `main` with a descriptive name (`feature-<name>` or `fix-<name>`). Commit messages follow the `feat:`, `fix:`, `docs:`, `refactor:` prefix convention.

### 12. Sample data kept separate
`utils/sampleData.ts` holds demo `Expense[]` for development. It is never auto-loaded at app boot — it must be explicitly triggered (e.g., a "Load sample data" button). Keep it isolated from production logic.

---

## Constraints — What Not To Do

### No backend or server-side logic
This app has no API routes, no database, no auth, and no server actions. Do not add `app/api/` routes, Prisma, Supabase, Firebase, or any server-side persistence. If a feature genuinely requires a backend, discuss the architecture change explicitly before implementing.

### No direct `localStorage` access in components
Never call `window.localStorage` inside a component or page. All persistence goes through `useLocalStorage` → `useExpenses` → `useExpenseContext`. This keeps the hydration guard centralized.

### No state management libraries
Do not add Redux, Zustand, Jotai, or Recoil. The current React Context + custom hooks pattern is sufficient and intentional. New global state goes into `useExpenses` and is exposed through `ExpenseContext`.

### No CSS Modules, styled-components, or Emotion
Styling is Tailwind-only. Do not create `.module.css` files or use CSS-in-JS. All dynamic styles use `clsx`.

### No `any` types
TypeScript is strict. Use proper types for every prop, return value, and function parameter. When typing third-party callback shapes (e.g. Recharts tooltips), use the library's exported types or a narrow `unknown`-based guard — not `any`.

### Do not bypass the `isLoaded` guard
Never render data-dependent UI before `isLoaded` is `true`. Doing so causes the component to flash with empty/zero state on first load.

### Do not store amounts as strings
The `Expense.amount` field is a `number`. Parse with `parseFloat` at the form boundary (`ExpenseForm`), not at display time. Display always goes through `formatCurrency`.

### Do not hard-code category strings in components
All valid categories are defined in `types/expense.ts` (the `Category` union) and listed in `lib/constants.ts` (`CATEGORIES` array). Referencing `'Food'` or other category names as string literals outside these two files is a maintenance hazard.

### Do not mutate the expenses array directly
All updates go through `setExpenses` (from `useLocalStorage`). Always produce a new array — use `.map`, `.filter`, or spread. Never push or splice in place.

### Do not add new pages without `AppShell`
Every new route under `app/` must use `<AppShell>` to stay within the consistent layout. Bare pages break the sidebar and topbar.

### Do not add dependencies without consideration
The current bundle is deliberately lean. Before adding a new `npm` dependency, check if date-fns, Recharts, or a small utility function can already solve the problem. Avoid large libraries for single features.

---

## Running the App

```bash
npm run dev     # development server on http://localhost:3000
npm run build   # production build
npm run lint    # ESLint
```

There are no tests currently. When adding tests, prefer integration-style tests that exercise `useExpenses` with a real localStorage mock over unit tests of pure rendering.

---

## Current Routes

| Path | Component | Purpose |
|---|---|---|
| `/` | `app/page.tsx` | Dashboard with summary cards and charts |
| `/expenses` | `app/expenses/page.tsx` | Full CRUD list with filters and CSV export |
| `/analytics` | `app/analytics/page.tsx` | Deep spending analysis with category breakdowns |
