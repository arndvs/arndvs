// Diagrams are taken from ARCHITECTURE.md in https://github.com/arndvs/soap-scribe
export const diagrams = {
    system: `flowchart LR
    subgraph VENDORS["BAA-covered vendors"]
        REC["Pocket recorder<br/>visit + spoken recap"]
        PC["Pocket cloud<br/>transcript, public API"]
        LLM["Model (Bedrock)"]
        REC --> PC
    end
    subgraph BACKEND["Backend: Node + Express + MongoDB"]
        API["API<br/>webhook, drafts, settings"]
        WK["Worker<br/>fetch, match, extract facts"]
        DB[("MongoDB<br/>jobs, facts, drafts,<br/>settings, library")]
        API <--> DB
        WK <--> DB
    end
    subgraph CHROME["Chrome extension (MV3)"]
        SP["Side panel (React)<br/>Today + Chart"]
        CS["Content script<br/>Jane pages only"]
        JANE["Jane chart + schedule"]
        SP <--> CS
        CS <--> JANE
    end
    PC -- "signed webhook" --> API
    WK -- "GET transcript" --> PC
    WK -- "stage 1: facts" --> LLM
    API -- "stage 2: note" --> LLM
    SP <-- "bearer token" --> API`,
    draft: `flowchart TD
    T(["Transcript"]) --> X["Stage 1: extract facts<br/>each cites transcript lines"]
    X --> F[("Visit facts")]
    P(["Last 3 notes, read<br/>from the open chart"]) --> C
    F --> C["Stage 2: compose S/O/A/P<br/>tagged today / carried / updated"]
    C --> R["Rules in code<br/>carry rules per section,<br/>library text verbatim and dated,<br/>sentences linked to what was said"]
    H[("What this patient<br/>was given before")] --> R
    R --> D(["Draft beside the chart"])`,
    jobs: `stateDiagram-v2
    [*] --> received: webhook or hourly catch-up
    [*] --> facts_ready: not recorded, drafted from previous notes
    received --> fetched
    fetched --> needs_confirmation: patient suggested
    needs_confirmation --> confirmed: she confirms
    confirmed --> extracting: leased
    extracting --> facts_ready
    extracting --> confirmed: retry 1, 5, 15 min
    facts_ready --> inserted: verified insert
    extracting --> failed: 3 attempts
    failed --> confirmed: manual retry`,
    insert: `flowchart TD
    S(["She clicks Insert"]) --> PAGE{"On a Jane chart page?"}
    PAGE -- "no" --> A(["Nothing written"])
    PAGE -- "yes" --> PT{"Patient ID on the page<br/>matches the draft?"}
    PT -- "no" --> B(["Nothing written,<br/>both patients named"])
    PT -- "yes" --> FIND{"All four fields found?"}
    FIND -- "no" --> C(["Nothing written,<br/>Copy per section"])
    FIND -- "yes" --> FILL["Fill all four"] --> READ{"Read back matches?"}
    READ -- "no" --> D(["Not marked inserted"])
    READ -- "yes" --> OK(["She saves and signs in Jane"])`,
};

export type DiagramKey = keyof typeof diagrams;
