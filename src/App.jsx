import { useState, useEffect, useRef, createContext, useContext } from "react";

const GITHUB_USERNAME = "ritex99";
const LINKEDIN_URL    = " https://www.linkedin.com/in/jena-ritesh";
const GITHUB_URL      = `https://github.com/${GITHUB_USERNAME}`;

const ThemeCtx = createContext({ dark: true, toggle: () => {} });

const NAV_LINKS = ["About", "Projects", "Contact"];

const PROJECTS = [
  {
    title: "Neural Canvas",
    tag: "AI / Creative",
    desc: "A generative art platform leveraging diffusion models to produce unique visual pieces on demand.",
    tech: ["Python", "React", "WebGL"],
    color: "from-violet-500 to-fuchsia-500",
    github: `https://github.com/${GITHUB_USERNAME}/neural-canvas`,
    live: "https://neural-canvas.vercel.app",
  },
  {
    title: "FlowDesk",
    tag: "Productivity",
    desc: "Keyboard-first task manager with nested contexts, time blocking, and focus mode built for deep work.",
    tech: ["TypeScript", "Electron", "SQLite"],
    color: "from-cyan-500 to-blue-500",
    github: `https://github.com/${GITHUB_USERNAME}/flowdesk`,
    live: "https://flowdesk.app",
  },
  {
    title: "Terrae",
    tag: "Data Viz",
    desc: "Interactive globe mapping real-time climate data — temperature anomalies, sea-level shifts, CO₂ concentration.",
    tech: ["D3.js", "Three.js", "Node"],
    color: "from-emerald-400 to-teal-600",
    github: `https://github.com/${GITHUB_USERNAME}/terrae`,
    live: "https://terrae.vercel.app",
  },
  {
    title: "Sonique",
    tag: "Music Tech",
    desc: "Browser-based DAW with AI-assisted chord progression and melody generation for bedroom producers.",
    tech: ["Web Audio API", "TensorFlow.js", "Svelte"],
    color: "from-amber-400 to-orange-500",
    github: `https://github.com/${GITHUB_USERNAME}/sonique`,
    live: "https://sonique.io",
  },
];

// ── Shared SVGs ───────────────────────────────────────────────────────────────
const GithubIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const ExternalIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 17L17 7M17 7H7M17 7v10" />
  </svg>
);

const LinkedInIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

// ── Helpers ───────────────────────────────────────────────────────────────────
function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function useTh() {
  const { dark } = useContext(ThemeCtx);
  return {
    dark,
    bg:        dark ? "bg-[#080b14]"  : "bg-slate-50",
    bgAlt:     dark ? "bg-[#0c1020]"  : "bg-white",
    text:      dark ? "text-white"    : "text-slate-900",
    textMuted: dark ? "text-slate-400": "text-slate-500",
    border:    dark ? "border-slate-700" : "border-slate-200",
    card:      dark ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200 shadow-sm",
    inputBg:   dark ? "bg-transparent" : "bg-slate-50",
    navBg:     dark ? "bg-[#080b14]/90" : "bg-white/90",
  };
}

