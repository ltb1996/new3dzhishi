function toDataUri(svg) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function createTopicArtwork({ icon, label, colors }) {
  const [primary, secondary, accent] = colors;

  return toDataUri(`
    <svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="76" y1="62" x2="432" y2="454" gradientUnits="userSpaceOnUse">
          <stop stop-color="${primary}"/>
          <stop offset="1" stop-color="${secondary}"/>
        </linearGradient>
        <radialGradient id="glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(176 132) rotate(42) scale(340)">
          <stop stop-color="${accent}" stop-opacity="0.66"/>
          <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect x="24" y="24" width="464" height="464" rx="150" fill="url(#bg)"/>
      <rect x="24" y="24" width="464" height="464" rx="150" stroke="rgba(255,255,255,0.16)" stroke-width="2"/>
      <circle cx="256" cy="256" r="176" fill="url(#glow)"/>
      <circle cx="256" cy="256" r="150" stroke="rgba(255,255,255,0.12)" stroke-width="2"/>
      <circle cx="256" cy="256" r="118" fill="#0C1224" fill-opacity="0.26" stroke="rgba(255,255,255,0.12)" stroke-width="2"/>
      <path d="M124 176C158 128 214 100 276 100C328 100 374 118 410 148" stroke="rgba(255,255,255,0.14)" stroke-width="8" stroke-linecap="round"/>
      <path d="M110 318C146 376 212 412 286 412C338 412 382 394 416 362" stroke="rgba(255,255,255,0.1)" stroke-width="7" stroke-linecap="round"/>
      <circle cx="146" cy="162" r="10" fill="${accent}" fill-opacity="0.9"/>
      <circle cx="386" cy="352" r="8" fill="#FFFFFF" fill-opacity="0.84"/>
      ${icon}
      <rect x="136" y="392" width="240" height="38" rx="19" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.12)"/>
      <text x="256" y="416" text-anchor="middle" fill="#FFFFFF" fill-opacity="0.82" font-size="18" font-family="Arial, Helvetica, sans-serif" letter-spacing="4">${label}</text>
    </svg>
  `);
}

function createPathArtwork({ icon, label, colors }) {
  const [primary, secondary, accent] = colors;

  return toDataUri(`
    <svg width="640" height="400" viewBox="0 0 640 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="52" y1="36" x2="604" y2="360" gradientUnits="userSpaceOnUse">
          <stop stop-color="${primary}"/>
          <stop offset="1" stop-color="${secondary}"/>
        </linearGradient>
        <radialGradient id="beam" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(180 112) rotate(32) scale(420)">
          <stop stop-color="${accent}" stop-opacity="0.45"/>
          <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect x="20" y="20" width="600" height="360" rx="34" fill="url(#bg)"/>
      <rect x="20" y="20" width="600" height="360" rx="34" stroke="rgba(255,255,255,0.16)" stroke-width="2"/>
      <circle cx="242" cy="164" r="196" fill="url(#beam)"/>
      <path d="M86 294C172 204 260 156 358 156C426 156 488 180 548 232" stroke="rgba(255,255,255,0.2)" stroke-width="10" stroke-linecap="round"/>
      <circle cx="134" cy="250" r="14" fill="#FFFFFF" fill-opacity="0.84"/>
      <circle cx="260" cy="172" r="12" fill="${accent}" fill-opacity="0.9"/>
      <circle cx="392" cy="170" r="11" fill="#FFFFFF" fill-opacity="0.78"/>
      <circle cx="522" cy="220" r="16" fill="${accent}" fill-opacity="0.9"/>
      ${icon}
      <rect x="72" y="74" width="170" height="42" rx="21" fill="#0B1222" fill-opacity="0.24" stroke="rgba(255,255,255,0.14)"/>
      <text x="157" y="101" text-anchor="middle" fill="#FFFFFF" font-size="19" font-family="Arial, Helvetica, sans-serif" letter-spacing="3">${label}</text>
    </svg>
  `);
}

