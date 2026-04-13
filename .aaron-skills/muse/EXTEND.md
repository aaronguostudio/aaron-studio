---
version: 1

# Writing identity
author_name: "Aaron Guo"
brand_positioning: "Product leader building AI-native tools. I ship with AI and write about what works."

# Writing formats
writing_formats:
  - blog
  - newsletter
  - linkedin
  - video-script

# Content pillars
content_pillars:
  - AI-native execution
  - product leadership
  - building in public

# Target audience
target_audience: "Tech professionals and builders who want to ship with AI"

# Personal context directories
content_paths:
  journals_dir: "src/brain/journal/"
  reading_notes_dir: "src/brain/reading/"
  brain_dir: "src/brain/"
  past_writing_glob: "src/content/blogs/*/content-plan.md"

# CTA rotation
cta_rotation:
  enabled: true
  sequence: ["follow", "newsletter", "reply"]
  current: "newsletter"

# Signal DB
signal_db:
  enabled: true
  provider: "turso"
  database_url: "libsql://news-radar-aaronguo.aws-us-east-1.turso.io"
  auth_token_env: "TURSO_AUTH_TOKEN"
  tables:
    daily_pulse: "daily_pulse"
    items: "items"
  min_relevance: 7
  lookback_days: 7

# Next skill to suggest after a topic is confirmed
next_skill: "tessl__blog-brainstorm"
---
