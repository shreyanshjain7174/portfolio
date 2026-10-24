import * as THREE from 'three'

// Every model here is drawn from primitives for this site: era silhouettes,
// no badges, no logos, nothing traced from a real car.

export const MAT = {
  chrome: () => new THREE.MeshPhysicalMaterial({ color: 0xdedede, metalness: 1, roughness: 0.12 }),
  steel: () => new THREE.MeshStandardMaterial({ color: 0x9ea2a7, metalness: 0.9, roughness: 0.35 }),
  darkSteel: () => new THREE.MeshStandardMaterial({ color: 0x3a3c40, metalness: 0.85, roughness: 0.4 }),
  rubber: () => new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.85 }),
  glass: () =>
    new THREE.MeshPhysicalMaterial({ color: 0x0b0e12, metalness: 0.1, roughness: 0.04, clearcoat: 1, clearcoatRoughness: 0.03 }),
  walnut: () => new THREE.MeshStandardMaterial({ color: 0x2c1e15, roughness: 0.5 }),
  walnutLight: () => new THREE.MeshStandardMaterial({ color: 0x1c1714, roughness: 0.6 }),
  leather: (c = 0x2c1d15) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.6 }),
  suede: () => new THREE.MeshStandardMaterial({ color: 0x2b2c2e, roughness: 0.95 }),
  paint: (c: number) =>
    new THREE.MeshPhysicalMaterial({ color: c, metalness: 0.35, roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.06 }),
  light: (c = 0xfff1dc, i = 2.5) => new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: i }),
}

/* ---------- cars: side profile, extruded and bevelled like a clay design model ---------- */

type Profile = { len: number; top: [number, number][]; wheels: [number, number]; r: number; bottom?: number }

function bodyShape(p: Profile) {
  const s = new THREE.Shape()
  const b = p.bottom ?? 0.32
  s.moveTo(0, b)
  // the roofline runs through a spline, so the body reads as one sculpted surface
  const pts = [new THREE.Vector2(0, b), ...p.top.map(([x, y]) => new THREE.Vector2(x, y))]
  const spline = new THREE.SplineCurve(pts)
  for (const v of spline.getPoints(90).slice(1)) s.lineTo(v.x, v.y)
  s.lineTo(p.len, b)
  // wheel arches cut into the sill, rear then front
  const [w1, w2] = p.wheels
  for (const wx of [w2, w1]) {
    s.lineTo(wx + p.r + 0.08, b)
    s.absarc(wx, b - 0.02, p.r + 0.08, 0, Math.PI, false)
  }
  s.lineTo(0, b)
  return s
}

function extrude(shape: THREE.Shape, depth: number, bevel = 0.1) {
  const g = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelSize: bevel,
    bevelThickness: bevel * 1.3,
    bevelSegments: 5,
    curveSegments: 28,
  })
  g.translate(0, 0, -depth / 2)
  return g
}

function wheel(r: number, w: number) {
  const g = new THREE.Group()
  const tyre = new THREE.Mesh(new THREE.CylinderGeometry(r, r, w, 40), MAT.rubber())
  tyre.rotation.x = Math.PI / 2
  const rim = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.66, r * 0.66, w + 0.02, 40), MAT.chrome())
  rim.rotation.x = Math.PI / 2
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.2, r * 0.2, w + 0.05, 20), MAT.darkSteel())
  hub.rotation.x = Math.PI / 2
  g.add(tyre, rim, hub)
  return g
}

export type CarKind = 'cruiser' | 'coupe' | 'roadster' | 'saloon'

