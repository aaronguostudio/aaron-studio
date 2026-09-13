# GPT-6 Astra in Real Work: 6 Things That Changed

## [HOOK]

You've probably seen Astra build games and beautiful 3D scenes. I've been using it on something harder to show in a short clip: a deployment across Azure, Linux, Windows, and a database. It involved networking, certificates, and real problems along the way. That experience changed how much of a job I'm willing to give AI.

## [SLIDE: Astra in real work — astra-real-work.png]

I've also been using it for everyday writing, where the prose has felt more natural. So I looked at my experience alongside the documentation and early public reports. Six things stand out. The question connecting them is simple: what happens when Astra has an actual job to carry, inside the systems and tools we already use?

## [SLIDE: 1. Complex deployment — deployment-context.png]

First, complex deployment. The business application ran on Linux. The reporting engine needed Windows. I wanted a request to travel from the application to a Windows service, produce a PDF using the database, and return it to the business system. Existing connections and workflows still had to work. That was the real job behind the words, Windows Worker.

## [SLIDE: Across the environment — deployment-chain.png]

The work included Azure resources, private networking, a new subnet attached to an existing NAT Gateway, Windows service installation, and SQL certificate trust. Astra advanced those steps within my authorization. I decided the scope and approved changes that could affect services. But I wasn't switching into every tool to perform the implementation myself. That made the experience feel very different.

## [SLIDE: Follow the problem through — deployment-validation.png]

Azure rejected an early network rule. Database connectivity brought certificate checks. Later, the PDF existed, but saving the attachment failed. The work continued through diagnosis, read-back, and retry checks, until the chain worked in Dev. What impressed me was connecting infrastructure, code, troubleshooting, and verification inside one task. The value was in carrying those pieces together.

## [SLIDE: 2. Connect the tools — tool-handoffs.png]

Second, the tools are becoming more connected. OpenAI's showcases include a Blender house model, an Unreal scene, and a racing game. Another compares clinic routes in Google Maps. These are official demonstrations, not my reproductions. I look at them for the handoffs: a result in one place becoming the input to the next step.

## [SLIDE: Ordinary work, more reach — browser-work.png]

Matt Shumer describes browser work on newsletters, inboxes, and advertising interfaces. A flight-game developer reports using Godot and Blender, with feedback along the way. The useful combination includes code, applications, and tool connections. Research, create, inspect, continue. Each handoff the agent handles is one less point where I have to take the task back. Access and available tools still matter.

## [SLIDE: 3. Keep the history — context-notes.png]

Third, long tasks. Codex documents experimental context management with notes and searchable history. It is currently off by default. The idea is straightforward: when a job grows beyond the current context, earlier details remain retrievable. Imagine a refactor where a dependency cannot be upgraded. Hours later, the reason for that decision still matters.

## [SLIDE: Earlier evidence stays useful — context-example.png]

In that example, a useful record includes the migration that failed and what the tests revealed. Recovering it could prevent another trip down the same dead end. This is an illustration of the documented feature. It matters because long jobs accumulate discoveries. I want the context invested early in a task to keep helping as the work moves on.

## [SLIDE: 4. Initiative and direction — steering.png]

Fourth, initiative has to work with direction. I want the model to keep going, while understanding a condition I add along the way. If I say, keep this in the test environment, that changes the next steps. My view is that upgrading the model is also a good time to review our old skills.

## [SLIDE: Review the old rules — skills-review.png]

OpenAI recommends auditing skills and instruction files. Ambiguous or conflicting rules can make Astra stop too early. I would replace ask me after every step with a clear goal, acceptance criteria, and meaningful decision points. Scope still matters: one developer reported unwanted infrastructure and premature implementation. Better instructions help, but the model remains responsible for understanding the job.

## [SLIDE: 5. Natural writing — writing-flow.png]

Fifth, the writing feels more natural. Recent drafts connect ideas more easily, and the prose is more pleasant to read. I often begin with scattered thoughts, project experiences, and a point I'm still finding. When those become a coherent article, I can focus on what I mean to say. That's the improvement I feel in my writing workflow.

## [SLIDE: Let the thought carry the prose — paragraph-flow.png]

A concrete experience leads into an observation. The next paragraph picks up the question it leaves behind. I like the writing we're producing together more. This is my experience, with our existing context and preferences contributing too. I still tell it who the reader is and what tone I want. Those choices help the expression fit the piece.

## [SLIDE: 6. Count the whole cost — task-cost.png]

Sixth, cost. The flight-game developer reported about three hours and forty-five percent of a Pro plan's weekly allowance. Other users describe running out before finishing. Those are individual reports, but they make the tradeoff visible. I would use a lighter model for a small edit, and consider Astra when the work spans systems, troubleshooting, and verification.

## [SLIDE: Put it into the next job — real-work-ending.png]

I want to count the model cost, my time, and what actually gets finished. My deployment experience makes me keen to keep using Astra for complex work. I'll keep watching the impressive demos, too. But the result that matters most to me is an ordinary job moving forward, across several tools, without needing me to carry every step.
