# No Magic: How ChatGPT Actually Works, Explained in One Kitchen

## [HOOK]

People say ChatGPT is magic. It's not. It's a kitchen apprentice named Ming, a wall of 4,192 judgment dials, and one loop — repeated a thousand times. In the next twelve minutes, I'll show you exactly how it works — no formulas, no code, just a kitchen.

---

## [SLIDE: The Omakase Mystery — s01-02-omakase-diner.png]

You walk into an omakase restaurant for the first time.

No menu. The host guides you to a counter seat. The chef nods, and begins.

Dishes arrive one after another — sashimi first, then something warm, then acidic, then rich, then light. Each course feels inevitable. By the time dessert arrives, you realize you never once thought "this doesn't belong here." The whole meal felt designed specifically for you — by someone who understood something you couldn't quite articulate.

Here's the question that lodged in my head after reading a recent post by Andrej Karpathy — OpenAI co-founder, former head of Tesla AI: how does the chef *know*?

Not a senior chef with 20 years of experience. I mean — how does *any* chef learn, from scratch, what order of courses will feel right to a stranger they've never met? No rulebook. No memorized catalog.

[IMAGE: 01-scene-ming-hero.png]

The answer is Ming.

---

## [SLIDE: Meet Ming — 01-scene-ming-hero.png]

Ming is a kitchen apprentice. He has three things.

A wall covered floor-to-ceiling with 4,192 small physical dials. A single wooden counter. And 32,000 complete omakase sets to study.

4,192 is not a rounded number chosen for effect — it's the exact parameter count in Karpathy's 200-line code. Every dial encodes one tiny piece of learned judgment. How much does a rich third course influence what comes fourth? How strongly does a seafood opening push the middle of a meal toward something different? How much does texture contrast matter across a full set?

Four thousand, one hundred and ninety-two tiny opinions. Together, they are his entire culinary intuition.

[IMAGE: s02-02-dials-closeup.png]

He starts with every single dial set to a random position. By the end of training, those dials will encode something close to a master's taste.

This is how ChatGPT works. Not a metaphor. Literally.

---

## [SLIDE: 32,000 Records, No Recipes — 02-infographic-training-data.png]

Here's what Ming doesn't have: recipes.

What he has are 32,000 complete omakase sets, written down in sequence order. "emma" is four courses — e, then m, then m, then a. "sophia" is six. No explanations of why each course follows the last. No descriptions of flavor. Just sequence after sequence after sequence.

Why does sequence matter so much? Because the same four courses — served sashimi first, dessert last — create a completely different experience than those same four courses in reverse. "Dog bites man" and "man bites dog" are the same four words — entirely different meanings.

[IMAGE: s03-02-sequence-pattern.png]

Study enough sequences, and something remarkable happens: intuition starts to form on its own. No one has to explain the rules. The rules emerge.

ChatGPT's version of this portfolio isn't 32,000 names. It's the entire internet — every book, article, conversation, post — trillions of sequences, consumed in order. Same principle. Wildly different scale.

Ming isn't memorizing. He's developing taste.

---

## [SLIDE: Words Into Numbers — 03-infographic-tokenization-pipeline.png]

Before Ming can learn anything, he needs to turn food into numbers.

"emma" gets broken into individual pieces — a service bell at the start, then e, m, m, a, then a closing bell. Each of these pieces is a token — the smallest unit the kitchen works with.

Then each token gets a number. e is 4, m is 12, the service bell is 26. The omakase "emma" becomes: 26, 4, 12, 12, 0, 26.

But numbers alone still aren't enough. A number is just a label — it tells you *which* course, but nothing about its character.

[IMAGE: s04-02-flavor-card-meaning.png]

So each number also comes with a flavor profile card: 16 slots describing properties like richness, temperature, texture, and acidity. At the start of training, every card is essentially random noise. Through training — through running the loop over and over — these cards fill with real meaning.

Every word you type into ChatGPT goes through this same pipeline. Word to token. Token to number. Number to flavor profile. That's how a machine starts to understand language.

---

## [SLIDE: The Three Stations — 04-flowchart-assembly-line.png]

Here's where everything comes together.

At every single moment, Ming faces one question: what should the next course be?

Say the set "emma" is underway. The first three courses have been served. Course number four — another "m" — has just arrived at the kitchen. Ming's job: decide what number five should be.

