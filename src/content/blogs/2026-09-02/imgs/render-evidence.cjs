const { chromium } = require('playwright')
const path = require('node:path')
const fs = require('node:fs')

const outputDir = __dirname
const coverData = fs.readFileSync(path.join(outputDir, '00-cover-v1.png')).toString('base64')
const coverUrl = `data:image/png;base64,${coverData}`

const palette = {
  ink: '#171918',
  panel: '#222523',
  warm: '#f3ede2',
  paper: '#fffaf1',
  muted: '#a8aaa4',
  cyan: '#78c8c8',
  amber: '#e4ad59',
  coral: '#e47761',
  green: '#87b98b',
}

function shell(body, extra = '') {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    *{box-sizing:border-box} html,body{margin:0;width:100%;height:100%;overflow:hidden}
    body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:${palette.ink};color:${palette.warm}}
    .mono{font-family:"SFMono-Regular",Consolas,"Liberation Mono",monospace}
    ${extra}
  </style></head><body>${body}</body></html>`
}

const toolSequences = shell(`
  <main class="canvas">
    <header>
      <div><span class="eyebrow">FIELD TEST · TURN 1</span><h1>SAME BUG. FOUR ROUTES.</h1></div>
      <div class="failure mono"><small>TARGETED TEST</small><strong>0 ≠ 1299</strong><span>1 failed · 0 edited</span></div>
    </header>
    <section class="lanes">
      <article><b>CODEX</b><p>code graph <i>→</i> incident search <i>→</i> symbol <i>→</i> source <i>→</i> test <i>→</i> config + fixture</p></article>
      <article><b>CLAUDE</b><p>workspace inventory <i>→</i> fixture + source + config + test + README <i>→</i> targeted test</p></article>
      <article><b>GROK</b><p>list directory <i>→</i> incident / fixture search <i>→</i> six file reads <i>→</i> targeted test</p></article>
      <article><b>DSH</b><p>orient <i>→</i> discover files <i>→</i> source + config + fixture + test <i>→</i> targeted test <i>→</i> durable trace</p></article>
    </section>
    <footer><span class="dot"></span><b>SAME DIAGNOSIS</b><span class="line"></span><b>DIFFERENT FIRST COMMITMENT</b></footer>
  </main>`, `
  .canvas{width:1600px;height:900px;padding:50px 82px;background:linear-gradient(145deg,#191b1a,#252825);position:relative}
  .canvas:after{content:"";position:absolute;inset:0;background-image:radial-gradient(#ffffff0d 1px,transparent 1px);background-size:22px 22px;pointer-events:none}
  header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px;position:relative;z-index:1}
  .eyebrow{font-size:20px;letter-spacing:.18em;color:${palette.cyan};font-weight:700}
  h1{font-size:54px;margin:10px 0 0;letter-spacing:-.035em}
  .failure{width:290px;border:1px solid #ffffff22;background:#101211aa;border-radius:18px;padding:20px 24px;display:grid;gap:5px}
  .failure small{color:${palette.muted};letter-spacing:.12em}.failure strong{color:${palette.coral};font-size:35px}.failure span{color:${palette.muted};font-size:17px}
  .lanes{display:grid;gap:13px;position:relative;z-index:1}
  article{height:112px;display:grid;grid-template-columns:180px 1fr;align-items:center;background:${palette.paper};color:${palette.ink};border-radius:18px;padding:18px 34px;box-shadow:0 14px 30px #0003;border-left:8px solid ${palette.cyan}}
  article:nth-child(2){border-left-color:${palette.amber}} article:nth-child(3){border-left-color:${palette.green}} article:nth-child(4){border-left-color:${palette.coral}}
  article b{font-size:25px;letter-spacing:.08em} article p{font-family:"SFMono-Regular",Consolas,monospace;font-size:21px;line-height:1.5;margin:0;color:#343735} article i{font-style:normal;color:#8c8f89}
  footer{position:relative;z-index:1;margin-top:25px;display:flex;align-items:center;gap:18px;font-size:19px;letter-spacing:.13em;color:${palette.muted}}
  .dot{width:13px;height:13px;border-radius:50%;background:${palette.green};box-shadow:0 0 0 6px #87b98b22}.line{height:1px;flex:1;background:#ffffff25}
`)

const followUp = shell(`
  <main class="canvas">
    <header><span class="eyebrow">FIELD TEST · SAME-SESSION FOLLOW-UP</span><h1>REMEMBERED <em>≠</em> CACHED</h1><p>Zero new tool calls did not produce the same cache receipt.</p></header>
    <section class="cards">
      <article><div class="name">CODEX <span class="ok">ANSWERED</span></div><div class="metric"><small>TOOLS</small><b>0</b></div><div class="receipt mono">cached_input_tokens<br><strong>41,728</strong></div></article>
      <article><div class="name">CLAUDE <span class="ok">ANSWERED</span></div><div class="metric"><small>TOOLS</small><b>0</b></div><div class="receipt mono">cache_read <strong>15,903</strong><br>cache_creation <strong>24,104</strong></div></article>
      <article><div class="name">GROK <span class="ok">ANSWERED</span></div><div class="metric"><small>TOOLS</small><b>0</b></div><div class="receipt mono">cache_read_input_tokens<br><strong class="zero">0</strong></div></article>
      <article><div class="name">DSH <span class="warn">NO FINAL TEXT</span></div><div class="metric"><small>TOOLS</small><b>0</b></div><div class="receipt mono">local Ollama route<br><strong>no cache counters</strong></div></article>
    </section>
    <footer><div><b>SESSION</b><span>Can the product continue?</span></div><i>→</i><div><b>CACHE</b><span>Did the provider reuse a prefix?</span></div><i>→</i><div><b>OUTPUT</b><span>Did this turn finish usefully?</span></div></footer>
  </main>`, `
  .canvas{width:1600px;height:900px;padding:45px 80px;background:${palette.paper};color:${palette.ink};position:relative}
  .canvas:before{content:"";position:absolute;left:0;top:0;width:100%;height:15px;background:linear-gradient(90deg,${palette.cyan},${palette.amber},${palette.coral})}
  header{text-align:center}.eyebrow{font-size:19px;letter-spacing:.18em;color:#5f827f;font-weight:750}h1{font-size:68px;letter-spacing:-.05em;margin:17px 0 6px}h1 em{font-style:normal;color:${palette.coral}}header p{font-size:23px;color:#686b67;margin:0}
  .cards{display:grid;grid-template-columns:1fr 1fr;gap:16px 20px;margin-top:27px}
  article{height:205px;border:1px solid #d8d1c6;border-radius:20px;padding:22px 30px;background:#fff;box-shadow:0 12px 28px #3d342614;display:grid;grid-template-columns:1fr 100px;grid-template-rows:auto 1fr}
  .name{font-size:25px;font-weight:800;letter-spacing:.06em}.ok,.warn{font-size:13px;letter-spacing:.08em;margin-left:10px;padding:6px 10px;border-radius:99px;background:#e8f2e8;color:#47724a;vertical-align:3px}.warn{background:#f8e9e4;color:#a54e3e}
  .metric{grid-row:1/3;grid-column:2;display:flex;flex-direction:column;align-items:flex-end}.metric small{font-size:13px;letter-spacing:.13em;color:#8c8e89}.metric b{font-size:64px;color:#303330;line-height:1}
  .receipt{align-self:end;background:#202321;color:#c8cbc5;padding:12px 18px;border-radius:12px;font-size:16px;line-height:1.5}.receipt strong{color:${palette.cyan};font-size:19px}.receipt .zero{color:${palette.coral};font-size:29px}
  footer{height:105px;margin-top:24px;background:#1b1d1c;color:${palette.warm};border-radius:20px;display:flex;align-items:center;justify-content:center;gap:28px;padding:18px 34px}
  footer div{display:grid;gap:8px;min-width:320px;text-align:center}footer b{font-size:18px;letter-spacing:.14em;color:${palette.amber}}footer span{font-size:17px;color:#bec0bb}footer i{font-style:normal;color:#747872;font-size:34px}
`)

function thumbnail(layout) {
  const right = layout === 'right'
  return shell(`<main><div class="shade"></div><div class="copy"><span>DEEPSEEK HARNESS</span><h1>PROMPT<br>BEFORE THE<br><em>ANSWER</em></h1><p>Codex · Claude · Grok · DSH</p></div></main>`, `
    main{width:1536px;height:864px;background:url('${coverUrl}') center/cover no-repeat;position:relative}
    .shade{position:absolute;inset:0;background:${right ? 'linear-gradient(90deg,#13151418 20%,#131514dd 67%)' : 'linear-gradient(90deg,#131514ed 4%,#131514d5 43%,#13151418 72%)'}}
    .copy{position:absolute;${right ? 'right:78px;text-align:right' : 'left:82px'};top:92px;width:650px;color:#fffaf1}
    .copy span{font-size:22px;letter-spacing:.18em;color:${palette.cyan};font-weight:800}.copy h1{font-size:84px;line-height:.94;letter-spacing:-.055em;margin:24px 0 28px}.copy em{font-style:normal;color:${palette.amber}}.copy p{font-size:23px;color:#cacac5;letter-spacing:.06em}
  `)
}

async function main() {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 })

  for (const [name, html, width, height] of [
    ['01-tool-sequences-v1.png', toolSequences, 1600, 900],
    ['02-follow-up-receipts-v1.png', followUp, 1600, 900],
    ['00-cover-thumbnail-candidate-a.png', thumbnail('left'), 1536, 864],
    ['00-cover-thumbnail-candidate-b.png', thumbnail('right'), 1536, 864],
  ]) {
    await page.setViewportSize({ width, height })
    await page.setContent(html, { waitUntil: 'load' })
    await page.screenshot({ path: path.join(outputDir, name), type: 'png' })
  }

  await browser.close()
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
