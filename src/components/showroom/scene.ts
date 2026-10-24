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
  /** walk up to one vehicle and let the visitor turn around it; null steps back to the rail */
  inspect: (job: string | null, shift?: { x: number; y: number }) => void
  /** lights and a running engine's shiver for the inspected vehicle; rev is 0 to 1 */
  setEngine: (job: string, state: 'off' | 'standby' | 'running', rev?: number) => void
  setProject: (i: number) => void
  openDoors: () => void
  setPaused: (p: boolean) => void
  setQuote: (text: string, by: string) => void
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
  quote: { text: string; by: string }
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
  type Fit = { len?: number; height?: number; tint?: number; flat?: boolean; mute?: boolean; onReady?: (size: THREE.Vector3) => void }
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
        // and bare glass the same treatment: dark and glossy rather than flat white
        const glass = new THREE.MeshPhysicalMaterial({ color: 0x0a0c10, roughness: 0.05, metalness: 0.2, transparent: true, opacity: 0.88 })
        obj.traverse((m) => {
          const mesh = m as THREE.Mesh
          const mat = mesh.material as THREE.MeshStandardMaterial
          if (!mesh.isMesh || !mat || Array.isArray(mat) || mat.map || !mat.transparent || !mat.color) return
          if (mat.color.r * 0.3 + mat.color.g * 0.59 + mat.color.b * 0.11 > 0.6) mesh.material = glass
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
      fit.onReady?.(b.getSize(new THREE.Vector3()))
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
  // a soft round glow, shared by every head and tail lamp
  const glowTex = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 64
    const x = c.getContext('2d')!
    const g = x.createRadialGradient(32, 32, 0, 32, 32, 32)
    g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.25, 'rgba(255,255,255,.55)'); g.addColorStop(1, 'rgba(255,255,255,0)')
    x.fillStyle = g; x.fillRect(0, 0, 64, 64)
    return new THREE.CanvasTexture(c)
  })()
  const lampMat = (color: number) => new THREE.SpriteMaterial({ map: glowTex, color, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0 })
  type Vehicle = { job: string; table: THREE.Group; holder: THREE.Group; len: number; lamps: THREE.Group; head: THREE.SpriteMaterial; tail: THREE.SpriteMaterial; state: 'off' | 'standby' | 'running'; rev: number; glow: number }
  const vehicles: Vehicle[] = []
  VEHICLES.forEach((v) => {
    const table = new THREE.Group(); table.position.set(v.x, 0, -2.2)
    table.add(plinth(v.kind === 'motorcycle' ? 1.6 : 2.25))
    const fallback = v.kind === 'motorcycle' ? motorcycle(v.color) : car(v.kind as CarKind, v.color)
    fallback.scale.setScalar(0.86)
    const holder = new THREE.Group(); holder.position.y = 0.14; holder.rotation.y = 2.25
    const lamps = new THREE.Group(); holder.add(lamps)
    const veh: Vehicle = { job: v.job, table, holder, len: v.len * 0.86, lamps, head: lampMat(0xfff2dc), tail: lampMat(0xff2a1a), state: 'off', rev: 0, glow: 0 }
    vehicles.push(veh)
    slot(v.model, holder, fallback, {
      len: v.len * 0.86,
      tint: 'tint' in v ? (v as { tint: number }).tint : undefined,
      // set the lamps where this model's nose and tail actually are
      onReady: (size) => {
        const alongX = size.x >= size.z, half = (alongX ? size.x : size.z) / 2, wide = (alongX ? size.z : size.x) / 2
        const bike = v.kind === 'motorcycle'
        const put = (mat: THREE.SpriteMaterial, end: number, side: number, h: number, sc: number, reach = 1) => {
          const sp = new THREE.Sprite(mat); sp.scale.setScalar(sc)
          // just proud of the bodywork, so the glow is not swallowed by the panel behind it
          const a = end * (half * reach + 0.05), b = side * wide * 0.7
          sp.position.set(alongX ? a : b, size.y * h, alongX ? b : a)
          lamps.add(sp)
        }
        const f = v.front
        for (const side of bike ? [0] : [-1, 1]) {
          // a bike's lamp sits behind its front wheel, not at the tip of it
          put(veh.head, f, side, bike ? 0.7 : 0.42, bike ? 0.28 : 0.5, bike ? 0.56 : 1)
          put(veh.tail, -f, side, bike ? 0.5 : 0.48, bike ? 0.22 : 0.32)
        }
      },
    })
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

  // the watch drawer: the four pieces, set out on suede, shut under the glass until you walk up
  const DRAWER_SHUT = -0.2, DRAWER_OPEN = 0.75, HELD = 0.42, HELD_OUT = 0.45
  const lifts: { id: string; obj: THREE.Object3D; held: boolean }[] = []
  let drawerT = 0
  const island = new THREE.Group(); island.position.set(35.7, 0, 0.45)
  const body = box(3.0, 0.9, 1.4, walnut); body.position.y = 0.45
  const top = box(3.1, 0.06, 1.5, new THREE.MeshPhysicalMaterial({ color: 0x15161a, roughness: 0.05, transmission: 0.3, transparent: true, opacity: 0.85 }))
  top.position.y = 0.93
  island.add(body, top)
  const drawer = new THREE.Group(); drawer.position.set(0, 0.62, DRAWER_SHUT)
  const tray = box(2.7, 0.06, 1.0, MAT.suede())
  const dFront = box(2.9, 0.38, 0.06, walnut); dFront.position.set(0, -0.02, 0.53)
  drawer.add(tray, dFront)
  WATCHES.forEach((wch, i) => {
    const x = -1.0 + i * 0.66
    if (i < 3) { const div = box(0.02, 0.05, 0.95, MAT.darkSteel()); div.position.set(x + 0.33, 0.05, 0); drawer.add(div) }
    const w = watch(wch.dial); clocks.push(w); w.group.scale.setScalar(0.85)
    const holder = new THREE.Group(); holder.position.set(x, 0.07, -0.05)
    if ('yaw' in wch) holder.rotation.y = wch.yaw
    // a watch on a closed strap stands on it like a cushion; the rest lie dial-up
    slot(wch.model, holder, w.group, wch.upright ? { height: 0.42 } : { len: 0.5, flat: true })
    drawer.add(holder)
    lifts.push({ id: `watch:${wch.label}`, obj: holder, held: false })
    interactive.push({ id: `watch:${wch.label}`, obj: holder })
  })
  island.add(drawer)
  scene.add(island)


  await idle()
  /* ---------- hall of fame, and the way out ---------- */
  const hBack = box(12, 5, 0.2, walnut); hBack.position.set(46, 2.5, -5.1); scene.add(hBack)
  const hFront = box(12, 5, 0.2, plaster); hFront.position.set(46, 2.5, 6.1); scene.add(hFront)
  const hEnd = box(0.2, 5, 11.4, walnut); hEnd.position.set(52.1, 2.5, 0.5); scene.add(hEnd)
  const honours: THREE.Object3D[] = []
  HALL_OF_FAME.forEach((h, i) => {
    const f = honour(h.title, h.detail, h.note)
    f.position.set(41.9 + i * 1.6, 2.6, -4.95)
    scene.add(f); honours.push(f)
    interactive.push({ id: `hall:${i}`, obj: f })
  })
  // the ways to reach me sit in a lit row under the honours, and lift toward you when pointed at
  const plates: { id: string; obj: THREE.Object3D; s: number }[] = []
  SOCIALS.forEach((so, i) => {
    const p = socialPlate(so.label, so.handle)
    p.position.set(45.9 + (i - (SOCIALS.length - 1) / 2) * 1.2, 1.38, -4.96)
    scene.add(p)
    plates.push({ id: `social:${so.label}`, obj: p, s: 1 })
    interactive.push({ id: `social:${so.label}`, obj: p })
  })
  const hallCentre = new THREE.Vector3(45.9, 2.15, -4.95)
  const hallLight = new THREE.SpotLight(0xfff0dc, 30, 0, 0.75, 0.7, 2); hallLight.position.set(46, 4.8, -1.2); hallLight.target.position.set(46, 2.2, -5)
  scene.add(hallLight, hallLight.target)
  // the end wall: a long lit panel with one parting thought, redrawn whenever the quote changes
  const quoteCanvas = document.createElement('canvas'); quoteCanvas.width = 2000; quoteCanvas.height = 900
  const quoteTex = new THREE.CanvasTexture(quoteCanvas); quoteTex.colorSpace = THREE.SRGBColorSpace; quoteTex.anisotropy = 8
  function drawQuote(text: string, by: string) {
    const x = quoteCanvas.getContext('2d')!
    x.fillStyle = '#efe9df'; x.fillRect(0, 0, 2000, 900)
    x.textAlign = 'center'; x.fillStyle = '#1d1b19'
    // the largest size at which the line wraps into three rows or fewer
    let size = 170, lines: string[] = []
    for (; size >= 80; size -= 10) {
      x.font = `400 ${size}px "Instrument Serif", Georgia, serif`
      lines = []
      let row = ''
      for (const w of `“${text}”`.split(' ')) {
        const t = row ? `${row} ${w}` : w
        if (x.measureText(t).width > 1760 && row) { lines.push(row); row = w } else row = t
      }
      lines.push(row)
      if (lines.length <= 3) break
    }
    const lh = size * 1.08, top = 430 - ((lines.length - 1) * lh) / 2 - 40
    lines.forEach((l, i) => x.fillText(l, 1000, top + i * lh))
    x.font = 'italic 400 64px "Instrument Serif", Georgia, serif'; x.fillStyle = '#5a534b'
    x.fillText(`— ${by}`, 1000, top + (lines.length - 1) * lh + 130)
    quoteTex.needsUpdate = true
    needsFrame = true
  }
  drawQuote(o.quote.text, o.quote.by)
  {
    const banner = new THREE.Mesh(new THREE.PlaneGeometry(6.6, 2.97), new THREE.MeshBasicMaterial({ map: quoteTex, toneMapped: false, color: 0xdedede }))
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

  /* ---------- inspecting one piece: the camera leaves the rail and orbits it ---------- */
  // a vehicle on its plinth, or a watch lifted out of the drawer and held up to the light
  type Subject = { len: number; rMin: number; rMax: number; ceiling: number; walls: boolean; fixed?: boolean; vehicle?: Vehicle; lift?: (typeof lifts)[number] }
  let inspected: Subject | null = null, inspectT = 0
  const orbit = { theta: 0, phi: 1.2, r: 6, vTheta: 0, vPhi: 0, idle: 0 }
  const orbitCenter = new THREE.Vector3(), orbitPos = new THREE.Vector3()
  const viewShift = { x: 0, y: 0 }
  function beginInspect(id: string | null, shift?: { x: number; y: number }) {
    if (shift) { viewShift.x = shift.x; viewShift.y = shift.y }
    for (const l of lifts) l.held = false
    inspected = null
    const v = id ? vehicles.find((x) => x.job === id) : undefined
    const l = id ? lifts.find((x) => x.id === id) : undefined
    if (v) {
      inspected = { len: v.len, rMin: v.len * 0.45 + 0.9, rMax: v.len * 1.25 + 1.2, ceiling: 3.6, walls: true, vehicle: v }
      orbitCenter.set(v.table.position.x, 0.75, v.table.position.z)
      orbit.phi = 1.18
    } else if (l) {
      // lift it clear of the drawer, then circle it at arm's length
      l.held = true
      inspected = { len: 0.5, rMin: 0.28, rMax: 1.5, ceiling: 1.2, walls: false, lift: l }
      // it comes up and forward, clear of the glass top, and the camera aims at the dial rather than its base
      l.obj.getWorldPosition(orbitCenter)
      orbitCenter.y += HELD - (l.obj.position.y - 0.07) + 0.1
      orbitCenter.z += HELD_OUT - (l.obj.position.z + 0.05)
      orbit.phi = 0.95
    }
    if (id === 'hall' || id?.startsWith('hall:')) {
      // the hall is read straight on: the whole wall first, then one honour at a time
      const i = id === 'hall' ? -1 : Number(id.slice(5))
      const one = honours[i]
      // the hall is about ten metres deep: the camera can step back no further than the far wall
      inspected = { len: one ? 1.6 : 10.2, rMin: one ? 1.1 : 3, rMax: one ? 3.2 : 10.2, ceiling: 5, walls: false, fixed: true }
      if (one) orbitCenter.set(one.position.x, one.position.y - 0.05, one.position.z)
      else orbitCenter.copy(hallCentre)
      orbit.theta = 0; orbit.phi = one ? 1.52 : 1.47
      orbit.r = fitDistance(inspected) * (one ? 1.15 : 1.05)
      orbit.vTheta = orbit.vPhi = 0; orbit.idle = 0
      clampOrbit()
      needsFrame = true
      return
    }
    if (!inspected) return
    // start from where the visitor is already standing, so the move reads as walking up to it
    orbit.theta = Math.atan2(camera.position.x - orbitCenter.x, camera.position.z - orbitCenter.z)
    orbit.r = v ? Math.max(v.len * 0.78 + 1.6, fitDistance(inspected) * 0.95) : Math.max(0.85, fitDistance(inspected) * 1.1)
    orbit.vTheta = orbit.vPhi = 0; orbit.idle = 0
    needsFrame = true
  }
  // far enough that the whole piece fits across the screen, whatever its shape
  const fitDistance = (sub: Subject) => {
    const half = THREE.MathUtils.degToRad(camera.fov) / 2
    // fit into the part of the screen the panel leaves open, not the whole width
    const w = o.canvas.clientWidth || innerWidth, open = Math.max(240, w - 2 * viewShift.x) / w
    const across = (sub.len * 0.5 + (sub.vehicle ? 0.5 : 0.08)) / Math.tan(Math.atan(Math.tan(half) * camera.aspect * (sub.fixed ? open : 1)))
    // a wall is also tall: make sure it fits top to bottom as well as across
    return sub.fixed ? Math.max(across, (sub.len > 3 ? 1.9 : 0.75) / Math.tan(half)) : across
  }
  const clampOrbit = () => {
    if (!inspected) return
    const far = inspected.fixed ? inspected.rMax : Math.max(inspected.rMax, fitDistance(inspected) * 1.25)
    orbit.r = Math.min(far, Math.max(inspected.rMin, orbit.r))
    // stay under the ceiling and above the floor
    const maxUp = Math.acos(Math.min(1, inspected.ceiling / orbit.r))
    orbit.phi = Math.min(1.5, Math.max(Math.max(0.3, maxUp), orbit.phi))
  }
  const drag = { on: false, x: 0, y: 0, moved: 0, pts: new Map<number, { x: number; y: number }>(), pinch: 0 }
  const onDown = (e: PointerEvent) => {
    if (!inspected || inspected.fixed) return
    drag.pts.set(e.pointerId, { x: e.clientX, y: e.clientY })
    drag.on = true; drag.x = e.clientX; drag.y = e.clientY; drag.moved = 0
    if (drag.pts.size === 2) { const [a, b] = [...drag.pts.values()]; drag.pinch = Math.hypot(a.x - b.x, a.y - b.y) }
    o.canvas.setPointerCapture(e.pointerId)
  }
  const onDrag = (e: PointerEvent) => {
    if (!inspected || !drag.on) return
    if (drag.pts.has(e.pointerId)) drag.pts.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (drag.pts.size === 2) {
      const [a, b] = [...drag.pts.values()], d = Math.hypot(a.x - b.x, a.y - b.y)
      if (drag.pinch) orbit.r *= drag.pinch / d
      drag.pinch = d; clampOrbit(); orbit.idle = 0; needsFrame = true
      return
    }
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y
    drag.x = e.clientX; drag.y = e.clientY; drag.moved += Math.abs(dx) + Math.abs(dy)
    orbit.vTheta = -dx * 0.0065; orbit.vPhi = -dy * 0.005
    orbit.theta += orbit.vTheta; orbit.phi += orbit.vPhi
    clampOrbit(); orbit.idle = 0; needsFrame = true
  }
  const onUp = (e: PointerEvent) => {
    drag.pts.delete(e.pointerId)
    if (drag.pts.size === 0) drag.on = false
    drag.pinch = 0
  }
  const onWheel = (e: WheelEvent) => {
    if (!inspected) return
    e.preventDefault()
    orbit.r *= 1 + Math.max(-0.2, Math.min(0.2, e.deltaY * 0.0015))
    clampOrbit(); orbit.idle = 0; needsFrame = true
  }
  o.canvas.addEventListener('pointerdown', onDown)
  o.canvas.addEventListener('pointermove', onDrag)
  o.canvas.addEventListener('pointerup', onUp)
  o.canvas.addEventListener('pointercancel', onUp)
  o.canvas.addEventListener('wheel', onWheel, { passive: false })

  /* ---------- hover and select ---------- */
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2()
  // only solid surfaces count: some models carry outline layers that three.js would hit from a metre away
  ray.params.Line = { threshold: 0 }; ray.params.Points = { threshold: 0 }
  let hovered: string | null = null
  const pick = (cx: number, cy: number) => {
    const r = o.canvas.getBoundingClientRect()
    ndc.set(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1)
    ray.setFromCamera(ndc, camera)
    let best: { id: string; d: number } | null = null
    for (const it of interactive) {
      const hit = ray.intersectObject(it.obj, true).find((h) => (h.object as THREE.Mesh).isMesh && !(h.object as THREE.Mesh & { isLine?: boolean }).isLine)
      if (hit && (!best || hit.distance < best.d)) best = { id: it.id, d: hit.distance }
    }
    return best?.id ?? null
  }
  const onMove = (e: PointerEvent) => {
    mouse.set(e.clientX / innerWidth - 0.5, e.clientY / innerHeight - 0.5)
    if (inspected && !inspected.fixed) { if (hovered) { hovered = null; o.onHover(null, e.clientX, e.clientY) } return }
    const id = pick(e.clientX, e.clientY)
    if (id !== hovered) { hovered = id; o.canvas.style.cursor = id ? 'pointer' : '' }
    o.onHover(id, e.clientX, e.clientY)
  }
  const onClick = (e: MouseEvent) => {
    if (inspected && !inspected.fixed) return
    const id = pick(e.clientX, e.clientY); if (id) o.onSelect(id)
  }
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
  const watchesAt = STATIONS.findIndex((st) => st.id === 'watches')
  const clocksNear = () => current > STATIONS.findIndex((st) => st.id === 'wardrobe') - 0.8 && current < STATIONS.findIndex((st) => st.id === 'watches') + 0.8

  const tick = () => {
    if (!running) return
    const dt = Math.min(clock.getDelta(), 0.05)
    // the camera glides toward the station the page asks for
    current = o.reduce ? target : current + (target - current) * Math.min(1, dt * 2.6)
    railAt(current)
    sway.x += (mouse.x - sway.x) * 0.03; sway.y += (mouse.y - sway.y) * 0.03
    camera.position.set(pos.x + sway.x * 0.35, pos.y - sway.y * 0.2, pos.z)
    // walking up to a vehicle: blend from the rail into an orbit around it
    const wantInspect = inspected ? 1 : 0
    if (inspectT !== wantInspect) inspectT = o.reduce ? wantInspect : Math.abs(inspectT - wantInspect) < 1e-3 ? wantInspect : inspectT + (wantInspect - inspectT) * Math.min(1, dt * 2.4)
    if (inspectT > 0) {
      if (inspected && !drag.on && !inspected.fixed) {
        // a little momentum after a flick, then a slow turntable drift once left alone
        orbit.theta += orbit.vTheta; orbit.phi += orbit.vPhi
        orbit.vTheta *= 0.92; orbit.vPhi *= 0.88
        orbit.idle += dt
        if (orbit.idle > 3 && !o.reduce && !paused) orbit.theta += dt * 0.12
        clampOrbit()
      }
      const sp = Math.sin(orbit.phi)
      orbitPos.set(orbitCenter.x + orbit.r * sp * Math.sin(orbit.theta), orbitCenter.y + orbit.r * Math.cos(orbit.phi), orbitCenter.z + orbit.r * sp * Math.cos(orbit.theta))
      // never through a wall: the garage runs x -12..12, z -8..6
      if (inspected?.walls) { orbitPos.x = Math.min(11.7, Math.max(-11.7, orbitPos.x)); orbitPos.z = Math.min(5.6, Math.max(-7.7, orbitPos.z)) }
      const e = inspectT * inspectT * (3 - 2 * inspectT)
      camera.position.lerp(orbitPos, e)
      look.lerp(orbitCenter, e)
    }
    lookNow.lerp(look, Math.min(1, dt * (inspectT > 0 ? 8 : 4)))
    camera.lookAt(lookNow)
    if (inspectT > 0 || camera.view) {
      const w = o.canvas.clientWidth, h = o.canvas.clientHeight, e = inspectT * inspectT * (3 - 2 * inspectT)
      if (inspectT > 0) camera.setViewOffset(w, h, viewShift.x * e, viewShift.y * e, w, h)
      else camera.clearViewOffset()
    }
    // neighbours step out of the way while one vehicle has the floor
    for (const v of vehicles) v.table.visible = !(inspected?.vehicle && inspected.vehicle !== v && inspectT > 0.55)
    // lamps fade up on standby; a running engine shivers on its springs and harder on a rev
    let engineBusy = false
    for (const v of vehicles) {
      const want = v.state === 'off' ? 0 : 1
      if (Math.abs(v.glow - want) > 1e-3) { v.glow += (want - v.glow) * Math.min(1, dt * 5); engineBusy = true }
      v.head.opacity = v.glow * 0.95; v.tail.opacity = v.glow * (0.55 + v.rev * 0.3)
      if (v.state === 'running') {
        const t = clock.elapsedTime, amp = 0.0025 + v.rev * 0.006
        v.holder.position.y = 0.14 + Math.sin(t * 61) * amp * 0.5 + Math.sin(t * 23) * amp * 0.5
        v.holder.rotation.z = Math.sin(t * 37) * amp * 0.6 + v.rev * 0.012
        engineBusy = true
      } else if (v.holder.position.y !== 0.14) { v.holder.position.y = 0.14; v.holder.rotation.z = 0; engineBusy = true }
    }
    // the drawer slides out as the camera arrives at it and back in when it leaves
    const wantOpen = Math.abs(current - watchesAt) < 0.7 ? 1 : 0
    let drawerBusy = false
    if (Math.abs(drawerT - wantOpen) > 1e-3) {
      drawerT = o.reduce ? wantOpen : drawerT + (wantOpen - drawerT) * Math.min(1, dt * 3)
      const e = 1 - Math.pow(1 - drawerT, 3)
      drawer.position.z = DRAWER_SHUT + (DRAWER_OPEN - DRAWER_SHUT) * e
      drawerBusy = true
    }
    // a social plate under the pointer comes off the wall a little
    for (const p of plates) {
      const want = hovered === p.id ? 1.12 : 1
      if (Math.abs(p.s - want) < 1e-3) continue
      p.s += (want - p.s) * (o.reduce ? 1 : Math.min(1, dt * 8))
      p.obj.scale.setScalar(p.s); p.obj.position.z = -4.96 + (p.s - 1) * 0.6
      drawerBusy = true
    }
    // the watch under the pointer rises off the suede and tips toward you; a held one comes right out
    for (const l of lifts) {
      const y = l.held ? 0.07 + HELD : hovered === l.id ? 0.16 : 0.07
      const z = l.held ? -0.05 + HELD_OUT : -0.05
      const rx = l.held ? 0 : hovered === l.id ? 0.35 : 0
      if (Math.abs(l.obj.position.y - y) < 1e-4 && Math.abs(l.obj.position.z - z) < 1e-4 && Math.abs(l.obj.rotation.x - rx) < 1e-4) continue
      const k = o.reduce ? 1 : Math.min(1, dt * 6)
      l.obj.position.y += (y - l.obj.position.y) * k
      l.obj.position.z += (z - l.obj.position.z) * k
      l.obj.rotation.x += (rx - l.obj.rotation.x) * k
      drawerBusy = true
    }
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
    const busy = moving || engineBusy || (inspectT > 0 && inspectT < 1) || drawerBusy || projectFade < 1 || (doorsOpen && doorT < 1) || needsFrame || (clocksNear() && !paused)
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
    inspect: beginInspect,
    setEngine: (job, state, rev = 0) => {
      const v = vehicles.find((x) => x.job === job)
      if (v) { v.state = state; v.rev = rev; needsFrame = true }
    },
    openDoors: () => { doorsOpen = true },
    setPaused: (p) => { paused = p },
    setQuote: drawQuote,
    dispose: () => {
      running = false; cancelAnimationFrame(raf); ro.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      o.canvas.removeEventListener('pointermove', onMove); o.canvas.removeEventListener('click', onClick)
      o.canvas.removeEventListener('pointerdown', onDown); o.canvas.removeEventListener('pointermove', onDrag)
      o.canvas.removeEventListener('pointerup', onUp); o.canvas.removeEventListener('pointercancel', onUp)
      o.canvas.removeEventListener('wheel', onWheel)
      renderer.dispose(); pmrem.dispose()
    },
  }
}
