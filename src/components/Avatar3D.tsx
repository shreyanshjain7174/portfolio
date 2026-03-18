'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/*
  Notion/Sketch Style Interactive SVG Avatar
  - Pure SVG, black & white line-art style matching the provided sketch
  - Solid black hair with white highlights
  - Stylized stroked beard with gray underlay
  - Thick outlines, simple expressive features
  - Interactivity: Eyes follow mouse, blinking, expressions (smile, surprised)
*/

export default function Avatar3D({ // Keeping name to avoid import errors
  onHoverStart,
  onHoverEnd,
}: {
  src?: string;
  alt?: string;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [expression, setExpression] = useState<'idle' | 'smile' | 'surprised'>('idle');
  const [isBlinking, setIsBlinking] = useState(false);

  // Mouse tracking
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const smoothX = useSpring(mouseX, { stiffness: 150, damping: 25 });
  const smoothY = useSpring(mouseY, { stiffness: 150, damping: 25 });
  
  // Pupil/Eye tracking (moving the entire black eye shape slightly)
  const eyeX = useTransform(smoothX, [0, 1], [-2.5, 2.5]);
  const eyeY = useTransform(smoothY, [0, 1], [-2.5, 2.5]);
  
  // Head pan
  const headPanX = useTransform(smoothX, [0, 1], [-4, 4]);
  const headPanY = useTransform(smoothY, [0, 1], [-2, 2]);

  // Eyebrow tracking
  const browOffset = useTransform(smoothY, [0, 1], [1, -2]);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      mouseX.set(Math.max(0, Math.min(1, (e.clientX - cx) / 400 + 0.5)));
      mouseY.set(Math.max(0, Math.min(1, (e.clientY - cy) / 400 + 0.5)));
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const blink = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    };
    const interval = setInterval(blink, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  const handleHoverStart = useCallback(() => { setExpression('smile'); onHoverStart?.(); }, [onHoverStart]);
  const handleHoverEnd = useCallback(() => { setExpression('idle'); onHoverEnd?.(); }, [onHoverEnd]);

  const outline = '#000000';
  const strokeW = 2.5;

  return (
    <motion.div
      ref={containerRef}
      className="relative w-36 h-36 mb-6 cursor-pointer select-none"
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
      onClick={() => { setExpression('surprised'); setTimeout(() => setExpression('smile'), 800); }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
    >
      <motion.svg
        viewBox="0 0 200 200"
        className="w-full h-full drop-shadow-sm"
        style={{ x: headPanX, y: headPanY }}
      >
        <defs>
          {/* Custom pattern for the beard strokes */}
          <pattern id="beardLines" width="6" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(15)">
            <line x1="2" y1="0" x2="2" y2="10" stroke={outline} strokeWidth="1.5" strokeLinecap="round" />
          </pattern>
        </defs>

        {/* === NECK === */}
        <path
          d="M80 135 L80 170 Q100 185 120 170 L120 135"
          fill="#FFFFFF"
          stroke={outline}
          strokeWidth={strokeW}
        />

        {/* === EAR === */}
        <path
          d="M50 85 Q40 95 45 110 Q50 120 55 115"
          fill="#FFFFFF"
          stroke={outline}
          strokeWidth={strokeW}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Inner ear lines */}
        <path d="M48 95 Q52 100 48 105" fill="none" stroke={outline} strokeWidth="1.5" strokeLinecap="round" />

        {/* === FACE OUTLINE === */}
        <path
          d="M55 85 
             Q55 35 150 40 
             Q150 75 145 105 
             Q140 145 105 155 
             Q70 145 58 115 
             Z"
          fill="#FFFFFF"
          stroke={outline}
          strokeWidth={strokeW}
          strokeLinejoin="round"
        />

        {/* === BEARD BACKGROUND (Light Gray Underlay) === */}
        <path
          d="M58 115 
             Q70 145 105 155 
             Q140 145 145 105 
             Q142 125 125 135 
             Q105 144 75 135 
             Q62 125 58 115 Z"
          fill="#E5E7EB"
        />

        {/* === BEARD STROKES (Using pattern) === */}
        <path
          d="M58 115 
             Q70 145 105 155 
             Q140 145 145 105 
             Q142 125 125 135 
             Q105 144 75 135 
             Q62 125 58 115 Z"
          fill="url(#beardLines)"
        />
        
        {/* Mustache Underlay */}
        <path d="M85 120 Q100 115 115 120 Q112 126 100 128 Q88 126 85 120 Z" fill="#E5E7EB" />
        <path d="M85 120 Q100 115 115 120 Q112 126 100 128 Q88 126 85 120 Z" fill="url(#beardLines)" />

        {/* Soul Patch */}
        <path d="M96 135 Q100 142 104 135 Z" fill="#E5E7EB" />
        <path d="M96 135 Q100 142 104 135 Z" fill="url(#beardLines)" />
        <path d="M95 140 Q100 145 105 140" fill="none" stroke={outline} strokeWidth="2" strokeLinecap="round" />

        {/* === HAIR (Solid Black with sweeping shapes) === */}
        <path
          d="M55 85 
             Q40 40 90 25 
             Q140 20 160 55 
             Q165 80 150 100
             Q152 70 140 50
             Q110 30 75 55
             Q60 65 55 85 Z"
          fill={outline}
        />
        {/* Main front swoosh */}
        <path
          d="M55 85 Q75 60 110 50 Q130 50 142 60 Q120 40 90 40 Q65 50 55 85 Z"
          fill={outline}
        />
        {/* Top/Back volume */}
        <path
          d="M75 30 Q110 15 145 35 Q165 55 160 85 Q165 50 135 25 Q100 10 75 30 Z"
          fill={outline}
        />

        {/* White Hair Highlights (like in the sketch) */}
        <path d="M85 32 Q105 25 125 32" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M68 45 Q75 40 85 45" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />

        {/* === NOSE === */}
        <path
          d="M102 85 Q95 100 95 110 Q100 115 108 110"
          fill="none"
          stroke={outline}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* === EYES === */}
        <g>
          {/* Left Eye */}
          <motion.g style={{ x: eyeX, y: eyeY }}>
            <ellipse cx="78" cy="92" rx="6" ry={isBlinking ? 0.5 : 4} fill={outline} />
            {/* Catchlight */}
            {!isBlinking && <circle cx="79.5" cy="90.5" r="1.5" fill="#FFFFFF" />}
          </motion.g>
          {/* Left eye bag/crease */}
          {!isBlinking && <path d="M72 98 Q78 100 84 98" fill="none" stroke={outline} strokeWidth="1" strokeLinecap="round" opacity="0.6" />}

          {/* Right Eye */}
          <motion.g style={{ x: eyeX, y: eyeY }}>
            <ellipse cx="122" cy="92" rx="6" ry={isBlinking ? 0.5 : 4} fill={outline} />
            {/* Catchlight */}
            {!isBlinking && <circle cx="123.5" cy="90.5" r="1.5" fill="#FFFFFF" />}
          </motion.g>
          {/* Right eye bag/crease */}
          {!isBlinking && <path d="M116 98 Q122 100 128 98" fill="none" stroke={outline} strokeWidth="1" strokeLinecap="round" opacity="0.6" />}
        </g>

        {/* === EYEBROWS (Thick black Notion style) === */}
        <motion.g style={{ y: browOffset }}>
          {/* Left Brow */}
          <motion.path
            d={expression === 'surprised'
              ? 'M68 76 Q78 66 88 74'
              : 'M68 82 Q78 72 88 78'}
            fill="none" stroke={outline} strokeWidth="5" strokeLinecap="round"
          />
          {/* Right Brow */}
          <motion.path
            d={expression === 'surprised'
              ? 'M112 74 Q122 66 132 76'
              : 'M112 78 Q122 72 132 82'}
            fill="none" stroke={outline} strokeWidth="5" strokeLinecap="round"
          />
        </motion.g>

        {/* === MOUTH === */}
        <motion.g animate={expression === 'surprised' ? { y: 2 } : { y: 0 }}>
          {expression === 'idle' && (
            <path
              d="M90 128 Q100 132 110 128"
              fill="none" stroke={outline} strokeWidth="2.5" strokeLinecap="round"
            />
          )}
          {expression === 'smile' && (
            <path
              d="M86 126 Q100 138 114 126"
              fill="none" stroke={outline} strokeWidth="2.5" strokeLinecap="round"
            />
          )}
          {expression === 'surprised' && (
            <ellipse cx="100" cy="130" rx="4" ry="6" fill="#FFFFFF" stroke={outline} strokeWidth="2.5" />
          )}
        </motion.g>

      </motion.svg>
    </motion.div>
  );
}