[IMAGE: s05-02-course-arrives.png]

This course passes through three stations. The answer comes out the other side.

Station one — the Sous Chef Roundtable: the only place that looks backward at everything that came before. Station two — the Back Kitchen: where Ming thinks for himself. Station three — the Final Vote: where all 27 possible next courses get ranked by probability.

That's the entire engine. Three steps. Everything else is detail around these three.

---

## [SLIDE: The Roundtable — 05-scene-sous-chef-roundtable.png]

Station one: the sous chef roundtable.

This is the only station in the kitchen that looks at previous courses. Course number four is placed at the center of the table. Four sous chefs sit around it, each tracking a different quality of the meal so far.

Sous Chef A tracks richness. She consults her notebook: "Course one was light, course two was rich, course three was rich..." Sous Chef B tracks texture: "Three soft courses in a row — time for something with crunch?" Sous Chef C tracks temperature. Sous Chef D tracks acidity.

Each sous chef asks one question: which previous course is most relevant to what I'm tracking right now? The previous courses answer: "here's my profile." Good matches pass their full details forward. Poor matches get skipped.

[IMAGE: s06-02-notebook-memory.png]

One key detail: the sous chefs never re-taste old courses. From the very first dish, they've been writing everything down in notebooks. Each new course adds a page. Nothing ever needs re-reading from scratch. It's the kitchen's memory system — efficient, permanent, always at hand.

The roundtable's job: tell Ming which parts of the past are most relevant to the decision right in front of him.

---

## [SLIDE: The Back Kitchen — 06-flowchart-back-kitchen-method.png]

Station two: the back kitchen.

The sous chefs gave Ming context from the past. Now he has to think for himself.

The back kitchen has a working method. First: open wide. Expand the problem into a much larger mental space — consider every possible direction at once. Then: filter. Anything that clearly doesn't work gets zeroed out entirely. Good options survive. Everything else gets dumped. Finally: compress. The surviving paths converge into one clear conclusion.

Open wide. Filter. Compress.

[IMAGE: s07-02-relu-quality.png]

The roundtable looks outward — what does history tell me? The back kitchen looks inward — what do I actually think? These two stations do fundamentally different kinds of work. Together, they produce a judgment that neither could reach alone.

The result: a refined sense of what course five should be, ready for the final vote.

---

## [SLIDE: The Scorecard — 08-infographic-loss-scorecard.png]

Now the diner scores the meal.

If Ming was a hundred percent confident the next course should be "a" — and it was — perfect. Zero penalty. If he only gave "a" a ten percent chance, and it turned out to be "a"? Big penalty. If he gave it a point-one percent chance? Massive penalty.

This penalty is the Loss. Lower loss means better cooking.

[IMAGE: s08-02-starting-loss.png]

At the very start of training, Ming's loss is 3.3. That's the number you get from pure random guessing when you have 27 options. Eyes closed, dishes placed at random. Complete, total chaos.

The entire training process has one mission: get that number down. Every dial adjustment, every dish, every loop — all of it in service of driving that single number lower. It is the north star.

---

## [SLIDE: Tracing the Problem — 09-flowchart-backpropagation-chain.png]

Here's where it gets genuinely clever.

The score comes back terrible. Ming is staring at a wall of 4,192 dials with no idea where to start. Testing them one by one would take years. So how does he know which dial to adjust?

[IMAGE: s09-02-ming-and-dials.png]

The answer: trace backwards from the plate.

The diner takes a bite: "Too salty."

So Ming follows the chain. That saltiness came from the plating station — but plating didn't add salt. Go back further. The back kitchen added soy sauce. The back kitchen referenced course two's profile from the roundtable. Traced all the way back to Dial 347: soy sauce intensity.

This is backpropagation. Follow the chain of cause and effect backward, all the way from the plate to the dial that was responsible. No guessing. No trial and error. Precise mathematical tracing — multiplication at each step along the path.

---

## [SLIDE: Six Techniques — 10-infographic-six-techniques.png]

How is that tracing possible?

Because the entire kitchen uses only six cooking operations. Every checkpoint, every calculation, every station — one of these six. Combine. Blend. Reduce. Extract. Ferment. Quality Check.

And crucially: each one knows exactly how to reverse itself. Combine knows how to split influence on the way back. Blend knows how two ingredients divided their roles. Quality Check knows which paths to trace and which ones got zeroed out.

