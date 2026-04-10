export const diagrams = {
    systemArchitecture: `graph TB
    subgraph Consumers["Agent Consumers"]
        COPILOT["VS Code Copilot\\nAgent Mode"]
        CLAUDE["Claude Code\\nCLAUDE.md"]
        SHIFT["shift Loop\\nafk.sh · once.sh"]
    end

    subgraph Core["Core Configuration"]
        GLOBAL["global.instructions.md\\n35+ Rules · Git · Handoff"]
        CLAUDE_BASE["CLAUDE.base.md\\nContext Router"]
        SETTINGS["settings.json\\n145+ Settings"]
    end

    subgraph Detection["Context Detection"]
        DETECT["detect-context.sh\\n11 File Signatures"]
        CD_HOOK["cd() Override\\nAuto-Triggers Detection"]
        CONTEXTS["ACTIVE_CONTEXTS\\nComma-Separated Export"]
    end

    subgraph Instructions["Stack Instructions"]
        NEXTJS["nextjs.instructions.md"]
        PHP["php.instructions.md"]
        SANITY["sanity.instructions.md"]
        CSS["css.instructions.md"]
        SENTRY["sentry.instructions.md"]
        GDOCS["google-docs.instructions.md"]
    end

    subgraph Skills["12 Skills"]
        PIPELINE_SKILLS["Pipeline Skills\\ngrill-me → write-a-prd →\\nprd-to-issues → do-work"]
        ANALYSIS["Analysis Skills\\nexplore · research\\ncodebase-audit"]
        DEV["Dev Skills\\ntdd · systematic-debugging\\nimprove-architecture"]
        META["Meta Skills\\nskill-scaffolder\\ntechnical-fellow"]
    end

    subgraph Security["Security Model"]
        AGENT_SHELL["agent-shell.sh\\nenv -i Sanitized Shell"]
        SECRETS["run-with-secrets.sh\\nProcess-Scoped Injection"]
        VALIDATE["validate-env.sh\\nHardening Checks"]
        DENY["Claude Deny Rules\\nFile System Boundaries"]
    end

    subgraph Bootstrap["Bootstrap"]
        BOOT["bootstrap.sh\\n7-Step Idempotent Setup"]
        SUPPLY["Supply Chain Protection\\nnpm min-release-age=7\\nuv exclude-newer"]
    end

    Consumers --> Core
    CLAUDE_BASE --> Detection
    CD_HOOK --> DETECT
    DETECT --> CONTEXTS
    CONTEXTS --> CLAUDE_BASE
    CLAUDE_BASE --> Instructions
    CLAUDE_BASE --> Skills
    Core --> Security
    BOOT --> Core
    BOOT --> Security
    BOOT --> SUPPLY`,

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
        SLICES["prd-to-issues\\nVertical Slices"]
        AFK_TAG["AFK Issues\\nAgent Can Ship Alone"]
        HITL_TAG["HITL Issues\\nHuman Must Review"]
        QA["QA Issue\\nAlways Last"]
    end

    subgraph Phase4["Phase 4: Execution"]
        TECH["technical-fellow\\nPlan · No Code"]
        DOWORK["do-work\\nImplement · Validate · Commit"]
        SHIFT_LOOP["shift/afk.sh\\nPick → Implement →\\nCommit → Close → Repeat"]
    end

    subgraph Phase5["Phase 5: Learning"]
        SELF_LEARN["Skill Self-Learning\\nUpdate SKILL.md Inline"]
        KAIZEN["Kaizen Loop\\nEvaluate → Fix → Persist"]
    end

    IDEA --> GRILL
    GRILL --> PRD
    PRD --> ISSUE
    ISSUE --> SLICES
    SLICES --> AFK_TAG
    SLICES --> HITL_TAG
    SLICES --> QA
    AFK_TAG --> SHIFT_LOOP
    HITL_TAG --> DOWORK
    DOWORK --> SELF_LEARN
    SHIFT_LOOP --> SELF_LEARN
    SELF_LEARN --> KAIZEN
    TECH -.->|"Plans Only"| SLICES`,

    shiftLoop: `flowchart TD
    START["shift/afk.sh\\nmax_iterations=5"] --> LOCK{"Lockfile\\nCheck"}

    LOCK -->|"Already Running"| ABORT["Exit — PID Active"]
    LOCK -->|"Free"| WRITE_LOCK["Write PID to\\n/tmp/shift-afk.lock"]

    WRITE_LOCK --> FETCH["gh issue list --state open\\nFetch Backlog as JSON"]

    FETCH --> SANITIZE["Sanitize Issues\\nEscape XML Tags\\nPrevent Prompt Injection"]

    SANITIZE --> INJECT["Inject into Prompt\\n+ Previous 5 Commits\\n+ prompt.md"]

    INJECT --> DOCKER["docker sandbox run claude\\n--print --output-format stream-json"]

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

    DETECT --> Signatures
    Signatures --> EXPORT["export ACTIVE_CONTEXTS=\\ngeneral,nextjs,node,typescript"]

    EXPORT --> CLAUDE_MD["CLAUDE.base.md\\nReads $ACTIVE_CONTEXTS"]

    CLAUDE_MD --> LOAD{"Load Only\\nMatching Instructions"}

    LOAD -->|"nextjs detected"| NEXT["nextjs.instructions.md\\nReact 19 · use cache ·\\nServer Actions"]
    LOAD -->|"php detected"| PHP_INST["php.instructions.md\\nPHP 8.4 · Strict Types"]
    LOAD -->|"sanity detected"| SANITY_INST["sanity.instructions.md\\nGROQ · Visual Editing"]
    LOAD -->|"Task: CSS"| CSS_INST["css.instructions.md\\nNesting · Container Queries"]
    LOAD -->|"Task: Sentry"| SENTRY_INST["sentry.instructions.md\\nMCP · Error Triage"]
    LOAD -->|"Task: Google"| GDOCS_INST["google-docs.instructions.md\\nSheets · Drives API"]

    subgraph Result["What the Agent Sees"]
        direction TB
        R1["global.instructions.md\\nAlways Loaded"]
        R2["Stack-specific rules\\nOnly if detected"]
        R3["Task-specific rules\\nOnly if triggered"]
        R4["Skills auto-discovered\\nvia ~/.claude/skills symlink"]
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
} as const

export type DiagramKey = keyof typeof diagrams