const PROFILES: Record<CarKind, Profile & { width: number; glass: [number, number][] }> = {
  // 1950s American cruiser: long, low, tail fins
  cruiser: {
    len: 5.3, width: 1.95, wheels: [1.15, 4.15], r: 0.4,
    top: [[0, 0.78], [0.25, 0.9], [1.9, 0.95], [2.45, 1.42], [3.55, 1.44], [4.25, 1.0], [5.05, 1.02], [5.3, 1.16], [5.3, 0.4]],
    glass: [[2.05, 0.99], [2.47, 1.36], [3.52, 1.38], [4.12, 1.02]],
  },
  // 1990s Japanese GT coupe: wedge nose, fastback, rear wing
  coupe: {
    len: 4.5, width: 1.8, wheels: [0.98, 3.62], r: 0.36,
    top: [[0, 0.58], [0.25, 0.7], [1.65, 0.84], [2.25, 1.27], [3.1, 1.29], [4.05, 0.98], [4.5, 0.95], [4.5, 0.38]],
    glass: [[1.82, 0.88], [2.28, 1.22], [3.08, 1.24], [3.92, 1.0]],
  },
  // 1960s roadster: long hood, small screen, open cockpit
  roadster: {
    len: 4.15, width: 1.72, wheels: [0.88, 3.38], r: 0.34,
    top: [[0, 0.6], [0.3, 0.76], [2.05, 0.84], [2.18, 0.86], [2.45, 0.86], [3.35, 0.86], [3.75, 0.92], [4.15, 0.8], [4.15, 0.36]],
    glass: [[2.05, 0.86], [2.25, 1.14], [2.32, 1.14], [2.2, 0.86]],
  },
  // modern grand saloon: upright nose, long roof, formal C-pillar
  saloon: {
    len: 5.8, width: 2.0, wheels: [1.18, 4.55], r: 0.46, bottom: 0.38,
    top: [[0, 1.06], [0.18, 1.12], [2.0, 1.15], [2.65, 1.63], [4.4, 1.65], [5.2, 1.2], [5.7, 1.16], [5.8, 1.06], [5.8, 0.42]],
    glass: [[2.2, 1.2], [2.68, 1.57], [4.36, 1.59], [5.0, 1.22]],
  },
}

