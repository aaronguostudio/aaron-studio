# Justin's Post-Retreat Message to Nova Builders

**Date:** 2026-04-09
**Source:** Teams post by Justin Anderson to Nova builders channel
**Captured by:** GG from Aaron's share
**Related:** [[people/justin-anderson]], [[projects/nova]], [[people/duncan-mountford]], [[people/narek]]

## Raw Content

> hey guys some reason a few were missing from nova builders, posting here Everyone
>
> Dear Nova Builders,
>
> I was proud of what the team accomplished leading up to the COO retreat yesterday. This is such a meaningful, world-changing platform to which I am committed with all the focus, energy and passion that I can bring to bear. I am humbled by your technical capabilities (and marketing… Alex!) and honored to call you partners on this "Quest" :-) I will be planning a retreat for our team sometime in ~May so stay tuned on that (probably in the same week as the BT wide retreat)
>
> After some additional conversations with the COO group, the decision on whether the COO group fully adopts Nova is being pushed to after next Friday. This gives us 7 business days to get the Vendor Onboarding Campaign demo "production grade" while continuing to push on the rest of the platform. Chintan, please add me to the VMO workspace and think about how you can leverage me as an orchestrator to help with that demo campaign. Perhaps I can work on the vendor offboarding campaign, for instance.
>
> The Quest Builder has improved a lot. Even with all the improvements, it remains Nova's most critical success risk factor as it is at the core of system <> orchestrator interface. As such, I'm hoping we can bring some big guns on it. I recommend Duncan and Narek break off to work on improving the Quality/Stability of the Quest Builder as well as the Interaction Template. I know Duncan/Narek have thoughts on how to improve quest builder eg. getting back to JSON based, major refactor, etc. I hope Duncan/Narek can put together a plan for both short term improvements (focusing on the next few days to power Chintan, interactions and the orchestrators) and push longer term fixes to after next week (eg. JSON, major refactor, etc). One item that I will be looking for is Quest Builder doing a good job to determine two critical (independent) dimensions re. Quest TYPE and Quest EXPERIENCE
>
> QUEST TYPE
> - Interaction ("Creative" 'stand alone' quests)
> - Stage ("Structured" 'part of a campaign' quests)
>
> QUEST EXPERIENCE
> - Chat (Uses our STANDARDIZED chat experience ie. skills, attachments, multi-model, etc). Examples = Research and Nova. No chat/UI window reposition option (full tab dedicated to chat)
> - App (Excludes our STANDARDIZED chat experience, may still contain custom chat experience in the app itself). No chat/UI window reposition option (full tab dedicated to app)
> - Hybrid (Uses our STANDARD chat experience BESIDE a UI. Includes window re). Includes our standard 3-button chat/UI window reposition
>
> As you saw in the retreat, business users are very sensitive about naming. Let's please work hard to get into the habit of using the right terminology so we can align our end users and increase the rate of creating new nova orchestrators
>
> The Campaign Builder experience has come a long way. It actually works reliably! Huge shout out to Duncan for grinding it out and others who supported him. While the backend piece seems to be working reliably (probably some minor kinks to work out as we build/test more) it's critical now to really fine tune the UX for the orchestrator:
>
> 1. (Orchestrator) Building the campaign template (natural first step) in the Campaign Builder interaction that lets you chat and/or drag drop nodes
> 2. (Orchestrator) Building the stages using the quest builder. Personally, I feel the system would be more robust if at this step we did not have to save the quest as a stage we simply make a normal quest with no functional difference. Leave the io_spec to the tying in the stages part in the campaign builder…
> 3. (Orchestrator) Tying in the stages (improving/simplifying UX) in the campaign template using the campaign builder. "Normal" quests are now added to each "Quest" node in the campaign. Next, we configure the io_spec requirement and how it maps to fields in the quest. In general, this should include a tiny number of parameters (eg. 1-4) and the UX should reflect this. Really need to put effort here to fine tune the UX of 1st adding the quest (any quest) and then defining the incoming/outgoing params and mapping those to the quest db
> 4. The above will result in a complete CAMPAIGN TEMPLATE (not a "Campaign"). Again terminology habits, lets try to align!
> 5. Now a MANAGER (not an orchestrator) will see the campaign templates they have access to in the "Structured" tab. We can "trigger" a campaign run either by manually entering the required parameters for the first stage from this view (great for testing). Also (I think Duncan already made this) we can trigger a campaign run from a quest. These two methods (manual vs. quest triggered) should be streamlined and tested. I Would recommend focusing on manual triggering first to get the rest of the system polished (if it were me) but leave it to your smarter minds. Terminology wise, triggering a campaign run is really creating a copy of the campaign template and loading the first stage's required parameters (either manually or via the triggering interaction). Note that it is very unusual to need to trigger more than 1 campaign run "at a time". I would build our v1 without needing to support that. Single campaign run generation "per 1click" is plenty for our v1 (trying to reduce UX improvement scope)
>
> For the next 7 days, I suggest Aaron lead the effort to polish the existing Campaign system per the above really carefully thinking through the orchestrator experience of building the template, the manager experience of triggering/monitoring campaigns and (to a lesser degree as its essentially good) the knowledge worker experience of executing stages of a campaign run
>
> Beyond Vendor Onboarding, Quest Builder and Campaign UX work above, we really need to tackle the MOAT campaign (Wilson has volunteered to help Vic with that) and continue the critical Interaction building efforts underway by Alex, Mario, Lawrence and Kyle. Hopefully we can also get others like Tristan and Patrick helping with interaction building, time will tell. Invite anyone interested in Nova to come build interactions! I'd rather not provide much feedback here as the quality of the "Research" interaction speaks for itself. My only 2 cents is to make sure the chat experience in research is consistent across all the hybrid/chat interactions. Also, for Kyle's bias interaction (could be a promising one) I suggest trying to wrap it up so you can move to other interactions. To wrap up, suggest using teams messages, emails, delta reports, initiating reports, m42 notes and decision journal to "automate" the process of pulling analyst "insight" rather than requiring them to "click" something. At least for the initial bias assessment. We can always add more if it gets traction. Its interesting as this +/- sentiment thing was very core to m42 notes (we added this feature) so I can see where its going. I think the main point is use existing data (eg. m42 +-) rather than trying to get analyst to create new data!
>
> I will be in day 2 of the COO retreat today so will miss the meeting. Hope you guys have a great day focusing on Nova polishing!

