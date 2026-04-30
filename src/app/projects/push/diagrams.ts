export const diagrams = {
    productionPipeline: `flowchart TB
        subgraph Ideation["Phase 1: Ideation"]
            SC[Screenplay v7.0]
            PB[Prop Bible v4.0]
            CB[Character Bible]
        end
        subgraph Production["Phase 2: Production Design"]
            SL[55-Shot AI Shot List]
            SB[Storyboard Handoff]
            DM[Design Memo]
            CS[Character Sheets]
        end
        subgraph Generation["Phase 3: AI Video Generation"]
            SORA[Sora]
            RW[Runway]
            KL[Kling]
            PK[Pika]
            SED[Seedance 2.0]
        end
        subgraph Post["Phase 4: Post-Production"]
            ED[Editorial Assembly]
            SND[Sound Design]
            GR[Color Grade]
            MUS[Music Licensing]
        end
        SC --> SL
        PB --> SL
        CB --> CS
        CS --> SL
        SL --> SB
        DM --> SL
        SL --> SORA & RW & KL & PK
        CS --> SED
        SORA & RW & KL & PK --> ED
        SED --> ED
        ED --> SND --> GR --> MUS
        style Ideation fill:#1a1a2e,stroke:#e07a4a,color:#fff
        style Production fill:#1a1a2e,stroke:#5ec4ad,color:#fff
        style Generation fill:#1a1a2e,stroke:#a78bfa,color:#fff
        style Post fill:#1a1a2e,stroke:#f0a050,color:#fff`,

    characterConsistency: `flowchart LR
        subgraph Method["Character Sheet Method"]
            NB[Nano Banana Pro]
            MA[Multi-Angle Sheet]
            TP[T-Pose Reference]
        end
        subgraph Outputs["Consistency Assets"]
            FR[Front View]
            S34[3/4 View]
            SD[Side View]
            BK[Back View]
        end
        subgraph Application["Applied to Generation"]
            SEED[Seedance 2.0]
            VID[Consistent Video Clips]
        end
        NB --> MA
        MA --> FR & S34 & SD & BK
        FR & S34 & SD & BK --> TP
        TP --> SEED
        SEED --> VID
        style Method fill:#1a1a2e,stroke:#e07a4a,color:#fff
        style Outputs fill:#1a1a2e,stroke:#5ec4ad,color:#fff
        style Application fill:#1a1a2e,stroke:#a78bfa,color:#fff`,

    bedStateMachine: `stateDiagram-v2
        [*] --> FLAT: Power On
        FLAT --> RISING: Button Press
        RISING --> VERTICAL: 90°+ reached
        VERTICAL --> PUSHING: Target detected
        PUSHING --> IDLE_PUSH: Obstacle cleared
        IDLE_PUSH --> PUSHING: Target moves
        PUSHING --> SELF_MAKING: Parallel process
        SELF_MAKING --> MADE: Sheet taut + pillow plumped
        IDLE_PUSH --> RETURN: Day complete
        RETURN --> FLAT: Home reached
        FLAT --> [*]

        note right of PUSHING
            Speed varies by scene:
            Bedroom = slow
            Kitchen = fast
            Office = rest mode
        end note
        note right of SELF_MAKING
            Runs parallel to Dave's routine
            Sheet tensioning during shower
            Pillow inflation during closet
        end note`,

    speedArc: `xychart-beta
        title "Bed Speed Arc Across Film"
        x-axis ["Bedroom", "Bathroom", "Closet", "Kitchen", "Driveway", "Car", "Highway", "Office AM", "Office PM", "Credits"]
        y-axis "Speed Level" 0 --> 10
        bar [2, 4, 5, 8, 6, 3, 5, 2, 1, 3]`,

    narrativeThreads: `flowchart TB
        subgraph Whistle["The Ludacris Thread"]
            W1["Car radio plays 'Move Bitch'"]
            W2["Dave whistles along — unconscious"]
            W3["Fuel gauge kills the whistle"]
            W4["5PM: Dave whistles again — complete"]
        end
        subgraph Napkin["The Napkin Thread"]
            N1["Bar: Marcus draws napkin diagrams"]
            N2["Dave rejects them"]
            N3["Tyler films & sends to group chat"]
            N4["3:45PM: Dave replays the video"]
            N5["4:15PM: Dave solves the Hendricks model"]
        end
        subgraph Bed["The Bed Thread"]
            B1["Button press — no off switch"]
            B2["Physical momentum all morning"]
            B3["Office: rest mode"]
            B4["4:58PM: bed exhales — 'Not bad'"]
            B5["Epilogue: exact repeat"]
        end
        W1 --> W2 --> W3
        W3 -.->|"Same phrase, earned"| W4
        N1 --> N2 --> N3
        N3 -.->|"12 hours later"| N4 --> N5
        B1 --> B2 --> B3 --> B4 --> B5
        N5 -.->|"Nobody connects it"| B4
        style Whistle fill:#1a1a2e,stroke:#e07a4a,color:#fff
        style Napkin fill:#1a1a2e,stroke:#5ec4ad,color:#fff
        style Bed fill:#1a1a2e,stroke:#a78bfa,color:#fff`,

    documentHierarchy: `flowchart TD
        PB["Prop Bible v4.0<br/><em>Canonical — supersedes all</em>"]
        SP["Screenplay v7.0<br/><em>Story & dialogue</em>"]
        SL["Shot List<br/><em>55 AI-ready prompts</em>"]
        DM["Design Memo<br/><em>Environmental integration</em>"]
        SB["Storyboard Handoff<br/><em>Visual sequencing</em>"]
        CS["Character Sheets<br/><em>Consistency reference</em>"]
        PB -->|"Props override"| SP
        PB -->|"Props override"| SL
        SP -->|"Story informs"| SL
        DM -->|"Rules inform"| SL
        SL -->|"Shots inform"| SB
        CS -->|"Ref images inform"| SL
        style PB fill:#e07a4a,stroke:#e07a4a,color:#fff
        style SP fill:#1a1a2e,stroke:#5ec4ad,color:#fff
        style SL fill:#1a1a2e,stroke:#a78bfa,color:#fff
        style DM fill:#1a1a2e,stroke:#f0a050,color:#fff
        style SB fill:#1a1a2e,stroke:#f0a050,color:#fff
        style CS fill:#1a1a2e,stroke:#f0a050,color:#fff`,

    environmentIntegration: `flowchart TB
        subgraph Rules["Seven Golden Rules"]
            R1["1. Scale Ambiguity<br/>Never establish ground truth"]
            R2["2. Wide or Close — Never Medium<br/>Avoid door-frame geometry"]
            R3["3. Cut on Action<br/>Arrive already there"]
            R4["4. Ambient Lighting<br/>Bed takes the room's light"]
            R5["5. The Bed Has Weight<br/>Physical presence, not floating"]
            R6["6. Design Environments First<br/>Bed fills remaining space"]
            R7["7. Dave's Eyeline<br/>Always bed or forward, never the doorframe"]
        end
        subgraph Applied["Applied Per Scene"]
            BED["Bedroom — intimate, warm"]
            BATH["Bathroom — doorway framing"]
            KIT["Kitchen — speed + chaos"]
            CAR["Car — contained, sound only"]
            OFF["Office — rest mode, accepted"]
        end
        R1 & R2 & R3 --> BED & BATH & KIT & CAR & OFF
        R4 --> BED & BATH & KIT & OFF
        R5 --> BED & BATH & KIT & CAR
        R6 --> BED & BATH & KIT
        R7 --> BED & BATH & KIT & CAR & OFF
        style Rules fill:#1a1a2e,stroke:#e07a4a,color:#fff
        style Applied fill:#1a1a2e,stroke:#5ec4ad,color:#fff`,

    transMediaUniverse: `flowchart LR
        subgraph Film["PUSH — The Film"]
            DAVE["Dave's Day"]
            MARC["Marcus"]
            KAREN["Karen — 'Made me a VP'"]
        end
        subgraph Site["riseawake.com"]
            HOME["Product Pages"]
            INT["Internal Docs — 22 documents"]
            INV["Investor Relations"]
            LEG["Legal — 6 documents"]
            EASTER["Easter Eggs"]
        end
        subgraph Studio["RISE Render"]
            IMG["AI Image Generation"]
            VID["Video Asset Pipeline"]
        end
        DAVE -->|"D.K. testimonial"| HOME
        KAREN -->|"K.M. testimonial"| HOME
        DAVE -->|"Consent memo"| INT
        KAREN -->|"Nudge reference"| INT
        INT -->|"Arvin's TODO"| EASTER
        MARC -->|"Olive colorway"| HOME
        Film -->|"Assets produced in"| Studio
        Studio -->|"Hosted on"| Site
        style Film fill:#1a1a2e,stroke:#e07a4a,color:#fff
        style Site fill:#1a1a2e,stroke:#5ec4ad,color:#fff
        style Studio fill:#1a1a2e,stroke:#a78bfa,color:#fff`,

    shotListWorkflow: `flowchart TD
        subgraph Prompt["Shot Prompt Structure"]
            ID["Shot ID + Duration"]
            CAM["Camera Angle + Movement"]
            DESC["Scene Description"]
            AI["AI-Ready Prompt Text"]
            NOTES["Technical Notes"]
        end
        subgraph Tools["Generation Pipeline"]
            S1["Sora — primary"]
            S2["Runway — alternative"]
            S3["Kling — alternative"]
            S4["Pika — VFX shots"]
        end
        subgraph QA["Quality Control"]
            CON["Character Consistency Check"]
            LIT["Lighting Match"]
            MOT["Motion Continuity"]
        end
        ID --> CAM --> DESC --> AI
        AI --> NOTES
        AI --> S1 & S2 & S3 & S4
        S1 & S2 & S3 & S4 --> CON --> LIT --> MOT
        style Prompt fill:#1a1a2e,stroke:#e07a4a,color:#fff
        style Tools fill:#1a1a2e,stroke:#a78bfa,color:#fff
        style QA fill:#1a1a2e,stroke:#5ec4ad,color:#fff`,
} as const;

export type DiagramKey = keyof typeof diagrams;
