import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'
import { HALL_OF_FAME, HOBBIES, PROJECTS, SKILL_RACKS, SOCIALS } from '@/content/content'
import { AVAILABLE_MODELS } from './modelManifest'
import {
  MAT, car, motorcycle, plinth, placard, jacket, watch, loungeChair, skyline, type CarKind,
  suitStand, honour, socialPlate, frame,
} from './models'
import { HIGHLIGHT_SKILLS } from '@/content/content'
import { PROJECT_IMAGES, STATIONS, SUITS, VEHICLES, WATCHES } from './stations'

export type SceneApi = {
  setStation: (k: number) => void
  setProject: (i: number) => void
  openDoors: () => void
  setPaused: (p: boolean) => void
  dispose: () => void
}

type Opts = {
  canvas: HTMLCanvasElement
  small: boolean
  reduce: boolean
  labels: Record<string, string[]>
  onHover: (id: string | null, x: number, y: number) => void
  onSelect: (id: string) => void
  onProgress?: (done: number, total: number) => void
}

const box = (w: number, h: number, d: number, m: THREE.Material) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m)

export async function createShowroom(o: Opts): Promise<SceneApi> {
  const renderer = new THREE.WebGLRenderer({ canvas: o.canvas, antialias: true, powerPreference: 'high-performance' })
  const maxDpr = Math.min(window.devicePixelRatio, o.small ? 1.25 : 1.5)
  let dpr = Math.min(maxDpr, 1.25)
  renderer.setPixelRatio(dpr)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.shadowMap.enabled = false
  renderer.shadowMap.type = THREE.PCFSoftShadowMap


  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x07080b)
  scene.fog = new THREE.Fog(0x07080b, 18, 46)
  const pmrem = new THREE.PMREMGenerator(renderer)
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  scene.environmentIntensity = 0.32


  const camera = new THREE.PerspectiveCamera(o.small ? 58 : 46, 1, 0.1, 120)
  const interactive: { id: string; obj: THREE.Object3D }[] = []
  const clocks: ReturnType<typeof watch>[] = []

  /* ---------- real models: each slot shows its primitive until the real file is present ---------- */
  const gltf = new GLTFLoader()
  gltf.setMeshoptDecoder(MeshoptDecoder)
  const v1 = new THREE.Vector3(), v2 = new THREE.Vector3()
  type Fit = { len?: number; height?: number; tint?: number; flat?: boolean; mute?: boolean }
  // models load one at a time in walking order (garage first), each in an idle moment,
  // so arriving never stalls the frame the visitor is looking at
  const queue: (() => Promise<void>)[] = []
  let needsFrame = true
  let loaded = 0
  const idle = () => new Promise<void>((r) => ('requestIdleCallback' in window ? requestIdleCallback(() => r(), { timeout: 400 }) : setTimeout(r, 30)))
  function slot(key: string, holder: THREE.Object3D, fallback: THREE.Object3D, fit: Fit) {
    holder.add(fallback)
    const entry = key ? AVAILABLE_MODELS[key] : undefined
    if (!entry) return
    queue.push(async () => {
      const g = await gltf.loadAsync(`/models/${entry.file}`)
      await idle()
      const obj = g.scene
      if (fit.flat) {
        // lay it down: the thinnest axis becomes vertical, so a watch rests dial-up
        const sz = new THREE.Box3().setFromObject(obj).getSize(v1)
        if (sz.z <= sz.x && sz.z <= sz.y) obj.rotation.x = -Math.PI / 2
        else if (sz.x <= sz.y && sz.x <= sz.z) obj.rotation.z = Math.PI / 2
      }
      if (entry.yaw) obj.rotation.y += entry.yaw
      if (fit.tint !== undefined) {
        // some models ship unpainted: give their bare bodywork a proper clearcoat
        const paint = MAT.paint(fit.tint)
        obj.traverse((m) => {
          const mesh = m as THREE.Mesh
          if (!mesh.isMesh) return
          const mat = mesh.material as THREE.MeshStandardMaterial
          if (!mat || Array.isArray(mat) || mat.map || mat.transparent) return
          const c = mat.color
          if (c && c.r * 0.3 + c.g * 0.59 + c.b * 0.11 > 0.7) mesh.material = paint
        })
      }
      if (fit.mute) {
        // a tailor's dummy should disappear behind the suit: strong colours become charcoal
        const charcoal = new THREE.MeshStandardMaterial({ color: 0x2a2826, roughness: 0.7 })
        obj.traverse((m) => {
          const mesh = m as THREE.Mesh
          const mat = mesh.material as THREE.MeshStandardMaterial
          if (!mesh.isMesh || !mat || Array.isArray(mat) || !mat.color) return
          const { r, g, b } = mat.color
          if (Math.max(r, g, b) - Math.min(r, g, b) > 0.25) mesh.material = charcoal
        })
      }
      const wrap = new THREE.Group(); wrap.add(obj)
      const b = new THREE.Box3().setFromObject(wrap), size = b.getSize(v1)
      const k = fit.height ? fit.height / size.y : (fit.len ?? 1) / Math.max(size.x, size.z)
      wrap.scale.setScalar(k)
      b.setFromObject(wrap); const c = b.getCenter(v2)
      wrap.position.set(-c.x, -b.min.y, -c.z)
      const outer = new THREE.Group(); outer.add(wrap)
      outer.traverse((m) => {
        const mesh = m as THREE.Mesh
        if (!mesh.isMesh) return
        mesh.castShadow = false; mesh.receiveShadow = false
        // upload textures now, in idle time, instead of on the first frame that shows them
        for (const mat of ([] as THREE.Material[]).concat(mesh.material)) {
          for (const v of Object.values(mat)) if (v && (v as THREE.Texture).isTexture) renderer.initTexture(v as THREE.Texture)
        }
      })
      await renderer.compileAsync(outer, camera, scene)
      holder.remove(fallback); holder.add(outer)
      needsFrame = true
    })
  }
  async function drainQueue() {
    const total = queue.length
    o.onProgress?.(0, total)
    for (const job of queue) {
      try { await job() } catch { /* the primitive stays in place */ }
      o.onProgress?.(++loaded, total)
      await idle()
    }
    await warmUp()
  }
  // render every stop once, small and off-screen, in idle time: textures upload and shaders
  // link now, so walking into a room for the first time never stalls
  async function warmUp() {
    const rt = new THREE.WebGLRenderTarget(256, 160)
    const cam = camera.clone()
    for (const st of STATIONS) {
      await idle()
      cam.position.set(...st.pos); cam.lookAt(...st.look); cam.updateMatrixWorld()
      renderer.setRenderTarget(rt); renderer.render(scene, cam); renderer.setRenderTarget(null)
    }
    rt.dispose()
    needsFrame = true
  }

  /* ---------- floor: a mirror under a dark stone skin, so reflections stay soft ---------- */
  // polished stone: environment reflections only, so the room is drawn once per frame
  const floorGeo = new THREE.PlaneGeometry(78, 34)
  const stone = new THREE.Mesh(
    floorGeo,
    new THREE.MeshPhysicalMaterial({ color: 0x0e0e0f, roughness: 0.22, metalness: 0.05, clearcoat: 1, clearcoatRoughness: 0.12 }),
  )
  stone.rotation.x = -Math.PI / 2
  stone.position.set(20, 0, 3)
  stone.receiveShadow = true
  scene.add(stone)

  /* ---------- architecture ---------- */
  const walnut = MAT.walnut()
  const plaster = new THREE.MeshStandardMaterial({ color: 0x141312, roughness: 0.9 })
  const ceiling = box(68, 0.1, 14, new THREE.MeshStandardMaterial({ color: 0x0d0d0d, roughness: 1 }))
  ceiling.position.set(20, 5.05, -1)
  scene.add(ceiling)

  // back wall of the garage: walnut, with a band of tall windows onto the city
  const sky = skyline()
  const back = box(24, 5, 0.2, walnut); back.position.set(0, 2.5, -8.1); scene.add(back)
  const win = new THREE.Mesh(new THREE.PlaneGeometry(16, 3.6), new THREE.MeshBasicMaterial({ map: sky, color: 0x9a9a9a }))
  win.position.set(0, 2.4, -7.98); scene.add(win)
  for (let i = 0; i <= 8; i++) { const m = box(0.08, 3.7, 0.08, MAT.darkSteel()); m.position.set(-8 + i * 2, 2.4, -7.94); scene.add(m) }
  for (const x of [-12.1, 12.1]) {
    // side walls with a doorway on the right into the wardrobe
    if (x < 0) { const w = box(0.2, 5, 14, walnut); w.position.set(x, 2.5, -1); scene.add(w) }
    else {
      const w1 = box(0.2, 5, 8, walnut); w1.position.set(x, 2.5, -4); scene.add(w1)
      const w2 = box(0.2, 1.4, 4, walnut); w2.position.set(x, 4.3, 2); scene.add(w2)
      const w3 = box(0.2, 5, 2, walnut); w3.position.set(x, 2.5, 5); scene.add(w3)
    }
  }
  // cove lights along the ceiling edges
  for (const z of [-7.7, 5.6]) { const c = box(23.5, 0.04, 0.12, MAT.light(0xffe2bf, 2.2)); c.position.set(0, 4.9, z); scene.add(c) }

  // storefront: glass facade with the door opening
  const glassFace = new THREE.MeshPhysicalMaterial({ color: 0x0b0d10, roughness: 0.05, transmission: 0.6, transparent: true, opacity: 0.35 })
  for (const [x, w] of [[-6.9, 10.4], [6.9, 10.4]] as const) {
    const g = box(w, 4.2, 0.06, glassFace); g.position.set(x, 2.1, 6); scene.add(g)
  }
  for (let i = -6; i <= 6; i++) if (Math.abs(i) >= 1) {
    const m = box(0.09, 4.4, 0.12, MAT.darkSteel()); m.position.set(i * 2, 2.2, 6); scene.add(m)
  }
  const lintel = box(24.2, 0.8, 0.3, MAT.darkSteel()); lintel.position.set(0, 4.6, 6); scene.add(lintel)
  // two tall glass doors, hinged at the edges
  const doors: THREE.Group[] = []
  for (const side of [-1, 1]) {
    const pivot = new THREE.Group(); pivot.position.set(side * 1.6, 0, 6)
    const leaf = new THREE.Group()
    const fr = new THREE.MeshStandardMaterial({ color: 0x111214, metalness: 0.8, roughness: 0.35 })
    const top = box(1.6, 0.08, 0.08, fr); top.position.set(0, 4.15, 0)
    const bot = box(1.6, 0.12, 0.08, fr); bot.position.set(0, 0.06, 0)
    const edge1 = box(0.08, 4.2, 0.08, fr); edge1.position.set(-0.78, 2.1, 0)
    const edge2 = edge1.clone(); edge2.position.x = 0.78
    const pane = box(1.5, 4.0, 0.03, glassFace); pane.position.set(0, 2.1, 0)
    const handle = box(0.04, 1.2, 0.06, MAT.chrome()); handle.position.set(-side * 0.62, 1.4, 0.08)
    leaf.add(top, bot, edge1, edge2, pane, handle)
    leaf.position.x = -side * 0.8
    pivot.add(leaf); scene.add(pivot); doors.push(pivot)
  }
  // steps and the wet street outside
  for (let i = 0; i < 3; i++) { const s = box(8, 0.12, 0.6, new THREE.MeshStandardMaterial({ color: 0x141416, roughness: 0.2 })); s.position.set(0, -0.06 - i * 0.12, 6.4 + i * 0.6); scene.add(s) }
  const plaque = placard(['Shreyansh Sancheti', 'Private showroom', 'Bengaluru']); plaque.position.set(3.0, 0.4, 6.6); plaque.rotation.y = -0.2; scene.add(plaque)

  await idle()
  /* ---------- garage: the career, oldest to newest ---------- */
  // one radial texture shared by every contact shadow
  const contactShadow = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 128
    const x = c.getContext('2d')!
    const g = x.createRadialGradient(64, 64, 4, 64, 64, 64)
    g.addColorStop(0, 'rgba(0,0,0,.85)'); g.addColorStop(0.55, 'rgba(0,0,0,.45)'); g.addColorStop(1, 'rgba(0,0,0,0)')
    x.fillStyle = g; x.fillRect(0, 0, 128, 128)
    return new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false })
  })()
  // three wide spots light the five plinths: fewer lights keeps every shader small
  for (const lx of [-6.75, 0, 6.75]) {
    const spot = new THREE.SpotLight(0xffd8ad, o.small ? 60 : 85, 0, 0.62, 0.65, 2)
    spot.position.set(lx, 4.8, -0.6); spot.target.position.set(lx, 0.3, -2.2)
    scene.add(spot, spot.target)
  }
  VEHICLES.forEach((v) => {
    const table = new THREE.Group(); table.position.set(v.x, 0, -2.2)
    table.add(plinth(v.kind === 'motorcycle' ? 1.6 : 2.25))
    const fallback = v.kind === 'motorcycle' ? motorcycle(v.color) : car(v.kind as CarKind, v.color)
    fallback.scale.setScalar(0.86)
    const holder = new THREE.Group(); holder.position.y = 0.14; holder.rotation.y = 2.25
    slot(v.model, holder, fallback, { len: v.len * 0.86, tint: 'tint' in v ? (v as { tint: number }).tint : undefined })
    const spinner = new THREE.Group(); spinner.add(holder); table.add(spinner)
    scene.add(table)
    const sign = placard(o.labels[v.job] ?? [v.job]); sign.position.set(v.x + 1.9, 0, 0.35); sign.rotation.y = -0.35; scene.add(sign)
    interactive.push({ id: v.job, obj: table }, { id: v.job, obj: sign })
    // a soft painted shadow under each vehicle reads like a real one in a still room
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(v.kind === 'motorcycle' ? 2.6 : 5.6, v.kind === 'motorcycle' ? 1.2 : 2.6), contactShadow)
    shadow.rotation.x = -Math.PI / 2; shadow.rotation.z = -(2.25 - Math.PI / 2); shadow.position.y = 0.146
    table.add(shadow)
    const disc = new THREE.Mesh(new THREE.CircleGeometry(0.16, 24), MAT.light(0xfff1dc, 3)); disc.rotation.x = Math.PI / 2; disc.position.set(v.x, 4.99, -1.4); scene.add(disc)
  })
  scene.add(new THREE.HemisphereLight(0x8a8fa0, 0x120d09, 0.25))

  await idle()
  /* ---------- workshop: skills as magnets on a pegboard, projects on a lightbox ---------- */
  const wBack = box(16, 5, 0.2, walnut); wBack.position.set(20, 2.5, -6.1); scene.add(wBack)
  const wFront = box(16, 5, 0.2, plaster); wFront.position.set(20, 2.5, 6.1); scene.add(wFront)
  const texLoader = new THREE.TextureLoader()

  // the tool wall: one canvas, every skill as an enamel magnet, the core ones in warm enamel
  {
    const W = 2400, H = 1100, c = document.createElement('canvas'); c.width = W; c.height = H
    const x = c.getContext('2d')!
    x.fillStyle = '#2b2d30'; x.fillRect(0, 0, W, H)
    x.fillStyle = '#1b1c1e'
    for (let py = 30; py < H; py += 44) for (let px = 30; px < W; px += 44) { x.beginPath(); x.arc(px, py, 6, 0, Math.PI * 2); x.fill() }
    const colW = W / SKILL_RACKS.length
    SKILL_RACKS.forEach((rack, ci) => {
      const cx = ci * colW + colW / 2
      x.fillStyle = '#d9d4ca'; x.fillRect(cx - 200, 50, 400, 76)
      x.fillStyle = '#1d1e20'; x.font = '400 46px "Instrument Serif", Georgia, serif'; x.textAlign = 'center'; x.fillText(rack.rack, cx, 104)
      rack.items.forEach((item, i) => {
        const y = 170 + i * 64, hot = HIGHLIGHT_SKILLS.has(item)
        const w = Math.min(380, 40 + item.length * 19)
        x.fillStyle = hot ? '#e8b98a' : '#9da1a6'
        x.beginPath(); x.roundRect(cx - w / 2, y, w, 48, 24); x.fill()
        x.fillStyle = 'rgba(0,0,0,.25)'; x.beginPath(); x.arc(cx - w / 2 + 24, y + 24, 7, 0, Math.PI * 2); x.fill()
        x.fillStyle = '#18191b'; x.font = '500 26px Geist, Arial, sans-serif'; x.fillText(item, cx + 6, y + 33)
      })
    })
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8
    const board = new THREE.Mesh(new THREE.PlaneGeometry(7.0, 3.2), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.6, metalness: 0.3 }))
    board.position.set(16.3, 2.35, -5.92)
    const rim = box(7.2, 3.4, 0.06, MAT.darkSteel()); rim.position.set(16.3, 2.35, -6.0)
    const bench = box(7.0, 0.08, 0.9, walnut); bench.position.set(16.3, 0.92, -5.5)
    const benchBody = box(7.0, 0.88, 0.85, MAT.darkSteel()); benchBody.position.set(16.3, 0.44, -5.55)
    scene.add(rim, board, bench, benchBody)
    const l = new THREE.SpotLight(0xfff0dc, 34, 0, 0.7, 0.6, 2); l.position.set(16.3, 4.8, -2.6); l.target.position.set(16.3, 2.2, -6)
    scene.add(l, l.target)
  }

  // the lightbox: one project at a time, crossfading as the visitor flips through
  const shots = PROJECTS.map((p) => {
    const t = texLoader.load(PROJECT_IMAGES[p.id] ?? '', (tt) => { tt.colorSpace = THREE.SRGBColorSpace })
    t.colorSpace = THREE.SRGBColorSpace
    return t
  })
  const lbA = new THREE.MeshBasicMaterial({ map: shots[0], transparent: true, opacity: 1, toneMapped: false })
  const lbB = new THREE.MeshBasicMaterial({ map: shots[0], transparent: true, opacity: 0, toneMapped: false })
  const lightbox = new THREE.Group(); lightbox.position.set(23.6, 2.35, -5.92)
  const lbFrame = box(5.3, 4.0, 0.12, MAT.darkSteel())
  const lbFront = new THREE.Mesh(new THREE.PlaneGeometry(5.0, 3.73), lbA); lbFront.position.z = 0.065
  const lbBack = new THREE.Mesh(new THREE.PlaneGeometry(5.0, 3.73), lbB); lbBack.position.z = 0.066
  const lbGlow = box(5.0, 0.03, 0.05, MAT.light(0xffe6c4, 2.5)); lbGlow.position.set(0, -2.1, 0.08)
  lightbox.add(lbFrame, lbFront, lbBack, lbGlow)
  scene.add(lightbox)
  interactive.push({ id: 'projects', obj: lightbox })
  let projectFade = 1
  const setProject = (i: number) => {
    lbB.map = lbA.map; lbB.opacity = 1; lbA.map = shots[(i + shots.length) % shots.length]; lbA.opacity = 0
    lbA.needsUpdate = lbB.needsUpdate = true; projectFade = o.reduce ? 1 : 0
  }

  await idle()
  /* ---------- wardrobe: suits, the watch drawer and the hobbies wall ---------- */
  const lBack = box(12, 5, 0.2, walnut); lBack.position.set(34, 2.5, -5.1); scene.add(lBack)
  const lFront = box(12, 5, 0.2, plaster); lFront.position.set(34, 2.5, 6.1); scene.add(lFront)
  for (const dx of [28.1, 40.1]) {
    const w1 = box(0.2, 5, 5.2, walnut); w1.position.set(dx, 2.5, -2.6); scene.add(w1)
    const w2 = box(0.2, 1.4, 4, walnut); w2.position.set(dx, 4.3, 2); scene.add(w2)
    const w3 = box(0.2, 5, 2.1, walnut); w3.position.set(dx, 2.5, 5.05); scene.add(w3)
  }
  SUITS.forEach((su, i) => {
    const holder = new THREE.Group(); holder.position.set(su.x, 0, su.z); holder.rotation.y = su.ry
    slot(su.model, holder, suitStand(i ? 0x2b2b2e : 0x1f2430), { height: 1.9, mute: true })
    scene.add(holder)
  })
  const suitLight = new THREE.SpotLight(0xffe6c8, 24, 0, 0.55, 0.6, 2); suitLight.position.set(37.4, 4.7, -1.8); suitLight.target.position.set(38.9, 1.1, -1.8)
  scene.add(suitLight, suitLight.target)
  const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 4.2), MAT.chrome())
  rail.rotation.x = Math.PI / 2; rail.position.set(39.6, 2.5, -2.6); scene.add(rail)
  ;[0x3b3f45, 0x1f2430, 0x6b6257, 0x2b2b2b, 0x4a4036].forEach((c, i) => {
    const j = jacket(c); j.position.set(39.75, 1.5, -4.5 + i * 0.7); j.rotation.y = -Math.PI / 2; scene.add(j)
  })

  // the hobbies wall: three framed photographs under picture lights
  HOBBIES.forEach((h, i) => {
    const tex = texLoader.load(h.image, (t) => { t.colorSpace = THREE.SRGBColorSpace })
    const f = frame(tex, 1.15, 1.43)
    f.position.set(30.9 + i * 1.75, 2.35, -4.95)
    scene.add(f)
    interactive.push({ id: 'hobbies', obj: f })
  })
  const wardrobeLight = new THREE.SpotLight(0xfff0dc, 48, 0, 0.95, 0.6, 2); wardrobeLight.position.set(34.2, 4.8, 1.4); wardrobeLight.target.position.set(34.0, 1.0, -2.6)
  scene.add(wardrobeLight, wardrobeLight.target)

  // the watch drawer: the four pieces, set out on suede
  const island = new THREE.Group(); island.position.set(35.7, 0, 0.45)
  const body = box(3.0, 0.9, 1.4, walnut); body.position.y = 0.45
  const top = box(3.1, 0.06, 1.5, new THREE.MeshPhysicalMaterial({ color: 0x15161a, roughness: 0.05, transmission: 0.3, transparent: true, opacity: 0.85 }))
  top.position.y = 0.93
  island.add(body, top)
  const drawer = new THREE.Group(); drawer.position.set(0, 0.62, 0.75)
  const tray = box(2.7, 0.06, 1.0, MAT.suede())
  const dFront = box(2.9, 0.38, 0.06, walnut); dFront.position.set(0, -0.02, 0.53)
  drawer.add(tray, dFront)
  WATCHES.forEach((wch, i) => {
    const x = -1.0 + i * 0.66
    if (i < 3) { const div = box(0.02, 0.05, 0.95, MAT.darkSteel()); div.position.set(x + 0.33, 0.05, 0); drawer.add(div) }
    const w = watch(wch.dial); clocks.push(w); w.group.scale.setScalar(0.85)
    const holder = new THREE.Group(); holder.position.set(x, 0.07, -0.05)
    // a watch on a closed strap stands on it like a cushion; the rest lie dial-up
    slot(wch.model, holder, w.group, wch.upright ? { height: 0.42 } : { len: 0.5, flat: true })
    drawer.add(holder)
    interactive.push({ id: `watch:${wch.label}`, obj: holder })
  })
  island.add(drawer)
  scene.add(island)


  await idle()
  /* ---------- hall of fame, and the way out ---------- */
  const hBack = box(12, 5, 0.2, walnut); hBack.position.set(46, 2.5, -5.1); scene.add(hBack)
  const hFront = box(12, 5, 0.2, plaster); hFront.position.set(46, 2.5, 6.1); scene.add(hFront)
  const hEnd = box(0.2, 5, 11.4, walnut); hEnd.position.set(52.1, 2.5, 0.5); scene.add(hEnd)
  HALL_OF_FAME.forEach((h, i) => {
    const f = honour(h.title, h.detail, h.note)
    f.position.set(41.9 + i * 1.6, 2.6, -4.95)
    scene.add(f)
    interactive.push({ id: 'hall', obj: f })
  })
  SOCIALS.forEach((so, i) => {
    const p = socialPlate(so.label, so.handle)
    p.position.set(43.6 + i * 0.95, 1.45, -4.98)
    scene.add(p)
    interactive.push({ id: `social:${so.label}`, obj: p })
  })
  const hallLight = new THREE.SpotLight(0xfff0dc, 30, 0, 0.75, 0.7, 2); hallLight.position.set(46, 4.8, -1.2); hallLight.target.position.set(46, 2.2, -5)
  scene.add(hallLight, hallLight.target)
  // the exit banner: a long lit panel on the end wall with the way to reach me
  {
    const c = document.createElement('canvas'); c.width = 2000; c.height = 900
    const x = c.getContext('2d')!
    x.fillStyle = '#efe9df'; x.fillRect(0, 0, 2000, 900)
    x.fillStyle = '#1d1b19'; x.textAlign = 'center'
    x.font = 'italic 400 120px "Instrument Serif", Georgia, serif'; x.fillText('Thanks for walking through.', 1000, 300)
    x.font = '400 190px "Instrument Serif", Georgia, serif'; x.fillText("Let's build something.", 1000, 520)
    x.font = '500 46px Geist, Arial, sans-serif'; x.fillStyle = '#5a534b'
    x.fillText('hire.ssancheti@gmail.com  ·  linkedin/shreyansh-sancheti  ·  @shrey_sancheti', 1000, 700)
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8
    const banner = new THREE.Mesh(new THREE.PlaneGeometry(6.6, 2.97), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false, color: 0xdedede }))
    banner.rotation.y = -Math.PI / 2; banner.position.set(51.98, 2.45, 0.6)
    scene.add(banner)
    interactive.push({ id: 'exit', obj: banner })
  }
  const chair = loungeChair(); chair.position.set(49.6, 0, -2.6); chair.rotation.y = -0.6; scene.add(chair)

  /* ---------- outside: a cool street light for contrast ---------- */
  const spill = new THREE.PointLight(0xffd2a0, 18, 10, 2); spill.position.set(0, 3, 4); scene.add(spill)

  /* ---------- camera rail ---------- */
  const P = STATIONS.map((s) => new THREE.Vector3(...s.pos))
  const L = STATIONS.map((s) => new THREE.Vector3(...s.look))
  let target = 0, current = 0
  const pos = new THREE.Vector3(), look = new THREE.Vector3(), lookNow = new THREE.Vector3().copy(L[0])
  const mouse = new THREE.Vector2(), sway = new THREE.Vector2()
  camera.position.copy(P[0]); camera.lookAt(L[0])

  const ease = (t: number) => t * t * (3 - 2 * t)
  function railAt(k: number) {
    const i = Math.min(Math.floor(k), P.length - 2), f = ease(Math.min(1, Math.max(0, k - i)))
    pos.lerpVectors(P[i], P[i + 1], f)
    look.lerpVectors(L[i], L[i + 1], f)
  }

  /* ---------- hover and select ---------- */
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2()
  let hovered: string | null = null
  const pick = (cx: number, cy: number) => {
    const r = o.canvas.getBoundingClientRect()
    ndc.set(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1)
    ray.setFromCamera(ndc, camera)
    let best: { id: string; d: number } | null = null
    for (const it of interactive) {
      const hit = ray.intersectObject(it.obj, true)[0]
      if (hit && (!best || hit.distance < best.d)) best = { id: it.id, d: hit.distance }
    }
    return best?.id ?? null
  }
  const onMove = (e: PointerEvent) => {
    mouse.set(e.clientX / innerWidth - 0.5, e.clientY / innerHeight - 0.5)
    const id = pick(e.clientX, e.clientY)
    if (id !== hovered) { hovered = id; o.canvas.style.cursor = id ? 'pointer' : '' }
    o.onHover(id, e.clientX, e.clientY)
  }
  const onClick = (e: MouseEvent) => { const id = pick(e.clientX, e.clientY); if (id) o.onSelect(id) }
  o.canvas.addEventListener('pointermove', onMove)
  o.canvas.addEventListener('click', onClick)

  /* ---------- loop ---------- */
  let doorsOpen = false, doorT = 0, paused = o.reduce, running = true, raf = 0
  const clock = new THREE.Clock()
  const resize = () => {
    const w = o.canvas.clientWidth, h = o.canvas.clientHeight
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix()
  }
  resize()
  const ro = new ResizeObserver(resize); ro.observe(o.canvas)

  // render scale follows the device: drop it when frames run long, raise it when there is room
  let frameAvg = 16, sinceTune = 0
  const tune = (dt: number) => {
    frameAvg += (dt * 1000 - frameAvg) * 0.05
    sinceTune += dt
    if (sinceTune < 2) return
    sinceTune = 0
    const next = frameAvg > 24 ? Math.max(0.75, dpr - 0.25) : frameAvg < 14 ? Math.min(maxDpr, dpr + 0.25) : dpr
    if (next !== dpr) { dpr = next; renderer.setPixelRatio(dpr); resize() }
  }
  const lastCam = new THREE.Vector3(), lastLook = new THREE.Vector3()
  let quietFor = 0
  const clocksNear = () => current > STATIONS.findIndex((st) => st.id === 'wardrobe') - 0.8 && current < STATIONS.findIndex((st) => st.id === 'watches') + 0.8

  const tick = () => {
    if (!running) return
    const dt = Math.min(clock.getDelta(), 0.05)
    // the camera glides toward the station the page asks for
    current = o.reduce ? target : current + (target - current) * Math.min(1, dt * 2.6)
    railAt(current)
    sway.x += (mouse.x - sway.x) * 0.03; sway.y += (mouse.y - sway.y) * 0.03
    camera.position.set(pos.x + sway.x * 0.35, pos.y - sway.y * 0.2, pos.z)
    lookNow.lerp(look, Math.min(1, dt * 4))
    camera.lookAt(lookNow)
    if (projectFade < 1) { projectFade = Math.min(1, projectFade + dt * 2.2); lbA.opacity = projectFade; lbB.opacity = 1 - projectFade }
    if (doorsOpen && doorT < 1) {
      doorT = o.reduce ? 1 : Math.min(1, doorT + dt * 0.6)
      const a = (1 - Math.pow(1 - doorT, 3)) * 1.35
      doors[0].rotation.y = a; doors[1].rotation.y = -a
    }
    // every watch in the room keeps Bengaluru time
    const now = new Date(Date.now() + 5.5 * 3600e3)
    const s = now.getUTCSeconds() + now.getUTCMilliseconds() / 1000, m = now.getUTCMinutes() + s / 60, h = (now.getUTCHours() % 12) + m / 60
    if (!paused) for (const c of clocks) { c.second.rotation.y = -(s / 60) * Math.PI * 2; c.minute.rotation.y = -(m / 60) * Math.PI * 2; c.hour.rotation.y = -(h / 12) * Math.PI * 2 }
    // draw only when something on screen changed; a still room costs nothing
    const moving = camera.position.distanceToSquared(lastCam) > 1e-7 || lookNow.distanceToSquared(lastLook) > 1e-7
    const busy = moving || projectFade < 1 || (doorsOpen && doorT < 1) || needsFrame || (clocksNear() && !paused)
    quietFor = busy ? 0 : quietFor + dt
    if (busy || quietFor < 0.25) {
      renderer.render(scene, camera)
      needsFrame = false
      tune(dt)
    }
    lastCam.copy(camera.position); lastLook.copy(lookNow)
    raf = requestAnimationFrame(tick)
  }
  // compile every shader off the critical path before the first frame is drawn
  await renderer.compileAsync(scene, camera)

  const onVis = () => { if (document.hidden) { running = false; cancelAnimationFrame(raf) } else if (!running) { running = true; clock.getDelta(); tick() } }
  document.addEventListener('visibilitychange', onVis)
  tick()
  void drainQueue()

  return {
    setStation: (k) => { target = Math.max(0, Math.min(STATIONS.length - 1, k)) },
    setProject,
    openDoors: () => { doorsOpen = true },
    setPaused: (p) => { paused = p },
    dispose: () => {
      running = false; cancelAnimationFrame(raf); ro.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      o.canvas.removeEventListener('pointermove', onMove); o.canvas.removeEventListener('click', onClick)
      renderer.dispose(); pmrem.dispose()
    },
  }
}
