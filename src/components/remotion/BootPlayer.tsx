'use client'

import React from 'react'
import { Player } from '@remotion/player'
import { BootSequence } from './BootSequence'

/**
 * BootPlayer — Remotion Player wrapper for the BootSequence composition.
 *
 * Renders an inline video player (no chrome, autoplay, looping) that plays
 * the cinematic boot sequence intro. Designed to sit inside the hero
 * MangaPanel as a background-style element.
 *
 * Uses @remotion/player to embed Remotion compositions in a Next.js page
 * without needing a separate Remotion project structure.
 */
export function BootPlayer() {
  return (
    <div
      style={{
        width: '100%',
        aspectRatio: '16 / 9',
        maxHeight: '340px',
        overflow: 'hidden',
        borderRadius: '2px',
      }}
    >
      <Player
        component={BootSequence}
        compositionWidth={1280}
        compositionHeight={720}
        durationInFrames={240}
        fps={30}
        autoPlay
        loop
        style={{
          width: '100%',
          height: '100%',
        }}
        controls={false}
      />
    </div>
  )
}

export default BootPlayer
