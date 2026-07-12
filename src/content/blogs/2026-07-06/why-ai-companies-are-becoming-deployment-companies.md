---
title: "Expensive Tokens Won't Save Enterprise AI"
date: 2026-07-06
slug: why-ai-companies-are-becoming-deployment-companies
category: ai-native-systems
tags: [forward-deployed-engineering, enterprise-ai, ai-deployment, workflow-engineering]
youtube: "https://youtu.be/BhwSZpb6ag8"
draft: true
cover: imgs/web/00-cover-v7-human-backpropagation.webp
---

# Expensive Tokens Won't Save Enterprise AI

*Anthropic, OpenAI, AWS, and Microsoft are spending billions on the same missing layer: engineers who can turn model capability into workflows the customer owns and can keep improving.*

![Human feedback repairing a broken path from model consumption to operating value](imgs/web/00-cover-v7-human-backpropagation.webp)

Forward Deployed Engineering has become one of the clearest signals in enterprise AI. Read the recent announcements from Anthropic, OpenAI, AWS, and Microsoft side by side. All four are moving engineers closer to customers. OpenAI and AWS use the FDE title directly; Anthropic and Microsoft use different labels, but the bet is similar.

Models can already write code, analyze documents, and call tools. The harder problem is building the system around them: data, permissions, approvals, recovery, ownership, and feedback that survive production. FDE sits in that gap. The engineer turns model capability into changed work, then turns what breaks in the field into a better deployment and, ideally, a better product.

::YoutubeEmbed
---
videoId: "BhwSZpb6ag8"
title: "Expensive Tokens Won't Save Enterprise AI"
---
::

## $7.5 Billion Says The Bottleneck Is Deployment

