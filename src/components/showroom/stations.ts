// The walk-through: where the camera stands at each stop, and what it looks at.
// Rooms: garage x[-12,12], workshop x[12,28], wardrobe x[28,40], hall x[40,52]; the street is at z > 6.

export type V3 = [number, number, number]
export type Room = 'entrance' | 'garage' | 'workshop' | 'wardrobe' | 'hall'
export type Station = { id: string; room: Room; pos: V3; look: V3 }

export const STATIONS: Station[] = [
  { id: 'entrance', room: 'entrance', pos: [0, 1.6, 14.5], look: [0, 1.5, 0] },
  { id: 'garage', room: 'garage', pos: [0, 2.7, 4.9], look: [0, 0.8, -3] },
  { id: 'redhat', room: 'garage', pos: [-7.4, 1.9, 4.6], look: [-10.6, 0.8, -2.2] },
  { id: 'ibm', room: 'garage', pos: [-2.9, 1.85, 4.6], look: [-6.1, 0.75, -2.2] },
  { id: 'arista', room: 'garage', pos: [1.6, 1.8, 4.5], look: [-1.5, 0.7, -2.2] },
  { id: 'xbattery', room: 'garage', pos: [5.8, 1.6, 2.8], look: [3.4, 0.8, -2.2] },
  { id: 'microsoft', room: 'garage', pos: [10.9, 2.0, 3.8], look: [7.2, 0.9, -2.2] },
  { id: 'skills', room: 'workshop', pos: [15.2, 2.0, 1.9], look: [16.4, 2.1, -6] },
  { id: 'projects', room: 'workshop', pos: [22.2, 2.0, 1.6], look: [23.6, 2.2, -6] },
  { id: 'wardrobe', room: 'wardrobe', pos: [29.6, 2.0, 3.4], look: [35.5, 1.3, -3] },
  { id: 'hobbies', room: 'wardrobe', pos: [31.2, 1.9, 1.2], look: [32.6, 2.1, -5] },
  { id: 'watches', room: 'wardrobe', pos: [35.5, 3.15, 2.45], look: [35.7, 0.6, 1.25] },
  { id: 'hall', room: 'hall', pos: [44.6, 2.0, 2.6], look: [46.2, 2.1, -5] },
  { id: 'exit', room: 'hall', pos: [44.4, 1.9, 0.9], look: [52, 2.3, 0.6] },
]

export const ROOMS = [
  { id: 'entrance', label: 'Entrance' },
  { id: 'garage', label: 'Garage' },
  { id: 'skills', label: 'Workshop' },
  { id: 'wardrobe', label: 'Wardrobe' },
  { id: 'hall', label: 'Hall of fame' },
  { id: 'exit', label: 'Reach out' },
] as const

/** The career, oldest to newest. `model` is the file in /public/models once it exists. */
export const VEHICLES = [
  { job: 'redhat', kind: 'cruiser', model: 'bel-air-1957', len: 5.0, color: 0xa9d8c6, x: -9, era: '1957 Bel Air', note: 'Where it started.' },
  { job: 'ibm', kind: 'coupe', model: 'impala-1967', len: 5.3, color: 0x7a0f17, x: -4.5, era: '1967 Impala', note: 'Built to go the distance.' },
  { job: 'arista', kind: 'roadster', model: 'mustang-roush-2019', len: 4.8, tint: 0x16233f, color: 0x14213d, x: 0, era: '2019 Mustang Roush', note: 'Light, fast, precise.' },
  { job: 'xbattery', kind: 'motorcycle', model: 'cb750-1970', len: 2.15, color: 0x2f3b2a, x: 4.5, era: '1970 café motorcycle', note: 'The side road, ridden at the same time.' },
  { job: 'microsoft', kind: 'saloon', model: 'spectre-2026', len: 5.45, color: 0x0d0d0f, x: 9, era: '2026 Rolls-Royce Spectre', note: 'The flagship.' },
] as const

/** Images on the workshop lightbox, one per project, in /public/images/projects. */
export const PROJECT_IMAGES: Record<string, string> = {
  'agentic-operator': '/images/projects/agentic-operator.webp',
  zerodb: '/images/projects/zerodb.webp',
  agentgate: '/images/projects/agentgate.webp',
  memtorture: '/images/projects/memtorture.webp',
  'agent-native-format': '/images/projects/agent-native-format.webp',
  piko: '/images/projects/piko.webp',
}

/** The watch drawer: kept for the love of it, not as a metaphor. */
export const WATCHES = [
  { model: 'watch-patek', label: 'Patek Philippe', dial: 0x15171a, upright: true },
  { model: 'watch-rolex', label: 'Rolex Datejust', dial: 0x1f2c44, upright: false },
  { model: 'watch-omega', label: 'Omega Seamaster 300', dial: 0x3a2418, upright: false },
  { model: 'watch-seiko', label: 'Seiko', dial: 0x2a3b3a, upright: false },
] as const

/** Tailoring on display in the wardrobe. */
export const SUITS = [
  { model: 'suit', x: 38.9, z: -2.7, ry: -Math.PI / 2 + 0.25 },
  { model: 'suit', x: 38.9, z: -0.9, ry: -Math.PI / 2 - 0.15 },
] as const
