# Cross-Platform Distribution

Use this reference when a serious article is ready to travel beyond the blog. The goal is not to duplicate copy across feeds. It is to give each platform a distinct job, then learn which route brings qualified readers back to Aaron's owned site.

## Evidence Boundary

Platform behavior changes and no generic rule such as "links are penalized" should be treated as fact. Use official product guidance for mechanics, then treat reach advice as a testable local hypothesis. Record the creative, link placement, media, posting time, and outcome in `postmortem.md`.

## Distribution Brief

Create `distribution-plan.md` before drafting platform copy. It must state:

- the article's reader and reader job;
- the one tension each post will earn attention with;
- each platform's job, asset, CTA, UTM link, and success metric;
- the launch hypothesis and one follow-up atom per platform;
- what will be compared, rather than assumed, after 24 hours and 7 days.

The strategic thesis may be shared. The copy, proof, and call to action must be native to the platform.

## Platform Jobs

| Platform | Primary job | Best launch asset | Success signal |
|---|---|---|---|
| X | Discovery and high-quality conversation | One strong visual or short captioned native clip plus a sharp claim | Qualified replies, profile visits, UTM clicks |
| LinkedIn | Professional credibility and operator discussion | Source-link preview *or* native video/document, never a cluttered combination | Comments from the target role, out-of-network impressions, UTM clicks |
| Facebook | Relationship-led sharing through Aaron's real network | Personal first-person context plus a link preview | Thoughtful friend comments, shares, UTM clicks |

## Copy Rules

### X

- The launch post should be self-contained, under 280 characters unless a thread is explicitly requested, and contain one claim a reader can disagree with.
- Use a self-reply link as an initial launch variant when it keeps the main post clean. It is a test choice, not an algorithm claim.
- Standard X posts do not use masked anchor text. Put the raw URL in the selected reply; X shortens it through `t.co`.
- Attach a visual only when it makes the argument faster to understand. Add captions or make the visual intelligible with sound off.
- Ask one specific question that invites people with operational experience to answer. Do not use generic engagement bait.
- Schedule one follow-up atom 2-5 days later: a framework, counterintuitive example, or short clip that can stand alone.

### LinkedIn

- Open with a concrete professional tension, followed by Aaron's operator judgment and one useful implication.
- Usually write 150-260 words in readable paragraphs. It is not a compressed article and it is not a corporate announcement.
- Choose one primary format: a direct article link with preview, *or* a native video/document post. LinkedIn does not support combining a URL and an image in one post.
- Do not write Markdown-style anchor links in a standard feed post. Put the CTA and reader question before the link, then paste the UTM URL as the final line. Once the preview loads, leave no text after the URL so LinkedIn can hide the long address in the published share.
- End with a question a practitioner can answer from experience, not "thoughts?".
- Plan a follow-up post that makes one framework or field example useful without requiring the original link.

### Facebook

- Write for real relationships, not an imaginary professional audience. Begin with why Aaron cared enough to make the work, then make the reader's relevance clear.
- Use a direct link with the article preview; do not add a stack of hashtags or repeat an X-style hook.
- Standard profile posts use a URL and preview rather than masked anchor text. Put the UTM URL last, preserve the generated preview, and do not replace the branded destination with a third-party shortener.
- Prefer 100-180 warm, direct words and one honest question for friends who have seen the issue in their own work.
- For a reach-oriented launch, choose a shareable audience intentionally. A `Public` setting expands distribution; `Friends` creates a smaller, higher-trust feedback loop.
- Follow with a more personal or visual post only if the launch reveals a genuine angle worth continuing.

## Link and Measurement Rules

- Build a distinct UTM URL for each platform and creative using `node scripts/blog-growth.mjs utm-url`.
- A published social post is not recorded in `distribution.json` until it has a real post ID or canonical URL.
- Compare direct link, self-reply link, native asset, and post timing only over several comparable posts. Do not promote one result into a permanent rule after a single launch.
- Review both quantity and quality: clicks, engaged reading, target-role comments, subscribers, and the conversations that create future distribution.

## Official Mechanics Sources

- [X organic best practices](https://business.x.com/en/basics/organic-best-practices)
- [LinkedIn: build your professional voice](https://www.linkedin.com/help/linkedin/answer/a7457289)
- [LinkedIn: share a video](https://www.linkedin.com/help/linkedin/answer/a7486279)
- [Facebook: factors that affect organic reach](https://www.facebook.com/help/285625061456389)