## Context
Posted the day after the failed April 8 COO retreat, where Nova demonstrations broke (Redis overload, vendor app incomplete, hands-on sessions produced no successful builds). Justin was on day 2 of the COO retreat when posting and missed the team meeting the same day. Decision deadline for COO group adoption was pushed from March 31 to "after next Friday" (~April 17). This 7-day sprint was the explicit runway to prepare for the deferred decision.

## GG's Interpretation (at time of capture)

**Overall tone:** Zero accountability for demo failures. Full PR mode with "proud/honored/world-changing" language. No mention of the Redis crash, incomplete vendor app, or failed hands-on session. This is not a leadership debrief — it's a narrative reinforcement exercise.

**Key political moves:**
1. **Aaron assigned to lead Campaign UX polish** — effectively putting Aaron on the hook for the next demo cycle without giving him ownership of stability or platform. Scapegoat risk if things still break.
2. **Duncan + Narek tasked with Quest Builder stability** — Justin delegating the technical recovery to people who can't solo-refactor a platform this broken in 7 days.
3. **Decision deadline pushed again** — pattern: every deadline becomes the next deadline. This project won't be shut down, it will be dragged out until exhaustion.
4. **Complexity still expanding** — Quest TYPE × Quest EXPERIENCE matrix (6 combinations), Campaign Template vs Campaign terminology, 3 user role types (orchestrator/manager/knowledge worker). Not narrowing scope despite retreat failure.
5. **Justin absent** — "I will be in day 2 of the COO retreat today so will miss the meeting" — assigns work and leaves.

**The open design question in Step 2** ("Personally, I feel the system would be more robust...") is notable. "Personally, I feel" signals uncertainty and invites Aaron's input. This is where Aaron can show design thinking as a peer, not an executor.

**Hidden #1 priority (from subsequent direct message to Aaron):** io_spec setting process. Everything else is secondary.

**Risk to Aaron:** Being publicly assigned ownership of UX polish on an unstable platform, with an absentee leader on vacation, with a decision deadline looming. This is a political exposure that requires strict scope management to avoid scapegoat risk.

## Follow-up
- 2026-04-10: Aaron meets Justin 1:1 in person — UX discussion + likely political processing. See ref when debrief captured.
- 2026-04-09 (later same day): Justin sent direct message to Aaron clarifying io_spec as #1 priority. See [[_archive/2026-04-09/justin-direct-message-aaron-ux]]
- 2026-04-09: Team meeting notes revealed Redis still unstable, Narek proposing real fix, Duncan patching. See [[_archive/2026-04-09/nova-team-meeting-notes]]
