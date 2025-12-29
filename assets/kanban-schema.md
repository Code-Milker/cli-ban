# Kanban Schema

## Overview
This Kanban board uses three main sections: **TODO**, **DOING**, and **DONE**.

Each item follows a consistent, lightweight structure that starts minimal and gains detail as it progresses. This keeps the backlog simple while providing rich context for active work and closure for completed items.

## Item Header Format
Every item (in any section) uses this header:

#### [Category]: Descriptive title

### Standard Categories
- **Job** – Job search, applications, interview prep, system design, etc.
- **Project** – Personal coding projects and features
- **Health** – Neck pain, posture, exercise, recovery routines
- **Friend** – Social connections, reaching out, shared activities
- **Fun** – Gaming, hobbies, relaxation
- **Life** – General personal admin or catch-all

(You may add new categories as needed – just keep the format consistent.)

## Attributes by Section

### TODO
The backlog stays intentionally minimal to avoid over-planning.

**Required**
- Header line only: `#### [Category]: Descriptive title`

**Optional**
- One or more quick `- note:` lines (for context or ideas you don't want to forget)

### DOING
Active items get richer detail to track progress without losing momentum.

**Required**
- Header line (same as before)
- One or more `- goal:` – the intended outcomes or milestones
- One or more `- remaining:` – specific next steps or open work

**Optional**
- `- done:` – steps already completed (one or more)
- `- note:` – insights, blockers, ideas, or technical thoughts
- `- deadline:` or `- target:` – any time reference

### DONE
Completed items focus on closure and reflection.

**Required**
- Header line (same as before)
- `- outcome:` – what actually happened (success, partial result, no result, or failure)

**Optional**
- `- done:` – final summary of what was accomplished
- `- note:` – lessons learned, follow-ups, or reflections


