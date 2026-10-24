// Single source of truth for every word on the site. Both the tour and the
// plain view render from this file. Source: public/resume.pdf (Oct 2026).

export const PERSON = {
  name: 'Shreyansh Sancheti',
  role: 'AI Infrastructure Engineer',
  org: 'Microsoft Azure Compute',
  location: 'Bengaluru, India',
  email: 'hire.ssancheti@gmail.com',
  github: 'https://github.com/shreyanshjain7174',
  linkedin: 'https://www.linkedin.com/in/shreyansh-sancheti/',
  instagram: 'https://www.instagram.com/shrey_sancheti/',
  x: 'https://x.com/shrey_sancheti',
  resume: '/resume.pdf',
  summary:
    'AI Infrastructure / Platform Engineer at Microsoft Azure Compute (Hyper-V). 4+ years in Kubernetes, LLM inference, distributed systems and AI agent tooling; 15+ merged Ceph PRs, systems serving 10,000+ SMEs and 1000+ deployments.',
}

export type Gauge = { value: number; suffix: string; label: string; max: number }

export const GAUGES: Gauge[] = [
  { value: 4, suffix: '+', label: 'years uptime', max: 6 },
  { value: 15, suffix: '+', label: 'merged Ceph PRs', max: 20 },
  { value: 10000, suffix: '+', label: 'SMEs served', max: 12000 },
  { value: 1000, suffix: '+', label: 'deployments', max: 1200 },
]

export const SPEC_SHEET: [string, string][] = [
  ['Operator', 'Shreyansh Sancheti'],
  ['Role', 'AI Infrastructure / Platform'],
  ['Station', 'Azure Compute (Hyper-V), Microsoft'],
  ['Location', 'Bengaluru, India'],
  ['In service', '2022 to now, 4+ years'],
  ['Runs on', 'Kubernetes, LLM inference, distributed systems, AI agent tooling'],
]

export type Readout = { value: string; label: string }
export type Job = {
  id: string
  company: string
  title: string
  range: string
  readouts: Readout[]
  bullets: string[]
}

export const JOBS: Job[] = [
  {
    id: 'microsoft',
    company: 'Microsoft',
    title: 'Software Engineer II, Container Platform & Infrastructure (Azure Compute / Hyper-V)',
    range: 'Mar 2026 – Present',
    readouts: [
      { value: 'HCS', label: 'API migration' },
      { value: 'Live', label: 'Migration at Azure scale' },
    ],
    bullets: [
      'Drive HCSShim/HCS API migration to modern container abstractions, enabling Live Migration at Azure scale.',
      'Built parity/regression validation frameworks across container runtime layers.',
      'Built PowerShell/Go deployment tooling and CI/CD for rollout and validation.',
      'Root-cause distributed failures across Azure clusters using Kusto telemetry.',
    ],
  },
  {
    id: 'arista',
    company: 'Arista Networks',
    title: 'Software Engineer, Network Infrastructure & Performance (C++)',
    range: 'Feb 2025 – Feb 2026',
    readouts: [
      { value: '100%', label: 'packet loss eliminated' },
      { value: '-40%', label: 'MTTR' },
      { value: '+35%', label: 'deploy reliability' },
    ],
    bullets: [
      'Built BESS agent anomaly detection, eliminating 100% packet loss during port updates.',
      'Automated incident detection and RCA correlation, cutting MTTR 40%.',
      'Built Grafana dashboards for 400G+ systems; CI/CD raised deployment reliability 35%.',
    ],
  },
  {
    id: 'xbattery',
    company: 'XBattery',
    title: 'Senior Infrastructure Consultant, AI & Cloud Platform',
    range: 'Mar 2025 – Oct 2025',
    readouts: [
      { value: '99.9%', label: 'uptime' },
      { value: '10,000+', label: 'SMEs served' },
      { value: '-75%', label: 'false positives' },
    ],
    bullets: [
      'Built AI Kubernetes observability platform for 10,000+ SMEs: 99.9% uptime, 60% less manual work.',
      'Delivered Terraform/Ansible/GitLab CI pipelines enabling 50+ daily zero-downtime deploys.',
      'Correlated alerts across 500+ VMs, cutting false positives 75%; automated RCA resolved incidents 50% faster.',
    ],
  },
  {
    id: 'ibm',
    company: 'IBM',
    title: 'Software Engineer II, Cloud Storage & Automation',
    range: 'Jan 2023 – Feb 2025',
    readouts: [
      { value: '-60%', label: 'MTTR' },
      { value: '1000+', label: 'deployments watched' },
      { value: '10x', label: 'benchmark productivity' },
    ],
    bullets: [
      'Built Ceph performance monitoring (Prometheus, Python) detecting anomalies across 1000+ enterprise deployments.',
      'Automated troubleshooting with Python/Bash log analysis, cutting incident response time 40%.',
      'Built Rook-Ceph Kubernetes operators, cutting MTTR 60%; 15+ PRs merged to Ceph.',
      'Built Docker/Ansible S3 benchmarking framework, a 10x productivity gain.',
    ],
  },
  {
    id: 'redhat',
    company: 'Red Hat',
    title: 'Associate Software Engineer, Distributed Systems',
    range: 'Jan 2022 – Dec 2022',
    readouts: [
      { value: '+25%', label: 'storage throughput' },
      { value: '-30%', label: 'production incidents' },
      { value: '100+', label: 'code reviews' },
    ],
    bullets: [
      'Improved distributed storage throughput 25% via automated profiling and bottleneck analysis.',
      'Cut production incidents 30% with monitoring and alerting; cut QA cycle time 40% with Docker-based performance test automation; 100+ code reviews.',
    ],
  },
]

