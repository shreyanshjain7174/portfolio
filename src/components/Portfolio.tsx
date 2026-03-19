'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, useInView, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, Instagram, ArrowUpRight, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import AmbientBackground, { AmbientBadge, useAmbientState } from './AmbientBackground';
import Avatar3D from './Avatar3D';

/* ─────────────────────── DATA ─────────────────────── */

const NAV = ['About', 'Experience', 'Projects', 'Skills', 'Open Source'] as const;

const EXPERIENCE = [
  {
    range: 'Mar 2026 — Present',
    title: 'SDE-2',
    company: 'Microsoft',
    url: 'https://microsoft.com',
    description: 'Architecting and scaling distributed cloud infrastructure powering enterprise-grade Azure services. Working on high-throughput systems serving millions of requests.',
    tags: ['Go', 'Distributed Systems', 'Kubernetes', 'Azure'],
  },
  {
    range: 'Feb 2025 — Feb 2026',
    title: 'Software Engineer',
    company: 'Arista Networks',
    url: 'https://www.arista.com',
    description: 'Developed high-performance networking software for cloud-scale data centers. Built systems for network telemetry, monitoring, and automation at massive scale.',
    tags: ['Go', 'Networking', 'EOS', 'Data Center'],
  },
  {
    range: 'Jan 2023 — Feb 2025',
    title: 'Software Engineer',
    company: 'IBM',
    url: 'https://www.ibm.com',
    description: 'Worked on cloud-native infrastructure and container orchestration platforms. Built tooling for enterprise Kubernetes deployments and hybrid cloud solutions.',
    tags: ['Go', 'Python', 'Kubernetes', 'Cloud'],
  },
  {
    range: 'Jan 2022 — Dec 2022',
    title: 'Software Engineer',
    company: 'Red Hat',
    url: 'https://www.redhat.com',
    description: 'Core contributor to the Ceph distributed storage engine. Optimized the RADOS Gateway for billion-object scale workloads in C++.',
    tags: ['C++', 'Ceph', 'Object Storage', 'Open Source'],
  },
];

const SKILLS = [
  { category: 'Languages', items: ['Go', 'C++', 'Python', 'Rust', 'TypeScript'] },
  { category: 'Infrastructure', items: ['Kubernetes', 'Docker', 'Ansible', 'Terraform', 'AWS', 'Azure'] },
  { category: 'Systems', items: ['Distributed Systems', 'gRPC', 'Message Queues', 'Storage Engines', 'Networking'] },
  { category: 'AI/ML', items: ['LLM Orchestration', 'AI Agents', 'MCP Protocol', 'RAG', 'Vector Databases'] },
];

const OPEN_SOURCE = [
  {
    project: 'Ceph',
    role: 'Core Contributor',
    description: 'Contributed to the RADOS Gateway and core storage engine. Optimized object listing and metadata operations for billion-scale deployments.',
    url: 'https://github.com/ceph/ceph',
    stars: '14k+',
  },
  {
    project: 'agentic-core-operator',
    role: 'Creator & Maintainer',
    description: 'Built an open source Kubernetes operator that serves as an intelligence core for managing distributed AI workloads across clusters.',
    url: 'https://github.com/shreyanshjain7174/agentic-core-operator',
  },
  {
    project: 'ansible-mcp',
    role: 'Creator & Maintainer',
    description: 'Model Context Protocol server for Ansible, enabling AI systems to interact with infrastructure automation tooling.',
    url: 'https://github.com/shreyanshjain7174/ansible-mcp',
  },
];

const PROJECTS = [
  {
    title: 'agentic-core-operator',
    description: 'Open source Kubernetes operator acting as the intelligence core for distributed AI workloads.',
    url: 'https://github.com/shreyanshjain7174/agentic-core-operator',
    tags: ['Go', 'Kubernetes', 'AI/ML', 'Operators'],
    image: '/images/agentic.png',
  },
  {
    title: 'ai-agent-orchestrator',
    description: 'Orchestrating diverse AI agents in high-throughput distributed environments.',
    url: 'https://github.com/shreyanshjain7174/ai-agent-orchestrator',
    tags: ['Python', 'LLM', 'Distributed', 'Orchestration'],
    image: '/images/orchestrator.png',
  },
  {
    title: 'ansible-mcp',
    description: 'Ansible Model Context Protocol server, bridging AI with robust infrastructure automation.',
    url: 'https://github.com/shreyanshjain7174/ansible-mcp',
    tags: ['Ansible', 'MCP', 'Automation', 'Infrastructure'],
    image: '/images/ansible.png',
  },
  {
    title: 'Ceph Storage Platform',
    description: 'Core engine optimizing billion-object scale storage. Open source contribution in C++.',
    url: 'https://github.com/ceph/ceph',
    tags: ['C++', 'RADOS', 'S3', 'Open Source'],
    image: '/images/ceph.png',
  },
];

