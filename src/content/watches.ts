// The watch drawer: each piece with a little of its history. Kept for the love of it, not as a metaphor.

export type WatchStory = {
  label: string
  maker: string
  model: string
  facts: { value: string; label: string }[]
  story: string[]
}

export const WATCH_STORIES: WatchStory[] = [
  {
    label: 'Patek Philippe',
    maker: 'Patek Philippe',
    model: 'Dress watch, black dial',
    facts: [
      { value: '1839', label: 'founded in Geneva' },
      { value: '1932', label: 'the first Calatrava' },
    ],
    story: [
      'One of the oldest independent, family-owned watchmakers in Geneva, still making most of its movements in house.',
      'A plain black dial on a leather strap: the quietest piece in the drawer, and the one that needs no explaining.',
    ],
  },
  {
    label: 'Rolex Datejust',
    maker: 'Rolex',
    model: 'Datejust, green dial, fluted bezel',
    facts: [
      { value: '1945', label: 'the Datejust is introduced' },
      { value: '1953', label: 'the Cyclops lens over the date' },
    ],
    story: [
      'The first self-winding chronometer wristwatch to show the date in a window on the dial.',
      'The fluted bezel and the magnified date have barely changed since, which is the point.',
    ],
  },
  {
    label: 'Omega Seamaster 300',
    maker: 'Omega',
    model: 'Seamaster 300, blue dial',
    facts: [
      { value: '1957', label: 'launched with the Speedmaster' },
      { value: '1995', label: 'on James Bond’s wrist ever since' },
    ],
    story: [
      'Born in 1957 as a professional dive watch, alongside the Speedmaster and the Railmaster.',
      'The Seamaster has been 007’s watch since GoldenEye. The one here is a favourite for exactly that reason.',
    ],
  },
  {
    label: 'Seiko',
    maker: 'Seiko',
    model: 'Steel bracelet, dark dial',
    facts: [
      { value: '1881', label: 'founded in Tokyo' },
      { value: '1969', label: 'the Astron, the first quartz wristwatch' },
    ],
    story: [
      'Seiko makes nearly every part itself, down to the hairsprings, and gave the world its first quartz wristwatch.',
      'Its Grand Seiko line, started in 1960, is the Japanese answer to Geneva.',
    ],
  },
]

export const watchFor = (id: string) => WATCH_STORIES.find((w) => `watch:${w.label}` === id)
