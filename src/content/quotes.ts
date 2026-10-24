// The last wall of the showroom: one quiet line on money, taste and time, different on every visit.

export type Quote = { text: string; by: string }

export const QUOTES: Quote[] = [
  { text: 'Price is what you pay. Value is what you get.', by: 'Warren Buffett' },
  { text: 'Someone is sitting in the shade today because someone planted a tree a long time ago.', by: 'Warren Buffett' },
  { text: 'Quality is remembered long after the price is forgotten.', by: 'Aldo Gucci' },
  { text: 'Luxury must be comfortable, otherwise it is not luxury.', by: 'Coco Chanel' },
  { text: 'Wealth consists not in having great possessions, but in having few wants.', by: 'Epictetus' },
  { text: 'Money is a good servant but a bad master.', by: 'Francis Bacon' },
  { text: 'Never spend your money before you have it.', by: 'Thomas Jefferson' },
  { text: 'The way to wealth depends on just two words, industry and frugality.', by: 'Benjamin Franklin' },
  { text: 'Time is the most valuable thing a man can spend.', by: 'Theophrastus' },
  { text: 'The best investment you can make is in yourself.', by: 'Warren Buffett' },
  { text: 'Fortune favours the bold.', by: 'Virgil' },
  { text: 'Do not save what is left after spending; spend what is left after saving.', by: 'Warren Buffett' },
]

/** a different quote from the one showing now */
export function nextQuote(current?: Quote) {
  const pool = QUOTES.filter((q) => q !== current)
  return pool[Math.floor(Math.random() * pool.length)]
}