// ── Day / Night Toggle ────────────────────────────────────────────────────────
function ThemeToggle() {
  const { dark, toggle } = useContext(ThemeCtx);
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className={`relative w-14 h-7 rounded-full border transition-all duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer
        ${dark ? "bg-slate-800 border-slate-600" : "bg-sky-100 border-sky-200"}`}
    >
      <span className={`absolute inset-0.5 rounded-full transition-all duration-500 ${dark ? "bg-slate-700" : "bg-sky-200"}`} />
      <span className={`absolute top-1 w-5 h-5 rounded-full flex items-center justify-center text-xs shadow-md transition-all duration-500
        ${dark ? "left-1 bg-slate-900 text-yellow-300" : "left-7 bg-white text-yellow-500"}`}>
        {dark ? "🌙" : "☀️"}
      </span>
    </button>
  );
}

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar({ active }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const th = useTh();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500
      ${scrolled ? `${th.navBg} backdrop-blur-md shadow-lg ${th.dark ? "shadow-black/30" : "shadow-slate-200/80"}` : "bg-transparent"}`}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
        <span className={`font-display text-xl font-bold tracking-tight ${th.text}`}>
          <span className="text-cyan-500">&lt;</span>Ritesh<span className="text-cyan-500">/&gt;</span>
        </span>

        <ul className="hidden md:flex gap-8 flex-1 justify-center">
          {NAV_LINKS.map((l) => (
            <li key={l}>
              <button
                onClick={() => scrollTo(l)}
                className={`text-sm font-mono tracking-widest uppercase transition-colors duration-200 cursor-pointer
                  ${active === l.toLowerCase() ? "text-cyan-500" : `${th.textMuted} hover:text-cyan-400`}`}
              >
                {l}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button
            aria-label="Open menu"
            className={`md:hidden ${th.textMuted} hover:text-cyan-400 transition-colors cursor-pointer`}
            onClick={() => setOpen(!open)}
          >
            <div className={`w-5 h-0.5 bg-current mb-1.5 transition-transform origin-center ${open ? "rotate-45 translate-y-2" : ""}`} />
            <div className={`w-5 h-0.5 bg-current mb-1.5 transition-opacity ${open ? "opacity-0" : ""}`} />
            <div className={`w-5 h-0.5 bg-current transition-transform origin-center ${open ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {open && (
        <div className={`md:hidden ${th.navBg} backdrop-blur-md px-6 pb-6 flex flex-col gap-4 border-t ${th.border}`}>
          {NAV_LINKS.map((l) => (
            <button key={l} onClick={() => scrollTo(l)}
              className={`${th.textMuted} hover:text-cyan-500 font-mono text-sm uppercase tracking-widest text-left transition-colors cursor-pointer`}>
              {l}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  const [loaded, setLoaded] = useState(false);
  const th = useTh();
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 80); return () => clearTimeout(t); }, []);

  return (
    <section id="hero" className={`relative min-h-screen flex items-center justify-center overflow-hidden transition-colors duration-500 ${th.bg}`}>
      <div className={`absolute inset-0 transition-opacity duration-500 ${th.dark ? "opacity-[0.07]" : "opacity-[0.04]"}`}
        style={{
          backgroundImage: `linear-gradient(${th.dark ? "#3af0f0" : "#0891b2"} 1px, transparent 1px), linear-gradient(90deg, ${th.dark ? "#3af0f0" : "#0891b2"} 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-violet-600/10 blur-[100px] pointer-events-none" />

      <div className={`relative z-10 text-center px-6 transition-all duration-1000 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <p className="font-mono text-cyan-500 text-sm tracking-[0.3em] uppercase mb-6 animate-pulse">
          — Available for hire —
        </p>
        <h1 className={`font-display text-6xl md:text-8xl font-black leading-none mb-6 ${th.text}`}>
          Ritesh<br />
          <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">Jena</span>
        </h1>
        <p className={`text-lg md:text-xl max-w-xl mx-auto leading-relaxed mb-10 ${th.textMuted}`}>
         Web Developer with internship experience in building responsive web applications.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
            className="px-8 py-3 bg-cyan-500 text-white font-bold font-mono text-sm uppercase tracking-widest rounded-sm hover:bg-cyan-400 active:scale-95 transition-all duration-200 cursor-pointer shadow-lg shadow-cyan-500/20"
          >
            View Work
          </button>
          <button
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            className={`px-8 py-3 border font-mono text-sm uppercase tracking-widest rounded-sm hover:border-cyan-500 hover:text-cyan-500 active:scale-95 transition-all duration-200 cursor-pointer
              ${th.dark ? "border-slate-600 text-slate-300" : "border-slate-300 text-slate-600"}`}
          >
            Get in Touch
          </button>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className={`font-mono text-xs tracking-widest ${th.textMuted}`}></span>
          <div className={`w-px h-12 bg-gradient-to-b ${th.dark ? "from-slate-500" : "from-slate-400"} to-transparent`} />
        </div>
      </div>
    </section>
  );
}

// ── About ─────────────────────────────────────────────────────────────────────
function About() {
  const [ref, visible] = useScrollReveal();
  const th = useTh();
  const skills = ["React", "Tailwind CSS", "Node.js", "MySQL", "Git & GitHub", "Docker", "REST APIs", "npm", "vite", "Visual Studio Code"];

  return (
    <section id="about" className={`py-32 px-6 transition-colors duration-500 ${th.bgAlt}`}>
      <div className="max-w-6xl mx-auto">
        <div ref={ref} className={`grid md:grid-cols-2 gap-16 items-center transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          <div className="relative">
            <div className={`w-full aspect-square max-w-sm mx-auto rounded-sm overflow-hidden border ${th.border} relative transition-colors duration-500 ${th.dark ? "bg-slate-900" : "bg-slate-100"}`}>
              <svg viewBox="0 0 400 400" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient id="ag" cx="50%" cy="40%" r="60%">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.05" />
                  </radialGradient>
                </defs>
                <rect width="400" height="400" fill={th.dark ? "#0c1020" : "#f1f5f9"} />
                <rect width="400" height="400" fill="url(#ag)" />
                <ellipse cx="200" cy="155" rx="60" ry="60" fill={th.dark ? "#1e293b" : "#cbd5e1"} />
                <path d="M100 380 Q200 260 300 380 Z" fill={th.dark ? "#1e293b" : "#cbd5e1"} />
                <circle cx="200" cy="155" r="65" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeOpacity="0.4" />
              </svg>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-r-2 border-b-2 border-cyan-400/40" />
            <div className="absolute -top-4 -left-4 w-24 h-24 border-l-2 border-t-2 border-violet-400/40" />
          </div>

          <div>
            <p className="font-mono text-cyan-500 text-xs tracking-[0.3em] uppercase mb-4">About</p>
            <h2 className={`font-display text-4xl md:text-5xl font-black mb-6 leading-tight ${th.text}`}>
              Building things<br />that matter.
            </h2>
            <p className={`leading-relaxed mb-4 ${th.textMuted}`}>
              I'm a full-stack developer with 5+ years of experience turning complex problems into clean, intuitive products. I believe great software lives at the intersection of rigorous engineering and intentional design.
            </p>
            <p className={`leading-relaxed mb-8 ${th.textMuted}`}>
              When I'm not pushing pixels or wrangling APIs, you'll find me contributing to open source, sketching UI concepts, or chasing the perfect cup of filter coffee.
            </p>
            <div>
              <p className={`font-mono text-xs tracking-widest uppercase mb-4 ${th.dark ? "text-slate-500" : "text-slate-400"}`}>Tech Stack</p>
              <div className="flex flex-wrap gap-2">
                {skills.map((s) => (
                  <span key={s} className={`px-3 py-1 border font-mono text-xs rounded-sm hover:border-cyan-500/50 hover:text-cyan-500 transition-colors duration-200 cursor-default ${th.border} ${th.textMuted}`}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Project Card ──────────────────────────────────────────────────────────────
function ProjectCard({ project, index }) {
  const [ref, visible] = useScrollReveal(0.1);
  const th = useTh();

  return (
    <div
      ref={ref}
      className={`group relative border rounded-sm p-6 transition-all duration-500 overflow-hidden flex flex-col
        ${th.card}
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-0 group-hover:opacity-[0.06] transition-opacity duration-500`} />

      <div className="relative z-10 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-4">
          <span className={`font-mono text-xs px-2 py-0.5 rounded-full border bg-gradient-to-r ${project.color} bg-clip-text text-transparent ${th.border}`}>
            {project.tag}
          </span>
        </div>

        <h3 className={`font-display text-xl font-bold mb-2 group-hover:text-cyan-500 transition-colors duration-200 ${th.text}`}>
          {project.title}
        </h3>
        <p className={`text-sm leading-relaxed mb-5 flex-1 ${th.textMuted}`}>{project.desc}</p>

        <div className="flex flex-wrap gap-2 mb-5">
          {project.tech.map((t) => (
            <span key={t} className={`font-mono text-[10px] tracking-wider px-2 py-0.5 rounded border ${th.border} ${th.dark ? "text-slate-500" : "text-slate-400"}`}>{t}</span>
          ))}
        </div>

        {/* GitHub + Live buttons */}
        <div className={`flex gap-3 pt-4 border-t mt-auto ${th.border}`}>
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 px-4 py-2 rounded-sm border font-mono text-xs uppercase tracking-widest transition-all duration-200 hover:border-cyan-500 hover:text-cyan-500 active:scale-95 cursor-pointer
              ${th.dark ? "border-slate-700 text-slate-400" : "border-slate-300 text-slate-500"}`}
          >
            <GithubIcon className="w-3.5 h-3.5" />
            Code
          </a>
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-sm bg-cyan-500 text-white font-mono text-xs uppercase tracking-widest hover:bg-cyan-400 active:scale-95 transition-all duration-200 cursor-pointer shadow-md shadow-cyan-500/20"
          >
            <ExternalIcon className="w-3.5 h-3.5" />
            Live
          </a>
        </div>
      </div>
    </div>
  );
}

// ── GitHub Repo Grid ──────────────────────────────────────────────────────────
const LANG_COLORS = {
  JavaScript: "#f7df1e", TypeScript: "#3178c6", Python: "#3572A5",
  Rust: "#dea584", Go: "#00ADD8", "C++": "#f34b7d", Swift: "#ffac45",
  Kotlin: "#A97BFF", Ruby: "#701516", HTML: "#e34c26", CSS: "#563d7c",
  Vue: "#41b883", Svelte: "#ff3e00", default: "#64748b",
};

function StarIcon() {
  return <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>;
}
function ForkIcon() {
  return <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="6" cy="6" r="2" fill="currentColor" stroke="none"/><circle cx="18" cy="6" r="2" fill="currentColor" stroke="none"/><circle cx="6" cy="18" r="2" fill="currentColor" stroke="none"/><path d="M6 8v3a3 3 0 003 3h1a3 3 0 013 3v0M6 8v7"/></svg>;
}

function GitHubRepos() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ref, visible] = useScrollReveal(0.05);
  const th = useTh();

  useEffect(() => {
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=stars&per_page=6`)
      .then((r) => { if (!r.ok) throw new Error(`GitHub API ${r.status}`); return r.json(); })
      .then((d) => { setRepos(d); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, []);

  return (
    <div ref={ref} className={`mt-20 transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <GithubIcon className={`w-5 h-5 ${th.textMuted}`} />
          <h3 className={`font-display text-xl font-bold ${th.text}`}>GitHub Repositories</h3>
        </div>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-2 font-mono text-xs uppercase tracking-widest border px-3 py-1.5 rounded-sm hover:border-cyan-500 hover:text-cyan-500 active:scale-95 transition-all duration-200 cursor-pointer ${th.border} ${th.textMuted}`}
        >
          View all <ExternalIcon className="w-3 h-3" />
        </a>
      </div>

      {loading && (
        <div className="grid md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`h-36 border rounded-sm animate-pulse ${th.card}`} />
          ))}
        </div>
      )}

      {error && (
        <div className={`border rounded-sm p-8 text-center ${th.border}`}>
          <p className={`font-mono text-xs mb-2 ${th.textMuted}`}>Could not load repositories</p>
          <p className={`text-xs mb-4 ${th.dark ? "text-slate-600" : "text-slate-400"}`}>{error}</p>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer"
            className="font-mono text-xs text-cyan-500 hover:underline cursor-pointer">
            Visit GitHub profile →
          </a>
        </div>
      )}

      {!loading && !error && (
        <div className="grid md:grid-cols-3 gap-4">
          {repos.map((repo, i) => {
            const lc = LANG_COLORS[repo.language] || LANG_COLORS.default;
            return (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ animationDelay: `${i * 60}ms` }}
                className={`group flex flex-col justify-between border rounded-sm p-5 transition-all duration-300 hover:border-slate-500 active:scale-[0.98] cursor-pointer ${th.card}`}
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <span className={`font-mono text-sm font-semibold group-hover:text-cyan-500 transition-colors duration-200 truncate pr-2 ${th.text}`}>
                      {repo.name}
                    </span>
                    <ExternalIcon className={`w-4 h-4 shrink-0 group-hover:text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 ${th.dark ? "text-slate-600" : "text-slate-300"}`} />
                  </div>
                  <p className={`text-xs leading-relaxed line-clamp-2 ${th.dark ? "text-slate-500" : "text-slate-400"}`}>
                    {repo.description || "No description provided."}
                  </p>
                </div>
                <div className="flex items-center gap-4 mt-4">
                  {repo.language && (
                    <span className={`flex items-center gap-1.5 font-mono text-[10px] ${th.dark ? "text-slate-500" : "text-slate-400"}`}>
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: lc }} />
                      {repo.language}
                    </span>
                  )}
                  <span className={`flex items-center gap-1 font-mono text-[10px] ${th.dark ? "text-slate-500" : "text-slate-400"}`}>
                    <StarIcon /> {repo.stargazers_count}
                  </span>
                  <span className={`flex items-center gap-1 font-mono text-[10px] ${th.dark ? "text-slate-500" : "text-slate-400"}`}>
                    <ForkIcon /> {repo.forks_count}
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Projects ──────────────────────────────────────────────────────────────────
function Projects() {
  const [ref, visible] = useScrollReveal();
  const th = useTh();

  return (
    <section id="projects" className={`py-32 px-6 transition-colors duration-500 ${th.bg}`}>
      <div className="max-w-6xl mx-auto">
        <div ref={ref} className={`mb-16 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="font-mono text-cyan-500 text-xs tracking-[0.3em] uppercase mb-4">Projects</p>
          <h2 className={`font-display text-4xl md:text-5xl font-black ${th.text}`}>Selected Work</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {PROJECTS.map((p, i) => <ProjectCard key={p.title} project={p} index={i} />)}
        </div>
        <GitHubRepos />
      </div>
    </section>
  );
}

// ── Contact ───────────────────────────────────────────────────────────────────
function Contact() {
  const [ref, visible] = useScrollReveal();
  const th = useTh();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  const inputClass = `w-full border rounded-sm px-4 py-3 text-sm font-mono placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 ${th.inputBg} ${th.border} ${th.text}`;

  const socials = [
    {
      label: "Email", value: "jenaritesh1@gmail.com", href: "mailto:jenaritesh1@gmail.com",
      icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    },
    { label: "GitHub", value: `github.com/${GITHUB_USERNAME}`, href: GITHUB_URL, icon: <GithubIcon /> },
    { label: "LinkedIn", value: "linkedin.com/in/alexmercer", href: LINKEDIN_URL, icon: <LinkedInIcon /> },
    {
      label: "Twitter / X", value: "@ritesh_jena09", href: "https://x.com/ritesh_jena09?s=21",
      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>,
    },
  ];

  return (
    <section id="contact" className={`py-32 px-6 transition-colors duration-500 ${th.bgAlt}`}>
      <div className="max-w-6xl mx-auto">
        <div ref={ref} className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="font-mono text-cyan-500 text-xs tracking-[0.3em] uppercase mb-4">Contact</p>
          <h2 className={`font-display text-4xl md:text-5xl font-black mb-4 ${th.text}`}>Let's build<br />something great.</h2>
          <p className={`mb-12 max-w-md ${th.textMuted}`}>Have a project in mind or just want to chat? My inbox is always open.</p>

          <div className="grid md:grid-cols-2 gap-16">
            {!sent ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <input type="text" required placeholder="Your Name" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
                <input type="email" required placeholder="Email Address" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
                <textarea required rows={5} placeholder="Your message..." value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })} className={`${inputClass} resize-none`} />
                <button type="submit"
                  className="self-start px-8 py-3 bg-cyan-500 text-white font-bold font-mono text-sm uppercase tracking-widest rounded-sm hover:bg-cyan-400 active:scale-95 transition-all duration-200 cursor-pointer shadow-lg shadow-cyan-500/20">
                  Send Message →
                </button>
              </form>
            ) : (
              <div className={`flex items-center justify-center border rounded-sm p-12 ${th.dark ? "border-cyan-400/30 bg-cyan-400/5" : "border-cyan-200 bg-cyan-50"}`}>
                <div className="text-center">
                  <div className="text-4xl mb-4">✦</div>
                  <p className={`font-display text-2xl font-bold mb-2 ${th.text}`}>Message sent!</p>
                  <p className={`text-sm ${th.textMuted}`}>I'll get back to you within 24 hours.</p>
                  <button onClick={() => setSent(false)}
                    className="mt-6 font-mono text-xs text-cyan-500 hover:underline cursor-pointer">
                    Send another →
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-6 justify-center">
              {socials.map(({ label, value, href, icon }) => (
                <a key={label} href={href}
                  target={href.startsWith("mailto") ? "_self" : "_blank"}
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 group cursor-pointer">
                  <div className={`w-10 h-10 flex items-center justify-center border rounded-sm group-hover:border-cyan-500 group-hover:text-cyan-500 transition-colors duration-200 ${th.border} ${th.textMuted}`}>
                    {icon}
                  </div>
                  <div>
                    <p className={`font-mono text-xs tracking-widest uppercase ${th.dark ? "text-slate-500" : "text-slate-400"}`}>{label}</p>
                    <p className={`text-sm group-hover:text-cyan-500 transition-colors duration-200 ${th.textMuted}`}>{value}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  const th = useTh();
  return (
    <footer className={`border-t py-8 px-6 transition-colors duration-500 ${th.bg} ${th.border}`}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <span className={`font-display text-sm font-bold ${th.text}`}>
          <span className="text-cyan-500">&lt;</span>Ritesh<span className="text-cyan-500">/&gt;</span>
        </span>
        <p className={`font-mono text-xs tracking-widest ${th.dark ? "text-slate-600" : "text-slate-400"}`}>
          {new Date().getFullYear()} — Designed & built with ♥
        </p>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={`font-mono text-xs hover:text-cyan-500 transition-colors uppercase tracking-widest cursor-pointer active:scale-95 ${th.textMuted}`}
        >
          Back to top ↑
        </button>
      </div>
    </footer>
  );
}

// ── App Root ──────────────────────────────────────────────────────────────────
export default function App() {
  const [dark, setDark] = useState(true);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const sections = ["hero", "about", "projects", "contact"];
    const obs = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); }); },
      { threshold: 0.4 }
    );
    sections.forEach((id) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  return (
    <ThemeCtx.Provider value={{ dark, toggle: () => setDark((d) => !d) }}>
      <div className={`font-sans antialiased transition-colors duration-500`}>
        <Navbar active={activeSection} />
        <Hero />
        <About />
        <Projects />
        <Contact />
        <Footer />
      </div>
    </ThemeCtx.Provider>
  );
}