Within 59 days, four AI platforms announced major deployment organizations. [Anthropic](https://www.anthropic.com/news/enterprise-ai-services-company) formed an enterprise AI services company for mid-sized businesses. [OpenAI](https://openai.com/index/openai-launches-the-deployment-company/) launched a majority-controlled Deployment Company with more than $4 billion of initial investment and agreed to acquire Tomoro, adding roughly 150 FDEs and deployment specialists.

[AWS](https://www.aboutamazon.com/news/aws/aws-1-billion-forward-deployed-ai-engineers) committed $1 billion to embed thousands of experts with customers. [Microsoft](https://blogs.microsoft.com/blog/2026/07/02/microsoft-frontier-company-ai-engineering-that-amplifies-and-protects-your-intelligence/) committed $2.5 billion and 6,000 industry and engineering experts to its Frontier Company.

The commitments use different accounting categories, but they point to the same conclusion: the scarce capability is not another model improvement. It is the deployment work that turns data, permissions, integration, and business responsibility into operating results.

Why would software companies spend billions on people? Because the engineers are doing two jobs. They help the customer make the system work, and they show the vendor which problems deserve to become product. If every team keeps solving the same connector, permission, evaluation, or workflow failure by hand, FDE is only expensive services. The model works when repeated field problems become reusable product capability.

## What FDE Actually Does In The Field

Palantir describes FDE as a product development paradigm, not simply an implementation role. Engineers work alongside customers in places such as factory floors and operational centers, then work with core engineering to turn field feedback into product changes. Palantir calls this the [human equivalent of backpropagation](https://www.palantir.com/docs/foundry/architecture-center/overview). The phrase sounds academic. The work is concrete.

Imagine a manufacturer facing a supply disruption. Its supplier data sits in one system, production capacity in another, customer orders in a third, and approval rules in people's heads. The useful question is not, "Where can we add a chatbot?" It is, "When this supplier fails, which orders are exposed, what options do planners have, and who can approve a change?"

An FDE works through that problem with the operators. The team connects the relevant data, defines the business objects that matter, such as plants, production lines, suppliers, and orders, then defines the actions people need to take: update a purchase order, reroute distribution, or run a disruption scenario. Permissions, approvals, and failure paths are part of the build, not paperwork added later.

Then the system meets reality. A planner finds an exception. A data source arrives late. An approval path blocks the wrong user. The FDE can fix the local deployment, but the higher-value move is recognizing which failure will recur elsewhere and carrying that lesson back to the core product.

That is human backpropagation: problem, working system, field failure, product improvement, better next deployment. For technical people, the valuable skill is not customer proximity by itself. It is the ability to translate messy operations into software, preserve engineering rigor under real constraints, and recognize which local lesson should become a reusable product primitive.

![An FDE turning a real operating decision into a governed workflow, then returning field learning to the product](imgs/web/02-fde-field-loop-v8.webp)

## Don't Be Fooled By Five-Minute AI

If someone says a few prompts and five minutes produced a great article, they are hiding the production system that made the result possible. A prompt can start a generation. It cannot maintain a high-quality workflow.

The first version of my blog workflow connected research, outlining, writing, translation, images, audio, video, and publishing. Output became much faster. Quality did not become automatic. Weak evidence, literal translation, repetitive images, broken links, and stale media could still pass through the chain.

The second version required much more participation: rereading, rejecting, challenging claims, comparing visual directions, testing links, and deciding which correction deserved to become a permanent rule. The workflow improved because judgment was written back into it as evidence gates, editorial checks, and validation tools.

This is a small-scale version of the FDE process: stay close to the real workflow, find what general capability misses, and write local corrections back into the system. Enterprise scale changes the risk, but not the working pattern. At least today, AI can execute more of the pipeline than it can responsibly own. Without someone setting the quality bar and maintaining the system, `Recursive` becomes repeated generation rather than self-improvement.

The goal is not permanent manual work. It is to make participation compound, so each decision raises the baseline for the next run. Do not confuse automated generation with automated production, or automated production with a self-improving system.

![A publishing workflow evolving from connected tasks into a reviewed learning system](imgs/web/01-task-passed-workflow-failed-v7.webp)

## Don't Equate FDE With Consulting

Treating FDE as repackaged consulting is too narrow. Strong consultants and systems integrators already diagnose workflows, build technology, manage change, navigate regulation, and coordinate transformation. FDE does not own those capabilities.

The useful distinction is the connection between field work and the product. In a strong FDE model, the team remains close to production and close to core engineering. What it learns from one deployment can change the platform and shorten the next deployment.

![Consulting helps frame and drive the transformation while FDE keeps field problems connected to product engineering](imgs/web/03-fde-role-comparison-v8.webp)

The job title proves nothing. If an engagement ends with custom code, a handoff, and deeper dependence on the vendor, it is custom services. If the customer can operate what was built and field learning improves the product, the FDE model is doing something more interesting.

FDE will not replace consulting; the best enterprise deployments still need engineering, product judgment, security, governance, and change management. Its value is compressing the distance between those disciplines and the software being built.

## The Workflow Must Belong To The Customer

The closer a vendor gets to a core workflow, the more value it can create and the more dependency it can hide. A critical process can slowly bind itself to one vendor's connectors, evaluation system, permission model, agent runtime, and assumptions about work. The system may look successful while the customer's ability to understand or change it gets weaker.

The customer therefore needs to own the durable parts of the workflow: data contracts, evaluation sets, permission rules, audit history, runbooks, failure modes, and the interface between the workflow and the model. Internal people must understand why the system works, where it can fail, and how to replace a model or partner without rebuilding the business process from zero.

A good FDE engagement should leave the customer more capable, not merely more dependent on a capable vendor. The company is paying to build operating capability, not to rent an outcome.

## ACTOR: My Deployment Framework

ACTOR is the framework I use to turn these ideas into execution. It is not a universal theory. It is a way to stop an AI project from being declared successful merely because the model produced something.

| Step | Question |
|---|---|
| **Action** | Which real decision, handoff, or task will change? |
| **Context** | What must the system know, and what is it allowed to access? |
| **Trust** | Is the AI drafting, recommending, deciding, or acting? Who approves and recovers? |
| **Outcome** | What evidence would prove that the work improved? |
| **Recursive** | How will this run improve the workflow and the next run? |

This article provides a real example. **Action** is not "generate text"; it is publishing a bilingual, sourced article whose links and images work. **Context** includes primary research, earlier essays, language rules, and the intended reader. **Trust** allows AI to research, draft, translate, and propose images, while I remain responsible for claims, structure, visual selection, and publication. **Outcome** is not word count or Token use; it is a coherent argument, verified package, and useful reader response.

**Recursive** is what happened during this revision. Reader feedback showed that a second four-part checklist competed with ACTOR. I removed it and added a workflow rule: one serious article gets one primary executable framework. The current article improved, and the next article now starts with a better constraint.

That is how I use ACTOR in practice. Enterprise scale changes the data, risk, and number of owners. It does not change the need to define action, context, trust, outcome, and learning before calling a deployment complete.

![ACTOR deployment framework with Recursive returning learning to Action](imgs/web/04-actor-deployment-test-v7.webp)

## Tokens Are Inputs. Changed Work Is Value.

Token usage measures model consumption. It does not measure whether a decision improved, a workflow became faster, or an organization learned anything. The important output is a changed piece of work that runs reliably, remains under the customer's control, and gets better through use.

![Model consumption entering a customer-owned workflow that produces verified operating value and reusable learning](imgs/web/05-token-to-owned-workflow-v8.webp)

Anthropic, OpenAI, AWS, and Microsoft are building deployment organizations because model capability does not complete the job. They are betting that engineers in the field can close the distance between intelligence and operations. AI will produce another job title soon enough, but the first principle will remain: capability creates value only when it changes real work, survives production, and leaves the organization better able to run the next workflow.

The operating rule is simple: judge AI by the workflow it changes and the capability the customer keeps, not by the Tokens it consumes or the title on the team. The question is not whether FDE wins as a title. It is whether companies can turn expensive Tokens into operating systems they actually own.