[IMAGE: s10-02-chain-rule.png]

The tracing travels along the assembly line and multiplies at each step. Turn dial 347 up by one, and broth saltiness increases by three. Broth up by one, and final taste changes by two. Dial 347's total impact on the final result: three times two equals six.

That's the chain rule — not calculus, just multiplication along a path.

Six operations. There is no seventh. Total transparency in both directions. That's what makes the whole tracing possible at all.

---

## [SLIDE: Adam the Sensei — 11-framework-training-loop-adam.png]

Now the loop begins.

Cook. Score. Trace. Adjust. Cook again. Score again. Trace again. Adjust again.

Every dish, the same cycle. But who handles the dial adjustments? Not Ming alone. During training, a sensei stands beside him — a specialist focused entirely on fine-tuning the dials. His name is Adam.

Adam is smarter than "turn every dial by the same amount." Adam remembers the last several rounds. If five rounds in a row all said "turn down dial 347," round six goes bolder — like a ball rolling downhill, building momentum instead of bouncing back and forth. Adam adjusts sensitive dials gently and stubborn ones aggressively. And as training progresses, Adam's touches get lighter and lighter — bold early, precise near the end.

[IMAGE: s11-02-improvement-arc.png]

After a thousand dishes, Ming's loss drops from 3.3 to 2.37. And here's the part that genuinely moves me: he never memorized a single rule. Nobody told him "don't serve three fried courses in a row." Nobody explained that miso pairs with rice. He just ran the loop — and the dials settled into positions that reflect those patterns on their own.

That's what learning intuition means. Not rules. Repetition.

---

## [SLIDE: Graduation — 12-comparison-temperature-dial.png]

Training's over. Adam steps away. The dials are locked in their final positions.

Real diners are here.

Ming generates his first omakase from scratch — not from a menu, but from the current dial positions. One course informs the next. The second informs the third. The whole meal builds in real time, improvised, but guided by everything that came before.

There's one more dial by the kitchen door — the risk dial. Turn it low, and Ming always picks the statistically safest choice. Predictable, solid, a little boring. Turn it to 0.7 — where ChatGPT lives — and you get creativity that won't go off the rails. Turn it to 1.5, and he might be brilliant, or he might be completely incoherent.

[IMAGE: s12-02-hallucination-names.png]

After training, Karpathy's model generated names like "Karia," "Yeran," and "Liole." These are actual outputs — names that sound real, feel plausible, could belong to a real person. Most probably don't exist anywhere in the training data.

Ming isn't lying. He's following the patterns he absorbed, producing combinations that feel statistically right. He has no fact-checking station. When ChatGPT confidently cites a paper that doesn't exist, or invents a specific date — this is exactly what's happening. Statistical taste without reality-checking.

---

## [SLIDE: Street Cart to Michelin Star — 13-comparison-scale-ming-vs-chatgpt.png]

Now put Ming's kitchen next to ChatGPT's.

Ming: 4,192 dials. 32,000 records. One MacBook. One minute of training.

ChatGPT: hundreds of billions of dials. Trillions of sequences. Thousands of GPUs running in parallel. Months of training.

[IMAGE: s13-02-identical-loop.png]

Same six operations. Same three stations. Same cook, score, trace, adjust loop. Same Adam. The cooking principles — identical.

Just wildly different scale.

ChatGPT also went through two additional stages — learning from human feedback to become genuinely helpful and aligned with what people actually want. But through all of it, the core never changed. The loop never changed. Same kitchen. A different universe of scale.

---

## [SLIDE: No Magic — thumbnail.png]

Next time someone tells you AI is mysterious, or magical, or about to replace humanity — remember Ming.

One apprentice. A wall of judgment dials. 32,000 sequences to study. No rules given. Just cook, score, trace, adjust. Do it enough times — and the dials settle. Intuition forms. Taste develops.

[IMAGE: s14-02-200-lines.png]

This isn't intelligence in the way we usually mean the word. It's statistical intuition so refined that it becomes indistinguishable from taste.

But here's what genuinely fills me with awe: such a simple mechanism — six operations, three steps, one loop — produces something that can hold a conversation, explain a concept, write a story, and feel present in the exchange.

Two hundred lines of code. Six techniques. One kitchen.

That's all of ChatGPT.

No magic. Just Ming.
