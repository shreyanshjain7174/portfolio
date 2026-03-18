'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';

/* ─── TYPES ─── */

type TimeOfDay = 'night' | 'dawn' | 'morning' | 'day' | 'evening' | 'dusk';
type WeatherCondition = 'clear' | 'cloudy' | 'rainy' | 'snowy' | 'stormy' | 'foggy';

interface AmbientState {
  time: TimeOfDay;
  weather: WeatherCondition;
  temperature: number | null;
  city: string | null;
  loading: boolean;
}

/* ─── TIME HELPERS ─── */

function getTimeOfDay(hour: number): TimeOfDay {
  if (hour >= 5 && hour < 7) return 'dawn';
  if (hour >= 7 && hour < 10) return 'morning';
  if (hour >= 10 && hour < 17) return 'day';
  if (hour >= 17 && hour < 19) return 'evening';
  if (hour >= 19 && hour < 21) return 'dusk';
  return 'night';
}

function getTimeGradient(time: TimeOfDay, isDark: boolean): string {
  if (isDark) {
    const gradients: Record<TimeOfDay, string> = {
      night: 'radial-gradient(ellipse at 20% 80%, rgba(15, 23, 42, 0.6) 0%, transparent 70%), radial-gradient(ellipse at 80% 20%, rgba(30, 27, 75, 0.4) 0%, transparent 60%)',
      dawn: 'radial-gradient(ellipse at 30% 90%, rgba(127, 29, 29, 0.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 10%, rgba(88, 28, 135, 0.2) 0%, transparent 60%)',
      morning: 'radial-gradient(ellipse at 80% 20%, rgba(234, 179, 8, 0.08) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(59, 130, 246, 0.06) 0%, transparent 50%)',
      day: 'radial-gradient(ellipse at 50% 0%, rgba(56, 189, 248, 0.06) 0%, transparent 50%)',
      evening: 'radial-gradient(ellipse at 80% 80%, rgba(234, 88, 12, 0.1) 0%, transparent 50%), radial-gradient(ellipse at 20% 20%, rgba(124, 58, 237, 0.1) 0%, transparent 50%)',
      dusk: 'radial-gradient(ellipse at 50% 100%, rgba(139, 92, 246, 0.12) 0%, transparent 60%), radial-gradient(ellipse at 50% 0%, rgba(30, 41, 59, 0.5) 0%, transparent 50%)',
    };
    return gradients[time];
  }
  const gradients: Record<TimeOfDay, string> = {
    night: 'radial-gradient(ellipse at 20% 80%, rgba(30, 41, 59, 0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(88, 28, 135, 0.06) 0%, transparent 50%)',
    dawn: 'radial-gradient(ellipse at 30% 90%, rgba(251, 146, 60, 0.1) 0%, transparent 50%), radial-gradient(ellipse at 70% 10%, rgba(244, 114, 182, 0.08) 0%, transparent 50%)',
    morning: 'radial-gradient(ellipse at 80% 10%, rgba(250, 204, 21, 0.1) 0%, transparent 50%), radial-gradient(ellipse at 20% 90%, rgba(186, 230, 253, 0.15) 0%, transparent 50%)',
    day: 'radial-gradient(ellipse at 50% 0%, rgba(186, 230, 253, 0.15) 0%, transparent 50%)',
    evening: 'radial-gradient(ellipse at 80% 80%, rgba(251, 146, 60, 0.12) 0%, transparent 50%), radial-gradient(ellipse at 20% 20%, rgba(196, 181, 253, 0.1) 0%, transparent 50%)',
    dusk: 'radial-gradient(ellipse at 50% 100%, rgba(167, 139, 250, 0.1) 0%, transparent 50%), radial-gradient(ellipse at 50% 0%, rgba(100, 116, 139, 0.08) 0%, transparent 40%)',
  };
  return gradients[time];
}

/* ─── WEATHER MAPPER ─── */

function mapWeatherCode(code: number): WeatherCondition {
  if ([0, 1].includes(code)) return 'clear';
  if ([2, 3].includes(code)) return 'cloudy';
  if ([45, 48].includes(code)) return 'foggy';
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'rainy';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snowy';
  if ([95, 96, 99].includes(code)) return 'stormy';
  return 'clear';
}

/* ─── 3D PARALLAX WRAPPER ─── */

function Parallax3DScene({ children }: { children: React.ReactNode }) {
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(mouseY, [0, 1], [2, -2]), {
    stiffness: 50,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-2, 2]), {
    stiffness: 50,
    damping: 30,
  });

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        perspective: 1200,
        perspectiveOrigin: '50% 50%',
      }}
    >
      <motion.div
        className="relative w-full h-full"
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/* ─── 3D STAR FIELD (3 depth layers) ─── */

