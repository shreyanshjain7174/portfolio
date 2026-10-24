// Written by scripts/models.mjs: the real models that are present in /public/models.
// Anything not listed here is drawn from primitives until its file arrives. `yaw` turns a model to face the room.
export const AVAILABLE_MODELS: Record<string, { file: string; credit: string; yaw?: number }> = {
  'bel-air-1957': {
    'file': 'bel-air-1957.glb',
    'credit': '“1957 Chevrolet Bel Air” by DisneyCars, CC BY 4.0, sketchfab.com'
  },
  'impala-1967': {
    'file': 'impala-1967.glb',
    'credit': '“Chevrolet Impala 1967” by Eques_inferno, CC BY 4.0, sketchfab.com'
  },
  'mustang-roush-2019': {
    'file': 'mustang-roush-2019.glb',
    'credit': '“Ford Mustang ROUSH 2019 - Stage 3” by _the.render.box_, CC BY 4.0, sketchfab.com'
  },
  'cb750-1970': {
    'file': 'cb750-1970.glb',
    'credit': '“Honda CB 750 F Super Sport 1970” by ALEX. KA., CC BY 4.0, sketchfab.com'
  },
  'spectre-2026': {
    'file': 'spectre-2026.glb',
    'credit': '“2026 Rolls-Royce Spectre” by tonielpro520, CC BY 4.0, sketchfab.com'
  },
  'watch-patek': {
    'file': 'watch-patek.glb',
    'credit': '“Patek Philippe” by viola55477, CC BY 4.0, sketchfab.com'
  },
  'watch-rolex': {
    'file': 'watch-rolex.glb',
    'credit': '“Rolex Datejust” by Yevhen Artamonov, CC BY 4.0, sketchfab.com'
  },
  'watch-omega': {
    'file': 'watch-omega.glb',
    'credit': '“OMEGA Seamaster 300 Watch” by Rowen Halpern, CC BY 4.0, sketchfab.com'
  },
  'watch-seiko': {
    'file': 'watch-seiko.glb',
    'credit': '“Seiko Watch” by carloshisserich, CC BY 4.0, sketchfab.com'
  },
  'suit': {
    'file': 'suit.glb',
    'credit': '“Mannequin With Suit” by kg007, CC BY 4.0, sketchfab.com'
  }
}
