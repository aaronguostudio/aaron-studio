---
name: notion-task-intake
description: Use when Aaron asks to add, capture, insert, or file a new idea, task, project request, backlog item, or execution ticket into his Notion Tasks Tracker, especially when he names a project or asks to create a new project.
---

# notion-task-intake

Capture Aaron's spoken or written intent into the Notion `Tasks Tracker` database as an AI-executable task shell.

This skill is intake only. It creates clean Notion tasks and optional project shells; it does not execute code, commit, push, open PRs, or mark work complete.

## Fixed Notion locations

Treat these as current hints, not a substitute for live fetch:

| Item | Current ID / URL |
| --- | --- |
| Tasks Tracker database | `378b5667-a0c6-80f3-9da4-d4812064c41e` |
| Tasks Tracker data source | `collection://378b5667-a0c6-8044-b0ab-000bf87dc7e7` |
| Projects page | `213b5667-a0c6-8036-9f56-fda5258f07a3` |
| Projects Registry database | `66d3822b86754b37903a8eeb31b2a782` |
| Projects Registry data source | `collection://4bd15e19-bf82-409d-a2d7-25d532a57fc1` |
| New task template | `378b5667-a0c6-806d-8666-f8f67d6fdb61` |

Always fetch the Tasks Tracker and Projects Registry databases before creating or updating pages. If a fixed ID fails, search Notion for the database title and fetch the database result.

## Workflow

1. Confirm Notion tools are available. If not, ask Aaron to connect the Notion app and stop.
2. Fetch the `Tasks Tracker` and `Projects Registry` databases. Use returned `collection://...` data source IDs for task creation, project matching, and relation writes.
3. Fetch `notion://docs/enhanced-markdown-spec` before sending page content to Notion. Do not guess unsupported Markdown.
4. Parse the user request into: task name, project, whether the project is new, priority, agent mode, summary, description, acceptance criteria, repo path, and open questions.
5. Search inside the Tasks Tracker data source for the proposed task name. If a likely duplicate exists, ask whether to update the existing task or create a new one.
6. Handle project routing.
7. Create the Notion task under the Tasks Tracker data source.
8. Return the Notion URL plus the key properties that were set.

## Project routing

Use `Project Ref` as the canonical project link. `Project` is now a legacy compatibility slug for board grouping and old tasks.

When the requested project matches a `Projects Registry` record by `Slug`, set both:

- `Project Ref` to a JSON array containing that project record page URL.
- `Project` to the matching slug, if the legacy select option exists.

If the user explicitly says this is a new project, or explicitly asks to create project `X`:

1. Create a `Projects Registry` record with `Project name`, `Slug`, `Status`, `Area`, `Summary`, and `Repo Path` when known.
2. Add a matching lowercase slug to the legacy `Project` select options only if it does not already exist.
3. Create the task with both `Project Ref` and legacy `Project` populated.

If the project is missing or ambiguous:

- Use the `Idea` registry record and `Project=idea` only when the user clearly wants quick idea capture and no execution project is implied.
- Otherwise ask one concise question before writing.

When adding a select option, preserve all existing options from the fetched schema. Do not replace the `Project` column with only the new option.

DDL pattern for adding a project option:

```sql
ALTER COLUMN "Project" SET SELECT('existing-one':blue, 'existing-two':green, '<new-slug>':purple)
```

Build the full option list from the live fetched schema, preserving existing names and colors when possible.

## Property defaults

Use exact property names from the fetched schema. Current properties:

| Property | Default / rule |
| --- | --- |
| `Task name` | Short action title, usually 4-12 words. Preserve key Chinese/English wording from Aaron. |
| `Project Ref` | Canonical relation to a Projects Registry record. Required unless the project is truly unknown. Use JSON array of page URLs: `["https://app.notion.com/p/..."]`. |
| `Project` | Legacy project slug for board compatibility. Keep in sync with `Project Ref.Slug` when possible. |
| `Status` | `Not started` |
| `Priority` | Explicit user priority, else `Medium`; use `Low` for vague someday ideas and `High` only for urgent/blocking work. |
| `Description` | Concise statement of what Aaron wants and why. |
| `Summary` | 2-4 bullets or compact sentences. Include source context if useful. |
| `Acceptance Criteria` | 3-5 concrete done checks when inferable. Leave blank only for raw idea capture. |
| `Agent Mode` | Default `Triage only`. Use `Auto PR OK` only when Aaron explicitly permits automated implementation/PR. Use `Manual only` when he says it needs human/workshop review. |
| `Agent Status` | Default `Unreviewed`. Use `Needs clarification` only if the task is created despite important missing information. Never set `Autoable` or `PR opened` during intake. |
| `Agent Scope` | Estimate `XS`, `S`, `M`, `L`, or `Unknown`. Prefer `Unknown` when the repo/path or implementation shape is unclear. |
| `Agent Questions` | Specific questions blocking execution. Empty string when none. |
| `Agent Notes` | Intake reasoning: project choice, assumptions, and why the task is or is not ready for triage. |
| `Last Agent Scan` | Set only when writing `Agent Status=Needs clarification` or substantive `Agent Notes`; use current ISO datetime with `date:Last Agent Scan:is_datetime=1`. |
| `Repo Path` | Fill only when confident. Otherwise leave blank and add an Agent Question. |
| `PR URL` | Empty. |