const topicIcons = {
  programming_basics: `
    <path d="M194 196L152 236L194 276" stroke="#FFFFFF" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M318 196L360 236L318 276" stroke="#FFFFFF" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M286 168L244 304" stroke="#93C5FD" stroke-width="16" stroke-linecap="round"/>
    <rect x="222" y="320" width="68" height="14" rx="7" fill="#FFFFFF" fill-opacity="0.78"/>
  `,
  data_structures: `
    <path d="M184 186L256 152L328 190L328 276L256 318L184 280V186Z" stroke="#FFFFFF" stroke-width="14" stroke-linejoin="round"/>
    <circle cx="184" cy="186" r="16" fill="#5EEAD4"/>
    <circle cx="256" cy="152" r="16" fill="#FFFFFF" fill-opacity="0.84"/>
    <circle cx="328" cy="190" r="16" fill="#5EEAD4"/>
    <circle cx="328" cy="276" r="16" fill="#FFFFFF" fill-opacity="0.84"/>
    <circle cx="256" cy="318" r="16" fill="#5EEAD4"/>
    <circle cx="184" cy="280" r="16" fill="#FFFFFF" fill-opacity="0.84"/>
  `,
  algorithms: `
    <rect x="168" y="176" width="80" height="48" rx="16" stroke="#FFFFFF" stroke-width="12"/>
    <path d="M248 200H286" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round"/>
    <path d="M286 200L304 182M286 200L304 218" stroke="#A78BFA" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M304 200H340V248" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M340 248L318 270M340 248L362 270" stroke="#A78BFA" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="340" cy="296" r="26" stroke="#FFFFFF" stroke-width="12"/>
    <circle cx="340" cy="296" r="8" fill="#C4B5FD"/>
  `,
  computer_architecture: `
    <rect x="188" y="176" width="136" height="136" rx="24" stroke="#FFFFFF" stroke-width="12"/>
    <rect x="222" y="210" width="68" height="68" rx="14" fill="#FCD34D" fill-opacity="0.18" stroke="#FFFFFF" stroke-width="10"/>
    <path d="M212 150V176M244 150V176M276 150V176M308 150V176M212 312V338M244 312V338M276 312V338M308 312V338" stroke="#FCD34D" stroke-width="10" stroke-linecap="round"/>
    <path d="M162 212H188M162 244H188M162 276H188M324 212H350M324 244H350M324 276H350" stroke="#FCD34D" stroke-width="10" stroke-linecap="round"/>
  `,
  operating_systems: `
    <rect x="170" y="168" width="188" height="132" rx="18" fill="#FFFFFF" fill-opacity="0.08" stroke="#FFFFFF" stroke-width="12"/>
    <path d="M170 208H358" stroke="#FFFFFF" stroke-width="12"/>
    <circle cx="198" cy="188" r="7" fill="#FFFFFF" fill-opacity="0.86"/>
    <circle cx="222" cy="188" r="7" fill="#FFFFFF" fill-opacity="0.6"/>
    <circle cx="246" cy="188" r="7" fill="#FFFFFF" fill-opacity="0.45"/>
    <rect x="198" y="230" width="52" height="18" rx="9" fill="#94A3B8"/>
    <rect x="198" y="262" width="92" height="14" rx="7" fill="#FFFFFF" fill-opacity="0.7"/>
    <rect x="306" y="234" width="24" height="24" rx="6" stroke="#94A3B8" stroke-width="8"/>
    <path d="M318 220V206M318 286V270M344 246H358M278 246H292M337 227L347 217M289 275L299 265M337 265L347 275M289 217L299 227" stroke="#94A3B8" stroke-width="8" stroke-linecap="round"/>
  `,
  computer_networks: `
    <circle cx="256" cy="244" r="92" stroke="#FFFFFF" stroke-width="12"/>
    <path d="M164 244H348M256 152C286 176 304 210 304 244C304 278 286 312 256 336M256 152C226 176 208 210 208 244C208 278 226 312 256 336M194 188C230 204 282 204 318 188M194 300C230 284 282 284 318 300" stroke="#67E8F9" stroke-width="10" stroke-linecap="round"/>
    <circle cx="168" cy="244" r="14" fill="#FFFFFF"/>
    <circle cx="256" cy="152" r="14" fill="#67E8F9"/>
    <circle cx="344" cy="244" r="14" fill="#FFFFFF"/>
    <circle cx="256" cy="336" r="14" fill="#67E8F9"/>
  `,
  database_systems: `
    <ellipse cx="256" cy="176" rx="82" ry="28" fill="#86EFAC" fill-opacity="0.26" stroke="#FFFFFF" stroke-width="12"/>
    <path d="M174 176V292C174 308 211 322 256 322C301 322 338 308 338 292V176" fill="#0B1222" fill-opacity="0.18" stroke="#FFFFFF" stroke-width="12"/>
    <path d="M174 234C174 250 211 264 256 264C301 264 338 250 338 234" stroke="#86EFAC" stroke-width="12"/>
    <path d="M174 292C174 308 211 322 256 322C301 322 338 308 338 292" stroke="#86EFAC" stroke-width="12"/>
  `,
  software_engineering: `
    <rect x="164" y="176" width="78" height="54" rx="16" stroke="#FFFFFF" stroke-width="12"/>
    <rect x="270" y="148" width="78" height="54" rx="16" stroke="#FFFFFF" stroke-width="12"/>
    <rect x="270" y="260" width="78" height="54" rx="16" stroke="#FFFFFF" stroke-width="12"/>
    <path d="M242 204H270M270 176V188M242 204H256V286H270" stroke="#F0ABFC" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M194 258L214 278L246 244" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
  `,
  frontend_engineering: `
    <rect x="158" y="170" width="196" height="138" rx="20" stroke="#FFFFFF" stroke-width="12"/>
    <path d="M158 208H354" stroke="#FFFFFF" stroke-width="12"/>
    <circle cx="188" cy="188" r="7" fill="#FFFFFF" fill-opacity="0.86"/>
    <circle cx="212" cy="188" r="7" fill="#FFFFFF" fill-opacity="0.6"/>
    <circle cx="236" cy="188" r="7" fill="#FFFFFF" fill-opacity="0.4"/>
    <rect x="182" y="232" width="78" height="48" rx="12" fill="#FDA4AF" fill-opacity="0.28" stroke="#FFFFFF" stroke-width="8"/>
    <rect x="276" y="232" width="52" height="18" rx="9" fill="#FFFFFF" fill-opacity="0.82"/>
    <rect x="276" y="262" width="40" height="14" rx="7" fill="#FFFFFF" fill-opacity="0.46"/>
    <path d="M312 300L280 258L302 258L292 224L334 274L312 274L322 300Z" fill="#FFFFFF"/>
  `,
  backend_engineering: `
    <rect x="176" y="160" width="160" height="54" rx="16" stroke="#FFFFFF" stroke-width="12"/>
    <rect x="176" y="230" width="160" height="54" rx="16" stroke="#FFFFFF" stroke-width="12"/>
    <rect x="176" y="300" width="160" height="54" rx="16" stroke="#FFFFFF" stroke-width="12"/>
    <circle cx="206" cy="187" r="8" fill="#FDBA74"/>
    <circle cx="206" cy="257" r="8" fill="#FDBA74"/>
    <circle cx="206" cy="327" r="8" fill="#FDBA74"/>
    <path d="M360 258H392M392 258L374 240M392 258L374 276" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M406 212V304" stroke="#FDBA74" stroke-width="12" stroke-linecap="round"/>
  `,
  distributed_systems: `
    <rect x="144" y="164" width="84" height="56" rx="16" stroke="#FFFFFF" stroke-width="12"/>
    <rect x="284" y="164" width="84" height="56" rx="16" stroke="#FFFFFF" stroke-width="12"/>
    <rect x="214" y="286" width="84" height="56" rx="16" stroke="#FFFFFF" stroke-width="12"/>
    <circle cx="256" cy="242" r="20" fill="#93C5FD"/>
    <path d="M228 196L244 224M326 196L268 224M256 262V286" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round"/>
    <circle cx="186" cy="192" r="8" fill="#93C5FD"/>
    <circle cx="326" cy="192" r="8" fill="#93C5FD"/>
    <circle cx="256" cy="314" r="8" fill="#93C5FD"/>
  `,
  artificial_intelligence: `
    <circle cx="190" cy="196" r="14" fill="#FFFFFF"/>
    <circle cx="256" cy="170" r="16" fill="#DDD6FE"/>
    <circle cx="322" cy="196" r="14" fill="#FFFFFF"/>
    <circle cx="214" cy="272" r="14" fill="#DDD6FE"/>
    <circle cx="298" cy="272" r="14" fill="#DDD6FE"/>
    <path d="M190 196L256 170L322 196L298 272H214L190 196Z" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M256 140L264 156L282 158L270 170L274 188L256 178L238 188L242 170L230 158L248 156L256 140Z" fill="#DDD6FE"/>
  `,
  cyber_security: `
    <path d="M256 152L334 182V242C334 296 300 338 256 356C212 338 178 296 178 242V182L256 152Z" fill="#0B1222" fill-opacity="0.18" stroke="#FFFFFF" stroke-width="12" stroke-linejoin="round"/>
    <rect x="220" y="226" width="72" height="60" rx="14" fill="#FCA5A5" fill-opacity="0.18" stroke="#FFFFFF" stroke-width="10"/>
    <path d="M234 226V212C234 190 252 174 274 174C296 174 314 190 314 212V226" stroke="#FCA5A5" stroke-width="10" stroke-linecap="round"/>
    <circle cx="256" cy="254" r="8" fill="#FFFFFF"/>
    <path d="M256 262V278" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round"/>
  `
};

