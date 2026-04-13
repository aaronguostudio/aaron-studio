# No Magic: How ChatGPT Actually Works, Explained in One Kitchen

*Inspired by Andrej Karpathy's [MicroGPT](https://karpathy.github.io/2026/02/12/microgpt/) — 200 lines of code that prove it's all just a kitchen.*

---

You walk into an omakase restaurant for the first time.

The host guides you to a counter seat. There's no menu. The chef nods and begins.

Dishes arrive one after another — sashimi first, then something warm, then something acidic, then rich, then light. Each course feels inevitable. By the time dessert arrives, you realize you never once thought "this doesn't belong here." The whole meal felt like it was designed specifically for you, by someone who understood something you couldn't quite articulate.

Here's the question that lodged in my head after reading a recent post by Andrej Karpathy (OpenAI co-founder, former Tesla AI director): how does the chef *know*?

Not the senior chef with 20 years of experience. I mean — how does *any* chef learn, from scratch, what order of courses will feel right to a stranger they've never met? No one handed them a rulebook. They didn't memorize every possible omakase sequence.

The answer is Ming.

![Ming stands at the omakase counter facing a wall of 4,192 judgment dials](illustrations/01-scene-ming-hero.png)

---

Meet Ming: a kitchen apprentice with a wall of 4,192 dials and 32,000 omakase records. (4,192 is not a rounded number chosen for effect — it's the exact parameter count in Karpathy's 200-line code.)

The 32,000 records are the master's complete portfolio — every omakase set ever designed, every course written down in order. Ming has studied all of them.

The 4,192 dials are something different. They're in Ming's head. Each dial encodes one tiny piece of his learned judgment: *"How much should a rich third course influence what comes fourth? How strongly does a seafood-heavy opening push me toward something different mid-meal? How much does texture contrast matter across a full set?"*

4,192 tiny opinions. Together, they are his entire culinary intuition.

In this kitchen, Ming is the sole decision-maker — every judgment about what the next course should be is his. You'll meet two other characters along the way. Brief introductions: the **sous chefs** aren't separate people — they're Ming's thinking assistants, offering input but never making the final call. **Adam** is a training sensei who handles all the dial adjustments during practice, then steps away once real service begins. When diners sit down, it's just Ming.

He starts knowing nothing. Every dial is set to a random position. By the end of training, those dials will encode something close to a master's taste.

This is how ChatGPT works. Not a metaphor. Literally.

Andrej Karpathy proved it in 200 lines of code. Today I'll walk you through the kitchen.

---

## Chapter 1: The Ingredients — 32,000 Omakase Records

Ming has the master's portfolio: 32,000 complete omakase sets, every course written down in sequence.

"emma" is a 4-course set: e → m → m → a. "sophia" is a 6-course set: s → o → p → h → i → a. Ming can see what was served, and in what order. No recipes. No explanations. Just the sequence.

His goal: after studying enough sets, design *new* omakase that make diners say "this feels right."

One thing worth noting: in this simplified kitchen, the menu has only 27 items, each labeled with a letter code. "e" isn't "eel nigiri" — it's just Course #5 in a 27-item repertoire. The codes don't carry meaning on their own. What matters is purely the *sequence*: which code follows which, and what patterns emerge across thousands of sets.

**Why does sequence matter so much?** Because the same four courses — served as sashimi → grilled → soup → dessert — create a completely different experience than the same four courses in a different order. The omakase "emma" and the sequence "amme" are entirely different experiences, even though they contain the same ingredients. In language, "dog bites man" and "man bites dog" are the same four words, entirely different meanings.

**The extension:** ChatGPT's portfolio isn't 32,000 names. It's the entire internet — every book, article, conversation, and post ever written. Trillions of "omakase sets," all consumed in sequence.

The key feeling: Ming doesn't memorize every sequence he's seen. He develops *intuition* — a feel for what tends to follow what, which combinations feel "right," which feel off. There's no rulebook. Just pattern, absorbed until it becomes instinct.

