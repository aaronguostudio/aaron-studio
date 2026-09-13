---
name: wave-invoice
description: Prepare, create, or revise client invoices in Wave from monthly timesheets and scoped repository, email, and note evidence. Use for Aaron's client billing workflow across projects, including work summaries and invoice drafts.
---

# Wave Invoice

Turn a client and billing month into a source-backed English invoice in the correct Wave business. This is a domain workflow in Aaron's Personal OS; Personal OS supplies context, not billing authority. A request to create an invoice normally authorizes saving a draft. Sending, approving, marking sent, or recording payment requires the user's applicable instruction; do not treat creating this skill as future billing authorization.

## Resolve the billing context

Read only the relevant `work.invoicing` section of the project's `.agent-context/aaron-personal-os/context.yaml`, or a private billing profile explicitly supplied by the user. See [context contract](references/context.md) when setting up or interpreting a profile. Resolve repository and Brain roots through existing local configuration. The containing Aaron Studio repository's `config/aaron-studio.json` supplies its Brain root; when installed as a symlink, resolve the canonical skill location to find that repository. Do not assume the current code repository is the client being invoiced.

Establish client alias and legal billing entity, month/year and timezone, Wave business, intended mode (summary, draft, edit, or send), hours or pricing basis, currency, rate and tax treatment. Use session instructions first, current verified context second. A same-client recent invoice can supply the established rate, item, currency, terms and format when no conflicting evidence exists; identify this assumption briefly. Generic product catalog prices do not override client-specific invoice rates. Ask only for unresolved choices that affect billing. An ambiguous customer/business blocks the Wave write, not independent evidence collection.

Keep client addresses, commercial terms, contact details and source records in private context, not in this reusable skill or a shared code repository. Retrieve the live business address; never carry an old address, postal code, browser ID or invoice ID forward from an example.

## Collect evidence and reconcile hours

Use [source and summary guidance](references/evidence.md) for repo, mail and note collection. Search only this client's declared projects and the relevant period. Prefer purpose-built connectors; use supported browser controls when needed. Report unavailable sources honestly and proceed with sufficient available evidence without claiming to have scanned them all.

Separate two ledgers:

- **Billing basis:** User timesheet, approved time records, or agreed fixed fee. Preserve dates, quantities, source and adjustments. Commits, emails, meetings and elapsed activity are not billable hours. If hours are absent, prepare the summary and ask for hours or the agreed fee; never invent a timesheet.
- **Work evidence:** Source-backed features, fixes, infrastructure work, reviews and coordination. Attribute the user's work accurately; distinguish local changes, merged work, deployment and runtime verification. Do not turn another contributor's implementation into the user's own development, or a proposed task into completed work.

Compute totals independently with decimal arithmetic. Check duplicate time entries and overlapping projects before combining. Do not silently discard similar entries or expand the timesheet to a full month. Keep the exact covered dates in the internal reconciliation; by default the customer-facing heading is `August 2026 OlsenAI development.` (substitute month/year/client), without a partial-month range or redundant hours in that heading. Retain required exact service dates if a contract or the user requests them.

Calculate line quantity × rate, subtotal, existing applicable tax and total; compare with Wave's totals and explain rounding differences. An existing tax setting is context, not tax advice. Missing or conflicting tax treatment needs clarification before a final billing amount is asserted.

## Draft the invoice

Write concise English descriptions organized around customer outcomes. Preserve user-supplied hour categories unless a regrouping is authorized. Use the client's established invoice structure: a single software-development line with total hours and category paragraphs, or separate category lines if preferred. Never bill the same hours both ways. Include sufficient scope to substantiate the charge without raw commit lists, internal links, credentials, private commentary or unverified delivery claims.

Before saving, show a short concrete billing summary (client, month, hours/rate or fee, tax, total, any material assumption). This is a progress update, not an automatic permission gate when creation is already authorized. If a required value is missing, ask for that value and continue independent preparation.

## Create or update in Wave

1. Re-discover the user's requested browser and current Wave tab through supported tools; verify the business and customer. Read live tool documentation. Do not use hidden application state, guessed IDs or cached element indexes.
2. Search existing invoices, including Draft and All invoices, for the same client and service month. Invoice issue month can differ from service month: inspect descriptions. Reuse an unambiguous matching draft when the user intends to continue it. Ask before replacing an existing issued invoice or creating an apparent duplicate, unless that exact edit/duplicate is already requested.
3. Fill only the intended fields. Default to today's issue date and the client's established payment terms, not an invented month-end/backdate. Use current client-specific rate and tax, not another customer's values. A supplied address correction permits updating Wave business info and the target invoice; do not silently substitute the old postal code or change unrelated contact fields.
4. Save the draft or authorized edit. Read the resulting invoice detail and verify number, customer, month wording, quantity, rate, tax, total, address if changed, and visible status. A click or disabled Save button is not completion.
5. If a save has an uncertain result, search/reopen before retrying; do not repeat Create and risk duplicate billing. Retry once after resolving a concrete UI problem, then report the blocker and preserve the form for handoff.
6. Observe current status on every edit: the user may have approved or marked an invoice sent since the last turn. Editing an already-sent invoice does not authorize resending it. Existing downloaded PDFs do not automatically update; mention this when relevant.

Report a direct invoice link, number, status, service month, hours/fee and total. State accurately whether this run sent anything. Keep the result tab open. Do not record payment, enroll online payments, schedule reminders, or modify accounting configuration as a side effect of invoice creation.

## Example requests

- “Use $wave-invoice to create Olsen's August invoice from these hours and the ERP repo.”
- “Create a September invoice for Client B; scan the configured repos, client emails and project notes. Save a draft.”
- “Update invoice 73 to show August 2026 instead of the exact date range.”
- “Summarize this month's work for billing; don't create anything in Wave yet.”
