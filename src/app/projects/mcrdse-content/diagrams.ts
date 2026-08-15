export const diagrams = {
    contentShip: `graph TB
    subgraph Author["Authoring"]
        CLAUDE["Claude Code Sessions"]
        BROWSER["Browser Form"]
        DRIVE["Google Drive Intake"]
    end

    subgraph Worker["Content Ship Worker"]
        AUTH["Cloudflare Access JWT"]
        CSRF["CSRF Double-Submit"]
        SCRIPT["POST /script"]
        APPROVE["Approval (SHA-256 Lock)"]
        PREFLIGHT["Preflight Panel"]
        ZERNIO["Zernio Queue"]
        LINEAR["Linear Issue Auto-Create"]
    end

    subgraph Storage["Cloudflare"]
        D1["D1\n~250 scripts · ~130 research"]
        R2["R2\nMedia · ZIPs · Brand Guides"]
    end

    CLAUDE --> SCRIPT
    BROWSER --> SCRIPT
    DRIVE --> SCRIPT
    SCRIPT --> AUTH
    AUTH --> CSRF
    CSRF --> APPROVE
    APPROVE --> PREFLIGHT
    PREFLIGHT --> ZERNIO
    APPROVE --> LINEAR
    APPROVE --> D1
    ZERNIO --> R2`,
    approvalLock: `sequenceDiagram
    participant E as Editor
    participant A as Approval Service
    participant D as D1
    participant Z as Zernio

    E->>A: approve script
    A->>A: SHA-256(copy + slides + ZIP)
    A->>D: store approval hash
    Note over A,D: edits invalidate hash
    E->>A: request ship
    A->>D: re-hash current artifact set
    alt hash matches
        A->>Z: send (x-request-id idempotent)
        Z-->>A: 200 / 409 duplicate
    else hash drifted
        A-->>E: 409 approval invalidated
    end`,
    geoStrategy: `graph LR
    subgraph Content["Content Layer"]
        ARTICLES["56 Articles · 6 Pillars"]
        QUIZ["Archetype Quiz\n7 Archetypes"]
        GUIDES["Gated Guidebook PDFs"]
    end

    subgraph SEO["AI-Search / GEO Layer"]
        SIGNAL["Content-Signal Protocol\nai-input=yes · ai-train=no"]
        SCHEMA["Person / BlogPosting\nspeakable JSON-LD"]
        ROBOTS["robots.txt + X-Robots-Tag"]
    end

    subgraph Data["Data Layer"]
        D1["D1 Source of Truth"]
        GHL["GoHighLevel CRM"]
        EVENTS["Email Event Mirror"]
    end

    ARTICLES --> SIGNAL
    ARTICLES --> SCHEMA
    QUIZ --> D1
    QUIZ --> GHL
    GUIDES --> ROBOTS
    GHL --> EVENTS
    EVENTS --> D1`,
};

export type DiagramKey = keyof typeof diagrams;
