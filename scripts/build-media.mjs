#!/usr/bin/env node
// Generates responsive image derivatives for every project image in content/media.json.
//
//   card   16:9 crop at the image's focal point, 480/720/960w  (gallery cards)
//   hero   16:9 crop, 960/1440/1920w                          (case-study header)
//   detail native aspect ratio, 800/1200/1600w               (secondary visual)
//   og     1200x630 JPEG                                      (social preview)
//
// Masters stay untouched in media-src/. Output goes to public/media/<id>/ and the
// derivative index to content/media-derivatives.json, both committed so production
// builds never depend on the masters. Run after adding or changing media:
//
//   npm run media            (only missing outputs)
//   npm run media -- --force (regenerate everything)

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const force = process.argv.includes('--force')
const { media } = JSON.parse(fs.readFileSync(path.join(root, 'content/media.json'), 'utf8'))
const projects = fs
  .readdirSync(path.join(root, 'content/projects'))
  .filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(fs.readFileSync(path.join(root, 'content/projects', f), 'utf8')))

const VARIANTS = {
  card: { widths: [480, 720, 960], ratio: 16 / 9, avif: 50, webp: 72 },
  hero: { widths: [960, 1440, 1920], ratio: 16 / 9, avif: 52, webp: 76 },
  detail: { widths: [800, 1200, 1600], ratio: null, avif: 58, webp: 80 },
}

// Which variants each image needs, derived from how projects reference it.
const usage = new Map()
const need = (id, variant) => {
  if (!usage.has(id)) usage.set(id, new Set())
  usage.get(id).add(variant)
}
for (const project of projects) {
  need(project.media.cover, 'card')
  need(project.media.cover, 'og')
  need(project.media.hero, 'hero')
  need(project.media.detail, 'detail')
}

function focalCrop(width, height, ratio, position) {
  const [px, py] = (position ?? '50% 50%').split(' ').map((v) => parseFloat(v) / 100)
  let cropW = width
  let cropH = Math.round(width / ratio)
  if (cropH > height) {
    cropH = height
    cropW = Math.round(height * ratio)
  }
  const left = Math.round(Math.min(Math.max(px * width - cropW / 2, 0), width - cropW))
  const top = Math.round(Math.min(Math.max(py * height - cropH / 2, 0), height - cropH))
  return { left, top, width: cropW, height: cropH }
}

const index = {}
let written = 0

for (const [id, variants] of usage) {
  const entry = media[id]
  if (!entry) {
    console.warn(`missing media entry: ${id}`)
    continue
  }
  const sourcePath = path.join(root, entry.source)
  const outDir = path.join(root, 'public/media', id)
  fs.mkdirSync(outDir, { recursive: true })
  const meta = await sharp(sourcePath).metadata()
  index[id] = {}

  for (const variant of variants) {
    if (variant === 'og') {
      const file = path.join(outDir, 'og.jpg')
      if (force || !fs.existsSync(file)) {
        const box = focalCrop(meta.width, meta.height, 1200 / 630, entry.position)
        await sharp(sourcePath).extract(box).resize(1200, 630).jpeg({ quality: 80, mozjpeg: true }).toFile(file)
        written++
      }
      index[id].og = `/media/${id}/og.jpg`
      continue
    }

    const spec = VARIANTS[variant]
    const box = spec.ratio
      ? focalCrop(meta.width, meta.height, spec.ratio, entry.position)
      : { left: 0, top: 0, width: meta.width, height: meta.height }
    // Never upscale: drop widths larger than the crop, keep the crop width itself instead.
    let widths = spec.widths.filter((w) => w <= box.width)
    if (widths.length < spec.widths.length && !widths.includes(box.width)) widths.push(box.width)
    widths = [...new Set(widths)].sort((a, b) => a - b)

    const out = { width: 0, height: 0, avif: [], webp: [] }
    for (const w of widths) {
      const h = Math.round((w * box.height) / box.width)
      for (const format of ['avif', 'webp']) {
        const file = path.join(outDir, `${variant}-${w}.${format}`)
        if (force || !fs.existsSync(file)) {
          const pipeline = sharp(sourcePath).extract(box).resize(w, h)
          if (format === 'avif') await pipeline.avif({ quality: spec.avif, effort: 6 }).toFile(file)
          else await pipeline.webp({ quality: spec.webp, effort: 6 }).toFile(file)
          written++
        }
        out[format].push({ w, src: `/media/${id}/${variant}-${w}.${format}`, bytes: fs.statSync(file).size })
      }
      out.width = w
      out.height = h
    }
    index[id][variant] = out
  }
}