export type Project = {
  id: string
  name: string
  role?: string
  part: string
  stack: string[]
  summary: string
  url: string
  meter?: { acks: number; p99: number }
}

export const PROJECTS: Project[] = [
  {
    id: 'agentic-operator',
    name: 'Agentic Operator',
    role: 'Clawdlinux, Founder · 51 stars',
    part: 'CLX-AO-01',
    stack: ['Go', 'Kubernetes', 'gVisor', 'Cilium', 'MCP'],
    summary: 'Runtime-agnostic Kubernetes governance for AI agents: gVisor isolation, egress policy, cost controls and offline audit verification. Mercatus grant.',
    url: 'https://github.com/Clawdlinux/agentic-operator-core',
  },
  {
    id: 'zerodb',
    name: 'ZeroDB',
    role: 'Clawdlinux',
    part: 'ZDB-RS-02',
    stack: ['Rust'],
    summary: 'Agent memory database in Rust: durable tape, hybrid recall and cache, speed and crash safety first. 48.6K acks/s, 502 µs p99 vs Redis and Valkey.',
    url: 'https://github.com/Clawdlinux/zerodb',
    meter: { acks: 48.6, p99: 502 },
  },
  {
    id: 'agentgate',
    name: 'agentgate',
    role: 'Clawdlinux',
    part: 'AGG-GO-03',
    stack: ['Go', 'OAuth', 'Biscuit', 'MCP'],
    summary: 'A thin API gateway that lets AI agents call SaaS APIs on behalf of users. Agents never see the tokens.',
    url: 'https://github.com/Clawdlinux/agentgate',
  },
  {
    id: 'memtorture',
    name: 'memtorture',
    role: 'Clawdlinux',
    part: 'MTT-PY-04',
    stack: ['Python'],
    summary: 'Torture tests for agent memory engines: crash, concurrency and recall delay. Evidence, not marketing.',
    url: 'https://github.com/Clawdlinux/memtorture',
  },
  {
    id: 'agent-native-format',
    name: 'Agent Native Format',
    role: 'Clawdlinux',
    part: 'ANF-GO-05',
    stack: ['Go', 'Kubernetes', 'MCP'],
    summary: 'Token-minimal system views for AI agents: Kubernetes and live state translated into a compact format, with governed execution primitives.',
    url: 'https://github.com/Clawdlinux/agent-native-format',
  },
  {
    id: 'piko',
    name: 'Piko',
    part: 'PKO-IOS-06',
    stack: ['Swift', 'iOS', 'On-device ML'],
    summary: 'On-device iPhone voice dictation: SpeechAnalyzer and Foundation Models, streaming into the keyboard. No audio leaves the device.',
    url: 'https://github.com/shreyanshjain7174/piko',
  },
]

export const SKILL_RACKS: { rack: string; items: string[] }[] = [
  { rack: 'Languages', items: ['Python', 'Go', 'Rust', 'C/C++', 'Swift', 'Bash', 'PowerShell', 'TypeScript', 'SQL'] },
  {
    rack: 'AI Infrastructure',
    items: ['LLM inference', 'vLLM', 'KServe', 'llm-d', 'Inference autoscaling (HPA)', 'Model serving', 'Multi-tenant isolation', 'MCP', 'RAG', 'LangGraph', 'LangChain', 'Azure OpenAI', 'Agentic workflows'],
  },
  {
    rack: 'Cloud & Platform',
    items: ['Kubernetes', 'Operators & CRDs', 'Azure', 'AWS', 'Docker', 'Terraform', 'Ansible', 'containerd', 'Hyper-V', 'gVisor', 'Cilium', 'Ceph', 'Linux'],
  },
  {
    rack: 'Observability & Delivery',
    items: ['Prometheus', 'Grafana', 'OpenTelemetry', 'Kusto', 'ELK', 'GitHub Actions', 'GitLab CI', 'Incident response', 'RCA', 'High availability', 'Cost optimization'],
  },
  {
    rack: 'Customer-facing',
    items: ['Solution design', 'Enterprise integration', 'Technical advisory', 'REST/gRPC APIs', 'n8n workflows', 'Human-in-the-loop AI', 'Demos', 'Conference talks'],
  },
]