const pathIcons = {
  cs_foundation: `
    <path d="M104 274L178 210L252 236L338 152L426 174L516 122" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="98" y="250" width="42" height="32" rx="10" fill="#7DD3FC"/>
    <rect x="164" y="188" width="42" height="32" rx="10" fill="#FFFFFF" fill-opacity="0.8"/>
    <rect x="238" y="214" width="42" height="32" rx="10" fill="#7DD3FC"/>
    <rect x="324" y="130" width="42" height="32" rx="10" fill="#FFFFFF" fill-opacity="0.8"/>
    <rect x="412" y="152" width="42" height="32" rx="10" fill="#7DD3FC"/>
    <rect x="502" y="100" width="42" height="32" rx="10" fill="#FFFFFF" fill-opacity="0.8"/>
  `,
  fullstack_web: `
    <rect x="102" y="178" width="126" height="88" rx="18" stroke="#FFFFFF" stroke-width="10"/>
    <path d="M102 214H228" stroke="#FFFFFF" stroke-width="10"/>
    <circle cx="126" cy="196" r="6" fill="#FFFFFF"/>
    <circle cx="146" cy="196" r="6" fill="#FFFFFF" fill-opacity="0.62"/>
    <rect x="288" y="166" width="102" height="112" rx="18" stroke="#FFFFFF" stroke-width="10"/>
    <path d="M228 222H288M390 222H448" stroke="#C4B5FD" stroke-width="10" stroke-linecap="round"/>
    <path d="M432 206L448 222L432 238" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
    <ellipse cx="500" cy="194" rx="46" ry="18" fill="#FFFFFF" fill-opacity="0.14" stroke="#FFFFFF" stroke-width="8"/>
    <path d="M454 194V248C454 260 474 270 500 270C526 270 546 260 546 248V194" stroke="#FFFFFF" stroke-width="8"/>
  `,
  systems_architecture: `
    <rect x="100" y="256" width="112" height="58" rx="18" stroke="#FFFFFF" stroke-width="10"/>
    <rect x="264" y="194" width="112" height="58" rx="18" stroke="#FFFFFF" stroke-width="10"/>
    <rect x="430" y="132" width="112" height="58" rx="18" stroke="#FFFFFF" stroke-width="10"/>
    <path d="M212 286L264 224M376 224L430 162" stroke="#5EEAD4" stroke-width="10" stroke-linecap="round"/>
    <circle cx="156" cy="286" r="8" fill="#5EEAD4"/>
    <circle cx="320" cy="224" r="8" fill="#FFFFFF"/>
    <circle cx="486" cy="162" r="8" fill="#5EEAD4"/>
  `,
  data_intelligence: `
    <rect x="96" y="236" width="40" height="62" rx="10" fill="#86EFAC"/>
    <rect x="156" y="210" width="40" height="88" rx="10" fill="#FFFFFF" fill-opacity="0.8"/>
    <rect x="216" y="178" width="40" height="120" rx="10" fill="#86EFAC"/>
    <path d="M300 268L334 230L370 248L408 194L454 210L498 154" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="334" cy="230" r="10" fill="#86EFAC"/>
    <circle cx="408" cy="194" r="10" fill="#86EFAC"/>
    <circle cx="498" cy="154" r="10" fill="#86EFAC"/>
  `,
  software_delivery: `
    <rect x="102" y="176" width="90" height="60" rx="18" stroke="#FFFFFF" stroke-width="10"/>
    <path d="M124 206L146 224L170 192" stroke="#FDBA74" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M192 206H272M272 206L254 188M272 206L254 224" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="282" y="176" width="96" height="60" rx="18" stroke="#FFFFFF" stroke-width="10"/>
    <path d="M312 204H348" stroke="#FDBA74" stroke-width="10" stroke-linecap="round"/>
    <path d="M378 206H460M460 206L442 188M460 206L442 224" stroke="#FFFFFF" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M476 238L516 176L534 198L560 146L572 256L542 232L520 290L476 238Z" fill="#FDBA74"/>
  `
};

