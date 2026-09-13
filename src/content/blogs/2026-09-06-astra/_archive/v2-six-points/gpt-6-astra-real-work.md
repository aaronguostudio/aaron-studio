---
title: "I Put GPT-6 Astra to Work"
date: 2026-09-06
slug: gpt-6-astra-real-work
category: ai-native-systems
tags: [GPT-6-Astra, Codex, AI-workflows, real-work]
description: "Six observations from using GPT-6 Astra for a complex Azure, Linux and Windows deployment, everyday writing, and the work between tools."
draft: true
---

# I Put GPT-6 Astra to Work

Since GPT-6 Astra launched, I've seen plenty of games, 3D scenes and Blender demonstrations. They make you stop scrolling. An idea turns into something you can explore, and the progress is immediately visible.

I've been using it for a different kind of work: a deployment involving Azure, Linux, Windows and database connections, alongside my everyday writing. These jobs are harder to turn into a spectacular thirty-second clip. They still determine whether my projects move forward.

My reaction is straightforward: **I'm becoming comfortable giving Astra a larger piece of the job.** During deployment, it kept working through the problems. In writing, the prose has felt more fluid and natural. The improvement is showing up in ordinary work, where I have a result I actually need.

Here are six things that stand out, drawing on that experience, the documentation and early firsthand reports.

## 1. It handles the messy deployment

The background matters. A business application ran on Linux, but the reporting engine it needed required Windows. I wanted to connect them: request a report, read the relevant database, generate a PDF on a Windows service, and return it to the business system. This was an addition to an existing application, with connections, permissions and workflows that already had to keep working.

That involved much more than writing a worker. There were Azure resources to provision, private networking and access rules to configure, a new subnet to attach to an existing NAT Gateway, a Windows service to install, and SQL certificate trust to sort out. Astra carried the configuration, troubleshooting and testing forward within the scope I authorized. I still decided the environment and approved changes that could affect services. I didn't have to move into every tool and personally perform every deployment step.

There were real obstacles. Azure rejected an early network rule. Database connectivity led to certificate validation work. Later, a generated report failed at the attachment step, which needed another investigation and read-back and retry checks. The reporting chain ultimately worked in Dev, including real PDFs and attachment validation. **The useful change was being able to delegate code, infrastructure, networking and verification as parts of one job.** For someone building a product, that is a substantial expansion of what AI can help carry.

## 2. It connects the tools

The visual demos are worth studying for the same reason. What tools did the model use, and what happened to the intermediate output? OpenAI shows a Blender house model, an Unreal scene and an interactive racing game. A separate demonstration compares clinic locations and routes in Google Maps. The two screenshots below document those official showcases; they aren't my reproductions. [Official demonstrations](https://openai.com/index/gpt-6-astra/)

