#!/usr/bin/env node

import { access, copyFile, mkdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

function parseArgs(argv) {
  const result = { slug: '', dryRun: false, check: false }
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index]
    if (value === '--slug') result.slug = argv[index + 1] || ''
    if (value === '--dry-run') result.dryRun = true
    if (value === '--check') result.check = true
  }
  return result
}

async function exists(filePath) {
  try {
    await access(filePath)
    return true
  } catch {
    return false
  }
}

async function sameContent(source, destination) {
  if (!(await exists(destination))) return false
  const [left, right] = await Promise.all([readFile(source), readFile(destination)])
  return left.equals(right)
}

async function validateVisualThemeContract(visualPath) {
  const source = await readFile(visualPath, 'utf8')
  const retiredTokens = [
    '--color-text',
    '--color-text-muted',
    '--color-surface',
    '--color-surface-soft',
  ]
  const foundRetiredTokens = retiredTokens.filter((token) => source.includes(token))

  if (foundRetiredTokens.length > 0) {
    throw new Error(
      `Visual uses retired light-only theme token(s): ${foundRetiredTokens.join(', ')}. ` +
        'Use the blog runtime tokens documented in references/visual-system.md.',
    )
  }

  const requiredTokens = ['var(--foreground)', 'var(--muted-foreground)']
  const missingTokens = requiredTokens.filter((token) => !source.includes(token))

  if (missingTokens.length > 0) {
    throw new Error(
      `Visual is missing required theme token(s): ${missingTokens.join(', ')}. ` +
        'Public Learn components must inherit the site light/dark theme.',
    )
  }
}

const args = parseArgs(process.argv.slice(2))
if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(args.slug)) {
  throw new Error('Pass a kebab-case concept slug with --slug <slug>.')
}
if (args.dryRun && args.check) {
  throw new Error('Use either --dry-run or --check, not both.')
}

const studioRoot = process.cwd()
const configPath = path.join(studioRoot, 'config', 'aaron-studio.json')
const config = JSON.parse(await readFile(configPath, 'utf8'))
const contentRoot = path.resolve(studioRoot, config.contentRoot || 'src/content')
const blogRoot = path.resolve(config.blogRepo)
const packageRoot = path.join(contentRoot, 'concepts', args.slug)
const manifestPath = path.join(packageRoot, 'manifest.json')

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
if (manifest.slug !== args.slug) {
  throw new Error(`Manifest slug ${manifest.slug} does not match ${args.slug}.`)
}

const mappings = [
  ['en.md', path.join(blogRoot, 'content', 'learn', 'en', `${args.slug}.md`)],
  ['zh.md', path.join(blogRoot, 'content', 'learn', 'zh', `${args.slug}.md`)],
]

const visualSource = path.join(packageRoot, 'visual.vue')
if (await exists(visualSource)) {
  await validateVisualThemeContract(visualSource)
  mappings.push([
    'visual.vue',
    path.join(blogRoot, 'components', 'learn', 'concepts', `${args.slug}.vue`),
  ])
}

const scaffold = path.join(blogRoot, 'pages', 'learn', 'index.vue')
if (!(await exists(scaffold))) {
  throw new Error(`Blog Learn scaffold is missing: ${scaffold}`)
}

let differences = 0
for (const [relativeSource, destination] of mappings) {
  const source = path.join(packageRoot, relativeSource)
  if (!(await exists(source))) throw new Error(`Missing public package file: ${source}`)
  const isCurrent = await sameContent(source, destination)
  const label = `${path.relative(studioRoot, source)} -> ${path.relative(blogRoot, destination)}`

  if (args.check) {
    if (!isCurrent) {
      differences += 1
      console.error(`DIFF ${label}`)
    } else {
      console.log(`OK   ${label}`)
    }
    continue
  }

  if (args.dryRun) {
    console.log(`${isCurrent ? 'KEEP' : 'COPY'} ${label}`)
    continue
  }

  if (isCurrent) {
    console.log(`KEEP ${label}`)
    continue
  }

  await mkdir(path.dirname(destination), { recursive: true })
  await copyFile(source, destination)
  console.log(`COPY ${label}`)
}

if (args.check && differences > 0) {
  throw new Error(`${differences} public concept file(s) are missing or out of date.`)
}

console.log(
  'Local sync only. No commit, push, deployment, or production alias change was performed.',
)
