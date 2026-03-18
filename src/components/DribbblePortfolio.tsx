'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, ArrowUpRight, Instagram } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { RemotionPlayerWrapper } from './RemotionPlayerWrapper';

gsap.registerPlugin(ScrollTrigger);

export default function DribbblePortfolio() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const horizontalSectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.5]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  // Track mouse for custom cursor
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // GSAP Horizontal Scroll Pin
  useEffect(() => {
    let ctx = gsap.context(() => {
      const projects = gsap.utils.toArray('.project-card');
      
      gsap.to(projects, {
        xPercent: -100 * (projects.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: horizontalSectionRef.current,
          pin: true,
          scrub: 1,
          snap: 1 / (projects.length - 1),
          start: "top top",
          end: "+=3000"
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-[#0f0f0f] text-white min-h-[300vh] cursor-none overflow-x-hidden selection:bg-purple-500/30">
      
      {/* Custom Cursor */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] mix-blend-difference flex items-center justify-center bg-white"
        animate={{
          x: mousePosition.x - (isHovering ? 40 : 10),
          y: mousePosition.y - (isHovering ? 40 : 10),
          width: isHovering ? 80 : 20,
          height: isHovering ? 80 : 20,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
      >
        <AnimatePresence>
          {isHovering && (
             <motion.span 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }} 
               className="text-black text-xs font-bold"
             >
               VIEW
             </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* NOISY OVERLAY FOR CINEMATIC FEEL */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-50 mix-blend-overlay" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />

      {/* HERO SECTION */}
      <section className="h-screen w-full flex flex-col justify-center items-center relative overflow-hidden">
        
        {/* Animated Notion / Memoji Avatar Sketch Background */}
        <motion.div 
          className="absolute inset-0 z-0 flex items-center justify-center opacity-60 pointer-events-none"
          style={{ scale: heroScale }}
        >
          <motion.img 
            src="/images/avatar.png" 
            alt="Sketch Avatar"
            className="w-full max-w-xl md:max-w-3xl object-contain dark:invert mix-blend-screen"
            animate={{ y: [0, -15, 0], rotate: [-1, 1, -1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        <motion.div 
          className="relative z-10 flex flex-col items-center text-center px-4"
          style={{ opacity: heroOpacity }}
        >
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-2.5 rounded-full backdrop-blur-md"
          >
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-sm font-mono tracking-widest text-neutral-300">SDE-2 @ MICROSOFT</span>
          </motion.div>

          {/* Cinematic Animated Single Character */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[50vw] font-black tracking-tighter mix-blend-overlay opacity-30 pointer-events-none"
            animate={{
              rotateY: [0, 15, -15, 0],
              scale: [1, 1.05, 1],
              filter: ["blur(0px)", "blur(12px)", "blur(0px)"]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            S.
          </motion.div>

          {/* Dribbble Style Name - Reduced Size */}
          <motion.h1 
            className="relative z-10 text-5xl md:text-7xl font-bold tracking-tight uppercase mix-blend-difference mt-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            Shreyansh<br/>Sancheti.
          </motion.h1>

          <motion.p 
            className="mt-10 text-xl md:text-2xl text-neutral-400 font-light max-w-2xl tracking-wide mix-blend-difference"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            Architecting elite <span className="text-white italic">distributed systems</span> and <span className="text-white italic">cinematic</span> web experiences.
          </motion.p>
        </motion.div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 mix-blend-difference">
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase">Scroll to explore</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
        </div>
      </section>

      {/* REMOTION INTERLUDE (FULL SCREEN CINEMATIC) */}
      <section className="w-full bg-black py-32 border-t border-b border-white/10 relative overflow-hidden">
        <h2 className="absolute top-10 left-10 text-[8vw] font-bold text-white/5 uppercase tracking-tighter whitespace-nowrap z-0 pointer-events-none">
          Innovate. Build. Scale.
        </h2>
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center">
          <div className="w-full max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(139,92,246,0.15)] ring-1 ring-white/10">
            <RemotionPlayerWrapper />
          </div>
        </div>
      </section>

      {/* HORIZONTAL SCROLL PROJECTS (THE DRIBBBLE TREND) */}
      <section ref={horizontalSectionRef} className="h-screen w-full flex bg-[#0f0f0f] overflow-hidden relative">
        <div className="absolute top-20 left-12 z-50 mix-blend-difference">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter">Selected Works / 26'</h2>
        </div>
        
        {/* Container for horizontal slider */}
        <div className="flex h-full items-center w-[400vw] px-12 pt-20">
          {[
            { tag: "OSS", type: "Open Source Contribution", t: 'Ceph Storage Platform', d: 'Core engine optimizing billion-object scale parameters. Built entirely in C++.', img: "/images/ceph.png", link: "https://github.com/ceph/ceph" },
            { tag: "01", type: "System Project", t: 'agentic-core-operator', d: 'Open source Kubernetes operator acting as the intelligence core for distributed AI workloads.', img: "/images/agentic.png", link: "https://github.com/shreyanshjain7174/agentic-core-operator" },
            { tag: "02", type: "System Project", t: 'ai-agent-orchestrator', d: 'Orchestrating diverse AI agents seamlessly in high-throughput distributed environments.', img: "/images/orchestrator.png", link: "https://github.com/shreyanshjain7174/ai-agent-orchestrator" },
            { tag: "03", type: "System Project", t: 'ansible-mcp', d: 'Ansible Model Context Protocol server, bridging AI with robust infrastructure automation.', img: "/images/ansible.png", link: "https://github.com/shreyanshjain7174/ansible-mcp" }
          ].map((p, i) => (
            <a 
              href={p.link}
              target="_blank"
              rel="noreferrer"
              key={i} 
              className="project-card block w-[80vw] md:w-[60vw] h-[60vh] md:h-[70vh] flex-shrink-0 mx-8 relative group cursor-none"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <div className="absolute inset-0 rounded-[2rem] overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                  style={{ backgroundImage: `url(${p.img})` }}
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-700" />
              </div>
              
              <div className="absolute inset-0 p-12 flex flex-col justify-between z-10 mix-blend-difference text-white">
                <div className="flex items-center gap-4">
                  <span className="text-xl font-mono border border-white/30 rounded-full w-16 h-16 flex items-center justify-center backdrop-blur-md">
                    {p.tag}
                  </span>
                  <span className="text-sm font-bold uppercase tracking-widest text-[#a78bfa]">
                    {p.type}
                  </span>
                </div>
                
                <div className="transform transition-transform duration-500 group-hover:-translate-y-4">
                  <h3 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4">{p.t}</h3>
                  <p className="text-xl md:text-2xl font-light max-w-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    {p.d}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* FOOTER / CONTACT (BRUTALIST / MINIMAL) */}
      <section className="min-h-[70vh] flex flex-col items-center justify-center relative bg-[#050505] text-center px-4">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl w-full"
        >
          <div className="text-[8vw] md:text-[6vw] font-black uppercase tracking-tighter leading-none mb-12 hover:scale-105 transition-transform duration-500">
            Let's build<br/><span className="text-purple-500 italic">the impossible.</span>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-6">
            {[
              { label: 'GitHub', icon: Github, h: 'https://github.com/shreyanshjain7174' },
              { label: 'LinkedIn', icon: Linkedin, h: 'https://linkedin.com/in/shreyansh-sancheti' },
              { label: 'Twitter', icon: Twitter, h: 'https://twitter.com/shrey_sancheti' },
              { label: 'Instagram', icon: Instagram, h: 'https://instagram.com/shrey_sancheti' },
              { label: 'Email', icon: Mail, h: 'mailto:007ssancheti@gmail.com' },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <a 
                  key={i} 
                  href={s.h}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 px-8 py-4 rounded-full border border-white/20 hover:bg-white hover:text-black transition-all duration-300 group"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <Icon size={20} strokeWidth={2} />
                  <span className="font-mono uppercase text-sm font-bold tracking-widest">{s.label}</span>
                  <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity -ml-2" />
                </a>
              )
            })}
          </div>
          
          <div className="mt-32 text-xs font-mono tracking-widest text-neutral-500 uppercase">
            Based in Bangalore, India • SDE-2 @ Microsoft
          </div>
        </motion.div>
      </section>

    </div>
  );
}