export function car(kind: CarKind, color: number) {
  const p = PROFILES[kind]
  const g = new THREE.Group()
  const inner = new THREE.Group()
  inner.position.x = -p.len / 2
  g.add(inner)

  const paint = MAT.paint(color)
  const body = new THREE.Mesh(extrude(bodyShape(p), p.width - 0.4, 0.2), paint)
  inner.add(body)

  const gs = new THREE.Shape()
  gs.moveTo(p.glass[0][0], p.glass[0][1])
  for (const [x, y] of p.glass.slice(1)) gs.lineTo(x, y)
  gs.lineTo(p.glass[0][0], p.glass[0][1])
  const glass = new THREE.Mesh(extrude(gs, p.width - 0.3, 0.05), MAT.glass())
  inner.add(glass)

  for (const wx of p.wheels) for (const side of [-1, 1]) {
    const w = wheel(p.r, 0.26)
    w.position.set(wx, p.r, side * (p.width / 2 - 0.12))
    inner.add(w)
  }

  // headlamps and tail lamps, lit softly
  const lamp = new THREE.SphereGeometry(0.09, 16, 12)
  for (const side of [-1, 1]) {
    const h = new THREE.Mesh(lamp, MAT.light(0xfff6e8, 1.2))
    h.position.set(0.02, (p.top[0][1] + (p.bottom ?? 0.32)) / 2 + 0.08, side * (p.width / 2 - 0.35))
    h.scale.set(0.5, 1, 1)
    const t = new THREE.Mesh(lamp, MAT.light(0xb3121a, 0.9))
    t.position.set(p.len + 0.04, 0.78, side * (p.width / 2 - 0.3))
    t.scale.set(0.4, 0.8, 1.4)
    inner.add(h, t)
  }

  if (kind === 'cruiser') {
    // chrome bumpers and a side spear
    const bumper = new THREE.BoxGeometry(0.16, 0.16, p.width + 0.05)
    const f = new THREE.Mesh(bumper, MAT.chrome()); f.position.set(-0.05, 0.42, 0)
    const r = new THREE.Mesh(bumper, MAT.chrome()); r.position.set(p.len + 0.06, 0.45, 0)
    for (const side of [-1, 1]) {
      const spear = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.04, 0.02), MAT.chrome())
      spear.position.set(2.7, 0.72, side * (p.width / 2 + 0.01))
      inner.add(spear)
    }
    inner.add(f, r)
  }
  if (kind === 'coupe') {
    const wing = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.05, p.width - 0.1), paint)
    wing.position.set(4.18, 1.18, 0)
    for (const side of [-0.6, 0.6]) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.2, 0.05), MAT.rubber())
      post.position.set(4.2, 1.06, side)
      inner.add(post)
    }
    inner.add(wing)
  }
  if (kind === 'roadster') {
    const stripe = new THREE.MeshPhysicalMaterial({ color: 0xf2f0ea, roughness: 0.3, clearcoat: 1 })
    for (const off of [-0.16, 0.16]) {
      const s1 = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.012, 0.16), stripe)
      s1.position.set(1.1, 0.9, off)
      s1.rotation.z = -0.045
      const s2 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.012, 0.16), stripe)
      s2.position.set(3.78, 0.95, off)
      inner.add(s1, s2)
    }
    // two leather seats in the open cockpit
    for (const side of [-0.38, 0.38]) {
      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.34, 0.46), MAT.leather(0x4a2c1c))
      seat.position.set(2.95, 0.92, side)
      inner.add(seat)
    }
  }
  if (kind === 'saloon') {
    // a tall upright grille of plain vertical bars: no badge, no mascot
    const grille = new THREE.Group()
    for (let i = 0; i < 11; i++) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.46, 0.03), MAT.chrome())
      bar.position.set(-0.06, 0.78, -0.3 + i * 0.06)
      grille.add(bar)
    }
    const frame = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.54, 0.7), MAT.chrome())
    frame.position.set(-0.04, 0.78, 0)
    frame.scale.set(1, 1, 1)
    inner.add(grille)
    const sill = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.03, 0.02), MAT.chrome())
    for (const side of [-1, 1]) { const s = sill.clone(); s.position.set(2.9, 0.48, side * (p.width / 2 + 0.01)); inner.add(s) }
  }

  g.traverse((o) => { if ((o as THREE.Mesh).isMesh) { o.castShadow = true; o.receiveShadow = true } })
  return g
}

/* ---------- a vintage motorcycle, for the overlap year ---------- */
export function motorcycle(color: number) {
  const g = new THREE.Group()
  const paint = MAT.paint(color)
  for (const x of [-0.75, 0.75]) {
    const t = new THREE.Mesh(new THREE.TorusGeometry(0.33, 0.07, 16, 40), MAT.rubber())
    t.position.set(x, 0.4, 0)
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.015, 8, 40), MAT.chrome())
    rim.position.copy(t.position)
    for (let i = 0; i < 12; i++) {
      const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.52), MAT.chrome())
      spoke.position.copy(t.position); spoke.rotation.z = (i / 12) * Math.PI
      g.add(spoke)
    }
    g.add(t, rim)
  }
  const tank = new THREE.Mesh(new THREE.SphereGeometry(0.28, 28, 18), paint)
  tank.scale.set(1.5, 0.75, 0.8); tank.position.set(0.15, 1.0, 0)
  const seat = new THREE.Mesh(new THREE.CapsuleGeometry(0.11, 0.5, 8, 16), MAT.leather(0x3a2416))
  seat.rotation.z = Math.PI / 2; seat.position.set(-0.4, 0.98, 0)
  const engine = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.34, 0.3), MAT.steel())
  engine.position.set(0.05, 0.58, 0)
  const frame = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.0), MAT.darkSteel())
  frame.rotation.z = 1.1; frame.position.set(0.2, 0.72, 0)
  const fork = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.85), MAT.chrome())
  fork.rotation.z = 0.35; fork.position.set(0.62, 0.78, 0)
  const bars = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.7), MAT.chrome())
  bars.rotation.x = Math.PI / 2; bars.position.set(0.5, 1.2, 0)
  const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 12), MAT.light(0xfff6e8, 1))
  lamp.position.set(0.66, 1.08, 0)
  const exhaust = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.9), MAT.chrome())
  exhaust.rotation.z = Math.PI / 2 - 0.08; exhaust.position.set(-0.35, 0.42, 0.2)
  g.add(tank, seat, engine, frame, fork, bars, lamp, exhaust)
  g.traverse((o) => { if ((o as THREE.Mesh).isMesh) o.castShadow = true })
  return g
}

/* ---------- display furniture ---------- */
export function plinth(radius = 2.5) {
  const g = new THREE.Group()
  const top = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, 0.14, 72), new THREE.MeshStandardMaterial({ color: 0x1c1b1a, roughness: 0.25, metalness: 0.2 }))
  top.position.y = 0.07
  top.receiveShadow = true
  const ring = new THREE.Mesh(new THREE.TorusGeometry(radius - 0.02, 0.012, 8, 120), MAT.light(0xffe9cc, 3))
  ring.rotation.x = Math.PI / 2; ring.position.y = 0.02
  g.add(top, ring)
  return g
}

/** An engraved steel placard; the text is a canvas texture, the real copy is in the page. */
export function placard(lines: string[]) {
  const c = document.createElement('canvas'); c.width = 512; c.height = 256
  const x = c.getContext('2d')!
  x.fillStyle = '#b9bcc0'; x.fillRect(0, 0, 512, 256)
  x.fillStyle = '#2a2b2e'
  x.font = '500 58px "Instrument Serif", Georgia, serif'; x.fillText(lines[0], 32, 100)
  x.font = '400 30px Geist, Arial, sans-serif'
  lines.slice(1).forEach((l, i) => x.fillText(l, 34, 156 + i * 42))
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4
  const g = new THREE.Group()
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.85), MAT.darkSteel())
  post.position.y = 0.42
  const plate = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.31, 0.015), [MAT.darkSteel(), MAT.darkSteel(), MAT.darkSteel(), MAT.darkSteel(), new THREE.MeshStandardMaterial({ map: tex, metalness: 0.7, roughness: 0.35 }), MAT.darkSteel()])
  plate.position.y = 0.92; plate.rotation.x = -0.5
  g.add(post, plate)
  return g
}

/* ---------- wardrobe objects ---------- */
export function vault() {
  const g = new THREE.Group()
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.8, 0.62), MAT.steel())
  body.position.y = 0.4
  const door = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.66, 0.03), MAT.darkSteel())
  door.position.set(0, 0.4, 0.32)
  const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.05, 40), MAT.chrome())
  dial.rotation.x = Math.PI / 2; dial.position.set(-0.05, 0.5, 0.36)
  const handle = new THREE.Group()
  for (let i = 0; i < 3; i++) {
    const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.22), MAT.chrome())
    spoke.rotation.z = (i / 3) * Math.PI
    handle.add(spoke)
  }
  handle.position.set(0.12, 0.3, 0.37)
  for (const y of [0.18, 0.62]) {
    const hinge = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.1), MAT.chrome())
    hinge.position.set(-0.3, y, 0.33)
    g.add(hinge)
  }
  g.add(body, door, dial, handle)
  return { group: g, spin: dial }
}

export function piston() {
  const g = new THREE.Group()
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.08, 0.34), new THREE.MeshStandardMaterial({ color: 0x0f0f10, roughness: 0.4 }))
  base.position.y = 0.04
  const rod = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.44, 0.05), MAT.chrome())
  rod.position.y = 0.3
  const bigEnd = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.025, 12, 32), MAT.chrome())
  bigEnd.position.y = 0.12
  const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.36, 20), MAT.steel())
  pin.rotation.x = Math.PI / 2; pin.position.y = 0.55
  const head = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.24, 48), MAT.chrome())
  head.position.y = 0.6
  g.add(base, rod, bigEnd, pin, head)
  for (const y of [0.66, 0.69, 0.72]) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.171, 0.006, 6, 48), MAT.darkSteel())
    ring.rotation.x = Math.PI / 2; ring.position.y = y
    g.add(ring)
  }
  return g
}

