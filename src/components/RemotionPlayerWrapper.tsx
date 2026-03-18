'use client';
import { Player } from '@remotion/player';
import { IntroVideo } from '../remotion/IntroVideo';
import React from 'react';

export const RemotionPlayerWrapper = () => {
  return (
    <div className="w-full flex justify-center items-center h-[300px] mb-8 relative z-20 overflow-visible">
      <Player
        component={IntroVideo}
        durationInFrames={120}
        compositionWidth={800}
        compositionHeight={300}
        fps={30}
        controls={false}
        autoPlay
        loop
        acknowledgeRemotionLicense={true}
        style={{
          width: '100%',
          maxWidth: '800px',
        }}
      />
    </div>
  );
};
