'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import Hero3DScene from './Hero3DScene';
import { RemotionPlayerWrapper } from './RemotionPlayerWrapper';
import { Meteors } from './Meteors';
import { Github, Linkedin, Twitter, Mail, Moon, Sun, Instagram } from 'lucide-react';
import { useTheme } from 'next-themes';

const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/shreyanshjain7174', icon: Github, color: '#333' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/shreyansh-sancheti', icon: Linkedin, color: '#0A66C2' },
  { label: 'Twitter', href: 'https://twitter.com/shrey_sancheti', icon: Twitter, color: '#1DA1F2' },
  { label: 'Instagram', href: 'https://instagram.com/shrey_sancheti', icon: Instagram, color: '#E1306C' },
  { label: 'Email', href: 'mailto:007ssancheti@gmail.com', icon: Mail, color: '#EA4335' },
];

const SKILLS = ['Go', 'C++', 'Python', 'Rust', 'TypeScript', 'Kubernetes', 'Docker', 'Distributed Systems'];

export default function BentoPortfolio() {
  const { theme, setTheme } = useTheme();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 80, damping: 15 } },
    hover: { scale: 1.03, zIndex: 10, filter: 'brightness(1.1)', transition: { type: 'spring', stiffness: 400, damping: 25 } }
  };

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-[#050505] p-4 md:p-8 xl:p-12 font-sans overflow-x-hidden selection:bg-purple-500/30 transition-colors duration-300">
      
      {/* Theme Toggle Button */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-3 rounded-full bg-white/50 dark:bg-black/50 backdrop-blur-md border border-black/10 dark:border-white/10 text-neutral-800 dark:text-white shadow-lg hover:scale-105 transition-all"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 opacity-10 dark:opacity-20 pointer-events-none transition-opacity duration-300">
        {theme === 'dark' && <Meteors number={15} />}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#d8b4fe_0%,transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_0%,#3b0764_0%,transparent_50%)] transition-colors duration-300" />
      </div>

      <motion.div 
        className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 auto-rows-[250px] gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* HERO WIDGET (2x2) */}
        <motion.div 
          className="md:col-span-2 md:row-span-2 rounded-3xl overflow-hidden relative group border border-black/5 dark:border-white/5 bg-white/40 dark:bg-white/5 backdrop-blur-md transition-colors duration-300"
          variants={itemVariants}
          whileHover="hover"
        >
          <div className="absolute inset-0 opacity-20 dark:opacity-40 mix-blend-multiply dark:mix-blend-screen pointer-events-none transition-opacity duration-700 group-hover:opacity-40 dark:group-hover:opacity-60 flex items-center justify-center">
             <motion.img 
                src="/images/avatar.png" 
                alt="Sketch Avatar"
                className="w-full max-w-sm dark:invert mix-blend-screen"
                animate={{ y: [0, -10, 0], rotate: [-1, 1, -1] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
             />
          </div>
          
          <motion.div
            className="absolute top-4 right-8 text-[20vw] font-black tracking-tighter mix-blend-overlay opacity-10 pointer-events-none"
            animate={{ rotateY: [0, 15, -15, 0], filter: ["blur(0px)", "blur(10px)", "blur(0px)"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          >
            S.
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/50 to-transparent dark:from-black/80 dark:via-black/20 dark:to-transparent transition-colors duration-300" />
          
          <div className="absolute inset-0 p-8 flex flex-col justify-end">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/20 dark:border-blue-500/30 w-fit mb-4"
            >
              <div className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400 animate-pulse" />
              <span className="text-xs font-semibold text-blue-700 dark:text-blue-200 uppercase tracking-widest">SDE-2 @ Microsoft</span>
            </motion.div>
            
            <h1 className="text-3xl md:text-5xl lg:text-5xl font-bold text-neutral-900 dark:text-white mb-2 tracking-tight transition-colors duration-300">
              Shreyansh<br/>Sancheti.
            </h1>
            <p className="text-neutral-600 dark:text-gray-400 max-w-md text-sm md:text-base transition-colors duration-300">
              I architect and build elite distributed systems that scale globally.
            </p>
          </div>
        </motion.div>

        {/* REMOTION VIDEO WIDGET (2x1) */}
        <motion.div 
          className="md:col-span-2 md:row-span-1 rounded-3xl overflow-hidden relative border border-black/5 dark:border-white/5 bg-gradient-to-br from-purple-200/50 to-indigo-200/50 dark:from-purple-900/20 dark:to-indigo-900/20 backdrop-blur-md flex items-center justify-center p-0 transition-colors duration-300"
          variants={itemVariants}
          whileHover="hover"
        >
          <div className="absolute inset-0 w-full h-full scale-[1.2] opacity-80 pointer-events-none">
            <RemotionPlayerWrapper />
          </div>
          <div className="absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/10 rounded-3xl pointer-events-none transition-colors duration-300" />
        </motion.div>

        {/* ABOUT WIDGET (1x1) */}
        <motion.div 
          className="md:col-span-1 md:row-span-1 rounded-3xl p-6 relative border border-black/5 dark:border-white/5 bg-white/40 dark:bg-white/[0.02] backdrop-blur-md flex flex-col group hover:bg-white/60 dark:hover:bg-white/[0.04] transition-colors duration-300"
          variants={itemVariants}
          whileHover="hover"
        >
          <h3 className="text-neutral-500 dark:text-gray-500 font-mono text-xs uppercase tracking-widest mb-4 transition-colors duration-300">About</h3>
          <p className="text-neutral-700 dark:text-gray-300 text-sm leading-relaxed transition-colors duration-300">
            Passionate about high-performance computing, systems engineering, and crafting beautiful developer tools. 
            Currently pushing the boundaries of scale at Microsoft.
          </p>
        </motion.div>

        {/* CONTACT & SOCIAL WIDGET (1x1) */}
        <motion.div 
          className="md:col-span-1 md:row-span-1 rounded-3xl p-6 relative border border-black/5 dark:border-white/5 bg-white/40 dark:bg-white/[0.02] backdrop-blur-md flex flex-col transition-colors duration-300"
          variants={itemVariants}
          whileHover="hover"
        >
          <h3 className="text-neutral-500 dark:text-gray-500 font-mono text-xs uppercase tracking-widest mb-4 transition-colors duration-300">Connect</h3>
          <div className="grid grid-cols-2 gap-3 h-full">
            {SOCIALS.map((s, i) => {
              const Icon = s.icon;
              return (
                <a 
                  key={i} 
                  href={s.href} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex flex-col items-center justify-center rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors border border-black/5 dark:border-white/5 group"
                >
                  <div className="text-neutral-600 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors duration-300">
                    <Icon size={24} strokeWidth={1.5} />
                  </div>
                  <span className="text-[10px] text-neutral-500 dark:text-gray-500 mt-1 font-medium transition-colors duration-300">{s.label}</span>
                </a>
              );
            })}
          </div>
        </motion.div>

        {/* PROJECTS SHOWCASE (2x2) */}
        <motion.div 
          className="md:col-span-2 md:row-span-2 rounded-3xl p-8 relative border border-black/5 dark:border-white/5 bg-white/40 dark:bg-white/[0.02] backdrop-blur-md flex flex-col group overflow-hidden transition-colors duration-300"
          variants={itemVariants}
          whileHover="hover"
        >
          <div className="absolute top-0 right-0 p-32 bg-purple-500/10 dark:bg-purple-500/10 blur-[100px] rounded-full transition-colors duration-300" />
          <h3 className="text-neutral-500 dark:text-gray-500 font-mono text-xs uppercase tracking-widest mb-6 relative z-10 transition-colors duration-300">Featured Works</h3>
          
          <div className="flex-1 flex flex-col gap-4 relative z-10 overflow-y-auto pr-2 custom-scrollbar mt-2">
            {[
              { t: 'Ceph Storage Platform', d: 'Core engine optimizing billion-object scale parameters. Built in C++.', c: '#f43f5e', link: 'https://github.com/ceph/ceph' },
              { t: 'agentic-core-operator', d: 'K8s operator acting as intelligence core for distributed AI.', c: '#8b5cf6', link: 'https://github.com/shreyanshjain7174/agentic-core-operator' },
              { t: 'ai-agent-orchestrator', d: 'Orchestrating diverse AI agents seamlessly in high-throughput environments.', c: '#3b82f6', link: 'https://github.com/shreyanshjain7174/ai-agent-orchestrator' },
              { t: 'ansible-mcp', d: 'Ansible MCP server, bridging AI with robust infra automation.', c: '#10b981', link: 'https://github.com/shreyanshjain7174/ansible-mcp' }
            ].map((p, i) => (
              <a 
                key={i} 
                href={p.link}
                target="_blank"
                rel="noreferrer"
                className="group/item flex items-center justify-between p-4 rounded-2xl bg-black/5 dark:bg-white/[0.03] hover:bg-black/10 dark:hover:bg-white/[0.08] transition-all border border-transparent hover:border-black/10 dark:hover:border-white/10 cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.c }} />
                    <h4 className="text-neutral-900 dark:text-white font-medium transition-colors duration-300">{p.t}</h4>
                  </div>
                  <p className="text-neutral-600 dark:text-gray-400 text-xs pl-5 transition-colors duration-300">{p.d}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-neutral-500 dark:text-white/50 group-hover/item:rotate-[-45deg] transition-transform">
                  ↑
                </div>
              </a>
            ))}
          </div>
        </motion.div>

        {/* EXPERIENCE / SKILLS (2x1) */}
        <motion.div 
          className="md:col-span-2 md:row-span-1 rounded-3xl p-6 relative border border-black/5 dark:border-white/5 bg-white/40 dark:bg-white/[0.02] backdrop-blur-md flex flex-col justify-center overflow-hidden transition-colors duration-300"
          variants={itemVariants}
          whileHover="hover"
        >
          <h3 className="text-neutral-500 dark:text-gray-500 font-mono text-xs uppercase tracking-widest border-b border-black/10 dark:border-white/5 pb-2 mb-4 transition-colors duration-300">Tech Stack Arsenal</h3>
          <div className="flex flex-wrap gap-2">
            {SKILLS.map((s, i) => (
              <span key={i} className="px-3 py-1.5 rounded-lg bg-black/5 dark:bg-white/5 text-neutral-800 dark:text-gray-300 text-xs font-mono hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-default border border-black/5 dark:border-white/5 hover:border-black/20 dark:hover:border-white/20">
                {s}
              </span>
            ))}
          </div>
        </motion.div>

        {/* MAP / LOCATION WIDGET (1x1) */}
        <motion.div 
          className="md:col-span-1 md:row-span-1 rounded-3xl relative border border-black/5 dark:border-white/5 bg-[#e5e5e5] dark:bg-[#0a0a0a] overflow-hidden group transition-colors duration-300"
          variants={itemVariants}
          whileHover="hover"
        >
          <div className="absolute inset-0 opacity-40 dark:opacity-30 bg-[url('https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&q=80&w=600')] bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-white/90 to-transparent dark:from-black/90 transition-colors duration-300" />
          <div className="absolute bottom-6 left-6">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-neutral-700 dark:text-gray-300 text-sm font-medium transition-colors duration-300">Based in</span>
            </div>
            <p className="text-neutral-900 dark:text-white font-semibold transition-colors duration-300">Bangalore, India</p>
          </div>
        </motion.div>

        {/* CTA WIDGET (1x1) */}
        <motion.div 
          className="md:col-span-1 md:row-span-1 rounded-3xl p-6 relative border border-black/5 dark:border-white/5 bg-gradient-to-br from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 dark:from-blue-600/20 dark:to-purple-600/20 dark:hover:from-blue-600/30 dark:hover:to-purple-600/30 transition-colors backdrop-blur-md flex flex-col items-center justify-center text-center cursor-pointer group"
          variants={itemVariants}
          whileHover="hover"
        >
          <div className="w-12 h-12 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300">
            <Mail size={20} strokeWidth={2.5} />
          </div>
          <h3 className="text-neutral-900 dark:text-white font-bold text-lg transition-colors duration-300">Let's Talk</h3>
          <p className="text-blue-600/70 dark:text-blue-200/70 text-xs mt-1 transition-colors duration-300">Ready for new challenges</p>
        </motion.div>

      </motion.div>

      {/* Custom scrollbar for projects list */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(150,150,150,0.2); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(150,150,150,0.4); }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}} />
    </div>
  );
}