export function microphone() {
  const g = new THREE.Group()
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.04, 40), MAT.darkSteel())
  base.position.y = 0.02
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.4), MAT.chrome())
  stem.position.y = 0.22
  const yoke = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.008, 8, 32, Math.PI), MAT.chrome())
  yoke.position.y = 0.48; yoke.rotation.z = Math.PI
  const cap = new THREE.Mesh(new THREE.CapsuleGeometry(0.075, 0.12, 8, 24), MAT.chrome())
  cap.position.y = 0.5
  const grille = new THREE.Mesh(new THREE.CapsuleGeometry(0.077, 0.12, 6, 18), new THREE.MeshStandardMaterial({ color: 0x222222, wireframe: true }))
  grille.position.y = 0.5
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(0.26, 40, 24, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.95, roughness: 0.03, thickness: 0.05, transparent: true, opacity: 0.35 }),
  )
  dome.scale.set(1, 2.6, 1); dome.position.y = 0.04
  g.add(base, stem, yoke, cap, grille, dome)
  return g
}

export function notebooks() {
  const g = new THREE.Group()
  const colors = [0x3b2416, 0x1d2430, 0x4a1f1f, 0x2b2b2b]
  colors.forEach((c, i) => {
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.06, 0.3), MAT.leather(c))
    b.position.y = 0.03 + i * 0.062; b.rotation.y = (i % 2 ? 1 : -1) * 0.06 * i
    g.add(b)
  })
  const pen = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.36, 16), new THREE.MeshPhysicalMaterial({ color: 0x0b0b0b, clearcoat: 1, roughness: 0.2 }))
  pen.rotation.z = Math.PI / 2; pen.rotation.y = 0.4; pen.position.y = 0.27
  g.add(pen)
  return g
}

export function jacket(color: number) {
  const s = new THREE.Shape()
  s.moveTo(-0.22, 0); s.lineTo(0.22, 0); s.lineTo(0.26, 0.78); s.lineTo(0.1, 0.92); s.lineTo(-0.1, 0.92); s.lineTo(-0.26, 0.78); s.lineTo(-0.22, 0)
  const m = new THREE.Mesh(extrude(s, 0.12, 0.04), new THREE.MeshStandardMaterial({ color, roughness: 0.9 }))
  return m
}

/* ---------- the drawer: skills as accessories ---------- */
export function watch(dial = 0x15171a) {
  const g = new THREE.Group()
  const caseM = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.07, 48), MAT.steel())
  const bezel = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.022, 10, 60), MAT.chrome())
  bezel.rotation.x = Math.PI / 2; bezel.position.y = 0.036
  const face = new THREE.Mesh(new THREE.CylinderGeometry(0.168, 0.168, 0.072, 48), new THREE.MeshStandardMaterial({ color: dial, roughness: 0.45, metalness: 0.3 }))
  const hand = (len: number, w: number) => {
    const h = new THREE.Mesh(new THREE.BoxGeometry(w, 0.006, len), new THREE.MeshStandardMaterial({ color: 0xf2efe8, metalness: 0.6, roughness: 0.3 }))
    h.geometry.translate(0, 0, -len / 2)
    const pivot = new THREE.Group(); pivot.add(h); pivot.position.y = 0.04
    return pivot
  }
  const hour = hand(0.09, 0.018), minute = hand(0.135, 0.012), second = hand(0.15, 0.004)
  second.position.y = 0.045
  for (let i = 0; i < 12; i++) {
    const idx = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.005, 0.03), new THREE.MeshStandardMaterial({ color: 0xe9e5dc }))
    const a = (i / 12) * Math.PI * 2
    idx.position.set(Math.sin(a) * 0.145, 0.038, -Math.cos(a) * 0.145); idx.rotation.y = -a
    g.add(idx)
  }
  for (const z of [-0.33, 0.33]) {
    const strap = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.035, 0.42), MAT.steel())
    strap.position.set(0, -0.01, z)
    g.add(strap)
  }
  g.add(caseM, bezel, face, hour, minute, second)
  return { group: g, hour, minute, second }
}

