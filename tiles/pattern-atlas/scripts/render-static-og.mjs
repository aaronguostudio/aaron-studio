#!/usr/bin/env node

import { mkdir, readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
import process from 'node:process'

function parseArgs(argv) {
  const result = {
    input: '',
    output: '',
    logo: '',
    title: '',
    badge: 'PATTERN',
    subtitle: '',
    footer: 'aaronguo.com/learn',
  }

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index]
    const next = argv[index + 1] || ''
    if (value === '--input') result.input = next
    if (value === '--output') result.output = next
    if (value === '--logo') result.logo = next
    if (value === '--title') result.title = next
    if (value === '--badge') result.badge = next
    if (value === '--subtitle') result.subtitle = next
    if (value === '--footer') result.footer = next
  }

  return result
}

function escapeXml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function splitTitle(value) {
  if (value.includes('|'))
    return value
      .split('|')
      .map((line) => line.trim())
      .filter(Boolean)

  const words = value.trim().split(/\s+/)
  if (words.length < 2) return words

  const midpoint = Math.ceil(words.length / 2)
  return [words.slice(0, midpoint).join(' '), words.slice(midpoint).join(' ')]
}

const args = parseArgs(process.argv.slice(2))
if (!args.input || !args.output || !args.logo || !args.title) {
  throw new Error('Pass --input, --output, --logo, and --title.')
}

const studioRoot = process.cwd()
const config = JSON.parse(
  await readFile(path.join(studioRoot, 'config', 'aaron-studio.json'), 'utf8'),
)
const blogRoot = path.resolve(config.blogRepo)
const requireFromBlog = createRequire(path.join(blogRoot, 'package.json'))
const sharp = requireFromBlog('sharp')

const width = 1200
const height = 627
const titleLines = splitTitle(args.title).slice(0, 2)
const titleMarkup = titleLines
  .map((line, index) => `<tspan x="68" dy="${index === 0 ? 0 : 62}">${escapeXml(line)}</tspan>`)
  .join('')

const overlay = Buffer.from(`
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="quiet" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stop-color="#fbf8f3" stop-opacity="0.98"/>
        <stop offset="0.34" stop-color="#fbf8f3" stop-opacity="0.92"/>
        <stop offset="0.51" stop-color="#fbf8f3" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <rect width="720" height="627" fill="url(#quiet)"/>
    <rect x="126" y="54" width="${Math.max(128, args.badge.length * 8.3 + 34)}" height="36" rx="18" fill="#f5f2ed" stroke="#d8d3cb"/>
    <text x="143" y="77" fill="#282727" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="700" letter-spacing="1.4">${escapeXml(args.badge)}</text>
    <text x="68" y="244" fill="#171717" font-family="Arial, Helvetica, sans-serif" font-size="60" font-weight="720" letter-spacing="-2.5">${titleMarkup}</text>
    <line x1="68" y1="398" x2="118" y2="398" stroke="#7592c7" stroke-width="5" stroke-linecap="round"/>
    <text x="68" y="444" fill="#45433f" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="500" letter-spacing="-0.3">${escapeXml(args.subtitle)}</text>
    <text x="68" y="559" fill="#6b6862" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="600" letter-spacing="0.3">${escapeXml(args.footer)}</text>
  </svg>
`)

const logo = await sharp(args.logo).resize(46, 46, { fit: 'cover' }).png().toBuffer()

await mkdir(path.dirname(args.output), { recursive: true })
await sharp(args.input)
  .resize(width, height, { fit: 'cover', position: 'centre' })
  .composite([
    { input: overlay, top: 0, left: 0 },
    { input: logo, top: 49, left: 68 },
  ])
  .flatten({ background: '#fbf8f3' })
  .jpeg({ quality: 91, chromaSubsampling: '4:4:4', progressive: true })
  .toFile(args.output)

const metadata = await sharp(args.output).metadata()
if (metadata.width !== width || metadata.height !== height || metadata.format !== 'jpeg') {
  throw new Error(`Unexpected output: ${metadata.width}x${metadata.height} ${metadata.format}`)
}

console.log(`${args.output} (${metadata.width}x${metadata.height}, ${metadata.format})`)
