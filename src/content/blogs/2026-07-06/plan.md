# Blog Plan: Expensive Tokens Won't Save Enterprise AI

## Meta
- **Author:** Aaron Guo
- **Target:** aaronguo.com blog (EN first, ZH adaptation later)
- **Tone:** Entrepreneurial, crisp, insight-led, commercially useful; no hype, no generic AI influencer language.
- **Length:** 2,000-2,700 words
- **Audience:** Product builders, senior engineers, engineering managers, technical founders, and operators trying to understand where enterprise AI is going.
- **CTA:** reply
- **Working subtitle:** Why Anthropic, OpenAI, AWS, and Microsoft are all moving toward deployment capability.

## Hook

Open with the pattern, not the individual announcement.

Anthropic is building an enterprise AI services company with Blackstone, Hellman & Friedman, and Goldman Sachs. OpenAI launched the OpenAI Deployment Company. AWS committed $1 billion to forward deployed AI engineers. Microsoft launched Frontier Company with 6,000 embedded industry and engineering experts.

These announcements look separate. They are not.

The most interesting AI trend right now is not another model release. It is that the biggest AI platforms are all moving downstream into deployment. They are sending engineers into customer environments to make AI work inside messy workflows, data systems, governance constraints, and business metrics.

That tells us where the bottleneck moved.

## Thesis

As frontier models become more capable, the scarce skill in enterprise AI is shifting from accessing intelligence to deploying it inside real organizations, which makes forward deployed engineering one of the clearest signals of how technical work is changing.

## Personal Anchor

Frame this from Aaron's AI-native execution lens, not as a finance or consulting analyst.

The personal entry point: I spend a lot of time building AI workflows that turn intent into output across code, writing, analytics, video, and publishing. The same pattern keeps appearing: the model is rarely the hardest part. The hard part is connecting the model to the real operating system of the work - files, permissions, data, tools, review, metrics, ownership, and human behavior.

That is why the FDE wave matters. It is the enterprise-scale version of the same lesson: AI value is created when intelligence is embedded into a workflow that people can trust, operate, and improve.

## Growth Context

- **Pattern to reuse:** `deep_reader_signal`
- **Pattern to avoid:** `linkedin_manual_import_missing`
- **Measurement caveat:** Current feedback is sparse: one editorial review plus top-content list. Treat growth lessons as directional, not statistically conclusive.
- **Current next experiment:** Open with a concrete operating bottleneck before naming the abstract AI-native framework.
- **Applied lesson:** Reused the "concrete bottleneck opening" lesson by opening with four concrete org/product moves before naming deployment as the framework.
- **Article hypothesis:** This post should attract qualified engaged readers because it combines a timely market pattern with a practical builder skill: deployment-native engineering.
- **Target audience:** AI-native builders, product leaders, engineering managers, senior developers, and operators.
- **Expected distribution channel:** X long-form teaser, LinkedIn teaser, newsletter.
- **Success metrics:** 75% scroll depth, 100% scroll depth, outbound source clicks, replies/comments from technical operators.
- **Revision lesson:** Strengthen practitioner utility with the ACTOR deployment framework: Action, Context, Trust, Outcome, Recursive. The R layer includes the feedback loop and self-enhancement path after launch.

## Outline

### Part 1: The Pattern Hiding in Plain Sight
- Start with the four-company pattern:
  - Anthropic announced a new AI services company with Blackstone, Hellman & Friedman, and Goldman Sachs to bring Claude into mid-sized companies' core operations.
  - OpenAI launched the OpenAI Deployment Company, acquiring Tomoro to bring experienced FDEs into enterprise deployments from day one.
  - AWS announced a $1 billion Forward Deployed Engineering organization to embed experts with customers and co-develop agentic AI systems.
  - Microsoft launched Frontier Company, describing it as outcome-driven enterprise AI engineering that embeds 6,000 industry and engineering experts with customers.
- Make the reader feel the convergence: different companies, different ecosystems, same movement.
- The surface story is "AI vendors are expanding services."
- The deeper story is "enterprise AI has entered the deployment era."
- Evidence:
  - Anthropic: demand for Claude is outpacing any single delivery model; mid-sized companies lack in-house resources.
  - OpenAI: FDEs redesign workflows and connect AI to customer data, tools, controls, and business processes.
  - AWS: customers are past exploration and want AI core to operations.
  - Microsoft: customers want measurable business outcomes and ROI, not more pilots.
- Personal beat:
  - "This caught my attention because it matches what I see in smaller AI-native workflows: the model is powerful, but the value only appears when the work around it changes."