![32,000 omakase records as scrolls — one unrolled showing the sequence e→m→m→a. A callout shows ChatGPT's trillions of sequences.](illustrations/02-infographic-training-data.png)

> *Ming isn't memorizing. He's developing taste.*

---

## Chapter 2: Breaking It Down — One Course at a Time

A full omakase is too complex to learn all at once. The first step is to break it into individual courses.

"emma" becomes: [🛎️, e, m, m, a, 🛎️]

That service bell 🛎️ marks the start and end of every set. Each individual course is a **token** — the smallest unit of meaning the kitchen works with.

But here's the thing: Ming's kitchen doesn't understand names. It only understands numbers. So every course gets a number:

a = 0, b = 1, c = 2 ... z = 25, 🛎️ = 26

The omakase "emma" becomes: [26, 4, 12, 12, 0, 26]

Numbers alone still aren't enough. A number is just a label — it tells you *which* course, but nothing about its *character*. So each number also comes with a **flavor profile card**: 16 numbers describing properties like richness, temperature, texture, and acidity. These profiles start completely random. Through training, they become meaningful.

![Tokenization pipeline: "emma" → tokens with service bells → numbers 26,4,12,12,0,26 → flavor profile card with 16 slots](illustrations/03-infographic-tokenization-pipeline.png)

For ChatGPT, the numbering is smarter — common word combinations get a single number instead of being spelled out letter by letter. "hello" is one dish — a single course code — not five letters served separately. More efficient, more expressive. About 100,000 possible "courses" instead of 27.

> *Every word you type becomes a number. Every number carries a flavor profile. That's how a machine starts to understand language.*

---

## Chapter 3: The Kitchen Assembly Line — What Course Comes Next?

Here's where everything comes together. Ming's task at every moment is to answer one question: **what should the next course be?**

Say the set "emma" is underway. The first three courses (e, m, m) have been served. Course #4 — another "m" — has just arrived at the kitchen. Ming's job: decide what #5 should be.

This course passes through three key stations. The answer comes out the other side.

```
Course #4 "m" arrives
        ↓
[1] Look backward — Sous Chef Roundtable  ← the only place you look back
        ↓
[2] Think it through — Back Kitchen
        ↓
[3] Place your bet — Final Vote
        ↓
Probability ranking of all 27 possible next courses
```

![The three-station kitchen assembly line: Sous Chef Roundtable → Back Kitchen → Final Vote, with 27 possible next courses as output](illustrations/04-flowchart-assembly-line.png)

Three steps. Between each one, two backstage actions happen quietly. Let's understand the three steps first, then the two supporting roles.

---

### Step 1: Look Backward — The Sous Chef Roundtable

This is the only station in the kitchen that looks at previous courses.

Course #4 "m" is placed at the center of the table. Four sous chefs sit around it, each tracking a different quality of the meal so far:

- Sous Chef A tracks richness, consulting her notebook: "Course 1 was light, course 2 was rich, course 3 was rich..."
- Sous Chef B tracks texture: "Three soft courses in a row — time for something with crunch?"
- Sous Chef C tracks temperature. Sous Chef D tracks acidity.

Each sous chef asks: *"Which previous course is most relevant to what I'm tracking right now?"* The previous three courses respond in turn: *"Here's my profile."* Good matches pass their full details forward. Poor matches get skipped.

All four combine their findings and pass them to the next station.

One detail worth noting: the sous chefs don't re-taste old courses. From the very first course, they've been writing everything down in notebooks. Each new course adds a page — this is the kitchen's memory system, and nothing ever needs to be re-read from scratch.

![Top-down view of the sous chef roundtable: four sous chefs (A=Richness, B=Texture, C=Temperature, D=Acidity) around the central dish "Course #4: m"](illustrations/05-scene-sous-chef-roundtable.png)

> *The roundtable does one thing: tell Ming which parts of the past are most relevant to the decision at hand.*

---

### Step 2: Think It Through — The Back Kitchen

The sous chefs have done their part. Now Ming thinks for himself.

The back kitchen has a working method: it first opens the problem completely — entertaining every possible direction at once in a much larger mental space. Then it filters: anything that clearly doesn't work gets zeroed out. Finally, it compresses back down into a clear conclusion.

Open wide, filter, compress. The result is a refined judgment about what course #5 should be.

![Back kitchen method: Open Wide (fan of arrows) → Filter (crossed-out paths) → Compress (converging single arrow)](illustrations/06-flowchart-back-kitchen-method.png)

> *The roundtable looks outward: what does the past tell me? The back kitchen looks inward: what do I actually think?*

---

### Step 3: Place Your Bet — The Final Vote

Back kitchen done. Ming scores all 27 possible next courses:

*"70% chance course #5 should be 'a'. 15% it's 'e'. 8% it's 'i'..."*

Raw scores get converted into clean percentages that sum to 100%. Not a certain answer — a confident bet.

> *Ming doesn't know the answer. He makes a bet. The whole magic is in how he gets better at betting.*

---

### Two Supporting Roles

Two other actions happen throughout the process — not the main story, but the kitchen breaks without them.

**Palate Cleanser (before each main station):** Before entering the roundtable or the back kitchen, the palate gets reset. This ensures a consistent baseline for each judgment. Taste something intensely spicy, then immediately evaluate something delicate — your perception is off. The cleanser means every judgment starts from the same neutral point.

**Spoonful of the Original (after each main station):** After the roundtable, and after the back kitchen, one action happens: the course's original profile gets mixed back in. Like making a reduction — always keep a pot of the original stock nearby, add some back after each step. This prevents the course from losing itself through layer after layer of processing.

In Ming's kitchen (MicroGPT), these three steps run once per course — a single pass. In ChatGPT's kitchen, the same three steps are stacked dozens of times: the output of one full pass becomes the input of the next. Same sous chefs, same back kitchen — but each round reaches a deeper level of understanding.

![Two supporting roles: Palate Cleanser (reset to neutral before each station) and Spoonful of Original (mix back in after each station)](illustrations/07-infographic-supporting-roles.png)

---

## Chapter 4: The Diner's Scorecard — How Bad Did You Do?

Ming designs an omakase. The diner scores each course transition.

- If Ming was 100% confident the next course should be "a" — and it was — perfect score, zero penalty.
- If he only gave "a" a 10% chance — big penalty.
- If he gave it a 0.1% chance — massive penalty.

This penalty is the **Loss**. Lower loss = better cooking.

Starting loss: 3.3. That's what pure random guessing looks like when you have 27 options. A complete kitchen novice, eyes closed, putting dishes down at random.

![The Diner's Scorecard: three confidence levels with penalties, and the loss curve dropping from 3.3 to 2.37 over 1,000 dishes](illustrations/08-infographic-loss-scorecard.png)

The entire training process has one mission: **get that number down.**

> *Every decision Ming makes can be judged with a single number. That number is the north star.*

---

## Chapter 5: Tracing the Problem — Who Made It Too Salty?

This is the core of everything — the part that makes the whole system actually intelligent.

The score comes back: "Terrible." Ming is staring at a wall of 4,192 dials with no idea where to start. Test them one by one? That would take years.

But there's something smarter: **trace backwards from the plate.**

The diner takes a bite: "Too salty."

### From Plate to Kitchen

"This bite is too salty → last step was plating (no salt added there) → step before was the back kitchen (added soy sauce) → step before was the roundtable (referenced course 2's profile) → traced back to dial #347 (soy sauce intensity)."

This is **backpropagation** — following the chain of cause and effect backward from the result to the source.

![Backpropagation chain: "Too Salty!" traced backwards through Plating → Back Kitchen → Roundtable → Dial #347 "soy sauce intensity"](illustrations/09-flowchart-backpropagation-chain.png)

### The Relay (Chain Rule)

Each station knows one simple thing: *"If my input changes by a tiny amount, how much does my output change?"*

- Turn dial #347 up by 1 → broth saltiness increases by 3
- Broth saltiness up by 1 → final taste changes by 2
- Dial #347's total impact on final taste = 3 × 2 = **6**

Walk along the assembly line and multiply at each step. That's the chain rule — no calculus required, just multiplication along a path.

### Six Basic Techniques

The entire kitchen uses only six cooking operations. Every checkpoint, every station, every calculation reduces to one of these six. And crucially — each one knows exactly how to trace backwards through itself. That's what makes it possible to walk from the plate all the way back to dial #347.

| Technique | What It Does |
|-----------|-------------|
| **Combine** (addition) | Pour two things together |
| **Blend** (multiplication) | Two ingredients amplify each other |
| **Reduce** (power) | Concentrate the flavor |
| **Extract** (log) | A little goes a long way |
| **Ferment** (exp) | Exponential growth |
| **Quality Check** (ReLU) | Good flavors pass, bad ones get dumped |

ChatGPT's entire kitchen uses only these six. There is no seventh.

![Six kitchen techniques in a 2×3 grid: Combine, Blend, Reduce, Extract, Ferment, Quality Check — each as a hand-drawn cooking icon](illustrations/10-infographic-six-techniques.png)

### A Concrete Example

Ming makes a simple two-step dish:
- Ingredients: 2 parts salt, 3 parts sugar
- Step 1: **Blend** → salt-sugar base = 6
- Step 2: **Combine** → final taste = base + extra pinch of salt = 8

Diner says the taste is off. Trace back:
- Final taste = base + salt → Combine → base's impact = 1, salt's impact = 1
- Base = salt × sugar → Blend → salt's impact here = sugar's value = 3

Salt appeared at two steps. Total impact = 3 + 1 = **4**. Sugar appeared once: impact = 2.

Now Ming knows: salt influences the outcome twice as much as sugar. That's what **gradient = 4** means. Adjust salt carefully. Be bolder with sugar.

> *Ming doesn't guess which dial to turn. He calculates exactly how much each one matters.*

---

## Chapter 6: The Master's Training Method — 1,000 Dishes

Ming drills. Every dish, the same three steps:

1. **Cook (forward pass)** — run the current dish through the assembly line with current dial positions
2. **Trace (backward pass)** — after the diner scores it, trace from plate back through every checkpoint to find each dial's impact number
3. **Adjust (update)** — based on each dial's impact number, nudge it in the direction that reduces the penalty

The first two steps have clear rules to follow. The third is where it gets genuinely hard: 4,192 dials — how do you adjust them? Same amount for each? Which ones need a light touch, which ones can take more? Bold moves early, or cautious moves throughout?

Ming can't figure this out alone. So during training, a sensei stands beside him — a specialist focused entirely on fine-tuning the dials. His name is Adam.

### Adam the Sensei

Not every dial gets the same treatment. Adam is smarter than "turn everything by the same amount."

**Memory (Momentum):** Adam remembers the last several rounds. If the last five rounds all said "turn down dial #347," round six goes bolder. Like a ball rolling downhill — it builds momentum instead of bouncing back and forth.

**Personalized touch (Adaptive Learning Rate):** Some dials are hypersensitive — a tiny turn causes a huge change in the final taste. Adam adjusts those gently. Some dials are stubborn — big turns barely matter. Adam cranks those harder.

**Lighter over time (Learning Rate decay):** Bold adjustments early in training — you're so far from good that aggressive moves are fine. Increasingly delicate adjustments as you approach excellence. The closer to perfect, the more carefully you tune.

### The Growth Curve

| Dish | Loss | What's Happening in the Kitchen |
|------|------|---------------------------------|
| #1 | 3.3 | Blindfolded — dessert after sashimi, deep-fried everything, pure random chaos |
| #100 | ~2.8 | Learned "omakase usually starts light, ends rich" |
| #500 | ~2.5 | Learned "miso and rice always appear together," "never three fried courses in a row" |
| #1000 | 2.37 | Designing omakase that diners actually believe in |

**Ming never memorized a single rule.** Nobody told him "don't serve three fried courses back-to-back." Nobody explained that miso pairs with rice. He just ran the cook → trace → adjust loop until the dials naturally settled into positions that reflect those patterns.

That's what "learning intuition" means.

![Training loop: Cook → Score → Trace → Adjust (1,000 rounds), with Adam the Sensei's three methods: Memory, Personalized Touch, Lighter Over Time](illustrations/11-framework-training-loop-adam.png)

> *Intelligence didn't come from rules. It came from repetition.*

---

## Chapter 7: Graduation — Ming Cooks Solo

Training's over. Dials locked in their final positions. This isn't practice anymore — real diners are here.

1. Service bell rings 🛎️ — "begin a new omakase"
2. Ming designs the first course based on current dial positions
3. That course travels through the assembly line, and from it, Ming designs the second
4. The second informs the third. The third informs the fourth.
5. Continues until Ming naturally produces the closing bell 🛎️

Every course is improvised — in the sense that no predetermined menu exists — but informed by everything that came before. Just like a great omakase chef reading the table: the first course shapes the second, the mood of the meal shapes the end.

### The Risk Dial (Temperature)

There's one dial by the kitchen door that doesn't change skill level — it changes *style*.

- **Temperature = 0.1** (ultra-safe) → always picks the statistically safest choice → predictable, solid, a little boring
- **Temperature = 0.5** (slightly adventurous) → mostly coherent with surprises
- **Temperature = 1.5** (bold risk-taker) → might be brilliant, might be incomprehensible

![Temperature dial spanning from 0.1 (Ultra-Safe) through 0.7 (ChatGPT marked with a star) to 1.5 (Bold Risk-Taker), with example outputs below each](illustrations/12-comparison-temperature-dial.png)

ChatGPT runs at around 0.7. A little creative, but won't go off the rails.

### On "Inventing Dishes" (Hallucination)

After training, Ming generates courses called "Karia," "Yeran," "Liole." These are actual outputs from Karpathy's trained model — names that sound plausible, feel right, could belong to a real person. Most probably don't exist anywhere in the training data.

He's not lying. He's following patterns he internalized — combinations that feel statistically plausible. He generates them with complete confidence. But they were never real.

When ChatGPT confidently cites a paper that doesn't exist, or invents a specific date or name, it's doing exactly what Ming does with "karia." It has no fact-checking station. It only knows what *tastes right*, not what *is real*.

> *Ming can design a flawless omakase using an ingredient that was never harvested. That's the trade-off built into how the kitchen works.*

---

## Chapter 8: From Neighborhood Cart to Michelin 3-Star

Ming learned to cook with 4,192 judgment dials and 32,000 training records. What about ChatGPT?

| | Ming (Neighborhood Omakase) | ChatGPT (Michelin 3-Star) |
|--|---|---|
| Judgment dials | 4,192 | Hundreds of billions |
| Training records | 32,000 names | Trillions of sequences (the entire internet) |
| Course vocabulary | 27 letters + a bell | ~100,000 word chunks |
| Kitchen | One stove (a MacBook) | Thousands of burners in parallel (GPU cluster) |
| Training time | 1 minute | Months |
| **Cooking principles** | **Identical** | **Identical** |

![Scale comparison: Ming's humble street cart (4,192 dials, MacBook, 32,000 records) vs. ChatGPT's Michelin kitchen (billions of dials, thousands of GPUs, trillions of records). Footer: "Same cooking principles. Wildly different scale."](illustrations/13-comparison-scale-ming-vs-chatgpt.png)

Same kitchen. Wildly different scale.

### The 3-Star Kitchen's Extra Steps

ChatGPT didn't stop at basic training. Two additional stages took it from technically correct to genuinely useful.

**Stage 1 — Switch the Menu (SFT):** Ming first trained on simple name sequences to develop his foundational sequencing feel. Then he switched to multi-turn conversations — complex back-and-forths — and kept training. Same cook → trace → adjust algorithm. Different training material. A chef who masters eggs before moving to haute cuisine. The fundamentals don't change; the repertoire expands.

**Stage 2 — Bring in the Critics (RLHF):** Ming designs two dishes. A critic chooses the better one. The dials adjust based on critic preference, repeated millions of times.

This is why ChatGPT is "polite" and "helpful" — not because a rule was programmed in. Because human critics, across millions of comparisons, consistently selected responses that felt helpful and respectful. Those preferences got baked into the dials.

Through all of it, the core never changes: **cook → score → trace → adjust.**

> *From 200 lines to hundreds of billions of parameters: same six techniques, same three steps. Just more dials, more dishes, more diners.*

---

## The Kitchen, Simplified

Next time someone tells you AI is mysterious, terrifying, or about to replace humanity — remember the diner sitting down at that omakase counter.

No menu. Dishes arriving with quiet confidence. Everything feeling inevitable.

Behind that experience: one apprentice, a wall of judgment dials, and 32,000 records. No rules given. Just cook → score → trace → adjust. Do it enough times, and the dials settle.

This isn't intelligence. It's statistical intuition so refined it becomes indistinguishable from taste.

But the fact that such a simple mechanism — six operations, three steps, one loop — produces something that can hold a conversation, explain a concept, write a story, and feel *present* in the exchange?

That's what's truly awe-inspiring.

200 lines of code. Six techniques. One kitchen.

That's all of ChatGPT.

---

*If you want to see the actual 200 lines, Andrej Karpathy's [MicroGPT](https://karpathy.github.io/2026/02/12/microgpt/) is worth the read. He built the kitchen. I just gave it a name and walked you through it.*

---

## Metaphor Reference

| GPT Concept | Kitchen Metaphor |
|-------------|-----------------|
| Model | Ming, the apprentice chef |
| Parameters | 4,192 judgment dials — encoding Ming's learned intuition about sequence |
| Dataset | 32,000 omakase records from the master (not recipes — just the sequences) |
| Token | A single course in the omakase |
| Tokenizer | The system that breaks a full set into individual courses |
| BOS / EOS Token | The service bell 🛎️ — "new set begins" / "set complete" |
| Embedding | Flavor profile card — 16 numbers encoding a course's character |
| Position Embedding | Sequence tag — "this is course #3" |
| Attention | Sous chefs consulting their notebooks on previous courses |
| Query / Key / Value | Q = "what do I need?" K = "here's what I offered" V = "here's my recipe if you pick me" |
| Multi-head Attention | 4 sous chefs, each tracking a different dimension simultaneously |
| KV Cache | The notebooks — no need to re-taste what's already been recorded |
| MLP | The back kitchen — think for yourself after consulting the room |
| ReLU | Quality control — bad flavors get zeroed out, good ones pass through |
| Residual Connection | The spoonful of original stock mixed back in after every step |
| RMSNorm | Palate cleanser before each station |
| Loss | The diner's penalty score — how far from perfect? |
| Softmax | Converting raw scores into ranked percentages |
| Backpropagation | Tracing "too salty" back through every station to dial #347 |
| Gradient | Each dial's influence number — how much does it shift the final result? |
| Chain Rule | Multiply the impact at each step along the assembly line |
| Adam Optimizer | The master chef who adjusts with memory, personalization, and a lighter touch over time |
| Temperature | The risk dial — low = safe, high = creative |
| Hallucination | Inventing "karia" — statistically plausible, never existed |
| MicroGPT → ChatGPT | Neighborhood cart → Michelin 3-star — same principles, wildly different scale |
