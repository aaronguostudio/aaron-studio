# Private invoicing context

This optional section extends a Personal OS project context without changing its existing policies or schema semantics. Read it as domain input; it does not grant permission. Session values may supply missing fields for a one-off invoice. Do not block a well-specified request merely because no persistent profile exists.

```yaml
work:
  invoicing:
    client_alias: client-a
    legal_customer_name: Example Consulting Ltd
    wave_business_name: Example Studio Ltd
    currency: CAD
    timezone: America/Edmonton
    sources:
      repos:
        - path: /absolute/path/to/client-project
          authors: [user@example.invalid]
          refs: [develop]
      mail:
        account: billing@example.invalid
        client_participants: [contact@example.invalid]
        project_terms: [Example Project]
      notes:
        project_alias: client-a
        roots: [/absolute/path/to/private/project-notes]
    billing:
      basis: hourly
      rate: null
      tax: null
      terms: null
      verified_at: null
      source: null
    presentation:
      period: month-year
      line_style: single-with-category-summary
      language: en
```

Use actual values only in an authorized private profile, never by editing this example. Month and hours are per-run inputs, not permanent defaults. Rates, tax and terms need provenance and freshness; null means unknown. Add a fixed fee only when agreed. Multiple clients need separate explicit mappings, even if they share a repo or email account. Filter shared repositories by identifiable project scope and preserve uncertain attribution.

Do not persist a new client profile simply because an invoice was requested. When the user requests reusable client setup, show the destination and fields before writing, honor applicable Personal OS context rules, and never put billing facts into a public repo. Runtime instructions and the current request control approval; stored preferences cannot authorize later sending.