function StarField3D() {
  const layers = useMemo(() => {
    return [
      { count: 15, z: -200, size: [1, 1.5], opacity: 0.3, twinkleSpeed: [3, 5] },
      { count: 15, z: -100, size: [1.5, 2.5], opacity: 0.5, twinkleSpeed: [2, 4] },
      { count: 12, z: -30, size: [2, 3], opacity: 0.8, twinkleSpeed: [1.5, 3] },
    ].map((layer) => ({
      ...layer,
      stars: Array.from({ length: layer.count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: layer.size[0] + Math.random() * (layer.size[1] - layer.size[0]),
        delay: Math.random() * 3,
        duration: layer.twinkleSpeed[0] + Math.random() * (layer.twinkleSpeed[1] - layer.twinkleSpeed[0]),
      })),
    }));
  }, []);

  return (
    <>
      {layers.map((layer, li) => (
        <div
          key={li}
          className="absolute inset-0 overflow-hidden"
          style={{ transform: `translateZ(${layer.z}px)` }}
        >
          {layer.stars.map((star) => (
            <motion.div
              key={star.id}
              className="absolute rounded-full bg-white"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: star.size,
                height: star.size,
              }}
              animate={{
                opacity: [layer.opacity * 0.3, layer.opacity, layer.opacity * 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: star.duration,
                delay: star.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      ))}
      {/* Shooting star occasionally */}
      <motion.div
        className="absolute w-[2px] h-[2px] bg-white rounded-full"
        style={{
          top: '15%',
          left: '-5%',
          boxShadow: '0 0 6px 2px rgba(255,255,255,0.3)',
          transform: 'translateZ(-60px)',
        }}
        animate={{
          left: ['0%', '120%'],
          top: ['15%', '45%'],
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          duration: 1.5,
          delay: 8,
          repeat: Infinity,
          repeatDelay: 15,
          ease: 'easeIn',
        }}
      />
    </>
  );
}

/* ─── 3D RAIN (multi-depth layers) ─── */

function Rain3D() {
  const layers = useMemo(() => {
    return [
      { count: 12, z: -150, speed: [0.4, 0.6], opacity: 0.1, width: 1 },
      { count: 15, z: -80, speed: [0.5, 0.7], opacity: 0.2, width: 1 },
      { count: 10, z: -20, speed: [0.6, 0.9], opacity: 0.3, width: 1.5 },
    ].map((layer) => ({
      ...layer,
      drops: Array.from({ length: layer.count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 2,
        duration: layer.speed[0] + Math.random() * (layer.speed[1] - layer.speed[0]),
        height: 15 + Math.random() * 15,
      })),
    }));
  }, []);

  return (
    <>
      {layers.map((layer, li) => (
        <div
          key={li}
          className="absolute inset-0 overflow-hidden"
          style={{ transform: `translateZ(${layer.z}px)` }}
        >
          {layer.drops.map((drop) => (
            <motion.div
              key={drop.id}
              className="absolute bg-blue-300/40 dark:bg-blue-400/30 rounded-full"
              style={{
                left: `${drop.x}%`,
                width: layer.width,
                height: drop.height,
              }}
              animate={{ top: ['-5%', '105%'] }}
              transition={{
                duration: drop.duration,
                delay: drop.delay,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ))}
        </div>
      ))}
      {/* Ground ripples */}
      <div className="absolute bottom-0 left-0 right-0 h-8" style={{ transform: 'translateZ(-10px)' }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute bottom-2 rounded-full border border-blue-300/10 dark:border-blue-400/10"
            style={{
              left: `${15 + i * 17}%`,
              width: 12,
              height: 4,
            }}
            animate={{
              scale: [0, 2.5, 3],
              opacity: [0.4, 0.15, 0],
            }}
            transition={{
              duration: 1.5,
              delay: i * 0.6,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>
    </>
  );
}

/* ─── 3D SNOW (volumetric layers) ─── */

function Snow3D() {
  const layers = useMemo(() => {
    return [
      { count: 10, z: -180, size: [2, 4], speed: [8, 12], drift: 20 },
      { count: 10, z: -80, size: [3, 5], speed: [6, 10], drift: 30 },
      { count: 8, z: -10, size: [4, 7], speed: [5, 8], drift: 40 },
    ].map((layer) => ({
      ...layer,
      flakes: Array.from({ length: layer.count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: layer.size[0] + Math.random() * (layer.size[1] - layer.size[0]),
        delay: Math.random() * 5,
        duration: layer.speed[0] + Math.random() * (layer.speed[1] - layer.speed[0]),
        drift: (Math.random() - 0.5) * layer.drift * 2,
        rotation: Math.random() * 360,
      })),
    }));
  }, []);

  return (
    <>
      {layers.map((layer, li) => (
        <div
          key={li}
          className="absolute inset-0 overflow-hidden"
          style={{ transform: `translateZ(${layer.z}px)` }}
        >
          {layer.flakes.map((flake) => (
            <motion.div
              key={flake.id}
              className="absolute rounded-full bg-white/50 dark:bg-white/30"
              style={{
                left: `${flake.x}%`,
                width: flake.size,
                height: flake.size,
                filter: li === 2 ? 'blur(0px)' : `blur(${1 - li * 0.3}px)`,
              }}
              animate={{
                top: ['-3%', '103%'],
                x: [0, flake.drift, -flake.drift * 0.5, flake.drift * 0.3, 0],
                rotate: [0, flake.rotation],
                opacity: [0, 0.7, 0.7, 0],
              }}
              transition={{
                duration: flake.duration,
                delay: flake.delay,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ))}
        </div>
      ))}
    </>
  );
}

/* ─── 3D VOLUMETRIC CLOUDS ─── */

function Clouds3D() {
  const clouds = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => ({
        id: i,
        z: -200 + i * 50,
        y: 5 + Math.random() * 40,
        width: 25 + Math.random() * 20,
        height: 10 + Math.random() * 15,
        speed: 70 + i * 15,
        delay: i * 6,
        blur: 40 + (4 - i) * 10,
        opacity: 0.02 + i * 0.008,
      })),
    []
  );

  return (
    <>
      {clouds.map((cloud) => (
        <motion.div
          key={cloud.id}
          className="absolute rounded-full bg-neutral-400 dark:bg-white"
          style={{
            top: `${cloud.y}%`,
            width: `${cloud.width}%`,
            height: `${cloud.height}%`,
            filter: `blur(${cloud.blur}px)`,
            opacity: cloud.opacity,
            transform: `translateZ(${cloud.z}px)`,
          }}
          animate={{ left: ['-30%', '120%'] }}
          transition={{
            duration: cloud.speed,
            delay: cloud.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </>
  );
}

/* ─── AMBIENT STATUS BADGE ─── */

function AmbientBadge({ state }: { state: AmbientState }) {
  if (state.loading) return null;

  const weatherEmoji: Record<WeatherCondition, string> = {
    clear: '☀️', cloudy: '☁️', rainy: '🌧️', snowy: '❄️', stormy: '⛈️', foggy: '🌫️',
  };
  const timeEmoji: Record<TimeOfDay, string> = {
    night: '🌙', dawn: '🌅', morning: '🌤️', day: '☀️', evening: '🌇', dusk: '🌆',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5 }}
      className="flex items-center gap-2 text-[11px] text-neutral-400 dark:text-neutral-500 mt-4"
    >
      <span>{timeEmoji[state.time]}</span>
      {state.weather !== 'clear' && <span>{weatherEmoji[state.weather]}</span>}
      {state.temperature !== null && (
        <span className="font-mono">{Math.round(state.temperature)}°C</span>
      )}
      {state.city && (
        <>
          <span className="text-neutral-300 dark:text-neutral-600">·</span>
          <span>{state.city}</span>
        </>
      )}
    </motion.div>
  );
}

/* ─── HOOK ─── */

export function useAmbientState() {
  const [state, setState] = useState<AmbientState>({
    time: getTimeOfDay(new Date().getHours()),
    weather: 'clear',
    temperature: null,
    city: null,
    loading: true,
  });

  useEffect(() => {
    const updateTime = () => {
      setState((prev) => ({ ...prev, time: getTimeOfDay(new Date().getHours()) }));
    };
    const interval = setInterval(updateTime, 60_000);

    const fetchWeather = async (lat: number, lon: number) => {
      try {
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`
        );
        const weatherData = await weatherRes.json();

        const geoRes = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
        );
        const geoData = await geoRes.json();

        setState((prev) => ({
          ...prev,
          weather: mapWeatherCode(weatherData.current?.weather_code ?? 0),
          temperature: weatherData.current?.temperature_2m ?? null,
          city: geoData.city || geoData.locality || null,
          loading: false,
        }));
      } catch {
        setState((prev) => ({ ...prev, loading: false }));
      }
    };

    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
        () => fetchWeather(12.9716, 77.5946),
        { timeout: 5000 }
      );
    } else {
      fetchWeather(12.9716, 77.5946);
    }

    return () => clearInterval(interval);
  }, []);

  return state;
}

/* ─── MAIN COMPONENT ─── */

export default function AmbientBackground({ isDark }: { isDark: boolean }) {
  const state = useAmbientState();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const showStars = state.time === 'night' || state.time === 'dusk';
  const showRain = state.weather === 'rainy' || state.weather === 'stormy';
  const showSnow = state.weather === 'snowy';
  const showClouds = state.weather === 'cloudy' || state.weather === 'foggy';

  if (!mounted) return null;

  return (
    <>
      {/* Time-based ambient gradient */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-0 transition-all duration-[3000ms]"
        style={{ background: getTimeGradient(state.time, isDark) }}
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ duration: 2 }}
      />

      {/* 3D Parallax Weather Scene */}
      <AnimatePresence>
        {(showStars || showRain || showSnow || showClouds) && (
          <motion.div
            key="scene"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
          >
            <Parallax3DScene>
              {showStars && <StarField3D />}
              {showRain && <Rain3D />}
              {showSnow && <Snow3D />}
              {showClouds && <Clouds3D />}
            </Parallax3DScene>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export { AmbientBadge };
