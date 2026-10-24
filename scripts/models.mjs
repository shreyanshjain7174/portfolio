// Prepare the showroom's real models.
//   1. Each slot in models-src/sources.json needs models-src/<slot>.glb.
//      With SKETCHFAB_TOKEN set, missing files are fetched from Sketchfab's download API.
//   2. Every present file is optimised for the web (meshopt geometry, WebP textures at 1024px,
//      heavy meshes simplified) into public/models/<slot>.glb.
//   3. src/components/showroom/modelManifest.ts is rewritten so the scene loads exactly what exists.
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

function findGltf(dir) {
  for (const f of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, f.name)
    if (f.isDirectory()) { const r = findGltf(p); if (r) return r }
    else if (f.name.endsWith('.gltf')) return p
  }
  return null
}

const sources = JSON.parse(readFileSync('models-src/sources.json', 'utf8'))
const token = process.env.SKETCHFAB_TOKEN
console.log(token ? 'Using SKETCHFAB_TOKEN to fetch missing models.' : 'No SKETCHFAB_TOKEN set: only files already in models-src/ will be used.')
const out = {}

for (const [slot, s] of Object.entries(sources)) {
  if (slot.startsWith('_')) continue
  const raw = `models-src/${slot}.glb`
  if (!existsSync(raw) && token) {
    const res = await fetch(`https://api.sketchfab.com/v3/models/${s.uid}/download`, { headers: { Authorization: `Token ${token}` } })
    const info = await res.json().catch(() => ({}))
    if (!res.ok) { console.log(`✗ ${slot}: Sketchfab said ${res.status} ${info.detail ?? ''}`.trim()); continue }
    if (info.glb?.url) {
      writeFileSync(raw, Buffer.from(await (await fetch(info.glb.url)).arrayBuffer()))
      console.log(`fetched ${slot} (glb)`)
    } else if (info.gltf?.url) {
      // zipped glTF: unpack it and pack it into one .glb
      const zip = `models-src/${slot}.zip`, dir = `models-src/${slot}`
      writeFileSync(zip, Buffer.from(await (await fetch(info.gltf.url)).arrayBuffer()))
      rmSync(dir, { recursive: true, force: true }); mkdirSync(dir)
      execFileSync('unzip', ['-o', '-q', zip, '-d', dir])
      const scene = findGltf(dir)
      if (!scene) { console.log(`✗ ${slot}: no .gltf inside the zip`); continue }
      execFileSync('npx', ['-y', '@gltf-transform/cli@4.1.1', 'copy', scene, raw], { stdio: 'inherit' })
      rmSync(zip, { force: true }); rmSync(dir, { recursive: true, force: true })
      console.log(`fetched ${slot} (gltf → glb)`)
    } else console.log(`✗ ${slot}: no downloadable format offered`)
  }
  if (!existsSync(raw)) { console.log(`missing ${slot} (primitive stays)`); continue }
  const dest = `public/models/${slot}.glb`
  const base = ['-y', '@gltf-transform/cli@4.1.1', 'optimize', raw, dest, '--compress', 'meshopt', '--texture-compress', 'webp', '--texture-size', '1024']
  try {
    execFileSync('npx', [...base, '--simplify', 'true', '--simplify-ratio', '0.5', '--simplify-error', '0.001'], { stdio: 'inherit' })
  } catch {
    // some meshes trip the simplifier; keep their full geometry instead of failing the whole run
    try { execFileSync('npx', [...base, '--simplify', 'false'], { stdio: 'inherit' }) }
    catch { console.log(`✗ ${slot}: could not be optimised, skipped`); continue }
  }
  out[slot] = { file: `${slot}.glb`, credit: `“${s.title}” by ${s.author}, CC BY 4.0, sketchfab.com` }
  console.log(`${slot}: ${(statSync(dest).size / 1e6).toFixed(1)} MB`)
}

const prev = existsSync('src/components/showroom/modelManifest.ts') ? readFileSync('src/components/showroom/modelManifest.ts', 'utf8') : ''
const yaw = Object.fromEntries([...prev.matchAll(/'([\w-]+)': \{[^}]*yaw: ([-\d.]+)/g)].map((m) => [m[1], Number(m[2])]))
for (const k of Object.keys(out)) if (yaw[k] !== undefined) out[k].yaw = yaw[k]
writeFileSync('src/components/showroom/modelManifest.ts',
`// Written by scripts/models.mjs: the real models that are present in /public/models.
// Anything not listed here is drawn from primitives until its file arrives. \`yaw\` turns a model to face the room.
export const AVAILABLE_MODELS: Record<string, { file: string; credit: string; yaw?: number }> = ${JSON.stringify(out, null, 2).replace(/"([\w-]+)":/g, "'$1':").replace(/"/g, "'")}
`)
console.log(`manifest: ${Object.keys(out).length} real models`)
