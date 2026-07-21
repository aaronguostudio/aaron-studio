#!/usr/bin/env node

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { execFile } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(scriptDir, '../../..')
const execFileAsync = promisify(execFile)

function parseArgs(argv) {
  const options = { date: new Date().toISOString().slice(0, 10), dryRun: false }
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index]
    if (argument === '--slug') options.slug = argv[++index]
    else if (argument === '--date') options.date = argv[++index]
    else if (argument === '--dry-run') options.dryRun = true
    else throw new Error(`Unknown argument: ${argument}`)
  }
  if (!options.slug) throw new Error('Usage: prepare-concept-campaign.mjs --slug <slug> [--date YYYY-MM-DD] [--dry-run]')
  return options
}

function frontmatterValue(markdown, key) {
  const block = markdown.match(/^---\n([\s\S]*?)\n---/)
  if (!block) throw new Error('Markdown frontmatter is missing')
  const match = block[1].match(new RegExp(`^${key}:\\s*['\"]?(.+?)['\"]?\\s*$`, 'm'))
  if (!match) throw new Error(`Frontmatter field is missing: ${key}`)
  return match[1].replace(/^['\"]|['\"]$/g, '')
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function wrapWords(value, maximumCharacters, maximumLines = 3) {
  const words = String(value).trim().split(/\s+/)
  const lines = []
  let line = ''

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word
    if (candidate.length <= maximumCharacters || !line) {
      line = candidate
      continue
    }
    lines.push(line)
    line = word
  }
  if (line) lines.push(line)

  if (lines.length <= maximumLines) return lines
  const visible = lines.slice(0, maximumLines)
  visible[maximumLines - 1] = `${visible[maximumLines - 1].replace(/[.…]+$/, '')}…`
  return visible
}

function svgTextLines(lines, { x, y, lineHeight, className, attributes = '' }) {
  return lines
    .map((line, index) => `<text x="${x}" y="${y + index * lineHeight}" class="${className}" ${attributes}>${escapeHtml(line)}</text>`)
    .join('')
}

function buildSvgCardEditorial({ concept, brief }) {
  const visual = brief.visual || {}
  const accent = escapeHtml(visual.accent || '#6d5dfc')
  const secondary = escapeHtml(visual.secondary || '#9adcf7')
  const signal = escapeHtml(visual.signal || '#d7ff4f')
  const seriesNumber = String(brief.seriesNumber).padStart(3, '0')
  const titleLines = wrapWords(concept.en.title, 14, 3)
  const titleSize = titleLines.length > 2 ? 76 : 94
  const titleLineHeight = titleSize * .92
  const titleBottom = 315 + (titleLines.length - 1) * titleLineHeight
  const zhY = titleBottom + 58
  const stageY = Math.max(560, zhY + 65)
  const thesisLines = wrapWords(brief.mentalModel.en, 57, 2)

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350" role="img" aria-labelledby="title description">
  <title id="title">${escapeHtml(concept.en.title)} · Working Vocabulary</title>
  <desc id="description">${escapeHtml(brief.mentalModel.en)}</desc>
  <defs>
    <pattern id="grid" width="54" height="54" patternUnits="userSpaceOnUse">
      <path d="M 54 0 L 0 0 0 54" fill="none" stroke="#171717" stroke-opacity=".055" stroke-width="1"/>
    </pattern>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="160%">
      <feDropShadow dx="0" dy="28" stdDeviation="35" flood-color="#1e1912" flood-opacity=".09"/>
    </filter>
    <linearGradient id="intent" x1="0" x2="1">
      <stop offset="0" stop-color="${signal}"/><stop offset="1" stop-color="${accent}"/>
    </linearGradient>
    <style>
      .sans { font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", sans-serif; fill: #171717; }
      .mono { font-family: "SFMono-Regular", Menlo, Monaco, monospace; fill: #171717; }
      .title { font-size: ${titleSize}px; font-weight: 760; letter-spacing: -5px; }
      .layer-title { font-size: 18px; font-weight: 760; letter-spacing: 1.5px; }
      .layer-copy { font-size: 15px; opacity: .66; }
      .pill { font-size: 11px; letter-spacing: 1px; }
    </style>
  </defs>
  <rect width="1080" height="1350" fill="#f4f1e9"/>
  <rect width="1080" height="1350" fill="url(#grid)"/>
  <circle cx="1115" cy="25" r="310" fill="none" stroke="#171717" stroke-opacity=".16"/>
  <circle cx="1115" cy="25" r="402" fill="none" stroke="${accent}" stroke-opacity=".055" stroke-width="92"/>

  <g transform="translate(68 68)">
    <path d="M0 32 L17 3 L34 32 Z" fill="${accent}" fill-opacity=".72"/>
    <circle cx="29" cy="25" r="13" fill="${secondary}"/>
    <text x="52" y="25" class="mono" font-size="18" font-weight="800" letter-spacing="2.5">AARON GUO</text>
    <text x="944" y="25" text-anchor="end" class="mono" font-size="15" fill="#68635b" letter-spacing="2">WORKING VOCABULARY / ${seriesNumber}</text>
  </g>

  <g class="sans">
    <text x="68" y="220" class="mono" font-size="18" font-weight="800" fill="${accent}" letter-spacing="2">${escapeHtml(concept.en.domain.toUpperCase())}</text>
    <line x1="${68 + Math.min(410, concept.en.domain.length * 13 + 30)}" y1="214" x2="${138 + Math.min(410, concept.en.domain.length * 13 + 30)}" y2="214" stroke="#171717" stroke-opacity=".35"/>
    ${svgTextLines(titleLines, { x: 68, y: 315, lineHeight: titleLineHeight, className: 'sans title' })}
    <text x="68" y="${zhY}" class="sans" font-size="31" font-weight="650" letter-spacing="2">${escapeHtml(concept.zh.title)}</text>
  </g>

  <g transform="translate(68 ${stageY})" filter="url(#shadow)">
    <rect width="944" height="430" rx="34" fill="#ffffff" fill-opacity=".66" stroke="#171717" stroke-opacity=".25" stroke-width="1.5"/>
    <text x="46" y="55" class="mono" font-size="14" fill="#6f6a62" letter-spacing="2">COMPLEXITY ARRIVES ONLY WHEN IT EARNS ITS PLACE</text>

    <g transform="translate(46 86)">
      <rect width="852" height="78" rx="19" fill="#171717"/>
      <text x="22" y="46" class="mono" font-size="17" fill="#ffffff" fill-opacity=".7">01</text>
      <text x="80" y="34" class="sans layer-title" fill="#ffffff">ESSENTIAL</text>
      <text x="80" y="58" class="sans layer-copy" fill="#ffffff">complete first task</text>
      <rect x="724" y="23" width="103" height="32" rx="16" fill="none" stroke="#ffffff"/>
      <text x="775" y="44" text-anchor="middle" class="mono pill" fill="#ffffff">VISIBLE</text>

      <rect y="92" width="852" height="78" rx="19" fill="${accent}" fill-opacity=".1" stroke="${accent}" stroke-width="2"/>
      <text x="22" y="138" class="mono" font-size="17" fill="#171717" fill-opacity=".7">02</text>
      <text x="80" y="126" class="sans layer-title">CONTEXT</text>
      <text x="80" y="150" class="sans layer-copy">appears when relevant</text>
      <rect x="707" y="115" width="120" height="32" rx="16" fill="none" stroke="${accent}"/>
      <text x="767" y="136" text-anchor="middle" class="mono pill" fill="${accent}">ON INTENT</text>

      <rect y="184" width="852" height="78" rx="19" fill="#ffffff" fill-opacity=".5" stroke="#171717" stroke-opacity=".35" stroke-dasharray="7 7" stroke-width="1.5"/>
      <text x="22" y="230" class="mono" font-size="17" fill="#171717" fill-opacity=".7">03</text>
      <text x="80" y="218" class="sans layer-title">EXPERT</text>
      <text x="80" y="242" class="sans layer-copy">depth without clutter</text>
      <rect x="697" y="207" width="130" height="32" rx="16" fill="none" stroke="#171717" stroke-opacity=".65"/>
      <text x="762" y="228" text-anchor="middle" class="mono pill">ON DEMAND</text>

      <rect y="294" width="653" height="2" fill="url(#intent)"/>
      <text x="672" y="300" class="mono" font-size="12" fill="#68635b" letter-spacing="1.5">INTENT DEEPENS</text>
      <text x="832" y="304" class="sans" font-size="25" fill="${accent}">→</text>
    </g>
  </g>

  <line x1="68" y1="1133" x2="1012" y2="1133" stroke="#171717" stroke-opacity=".25" stroke-width="1.5"/>
  <rect x="68" y="1172" width="14" height="63" rx="7" fill="${signal}"/>
  ${svgTextLines(thesisLines, { x: 106, y: 1195, lineHeight: 40, className: 'sans', attributes: 'font-size="32" font-weight="650" letter-spacing="-0.7"' })}

  <text x="68" y="1301" class="mono" font-size="14" fill="#68635b">Explore the interactive concept</text>
  <text x="1012" y="1301" text-anchor="end" class="mono" font-size="14" font-weight="700">aaronguo.com/learn/${escapeHtml(brief.slug)} →</text>
</svg>`
}

function buildSvgCardSleek({ concept, brief }) {
  const visual = brief.visual || {}
  const card = brief.card || {}
  const background = escapeHtml(visual.background || '#0b0b0f')
  const accent = escapeHtml(visual.accent || '#7c6cff')
  const secondary = escapeHtml(visual.secondary || '#8ed9ff')
  const signal = escapeHtml(visual.signal || '#d7ff4f')
  const seriesNumber = String(brief.seriesNumber).padStart(3, '0')
  const titleLines = wrapWords(concept.en.title, 14, 3)
  const titleSize = titleLines.length > 2 ? 82 : 104
  const titleLineHeight = titleSize * .9
  const hookLines = Array.isArray(card.hook) ? card.hook.slice(0, 2) : wrapWords(brief.hook.en, 34, 2)
  const thesisLines = Array.isArray(card.thesis) ? card.thesis.slice(0, 2) : wrapWords(brief.mentalModel.en, 44, 2)

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350" role="img" aria-labelledby="title description">
  <title id="title">${escapeHtml(concept.en.title)} · Working Vocabulary</title>
  <desc id="description">${escapeHtml(brief.mentalModel.en)}</desc>
  <defs>
    <style>
      .sans { font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
      .mono { font-family: "SFMono-Regular", Menlo, Monaco, monospace; }
      .title { font-size: ${titleSize}px; font-weight: 760; letter-spacing: -5.5px; fill: #f7f7f4; }
      .layer-title { font-size: 20px; font-weight: 760; letter-spacing: 1.5px; }
      .layer-copy { font-size: 16px; }
      .pill { font-size: 11px; letter-spacing: 1.1px; font-weight: 700; }
    </style>
  </defs>

  <rect width="1080" height="1350" fill="${background}"/>
  <rect width="10" height="1350" fill="${accent}"/>

  <g transform="translate(68 66)">
    <path d="M0 32 L17 3 L34 32 Z" fill="${accent}"/>
    <circle cx="29" cy="25" r="13" fill="${secondary}"/>
    <text x="52" y="25" class="mono" font-size="18" font-weight="800" fill="#f7f7f4" letter-spacing="2.5">AARON GUO</text>
    <text x="944" y="25" text-anchor="end" class="mono" font-size="14" fill="#777783" letter-spacing="2">WORKING VOCABULARY / ${seriesNumber}</text>
  </g>

  <g>
    <circle cx="76" cy="201" r="6" fill="${signal}"/>
    <text x="98" y="207" class="mono" font-size="17" font-weight="800" fill="${accent}" letter-spacing="2.2">${escapeHtml(concept.en.domain.toUpperCase())}</text>
    ${svgTextLines(titleLines, { x: 68, y: 320, lineHeight: titleLineHeight, className: 'sans title' })}
    <text x="68" y="${titleLines.length > 2 ? 565 : 535}" class="mono" font-size="18" font-weight="700" fill="#a0a0aa" letter-spacing="1.4">${escapeHtml(hookLines[0] || '')}</text>
    <text x="68" y="${titleLines.length > 2 ? 600 : 570}" class="mono" font-size="18" font-weight="800" fill="${signal}" letter-spacing="1.4">${escapeHtml(hookLines[1] || '')}</text>
  </g>

  <text x="68" y="648" class="mono" font-size="13" font-weight="700" fill="#777783" letter-spacing="2">REVEALED AS INTENT DEEPENS</text>

  <g transform="translate(68 678)">
    <rect width="880" height="106" rx="24" fill="#f7f7f4"/>
    <text x="26" y="63" class="mono" font-size="17" font-weight="700" fill="#0b0b0f" fill-opacity=".44">01</text>
    <text x="88" y="47" class="sans layer-title" fill="#0b0b0f">ESSENTIAL</text>
    <text x="88" y="74" class="sans layer-copy" fill="#0b0b0f" fill-opacity=".58">complete first task</text>
    <rect x="726" y="35" width="126" height="36" rx="18" fill="#0b0b0f"/>
    <text x="789" y="58" text-anchor="middle" class="mono pill" fill="#f7f7f4">VISIBLE</text>

    <g transform="translate(48 126)">
      <rect width="832" height="106" rx="24" fill="${accent}"/>
      <text x="26" y="63" class="mono" font-size="17" font-weight="700" fill="#ffffff" fill-opacity=".55">02</text>
      <text x="88" y="47" class="sans layer-title" fill="#ffffff">CONTEXT</text>
      <text x="88" y="74" class="sans layer-copy" fill="#ffffff" fill-opacity=".72">appears when relevant</text>
      <rect x="656" y="35" width="148" height="36" rx="18" fill="none" stroke="#ffffff" stroke-opacity=".72"/>
      <text x="730" y="58" text-anchor="middle" class="mono pill" fill="#ffffff">ON INTENT</text>
    </g>

    <g transform="translate(96 252)">
      <rect width="784" height="106" rx="24" fill="#17171d" stroke="#373741" stroke-width="1.5"/>
      <text x="26" y="63" class="mono" font-size="17" font-weight="700" fill="#ffffff" fill-opacity=".35">03</text>
      <text x="88" y="47" class="sans layer-title" fill="#f7f7f4">EXPERT</text>
      <text x="88" y="74" class="sans layer-copy" fill="#ffffff" fill-opacity=".5">depth without clutter</text>
      <rect x="592" y="35" width="164" height="36" rx="18" fill="none" stroke="#777783"/>
      <text x="674" y="58" text-anchor="middle" class="mono pill" fill="#b1b1bb">ON DEMAND</text>
    </g>

    <rect y="390" width="880" height="3" fill="${signal}"/>
    <text x="880" y="424" text-anchor="end" class="mono" font-size="13" font-weight="700" fill="${signal}" letter-spacing="1.8">INTENT DEEPENS →</text>
  </g>

  <text x="68" y="1142" class="mono" font-size="13" font-weight="700" fill="#777783" letter-spacing="2">THE MENTAL MODEL</text>
  <text x="68" y="1194" class="sans" font-size="34" font-weight="690" fill="#f7f7f4" letter-spacing="-.7">${escapeHtml(thesisLines[0] || '')}</text>
  <text x="68" y="1238" class="sans" font-size="34" font-weight="690" fill="${signal}" letter-spacing="-.7">${escapeHtml(thesisLines[1] || '')}</text>

  <line x1="68" y1="1276" x2="1012" y2="1276" stroke="#2d2d35"/>
  <text x="68" y="1311" class="mono" font-size="13" fill="#777783">Read the full interactive explainer</text>
  <text x="1012" y="1311" text-anchor="end" class="mono" font-size="13" font-weight="700" fill="#f7f7f4">aaronguo.com/learn/${escapeHtml(brief.slug)} →</text>
</svg>`
}

function buildSvgCard({ concept, brief }) {
  if (brief.visual?.theme === 'editorial-light') return buildSvgCardEditorial({ concept, brief })
  return buildSvgCardSleek({ concept, brief })
}

async function renderPng(svgPath, pngPath) {
  await execFileAsync('/usr/bin/sips', ['-s', 'format', 'png', svgPath, '--out', pngPath])
}

function campaignUrl(baseUrl, source, content, campaignId) {
  const url = new URL(baseUrl)
  url.searchParams.set('utm_source', source)
  url.searchParams.set('utm_medium', 'social')
  url.searchParams.set('utm_campaign', campaignId)
  url.searchParams.set('utm_content', content)
  return url.toString()
}

function visualMarkup(primitive) {
  if (primitive !== 'layers') {
    return '<div class="generic-orbit"><span></span><span></span><span></span></div>'
  }

  return `
    <div class="layer-stack" aria-label="Three layers revealed as intent deepens">
      <div class="layer layer-one">
        <span class="layer-index">01</span>
        <div><strong>ESSENTIAL</strong><small>complete first task</small></div>
        <span class="layer-state">VISIBLE</span>
      </div>
      <div class="layer layer-two">
        <span class="layer-index">02</span>
        <div><strong>CONTEXT</strong><small>appears when relevant</small></div>
        <span class="layer-state">ON INTENT</span>
      </div>
      <div class="layer layer-three">
        <span class="layer-index">03</span>
        <div><strong>EXPERT</strong><small>depth without clutter</small></div>
        <span class="layer-state">ON DEMAND</span>
      </div>
      <div class="intent-line"><span></span><b>INTENT DEEPENS</b><i>→</i></div>
    </div>`
}

function buildCardEditorial({ concept, brief }) {
  const visual = brief.visual || {}
  const title = escapeHtml(concept.en.title)
  const zhTitle = escapeHtml(concept.zh.title)
  const domain = escapeHtml(concept.en.domain)
  const mentalModel = escapeHtml(brief.mentalModel.en)
  const accent = visual.accent || '#6d5dfc'
  const secondary = visual.secondary || '#9adcf7'
  const signal = visual.signal || '#d7ff4f'
  const seriesNumber = String(brief.seriesNumber).padStart(3, '0')

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=1080, initial-scale=1">
  <title>${title} · Working Vocabulary</title>
  <style>
    * { box-sizing: border-box; }
    html, body { width: 1080px; height: 1350px; margin: 0; overflow: hidden; }
    body {
      --accent: ${accent}; --secondary: ${secondary}; --signal: ${signal};
      color: #171717; background: #f4f1e9;
      font-family: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    .card { position: relative; width: 100%; height: 100%; padding: 68px; overflow: hidden; }
    .grid { position: absolute; inset: 0; opacity: .52; background-image: linear-gradient(rgba(23,23,23,.055) 1px, transparent 1px), linear-gradient(90deg, rgba(23,23,23,.055) 1px, transparent 1px); background-size: 54px 54px; }
    .orb { position: absolute; width: 620px; height: 620px; border: 1px solid rgba(23,23,23,.16); border-radius: 50%; right: -245px; top: -285px; box-shadow: 0 0 0 92px rgba(109,93,252,.04), 0 0 0 184px rgba(109,93,252,.025); }
    .brand { position: relative; z-index: 2; display: flex; justify-content: space-between; align-items: center; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 18px; letter-spacing: .14em; }
    .brand-left { display: flex; gap: 14px; align-items: center; font-weight: 800; }
    .mark { position: relative; width: 34px; height: 34px; }
    .mark::before { content: ''; position: absolute; left: 0; bottom: 2px; border-left: 16px solid transparent; border-right: 16px solid transparent; border-bottom: 28px solid var(--accent); opacity: .7; }
    .mark::after { content: ''; position: absolute; width: 24px; height: 24px; border-radius: 50%; right: -4px; bottom: 0; background: var(--secondary); }
    .series { color: #68635b; font-size: 15px; }
    .hero { position: relative; z-index: 2; margin-top: 92px; }
    .eyebrow { display: flex; align-items: center; gap: 18px; color: var(--accent); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 18px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }
    .eyebrow::after { content: ''; width: 70px; height: 1px; background: #171717; opacity: .35; }
    h1 { max-width: 890px; margin: 26px 0 0; font-size: 100px; line-height: .91; letter-spacing: -.07em; font-weight: 760; }
    .zh-title { margin-top: 24px; font-size: 31px; font-weight: 650; letter-spacing: .06em; }
    .visual-stage { position: relative; z-index: 2; margin-top: 60px; min-height: 455px; padding: 46px; border: 1.5px solid rgba(23,23,23,.25); border-radius: 34px; background: rgba(255,255,255,.58); box-shadow: 0 30px 80px rgba(30,25,18,.08); }
    .stage-label { margin-bottom: 30px; color: #6f6a62; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 14px; letter-spacing: .14em; }
    .layer-stack { display: grid; gap: 14px; }
    .layer { display: grid; grid-template-columns: 58px 1fr auto; gap: 20px; align-items: center; min-height: 82px; padding: 17px 22px; border-radius: 19px; }
    .layer-one { color: #fff; background: #171717; }
    .layer-two { border: 2px solid var(--accent); background: color-mix(in srgb, var(--accent) 10%, white); }
    .layer-three { border: 1.5px dashed rgba(23,23,23,.35); background: rgba(255,255,255,.5); }
    .layer-index { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 17px; opacity: .7; }
    .layer strong { display: block; font-size: 18px; letter-spacing: .08em; }
    .layer small { display: block; margin-top: 5px; font-size: 15px; opacity: .65; }
    .layer-state { padding: 8px 12px; border: 1px solid currentColor; border-radius: 999px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11px; letter-spacing: .08em; }
    .intent-line { display: flex; align-items: center; gap: 14px; margin-top: 14px; color: #68635b; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; letter-spacing: .12em; }
    .intent-line span { flex: 1; height: 2px; background: linear-gradient(90deg, var(--signal), var(--accent)); }
    .intent-line i { color: var(--accent); font-size: 24px; font-style: normal; }
    .thesis { position: relative; z-index: 2; display: grid; grid-template-columns: 16px 1fr; gap: 24px; margin-top: 43px; padding-top: 34px; border-top: 1.5px solid rgba(23,23,23,.25); }
    .thesis-mark { width: 14px; height: 62px; border-radius: 20px; background: var(--signal); }
    .thesis p { max-width: 890px; margin: 0; font-size: 34px; font-weight: 650; line-height: 1.22; letter-spacing: -.025em; }
    .footer { position: absolute; z-index: 2; left: 68px; right: 68px; bottom: 48px; display: flex; justify-content: space-between; align-items: center; color: #68635b; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 14px; letter-spacing: .04em; }
    .footer b { color: #171717; }
  </style>
</head>
<body>
  <main class="card">
    <div class="grid"></div><div class="orb"></div>
    <header class="brand">
      <div class="brand-left"><span class="mark"></span><span>AARON GUO</span></div>
      <span class="series">WORKING VOCABULARY / ${seriesNumber}</span>
    </header>
    <section class="hero">
      <div class="eyebrow">${domain}</div>
      <h1>${title}</h1>
      <div class="zh-title">${zhTitle}</div>
    </section>
    <section class="visual-stage">
      <div class="stage-label">COMPLEXITY ARRIVES ONLY WHEN IT EARNS ITS PLACE</div>
      ${visualMarkup(visual.primitive)}
    </section>
    <section class="thesis"><span class="thesis-mark"></span><p>${mentalModel}</p></section>
    <footer class="footer"><span>Explore the interactive concept</span><b>aaronguo.com/learn/${escapeHtml(brief.slug)} →</b></footer>
  </main>
</body>
</html>`
}

function buildCard({ concept, brief }) {
  if (brief.visual?.theme === 'editorial-light') return buildCardEditorial({ concept, brief })
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=1080, initial-scale=1">
  <title>${escapeHtml(concept.en.title)} · Working Vocabulary</title>
  <style>
    html, body { width: 1080px; height: 1350px; margin: 0; overflow: hidden; background: ${escapeHtml(brief.visual?.background || '#0b0b0f')}; }
    svg { display: block; width: 1080px; height: 1350px; }
  </style>
</head>
<body>${buildSvgCard({ concept, brief })}</body>
</html>`
}

function buildCampaign({ concept, brief, campaignId, date }) {
  const enUrl = `https://www.aaronguo.com${brief.canonicalPath}`
  const zhUrl = `https://www.aaronguo.com${brief.zhCanonicalPath}`
  const xUrl = campaignUrl(enUrl, 'x', 'concept-card-main', campaignId)
  const linkedInUrl = campaignUrl(enUrl, 'linkedin', 'concept-card-main', campaignId)
  const facebookUrl = campaignUrl(enUrl, 'facebook', 'concept-card-main', campaignId)

  return `# Concept Campaign Draft — ${concept.en.title}

**Prepared:** ${date}  
**Campaign ID:** \`${campaignId}\`  
**Status:** Local draft — blocked by pending \`A-001\` voice calibration  
**Cadence:** Eligible no sooner than 48 hours after the previous concept post  
**Concept:** [${concept.en.title}](${enUrl}) · [${concept.zh.title}](${zhUrl})  
**Asset:** \`card-4x5.png\`

## Distribution thesis

${brief.hook.en}

The post should make the concept useful before asking for a click. The article
link offers the interactive example, boundaries, and related-concept map.

## X

**Format:** 4:5 card with article link in a self-reply. Treat reply-link placement
as a campaign test, not an algorithm rule.

> Most products do not have too much complexity.
>
> They charge it too early.
>
> Progressive disclosure keeps the first task complete, then reveals depth as intent grows.
>
> The catch: high-consequence information should never be hidden.
>
> Full explainer in reply.

**Self-reply**

> Interactive explainer: ${xUrl}
>
> Where does your product make users pay complexity before they need it?

## LinkedIn

**Format:** Native card. Put the UTM link last if the account workflow supports
the intended preview; otherwise publish the image and place the link in the
first comment as an explicit experiment.

> Most products do not have too much complexity. They charge it too early.
>
> A common design response is to remove options. Progressive disclosure offers a better one: keep the first layer small but complete, then reveal depth only when the user's intent makes it relevant.
>
> The important boundary is consequence. A rarely used color profile can wait. A cost, permission change, or destructive action cannot hide behind “Advanced.”
>
> This is also a useful pattern for AI products. Start with a complete outcome, then expose controls, provenance, and expert intervention as the work becomes more consequential.
>
> Where does complexity appear too early in the tools your team uses?
>
> ${linkedInUrl}

## Facebook

**Format:** Personal context with native card and direct link.

> I have been building a working vocabulary of concepts that help me recognize patterns faster.
>
> Today's concept is Progressive Disclosure: complexity should not be deleted; it should appear as the user's intent deepens.
>
> I like it because it applies beyond interface design. AI tools, reports, decisions, and even explanations all become easier to use when the first layer is complete without pretending the deeper layers do not exist.
>
> What is one app that gives you every option before you are ready for it?
>
> ${facebookUrl}

## Guardrail

${brief.guardrail.en}

## Measurement

- Record canonical post IDs only after successful publication.
- Review UTM sessions, \`scroll_75\`, \`scroll_100\`, qualified replies, and
  profile visits at 24 hours and 7 days.
- Do not compare this concept against an article campaign as if the audiences,
  formats, or jobs were identical.
- Do not publish until the existing distribution employee records \`A-001\` as
  approved or Aaron explicitly changes that calibration sequence.
`
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const conceptDir = path.join(repoRoot, 'src/content/concepts', options.slug)
  const [manifestText, enMarkdown, zhMarkdown, briefText] = await Promise.all([
    readFile(path.join(conceptDir, 'manifest.json'), 'utf8'),
    readFile(path.join(conceptDir, 'en.md'), 'utf8'),
    readFile(path.join(conceptDir, 'zh.md'), 'utf8'),
    readFile(path.join(conceptDir, 'social-brief.json'), 'utf8'),
  ])

  const manifest = JSON.parse(manifestText)
  const brief = JSON.parse(briefText)
  if (manifest.status !== 'public-ready') throw new Error('Concept must be public-ready')
  if (brief.status !== 'eligible') throw new Error('Social brief must be eligible')
  if (!Number.isInteger(brief.seriesNumber) || brief.seriesNumber < 1) throw new Error('Social brief needs a positive seriesNumber')
  if (brief.card?.language !== 'en') throw new Error('The current social card renderer requires card.language to be en')
  if (manifest.slug !== brief.slug || manifest.slug !== options.slug) throw new Error('Slug mismatch')
  if (frontmatterValue(enMarkdown, 'published') !== 'true') throw new Error('English concept is not published')
  if (frontmatterValue(zhMarkdown, 'published') !== 'true') throw new Error('Chinese concept is not published')

  const concept = {
    en: {
      title: frontmatterValue(enMarkdown, 'title'),
      domain: frontmatterValue(enMarkdown, 'domain'),
    },
    zh: {
      title: frontmatterValue(zhMarkdown, 'title'),
      domain: frontmatterValue(zhMarkdown, 'domain'),
    },
  }
  const campaignId = `concept-${options.slug}-v1`
  const outputDir = path.join(
    repoRoot,
    'src/projects/aaronguoblog-brand-sales/concept-campaigns',
    `${options.date}-${options.slug}`,
  )
  const files = {
    'card-4x5.html': buildCard({ concept, brief }),
    'card-4x5.svg': buildSvgCard({ concept, brief }),
    'campaign.md': buildCampaign({ concept, brief, campaignId, date: options.date }),
    'campaign.json': `${JSON.stringify({
      schemaVersion: 1,
      campaignId,
      conceptSlug: options.slug,
      prepared: options.date,
      status: 'draft-awaiting-calibration',
      cadence: brief.cadence,
      sourceBrief: path.relative(repoRoot, path.join(conceptDir, 'social-brief.json')),
      card: 'card-4x5.png',
      vectorMaster: 'card-4x5.svg',
      htmlPreview: 'card-4x5.html',
      publicPostingAuthorized: false,
    }, null, 2)}\n`,
  }

  console.log(`${options.dryRun ? 'DRY RUN' : 'PREPARE'} ${options.slug}`)
  for (const [name, content] of Object.entries(files)) {
    console.log(`${path.relative(repoRoot, path.join(outputDir, name))} (${Buffer.byteLength(content)} bytes)`)
  }
  if (options.dryRun) return

  await mkdir(outputDir, { recursive: true })
  await Promise.all(
    Object.entries(files).map(([name, content]) => writeFile(path.join(outputDir, name), content)),
  )
  await renderPng(path.join(outputDir, 'card-4x5.svg'), path.join(outputDir, 'card-4x5.png'))
  console.log('Local preparation only. No social post, schedule, commit, push, or deployment was created.')
}

main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