### Part 2: Why Models Are No Longer Enough
- Explain the enterprise AI adoption gap.
- Companies already have access to powerful models, APIs, copilots, and agent frameworks.
- Yet many AI projects stall between demo and production.
- The failure points are not glamorous:
  - data is fragmented
  - permissions are unclear
  - workflows are undocumented
  - security and compliance are real constraints
  - users do not want another tool
  - ROI is hard to prove
  - failure modes need fallback paths
  - ownership after launch is ambiguous
- Use the phrase:
  - "A demo proves the model can do something. Deployment proves the organization can absorb it."
- Contrast:
  - 2023-2024: "Which model is best?"
  - 2025-2026: "Which organization can turn models into durable operating change?"
- Personal beat:
  - Connect to Aaron's prior writing on AI as an operating system and one-person projects. AI changes the unit of work only when intent, workflow, review, evidence, and memory are redesigned.

### Part 3: What a Forward Deployed Engineer Actually Does
- Define FDE in plain language:
  - A forward deployed engineer is an engineer who works close to the customer, close to the workflow, and close to production. Their job is not only to implement features, but to translate messy business operations into working technical systems.
- Distinguish FDE from three adjacent roles:
  - Not just a software engineer: because the work starts from customer context, workflow discovery, and business outcome.
  - Not just a sales engineer: because the work must run in production, not just demo well.
  - Not just a consultant: because the deliverable is not primarily a deck, recommendation, or project plan; it is a working system plus the capability to keep improving it.
- Use Palantir as historical context:
  - Palantir described FDSEs as engineers embedded directly with customers, focused on enabling many capabilities for one customer rather than building one capability for many customers.
  - Palantir's own framing is useful because today's AI FDE wave is not brand new; AI is making the model much more broadly relevant.
- Key distinction:
  - Traditional consulting often separates diagnosis, recommendation, implementation, and maintenance.
  - FDE compresses those loops: understand, build, test, deploy, observe, improve, and feed product lessons back into the platform.
- Personal beat:
  - "The part I find most interesting is not the title. It is the compression of roles. FDE sits where product, engineering, implementation, and operating judgment meet."

### Part 4: Why FDE Is Different From Traditional Consulting
- Be fair to consultants. Do not set up a weak straw man.
- Traditional consulting and system integration still matter, especially for:
  - global transformation
  - compliance-heavy rollouts
  - change management
  - multi-system enterprise programs
  - training and operating model design
- The difference is where the center of gravity moves.
- Traditional consultant center of gravity:
  - analyze the business
  - recommend a roadmap
  - coordinate stakeholders
  - manage change
  - often hand off to implementation teams
- FDE center of gravity:
  - enter the workflow
  - build the system
  - integrate with real data and controls
  - design evals, guardrails, and fallback paths
  - leave behind reusable patterns, runbooks, and internal capability
  - return field learnings to the product roadmap
- Include a simple comparison table in the draft:
  - Output vs outcome
  - Recommendation vs production system
  - Billable hours vs measurable business result
  - Project artifact vs reusable operating capability
  - External advice vs embedded engineering loop
- Use AWS as an example:
  - AWS explicitly says FDE differs from traditional consulting because it builds for long-term customer self-sufficiency, leaves knowledge graphs, runbooks, architecture docs, and trained internal champions, and is structured around shared business results.
- Use Microsoft as a more nuanced example:
  - Microsoft argues that enterprise AI requires engineering, industry knowledge, change management, continuous improvement, model choice, and IP protection.
  - This broadens the argument: FDE alone is not enough. Deployment requires engineering plus trust.

### Part 5: Why Every AI Company Suddenly Cares About Deployment
- Explain the business logic.
- Frontier models are expensive to build and increasingly hard to differentiate only through benchmark jumps.
- Enterprise value is not captured only at the API layer.
- Deployment creates:
  - stickier customer relationships
  - better product feedback
  - proprietary implementation patterns
  - deeper understanding of high-value workflows
  - more usage of the underlying model/platform
  - potential services and transformation revenue
- But there is also strategic tension:
  - AI vendors want to move downstream.
  - Consulting and SI partners do not disappear, but the value pool shifts.
  - Customers want help, but also worry about lock-in.
- Use Microsoft as the counterweight:
  - Microsoft emphasizes model-diverse, open, heterogeneous AI systems and protecting customer data/IP.
- Use Anthropic/Fractional AI as evidence of execution:
  - The new Anthropic-backed services firm quickly acquired Fractional AI as its founding operational centerpiece, suggesting that applied AI engineering talent is the scarce asset.
- Personal beat:
  - "The AI companies are not just selling intelligence anymore. They are trying to own the path from intelligence to operational change."

### Part 6: The Lesson for Technical People
- This is the main Aaron angle. Make it useful, not just analytical.
- The career implication:
  - The next valuable engineer is not only model-native or code-native. They are deployment-native.
