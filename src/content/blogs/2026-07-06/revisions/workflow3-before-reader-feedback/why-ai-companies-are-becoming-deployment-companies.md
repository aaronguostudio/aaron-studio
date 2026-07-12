---
title: "Expensive Tokens Won't Save Enterprise AI"
date: 2026-07-06
slug: why-ai-companies-are-becoming-deployment-companies
category: ai-native-systems
tags: [forward-deployed-engineering, enterprise-ai, ai-deployment, workflow-engineering]
draft: true
cover: imgs/web/00-cover-v7-human-backpropagation.webp
---

# Expensive Tokens Won't Save Enterprise AI

*Anthropic, OpenAI, AWS, and Microsoft are building a human backpropagation layer around their models. That tells us where enterprise AI value actually lives.*

![Human feedback repairing a broken path from model consumption to operating value](imgs/web/00-cover-v7-human-backpropagation.webp)

Last week, my AI workflow completed what looked like a serious piece of work. It researched a topic, drafted an article, produced a Chinese edition, generated images, narrated the script, and assembled a video.

Then I clicked an internal link in the local preview.

404.

Every individual task appeared complete. The workflow had failed.

At my scale, the fix was inexpensive. I corrected the route, tested the published paths, and added a validator so the same class of broken link could not quietly pass again. Inside an enterprise, the equivalent failure might be a permission error, a stale data source, an approval step in the wrong place, an agent acting without an audit trail, or a model output that nobody owns.

The model can perform the task. That is no longer the whole problem. The hard part is making the result survive contact with the organization.

Now look at where the AI platforms are putting their money. Between May 4 and July 2, Anthropic, OpenAI, AWS, and Microsoft all announced major organizations built around deployment. The disclosed commitments around OpenAI, AWS, and Microsoft alone total at least $7.5 billion.

The spending does not prove these organizations will work. It does reveal what the vendors believe is missing.

My reading is straightforward: the model is not yet the complete enterprise product. It supplies intelligence. A deployment layer turns that intelligence into operating capacity, then carries what the field learns back into the product.

That is why Forward Deployed Engineering is suddenly everywhere.

![A complete article, translation, audio, and video workflow interrupted by one broken route](imgs/web/01-task-passed-workflow-failed-v7.webp)

## The $7.5 Billion Clue

The four announcements use different language, but they point at the same conversion problem.