export function sunglasses() {
  const g = new THREE.Group()
  const frame = new THREE.MeshPhysicalMaterial({ color: 0x5a3416, roughness: 0.25, clearcoat: 1 })
  for (const x of [-0.17, 0.17]) {
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.018, 10, 40), frame)
    rim.rotation.x = Math.PI / 2; rim.position.x = x
    const lens = new THREE.Mesh(new THREE.CircleGeometry(0.11, 32), new THREE.MeshPhysicalMaterial({ color: 0x1a1a14, roughness: 0.05, metalness: 0.3, transparent: true, opacity: 0.85 }))
    lens.rotation.x = -Math.PI / 2; lens.position.set(x, 0.005, 0)
    g.add(rim, lens)
  }
  const bridge = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.012, 8, 20, Math.PI), frame)
  bridge.rotation.x = -Math.PI / 2
  const armL = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, 0.4), frame); armL.position.set(-0.29, 0, 0.2)
  const armR = armL.clone(); armR.position.x = 0.29
  g.add(bridge, armL, armR)
  return g
}

export function cufflinks() {
  const g = new THREE.Group()
  for (const x of [-0.07, 0.07]) {
    const head = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.02, 32), MAT.chrome())
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.015, 0.09), MAT.steel())
    head.position.set(x, 0.02, 0); bar.position.set(x, 0.008, 0.04)
    g.add(head, bar)
  }
  return g
}

export function fountainPen() {
  const g = new THREE.Group()
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.018, 0.42, 24), new THREE.MeshPhysicalMaterial({ color: 0x0a0a0a, clearcoat: 1, roughness: 0.15 }))
  body.rotation.x = Math.PI / 2
  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.023, 0.023, 0.02, 24), MAT.chrome())
  band.rotation.x = Math.PI / 2; band.position.z = -0.06
  const clip = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.012, 0.13), MAT.chrome())
  clip.position.set(0, 0.026, -0.13)
  g.add(body, band, clip)
  return g
}

export function cardHolder() {
  const m = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.03, 0.24), MAT.leather(0x2a1a12))
  const card = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.005, 0.06), new THREE.MeshStandardMaterial({ color: 0xcfc8bc }))
  card.position.set(0.02, 0.018, -0.07)
  const g = new THREE.Group(); g.add(m, card)
  return g
}

export function pocketSquare() {
  const m = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.025, 0.34), new THREE.MeshStandardMaterial({ color: 0x1f2a4a, roughness: 0.55, metalness: 0.1 }))
  m.rotation.y = 0.12
  return m
}

/* ---------- the lounge ---------- */
export function loungeChair() {
  const g = new THREE.Group()
  const L = MAT.leather(0x2e1c13)
  const shell = MAT.walnut()
  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.16, 0.75), L); seat.position.set(0, 0.45, 0)
  const back = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.75, 0.16), L); back.position.set(0, 0.82, -0.35); back.rotation.x = -0.28
  const shellBack = new THREE.Mesh(new THREE.BoxGeometry(0.84, 0.78, 0.04), shell); shellBack.position.set(0, 0.82, -0.45); shellBack.rotation.x = -0.28
  const armL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.6), L); armL.position.set(-0.45, 0.62, -0.02)
  const armR = armL.clone(); armR.position.x = 0.45
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.36), MAT.darkSteel()); stem.position.y = 0.2
  g.add(seat, back, shellBack, armL, armR, stem)
  for (let i = 0; i < 5; i++) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.03, 0.42), MAT.darkSteel())
    leg.geometry.translate(0, 0, 0.21); leg.position.y = 0.03; leg.rotation.y = (i / 5) * Math.PI * 2
    g.add(leg)
  }
  const ottoman = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.14, 0.5), L); ottoman.position.set(0, 0.36, 1.05)
  const oStem = stem.clone(); oStem.position.set(0, 0.16, 1.05); oStem.scale.y = 0.8
  g.add(ottoman, oStem)
  g.traverse((o) => { if ((o as THREE.Mesh).isMesh) o.castShadow = true })
  return g
}

