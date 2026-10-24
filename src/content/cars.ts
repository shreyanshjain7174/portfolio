// The garage: each job is parked as a vehicle, and each vehicle has its own story.
// Every sound is a real recording (see `sound.credit`), cut into a start-up and an idle that loops.

export type EngineSound = {
  /** file in /public/sounds: start-up first, then an idle that loops between loopStart and loopEnd */
  file: string
  loopStart: number
  loopEnd: number
  credit: string
}

export type CarStory = {
  job: string
  name: string
  years: string
  engine: string
  power: string
  facts: { value: string; label: string }[]
  story: string[]
  sound: EngineSound
  /** wakes with a chime instead of a fuel pump, and has no engine to rev */
  electric?: boolean
  standby: string
}

export const CARS: CarStory[] = [
  {
    job: 'redhat',
    name: 'Chevrolet Bel Air',
    years: '1957',
    engine: '283 cu in (4.6 L) small-block V8',
    power: 'Up to 283 hp with Ramjet fuel injection',
    facts: [
      { value: '283', label: 'hp from 283 cubic inches' },
      { value: '1955–57', label: 'the Tri-Five years' },
    ],
    story: [
      'The last and best loved of the Tri-Five Chevrolets. Tailfins, a full-width grille and chrome everywhere.',
      'The optional fuel-injected 283 made one horsepower per cubic inch, among the first production engines to do it.',
    ],
    sound: { file: '/sounds/bel-air.m4a', loopStart: 3.4, loopEnd: 14.15, credit: 'Classic V8 start-up (1978 Cadillac Eldorado) by inspire153, CC0, via Freesound' },
    standby: 'Ignition on. The fuel pump ticks.',
  },
  {
    job: 'ibm',
    name: 'Chevrolet Impala',
    years: '1967',
    engine: 'Up to a 427 cu in (7.0 L) big-block V8',
    power: 'Up to 385 hp',
    facts: [
      { value: '427', label: 'cubic inches at the top of the range' },
      { value: '1M+', label: 'Impalas sold in 1965 alone' },
    ],
    story: [
      'The full-size Chevrolet that America bought by the million. The 1967 body brought a long, fastback roof and Coke-bottle hips.',
      'Built to cross a continent in comfort, which is why it is still the car people picture on an open highway.',
    ],
    sound: { file: '/sounds/impala.m4a', loopStart: 2.3, loopEnd: 6.85, credit: 'Chevrolet Impala ignition by JulesV4, CC0, via Freesound' },
    standby: 'Ignition on. The gauges sweep.',
  },
  {
    job: 'arista',
    name: 'Ford Mustang Roush Stage 3',
    years: '2019',
    engine: 'Supercharged 5.0 L Coyote V8',
    power: '710 hp, 610 lb-ft',
    facts: [
      { value: '710', label: 'hp from the Roush supercharger' },
      { value: '5.0', label: 'litre Coyote V8 underneath' },
    ],
    story: [
      'Roush takes a Mustang GT and adds a supercharger, suspension, brakes and bodywork, then signs the car.',
      'Stage 3 is the top of the ladder: the same 5.0 V8 Ford builds, pushed well past 700 horsepower.',
    ],
    sound: { file: '/sounds/mustang.m4a', loopStart: 3.4, loopEnd: 14.55, credit: 'Supercharged Mustang V8 start-up (2004 Cobra SVT) by mainswor, CC0, via Freesound' },
    standby: 'Ignition on. The dash wakes up.',
  },
  {
    job: 'xbattery',
    name: 'Honda CB750 Four',
    years: '1970',
    engine: '736 cc air-cooled inline-four',
    power: '67 hp',
    facts: [
      { value: '4', label: 'cylinders across the frame' },
      { value: '1969', label: 'the first modern superbike' },
    ],
    story: [
      'The bike that changed motorcycling: a transverse four, a front disc brake and an electric starter, all at a price people could pay.',
      'Ridden here as the side road: built alongside the main job, at the same time.',
    ],
    sound: { file: '/sounds/cb750.m4a', loopStart: 2.0, loopEnd: 5.15, credit: 'Honda CB 750 C engine sound by CrossFX, CC0, via Freesound' },
    standby: 'Key on. The neutral light glows green.',
  },
  {
    job: 'microsoft',
    name: 'Rolls-Royce Spectre',
    years: '2026',
    engine: 'Twin electric motors, all-wheel drive',
    power: '577 hp (430 kW), 900 Nm',
    facts: [
      { value: '577', label: 'hp, delivered in silence' },
      { value: '0', label: 'engines: the first electric Rolls-Royce' },
    ],
    story: [
      'The first all-electric Rolls-Royce, a two-door coupé with starlight doors and the widest grille the marque has made.',
      'There is no engine to start. It wakes, hums, and waits.',
    ],
    sound: { file: '/sounds/spectre.m4a', loopStart: 3.5, loopEnd: 16.75, credit: 'Electric car start-up by evsecrets, CC0, via Freesound' },
    electric: true,
    standby: 'Systems on. Starlight doors lit.',
  },
]

export const carFor = (job: string) => CARS.find((c) => c.job === job)