export const HIGHLIGHT_SKILLS = new Set(['Kubernetes', 'vLLM', 'Go', 'Rust', 'Terraform'])

export const TALK = {
  event: 'SREcon26 EMEA',
  where: 'Dublin, Oct 2026',
  format: 'Lightning talk',
  title: 'Why the Kubernetes autoscaler fails LLM inference',
}

// Illustrative log lines for the control-room monitor; they narrate the talk's argument.
export const TALK_LOG = [
  'hpa: target cpu 70%  observed 41%  -> no scale',
  'vllm: queue depth 212  kv-cache 94%',
  'autoscaler: queue depth lag -> scale-up too late',
  'p99 ttft 8.4s  slo 2s  breach',
  'pod/vllm-7 Pending  gpu: 0/8 free',
  'fix: scale on queue depth + kv-cache, not cpu',
]

export const STAGES = ['Ceph Days', 'Agentic Summit Bangalore', 'SREcon26 EMEA']

export const OPEN_SOURCE = [
  { name: 'Ceph', note: '15+ merged PRs', url: 'https://github.com/ceph/ceph/pulls?q=is:pr+author:shreyanshjain7174' },
  { name: 'containerd', note: 'Contributing', url: 'https://github.com/containerd/containerd' },
  { name: 'hcsshim', note: 'Contributing', url: 'https://github.com/microsoft/hcsshim' },
]

export const EDUCATION = {
  school: 'Walchand Institute of Technology',
  degree: 'B.Tech, Computer Science and Engineering',
  range: 'Aug 2018 – Jul 2022',
  grade: 'CGPA 9.3/10.0',
}

export const STATIONS = [
  { id: 'gate', label: 'Gate' },
  { id: 'floor', label: 'Floor' },
  { id: 'assembly', label: 'Assembly' },
  { id: 'showroom', label: 'Showroom' },
  { id: 'tools', label: 'Tool Wall' },
  { id: 'control', label: 'Control Room' },
  { id: 'dispatch', label: 'Exit' },
] as const

/** The hall of fame wall: stages, recognition and where to find me. */
export const HALL_OF_FAME = [
  { title: 'SREcon26 EMEA', detail: 'Speaker · Dublin, Oct 2026', note: 'Why the Kubernetes autoscaler fails LLM inference', url: 'https://github.com/shreyanshjain7174/srecon26-vast-sku-report-poc' },
  { title: 'Ceph Days', detail: 'Speaker', note: 'Distributed storage, from the people who maintain it', url: 'https://github.com/ceph/ceph/pulls?q=is:pr+author:shreyanshjain7174' },
  { title: 'Agentic Summit', detail: 'Speaker · Bangalore', note: 'AI agents on real infrastructure', url: '' },
  { title: '15+ merged PRs', detail: 'Ceph upstream', note: 'RADOS Gateway and storage engine work', url: 'https://github.com/ceph/ceph/pulls?q=is:pr+author:shreyanshjain7174' },
  { title: 'Mercatus grant', detail: 'Agentic Operator', note: 'Kubernetes governance for AI agents', url: 'https://github.com/Clawdlinux/agentic-operator-core' },
  { title: '51 stars', detail: 'agentic-operator-core', note: 'Open source, built in public', url: 'https://github.com/Clawdlinux/agentic-operator-core' },
]

export const SOCIALS = [
  { label: 'Instagram', handle: '@shrey_sancheti', url: PERSON.instagram },
  { label: 'LinkedIn', handle: 'shreyansh-sancheti', url: PERSON.linkedin },
  { label: 'X', handle: '@shrey_sancheti', url: PERSON.x },
  { label: 'GitHub', handle: 'shreyanshjain7174', url: PERSON.github },
]

/** Off the clock: the get-to-know-me wall. */
export const HOBBIES = [
  { name: 'Badminton', note: 'Fast hands, faster feet.', image: '/images/hobbies/badminton.webp' },
  { name: 'Cricket', note: 'Weekend overs, never enough of them.', image: '/images/hobbies/cricket.webp' },
  { name: 'Guitar', note: 'The one thing I play slowly on purpose.', image: '/images/hobbies/guitar.webp' },
]