[Anthropic](https://www.anthropic.com/news/enterprise-ai-services-company) formed an enterprise AI services company for mid-sized businesses, with Anthropic Applied AI engineers working alongside the new firm's team. Its own explanation is unusually direct: demand for Claude is outpacing any single delivery model, while many community banks, manufacturers, and regional health systems lack the internal resources to build and run frontier deployments.

[OpenAI](https://openai.com/index/openai-launches-the-deployment-company/) launched a majority-controlled Deployment Company with more than $4 billion of initial investment and agreed to acquire Tomoro, bringing roughly 150 Forward Deployed Engineers and deployment specialists. [AWS](https://www.aboutamazon.com/news/aws/aws-1-billion-forward-deployed-ai-engineers) committed $1 billion to an FDE organization intended to embed thousands of experts with customers. [Microsoft](https://blogs.microsoft.com/blog/2026/07/02/microsoft-frontier-company-ai-engineering-that-amplifies-and-protects-your-intelligence/) committed $2.5 billion and 6,000 industry and engineering experts to its Frontier Company.

Those figures are not accounting equivalents. OpenAI describes initial investment in a new company; AWS and Microsoft describe commitments to their organizations. I use the total as a scale signal, not a line-by-line spending comparison.

These are vendor announcements, so they deserve vendor-level skepticism. They describe strategy and intent, not audited customer outcomes. Still, companies rarely commit this much capital to a bottleneck they do not feel.

Cheaper inference would address an access problem. Embedded engineers address a conversion problem: how intelligence becomes a reliable change in revenue, cost, speed, quality, risk, or decision-making.

Token usage measures how much model capacity entered the system. It does not tell us whether useful work came out.

## FDE Is Human Backpropagation

Palantir has the cleanest explanation of what makes FDE more than on-site engineering. Its [Architecture Center](https://www.palantir.com/docs/foundry/architecture-center/overview) describes Forward Deployed Engineering as the human equivalent of backpropagation. Engineers get close to hard customer problems, work with core engineering teams, synthesize feedback, and ship improvements into the platform.

No model weights are being updated after every customer meeting. The backpropagation is organizational.

A good FDE system closes three loops:

| Loop | Question | What returns |
|---|---|---|
| Customer loop | How does the work actually happen? | Context, constraints, exceptions, user behavior |
| Operating loop | Can the system perform reliably in production? | Evals, incidents, approvals, costs, outcomes |
| Product loop | What should become reusable? | Features, abstractions, methods, guardrails, deployment patterns |

The first loop prevents the team from solving an imaginary problem. The second exposes failures that never appear in a demo. The third determines whether field work compounds or remains one-off custom labor.

This is the deeper reason FDE fits the current AI moment. Model capability is moving quickly, while enterprise workflows move through old systems, permissions, policies, incentives, and human habits. A product team far from the field sees API calls and support tickets. An embedded team sees where the intelligence collides with reality.

The customer site becomes a delivery endpoint and a learning sensor at the same time.

![Customer evidence flowing through operating review into reusable product learning](imgs/web/02-human-backpropagation-v7.webp)

## Why Model Companies Need A People Layer

At first glance, frontier AI companies hiring thousands of service-oriented engineers looks like a retreat from software economics. Software scales because the marginal customer does not require another room full of experts.

That concern is real. It is also why the product loop matters.

The people layer performs several jobs at once. It integrates the model into high-value workflows. It discovers which failures matter in production. It teaches the platform which patterns repeat across customers. It drives usage inside systems that are hard to displace. It also gives the vendor access to transformation budgets that sit far beyond an API bill.

The Anthropic-backed firm's next move makes the point. Seventeen days after the original announcement, it [acquired Fractional AI](https://www.blackstone.com/news/press/the-ai-native-enterprise-services-firm-backed-by-anthropic-blackstone-and-hellman-friedman-announces-acquisition-of-fractional-ai/) as its founding operational centerpiece. Capital and model access were already present. The organization still needed a team that knew how to rebuild real systems around the model.

OpenAI's design makes the learning ambition explicit. Its Deployment Company says engagements should move from a focused diagnostic into production systems connected to customer data, tools, controls, and business processes. Across a broad network of companies, it expects to learn which deployment patterns can generalize.

There is a strategic flywheel here:

```text
better model -> deeper deployment -> better field signal
-> better product pattern -> faster next deployment
```

The scalable version does not keep adding people in proportion to customers. It converts repeated field discoveries into product. If each team keeps solving the same connector, permission, eval, or workflow failure by hand, the organization is delivering projects without learning from them.

The flywheel can create value for both sides. It can also produce conflict. The vendor wants more usage, stronger product learning, and a stickier relationship. The customer wants measurable outcomes, internal capability, and freedom to change models or partners later.

A professional deployment model has to hold both truths at once.

## The Consulting Question Is About What Compounds

Calling FDE "consulting with a better title" is satisfying, but incomplete.

Strong consultants and systems integrators already diagnose workflows, build technology, manage change, navigate regulation, and coordinate transformations. Large enterprises still need those capabilities. Coding skill and proximity to the customer do not create a clean category boundary.

The better distinction is where the learning goes and what remains after the engagement.

AWS offers a useful standard. Its FDE model says customers should leave with deployed systems, knowledge graphs, runbooks, architecture documentation, trained internal champions, and reusable patterns. The engagement is meant to produce customer self-sufficiency as well as a working system.

I would make the test even stricter. Four things should remain:

1. **A production loop:** the system works in the real workflow, including exceptions and fallback paths.
2. **Customer capability:** internal people can operate, inspect, challenge, and extend it.
3. **Product learning:** field discoveries improve the platform or the next deployment instead of dying in a project folder.
4. **Outcome evidence:** the organization can show what changed in cycle time, cost, quality, risk, revenue, or decision speed.

![Four outputs that should remain after a credible AI deployment](imgs/web/03-four-outputs-compound-v7.webp)

When those four outputs compound, FDE becomes a distinct operating model. When they do not, the work is custom services regardless of the job title.

This also explains why FDE is not a replacement for consulting. Deployment crosses engineering, product, governance, security, change management, and operations. The most credible versions combine those disciplines and compress the handoffs between them.

## The Risk Is Hidden Inside Successful Deployment

The closer a vendor gets to a core workflow, the more useful it can become. The same intimacy can deepen dependency.

A critical process may slowly bind itself to one vendor's connectors, prompts, evals, permission model, agent runtime, and assumptions about how work should happen. Switching costs often remain invisible while the deployment is successful. They become obvious when price, model quality, regulation, strategy, or trust changes.

Microsoft's announcement addresses this risk directly through model choice, customer IP protection, governance, observability, and FinOps. Customers should take the concern further. They need ownership of data contracts, evaluation sets, audit history, runbooks, failure modes, and the interface between the workflow and the model.

A good deployment leaves the customer more capable and more informed. It should also leave an escape path.

This is where the difference between activity and capability becomes important. More tokens, more agents, and more automated steps can make a system look mature while reducing the organization's ability to explain or change it.

The right question is not how much AI the company is using. It is how much control and learning the company retains as AI use grows.

## The Career Signal Is Deployment-Native Engineering

I do not think every engineer should become an FDE. We still need people who go deep on models, infrastructure, security, developer tools, distributed systems, and product platforms.

FDE is a signal about another capability that is becoming more valuable: deployment-native engineering.

A deployment-native engineer can enter a messy workflow and find the real constraint. They can separate a task that should be automated from a decision that needs human judgment and a process that should disappear. They can connect models to data, tools, permissions, and business systems. They can design evals, monitoring, approval paths, and recovery. They can work with users without surrendering engineering rigor. Then they can recognize which local lesson deserves to become a reusable product pattern.

This is broader than prompt engineering. Prompting is one interface to intelligence. Deployment-native engineering is the discipline of making intelligence reliable inside a system of work.

It connects to the ownership model I wrote about in [The One-Person Project](/blogs/one-person-project-ai-coding). AI expands an owner's execution radius, which makes boundaries and evidence more important. Enterprise deployment follows the same logic at a larger scale. Someone must own the outcome. The system must respect shared boundaries. Evidence must survive beyond the demo.

Generic code is getting cheaper. Context, judgment, and the ability to close a learning loop are becoming more valuable.

## ACTOR: A Deployment Test

I use ACTOR as a practical way to inspect that loop. Each step should produce a concrete artifact or decision, not another slide.

| Step | Deployment question | What should exist |
|---|---|---|
| **Action** | Which decision, handoff, or task will change? | Workflow boundary, baseline, named owner |
| **Context** | What must the system know, and what may it access? | Source-of-truth map, data contract, permission rules |
| **Trust** | Is the AI drafting, recommending, deciding, or acting? | Autonomy level, approval path, audit trail, fallback |
| **Outcome** | What would prove the work improved? | Evaluation plan, business metric, review cadence |
| **Recursive** | How will this deployment improve itself and the next one? | Feedback loop, runbook, champion, pattern log |

![ACTOR deployment framework with Recursive returning learning to Action](imgs/web/04-actor-deployment-test-v7.webp)

The first four steps can produce a solid deployment. `Recursive` determines whether the capability compounds.

Responsibility is part of it, but ownership by itself can become a static handoff. Recursive asks what the system learns from real use. Did an incident sharpen the eval? Did user behavior reveal a missing permission? Did the team update the runbook? Did a customer-specific workaround become a product feature? Can the next workflow begin with better primitives than this one had?

That is human backpropagation from the customer's side.

ACTOR is also a defense against vendor lock-in and activity reporting. Context makes data boundaries explicit. Trust forces autonomy to be designed. Outcome separates value from usage. Recursive asks who owns the learning and whether it remains portable.

## A Token Is An Input, Not An Outcome

After the 404, I could have fixed one link and moved on. That would have repaired the incident.

Instead, the publishing workflow now validates internal routes before a local article is considered ready. The immediate fix had local value. The workflow change can compound across every article that follows.

![One verified changed action outweighing a long record of model activity](imgs/web/05-input-to-operating-capacity-v7.webp)

That difference is small enough to see clearly in a personal system and expensive enough to reshape enterprise AI.

Anthropic, OpenAI, AWS, and Microsoft are building deployment organizations because model capability alone does not complete the work. They need engineers close enough to production to turn failures into systems and systems into product learning.

A token is a unit of consumption. A changed decision or workflow is a unit of value. A deployment that learns from the result becomes an operating capability.

Before I let model output change the next step, I now ask three questions: what will verify the change, who owns the consequence, and how will the system become better because this run happened?

Enterprise AI begins after those questions have answers.
