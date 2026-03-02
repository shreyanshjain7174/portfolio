'use client'

import React from 'react'
import { Player } from '@remotion/player'
import { OceanIntro } from './OceanIntro'

/**
 * BootPlayer — Remotion Player wrapper for the OceanIntro composition.
 * Renders an inline video player (no chrome, autoplay, looping) that plays
 * the cinematic ocean intro. Used as ambient background in the hero section.
 */
export function BootPlayer() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
      }}
    >
      <Player
        component={OceanIntro}
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