Useful project records and repo path hints:

| Slug | Project record | Repo Path |
| --- | --- |
| `aaron-studio` | `https://app.notion.com/p/394b5667a0c681a59619f483e5435b62` | `/Users/aaronguo/Work/ag/aaron-studio` |
| `blog` | `https://app.notion.com/p/394b5667a0c68156b5dee06d734d4271` | `/Users/aaronguo/Work/ag/blog/aaronguoblog` |
| `image-dock` | `https://app.notion.com/p/394b5667a0c681a19498fa330d79b343` | `/Users/aaronguo/Work/lab/images-stock` |
| `math-for-ai` | `https://app.notion.com/p/394b5667a0c68171bfa1f27076c9a9af` | `/Users/aaronguo/Work/ag/aaron-studio` |
| `org-next` | `https://app.notion.com/p/394b5667a0c681e2aa40f09e59817288` | `/Users/aaronguo/Work/on/org-next` |
| `cf` | `https://app.notion.com/p/394b5667a0c681488954cd3e1199796c` | `/Users/aaronguo/Work/cf/code/web-core-vite` |

## Page content

Do not include the title at the top of page content. Use this shape when enough context exists:

```markdown
## Context
<why this task exists, using Aaron's wording where useful>

## Acceptance criteria
- <done check 1>
- <done check 2>
- <done check 3>

## Source request
> <short quote or paraphrase of Aaron's request>

## Agent intake notes
- Project: <project slug and why>
- Mode: <Agent Mode>
- Open questions: <none or bullets>
```

For raw ideas, replace `Acceptance criteria` with `Potential directions` unless concrete done checks are inferable.

## New project page content

When creating a new Projects Registry record, use this page body:

```markdown
## Context
<one paragraph describing the project>

## Working principles
- Keep tasks lightweight enough for future agent triage.
- Split work by deliverable, not every tiny implementation step.
- Use Tasks Tracker `Project Ref` = <project record> for execution tracking.
- Keep the legacy `Project` select slug = <slug> until the old select column is retired.

## Current intake
- <link or mention of the first task being created>
```

After the task exists, update the page or create it with content that includes the task URL if available.

## Safety rules

- Do not execute the task created by this skill.
- Do not mark a task `Done`, `Autoable`, or `PR opened`.
- Do not set `Agent Mode=Auto PR OK` unless Aaron clearly grants automation permission.
- Do not change Notion schema for an inferred project; only add legacy select options for an explicit new project request.
- Do not create a loose project page under `Projects` for new projects. Create a Projects Registry record instead.
- Do not write only the legacy `Project` select when a matching `Project Ref` exists.
- Do not invent a repo path. Unknown is better than wrong.
- Do not batch unrelated ideas into one task unless Aaron says they are one project/backlog item.
- Ask before creating when duplicate search finds a likely existing task.

## Examples

User: "I have a new idea: make Notion my automated project management board. Put it under a new project called personal-os."

Action: create a `personal-os` Projects Registry record, add `personal-os` to the legacy `Project` select options if needed, then create one task with `Project Ref` pointing to the record, `Project=personal-os`, `Agent Mode=Triage only`, `Agent Status=Unreviewed`, and acceptance criteria around defining the board workflow.

User: "Add a task under image-dock: gallery should support filtering by aspect ratio. Auto PR is okay."

Action: create task with `Project Ref=["https://app.notion.com/p/394b5667a0c681a19498fa330d79b343"]`, `Project=image-dock`, `Repo Path=/Users/aaronguo/Work/lab/images-stock`, `Agent Mode=Auto PR OK`, `Agent Status=Unreviewed`, likely `Agent Scope=S`, and clear acceptance criteria. Do not start implementation.

User: "Remember this vague idea: AI reading coach."

Action: create a lightweight task with `Project=idea`, `Priority=Low`, `Agent Scope=Unknown`, `Agent Status=Needs clarification`, and questions about target user, output format, and success criteria.
