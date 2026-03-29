### Team Introductions & Background

- Thiago: Software developer (25 years experience, Brazil → Canada)
  - Previously at Benevity (Calgary unicorn)
  - Business-focused approach over technical details
  - Ran software company in Brazil for 10+ years
  - Musician (piano, band)
- Z: Solution architect at current company
  - Infrastructure and architecture specialist
  - Works on complex systems others avoid
  - Vancouver-based, has newborn
- Jon Olsen: CEO/Founder Olsen Consulting
  - CFA, CPA background - former controller/CFO
  - Started consulting 2012 after fixing bad Viewpoint implementation
  - 14-15 years building Viewpoint expertise across North America
  - Team of consultants with development capabilities

### Olsen Consulting’s Current Solutions

- AP Wizard: Automated invoice processing for construction
  - Processes emails with multiple PDFs/invoices automatically
  - Extracts header and complex line coding information
  - Reduces 10-20 minute invoice processing to 10-20 seconds
  - 50+ customers, 30-day free trial, word-of-mouth growth
  - 30-minute implementation vs competitors’ 3-6 months
- DocuSign integration: Fully automated workflow for Viewpoint system
- Market position: No salespeople needed, all referral-based growth

### Viewpoint GPT Project Overview

- Database documentation: Complete SQL object documentation for entire Viewpoint system
  - 1,217 Crystal reports with business logic
  - Metadata validation and column verification
  - Custom naming conventions and relationship mapping
- Three versions developed:
  - V2: Full documentation with validation (shared previously)
  - V3: Streamlined version using [skills.md](http://skills.md) approach
  - Focus on minimal necessary components for production
- Core challenge: Orchestration failures causing workflow interruptions

### Technical Architecture & Business Rules

- Viewpoint system complexities requiring domain expertise:
  - Inconsistent alias usage and view/table relationships
  - User-defined field customizations with specific naming conventions
  - Three types of customizations (native UD, custom database, Trimble recommendations)
  - GAAP compliance requirements (ASC 606 revenue recognition)
- Resource selection matrix: Decision flowchart for optimal query building
- Integration with Excel MCP for cross-system validation
- 2,000-3,000 Viewpoint customers across North America

### Market Opportunity & Competitive Landscape

- Construction industry: Low margins (3-6%), automation can double profitability
- Palantir partnership with Thomas Kavanaugh as potential threat
  - Building ERP replacement solution
  - Jon’s assessment: Lacks domain expertise and relationships
  - Estimated 1+ year learning curve even for experienced developers
- Olsen’s advantages:
  - 15 years of business process knowledge
  - Established consultant network (100+ independent consultants)
  - AI peer group leadership (36 companies in recent meeting)
  - Direct relationships with hundreds of company leaders

### Next Steps

- Team to analyze codebase and create roadmap proposal
- Focus areas for initial development:
  1. Excel + Viewpoint GPT integration workflow
  2. Proper orchestration to prevent workflow failures
  3. Semantic understanding of 500+ column workbooks
  4. SQL optimization and validation
- Timeline: 1-2 days for proposal, 3-month initial contract
- Pricing model: API usage-based with credit card billing
- Long-term vision: Expand to AR Wizard, job cost projections, full ERP replacement

---

Chat with meeting transcript: [https://notes.granola.ai/t/2ba0f6f0-f47a-4d05-9fc0-28e43bbb4983](https://notes.granola.ai/t/2ba0f6f0-f47a-4d05-9fc0-28e43bbb4983)