export const diagrams = {
    systemArchitecture: `graph TB
    subgraph Consumers["Agent Consumers"]
        COPILOT["VS Code Copilot\\nAgent Mode"]
        CLAUDE["Claude Code\\nCLAUDE.md"]
        SHIFT["shft Loop\\nafk.sh · once.sh"]
    end

    subgraph Core["Core Configuration"]
        GLOBAL["global.instructions.md\\n35+ Rules · Git · Handoff"]
        CLAUDE_BASE["CLAUDE.base.md\\nContext Router"]
        SETTINGS["settings.json\\n145+ Settings"]
    end

    subgraph Detection["Context & Client Detection"]
        DETECT["detect-context.sh\\n11 File Signatures"]
        CLIENT["detect-client.sh\\nPath-Based Client Matching"]
        CD_HOOK["cd() Override\\nAuto-Triggers Detection"]
        CONTEXTS["ACTIVE_CONTEXTS\\nComma-Separated Export"]
    end

    subgraph Instructions["11 Stack Instructions"]
        NEXTJS["nextjs · php · sanity"]
        CSS_INST["css · sentry · google-docs"]
        UX_INST["ux-prototyping · handoff"]
        LOCAL["copywriting · learnings"]
    end

    subgraph Skills["43 Skills"]
        PIPELINE_SKILLS["Pipeline\ngrill-me → write-a-prd →\nprd-to-issues → do-work"]
        ANALYSIS["Analysis\nexplore · research ·\ncodebase-audit · code-review"]
        DEV["Development\ntdd · systematic-debugging ·\nimprove-architecture · architect"]
        META["Meta\nskill-scaffolder · document ·\ncompliance-audit · stress-test"]
        UX["UX Design (24 skills)\nsketch-the-solution →\n7-phase design process"]
    end

    subgraph Security["Security Model"]
        AGENT_SHELL["agent-shell.sh\\nenv -i Sanitized Shell"]
        SECRETS["run-with-secrets.sh\\nProcess-Scoped Injection"]
        VALIDATE["validate-env.sh\\nHardening Checks"]
        DENY["Claude Deny Rules\\nFile System Boundaries"]
    end

    subgraph Hooks["Lifecycle Hooks"]
        SECRET_GUARD["secret-guard.sh\\nBlock Credential Leaks"]
        MIGRATION_GUARD["migration-guard.sh\\nBlock Non-Test Migrations"]
        FORMAT["format-check.sh\\nAuto-Format on Exit"]
        TYPECHECK_HOOK["typecheck.sh\\ntsc --noEmit"]
        COMPACTION["compaction-guard.sh\\nForce Handoff Protocol"]
    end

    subgraph HUD["Compliance HUD"]
        DAEMON["hud-daemon.js\\nWebSocket :7822 · HTTP :7823"]
        TRANSPORT["3-Tier Transport\\nPipe · HTTP · JSONL"]
        DASH["Real-Time Dashboard\\nCompliance Rate · Events"]
    end

    Consumers --> Core
    CLAUDE_BASE --> Detection
    CD_HOOK --> DETECT
    CD_HOOK --> CLIENT
    DETECT --> CONTEXTS
    CONTEXTS --> CLAUDE_BASE
    CLAUDE_BASE --> Instructions
    CLAUDE_BASE --> Skills
    Core --> Security
    Hooks --> HUD
    Consumers -.-> Hooks`,

    pipeline: `graph LR
    subgraph Phase1["Phase 1: Extraction"]
        IDEA["Rough Idea"]
        GRILL["grill-me\\nSocratic Interview\\nOne Question at a Time"]
    end

    subgraph Phase2["Phase 2: Specification"]
        PRD["write-a-prd\\nProblem · Modules ·\\nInterfaces · Test Boundaries"]
        ISSUE["GitHub Issue\\nFull PRD as Body"]
    end

    subgraph Phase3["Phase 3: Planning"]
        ARCH["architect\\nVertical Slices ·\\nModule Boundaries"]
        SLICES["prd-to-issues\\nIssue Creation"]
        AFK_TAG["AFK Issues\\nAgent Ships Alone"]
        HITL_TAG["HITL Issues\\nHuman Reviews"]
        QA["QA Issue\\nAlways Last"]
    end

    subgraph Phase4["Phase 4: Execution"]
        DOWORK["do-work\\nImplement · Validate · Commit"]
        SHIFT_LOOP["shft/afk.sh\\nPick → Implement →\\nCommit → Close → Repeat"]
    end

    subgraph Phase5["Phase 5: Quality"]
        COMPLIANCE["compliance-audit\\nDiff vs Active Rules"]
        REVIEW["code-review\\nStaged Changes Review"]
        SELF_LEARN["Skill Self-Learning\\nUpdate SKILL.md Inline"]
    end

    IDEA --> GRILL
    GRILL --> PRD
    PRD --> ISSUE
    ISSUE --> ARCH
    ARCH --> SLICES
    SLICES --> AFK_TAG
    SLICES --> HITL_TAG
    SLICES --> QA
    AFK_TAG --> SHIFT_LOOP
    HITL_TAG --> DOWORK
    DOWORK --> COMPLIANCE
    SHIFT_LOOP --> COMPLIANCE
    COMPLIANCE --> REVIEW
    REVIEW --> SELF_LEARN`,

    shiftLoop: `flowchart TD
    START["shft/afk.sh\\nmax_iterations=5"] --> LOCK{"Lockfile\\nCheck"}

    LOCK -->|"Already Running"| ABORT["Exit — PID Active"]
    LOCK -->|"Free"| WRITE_LOCK["Write PID to\\n/tmp/shift-afk.lock"]

    WRITE_LOCK --> FETCH["gh issue list --state open\\nFetch Backlog as JSON"]

    FETCH --> SANITIZE["Sanitize Issues\\nEscape XML Tags\\nPrevent Prompt Injection"]

    SANITIZE --> INJECT["Inject into Prompt\\n+ Previous 5 Commits\\n+ prompt.md"]

    INJECT --> DOCKER["docker sandbox run claude\\nCredentials Rotate Per Session\\n--output-format stream-json"]

    DOCKER --> CHECK{"Output Contains\\nNO MORE TASKS?"}

    CHECK -->|"Yes"| DONE["Exit — Backlog Empty"]
    CHECK -->|"No"| INCREMENT{"Iteration\\n< Max?"}

    INCREMENT -->|"Yes"| FETCH
    INCREMENT -->|"No"| MAX["Exit — Max Iterations"]

    subgraph PromptPriority["prompt.md — Task Priority"]
        direction TB
        P1["1. Critical Bugfixes"]
        P2["2. Dev Infrastructure"]
        P3["3. Tracer Bullets"]
        P4["4. Polish & Quick Wins"]
        P5["5. Refactors"]
        P1 --> P2 --> P3 --> P4 --> P5
    end

    subgraph PerIteration["Per Iteration"]
        direction TB
        ASSIGN["gh issue edit --add-assignee @me"]
        SKILL_LOAD["Load Relevant SKILL.md"]
        IMPLEMENT["Implement Task"]
        FEEDBACK["Run Feedback Loops\\ntsc · lint · test"]
        COMMIT["Git Commit + Close Issue"]
        ASSIGN --> SKILL_LOAD --> IMPLEMENT --> FEEDBACK --> COMMIT
    end

    DOCKER -.-> PerIteration
    INJECT -.-> PromptPriority`,

    progressiveDisclosure: `flowchart TD
    subgraph Shell["Shell Integration"]
        BASHRC["~/.bashrc\\nload-secrets.sh sourced"]
        CD["cd() Override\\nHooked by bootstrap.sh"]
    end

    CD --> DETECT["detect-context.sh"]
    CD --> CLIENT_DETECT["detect-client.sh\\nPath-Based Matching"]

    subgraph Signatures["11 File Signatures"]
        direction TB
        S1["next.config.{ts,js,mjs}\\n→ nextjs"]
        S2["package.json + react-native\\n→ react-native"]
        S3["package.json + react\\n→ react"]
        S4["package.json\\n→ node"]
        S5["tsconfig.json\\n→ typescript"]
        S6["composer.json\\n→ php"]
        S7["sanity.config.{ts,js,mjs,mts}\\n→ sanity"]
        S8["prisma/schema.prisma\\n→ prisma"]
        S9["Dockerfile · compose.yaml\\n→ docker"]
        S10["requirements.txt · pyproject.toml\\n→ python"]
        S11["artisan\\n→ laravel"]
    end

    subgraph ClientDetection["Client Detection"]
        direction TB
        PATH["~/dev/clients/<name>/\\n→ Match Client"]
        CLIENT_INSTR["client.instructions.md\\nBrand · Voice · NAP"]
        PROJECT_INSTR["project.instructions.md\\nStack · Architecture"]
        PATH --> CLIENT_INSTR
        PATH --> PROJECT_INSTR
    end

    DETECT --> Signatures
    CLIENT_DETECT --> ClientDetection
    Signatures --> EXPORT["export ACTIVE_CONTEXTS=\\ngeneral,nextjs,node,typescript"]

    EXPORT --> CLAUDE_MD["CLAUDE.base.md\\nReads \\$ACTIVE_CONTEXTS"]
    ClientDetection --> CLAUDE_MD

    CLAUDE_MD --> LOAD{"Load Only\\nMatching Instructions"}

    LOAD -->|"nextjs detected"| NEXT["nextjs.instructions.md\\nReact 19 · use cache ·\\nServer Actions"]
    LOAD -->|"php detected"| PHP_INST["php.instructions.md\\nPHP 8.4 · Strict Types"]
    LOAD -->|"sanity detected"| SANITY_INST["sanity.instructions.md\\nGROQ · Visual Editing"]
    LOAD -->|"Task: CSS"| CSS_LOAD["css.instructions.md\\nNesting · Container Queries"]
    LOAD -->|"Task: Sentry"| SENTRY_INST["sentry.instructions.md\\nMCP · Error Triage"]
    LOAD -->|"Client matched"| CLIENT_LOADED["client.instructions.md\\nBrand Voice · NAP Data"]

    subgraph Result["What the Agent Sees"]
        direction TB
        R1["global.instructions.md\\nAlways Loaded"]
        R2["Stack-specific rules\\nOnly if detected"]
        R3["Task-specific rules\\nOnly if triggered"]
        R4["Client-specific rules\\nOnly if path matches"]
        R5["Skills auto-discovered\\nvia ~/.claude/skills symlink"]
    end

    LOAD --> Result`,

    securityModel: `graph TB
    subgraph Tier1["Tier 1: Shell Config"]
        ENV_AGENT[".env.agent\\nNon-Sensitive Config\\nGITHUB_USERNAME\\nPYTHONUTF8\\nGCP paths"]
        LOAD["load-secrets.sh\\nSourced in .bashrc\\nAlways Available"]
    end

    subgraph Tier2["Tier 2: Process-Scoped Secrets"]
        ENV_SECRETS[".env.secrets\\nAPI Keys · Tokens\\nNever Sourced Globally"]
        RUN["run-with-secrets.sh"]
        INJECT["set -a → source → set +a\\nexec replaces shell\\nSecrets in child ONLY"]
        VANISH["Process Exits →\\nSecrets Gone"]
    end

    subgraph Tier3["Tier 3: Agent Deny Rules"]
        DENY["~/.claude/settings.json\\nDeny file system paths"]
        AGENT_SH["agent-shell.sh"]
        ENV_I["env -i\\nStrip ALL Env Vars"]
        ALLOW["Re-inject ONLY:\\nHOME · PATH · USER\\nTERM · SHELL · LANG"]
    end

    subgraph Validation["Validation Layer"]
        VALIDATE["validate-env.sh"]
        MUST_SET["MUST be set:\\nPYTHONUTF8\\nGITHUB_USERNAME"]
        MUST_NOT["MUST NOT be set:\\nOPENAI_API_KEY\\nGITHUB_TOKEN\\nANTHROPIC_API_KEY\\nGITHUB_PACKAGE_REGISTRY_TOKEN"]
        FILES_CHECK["Files must exist:\\nCLAUDE.md · skills symlink\\n.env.agent · .env.secrets"]
    end

    subgraph Supply["Supply Chain"]
        NPM["~/.npmrc\\nmin-release-age=7"]
        UV["~/.config/uv/uv.toml\\nexclude-newer = 7 days"]
    end

    ENV_AGENT --> LOAD
    ENV_SECRETS --> RUN
    RUN --> INJECT
    INJECT --> VANISH
    AGENT_SH --> ENV_I
    ENV_I --> ALLOW
    VALIDATE --> MUST_SET
    VALIDATE --> MUST_NOT
    VALIDATE --> FILES_CHECK
    Supply -.->|"bootstrap.sh"| Tier1`,

    systematicDebugging: `flowchart TD
    BUG["Bug / Test Failure /\\nUnexpected Behavior"] --> PHASE1

    subgraph PHASE1["Phase 1: Root Cause Investigation"]
        direction TB
        READ["Read Error Messages\\nFull Stack Traces"]
        REPRO["Reproduce Reliably\\nMinimal Case"]
        CHANGES["Check Recent Changes\\ngit log · git diff"]
        DIAG["Diagnostic Instrumentation\\nNot Guessing"]
        READ --> REPRO --> CHANGES --> DIAG
    end

    PHASE1 --> IRON_LAW{"THE IRON LAW\\nDo You Understand\\nRoot Cause?"}

    IRON_LAW -->|"No"| PHASE1
    IRON_LAW -->|"Yes"| PHASE2

    subgraph PHASE2["Phase 2: Hypothesis Formation"]
        direction TB
        HYPO["Single, Testable Hypothesis"]
        PREDICT["Predict Observable Outcome"]
        HYPO --> PREDICT
    end

    PHASE2 --> PHASE3

    subgraph PHASE3["Phase 3: Targeted Fix"]
        direction TB
        MINIMAL["Minimal Change\\nOne Thing at a Time"]
        STRIKE{"3 Fixes Failed?"}
        MINIMAL --> STRIKE
        STRIKE -->|"Yes"| ARCH["STOP — Architectural Problem\\nRevisit Design"]
        STRIKE -->|"No"| APPLY["Apply Fix"]
    end

    PHASE3 --> PHASE4

    subgraph PHASE4["Phase 4: Verification"]
        direction TB
        TEST_PASS["Original Bug Fixed"]
        NO_REGRESS["No Regressions"]
        FEEDBACK_LOOPS["Run All Feedback Loops\\ntsc · lint · test"]
        TEST_PASS --> NO_REGRESS --> FEEDBACK_LOOPS
    end

    subgraph PressureTests["Adversarial Pressure Tests"]
        direction TB
        PT1["Scenario 1: \\$15k/min Production Loss\\nFollow process or skip to fix?"]
        PT2["Scenario 2: Sunk Cost + Exhaustion\\n8 hours in — stay systematic?"]
        PT3["Scenario 3: Senior Engineer Says\\nJust deploy the workaround"]
        ANSWER["Correct Answer: Always\\nFollow The Process"]
        PT1 --> ANSWER
        PT2 --> ANSWER
        PT3 --> ANSWER
    end

    PHASE4 -.->|"Anti-Rationalization"| PressureTests`,

    hudArchitecture: `graph TB
    subgraph Producers["Event Producers"]
        CLAUDE_WRAP["ctrlshft-claude\\nStdout Parser"]
        CONTEXT_HOOK["detect-context.sh\\ncd() Hook Events"]
        CLIENT_HOOK["detect-client.sh\\nPath Matching"]
        HOOKS_PROD["Lifecycle Hooks\\nhud-session.sh · hud-reads.sh"]
        AFK_PROD["shft/afk.sh\\nLoop Events"]
    end

    subgraph Transport["3-Tier Transport"]
        PIPE["Named Pipe\\nhud.pipe · <1ms"]
        HTTP["HTTP POST\\n:7823/api/event · ~5ms"]
        JSONL["JSONL File\\nevents.jsonl · Fallback"]
    end

    subgraph Daemon["hud-daemon.js · Zero Dependencies"]
        WS["WebSocket Server\\n:7822"]
        API["HTTP API\\n:7823"]
        MEMORY["In-Memory Buffers\\nSessions · Events"]
        INVENTORY["File Inventory\\nSkills · Rules · Agents"]
    end

    subgraph UI["HUD Frontend"]
        DASHBOARD["hud/index.html\\nDark Theme · Real-Time"]
        TABS["Project Tabs\\nPer-Project Sessions"]
        COMPLIANCE_RATE["Compliance Rate\\n70/30 Weighted Average"]
        FILES["File Inventory\\nSidebar"]
    end

    Producers --> Transport
    PIPE --> Daemon
    HTTP --> Daemon
    JSONL --> Daemon
    WS --> UI
    API --> UI`,

    hooksPipeline: `flowchart TD
    SESSION["Agent Session Starts"] --> SESSION_HOOK["hud-session.sh\\nSessionStart → HUD"]

    SESSION_HOOK --> WORK["Agent Works on Task"]

    WORK --> TOOL{"Agent Runs\\na Command?"}

    TOOL -->|"Bash cmd"| SECRET["secret-guard.sh\\nBlocks: echo \\$TOKEN\\nenv · printenv · cat secrets/"]
    TOOL -->|"Migration"| MIGRATE["migration-guard.sh\\nBlocks Non-Test\\nDatabase Migrations"]
    TOOL -->|"Read file"| READS["hud-reads.sh\\nTracks Dotfiles Reads → HUD"]
    TOOL -->|"Other"| CONTINUE["Continue"]

    SECRET -->|"Exit 0"| CONTINUE
    SECRET -->|"Exit 2"| BLOCKED["Command Blocked"]
    MIGRATE -->|"Exit 0"| CONTINUE
    MIGRATE -->|"Exit 2"| BLOCKED

    CONTINUE --> STOP{"Session\\nEnding?"}

    STOP -->|"Yes"| FORMAT["format-check.sh\\nBiome · Prettier · ESLint\\nAuto-Format Modified Files"]
    FORMAT --> TYPECHECK_POST["typecheck.sh\\ntsc --noEmit\\nBlocks Until Types Pass"]
    TYPECHECK_POST --> SESSION_END["hud-session.sh\\nStop Event → HUD"]

    STOP -->|"No"| WORK

    COMPACT{"Context ~95%?"} --> COMPACTION["compaction-guard.sh\\nBlocks Auto-Compaction\\nForces Handoff Protocol"]
    COMPACTION --> HANDOFF["Write Plan to working/\\nProvide Pickup Command"]`,

    uxDesignProcess: `flowchart TD
    subgraph Phase1["Phase 1: User Stories"]
        GOALS["identify-goals\\nGoals per user type"]
        STORIES["write-user-story\\nPain-state narratives"]
        TERMS["highlight-key-terms\\nExtract entities + actions"]
        GOALS --> STORIES --> TERMS
    end

    subgraph Phase2["Phase 2: System Map"]
        SYSTEM["create-system-map\\nCore players + actions"]
        RELS["draw-relationships\\nEntity relationship diagram"]
        SYSTEM --> RELS
    end

    subgraph Phase3["Phase 3: Flow Diagram"]
        SCREENS["list-screens\\nDerive screen list"]
        FLOW["create-flow-diagram\\nNavigation paths"]
        VALIDATE["validate-flow\\nCross-check vs stories"]
        SCREENS --> FLOW --> VALIDATE
    end

    subgraph Phase4["Phase 4: Model Attributes"]
        ATTRS["list-attributes\\nExhaustive entity attributes"]
    end

    subgraph Phase5["Phase 5: Screen Requirements"]
        SGOALS["create-screen-goals\\n1-2 goals per screen"]
        IEI["inform-engage-invite\\nIEI framework"]
        ABC["list-screen-attributes\\nABC spec per screen"]
        SGOALS --> IEI --> ABC
    end

    subgraph Phase6["Phase 6: Interface Design"]
        INSPIRE["get-inspired\\nUI pattern research"]
        HIGH["high-level-sketches\\nComponent layouts"]
        DETAIL["detailed-sketches\\nUI controls + interactions"]
        INSPIRE --> HIGH --> DETAIL
    end

    subgraph Phase7["Phase 7: Test-Driven Design"]
        UTEST["user-testing\\nSession plan"]
        MISTAKES["six-mistakes\\nValidate against anti-patterns"]
        UTEST --> MISTAKES
    end

    ORCHESTRATOR["sketch-the-solution\\nOrchestrates all 7 phases"]

    ORCHESTRATOR --> Phase1
    Phase1 --> Phase2
    Phase2 --> Phase3
    Phase3 --> Phase4
    Phase4 --> Phase5
    Phase5 --> Phase6
    Phase6 --> Phase7`,

    codingPrinciples: `flowchart TD
    subgraph INPUT["Agent Receives Task"]
        TASK["User Request"]
    end

    subgraph P1["Principle 1: Think Before Coding"]
        AMBIG{"Ambiguous?"}
        ASK["Stop & Ask\\nPresent interpretations"]
        SIMPLE{"Simpler\\napproach?"}
        PUSH["Push back\\nwith alternative"]
    end

    subgraph P2["Principle 2: Simplicity First"]
        SCOPE{"Beyond\\nwhat was asked?"}
        CUT["Remove feature"]
        ABSTRACT{"Abstraction\\nfor single use?"}
        INLINE["Keep inline"]
        SENIOR{"Would a senior\\nsay overcomplicated?"}
        REWRITE["Simplify"]
    end

    subgraph P3["Principle 3: Surgical Changes"]
        STYLE["Match existing style\\nexactly"]
        ADJACENT{"Touching\\nadjacent code?"}
        STOP["Don't refactor"]
        TRACE{"Every line\\ntraces to request?"}
        REMOVE["Remove change"]
    end

    subgraph P4["Principle 4: Goal-Driven Execution"]
        CRITERIA["Define success criteria"]
        TEST["Write test first"]
        LOOP["Implement until\\ntests pass"]
    end

    TASK --> AMBIG
    AMBIG -->|"Yes"| ASK
    AMBIG -->|"No"| SIMPLE
    ASK --> SIMPLE
    SIMPLE -->|"Yes"| PUSH
    SIMPLE -->|"No"| SCOPE
    PUSH --> SCOPE

    SCOPE -->|"Yes"| CUT
    SCOPE -->|"No"| ABSTRACT
    CUT --> ABSTRACT
    ABSTRACT -->|"Yes"| INLINE
    ABSTRACT -->|"No"| SENIOR
    INLINE --> SENIOR
    SENIOR -->|"Yes"| REWRITE
    SENIOR -->|"No"| STYLE

    STYLE --> ADJACENT
    ADJACENT -->|"Yes"| STOP
    ADJACENT -->|"No"| TRACE
    STOP --> TRACE
    TRACE -->|"No"| REMOVE
    TRACE -->|"Yes"| CRITERIA

    CRITERIA --> TEST --> LOOP`,
} as const;

export type DiagramKey = keyof typeof diagrams;