const topicArtwork = {
  programming_basics: createTopicArtwork({
    icon: topicIcons.programming_basics,
    label: "PROGRAMMING",
    colors: ["#2563EB", "#0F172A", "#7DD3FC"]
  }),
  data_structures: createTopicArtwork({
    icon: topicIcons.data_structures,
    label: "DATA STRUCTURES",
    colors: ["#0F766E", "#082F49", "#5EEAD4"]
  }),
  algorithms: createTopicArtwork({
    icon: topicIcons.algorithms,
    label: "ALGORITHMS",
    colors: ["#7C3AED", "#1E1B4B", "#C4B5FD"]
  }),
  computer_architecture: createTopicArtwork({
    icon: topicIcons.computer_architecture,
    label: "ARCHITECTURE",
    colors: ["#B45309", "#3F1D0B", "#FCD34D"]
  }),
  operating_systems: createTopicArtwork({
    icon: topicIcons.operating_systems,
    label: "OPERATING SYSTEM",
    colors: ["#334155", "#0F172A", "#94A3B8"]
  }),
  computer_networks: createTopicArtwork({
    icon: topicIcons.computer_networks,
    label: "NETWORKS",
    colors: ["#0284C7", "#082F49", "#67E8F9"]
  }),
  database_systems: createTopicArtwork({
    icon: topicIcons.database_systems,
    label: "DATABASE",
    colors: ["#166534", "#052E16", "#86EFAC"]
  }),
  software_engineering: createTopicArtwork({
    icon: topicIcons.software_engineering,
    label: "SOFTWARE ENGINEERING",
    colors: ["#9333EA", "#3B0764", "#F0ABFC"]
  }),
  frontend_engineering: createTopicArtwork({
    icon: topicIcons.frontend_engineering,
    label: "FRONTEND",
    colors: ["#DB2777", "#4A044E", "#FDA4AF"]
  }),
  backend_engineering: createTopicArtwork({
    icon: topicIcons.backend_engineering,
    label: "BACKEND",
    colors: ["#EA580C", "#431407", "#FDBA74"]
  }),
  distributed_systems: createTopicArtwork({
    icon: topicIcons.distributed_systems,
    label: "DISTRIBUTED",
    colors: ["#1D4ED8", "#172554", "#93C5FD"]
  }),
  artificial_intelligence: createTopicArtwork({
    icon: topicIcons.artificial_intelligence,
    label: "ARTIFICIAL INTELLIGENCE",
    colors: ["#7E22CE", "#1E1B4B", "#DDD6FE"]
  }),
  cyber_security: createTopicArtwork({
    icon: topicIcons.cyber_security,
    label: "CYBER SECURITY",
    colors: ["#B91C1C", "#450A0A", "#FCA5A5"]
  })
};

