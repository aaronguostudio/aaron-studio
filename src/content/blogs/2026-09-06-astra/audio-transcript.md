# Audio Transcript: GPT-6 Astra in Real Work: 6 Things That Changed

Provider: elevenlabs
Voice profile: aaron-pvc-identity-v1
Voice ID: R2DWp7zZuWmGxk3r8GIA
Model: eleven_multilingual_v2
Output format: mp3_44100_192
Stability: 0.5
Similarity boost: 0.75
Style: 0.5
Speaker boost: true
Speed: 1

## Hook

You've probably seen Astra build games and beautiful 3D scenes. I've been using it on something harder to show in a short clip: a deployment across Azure, Linux, Windows, and a database. It involved networking, certificates, and real problems along the way. That experience changed how much of a job I'm willing to give AI.

## Astra in real work

I've also been using it for everyday writing, where the prose has felt more natural. So I looked at my experience alongside the documentation and early public reports. Six things stand out. The question connecting them is simple: what happens when Astra has an actual job to carry, inside the systems and tools we already use?

## 1. Complex deployment

First, complex deployment. The business application ran on Linux. The reporting engine needed Windows. I wanted a request to travel from the application to a Windows service, produce a PDF using the database, and return it to the business system. Existing connections and workflows still had to work. That was the real job behind the words, Windows Worker.

## Across the environment

The work included Azure resources, private networking, a new subnet attached to an existing NAT Gateway, Windows service installation, and SQL certificate trust. Astra advanced those steps within my authorization. I decided the scope and approved changes that could affect services. But I wasn't switching into every tool to perform the implementation myself. That made the experience feel very different.

## Follow the problem through

Azure rejected an early network rule. Database connectivity brought certificate checks. Later, the PDF existed, but saving the attachment failed. The work continued through diagnosis, read-back, and retry checks, until the chain worked in Dev. What impressed me was connecting infrastructure, code, troubleshooting, and verification inside one task. The value was in carrying those pieces together.

## 2. Connect the tools

Second, the tools are becoming more connected. OpenAI's showcases include a Blender house model, an Unreal scene, and a racing game. Another compares clinic routes in Google Maps. These are official demonstrations, not my reproductions. I look at them for the handoffs: a result in one place becoming the input to the next step.

## Ordinary work, more reach

Matt Shumer describes browser work on newsletters, inboxes, and advertising interfaces. A flight-game developer reports using Godot and Blender, with feedback along the way. The useful combination includes code, applications, and tool connections. Research, create, inspect, continue. Each handoff the agent handles is one less point where I have to take the task back. Access and available tools still matter.

## 3. Keep the history

Third, long tasks. Codex documents experimental context management with notes and searchable history. It is currently off by default. The idea is straightforward: when a job grows beyond the current context, earlier details remain retrievable. Imagine a refactor where a dependency cannot be upgraded. Hours later, the reason for that decision still matters.

## Earlier evidence stays useful

In that example, a useful record includes the migration that failed and what the tests revealed. Recovering it could prevent another trip down the same dead end. This is an illustration of the documented feature. It matters because long jobs accumulate discoveries. I want the context invested early in a task to keep helping as the work moves on.

## 4. Initiative and direction

Fourth, initiative has to work with direction. I want the model to keep going, while understanding a condition I add along the way. If I say, keep this in the test environment, that changes the next steps. My view is that upgrading the model is also a good time to review our old skills.

## Review the old rules

OpenAI recommends auditing skills and instruction files. Ambiguous or conflicting rules can make Astra stop too early. I would replace ask me after every step with a clear goal, acceptance criteria, and meaningful decision points. Scope still matters: one developer reported unwanted infrastructure and premature implementation. Better instructions help, but the model remains responsible for understanding the job.

## 5. Natural writing

Fifth, the writing feels more natural. Recent drafts connect ideas more easily, and the prose is more pleasant to read. I often begin with scattered thoughts, project experiences, and a point I'm still finding. When those become a coherent article, I can focus on what I mean to say. That's the improvement I feel in my writing workflow.

## Let the thought carry the prose

A concrete experience leads into an observation. The next paragraph picks up the question it leaves behind. I like the writing we're producing together more. This is my experience, with our existing context and preferences contributing too. I still tell it who the reader is and what tone I want. Those choices help the expression fit the piece.

## 6. Count the whole cost

Sixth, cost. The flight-game developer reported about three hours and forty-five percent of a Pro plan's weekly allowance. Other users describe running out before finishing. Those are individual reports, but they make the tradeoff visible. I would use a lighter model for a small edit, and consider Astra when the work spans systems, troubleshooting, and verification.

## More trust, new questions

These experiences change what I'm willing to delegate. I feel more confident giving Astra long, complex tasks across products and systems, within a clear goal and scope. Greater autonomy brings new questions: how do I verify the result and trace the important decisions? Verification and auditing need more attention. So does the higher price. I'm honestly tempted to pay for another high-allowance subscription. Seeing useful work get done makes me want more room to use it.

## Still finding ways to surprise me

Those questions haven't taken away my excitement. I want the work I still have to watch closely to become work I can trust it with. AI is still finding ways to surprise me. I'm looking forward to it getting better, and to feeling those improvements in real work.
