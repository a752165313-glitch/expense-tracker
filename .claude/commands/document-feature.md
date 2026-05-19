You are a technical writer with deep knowledge of this codebase. Your task is to generate two documentation files for the feature: **$ARGUMENTS**

---

## Step 1 — Discover relevant files

Search the codebase for files related to "$ARGUMENTS". Look in:
- `app/` — pages that surface the feature
- `components/` — UI components implementing it
- `hooks/` — custom hooks the feature relies on
- `context/` — state management involved
- `utils/` — utility functions used
- `types/` — TypeScript interfaces and types
- `lib/` — constants or shared config

Identify every file that is directly part of the feature (not just imports it). List them before proceeding.

---

## Step 2 — Read and analyze

Read each discovered file completely. Extract:

**For developer docs:**
- Component/function signatures and props
- Data flow: how data enters, transforms, and exits
- State management: what lives in context vs. local state vs. localStorage
- Key algorithms or non-obvious logic
- TypeScript types and interfaces used
- Dependencies (packages, internal modules)
- Error states and edge cases handled
- Any TODOs, limitations, or known gaps in the code

**For user docs:**
- What the user can do with this feature (actions/workflows)
- Entry points (which page, which button/link)
- Inputs the user provides and what the system does with them
- Outputs or results the user sees
- Any constraints (e.g., validation rules, data limits)

---

## Step 3 — Generate developer documentation

Create the file `docs/developer/$ARGUMENTS.md` with this structure:

```
# [Feature Name] — Developer Reference

## Overview
One paragraph: what this feature does and why it exists in the codebase.

## Architecture

### Files
| File | Role |
|------|------|
| path/to/file.tsx | description |

### Data Flow
Prose or numbered steps describing how data moves through the feature.
Include: user action → state update → render cycle → side effects.

## Components

### ComponentName
**File:** `path/to/Component.tsx`

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| propName | type | yes/no | what it does |

**Behavior:** What the component renders and any non-obvious logic.

(Repeat for each component)

## Hooks & Utilities

### hookOrFunctionName
**File:** `path/to/file.ts`
**Signature:** `functionName(param: Type): ReturnType`
**Purpose:** What it does and when to use it.

(Repeat for each hook/utility)

## Types & Interfaces

```typescript
// Paste the actual interface/type definitions from the code
```

## State Management
Which state lives where (context, local component state, localStorage) and why.

## Dependencies
- `package-name` — why it's used in this feature

## Edge Cases & Error Handling
- Bullet list of handled edge cases and how they're handled

## Known Limitations
- Bullet list of current gaps, TODOs, or constraints

## Cross-reference
See also: [User Guide → $ARGUMENTS](../../docs/user/$ARGUMENTS.md)
```

---

## Step 4 — Generate user documentation

Create the file `docs/user/$ARGUMENTS.md` with this structure:

```
# [Feature Name] — User Guide

## What is this?
One or two plain-English sentences describing what this feature does for the user.

## Getting Started

**Where to find it:** Describe the page and UI element (e.g., "Dashboard → top-right Export button").

![Screenshot: [Feature Name] entry point](./screenshots/$ARGUMENTS-entry-point.png)
*[Description of what the screenshot should show]*

---

## How to use [Feature Name]

### Step 1 — [Action name]
Plain-English instruction. Keep it to 1–2 sentences.

![Screenshot: [Step description]](./screenshots/$ARGUMENTS-step-1.png)
*[Description of what the screenshot should show]*

### Step 2 — [Action name]
(Continue for each meaningful step in the workflow)

---

## What you'll see

Describe the result or output the user gets after completing the steps.

![Screenshot: [Result description]](./screenshots/$ARGUMENTS-result.png)
*[Description of what the screenshot should show]*

---

## Tips & Notes
- Any helpful hints, shortcuts, or things to be aware of
- Validation rules stated in plain language (e.g., "Amount must be greater than 0")
- Data constraints (e.g., "Exports include up to 12 months of history")

## Troubleshooting
| Problem | Solution |
|---------|----------|
| Describe symptom | Plain-English fix |

---

## Related
- [Developer Reference → $ARGUMENTS](../../docs/developer/$ARGUMENTS.md) — technical implementation details
```

---

## Step 5 — Final checks

Before finishing:
1. Confirm both files were written successfully.
2. Ensure every prop table, type definition, and code snippet is copied verbatim from the actual source — do not paraphrase types or signatures.
3. Ensure screenshot placeholder filenames use consistent kebab-case matching the feature name.
4. Confirm cross-reference links in both files point to each other correctly.
5. Report the two file paths created and a one-sentence summary of what the feature does.
