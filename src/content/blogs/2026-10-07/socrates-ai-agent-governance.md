---
title: "Being Smarter Doesn't Give You the Right to Decide"
date: 2026-10-07
slug: socrates-ai-agent-governance
category: ai-native-systems
tags: [agent-governance, democracy, decision-systems, socrates]
cover: imgs/web/00-cover-v3-clean.webp
---

![A bright civic still life of a column, open gate, decision tablet, amphora, and olive branch](imgs/web/00-cover-v3-clean.webp)

In 399 BCE, Socrates was tried by an Athenian citizen jury.

The details matter. This was not a referendum and not a panel of professional judges. The jury was drawn from eligible male citizens; the number is commonly given as 501. [The historical record is discussed by the Stanford Encyclopedia of Philosophy](https://plato.stanford.edu/entries/socrates/).

The trial has been argued over for more than two thousand years, and it is too easy to turn it into a slogan. But it leaves behind an uncomfortable question.

What if the people asked to decide do not understand the thing being decided?

Plato took that question seriously enough to build a political challenge around it. If governing requires knowledge, judgment, and virtue, why should political authority be distributed independently of them? The modern reader often hears this as a simple attack on one-person-one-vote. It is more useful to hear it as a problem of competence: why should lacking expertise carry no consequence for decision-making power? [The relevant philosophical background is well summarized here](https://plato.stanford.edu/entries/democracy/).

It is not a dead question. It is becoming an engineering question.

AI is moving from answering to deciding to acting. It can call tools, change records, send messages, spend money, merge code, and eventually deploy production changes. Once software can act on our behalf, “How smart is it?” is only the first question.

The harder questions are older:

Who gave it authority? What is it allowed to optimise? What happens when it is wrong? Who can challenge it? Who carries the consequence?

## Plato was right about the problem

Plato did not need modern polling, universal suffrage, or machine learning to see the tension. Large groups can be misinformed. Majorities can be frightened, manipulated, impatient, or cruel. Specialist questions often do require specialist knowledge.

Anyone who has watched a technical incident get decided by whoever spoke with the most confidence has felt the force of his argument.

If a database migration can damage a company, should the whole company vote on the rollback plan? If a monetary crisis crosses borders, should every operational choice be settled by a public ballot? If an AI system can make a high-stakes recommendation, should every output wait for a committee?

Obviously not.

Expertise matters. The mistake is to let that true sentence quietly become another one: expertise therefore grants unlimited authority.

Experts can be wrong. They can be captured by institutional incentives. They can optimize their own professional language until ordinary people cannot inspect the decision. They can mistake a model for reality—exactly the problem behind the Greek metric story in the first piece of this series.

The answer to a weak crowd cannot be an unaccountable expert.

## Modern democracy gave a more modest answer

Modern democracy does not rest on the belief that every citizen has the same expertise.

It rests on a different claim: every person deserves equal political standing. Expertise should inform power, but expertise alone should not decide who gets power without limit.

That distinction is easy to miss because the machinery of democracy has many moving parts. A simple way to see it is as four layers:

- **People** provide legitimacy: whose interests are being represented, and who can remove leaders?
- **Representatives** provide delegation and scale: not every choice can be made by everyone every day.
- **Experts and institutions** provide competence: specialised work can be done by people who understand it.
- **Constitutions, courts, and rules** provide constraints: even a popular leader or respected institution does not get unlimited permission.

These layers are not perfectly clean in any country. They argue with each other constantly. That friction is not a design failure. It is part of the design.

India is a useful reminder of the choice involved. At independence, India faced poverty, low literacy, caste hierarchy, religious division, and extraordinary linguistic diversity. It did not decide to wait until everyone had equal education before allowing them to vote. Universal adult suffrage was a deliberate constitutional commitment. At the same time, B. R. Ambedkar warned that political equality could coexist with sharp social and economic inequality. [His 1949 speech](https://www.constitutionofindia.net/debates/25-nov-1949/) is worth reading beside [Article 326 of the Constitution](https://www.indiacode.nic.in/bitstream/123456789/19151/1/constitution_of_india.pdf).

The claim was never that every voter knew everything. The claim was that a person's standing in the political community should not depend on passing an expertise test designed by people already in power.

![Four civic layers in an open building supporting one public decision table](imgs/web/01-civic-layers.webp)

## The agent is a new kind of expert layer

This is where the series comes back to software.

An agent is not a philosopher king. It is a high-speed expert layer with peculiar strengths and weaknesses. It can read far more documents than a person, hold more local context than a rushed meeting, call tools without getting tired, and run the same procedure repeatedly. It can also hallucinate, inherit bad data, follow the wrong proxy, blur a permission boundary, and act faster than a human can notice.

In the previous three pieces, I used Greece to ask three questions:

1. **Measurement:** What are we optimising?
2. **Architecture:** What happens when the system fails?
3. **Authority:** Who gets to decide?

These are not separate agent problems. Together, they form a decision-system stack.

An agent with the wrong objective will reliably optimise the wrong thing. An agent without failure handling will turn a small mistake into a larger one. An agent with vague authority will either overreach or become useless. A capable model does not solve any of these design problems. It makes their consequences arrive faster.

![A small capable tool works inside a bounded tray while a decision token remains beyond a coral boundary](imgs/web/02-capability-boundary.webp)

## “Human in the loop” is not a governance model

This phrase is usually meant as reassurance. But it leaves most of the actual design blank.

Which human? At what point? With what information? Do they have authority to stop the action, or are they just asked to rubber-stamp it? Can an affected customer appeal? Can the action be reversed? Is there an audit trail? Who owns repair after a harmful decision?

For a consequential agent, I want six properties to be visible:

1. **Delegated.** Its authority comes from a named human or institution; it does not infer its own mandate.
2. **Bounded.** Its permissions, spending limits, tools, data access, and stop conditions are explicit.
3. **Visible.** Important actions leave evidence: inputs, reasoning-relevant context, tool calls, approvals, and outcomes.
4. **Challengeable.** A user, reviewer, or responsible team can question, appeal, or override an action before or after it lands.
5. **Reversible.** The system can pause, roll back, repair, compensate, or contain harm when it is wrong.
6. **Accountable.** A person or institution owns the decision's consequences, including explanation and remediation.

![Six tangible safeguards arranged around one blank decision tablet on a civic worktable](imgs/web/03-visible-safeguards.webp)

This is deliberately stronger than a checkbox that says “human reviewed.” A human can be present without holding authority. A log can exist without being legible. A rollback can be technically possible without anyone being authorised to use it.

The right amount of governance should depend on consequence. Let a low-risk research agent browse and draft quickly. Put much heavier controls around money movement, irreversible data changes, hiring decisions, medical triage, legal conclusions, or production deployment. The objective is not to slow every run. It is to make autonomy proportional to what the run can damage.

## We are designing institutions in software

This is the reveal that my Greece questions gradually gave me.

I began by wondering how a piece of debt could look smaller without becoming less burdensome. That led to the proxy problem: what was the system really optimizing? The debt crisis led to the failure problem: what happens when a shared system breaks? The referendum led to the authority problem: who has the right to decide when every option is bad?

AI agents bring all three questions into one product surface.

They do not merely generate text. They make choices inside goals, follow rules unevenly, take action through tools, create evidence or fail to, and hand difficult cases back to people—or do not. Their behaviour becomes the behaviour of the institution that put them to work.

We are building decision-making institutions in software, with intelligent agents inside them.

That sounds grander than a family trip should have to carry. But the trip gave me the right kind of distance. Greece was everywhere around us as history, food, weather, ferry routes, ruins, ordinary life. Then, later, I found myself reading a financial story that did not stay in finance.

It kept pointing back to the work already on my desk.

The engineering task is not to build a ruler. It is to design the institution in which a capable system is allowed to act.

---

*This completes the Decision Systems series: measurement, failure, authority, and governance. Every agent team can ask one useful question, though it resists an easy answer: what institution are we building around this decision?*
