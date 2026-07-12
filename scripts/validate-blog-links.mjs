#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const repoRoot = process.cwd()
const configPath = path.join(repoRoot, 'config/aaron-studio.json')

function parseArgs(argv) {
  const args = {
    blogRoot: undefined,
    files: [],
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--blog-root') {
      args.blogRoot = argv[index + 1]
      index += 1
      continue
    }

    if (arg.startsWith('--blog-root=')) {
      args.blogRoot = arg.slice('--blog-root='.length)
      continue
    }

    args.files.push(arg)
  }

  return args
}

function loadBlogRoot(cliBlogRoot) {
  if (cliBlogRoot) return path.resolve(cliBlogRoot)

  if (!existsSync(configPath)) {
    throw new Error(`Missing config file: ${configPath}`)
  }

  const config = JSON.parse(readFileSync(configPath, 'utf8'))
  if (!config.blogRepo) {
    throw new Error(`Missing blogRepo in ${configPath}`)
  }

  return config.blogRepo
}

function listMarkdownFiles(dir) {
  if (!existsSync(dir)) return []

  return readdirSync(dir)
    .filter((file) => file.endsWith('.md'))
    .map((file) => path.join(dir, file))
}

function buildBlogRoutes(blogRoot) {
  const routes = new Set()

  for (const locale of ['en', 'zh']) {
    const dir = path.join(blogRoot, 'content', 'blogs', locale)

    for (const filePath of listMarkdownFiles(dir)) {
      const filename = path.basename(filePath)
      const slug = filename.replace(/^\d+\./, '').replace(/\.md$/, '')
      const route = locale === 'en' ? `/blogs/${slug}` : `/zh/blogs/${slug}`

      routes.add(route)
      routes.add(`${route}/`)
    }
  }

  return routes
}

function resolveInputFiles(blogRoot, files) {
  if (files.length > 0) {
    return files.map((file) => (path.isAbsolute(file) ? file : path.join(blogRoot, file)))
  }

  return [
    ...listMarkdownFiles(path.join(blogRoot, 'content', 'blogs', 'en')),
    ...listMarkdownFiles(path.join(blogRoot, 'content', 'blogs', 'zh')),
  ]
}

function stripFencedCode(markdown) {
  return markdown.replace(/```[\s\S]*?```/g, (block) => '\n'.repeat(block.split('\n').length - 1))
}

function lineNumberAt(text, offset) {
  return text.slice(0, offset).split('\n').length
}

function cleanUrl(url) {
  return url.split(/[?#]/)[0]
}

function isExternalUrl(url) {
  return /^(https?:|mailto:|tel:|sms:)/i.test(url)
}

function validateFile({ blogRoot, filePath, routes }) {
  const issues = []
  const rawText = readFileSync(filePath, 'utf8')
  const text = stripFencedCode(rawText)
  const linkPattern = /(!?)\[[^\]]*]\(([^)\s]+)(?:\s+["'][^)]*["'])?\)/g
  let linkCount = 0

  for (const match of text.matchAll(linkPattern)) {
    const isImage = match[1] === '!'
    const url = match[2]
    const line = lineNumberAt(text, match.index ?? 0)

    if (!url || url.startsWith('#') || isExternalUrl(url)) {
      linkCount += 1
      continue
    }

    const target = cleanUrl(url)
    if (!target) {
      linkCount += 1
      continue
    }

    if (target.startsWith('/blogs-img/')) {
      const imagePath = path.join(blogRoot, 'public', target)
      if (!existsSync(imagePath) || !statSync(imagePath).isFile()) {
        issues.push({ filePath, line, url, message: 'missing blog image file' })
      }
      linkCount += 1
      continue
    }

    if (target.startsWith('/blogs/') || target.startsWith('/zh/blogs/')) {
      const normalized = target.endsWith('/') ? target : target.replace(/\/$/, '')
      if (!routes.has(normalized) && !routes.has(`${normalized}/`)) {
        issues.push({ filePath, line, url, message: 'unknown internal blog route' })
      }
      linkCount += 1
      continue
    }

    if (target.startsWith('../') || target.startsWith('./') || target.endsWith('.md')) {
      issues.push({
        filePath,
        line,
        url,
        message: 'source-relative markdown link must be converted to a public blog route',
      })
      linkCount += 1
      continue
    }

    if (isImage) {
      issues.push({
        filePath,
        line,
        url,
        message: 'published blog images should use /blogs-img/ paths',
      })
      linkCount += 1
      continue
    }

    linkCount += 1
  }

  return { issues, linkCount }
}

function main() {
  const args = parseArgs(process.argv.slice(2))
  const blogRoot = loadBlogRoot(args.blogRoot)
  const routes = buildBlogRoutes(blogRoot)
  const files = resolveInputFiles(blogRoot, args.files)
  const issues = []
  let linkCount = 0

  for (const filePath of files) {
    if (!existsSync(filePath)) {
      issues.push({ filePath, line: 0, url: '', message: 'file does not exist' })
      continue
    }

    const result = validateFile({ blogRoot, filePath, routes })
    issues.push(...result.issues)
    linkCount += result.linkCount
  }

  if (issues.length > 0) {
    console.error('Blog link validation failed:')
    for (const issue of issues) {
      const rel = path.relative(blogRoot, issue.filePath)
      const location = issue.line > 0 ? `${rel}:${issue.line}` : rel
      const url = issue.url ? ` (${issue.url})` : ''
      console.error(`- ${location}${url}: ${issue.message}`)
    }
    process.exit(1)
  }

  console.log(`Blog link validation passed: ${files.length} file(s), ${linkCount} markdown link(s), ${routes.size / 2} blog route(s).`)
}

main()
