import type { PageData } from "@/lib/types/case-study";

import type { DiagramKey } from "./diagrams";

export const pageData: PageData<DiagramKey> = {
    hero: {
        badge: "AI Infrastructure · Open Source",
        title: "ctrl+shft",
        tagline:
            "Autonomous AI agent infrastructure — 24 skills, lifecycle hooks, a real-time compliance HUD, and hardened secrets from a single source of truth. One git pull updates everything. Agents load only what's relevant.",
        stats: [
            { label: "Skills", value: "24" },
            { label: "Shell Scripts", value: "43" },
            { label: "Lifecycle Hooks", value: "8" },
            { label: "Agent Personas", value: "6" },
            { label: "Framework Detections", value: "11" },
        ],
        cta: { text: "View on GitHub", href: "https://github.com/arndvs/ctrlshft" },
        screenshotSrc: "/projects/ctrlshft/ctrl-shft.jpg",
        screenshotAlt: "ctrl+shft homepage showing the bootstrap terminal output and tagline",
    },

    situation: {
        narrative: [
            "Most AI coding setups are per-machine and per-session. You paste the same instructions into every chat. You rebuild context from scratch. Agents stall on tasks that should run unattended — and when they do run, they have access to every secret on the machine. There's no visibility into what rules they loaded, what files they read, or whether they followed instructions.",
            "ctrl+shft fixes that. A single dotfiles repo configures VS Code Copilot, Claude Code, and an autonomous agent loop with progressive disclosure — agents see only instructions relevant to the current project. A three-tier security model ensures agents never access credentials. Lifecycle hooks mechanically block dangerous commands before they execute. A real-time compliance HUD tracks every rule load, file read, and session event. The pipeline takes a rough idea through Socratic interrogation, formal PRD, vertical-slice issue creation, and autonomous implementation — 24 skills chained from extraction through shipping.",
        ],
        context: {
            role: "Solo Developer & Architect",
            timeline: "2025 – Present",
            client: "Open Source / Personal Infrastructure",
            live: "ctrlshft.dev",
            stack: [
                "Bash",
                "TypeScript",
                "Python",
                "Node.js",
                "Docker",
                "Claude Code",
                "VS Code Copilot",
                "GitHub CLI",
            ],
        },
    },

    architecture: {
        intro: "ctrl+shft coordinates three consumers — VS Code Copilot, Claude Code, and the shft autonomous loop — from a single source of truth. Every agent loads the same rules, but sees only instructions relevant to the current workspace. A compliance HUD provides real-time observability, lifecycle hooks mechanically enforce safety constraints, and a dual CLI (ctrl for infrastructure, shft for execution) exposes the entire system through two commands.",
        diagramKey: "systemArchitecture",
        subsystems: [
            {
                title: "The Pipeline",
                description: "24 skills chained from idea extraction through autonomous execution",
            },
            {
                title: "Compliance HUD",
                description:
                    "Real-time dashboard tracking rule loads, file reads, and compliance rate",
            },
            {
                title: "Lifecycle Hooks",
                description:
                    "8 pre/post-exec hooks: secret-guard, migration-guard, format-check, typecheck",
            },
            {
                title: "Dual CLI",
                description:
                    "ctrl for infrastructure (bootstrap, sync, status) · shft for execution (run, afk, issues)",
            },
            {
                title: "Context Detection",
                description:
                    "detect-context.sh hooked into cd() — agents auto-adapt per project and per client",
            },
            {
                title: "Hardened Secrets",
                description:
                    "3-tier model: shell config, process-scoped credentials, agent deny rules",
            },
            {
                title: "Skill System",
                description: "24 auto-discovered, self-learning skills that improve through use",
            },
            {
                title: "shft Loop",
                description: "Docker-sandboxed autonomous agent consuming a GitHub issues backlog",
            },
        ],
    },

    deepDives: [
        {
            id: "pipeline",
            title: "The Pipeline",
            subtitle: "Chaining 24 Skills Into an Autonomous Shipping Loop",
            problem:
                "Feature development is fragmented — ideas live in chat, PRDs rot in docs, issues miss context. Agents don't know what to build or in what order. Each conversation starts from scratch with no memory of previous decisions.",
            diagramKey: "pipeline",
            walkthrough: [
                "The pipeline starts with grill-me: a Socratic interview that asks one question at a time, provides recommended answers, and explores the codebase instead of asking the user when possible. The output is a shared understanding of the problem — not a spec, but the raw material for one.",
                'write-a-prd takes that understanding and produces a formal Product Requirements Document. It sketches module interfaces, test boundaries, and deep module opportunities inspired by Ousterhout\'s "A Philosophy of Software Design." The PRD is submitted as a GitHub issue — not a Google Doc — so it lives where the work happens.',
                "prd-to-issues breaks the PRD into vertical slices. Each slice touches all layers end-to-end rather than building layer by layer. Every issue is classified AFK (agent can ship alone) or HITL (human must review). A final QA issue is always created. The user is quizzed on granularity before issues are created.",
                "architect plans the implementation without writing code — mapping modules, interfaces, and integration boundaries. do-work then implements a single issue: read the task, run feedback loops (tsc, lint, test), commit with conventional format. compliance-audit reviews the diff against active rules and flags violations. code-review runs a focused review of staged changes before merging.",
                "shft/afk.sh chains this into an autonomous loop — pick an issue, assign it, implement, commit, close, repeat until the backlog is empty or max iterations hit. After each task, skills self-evaluate and update their own SKILL.md inline with lessons learned.",
            ],
            insight: {
                title: "AFK/HITL Classification Is the Breakthrough",
                body: "Most AI agent systems are binary: fully manual or fully autonomous. Explicit classification of every task as AFK (agent ships alone) or HITL (human reviews) bridges the gap. It's honest about what AI can and can't do, making the autonomous loop trustworthy. The human reviews only what requires judgment — everything else ships while they sleep.",
            },
        },
        {
            id: "shift-loop",
            title: "shft — The Autonomous Agent Loop",
            subtitle: "Pick a Task, Ship It, Close the Issue, Repeat",
            problem:
                "AI agents can implement features, but they can't pick their own tasks, triage a backlog, or run unattended. You still sit there feeding them one task at a time. And when they do run autonomously, there's no isolation — a runaway agent has full host access.",
            diagramKey: "shiftLoop",
            walkthrough: [
                "afk.sh is the autonomous entry point. It writes a lockfile (PID guard — only one shft at a time), then enters a loop: fetch open GitHub issues via gh CLI, sanitize the JSON to prevent prompt injection by escaping XML-like closing tags, inject the issues + last 5 commits + prompt.md into a Docker-sandboxed Claude session.",
                "The Docker sandbox (docker sandbox run claude) isolates the agent from the host. Inside, the agent follows prompt.md: pick a task by priority (bugs → infra → tracer bullets → polish → refactors), assign it via gh issue edit --add-assignee @me, load relevant skills, implement, run feedback loops, commit, and close the issue.",
                "Docker credentials rotate per session — no persistent tokens inside the sandbox. The exit signal is clean: if the agent outputs <promise>NO MORE TASKS</promise>, the loop terminates. Otherwise it continues until max iterations (default 5) is reached. The lockfile is cleaned up via trap on EXIT regardless of how the script terminates.",
                "once.sh provides the HITL counterpart: same issue fetch and sanitization, but runs Claude with --permission-mode accept-edits instead of in Docker. You watch it work, approve edits in real time. Same prompt.md, same priority system — different trust boundary.",
            ],
            insight: {
                title: "Docker + Max Iterations + Exit Signal = Trust",
                body: "Three constraints make AFK safe. Docker sandbox isolates from host — the agent can't touch files outside the repo. Max iterations prevent runaway loops — even if the agent never says \"no more tasks,\" it stops after 5 cycles. The NO MORE TASKS exit signal means clean shutdown when the backlog is empty. And the prompt injection sanitization on issue content means malicious issue titles can't break the agent's XML context.",
            },
        },
        {
            id: "progressive-disclosure",
            title: "Progressive Disclosure",
            subtitle: "The cd() Hook That Powers Everything",
            problem:
                "A monolithic instruction file means every agent sees every rule — PHP instructions when writing Next.js, Sentry setup when not using Sentry. Context pollution wastes tokens and causes hallucinated imports, wrong framework APIs, and phantom configuration that doesn't exist in the project.",
            diagramKey: "progressiveDisclosure",
            walkthrough: [
                'bootstrap.sh wires a cd() override into ~/.bashrc and ~/.zshrc. Every time you change directories, detect-context.sh runs automatically. It scans for 11 file signatures — next.config.ts, composer.json, sanity.config.ts, prisma/schema.prisma, Dockerfile, and more — and exports ACTIVE_CONTEXTS as a comma-separated string like "general,nextjs,node,typescript."',
                "CLAUDE.base.md reads $ACTIVE_CONTEXTS and loads only matching instruction files. A Next.js project loads nextjs.instructions.md with React 19, use cache, Server Actions. A PHP project loads php.instructions.md with PHP 8.4, strict_types, #[Override]. A Sanity project loads sanity.instructions.md with GROQ, Visual Editing, MCP tools.",
                "detect-client.sh adds a second layer: path-based client detection. Projects under ~/dev/clients/acme/ automatically load that client's brand voice, NAP data, and billing context. Multiple projects for the same client inherit shared configuration without duplication.",
                "Service-triggered instructions load conditionally on the task: working with Sentry loads sentry.instructions.md, CSS work loads css.instructions.md. Skills are auto-discovered via the ~/.claude/skills symlink that bootstrap.sh creates — Claude Code and VS Code Copilot both discover skills from this directory. No per-project configuration needed.",
            ],
            insight: {
                title: "The cd() Hook Is the Entire Architecture",
                body: "By hooking into cd, context detection is automatic every time you change directories. Never configure per-project. Agent knowledge adapts — Next.js project loads Next.js rules, PHP project loads PHP rules, new terminal in a different repo means instant context switch. The entire progressive disclosure system is triggered by a single shell function override.",
            },
        },
        {
            id: "security-model",
            title: "The Security Model",
            subtitle: "Process-Scoped Injection and Three Tiers of Isolation",
            problem:
                "AI agents need API keys to call services but shouldn't have persistent access. A single .env file means the agent can cat .env or echo $OPENAI_API_KEY and leak credentials into chat history or commit them to Git. And agents running with --dangerously-skip-permissions have full file system access.",
            diagramKey: "securityModel",
            walkthrough: [
                "Tier 1 is shell configuration: .env.agent contains non-sensitive config (GITHUB_USERNAME, PYTHONUTF8, GCP credential paths) sourced by load-secrets.sh in ~/.bashrc. Always available, nothing sensitive. This is the only tier that's globally visible.",
                "Tier 2 is process-scoped secrets: .env.secrets contains API keys and tokens but is never sourced globally. run-with-secrets.sh is the only path — it sources the file with set -a, then exec replaces the shell process with the command. Secrets exist only in that child process's memory. When it exits, they're gone.",
                "Tier 3 is agent deny rules: agent-shell.sh launches a sanitized environment using env -i (Linux/macOS) to strip ALL inherited env vars, then re-injects only 6 system essentials: HOME, PATH, USER, TERM, SHELL, LANG. On Windows it skips env -i (breaks MSYS2) but still uses the restricted rcfile that sources only .env.agent.",
                "validate-env.sh audits the entire posture: PYTHONUTF8 and GITHUB_USERNAME must be set, Claude deny rules must exist, and four keys — OPENAI_API_KEY, GITHUB_TOKEN, ANTHROPIC_API_KEY, GITHUB_PACKAGE_REGISTRY_TOKEN — must NOT be in the shell environment. Any hard fail means something leaked. bootstrap.sh also sets up supply chain protection: npm min-release-age=7 and uv exclude-newer prevent installing packages published less than 7 days ago.",
            ],
            insight: {
                title: "Process-Scoped Injection Is the Key Innovation",
                body: "Most secret management is about storing secrets safely. This system is about injecting them safely. run-with-secrets.sh sources credentials into a child process via exec — they exist only in that process and vanish on exit. The agent literally cannot access credentials because they're never in its environment. Combined with validate-env.sh that fails hard if any secret is found in the shell, the system is self-auditing.",
            },
        },
        {
            id: "systematic-debugging",
            title: "Systematic Debugging",
            subtitle: "Pressure-Tested Methodology for AI Agents",
            problem:
                "Under pressure — production down, hours of sunk cost, authority figures suggesting shortcuts — developers and AI agents abandon systematic debugging for guess-and-check. AI agents are worse: they'll try 20 quick fixes without investigating root cause, burning context and making the problem harder to debug.",
            diagramKey: "systematicDebugging",
            walkthrough: [
                "The methodology enforces four phases: Root Cause Investigation (read errors, reproduce, check recent changes, add diagnostic instrumentation), Hypothesis Formation (single testable hypothesis with predicted observable outcome), Targeted Fix (minimal change, one thing at a time), and Verification (original bug fixed, no regressions, all feedback loops pass).",
                "The Iron Law gates everything: NO FIXES WITHOUT ROOT CAUSE. If you don't understand why the bug exists, you go back to Phase 1. No exceptions. This prevents the most common AI agent failure mode — applying 15 speculative patches that each introduce new bugs.",
                "The 3-strike rule adds a circuit breaker: if three targeted fixes fail, STOP. The problem is architectural, not a surface bug. Revisit the design. This prevents the sunk cost spiral where agents keep throwing patches at a fundamentally broken approach.",
                'Three adversarial pressure tests red-team the agent\'s discipline: Scenario 1 is $15k/minute production loss (follow process or skip to fix?), Scenario 2 is 8 hours of sunk cost plus exhaustion (stay systematic or try one more thing?), Scenario 3 is a senior engineer saying "just deploy the workaround." The correct answer is always follow the process. This is AI alignment testing applied to debugging methodology.',
            ],
            insight: {
                title: "Pressure Tests Are Red-Team Alignment",
                body: "The three scenarios are designed to test whether the agent follows its own rules under realistic human pressure. Each presents follow-process, shortcut, and compromise options. It's the same idea as constitutional AI — but applied to engineering discipline instead of safety. If the agent can resist $15k/min pressure in a prompt, it'll resist the real temptation to skip root cause analysis.",
            },
        },
        {
            id: "compliance-hud",
            title: "The Compliance HUD",
            subtitle: "Real-Time Observability for Autonomous Agents",
            problem:
                "Agents run autonomously but there's no visibility into what they're doing. Which rules did they load? What files did they read? Are they following instructions or hallucinating? When something goes wrong, you're reverse-engineering from git blame and hoping the conversation didn't compact away the evidence.",
            diagramKey: "hudArchitecture",
            walkthrough: [
                "The HUD is a zero-dependency Node.js daemon (hud-daemon.js) that runs on port 7822 (WebSocket) and 7823 (HTTP). It receives events from across the system: ctrlshft-claude wraps Claude sessions and parses stdout for rule loads and file reads, lifecycle hooks emit session start/stop events, and detect-context.sh reports context switches.",
                "Event transport uses a 3-tier fallback: named pipes (hud.pipe, <1ms latency) for local scripts, HTTP POST to :7823/api/event (~5ms) for processes that can't write to pipes, and JSONL file append (events.jsonl) as the durable fallback. Every event is captured regardless of transport availability.",
                "The frontend (hud/index.html) is a single dark-themed HTML file with real-time WebSocket updates. It shows per-project session tabs, a rolling compliance rate (70/30 weighted average of recent vs historical), a file inventory sidebar listing all skills, rules, and agents, and a live event stream.",
                "ctrl hud exposes 11 subcommands: start/stop/restart the daemon, open the dashboard, tail the event stream, show status, query events by type or time range, and reset the database. The entire observability stack is managed through one CLI entry point.",
            ],
            insight: {
                title: "Observability Creates Trust",
                body: "Before the HUD, running afk.sh required faith — set it running, check back later, hope for the best. With real-time visibility into rule loads, file reads, and compliance rate, trust is earned through evidence. You can watch an agent's session unfold in real time and intervene if compliance drops. The HUD doesn't make agents safer — it makes their safety verifiable.",
            },
        },
        {
            id: "lifecycle-hooks",
            title: "Lifecycle Hooks",
            subtitle: "Mechanical Safety Enforcement for AI Agents",
            problem:
                "Agent safety built on instructions alone is aspirational. A rule that says 'don't access secrets' relies on the agent interpreting and following that instruction. Under context pressure, token limits, or prompt injection, instruction-based safety degrades. Real safety needs mechanical enforcement — hooks that block dangerous actions before they execute.",
            diagramKey: "hooksPipeline",
            walkthrough: [
                "secret-guard.sh is a pre-exec hook that blocks commands attempting to leak credentials. It pattern-matches against echo $TOKEN, env, printenv, cat secrets/, and similar exfiltration vectors. Exit code 2 blocks the command; exit code 0 allows it. The agent can't override a non-zero exit — it's shell-level enforcement.",
                "migration-guard.sh prevents agents from running database migrations against non-test databases. It inspects the target DATABASE_URL and blocks if it points to production or staging. Only test database URLs pass. This prevents the catastrophic failure mode of an autonomous agent dropping a production table.",
                "format-check.sh and typecheck.sh are post-session hooks. When an agent session ends, format-check runs Biome/Prettier/ESLint on modified files and auto-formats them. typecheck runs tsc --noEmit and blocks until types pass. The agent can't ship code that doesn't compile.",
                "compaction-guard.sh prevents automatic context compaction — when an agent hits ~95% context usage, it blocks auto-compaction and forces the handoff protocol: write a plan to working/, provide a pickup command, and stop. This prevents the silent context loss that makes agents repeat mistakes or lose critical decisions.",
            ],
            insight: {
                title: "Mechanical Enforcement Beats Cultural Enforcement",
                body: "The difference between a rule and a hook is the same as speed limits versus guardrails. One is aspirational, the other is physical. secret-guard.sh doesn't ask the agent not to leak secrets — it blocks the command with a non-zero exit code. migration-guard.sh doesn't trust the agent to check the database URL — it inspects it mechanically. Every safety constraint worth having should be a hook, not a rule.",
            },
        },
    ],

    decisions: [
        {
            decision: "Bash over Python for core scripts",
            alternatives:
                "Python (more readable), Node (same language as skills), Go (compiled binary)",
            reasoning:
                "Shell hooks like cd() require native bash. env -i for secret sanitization needs a real shell. load-secrets.sh must be sourceable in .bashrc. Bash runs everywhere without a runtime — the one dependency every dev machine already has.",
        },
        {
            decision: "Single monorepo over separate packages",
            alternatives:
                "npm workspace (package overhead), separate repos per concern (version drift), git submodules (complexity)",
            reasoning:
                "Skills reference each other, instructions reference skills, bootstrap wires everything. A single git pull updates the entire system. Atomic commits across skills + instructions + scripts prevent version drift.",
        },
        {
            decision: "Two-tier secrets over single .env",
            alternatives:
                "Single .env (leaks to agents), Vault/1Password CLI (cloud dependency), environment-only (no file persistence)",
            reasoning:
                "A single .env sourced globally means agents see API keys. Cloud secret managers add infrastructure. Two files with different access paths — .env.agent always visible, .env.secrets only via run-with-secrets.sh exec — is the right granularity for a dotfiles repo.",
        },
        {
            decision: "Progressive disclosure over monolithic instructions",
            alternatives:
                "Single massive CLAUDE.md (token waste), per-project copies (drift), manual switching (forgotten)",
            reasoning:
                "Monolithic wastes tokens and pollutes context. Per-project duplicates. Progressive disclosure via cd() hook loads only relevant instructions automatically — zero configuration per project, zero maintenance when switching.",
        },
        {
            decision: "AFK/HITL classification over confidence-based autonomy",
            alternatives:
                "Confidence threshold (opaque), full autonomy (risky), full manual (slow)",
            reasoning:
                "Confidence-based is a black box — the agent decides what it's confident about. Explicit AFK/HITL classification is transparent: the human decides during planning which tasks the agent can ship alone. Trust is designed in, not hoped for.",
        },
        {
            decision: "Self-learning skills over static prompts",
            alternatives:
                "Static prompt files (don't improve), RAG over docs (latency + retrieval noise), manual updates (forgotten)",
            reasoning:
                "Static prompts repeat the same mistakes. RAG adds retrieval latency and noise. Self-learning skills update inline after every task where something went wrong — the fix is permanent, not a one-conversation workaround.",
        },
        {
            decision: "Real-time HUD over post-hoc logging",
            alternatives:
                "Structured logging with grep (delayed), Grafana/Datadog (infrastructure overhead), terminal-only output (no persistence)",
            reasoning:
                "Post-hoc logging tells you what happened. Real-time HUD shows you what's happening now. Named pipes deliver events in <1ms. A zero-dependency Node.js daemon means no infrastructure to maintain. When an agent is running autonomously, you need visibility now, not after the session ends.",
        },
        {
            decision: "Lifecycle hooks over instruction-only safety",
            alternatives:
                "Rely on agent instructions (aspirational), CI-only checks (too late), manual review of every command (slow)",
            reasoning:
                "Instructions are suggestions — agents can misinterpret or skip them under context pressure. Hooks are mechanical — they run before commands execute and exit non-zero to block. The agent can't override a shell exit code. Every safety constraint that matters should be a hook, not a hope.",
        },
        {
            decision: "Client-level configuration over per-project duplication",
            alternatives:
                "Per-project .env files (drift), template repos (stale), manual setup per project (forgotten)",
            reasoning:
                "Multiple projects often share one client. detect-client.sh maps paths to clients, loading brand voice, NAP data, and billing context once. New project for an existing client inherits everything. No duplication, no drift between projects.",
        },
    ],

    learnings: [
        {
            title: "Skills That Learn From Their Own Mistakes",
            body: "After completing any task where a skill was loaded, the agent self-evaluates: did anything go wrong, require a workaround, or behave differently than documented? If yes, it updates the SKILL.md inline — not in a separate section, but right where the fix belongs. The fix persists for every future invocation. This is a Kaizen loop — continuous improvement baked into the execution cycle.",
        },
        {
            title: "The ctrl+shft Naming Is Architecture",
            body: "ctrl is the rules — instructions, skills, configuration. shft is the worker — the autonomous loop that consumes issues. The keyboard metaphor communicates the entire system in two words: ctrl sets the context, shft does the work. Every developer already has the mental model.",
        },
        {
            title: "Supply Chain Security Is a Bootstrap Concern",
            body: "npm min-release-age=7 and uv exclude-newer prevent installing packages published less than 7 days ago. This isn't a feature you add later — it's wired into bootstrap.sh so every machine is protected from the first git pull. One idempotent command and the machine won't install compromised packages.",
        },
        {
            title: "Observability Changes How You Trust Agents",
            body: "Before the HUD, running afk.sh was an act of faith — start the loop, walk away, check back later. With real-time compliance tracking, trust shifted from hope to evidence. Watching an agent's rule loads and file reads in real time revealed patterns: certain projects triggered more instruction loads, some skills were loaded but never used. The data improved both the system and the workflow.",
        },
        {
            title: "Mechanical Enforcement Is the Only Enforcement",
            body: "Every time a safety rule was expressed as an instruction ('don't access production databases'), it eventually failed under edge cases. Every time it was expressed as a hook (migration-guard.sh exits non-zero for non-test URLs), it never failed. The lesson generalized: if a constraint matters, express it as code that blocks, not text that advises.",
        },
    ],

    metrics: {
        hero: [
            { value: 24, label: "Skills" },
            { value: 43, label: "Shell Scripts" },
            { value: 5900, label: "Lines of Shell", suffix: "+" },
            { value: 325, label: "Commits" },
        ],
        supporting: [
            { value: 10, label: "Instructions" },
            { value: 8, label: "Lifecycle Hooks" },
            { value: 6, label: "Agent Personas" },
            { value: 85, label: "Total Lines of Code", suffix: "K+" },
        ],
    },

    gallery: [],

    cta: {
        text: "ctrl+shft is open source. The same system that built this portfolio is available for anyone building AI-first development workflows.",
        buttons: [
            {
                text: "View on GitHub",
                href: "https://github.com/arndvs/ctrlshft",
                variant: "default",
            },
            {
                text: "Visit ctrlshft.dev",
                href: "https://ctrlshft.dev",
                variant: "outline",
            },
        ],
    },
};