fs.writeFileSync(path.join(root, 'content/media-derivatives.json'), JSON.stringify(index, null, 2) + '\n')

// Logos and marks: the originals are 100–270 KB PNGs displayed at 40–110 CSS px.
// Derivatives are 2x the largest displayed width, as lossless-quality WebP.
const LOGOS = [
  ['src/assets/dhtrans.png', 'dh-mark', 128],
  ['src/assets/kewaunee-logo.png', 'kewaunee', 128],
  ['src/assets/higgins-digital-mark.png', 'higgins-digital', 192],
  ['src/assets/experience-pdt-logo.png', 'pdt', 192],
  ['src/assets/experience-hbg-logo-white.png', 'hbg', 192],
  ['src/assets/experience-tus-logo.png', 'tus', 192],
  ['src/assets/experience-lakeside-logo.png', 'lakeside', 192],
  ['src/assets/experience-one-chaptr-logo.webp', 'one-chaptr', 192],
  ['public/docs/teeslylogo.png', 'teesly', 192],
  ['src/assets/uncclogotrans.png', 'uncc', 180],
  ['src/assets/cvcctrans2!.png', 'cvcc', 120],
  ['src/assets/project-cade.png', 'project-cade', 352],
  ['src/assets/project-contender.png', 'project-contender', 224],
  ['src/assets/project-flowcast.png', 'project-flowcast', 352],
  ['src/assets/project-dhlm.png', 'project-dhlm', 224],
  ['src/assets/higgins-digital-mark.png', 'project-higgins-digital', 224],
  ['src/assets/project-prospectiq.png', 'project-prospectiq', 224],
  ['src/assets/crowncode-logo.png', 'project-crowncode', 224],
  ['src/assets/curated-notes-logo.png', 'project-curated-notes', 224],
]
const logoDir = path.join(root, 'src/assets/opt')
fs.mkdirSync(logoDir, { recursive: true })
for (const [source, name, width] of LOGOS) {
  const file = path.join(logoDir, `${name}.webp`)
  if (!force && fs.existsSync(file)) continue
  await sharp(path.join(root, source)).resize({ width, withoutEnlargement: true }).webp({ quality: 90, alphaQuality: 100, effort: 6 }).toFile(file)
  written++
}
{
  // Portrait for the Home hero: 1061x1400 source shown at <=416 CSS px.
  const file = path.join(logoDir, 'headshot.webp')
  if (force || !fs.existsSync(file)) {
    await sharp(path.join(root, 'src/assets/founder-headshot.webp')).resize({ width: 800 }).webp({ quality: 82, effort: 6 }).toFile(file)
    written++
  }
  // Default social image: the main site's portfolio cover.
  const og = path.join(root, 'public/og-default.jpg')
  if (force || !fs.existsSync(og)) {
    await sharp(path.join(root, media['dh-portfolio-cover'].source)).resize(1200, 630, { fit: 'cover' }).jpeg({ quality: 82, mozjpeg: true }).toFile(og)
    written++
  }
}
for (const [size, name] of [[64, 'favicon.png'], [180, 'apple-touch-icon.png']]) {
  const file = path.join(root, 'public', name)
  if (!force && fs.existsSync(file)) continue
  await sharp(path.join(root, 'src/assets/dh-logo.png')).resize(size, size, { fit: 'contain', background: '#ffffff' }).png().toFile(file)
  written++
}

// Budget report: largest delivered derivative per variant.
const report = {}
for (const variants of Object.values(index)) {
  for (const [variant, data] of Object.entries(variants)) {
    if (variant === 'og') continue
    for (const format of ['avif', 'webp']) {
      for (const item of data[format]) {
        const key = `${variant}-${item.w <= 720 ? 'small' : item.w <= 1200 ? 'medium' : 'large'}-${format}`
        report[key] = Math.max(report[key] ?? 0, item.bytes)
      }
    }
  }
}
console.log(`media: ${usage.size} images, ${written} files written`)
for (const [key, bytes] of Object.entries(report).sort()) console.log(`  max ${key.padEnd(22)} ${(bytes / 1024).toFixed(0)} KB`)