const pathArtwork = {
  cs_foundation: createPathArtwork({
    icon: pathIcons.cs_foundation,
    label: "FOUNDATION",
    colors: ["#1D4ED8", "#0F172A", "#7DD3FC"]
  }),
  fullstack_web: createPathArtwork({
    icon: pathIcons.fullstack_web,
    label: "FULLSTACK WEB",
    colors: ["#7C3AED", "#1E1B4B", "#C4B5FD"]
  }),
  systems_architecture: createPathArtwork({
    icon: pathIcons.systems_architecture,
    label: "SYSTEMS ARCHITECTURE",
    colors: ["#0F766E", "#082F49", "#5EEAD4"]
  }),
  data_intelligence: createPathArtwork({
    icon: pathIcons.data_intelligence,
    label: "DATA INTELLIGENCE",
    colors: ["#166534", "#052E16", "#86EFAC"]
  }),
  software_delivery: createPathArtwork({
    icon: pathIcons.software_delivery,
    label: "SOFTWARE DELIVERY",
    colors: ["#EA580C", "#431407", "#FDBA74"]
  })
};

const topics = [
  {
    id: "programming_basics",
    name: "Programming Basics",
    displayName: "程序设计基础",
    image: topicArtwork.programming_basics,
    accentColor: "#7DD3FC",
    level: "入门基础",
    tags: ["基础", "编程"],
    connections: ["data_structures", "software_engineering", "frontend_engineering", "backend_engineering"],
    description:
      "程序设计基础帮助学习者建立变量、流程控制、函数、模块化和调试意识，是进入任何计算机方向前必须掌握的起点。",
    learningPaths: ["cs_foundation", "fullstack_web", "software_delivery"]
  },
  {
    id: "data_structures",
    name: "Data Structures",
    displayName: "数据结构",
    image: topicArtwork.data_structures,
    accentColor: "#5EEAD4",
    level: "核心能力",
    tags: ["基础", "算法"],
    connections: ["programming_basics", "algorithms", "database_systems", "artificial_intelligence"],
    description:
      "数据结构研究如何高效组织和管理数据，常见内容包括数组、链表、栈、队列、树、图以及哈希结构。",
    learningPaths: ["cs_foundation", "data_intelligence"]
  },
  {
    id: "algorithms",
    name: "Algorithms",
    displayName: "算法设计",
    image: topicArtwork.algorithms,
    accentColor: "#C4B5FD",
    level: "核心能力",
    tags: ["基础", "算法"],
    connections: ["data_structures", "artificial_intelligence", "distributed_systems", "cyber_security"],
    description:
      "算法设计关注求解问题的步骤与复杂度分析，核心在于时间效率、空间效率以及对问题抽象能力的训练。",
    learningPaths: ["cs_foundation", "data_intelligence", "systems_architecture"]
  },
  {
    id: "computer_architecture",
    name: "Computer Architecture",
    displayName: "计算机组成原理",
    image: topicArtwork.computer_architecture,
    accentColor: "#FCD34D",
    level: "系统基础",
    tags: ["系统", "硬件"],
    connections: ["operating_systems", "distributed_systems"],
    description:
      "计算机组成原理解释指令执行、存储层次、CPU 结构与输入输出机制，是理解系统性能和底层原理的重要基础。",
    learningPaths: ["cs_foundation", "systems_architecture"]
  },
  {
    id: "operating_systems",
    name: "Operating Systems",
    displayName: "操作系统",
    image: topicArtwork.operating_systems,
    accentColor: "#94A3B8",
    level: "系统核心",
    tags: ["系统", "基础"],
    connections: ["computer_architecture", "computer_networks", "backend_engineering", "distributed_systems", "cyber_security"],
    description:
      "操作系统负责进程调度、内存管理、文件系统和设备管理，是所有软件运行的基础平台。",
    learningPaths: ["cs_foundation", "systems_architecture", "software_delivery"]
  },
  {
    id: "computer_networks",
    name: "Computer Networks",
    displayName: "计算机网络",
    image: topicArtwork.computer_networks,
    accentColor: "#67E8F9",
    level: "系统核心",
    tags: ["系统", "通信"],
    connections: ["operating_systems", "backend_engineering", "distributed_systems", "cyber_security"],
    description:
      "计算机网络研究数据如何在设备间可靠传输，涵盖分层模型、路由、传输控制、应用协议与网络安全基础。",
    learningPaths: ["cs_foundation", "fullstack_web", "systems_architecture"]
  },
  {
    id: "database_systems",
    name: "Database Systems",
    displayName: "数据库系统",
    image: topicArtwork.database_systems,
    accentColor: "#86EFAC",
    level: "工程核心",
    tags: ["数据", "工程"],
    connections: ["data_structures", "backend_engineering", "distributed_systems", "artificial_intelligence"],
    description:
      "数据库系统关注数据建模、查询优化、事务管理与持久化设计，是现代应用开发和数据分析的核心基建。",
    learningPaths: ["cs_foundation", "fullstack_web", "data_intelligence", "software_delivery"]
  },
  {
    id: "software_engineering",
    name: "Software Engineering",
    displayName: "软件工程",
    image: topicArtwork.software_engineering,
    accentColor: "#F0ABFC",
    level: "工程方法",
    tags: ["工程", "协作"],
    connections: ["programming_basics", "frontend_engineering", "backend_engineering", "cyber_security"],
    description:
      "软件工程强调需求分析、系统设计、版本管理、测试、持续集成与团队协作，帮助项目从代码走向可交付产品。",
    learningPaths: ["fullstack_web", "software_delivery"]
  },
  {
    id: "frontend_engineering",
    name: "Frontend Engineering",
    displayName: "前端工程",
    image: topicArtwork.frontend_engineering,
    accentColor: "#FDA4AF",
    level: "应用开发",
    tags: ["开发", "Web"],
    connections: ["programming_basics", "software_engineering", "backend_engineering"],
    description:
      "前端工程面向浏览器与用户界面，涉及 HTML、CSS、JavaScript、工程化构建、性能优化与交互设计。",
    learningPaths: ["fullstack_web", "software_delivery"]
  },
  {
    id: "backend_engineering",
    name: "Backend Engineering",
    displayName: "后端工程",
    image: topicArtwork.backend_engineering,
    accentColor: "#FDBA74",
    level: "应用开发",
    tags: ["开发", "服务端"],
    connections: ["programming_basics", "computer_networks", "operating_systems", "database_systems", "software_engineering", "distributed_systems", "cyber_security"],
    description:
      "后端工程围绕 API、业务逻辑、数据存储、权限控制和高并发处理展开，是支撑 B/S 系统长期运行的关键部分。",
    learningPaths: ["fullstack_web", "systems_architecture", "software_delivery", "data_intelligence"]
  },
  {
    id: "distributed_systems",
    name: "Distributed Systems",
    displayName: "分布式系统",
    image: topicArtwork.distributed_systems,
    accentColor: "#93C5FD",
    level: "进阶专题",
    tags: ["系统", "架构"],
    connections: ["algorithms", "computer_architecture", "operating_systems", "computer_networks", "database_systems", "backend_engineering", "cyber_security"],
    description:
      "分布式系统研究多个节点如何协同工作，核心问题包括一致性、容错、扩展性、负载均衡与服务治理。",
    learningPaths: ["systems_architecture", "data_intelligence"]
  },
  {
    id: "artificial_intelligence",
    name: "Artificial Intelligence",
    displayName: "人工智能基础",
    image: topicArtwork.artificial_intelligence,
    accentColor: "#DDD6FE",
    level: "进阶专题",
    tags: ["智能", "数据"],
    connections: ["data_structures", "algorithms", "database_systems"],
    description:
      "人工智能基础聚焦机器学习、模型训练、特征表示与推理流程，强调数学方法与工程落地的结合。",
    learningPaths: ["data_intelligence"]
  },
  {
    id: "cyber_security",
    name: "Cyber Security",
    displayName: "网络与系统安全",
    image: topicArtwork.cyber_security,
    accentColor: "#FCA5A5",
    level: "进阶专题",
    tags: ["安全", "系统"],
    connections: ["algorithms", "operating_systems", "computer_networks", "software_engineering", "backend_engineering", "distributed_systems"],
    description:
      "网络与系统安全关注身份认证、权限控制、漏洞利用、防御策略和安全治理，是构建可靠系统不可忽视的一环。",
    learningPaths: ["fullstack_web", "systems_architecture", "software_delivery"]
  }
];

