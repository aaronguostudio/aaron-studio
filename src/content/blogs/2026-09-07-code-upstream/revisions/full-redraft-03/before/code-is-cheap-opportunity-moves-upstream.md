---
title: "Code Is Getting Cheaper. The Opportunity Is Moving Upstream."
date: 2026-09-07
slug: code-is-cheap-opportunity-moves-upstream
category: product-execution
tags: [AI-coding, product-engineering, requirements]
description: "As agents take on more implementation, where should engineers put their attention? Six practical changes, drawn from engineering interviews and my own work."
draft: true
---

# Code Is Getting Cheaper. The Opportunity Is Moving Upstream.

Imagine a request landing in your queue: add an “Export to Excel” button.

An agent familiar with the project may be able to implement the button, endpoint, and file generation without you writing each line. You check the result, add tests, and move on.

But I increasingly want to ask one more question: **What does the person do after the export?**

Perhaps they combine several spreadsheets, find the items nobody has handled, and contact the people responsible. If all we deliver is the export, our coding task is finished. Their most tedious work is still waiting.

Several recent discussions about AI coding have brought me back to this question. As implementation gets easier, engineers have more room to participate earlier: understand the business, find the problem, and help decide what deserves to be built. That is the opportunity I see moving upstream.

In his February interview with Lenny Rachitsky, Boris Cherny said Claude Code was writing all his code. He immediately added that he still inspected it and that human review remained part of the process. Both parts matter: AI can take on substantial implementation, while engineers still need confidence in what they hand over. [Interview, 16:17–17:31](https://www.youtube.com/watch?v=We7BZVKbCVw&t=977s)

Who writes the code, and which model writes it best, are useful questions. I am increasingly interested in another one: with more ability to build, will we step forward to find needs that have not yet become engineering tickets?

## Abstraction has been doing this for a long time

There is a familiar pattern in computing history. In his account of the development of C, Dennis Ritchie described the advantages they wanted from languages above assembly: programs were easier to write and understand. [Ritchie’s account](https://www.nokia.com/bell-labs/about/dennis-m-ritchie/chist.html)

Languages, libraries, and frameworks have repeatedly packaged up implementation work so developers can express something closer to their goal.

This history is not a straight line in which each language replaces the previous one. Low-level systems still need specialist knowledge. Better tools do not remove business complexity. AI also adds a distinction: a generated solution can misunderstand the objective, so its behavior needs verification.

None of this requires every engineer to become a product manager. Deep expertise in systems, performance, and security remains valuable, and AI can assist with requirements and product choices too. My interest is in how engineers can bring their existing experience into earlier decisions.

As tools take on more of the details we once handled ourselves, it is worth reconsidering where we put our attention. Here are six changes I would suggest.

## 1. Get closer to the actual work

When someone requests a feature, watch how they do the job today.

In the hypothetical export request, the ticket might lead us to discuss columns, formats, and download speed. Watching the person work could reveal why they download repeatedly, how they compare files, and where things get missed.

That information could change the solution. An export might be enough. A list of outstanding items might help more. Or several systems might disagree about what “outstanding” means, in which case a better-looking page will not resolve the problem.

You do not need a full research program to start. On your next request, ask for a walkthrough. Notice when the person pauses, copies data, or asks someone else to confirm something. Engineers know what systems can do. Seeing the work gives that knowledge somewhere useful to go.

## 2. Define the result

Once you understand the problem, make success concrete.

“Add an outstanding-items list” still leaves plenty unresolved. What counts as outstanding? Who can see it? When should a completed item disappear? How should the page indicate that its data has not refreshed? An agent can fill those gaps with plausible defaults, but plausibility is not agreement.

In a September 3 account of its development practices, Microsoft Digital described moving business intent, edge cases, and acceptance criteria into specifications that evolve with the project. It is the organization’s own account, but it offers a concrete example of this shift in attention. [Microsoft Digital’s account](https://www.microsoft.com/insidetrack/blog/engineering-the-frontier-firm-sharing-our-ai-native-approach-to-software-development/)

I would start small: write down who needs to do what, which mistakes are unacceptable, and which examples will demonstrate success. Make the description clear enough to test the current idea, then update it as feedback arrives. AI can help ask questions and organize the answers. Someone still needs to confirm that those answers reflect the business need.

## 3. Learn through prototypes

A clear requirement can still describe the wrong solution. One useful consequence of cheaper implementation is finding that out sooner.

In his April conversation with Lenny, Simon Willison described trying alternative prototypes and watching real people use them. He remained more convinced by actual user behavior than by AI simulating a user. [Interview, 21:27–23:35](https://www.youtube.com/watch?v=wc8FBhQtdsA&t=1287s)

For the export example, we could build a small page with sample data before implementing a complete workflow. Can the person identify what needs attention? Do they understand the page? Do they still have to return to the spreadsheet?

The purpose of that implementation is to answer a question. Keep the necessary access and data boundaries in place, and focus the prototype on the biggest uncertainty. Discovering that the approach needs changing is useful progress.

## 4. Deliver the whole task

I recently worked on a reporting task in a business system. The application ran on Linux, while the reporting engine required Windows. To get a usable report back into the application, the request, database connection, PDF generation, and attachment return all had to work together.

That involved Azure resources, networking, a Windows service, and SQL certificate handling. Within the authorized scope, AI helped carry the work through those steps. We got the reporting path working in the Dev environment and verified the attachment. [My account of that work](/blogs/gpt-6-astra-real-work)

The experience made me more willing to take on a complete task with an agent. Delivering a service alone would not have established that the report was usable. We had to follow the path the business process would actually take.

When accepting a task, I now want to look around its edges: where does it start, which systems does it cross, and who receives the result? Agents give us more execution capacity to work on those connections, where individually completed components can still fail to produce something people can use.

## 5. Make quality inspectable

Business importance gives engineering quality a concrete meaning.

If that report request is retried, could it create duplicate attachments? If it fails, can the user tell what happened? Tests, logs, code review, and knowledge of the system can help answer those questions.

Kent Beck used payroll software to illustrate a related problem in his July interview: calculating a number covers only a visible slice of a product whose full operation carries many less obvious obligations. [Interview, 2:14:13–2:15:39](https://www.youtube.com/watch?v=ddHQQtjIOpw&t=8053s)

That is where I want technical discussions to land. Does a more complex design address a real failure case? Does a passing test establish behavior the user actually cares about? When an agent reports completion, what result can we inspect?

AI can write code and help with judgment and verification. The person handing over the result still needs to understand why it deserves to be trusted.

## 6. Revisit the small problems

Some opportunities have been around for years. They were simply too small to justify dedicated development.

A format converter. A step that removes repeated data entry. A page that lets colleagues do something without asking you every time. You may already have known how to build it, but never found the time. Cheaper implementation makes those old decisions worth revisiting. Simon explores this change in cost assumptions in his own writing. [Writing code is cheap now](https://simonwillison.net/guides/agentic-engineering-patterns/code-is-cheap/)

Look through requests you previously set aside as not worth the effort. Pick one small, recurring annoyance and estimate it again, including integration, maintenance, access control, and the effort of using it. If it seems worth trying, build a usable version and see whether it actually removes work. A tool nobody opens again provides little value, however quickly it was made.

These opportunities interest me. They may never become a company or warrant a launch announcement. They can still make a few people’s daily work easier.

## Bring your technical judgment to where the problem starts

The change I welcome is being able to get involved earlier. While someone is still explaining what is awkward or time-consuming, we can help turn those frustrations into something testable. Lower implementation costs give us more room to participate.

Our accumulated technical experience has a role here. We understand how systems connect, which defaults are risky, and which results deserve suspicion. With agents helping execute, that judgment can extend from finding a problem to seeing the solution used.

The next time I encounter an “Export to Excel” request, I want to deliver the feature well and also look at what happens after the download. There may be a more valuable problem waiting there.

That keeps me interested in what comes next for engineers. Real frustrations that people have been working around now have a better chance of being addressed. **That is where I want to put the execution capacity AI gives me.**

*Sources checked September 7, 2026. The interviews were published in February, April, and July; the article paraphrases selected passages. “Moving upstream” and the six suggestions are my synthesis. The opening export request is a hypothetical example.*