const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/shreyanshjain7174', icon: Github },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/shreyansh-sancheti', icon: Linkedin },
  { label: 'Instagram', href: 'https://instagram.com/shrey_sancheti', icon: Instagram },
  { label: 'Twitter', href: 'https://twitter.com/shrey_sancheti', icon: Twitter },
  { label: 'Email', href: 'mailto:007ssancheti@gmail.com', icon: Mail },
];

/* ──────────── MAGNETIC HOVER SOCIAL ICON ──────────── */

function MagneticIcon({ children, href, label }: { children: React.ReactNode; href: string; label: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 250, damping: 15 });
  const springY = useSpring(y, { stiffness: 250, damping: 15 });

  const handleMouse = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.35);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.35);
  }, [x, y]);

  const reset = useCallback(() => { x.set(0); y.set(0); }, [x, y]);

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{ x: springX, y: springY }}
      className="relative p-3 rounded-xl text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/50 dark:hover:bg-white/5 transition-colors"
      whileTap={{ scale: 0.9 }}
    >
      {children}
    </motion.a>
  );
}

/* ──────────── SCROLL REVEAL WRAPPER ──────────── */

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.4, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ──────────── CHARACTER-BY-CHARACTER TEXT REVEAL ──────────── */

function TextReveal({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const words = text.split(' ');

  return (
    <span ref={ref} className={className}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block mr-[0.3em]">
          {word.split('').map((char, ci) => (
            <motion.span
              key={`${wi}-${ci}`}
              className="inline-block"
              initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
              animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
              transition={{ duration: 0.4, delay: delay + (wi * word.length + ci) * 0.015, ease: 'easeOut' }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </span>
  );
}

/* ──────────── INTERACTIVE CARD WITH TILT ──────────── */

function TiltCard({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const rotateX = useTransform(y, [0, 1], [6, -6]);
  const rotateY = useTransform(x, [0, 1], [-6, 6]);

  const handleMouse = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  };

  const reset = () => { x.set(0.5); y.set(0.5); };

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noreferrer"
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className={className}
    >
      {children}
    </motion.a>
  );
}

/* ──────────────────── MAIN COMPONENT ──────────────────── */

export default function Portfolio() {
  const { theme, setTheme } = useTheme();
  const [activeSection, setActiveSection] = useState<string>('About');
  const [cursorVariant, setCursorVariant] = useState<'default' | 'hover'>('default');
  const ambient = useAmbientState();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Custom cursor
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springCursorX = useSpring(cursorX, { damping: 25, stiffness: 400 });
  const springCursorY = useSpring(cursorY, { damping: 25, stiffness: 400 });

  // Trail particles (delayed springs for trailing effect)
  const trail1X = useSpring(cursorX, { damping: 35, stiffness: 200 });
  const trail1Y = useSpring(cursorY, { damping: 35, stiffness: 200 });
  const trail2X = useSpring(cursorX, { damping: 45, stiffness: 120 });
  const trail2Y = useSpring(cursorY, { damping: 45, stiffness: 120 });
  const trail3X = useSpring(cursorX, { damping: 55, stiffness: 80 });
  const trail3Y = useSpring(cursorY, { damping: 55, stiffness: 80 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [cursorX, cursorY]);

  // Spotlight
  useEffect(() => {
    const move = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mx', `${e.clientX}px`);
      document.documentElement.style.setProperty('--my', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  // Scroll spy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -40% 0px' }
    );
    const sections = document.querySelectorAll('section[id]');
    sections.forEach((s) => observer.observe(s));
    return () => sections.forEach((s) => observer.unobserve(s));
  }, []);

  const { scrollY } = useScroll();

  return (
    <div className="relative min-h-screen text-neutral-900 dark:text-neutral-100 transition-colors duration-300 selection:bg-purple-300/30 cursor-none lg:cursor-none">

      {/* Ambient Weather + Time Background */}
      {mounted && <AmbientBackground isDark={theme === 'dark'} />}

      {/* ─── CUSTOM CURSOR: Glowing dot + particle trail ─── */}
      <div className="hidden lg:block">
        {/* Trail particle 3 (furthest, faintest) */}
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[997] rounded-full"
          style={{
            x: trail3X,
            y: trail3Y,
            width: 6,
            height: 6,
            marginLeft: -3,
            marginTop: -3,
            background: 'rgba(139, 92, 246, 0.15)',
          }}
        />
        {/* Trail particle 2 */}
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[997] rounded-full"
          style={{
            x: trail2X,
            y: trail2Y,
            width: 5,
            height: 5,
            marginLeft: -2.5,
            marginTop: -2.5,
            background: 'rgba(139, 92, 246, 0.25)',
          }}
        />
        {/* Trail particle 1 (closest) */}
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[998] rounded-full"
          style={{
            x: trail1X,
            y: trail1Y,
            width: 4,
            height: 4,
            marginLeft: -2,
            marginTop: -2,
            background: 'rgba(139, 92, 246, 0.4)',
          }}
        />
        {/* Outer ring — expands on hover */}
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[999] rounded-full border border-purple-400/40 dark:border-purple-400/30"
          style={{ x: springCursorX, y: springCursorY }}
          animate={{
            width: cursorVariant === 'hover' ? 48 : 28,
            height: cursorVariant === 'hover' ? 48 : 28,
            marginLeft: cursorVariant === 'hover' ? -24 : -14,
            marginTop: cursorVariant === 'hover' ? -24 : -14,
            borderColor: cursorVariant === 'hover'
              ? 'rgba(167, 139, 250, 0.5)'
              : 'rgba(139, 92, 246, 0.25)',
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        />
        {/* Core dot — always visible, glowing */}
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[1000] rounded-full"
          style={{
            x: springCursorX,
            y: springCursorY,
            width: 6,
            height: 6,
            marginLeft: -3,
            marginTop: -3,
            background: 'rgb(139, 92, 246)',
            boxShadow: '0 0 12px 3px rgba(139, 92, 246, 0.5), 0 0 30px 8px rgba(139, 92, 246, 0.15)',
          }}
          animate={{
            scale: cursorVariant === 'hover' ? 1.8 : 1,
            boxShadow: cursorVariant === 'hover'
              ? '0 0 20px 6px rgba(139, 92, 246, 0.6), 0 0 50px 15px rgba(139, 92, 246, 0.2)'
              : '0 0 12px 3px rgba(139, 92, 246, 0.5), 0 0 30px 8px rgba(139, 92, 246, 0.15)',
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </div>

      {/* Spotlight Gradient */}
      <div
        className="pointer-events-none fixed inset-0 z-30 hidden lg:block transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px at var(--mx, 50%) var(--my, 50%), rgba(139, 92, 246, 0.07), transparent 80%)`,
        }}
      />

      {/* Grain */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.015] z-40" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.7\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }} />

      <div className="mx-auto min-h-screen max-w-screen-xl px-6 py-12 md:px-12 md:py-20 lg:px-24 lg:py-0">
        <div className="lg:flex lg:justify-between lg:gap-4">

          {/* ─── LEFT SIDEBAR (sticky) ─── */}
          <header className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-[45%] lg:flex-col lg:justify-between lg:py-24">
            <div>
              {/* 3D Avatar */}
              <Avatar3D
                src="/images/avatar.png"
                alt="Shreyansh Sancheti"
                onHoverStart={() => setCursorVariant('hover')}
                onHoverEnd={() => setCursorVariant('default')}
              />

              {/* Name with character reveal */}
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                <TextReveal text="Shreyansh Sancheti" />
              </h1>
              <motion.h2
                className="mt-3 text-lg font-medium text-purple-600 dark:text-purple-400"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                SDE-2 @ Microsoft
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="mt-6 max-w-sm text-neutral-600 dark:text-neutral-400 leading-relaxed"
              >
                I architect and build <span className="text-neutral-900 dark:text-white font-medium">distributed systems</span> and <span className="text-neutral-900 dark:text-white font-medium">AI infrastructure</span> that scale globally. Based in Bangalore, India.
              </motion.p>

              {/* Live ambient weather badge */}
              <AmbientBadge state={ambient} />

              {/* Navigation with animated indicators */}
              <nav className="mt-14 hidden lg:block" aria-label="In-page jump links">
                <ul className="flex flex-col gap-4">
                  {NAV.map((item, i) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                    >
                      <a
                        href={`#${item}`}
                        className={`group flex items-center gap-4 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 ${
                          activeSection === item
                            ? 'text-neutral-900 dark:text-white'
                            : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                        }`}
                        onMouseEnter={() => setCursorVariant('hover')}
                        onMouseLeave={() => setCursorVariant('default')}
                      >
                        <motion.span
                          className="block h-px bg-current"
                          animate={{ width: activeSection === item ? 64 : 32 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        />
                        {item}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Social Links (magnetic) + Theme Toggle */}
            <motion.div
              className="mt-8 lg:mt-0 flex items-center gap-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              {SOCIALS.map((s) => {
                const Icon = s.icon;
                return (
                  <MagneticIcon key={s.label} href={s.href} label={s.label}>
                    <Icon size={18} strokeWidth={1.5} />
                  </MagneticIcon>
                );
              })}
              <motion.button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="ml-2 p-3 rounded-xl text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/50 dark:hover:bg-white/5 transition-colors"
                whileTap={{ scale: 0.85, rotate: 180 }}
                aria-label="Toggle theme"
              >
                <AnimatePresence mode="wait">
                  {mounted && (theme === 'dark' ? (
                    <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <Sun size={18} />
                    </motion.div>
                  ) : (
                    <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <Moon size={18} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          </header>

          {/* ─── RIGHT CONTENT (scrolls) ─── */}
          <main className="pt-16 lg:w-1/2 lg:py-24">

            {/* ABOUT */}
            <section id="About" className="mb-28 scroll-mt-24">
              <Reveal>
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500 mb-8 lg:hidden">About</h3>
              </Reveal>
              <div className="space-y-5 text-neutral-600 dark:text-neutral-400 leading-[1.8]">
                <Reveal>
                  <p>
                    I'm a systems engineer obsessed with the intersection of <span className="text-neutral-900 dark:text-white font-medium">distributed computing</span> and <span className="text-neutral-900 dark:text-white font-medium">artificial intelligence</span>. With 4+ years of experience across Red Hat, IBM, Arista Networks, and now Microsoft, my work focuses on building infrastructure that enables AI workloads to run reliably at massive scale.
                  </p>
                </Reveal>
                <Reveal delay={0.1}>
                  <p>
                    Currently at <span className="text-neutral-900 dark:text-white font-medium">Microsoft</span>, I architect cloud-native distributed systems on Azure. My journey started as a core contributor to <a href="https://github.com/ceph/ceph" target="_blank" rel="noreferrer" className="text-purple-600 dark:text-purple-400 hover:underline underline-offset-4 decoration-purple-400/30" onMouseEnter={() => setCursorVariant('hover')} onMouseLeave={() => setCursorVariant('default')}>Ceph</a> at Red Hat, followed by cloud platform engineering at IBM, and high-performance networking systems at Arista.
                  </p>
                </Reveal>
                <Reveal delay={0.2}>
                  <p>
                    Outside of work, I'm deeply invested in the open-source Kubernetes and AI agent ecosystem — building operators, orchestrators, and protocol servers that bridge the gap between intelligent systems and production infrastructure.
                  </p>
                </Reveal>
              </div>
            </section>

            {/* EXPERIENCE */}
            <section id="Experience" className="mb-28 scroll-mt-24">
              <Reveal>
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500 mb-10 lg:hidden">Experience</h3>
              </Reveal>
              <div className="space-y-3">
                {EXPERIENCE.map((exp, i) => (
                  <Reveal key={i} delay={i * 0.1}>
                    <TiltCard
                      href={exp.url}
                      className="group block rounded-2xl p-6 -mx-6 transition-all duration-300 hover:bg-neutral-200/40 dark:hover:bg-white/[0.03] hover:shadow-xl hover:shadow-purple-500/5"
                    >
                      <div
                        onMouseEnter={() => setCursorVariant('hover')}
                        onMouseLeave={() => setCursorVariant('default')}
                      >
                        <span className="block text-xs font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-2">
                          {exp.range}
                        </span>
                        <h4 className="text-neutral-900 dark:text-white font-semibold group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors flex items-center gap-2">
                          {exp.title} · {exp.company}
                          <ArrowUpRight size={14} className="opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300" />
                        </h4>
                        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                          {exp.description}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {exp.tags.map((tag) => (
                            <motion.span
                              key={tag}
                              className="text-[11px] font-medium px-3 py-1 rounded-full bg-purple-100/60 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-200/50 dark:border-purple-500/10"
                              whileHover={{ scale: 1.1, y: -2 }}
                              transition={{ type: 'spring', stiffness: 400 }}
                            >
                              {tag}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    </TiltCard>
                  </Reveal>
                ))}
              </div>
            </section>

            {/* PROJECTS */}
            <section id="Projects" className="mb-28 scroll-mt-24">
              <Reveal>
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500 mb-10 lg:hidden">Projects</h3>
              </Reveal>
              <div className="space-y-3">
                {PROJECTS.map((proj, i) => (
                  <Reveal key={i} delay={i * 0.08}>
                    <TiltCard
                      href={proj.url}
                      className="group block rounded-2xl p-6 -mx-6 transition-all duration-300 hover:bg-neutral-200/40 dark:hover:bg-white/[0.03] hover:shadow-xl hover:shadow-purple-500/5"
                    >
                      <div
                        className="flex gap-5"
                        onMouseEnter={() => setCursorVariant('hover')}
                        onMouseLeave={() => setCursorVariant('default')}
                      >
                        <motion.div
                          className="w-32 h-24 rounded-xl overflow-hidden flex-shrink-0 ring-1 ring-neutral-200 dark:ring-white/10"
                          whileHover={{ scale: 1.05 }}
                        >
                          <img
                            src={proj.image}
                            alt={proj.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        </motion.div>
                        <div>
                          <h4 className="text-neutral-900 dark:text-white font-semibold group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors flex items-center gap-2">
                            {proj.title}
                            <ArrowUpRight size={14} className="opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300" />
                          </h4>
                          <p className="mt-1.5 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{proj.description}</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {proj.tags.map((tag) => (
                              <motion.span
                                key={tag}
                                className="text-[11px] font-medium px-3 py-1 rounded-full bg-purple-100/60 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-200/50 dark:border-purple-500/10"
                                whileHover={{ scale: 1.1, y: -2 }}
                                transition={{ type: 'spring', stiffness: 400 }}
                              >
                                {tag}
                              </motion.span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TiltCard>
                  </Reveal>
                ))}
              </div>
            </section>

            {/* SKILLS */}
            <section id="Skills" className="mb-28 scroll-mt-24">
              <Reveal>
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500 mb-10 lg:hidden">Skills</h3>
              </Reveal>
              <div className="space-y-8">
                {SKILLS.map((group, gi) => (
                  <Reveal key={gi} delay={gi * 0.1}>
                    <div>
                      <h4 className="text-xs font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-3">{group.category}</h4>
                      <div className="flex flex-wrap gap-2">
                        {group.items.map((skill) => (
                          <motion.span
                            key={skill}
                            className="text-sm font-medium px-4 py-2 rounded-xl bg-neutral-200/60 dark:bg-white/[0.04] text-neutral-700 dark:text-neutral-300 border border-neutral-300/50 dark:border-white/5 cursor-default"
                            whileHover={{ scale: 1.08, y: -3, backgroundColor: 'rgba(139, 92, 246, 0.1)' }}
                            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                            onMouseEnter={() => setCursorVariant('hover')}
                            onMouseLeave={() => setCursorVariant('default')}
                          >
                            {skill}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </section>

            {/* OPEN SOURCE */}
            <section id="Open Source" className="mb-28 scroll-mt-24">
              <Reveal>
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500 mb-10 lg:hidden">Open Source</h3>
              </Reveal>
              <div className="space-y-3">
                {OPEN_SOURCE.map((oss, i) => (
                  <Reveal key={i} delay={i * 0.1}>
                    <TiltCard
                      href={oss.url}
                      className="group block rounded-2xl p-6 -mx-6 transition-all duration-300 hover:bg-neutral-200/40 dark:hover:bg-white/[0.03] hover:shadow-xl hover:shadow-purple-500/5"
                    >
                      <div
                        onMouseEnter={() => setCursorVariant('hover')}
                        onMouseLeave={() => setCursorVariant('default')}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-neutral-900 dark:text-white font-semibold group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors flex items-center gap-2">
                            {oss.project}
                            <ArrowUpRight size={14} className="opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300" />
                          </h4>
                          {oss.stars && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-yellow-100/60 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border border-yellow-200/50 dark:border-yellow-500/10">
                              ★ {oss.stars}
                            </span>
                          )}
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-purple-100/60 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-200/50 dark:border-purple-500/10">
                            {oss.role}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{oss.description}</p>
                      </div>
                    </TiltCard>
                  </Reveal>
                ))}
              </div>
            </section>

            {/* FOOTER */}
            <Reveal>
              <footer className="text-xs text-neutral-400 dark:text-neutral-500 leading-relaxed pb-16">
                <p>
                  Coded in{' '}
                  <span className="text-neutral-600 dark:text-neutral-300">Next.js</span> and{' '}
                  <span className="text-neutral-600 dark:text-neutral-300">Tailwind CSS</span>,
                  animated with{' '}
                  <span className="text-neutral-600 dark:text-neutral-300">Framer Motion</span>,
                  deployed with{' '}
                  <span className="text-neutral-600 dark:text-neutral-300">Vercel</span>.
                </p>
              </footer>
            </Reveal>

          </main>
        </div>
      </div>
    </div>
  );
}
