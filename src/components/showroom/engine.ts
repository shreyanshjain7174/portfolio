import type { CarStory } from '@/content/cars'

// One engine at a time, played through Web Audio. Recorded start-ups run straight into a looped idle;
// a rev is the same idle pitched up. Nothing loads or plays until the visitor asks for it.
// The only synthesised sounds are the small ones around the engine: the key, the pump, the chime.

export type Ignition = 'off' | 'standby' | 'running'

let ctx: AudioContext | null = null
const buffers = new Map<string, Promise<AudioBuffer>>()

function audio() {
  if (!ctx) ctx = new AudioContext()
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

function load(file: string) {
  let p = buffers.get(file)
  if (!p) {
    p = fetch(file).then((r) => r.arrayBuffer()).then((b) => audio().decodeAudioData(b))
    buffers.set(file, p)
  }
  return p
}

/** fetch and decode a car's recording ahead of time, so Start answers at once */
export function prepare(car: CarStory) {
  void load(car.sound.file).catch(() => buffers.delete(car.sound.file))
}

// short synthetic cues for the parts that are not the engine: the key, the chime, the pump
function click(at: number) {
  const a = audio()
  const n = a.createBuffer(1, Math.floor(a.sampleRate * 0.03), a.sampleRate)
  const d = n.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 6)
  const s = a.createBufferSource(); s.buffer = n
  const f = a.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 2600; f.Q.value = 1.2
  const g = a.createGain(); g.gain.value = 0.5
  s.connect(f).connect(g).connect(a.destination); s.start(at)
}

function tone(freq: number, at: number, len: number, level: number, type: OscillatorType = 'sine') {
  const a = audio()
  const o = a.createOscillator(); o.type = type; o.frequency.value = freq
  const g = a.createGain()
  g.gain.setValueAtTime(0, at)
  g.gain.linearRampToValueAtTime(level, at + 0.02)
  g.gain.exponentialRampToValueAtTime(0.0001, at + len)
  o.connect(g).connect(a.destination); o.start(at); o.stop(at + len + 0.05)
}

export class Engine {
  private src: AudioBufferSourceNode | null = null
  private gain: GainNode | null = null
  private token = 0

  constructor(private car: CarStory) {}

  standby() {
    const a = audio(), t = a.currentTime
    click(t)
    if (!this.car.electric) {
      // an electric fuel pump priming: a thin whine that swells and settles
      const o = a.createOscillator(); o.type = 'sawtooth'; o.frequency.setValueAtTime(180, t + 0.08); o.frequency.linearRampToValueAtTime(240, t + 1.1)
      const f = a.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 900
      const g = a.createGain(); g.gain.setValueAtTime(0, t + 0.08); g.gain.linearRampToValueAtTime(0.025, t + 0.3); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.4)
      o.connect(f).connect(g).connect(a.destination); o.start(t + 0.08); o.stop(t + 1.5)
    } else {
      // the Spectre wakes with a soft two-note chime
      tone(784, t + 0.1, 1.2, 0.08); tone(1175, t + 0.32, 1.6, 0.06)
    }
  }

  async start(onRunning?: () => void) {
    const id = ++this.token
    const a = audio(), t = a.currentTime
    if (!this.car.electric) click(t)
    const { file, loopStart, loopEnd } = this.car.sound
    const buf = await load(file)
    if (id !== this.token) return
    const src = a.createBufferSource()
    src.buffer = buf; src.loop = true; src.loopStart = loopStart; src.loopEnd = loopEnd
    const g = a.createGain(); g.gain.value = 0.9
    src.connect(g).connect(a.destination)
    src.start(a.currentTime + 0.05)
    this.src = src; this.gain = g
    onRunning?.()
  }

  /** 0 is idle, 1 is a hard blip of the throttle */
  rev(r: number) {
    const a = audio(), t = a.currentTime
    if (!this.src || !this.gain) return
    // an electric drive only climbs a little in pitch; an engine flares
    this.src.playbackRate.cancelScheduledValues(t)
    this.src.playbackRate.setTargetAtTime(1 + r * (this.car.electric ? 0.3 : 0.75), t, r > 0 ? 0.12 : 0.35)
    this.gain.gain.setTargetAtTime(0.9 + r * 0.5, t, 0.1)
  }

  stop() {
    this.token++
    const a = audio(), t = a.currentTime
    const src = this.src, g = this.gain
    this.src = null; this.gain = null
    if (!src || !g) return
    // the idle sags as the engine runs down, then it is quiet
    src.playbackRate.cancelScheduledValues(t)
    src.playbackRate.setTargetAtTime(0.55, t, 0.35)
    g.gain.cancelScheduledValues(t)
    g.gain.setTargetAtTime(0, t + 0.15, 0.25)
    src.stop(t + 1.6)
  }
}