const learningPaths = [
  {
    id: "cs_foundation",
    title: "计算机科学基础路线",
    difficulty: "适合大一到大二建立完整学科框架",
    image: pathArtwork.cs_foundation,
    accentColor: "#7DD3FC",
    stage: 1,
    topics: [
      "programming_basics",
      "data_structures",
      "algorithms",
      "computer_architecture",
      "operating_systems",
      "computer_networks",
      "database_systems"
    ],
    description:
      "这条路线适合系统搭建学科基础，从编程能力、算法思维到底层系统原理，形成完整的计算机核心知识骨架。"
  },
  {
    id: "fullstack_web",
    title: "Web 全栈开发路线",
    difficulty: "适合想做网站、平台和在线系统的学习者",
    image: pathArtwork.fullstack_web,
    accentColor: "#C4B5FD",
    stage: 2,
    topics: [
      "programming_basics",
      "computer_networks",
      "database_systems",
      "software_engineering",
      "frontend_engineering",
      "backend_engineering",
      "cyber_security"
    ],
    description:
      "全栈路线强调从浏览器界面到服务端接口的完整闭环，适合项目驱动学习和 B/S 系统实战开发。"
  },
  {
    id: "systems_architecture",
    title: "系统与架构路线",
    difficulty: "适合希望走底层系统、平台架构方向的学习者",
    image: pathArtwork.systems_architecture,
    accentColor: "#5EEAD4",
    stage: 3,
    topics: [
      "algorithms",
      "computer_architecture",
      "operating_systems",
      "computer_networks",
      "backend_engineering",
      "distributed_systems",
      "cyber_security"
    ],
    description:
      "该路线面向系统能力提升，重点理解服务如何运行、如何扩展以及如何在复杂环境下保持稳定与安全。"
  },
  {
    id: "data_intelligence",
    title: "数据与智能路线",
    difficulty: "适合对数据平台、智能应用和模型工程感兴趣的学习者",
    image: pathArtwork.data_intelligence,
    accentColor: "#86EFAC",
    stage: 3,
    topics: [
      "data_structures",
      "algorithms",
      "database_systems",
      "backend_engineering",
      "distributed_systems",
      "artificial_intelligence"
    ],
    description:
      "数据与智能路线把算法、数据库、后端服务和 AI 能力串联起来，适合构建数据驱动型应用。"
  },
  {
    id: "software_delivery",
    title: "软件工程实战路线",
    difficulty: "适合希望把课程知识转化为交付能力的学习者",
    image: pathArtwork.software_delivery,
    accentColor: "#FDBA74",
    stage: 2,
    topics: [
      "programming_basics",
      "operating_systems",
      "database_systems",
      "software_engineering",
      "frontend_engineering",
      "backend_engineering",
      "cyber_security"
    ],
    description:
      "该路线强调工程实践，关注需求、开发、测试、部署和安全，让知识图谱最终落到可交付项目上。"
  }
];

const topicTags = ["全部主题", "基础", "算法", "系统", "开发", "数据", "智能", "安全", "工程"];
const learningStages = ["全部路线", "阶段 1", "阶段 2", "阶段 3"];

module.exports = {
  graphData: {
    topics,
    learningPaths,
    topicTags,
    learningStages
  }
};