export function frame(tex: THREE.Texture | null, w = 0.9, h = 1.15) {
  const g = new THREE.Group()
  const border = new THREE.Mesh(new THREE.BoxGeometry(w + 0.1, h + 0.1, 0.05), new THREE.MeshStandardMaterial({ color: 0x0c0c0c, roughness: 0.4 }))
  const mat = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ color: 0xefebe3, roughness: 0.9 }))
  mat.position.z = 0.027
  const photo = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.78, h * 0.78), new THREE.MeshStandardMaterial({ map: tex ?? undefined, color: tex ? 0xffffff : 0x3a3732, roughness: 0.7 }))
  photo.position.z = 0.028
  const lamp = new THREE.Mesh(new THREE.BoxGeometry(w * 0.7, 0.03, 0.06), MAT.light(0xfff0dc, 1.6))
  lamp.position.set(0, h / 2 + 0.22, 0.1)
  g.add(border, mat, photo, lamp)
  return g
}

/** A night skyline painted once into a texture, for the windows. */
export function skyline() {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 512
  const x = c.getContext('2d')!
  x.fillStyle = '#0d1424'; x.fillRect(0, 0, 1024, 512)
  x.fillStyle = '#131c30'; x.fillRect(0, 300, 1024, 212)
  let seed = 3
  const r = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280)
  for (let i = 0; i < 46; i++) {
    const w = 30 + r() * 70, h = 120 + r() * 300, px = r() * 1024
    x.fillStyle = `rgb(${14 + r() * 10},${18 + r() * 10},${30 + r() * 14})`
    x.fillRect(px, 512 - h, w, h)
    for (let wy = 512 - h + 8; wy < 500; wy += 12) for (let wx = px + 5; wx < px + w - 6; wx += 9) {
      if (r() > 0.82) { x.fillStyle = r() > 0.25 ? 'rgba(255,214,150,.55)' : 'rgba(200,220,255,.45)'; x.fillRect(wx, wy, 3, 4) }
    }
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace
  return t
}

export function keyFob() {
  const g = new THREE.Group()
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.05, 0.12, 8, 20), new THREE.MeshPhysicalMaterial({ color: 0x0c0c0d, clearcoat: 1, roughness: 0.25 }))
  body.rotation.z = Math.PI / 2; body.scale.set(1, 1, 0.45); body.position.y = 0.03
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.007, 8, 32), MAT.chrome())
  ring.position.set(-0.15, 0.03, 0); ring.rotation.x = Math.PI / 2
  for (let i = 0; i < 3; i++) {
    const b = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.006, 16), MAT.darkSteel())
    b.position.set(-0.04 + i * 0.04, 0.053, 0)
    g.add(b)
  }
  g.add(body, ring)
  return g
}

export function helmet() {
  const g = new THREE.Group()
  const shell = new THREE.Mesh(new THREE.SphereGeometry(0.17, 40, 28, 0, Math.PI * 2, 0, Math.PI * 0.62), MAT.paint(0xe9e4da))
  shell.position.y = 0.17
  const visor = new THREE.Mesh(new THREE.SphereGeometry(0.172, 40, 12, -0.9, 1.8, Math.PI * 0.32, Math.PI * 0.2), MAT.glass())
  visor.position.y = 0.17
  const stripe = new THREE.Mesh(new THREE.TorusGeometry(0.168, 0.012, 8, 60, Math.PI), MAT.paint(0x14213d))
  stripe.rotation.y = Math.PI / 2; stripe.position.y = 0.17
  g.add(shell, visor, stripe)
  return g
}