![A house model in Blender from OpenAI's Astra showcase](./imgs/evidence/openai-blender.png)

*The house inside the Blender workspace. Source: OpenAI's Astra launch page, Blender model showcase.*

![Google Maps route comparison in OpenAI's pediatrician-search demonstration](./imgs/evidence/openai-google-maps.png)

*Locations and driving routes within the demonstrated workflow. Source: OpenAI, Pediatrician search.*

Firsthand reports add useful texture. Matt Shumer describes browser work on his newsletter, inboxes and advertising interfaces. A developer building a flight game reports using Godot and Blender, with the model assembling assets and gameplay through several rounds of feedback. These jobs combine software, code and tool connections. Calling all of it better mouse-clicking misses much of the work. [Shumer's account](https://somethingbig.ai/astra-review), [the game developer's post](https://www.reddit.com/r/SideProject/comments/1w97zrd/everyone_was_sharing_stuff_made_with_gpt_6_astra/)

That integration is what interests me: research something, then work in the relevant application; create a file, then inspect it; build a page, then verify it in the browser. **The switch between tools is often where a delegated task comes back to the person.** Handling more of those handoffs could make computer use valuable in many ordinary jobs. The actual reach still depends on the tools and access available in the product you use.

## 3. Long jobs can keep their history

One feature deserves a clear explanation: Codex's experimental context management. It uses notes and searchable history to preserve details. When a long job exceeds what fits in the current context, the agent has a way to recover earlier information. The configuration reference currently lists it as off by default. [Configuration reference](https://learn.chatgpt.com/docs/config-file/config-reference)

Imagine a refactor of an older application. Early on, you discover that a dependency cannot be upgraded, and a proposed migration breaks compatibility. Several hours later, the work reaches another module. Useful memory would include why that approach was rejected and what the tests showed. Recovering that evidence gives the agent a chance to avoid repeating the same detour.

This is an illustrative example of the documented capability. I care about it because deployments, refactors and research all accumulate small discoveries that inform later decisions. Reconstructing the background every few hours makes sustained work difficult. A system that can retrieve those details offers a more promising way to continue: **the context you invested in at the beginning can remain useful later in the job.**

## 4. Take initiative. Accept direction.

I want AI to advance the work, and I want to change its direction along the way. If I add “keep this in the test environment for now” during a deployment, that condition should shape what happens next. Greater autonomy makes this kind of understanding more important. Initiative is useful when my input still changes the work.

My view is that **a model upgrade is a good time to review the old skills.** OpenAI explicitly recommends auditing skills and files such as `AGENTS.md`: Astra is sensitive to their instructions, and ambiguous or conflicting rules can cause premature pauses. Some detailed procedures written to compensate for an earlier model may now get in the way. [Official model guidance](https://developers.openai.com/api/docs/guides/latest-model#prompting-best-practices)

I would replace “ask me after every step” with the goal, acceptance criteria, room for independent action, and the decisions that actually need me. Preparing a draft or running relevant checks can continue within an authorized task. Changing the deployment environment or expanding scope needs a clear decision. One developer reported Astra proposing extra infrastructure and starting implementation too soon. That is a useful counterexample: autonomy depends on understanding scope. Reviewing the instructions can improve the arrangement without excusing the model's mistakes. [Original developer report](https://www.reddit.com/r/OpenAI/comments/1w7qxdr/astra_gpt6_high_intelligence_low_intuition/)

## 5. The writing feels more natural

Writing is another place where I've felt the difference. Recent drafts flow more easily. Sentences connect, ideas have room to develop, and I find it easier to follow the thought through a paragraph. That is difficult to show on a benchmark chart, but it is immediately relevant when you write regularly.

My starting material is usually uneven: facts, project experiences, half-formed judgments. I want help turning those into something another person will want to read. A concrete experience should lead naturally into an observation; the next paragraph should pick up the question the previous one raised. When that movement works, I can concentrate on what I mean to say.

The point I want to emphasize is the reading experience: **I like the prose we're producing together more.** That is my experience within an established workflow, where the model, context and accumulated writing preferences all contribute. I still specify the reader, tone and expressions that don't sound like me. The official guidance also recommends stating the style and structure you want. Those choices help the model produce writing that fits the piece. [Writing guidance](https://developers.openai.com/api/docs/guides/latest-model#personality-and-writing-style)

## 6. Count the whole cost

A good experience doesn't make Astra the right choice for every task. The flight-game developer reported about three hours of work and 45% of a Pro plan's weekly allowance. Those are figures from one person's run, not a forecast for everyone, but they put a cost next to an impressive result. Another user reported exhausting an allowance before the task finished. [Game developer's account](https://www.reddit.com/r/SideProject/comments/1w97zrd/everyone_was_sharing_stuff_made_with_gpt_6_astra/), [quota report](https://www.reddit.com/r/codex/comments/1w7kvf7/gpt6_astra_wow/)

As of September 6, standard API pricing is $10 per million input tokens and $50 per million output tokens, with separate cache and long-context terms. Subscription allowances operate differently; those API rates don't translate directly into a number of chat messages. [Model reference and pricing](https://developers.openai.com/api/docs/models/gpt-6-astra)

I would make the decision by task. A lighter model may be enough for a sentence edit or a simple question. Work spanning several systems, with troubleshooting and verification, gives me more reason to use the stronger model. The comparison includes model cost, my time, and the result we reach. My deployment experience makes Astra worth continuing to use for complex work. I haven't measured a percentage improvement, and I don't need to invent one to explain why I'm encouraged.

Next time I take on a complex deployment, I'll start with the outcome and the relevant checks, give Astra the existing system and tools, and let it carry the authorized work forward. I'll stay involved in the decisions that change scope or affect services. The value arrives when the deployment works, the file is usable, or the article expresses what I meant.

I'll keep watching the games and 3D demonstrations. I'll also keep putting Astra into my own projects. **The result that interests me most is an ordinary, unfinished job moving forward across several tools without needing me to carry every step.**

*Research checked September 6, 2026. Personal experience, firsthand public reports and official demonstrations are distinguished throughout; these cases are not a controlled model comparison.*
