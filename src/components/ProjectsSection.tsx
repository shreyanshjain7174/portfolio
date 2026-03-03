'use client'

import { motion } from 'framer-motion'
import { WantedPoster } from './WantedPoster'

const projects = [
  {
    title: 'DPDK PACKET PROCESSING',
    description:
      'High-performance packet processing engine at Arista Networks achieving 400G+ throughput with zero packet loss. Built with DPDK for kernel-bypass networking.',
    tags: ['C', 'DPDK', 'Networking', 'Performance'],
    stat: '400G+',
    link: 'https://github.com/shreyanshjain7174',
  },
  {
    title: 'CEPH STORAGE CONTRIBUTIONS',
    description:
      '15+ merged pull requests to the Ceph distributed storage project. Improved monitoring, fixed edge cases in OSD operations, and enhanced cluster reliability.',
    tags: ['C++', 'Python', 'Ceph', 'Open Source'],
    stat: '15+ PRs',
    link: 'https://github.com/ceph/ceph',
  },
  {
    title: 'KUBERNETES VM ORCHESTRATION',
    description:
      'Infrastructure platform at xBattery orchestrating 500+ VMs on Kubernetes with 99.9% uptime. Automated provisioning, monitoring, and self-healing capabilities.',
    tags: ['Go', 'Kubernetes', 'Terraform', 'Infrastructure'],
    stat: '500+ VMs',
    link: 'https://github.com/shreyanshjain7174',
  },
  {
    title: 'XBATTERY INFRASTRUCTURE',
    description:
      'End-to-end infrastructure for battery analytics platform. Built CI/CD pipelines, monitoring dashboards, and automated deployment workflows.',
    tags: ['Python', 'Docker', 'AWS', 'CI/CD'],
    stat: '99.9%',
    link: 'https://github.com/shreyanshjain7174',
  },
]

export function ProjectsSection() {
  return (
    <section
      id="projects"
      className="relative py-24 px-6 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #1E90FF 0%, #4A90D9 50%, #87CEEB 100%)' }}
    >
      <div className="relative max-w-6xl mx-auto">
        {/* Heading */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="font-mono text-[10px] tracking-[0.4em] uppercase mb-3"
            style={{ color: 'rgba(255,248,231,0.7)' }}
          >
            ── Bounty Board ──
          </div>
          <h2
            className="font-display text-4xl md:text-6xl tracking-wide"
            style={{
              color: 'var(--color-gold)',
              textShadow: '0 0 30px rgba(255,215,0,0.4), 3px 3px 0 rgba(0,0,0,0.2)',
            }}
          >
            PROJECTS
          </h2>
        </motion.div>

        {/* Poster grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {projects.map((project) => (
            <WantedPoster key={project.title} {...project} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProjectsSection
