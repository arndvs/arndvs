import type { PageData } from "@/lib/types/case-study";

import type { DiagramKey } from "./diagrams";

export const pageData: PageData<DiagramKey> = {
    hero: {
        badge: "Work in Progress · AI Video · Creative Technology",
        title: "PUSH",
        tagline:
            "A 5–7 minute comedy short about a man, a hangover, and a mechanical bed with no off switch — currently in pre-production. 55-shot prompt library, 17-document production package, character consistency pipeline, and a companion transmedia universe being built at riseawake.com.",
        stats: [
            { label: "AI Shots", value: "55" },
            { label: "Production Docs", value: "17" },
            { label: "Screenplay Version", value: "v7" },
            { label: "Narrative Threads", value: "3" },
            { label: "AI Video Tools", value: "5" },
        ],
        cta: {
            text: "View on GitHub",
            href: "https://github.com/arndvs/the-remote",
        },
    },

    situation: {
        narrative: [
            "Most AI video projects start with a prompt and hope for the best. Character consistency breaks between shots. There's no production design language — no prop bible, no environmental rules, no narrative structure that survives the generation process. The result is a tech demo, not a film.",
            "PUSH takes the opposite approach: production design first, generation second. The writing and research phase is building the foundation — a 55-shot prompt library with self-contained AI-ready prompts, a canonical prop bible that supersedes all other documents, a character consistency pipeline using multi-angle reference sheets, and a design memo solving the core visual challenge — how to make a queen-size adjustable bed feel like it belongs in a bathroom, a kitchen, an office, and a car without ever showing it pass through a door. AI image and video generation is the next phase.",
        ],
        context: {
            role: "Writer, Director & Creative Technologist",
            timeline: "2025 – Present (Pre-production)",
            client: "Personal Creative IP",
            live: "riseawake.com",
            stack: [
                "Sora",
                "Runway",
                "Kling",
                "Pika",
                "Seedance 2.0",
                "Nano Banana Pro",
                "Next.js",
                "Sanity v5",
            ],
        },
    },

    architecture: {
        intro: "PUSH operates as a full production system — not a collection of prompts. A document hierarchy governs what's canonical (the Prop Bible supersedes everything), a state machine defines the bed's behavior across scenes, and a speed arc calibrates the comedy timing from gentle bedroom wake-up through chaotic kitchen escape to quiet office afternoon. The production pipeline flows from screenplay through shot list to multi-tool AI generation with character consistency checks at every stage.",
        diagramKey: "productionPipeline",
        secondaryDiagramKey: "documentHierarchy",
        secondaryDiagramTitle: "Document Hierarchy — What Overrides What",
        subsystems: [
            {
                title: "Screenplay v7.0",
                description:
                    "5-act structure, 3 interwoven narrative threads, dry comedy tone that never breaks",
            },
            {
                title: "Prop Bible v4.0",
                description:
                    "Canonical physical descriptions — bed dimensions, remote specs, Marcus's colorway, all states",
            },
            {
                title: "55-Shot Prompt Library",
                description:
                    "Self-contained AI prompts with camera angles, durations, and tool-specific notes",
            },
            {
                title: "Design Memo",
                description:
                    "Seven golden rules for environmental integration — the Trash Truck problem, solved",
            },
            {
                title: "Character Consistency",
                description:
                    "Multi-angle reference sheets via Nano Banana Pro, applied through Seedance 2.0",
            },
            {
                title: "Transmedia Universe",
                description:
                    "riseawake.com — 41 pages, 22 internal docs, investor relations, legal documents, easter eggs",
            },
        ],
    },

    deepDives: [
        {
            id: "environmental-integration",
            title: "Environmental Integration",
            subtitle: "The Trash Truck Problem — Making an Impossible Object Feel Inevitable",
            problem:
                "A queen-size adjustable bed needs to appear in a bedroom, bathroom, kitchen, car, driveway, highway shoulder, office lobby, elevator, and conference room — without ever being shown passing through a door. The camera must never reveal the impossibility. The world must accept the bed completely.",
            diagramKey: "environmentIntegration",
            walkthrough: [
                "The solution draws from Trash Truck's approach to the same problem — a 10-foot garbage truck that appears in domestic spaces without anyone questioning it. Seven golden rules govern every shot. The core technique is scale ambiguity: never establish a ground-truth size relationship between the bed and the room. Wide shots show the full scene. Close shots show details. Medium shots — the ones that would force the geometry to resolve — are banned.",
                "Six golden rules govern every shot: scale ambiguity (never measure), wide-or-close framing (never medium), cut-on-action transitions (arrive already there), ambient lighting (bed takes the room's light), world acceptance (nobody reacts), and environment-first design (build the room, then fill remaining space with bed).",
                "The bed's 'costumes' add visual richness — fitted sheet, flat sheet, duvet, pillows — each with different material behavior that catches light differently. Dave's bed is a bachelor bed (navy, slightly faded, one good pillow). Marcus's is olive, warmer, more intentional. Each bed is dressed the way its owner is dressed.",
                "A track system replaces casters for ground contact that feels earned across carpet, hardwood, tile, and concrete. The track gives the bed cinematically rich low-angle shots and utilitarian believability. The rear panel houses dual electric motors, battery pack, and charge port — engineering that's visible without being complex.",
            ],
            insight: {
                title: "The geometry solves itself in the cut",
                body: "The bed never enters a room because the audience never needs to see it enter. The impossible event happens between shots. This is how stage magic works — and how Trash Truck made a garbage truck feel like a family pet. The audience doesn't measure the door because they're not thinking about the door. They're thinking about the relationship.",
            },
        },
        {
            id: "narrative-threads",
            title: "Narrative Architecture",
            subtitle: "Three Threads That Resolve Without Anyone in the Film Knowing",
            problem:
                "A 5-minute comedy short needs emotional depth beyond physical gags. The audience should leave feeling something beyond 'that was funny' — but the tone can never break from deadpan. How do you build meaning into a film where nobody acknowledges anything unusual is happening?",
            diagramKey: "narrativeThreads",
            walkthrough: [
                "Three narrative threads weave through the film, each planted in Act 1 and resolved in Act 5, and none of them are connected by any character in the film. Only the audience sees the complete picture.",
                "The Ludacris Thread: 'Move Bitch' plays on the car radio. Dave whistles along unconsciously — a song about making people move, whistled by a man being moved. The fuel gauge kills the whistle mid-phrase. At 5PM, heading for round two, Dave whistles the same phrase — unhurried, complete. The morning interrupted the song. The afternoon earned its resolution.",
                "The Napkin Thread: Marcus draws drunk diagrams at the bar. Dave rejects them. Tyler films it and sends to the group chat as mockery. Twelve hours later, stuck on the Hendricks model, Dave scrolls back and replays the video. Bar audio plays over sober office silence. 4:15PM, he's writing. 4:58PM, done. Nobody in the film connects the napkins to the solution. Marcus never finds out.",
                "The Bed Thread: Physical momentum all morning resolves into emotional stillness at 4:58PM — the bed gives a small exhale, Dave says 'Not bad,' and the epilogue repeats the exact opening. The morning that was forced becomes the morning that was chosen.",
            ],
            insight: {
                title: "The napkins mirror the bed",
                body: "Both are systems that move Dave forward without his awareness. The bed is physical momentum he didn't choose. The napkin is intellectual momentum he didn't choose. Both got the job done. Neither is acknowledged. The audience is the only witness to the complete thread.",
            },
        },
        {
            id: "character-consistency",
            title: "Character Consistency Pipeline",
            subtitle: "Solving AI Video's Hardest Problem with Reference Sheets",
            problem:
                "AI video tools generate characters that look different in every shot. Hair color shifts, clothing changes, facial features drift. A 54-shot film needs a character who looks recognizably like the same person across bedroom, bathroom, car, and office environments with different lighting conditions.",
            diagramKey: "characterConsistency",
            walkthrough: [
                "The pipeline starts with Nano Banana Pro for generating multi-angle character reference sheets — front, 3/4, side, and back views of Dave, Marcus, and Karen in their film wardrobe. These sheets establish the canonical appearance that all subsequent generation must match.",
                "T-pose reference images extracted from the character sheets provide a neutral-pose baseline that Seedance 2.0 uses as a consistency anchor. The same reference drives generation across all environments, so Dave's rumpled shirt and geometric hair remain stable whether he's in bedroom lighting or fluorescent office light.",
                "Each shot prompt in the 54-shot library includes character appearance notes that reference the canonical sheet. 'Dave — see character sheet CS-DAVE-01' rather than re-describing his appearance from scratch, reducing drift between the prompt's description and the reference image.",
                "Quality control runs three checks per generated clip: character consistency against the reference sheet, lighting match against the target environment, and motion continuity with adjacent shots in the sequence.",
            ],
            insight: {
                title: "Reference sheets are the production's source of truth",
                body: "Just as the Prop Bible is canonical for physical objects, the character sheets are canonical for human appearance. Every prompt references them rather than describing characters from scratch. Consistency is a system, not a hope.",
            },
        },
        {
            id: "transmedia-universe",
            title: "Transmedia Universe",
            subtitle: "The Film Is a Marketing Video. The Website Is the Company.",
            problem:
                "A short film exists in isolation. Without context, it's a funny video about a bed. With context — a corporate website, internal documents, investor relations, legal fine print, easter eggs — it becomes a window into a fully realized fictional world where the comedy deepens retroactively.",
            diagramKey: "transMediaUniverse",
            walkthrough: [
                "PUSH reframed from standalone comedy to in-universe RISE marketing video. The film was always a RISE promotional asset — approved by Dr. Eleanor Voss, budgeted by CFO Thomas Ellery, briefed by VP of Brand Claire Sung, legally cleared by General Counsel James Park. The deadpan tone isn't a creative choice — it's the brand voice.",
                "riseawake.com is a 41-page Next.js application operating as the real corporate website of RISE Technologies, Inc. Product pages, investor relations with dynamic financials, 6 legal documents (including a Push Mode EULA), enterprise pricing, an SDK, a careers section with real application forms, and a 12-stage activation configurator.",
                "The internal document system — 22 documents accessible because a junior developer named Arvin deployed to production without auth controls — reveals the company from the inside. Marketing playbooks, incident logs, discontinuation memos, and a resignation letter from a VP who decided she didn't want to be pushed anymore.",
                "Characters cross the boundary: Dave is 'D.K. — Analyst, 3 years' in the testimonials. Karen is 'K.M. — VP Operations.' The customer avatar in the marketing playbook shares Dave's name. James Park noticed. He chose not to examine it further.",
            ],
            insight: {
                title: "The website is the punchline the film sets up",
                body: "Someone watches PUSH and sees a funny video. They go to riseawake.com and find a real corporate website. They find /internal and discover 22 documents they shouldn't be reading. They find /legal and read a Push Mode EULA that says 'There is no confirmation dialog. There is no undo.' Each layer deepens the comedy retroactively. The film was always just the surface.",
            },
        },
        {
            id: "bed-state-machine",
            title: "Bed Behavior System",
            subtitle: "A State Machine That Drives the Comedy Timing",
            problem:
                "The bed's speed is the punchline engine. Too fast and it's slapstick. Too slow and it's boring. The comedy requires a precise arc from gentle morning confusion through frantic kitchen chaos to quiet office stillness — and the bed needs to express personality through motor pitch alone.",
            diagramKey: "bedStateMachine",
            beforeDiagramKey: "speedArc",
            beforeDiagramTitle: "Speed Arc — How Comedy Timing Maps to Bed Velocity",
            walkthrough: [
                "The bed operates as a finite state machine with states mapped to emotional registers. FLAT (dormant) → RISING (the button press) → VERTICAL (Dave's surprise) → PUSHING (the gauntlet) → IDLE_PUSH (waiting) → RETURN (going home alone). Each transition is governed by the screenplay's pacing needs.",
                "Speed is the primary comedy lever. Bedroom: slow, almost gentle — Dave is still confused. Bathroom: medium — he's adapting, still losing. Kitchen: fast — he's scrambling, the coffee scene works because he almost doesn't make it. Car: contained, expressed through sound not speed. Office: rest mode — the humor inverts, now the bed is too relaxed.",
                "The motor hum is a character. A slightly musical quality, almost like a motif. Patient, not aggressive — the bed isn't angry, it just has a job. Pitch rises with speed, falls in the afternoon. The bathroom scene escalation: 'not concern, not urgency — impatience. The sound of a machine that has a schedule and does not appreciate detours.'",
                "The self-making sequence runs in parallel — sheet tensioning during the shower, pillow inflation during the closet. The bed gets dressed while Dave gets dressed. The bed finishes first. Of course it does.",
            ],
            insight: {
                title: "The bed's hum is its only dialogue",
                body: "The bed never speaks. It communicates entirely through motor pitch — patient baseline, pointed escalation, satisfied return to normal. The audience reads these as emotions. By the end of the film, the hum is as expressive as any line of dialogue.",
            },
        },
    ],

    decisions: [
        {
            decision: "Rename from 'The Remote' to 'PUSH'",
            alternatives:
                "Keep 'The Remote' as the film title — it's the object that starts the story",
            reasoning:
                "PUSH is the idea the entire universe runs on. It's on the button, in the product name, in the Ludacris song, in what the bed does, what society does to Claire. The film title and the product name being the same word collapses the distance between them. The remote is still the remote — the prop bible doesn't change. But the film is called PUSH.",
        },
        {
            decision: "Reframe film as RISE marketing video",
            alternatives:
                "Keep as standalone comedy short — simpler to produce and pitch independently",
            reasoning:
                "Reframing unlocks the transmedia universe. The deadpan tone is now the brand voice. The drinking montage is targeting data made visible. Marcus having the same bed is a testimonial. Karen is a customer success story. The young employee writing 'beds??' in his notebook is the funniest shot because RISE included footage of confusion and decided it was good marketing.",
        },
        {
            decision: "Production design first, generation second",
            alternatives:
                "Prompt-and-iterate approach — generate footage first, build story around what works",
            reasoning:
                "AI video tools produce better results with specific, engineered prompts than with vague creative direction. A 54-shot library with camera angles, durations, character references, and lighting notes gives the AI a production brief, not a wish. The prop bible and design memo prevent the kind of drift that makes AI video feel like a tech demo.",
        },
        {
            decision: "Six golden rules for environmental integration",
            alternatives:
                "Per-scene ad hoc solutions — solve each environment independently as needed",
            reasoning:
                "Systematic rules derived from studying Trash Truck's approach to the same problem. Scale ambiguity, wide-or-close framing, cut-on-action, ambient lighting, world acceptance, and environment-first design. Codified once, applied everywhere. New environments (gas station, elevator, conference room) can be designed against the rules without reinventing the approach.",
        },
        {
            decision: "Track system instead of casters",
            alternatives:
                "Keep original caster design from prop bible — simpler, more domestic-feeling",
            reasoning:
                "Tracks provide utilitarian believability across carpet, hardwood, tile, and concrete. Cinematically richer — low-angle track shots have rhythm and texture that casters don't. The track gives the bed a vehicle quality that earns its presence outdoors. The rear panel with dual motors and battery pack creates a readable mechanical angle without being transformer-busy.",
        },
        {
            decision: "Bed as dressed character with costume designer mindset",
            alternatives: "Treat bed as a static prop — same appearance in every scene",
            reasoning:
                "Layers (fitted sheet, flat sheet, duvet, pillows) create visual richness at every camera angle. Different materials catch light differently. Dave's bachelor bed (navy, faded) tells you about Dave. Marcus's warmer olive bed tells you about Marcus. The bed stops being a white rectangle and becomes a character the camera can explore from any angle.",
        },
        {
            decision: "Ludacris licensing pending — design scene to work without it",
            alternatives:
                "Write the scene around a different, easier-to-license track from the start",
            reasoning:
                "The whistle structure works with any recognizable intro. But 'Move Bitch' — a song about making people move, whistled by a man being moved — is the specific joke. The Move campaign using 'Stand Up' creates a Ludacris-powered universe that never explains itself. Worth pursuing. Music supervisor confirmed the scene works with any pre-playing track if clearance falls through.",
        },
        {
            decision: "Three narrative threads, none acknowledged by characters",
            alternatives:
                "Explicit payoff — Marcus realizes his napkins solved the model, or Dave thanks the bed",
            reasoning:
                "The audience being the only witness to the complete picture is the point. Marcus never finds out. Dave never credits the napkin. The bed gets no acknowledgment at 4:58PM. This is funnier and more emotionally resonant than any explicit payoff because it mirrors how most real moments of unconscious help work — the person who moved you forward has no idea they did.",
        },
        {
            decision: "Claire Sung resignation letter on the website, not in the film",
            alternatives: "Add a counterpoint character in the film who rejected the bed",
            reasoning:
                "The film's comedy depends on the world accepting the bed completely. A dissenter breaks the deadpan. Claire's letter lives on riseawake.com — the audience who falls deep enough into the rabbit hole finds someone who had the bed, got everything it promised, and went to a nursery. Same product as Karen. Different human. Neither is wrong. The bed doesn't know the difference.",
        },
    ],

    learnings: [
        {
            title: "AI video needs production design, not just prompts",
            body: "The difference between a tech demo and a film is the production package behind it. Prop bibles, character sheets, environmental rules, and shot lists with technical notes transform AI generation from lottery to craft.",
        },
        {
            title: "The Trash Truck principle applies universally",
            body: "Any impossible object can feel inevitable if you control the camera. Scale ambiguity, cut-on-action, and ambient lighting solve geometry problems the audience never consciously processes.",
        },
        {
            title: "Character consistency is a system, not a hope",
            body: "Multi-angle reference sheets generated once and referenced in every prompt create a consistency baseline that manual re-prompting can never match. The reference sheet is the character's source of truth.",
        },
        {
            title: "Transmedia deepens comedy retroactively",
            body: "A funny video becomes a rabbit hole when the fictional company has a real website. Each layer of discovery — product pages, internal docs, legal fine print — recontextualizes the film. The comedy compounds.",
        },
        {
            title: "The hum is a performance",
            body: "Sound design as character voice. A motor pitch that shifts from patient to impatient to satisfied communicates more personality than any dialogue. The audience reads mechanical sounds as emotions.",
        },
        {
            title: "Document hierarchy prevents creative drift",
            body: "When the prop bible supersedes all other documents, every collaborator (human or AI) has one canonical source. Contradictions resolve to the bible. This is the same principle as ctrl+shft's source-of-truth architecture.",
        },
    ],

    metrics: {
        hero: [
            { value: 55, label: "AI Video Shots", suffix: "" },
            { value: 7, label: "Screenplay Version", prefix: "v" },
            { value: 17, label: "Production Documents", suffix: "" },
            { value: 5, label: "Act Structure", suffix: "-act" },
        ],
        supporting: [
            { value: 3, label: "Narrative Threads" },
            { value: 5, label: "AI Video Tools" },
            { value: 4, label: "Character Sheets" },
            { value: 41, label: "Transmedia Pages" },
            { value: 22, label: "Internal Documents" },
            { value: 6, label: "Legal Documents" },
            { value: 8, label: "Diagram Types" },
            { value: 19, label: "Environments" },
        ],
    },

    gallery: [],

    cta: {
        text: "PUSH is part of a transmedia universe. The companion website — riseawake.com — is a separate case study with its own architecture, design system, and 22 internal documents that were never supposed to be public.",
        buttons: [
            {
                text: "View RISE Awake Case Study",
                href: "/projects/rise-awake",
                variant: "default",
            },
            {
                text: "Visit riseawake.com",
                href: "https://riseawake.com",
                variant: "outline",
            },
            {
                text: "View on GitHub",
                href: "https://github.com/arndvs/the-remote",
                variant: "outline",
            },
        ],
    },
};