export function pens() {
  const g = new THREE.Group()
  ;[0, 1, 2].forEach((i) => { const p = fountainPen(); p.position.set(-0.08 + i * 0.08, 0.03, 0); p.rotation.y = 0.15 * (i - 1); g.add(p) })
  const tray = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.02, 0.5), MAT.leather(0x1c120c))
  g.add(tray)
  return g
}

/** A tailor's dummy in a two-piece suit, until the real model arrives. */
export function suitStand(color = 0x1f2430) {
  const g = new THREE.Group()
  const cloth = new THREE.MeshStandardMaterial({ color, roughness: 0.85 })
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.2, 0.75, 32), cloth); torso.position.y = 1.35; torso.scale.z = 0.6
  const shoulders = new THREE.Mesh(new THREE.CapsuleGeometry(0.09, 0.36, 8, 16), cloth); shoulders.rotation.z = Math.PI / 2; shoulders.position.y = 1.7; shoulders.scale.z = 0.8
  const lapel = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.32, 0.02), new THREE.MeshStandardMaterial({ color: 0xeeeae2, roughness: 0.7 })); lapel.position.set(0, 1.55, 0.15)
  const tie = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.28, 0.02), new THREE.MeshStandardMaterial({ color: 0x5a1a22, roughness: 0.5 })); tie.position.set(0, 1.52, 0.162)
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.14, 16), MAT.walnutLight()); neck.position.y = 1.86
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.95), MAT.darkSteel()); pole.position.y = 0.5
  const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.24, 0.04, 40), MAT.darkSteel()); foot.position.y = 0.02
  g.add(torso, shoulders, lapel, tie, neck, pole, foot)
  return g
}

/** A framed honour for the hall of fame: title, detail, note, set like an engraved certificate. */
export function honour(title: string, detail: string, note: string) {
  const c = document.createElement('canvas'); c.width = 900; c.height = 640
  const x = c.getContext('2d')!
  x.fillStyle = '#efe9df'; x.fillRect(0, 0, 900, 640)
  x.strokeStyle = '#2a2622'; x.lineWidth = 3; x.strokeRect(36, 36, 828, 568)
  x.fillStyle = '#2a2622'; x.textAlign = 'center'
  x.font = '400 92px "Instrument Serif", Georgia, serif'; x.fillText(title, 450, 280)
  x.font = '500 34px Geist, Arial, sans-serif'; x.fillText(detail, 450, 360)
  x.fillStyle = '#6d655b'; x.font = 'italic 400 34px "Instrument Serif", Georgia, serif'; x.fillText(note, 450, 440)
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4
  return frame(tex, 1.25, 0.9)
}

/** A small engraved plate for a social account. */
export function socialPlate(label: string, handle: string) {
  const c = document.createElement('canvas'); c.width = 600; c.height = 200
  const x = c.getContext('2d')!
  x.fillStyle = '#9fa3a8'; x.fillRect(0, 0, 600, 200)
  x.fillStyle = '#1d1e20'; x.textAlign = 'center'
  x.font = '400 64px "Instrument Serif", Georgia, serif'; x.fillText(label, 300, 92)
  x.font = '400 30px Geist, Arial, sans-serif'; x.fillText(handle, 300, 150)
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace
  return new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.25, 0.02), [MAT.darkSteel(), MAT.darkSteel(), MAT.darkSteel(), MAT.darkSteel(), new THREE.MeshStandardMaterial({ map: tex, metalness: 0.7, roughness: 0.3 }), MAT.darkSteel()])
}
