# Narek Margaryan — AI Lead at Mawer

**Role:** AI Lead at [[orgs/mawer]]
**Relationship to Aaron:** Technical respect, direct relationship building 🟢
**Trust level:** High (based on technical judgment and character)
**Distance:** Work collaboration, potential for closer peer relationship
**Last updated:** 2026-04-10

## Position
- AI Lead on the Nova team
- Built the flow graph framework for Nova
- Working on Quest Builder stability, Redis architecture fix, memory node design

## Who He Is
- **The only true technical operator on Nova team**
- Does work that has value **regardless of Nova's outcome**
- Senior engineer instincts: architecture thinking, stress testing, root cause analysis
- Not politically engaged — loyalty is to engineering craft
- **Tell:** Code submitted to a separate repo — possibly for startup preparation

## Technical Output (recent)
- **Redis pub/sub architecture diagnosis (April 9):** Identified that Redis dedicates a separate connection per pub/sub subscription — current ad-hoc pattern will exhaust pool at scale. **This is a correct senior-engineer diagnosis.**
- **Proposed fix:** Shared pub/sub connection per worker + event bus abstraction with predicate/callback pattern. Real architectural solution, not a patch.
- **Quest Builder stress testing:** Running benchmarks with simulated users, results expected in ~2 days
- **Memory node design:** Exploring Mem Palace technique, comparing to Chroma DB's verbatim storage + temporal graph

## Relationship to Aaron
- Low current interaction but mutual technical respect
- **Target: build direct technical relationship** — valuable regardless of Nova's fate
- Both are "augment real value" people in a team full of "rebuild the world" people
- Both have external hedges (Narek: separate repo; Aaron: OrgNext)

## How Aaron Can Engage
- **Proposed opening:** Ask about his event bus abstraction and how it affects Campaign Builder's WebSocket listeners — technical question, not political
- Share observations about Quest Builder UX pain points from usage data
- Exchange thoughts on engineering craft / architecture philosophy
- **Avoid:** political discussions, Justin commentary, Nova fate speculation

## Strategic Reading
- **If Nova succeeds:** Narek is the reason the platform is stable, Aaron is the reason it's usable → natural pairing
- **If Nova fails:** Narek likely lands well (strong engineering reputation), possibly leaves Mawer; relationship continues externally
- **If Narek starts a startup:** Aaron is a natural collaborator/advisor, especially if tied to financial industry AI
- **Regardless:** Direct relationship with Narek is one of Aaron's highest-ROI technical investments

## Observations Timeline
- 2026-04-09: Proposed Redis event bus architecture fix; running Quest Builder stress tests; discussing Mem Palace for memory nodes; supported Aaron's "cloud DB sharing" idea for local dev
- 2026 earlier: Built flow graph framework for Nova; code submissions to separate repo (low commit activity to main project over 1.5 months)
- Ongoing: Doing architectural work while others do vibe-coded feature work

## What to Watch
- Does his separate-repo activity increase? (startup prep signal)
- Does he engage more with Aaron when asked technical questions?
- Does his Redis fix actually ship, or get blocked by Duncan's patches being "good enough"?
- Does he start building outside Mawer visibly?
- Any interest in OrgNext-style problems?

## Open Questions
- What are his long-term career goals?
- Is he planning to leave Mawer?
- Would he collaborate on OrgNext or adjacent projects?
- What does he think of Justin and Wilson? (Never ask directly.)

---

**Category:** Technical respect, strategic long-term investment
**Political weight:** Low (he's not in politics) but **engineering weight is high**
**Note:** Unique in Mawer — the one person whose value is independent of any political outcome
