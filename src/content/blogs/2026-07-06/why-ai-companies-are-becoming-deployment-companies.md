---
title: "Why Anthropic, OpenAI, AWS, and Microsoft Are All Doing the Same Thing"
date: 2026-07-06
slug: why-ai-companies-are-becoming-deployment-companies
category: ai-native-systems
tags: [forward-deployed-engineering, enterprise-ai, ai-deployment, workflow-engineering]
draft: true
cover: imgs/web/00-cover.webp
---

# Why Anthropic, OpenAI, AWS, and Microsoft Are All Doing the Same Thing

![Enterprise AI deployment layer](imgs/web/00-cover.webp)

If you read the recent AI news one story at a time, each announcement looks like its own corporate move.

[Anthropic](https://www.anthropic.com/news/enterprise-ai-services-company) announced a new enterprise AI services company with Blackstone, Hellman & Friedman, and Goldman Sachs. [OpenAI](https://openai.com/index/openai-launches-the-deployment-company/) launched the OpenAI Deployment Company. [AWS](https://www.aboutamazon.com/news/aws/aws-1-billion-forward-deployed-ai-engineers) committed $1 billion to a Forward Deployed Engineering organization. [Microsoft](https://blogs.microsoft.com/blog/2026/07/02/microsoft-frontier-company-ai-engineering-that-amplifies-and-protects-your-intelligence/) launched Frontier Company, putting 6,000 industry and engineering experts inside customer organizations.

Put them side by side and the pattern is hard to miss: the largest AI platforms are putting engineers closer to the customer, because the next phase of enterprise AI depends on turning models into working business systems.

They point to the same constraint: enterprise AI has moved past the stage where the main question is "Can the model do it?" The harder question is now "Can the company put it to work?"

That problem does not fit neatly into a benchmark chart or a product launch keynote. It lives inside data permissions, workflow gaps, compliance rules, security reviews, legacy systems, user habits, budget owners, and ROI conversations. It is the distance between a strong demo and a system people rely on every day.

That distance is where forward deployed engineering matters.

## The Pattern Is Too Loud To Ignore

Anthropic's announcement shows the market gap clearly. The new company is designed to help mid-sized companies bring Claude into core operations. Anthropic names the kinds of customers that stand to benefit: community banks, mid-sized manufacturers, regional health systems. These are not tiny companies, but they also do not all have deep internal AI engineering teams ready to build frontier deployments.

That detail matters. The biggest enterprises can hire consulting firms, build platform teams, and spend years on transformation programs. The middle of the market often has the same operational pain with fewer internal resources. It may have enough complexity to need custom AI systems, but not enough AI talent to build and run them alone.

OpenAI's Deployment Company makes the same point from a different angle. OpenAI describes forward deployed engineers working inside organizations to identify high-impact workflows, redesign infrastructure around AI, and connect models to customer data, tools, controls, and business processes. The language is revealing. The customer is not left with an API key and a hope that the IT team can figure it out. The deployment model is built around changing how work happens.

AWS is making an even more explicit bet. Its new FDE organization is backed by $1 billion and is designed to embed AWS engineers with customers to build agentic AI systems. AWS says customers have moved past exploration and want AI to become core to how they operate.

Microsoft uses slightly different language, but the pattern is the same. Frontier Company is framed around measurable outcomes, ROI, protected customer intelligence, model choice, and continuous improvement. The pitch goes beyond "use Copilot more." Microsoft is selling an operating model for enterprise AI.

Different companies. Different platforms. Same movement.

The AI companies are moving downstream because the bottleneck moved downstream.

![Separate AI platforms converging on the deployment layer](imgs/web/01-scene-platforms-converge.webp)

## Demos Show Capability. Deployment Shows Operating Capacity.

I keep seeing the same pattern in my own AI workflows, just at a smaller scale.

When I build with agents across code, writing, analytics, video, and publishing, the model is rarely the hardest part for long. The model can write, reason, summarize, inspect files, generate tests, draft plans, search docs, and produce artifacts. The hard part is turning that capability into a work system I can trust.

Where does the agent get context? Which files can it touch? What counts as evidence? Who reviews the output? Where does the result get stored? What happens when it is wrong? Does the next run learn anything from this one? How do I keep the system from creating more artifacts than I can review?

The same questions appear in enterprise AI, only with higher stakes.

It is easy to create a demo where a model answers a support question, summarizes a contract, drafts a sales email, reviews a document, or generates code. It is much harder to make that system work inside the real organization. The enterprise version has permissions, audit trails, data residency, procurement, legal review, role-based access, existing tools, employee training, exception handling, and business KPIs.

A demo proves that a model can perform a task. Deployment proves that a company can turn that task into a trusted operating loop.

That is why the deployment wave is important. It suggests that AI adoption is becoming less like installing software and more like redesigning a workflow around a new kind of worker. The model is the intelligence layer. Deployment is the process of deciding where that intelligence enters the business, what it is allowed to do, how it is evaluated, and who remains accountable.

![From model demo to trusted operating loop](imgs/web/02-metaphor-demo-to-operating-loop.webp)

## What A Forward Deployed Engineer Actually Does

Forward deployed engineering is not new. Palantir built much of its operating model around it years ago. In Palantir's own explanation, a forward deployed software engineer embeds with customers and focuses on enabling many capabilities for one customer, while a traditional product engineer more often builds one capability for many customers.

That distinction is useful.

A normal software engineer can be far from the customer and still do excellent work. A sales engineer can be close to the customer but mainly optimize for demonstration and technical validation. A consultant can understand the business and shape the roadmap, but may not be the person who builds and operates the production system.

The forward deployed engineer works at the intersection of those roles.

They have to understand the business problem well enough to avoid building the wrong thing. They have to understand the technical system well enough to build something real. They have to work close enough to users to see where the workflow actually breaks. They have to be pragmatic enough to ship under constraints, but disciplined enough to avoid creating a pile of custom one-off work that cannot be maintained.

That is why the role is suddenly so relevant to AI.

AI systems are full of last-mile details. The difference between "useful" and "dangerous" can be a permission rule, a missing source citation, a weak eval, a bad fallback path, a stale data connector, or a human approval step in the wrong place. Those details do not reveal themselves in a product demo. They appear when the system touches real work.

An FDE is valuable because they operate where those details become visible.

## FDE Changes The Center Of Gravity

There is a lazy version of this argument that says FDE is just consulting with better branding. I think that misses the point.

Traditional consulting and system integration still matter. Large enterprises need change management, program governance, training, compliance, global rollout support, operating model design, and cross-system coordination. Those are real disciplines. A team of brilliant engineers parachuting into a regulated enterprise without change management can still fail.

The difference is the center of gravity.

Traditional consulting often starts with analysis and ends with a recommendation, roadmap, operating model, or transformation program. Implementation may happen, but it can be separated across teams, vendors, and phases. The work can become a chain: diagnose, recommend, approve, implement, train, maintain.

Forward deployed engineering compresses that chain.

| Traditional consulting center of gravity | Forward deployed engineering center of gravity |
|---|---|
| Diagnose and recommend | Understand and build |
| Roadmaps and project artifacts | Production systems and operating capability |
| Stakeholder coordination | Embedded workflow redesign |
| Billable project delivery | Measurable business outcomes |
| Hand off to implementation | Iterate with users and systems |
| External expertise | Field learning that feeds the product |

AWS makes this distinction almost directly. Its FDE announcement says the model is designed around business outcomes and customer self-sufficiency, not billable hours. It also describes leaving behind systems, runbooks, architecture documentation, knowledge graphs, and trained internal champions.

The offer is closer to: we will build with you until the system and the capability remain after we leave.

Microsoft adds another important layer: trust. Its Frontier Company framing emphasizes protecting customer data, IP, and competitive advantage, while giving customers model choice across OpenAI, Anthropic, Microsoft, open source, and specialized models. That is the part every enterprise buyer will eventually care about. If an AI deployment rewires core workflows, the customer cannot treat lock-in, data ownership, governance, and model flexibility as footnotes.

The better way to read FDE is as a fusion of engineering, product judgment, implementation, and operating change.

That fusion exists because AI deployment spills across disciplines. It is too technical to be handled as strategy alone. It is too organizational to be handled as engineering alone.

![FDE shifts the center of gravity from handoff to embedded building](imgs/web/03-comparison-fde-center-of-gravity.webp)

## Why AI Companies Want This Layer

There is also a business reason the AI platforms are doing this now.

Frontier models are expensive to build. They are also becoming harder to differentiate through benchmark jumps alone. A customer may care which model performs best today, but they care more about whether the system improves revenue, reduces cost, lowers risk, speeds up decisions, or creates a product advantage.

Most of that value is captured in the workflow around the API call.

That is why Alex Karp's recent criticism of the AI industry is useful, even if you do not buy every part of the performance. In a CNBC interview summarized by [Moneycontrol](https://www.moneycontrol.com/artificial-intelligence/why-palantir-ceo-alex-karp-is-angry-with-ai-industry-models-completely-oversold-article-13964154.html), the Palantir CEO argued that enterprises are frustrated by AI spending that has not turned into visible value. His complaint was not that companies lack access to models. It was that token consumption, data exposure, and model promises are not the same thing as business outcomes.

That is a very Palantir-shaped argument, and it is also self-interested. But the underlying point fits the broader pattern. Palantir's long-running bet has been that the value sits in connecting models, data, ontology, permissions, and operations inside the customer environment. Now the model companies are moving toward that same layer.

If an AI company stays only at the model layer, it risks becoming infrastructure that others package, integrate, and monetize. If it moves into deployment, it gets closer to the customer's highest-value problems. It learns which workflows matter. It sees where the model fails. It develops reusable patterns. It drives more usage. It builds stickier customer relationships. It may also capture a larger part of the transformation budget.

That is why the Blackstone and Fractional AI sequence is so interesting. Shortly after the Anthropic-backed services company was announced, Blackstone announced that the new firm had acquired Fractional AI as its founding operational centerpiece. That move says the quiet part out loud: model access is only one asset. Applied AI engineering talent is the scarce capability that turns models into working systems.

The OpenAI Deployment Company has a similar shape. OpenAI agreed to acquire Tomoro, giving the new company experienced forward deployed engineers from day one. It also brought in investment firms, consultancies, and systems integrators as partners. The business model is telling: the platform wants to stay connected to research and product, while using partners and deployed engineers to scale real-world adoption.

This creates tension.

Consultancies and system integrators will still be important, but the high-value part of their work will move toward AI-native implementation capability. Customers will get more help, but they will also need to ask harder questions. Is the system model-portable? Who owns the workflow assets? Where does company data live? What happens when the model changes? Can internal teams maintain the system without the vendor?

The companies that buy AI deployment services should not outsource judgment. They should use outside expertise to build internal capability faster.

## The Lesson For Technical People

This is the part I care about most.

The rise of FDE is a career signal for technical people. Code-native engineers can build the system. Model-native engineers can use the new intelligence. The next leverage point belongs to engineers who can carry that intelligence into production workflows.

I think of that as becoming deployment-native.

A deployment-native engineer can walk into a messy workflow and find the real constraint. They can tell the difference between a task that should be automated, a decision that needs human judgment, and a process that should not exist anymore. They can connect models to data, tools, permissions, and business processes. They can design evals, guardrails, monitoring, and fallback paths. They can work with non-technical users without losing technical rigor. They can measure whether the system changed an outcome.

That skill set is broader than prompt engineering.

Prompting matters. It is one interface to intelligence. But prompts are not enough when the problem is putting AI into production workflows. The durable skill is workflow engineering: understanding how work actually moves through a system, where AI changes the cost structure, and how to redesign the loop so the output becomes useful, safe, and measurable.

This changes the shape of engineering work.

For a long time, strong engineering often meant keeping the customer's operational mess outside the product boundary. That made sense. Good platforms create reusable primitives. Good infrastructure hides complexity. Good product teams avoid turning every customer request into custom work.

But AI shifts the boundary. Generic code is getting cheaper. The ability to understand context is getting more valuable. The engineer who can connect technical possibility to a business workflow has more leverage than the engineer who only waits for a clean ticket.

The same is true for product managers and leaders. The work is no longer "find AI use cases" in the abstract. The work is to choose which workflows deserve intelligence, what evidence would prove value, where the risks are, and how to make adoption safe enough to scale.

That is why I like the phrase deployment-native. It names a posture more than a job title.

The deployment-native person needs a more practical lens than "find AI use cases." I would use ACTOR:

**Action.** What business action, decision, handoff, or repetitive task is actually constrained? If this is vague, the project becomes a demo looking for a use case.

**Context.** What does the system need to know? Where is the source of truth? What are the data access boundaries, permission rules, and governance constraints? Many enterprise AI failures are not model failures. They are context failures.

**Trust.** What level of autonomy should the AI have? Is it drafting, recommending, deciding, or acting? Each verb requires a different permission model, approval path, fallback, and audit trail.

**Outcome.** What would prove that the system improved the work? Faster cycle time, fewer escalations, lower error rate, higher conversion, better margin, cleaner documentation, shorter onboarding. Without an outcome layer, AI adoption becomes theater.

**Responsibility.** Who owns the system after launch, and who owns its improvement loop? What feedback shows whether it actually improved the work? What runbook remains? Which internal champion can maintain it? Which patterns are captured so the next workflow starts smarter?

Responsibility is not just accountability. It is the condition for recursive improvement. If deployment ends at launch, the system slowly decays. If every run leaves evidence, sharper evals, cleaner data contracts, better prompts, postmortems, and reusable patterns, the system compounds. The best enterprise AI deployments do not merely survive real use. They learn from it.

I like ACTOR because enterprise AI only matters when it stops being a chatbot on the side and becomes an actor inside the workflow. That does not mean full autonomy. It means the system has a defined role, context, trust boundary, measurable outcome, owner, and learning loop.

![ACTOR framework for deployment-native enterprise AI](imgs/web/04-framework-actor-loop.webp)

That is the practitioner version of FDE. It is knowing how to turn customer proximity into a system that survives contact with real work.

## The Bigger Shift

The model era made intelligence feel abundant. The deployment era will test whether that intelligence can change work.

That is the cleaner way to read these announcements. Anthropic, OpenAI, AWS, and Microsoft are not merely adding services teams. They are admitting that enterprise AI value depends on the system around the model: the data, workflow, controls, trust, incentives, and ownership that decide whether output changes behavior.

I do not think every engineer should become an FDE. Some people should go deep on infrastructure, models, security, product platforms, research, and developer tools. But every technical person should understand why this role is becoming visible now. It is a signal that the frontier has moved closer to the customer.

In my own work, this has become the question I trust most: what has to be true around the model before I let its output change the next step?

The companies that learn to answer it will do more than deploy AI. They will turn intelligence into operating capacity. The companies that do not will keep buying expensive tokens, reporting activity as progress, and wondering why none of it turns into margin, speed, or better decisions.