- Define deployment-native:
  - can understand a real workflow
  - can identify the high-value friction point
  - can decide where AI should not be used
  - can connect models to data, tools, permissions, and business processes
  - can design evals, guardrails, monitoring, and fallback paths
  - can work with non-technical users without losing technical rigor
  - can measure whether the system changed an outcome
  - can turn one-off solutions into reusable patterns
- Make the point against shallow "prompt engineering":
  - Prompting is a useful interface skill.
  - Workflow engineering is the durable skill.
- Tie this to software engineers:
  - Traditional engineering rewarded abstraction away from customer mess.
  - AI-era engineering may reward moving closer to the mess, because the generic code gets cheaper and the workflow context becomes more valuable.
- Tie this to product managers and leaders:
  - Product judgment becomes the ability to choose which workflows deserve AI, what evidence proves value, and how to make adoption safe.
- Personal beat:
  - Connect to Aaron's "Ship with AI, not about AI" positioning. The goal is not to comment on AI transformation. The goal is to build systems that make it real.

### Part 7: The Bigger Shift
- Close by zooming out.
- AI adoption is not just a technology diffusion story. It is an operating model story.
- The old software world sold tools and expected customers to adapt around them.
- The AI world increasingly has to enter the customer workflow because the system's value depends on context:
  - business rules
  - internal language
  - proprietary data
  - human trust
  - compliance constraints
  - measurable outcomes
- Closing argument:
  - "The model era made intelligence abundant. The deployment era will decide who can turn that intelligence into work."
- Final line option:
  - "The companies that win enterprise AI may not be the ones with the best chatbot. They may be the ones that learn how to make intelligence operational."

## Visual Ideas
- Cover image: Four large AI platforms converging into one enterprise workflow map, with the visual metaphor of "model layer" flowing into "deployment layer" and then into real business systems.
- Inline diagram: "From model to outcome" pipeline: model capability -> workflow discovery -> data/tools/controls -> production system -> adoption -> measurable outcome -> feedback to product.
- Inline comparison table: consultant vs FDE vs product engineer.
- Pull quote card: "A demo proves the model can do something. Deployment proves the organization can absorb it."

## Distribution Plan
- Blog: Publish as the source-of-truth essay with citations and a practical "deployment-native" framework.
- X: Long-form native post with the title hook: "Anthropic, OpenAI, AWS, and Microsoft are all doing the same thing. That is not a coincidence." Link to the blog in a reply.
- Newsletter / LinkedIn: Lead with the contrarian line: "AI was supposed to automate consulting. Instead, the leading AI companies are rebuilding it around engineers."
- YouTube: Short explainer script: "Why AI companies are hiring forward deployed engineers."

## Source Notes
- Anthropic announcement: https://www.anthropic.com/news/enterprise-ai-services-company
- Blackstone Fractional AI acquisition: https://www.blackstone.com/news/press/the-ai-native-enterprise-services-firm-backed-by-anthropic-blackstone-and-hellman-friedman-announces-acquisition-of-fractional-ai/
- OpenAI Deployment Company: https://openai.com/index/openai-launches-the-deployment-company/
- AWS Forward Deployed Engineering: https://www.aboutamazon.com/news/aws/aws-1-billion-forward-deployed-ai-engineers
- Microsoft Frontier Company blog: https://blogs.microsoft.com/blog/2026/07/02/microsoft-frontier-company-ai-engineering-that-amplifies-and-protects-your-intelligence/
- Microsoft Frontier Company page: https://www.microsoft.com/en-us/frontier-company
- Palantir FDSE role context: https://blog.palantir.com/a-day-in-the-life-of-a-palantir-forward-deployed-software-engineer-45ef2de257b1
- Palantir Dev versus Delta context: https://blog.palantir.com/dev-versus-delta-demystifying-engineering-roles-at-palantir-ad44c2a6e87
- Alex Karp / Palantir critique of enterprise AI token value and IP risk: https://www.moneycontrol.com/artificial-intelligence/why-palantir-ceo-alex-karp-is-angry-with-ai-industry-models-completely-oversold-article-13964154.html

## Drafting Notes
- Do not make the piece mostly about private equity. Mention PE only as one distribution and adoption channel in the Anthropic/OpenAI examples.
- Avoid writing as if FDE is brand new. Better framing: Palantir had the model early; AI is making it mainstream.
- Avoid dunking on consultants. The sharper claim is that FDE changes the center of gravity from recommendation to production deployment.
- Keep the article grounded in technical implications for builders: workflow engineering, evals, guardrails, integration, adoption, and measurable outcomes.
- Use "I" sparingly but concretely: "This matters to me because every AI workflow I build runs into the same issue..."
