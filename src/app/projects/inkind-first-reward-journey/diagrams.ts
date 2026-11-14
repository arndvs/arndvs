// Diagrams are taken from ARCHITECTURE.md and 02-journey.md in
// https://github.com/arndvs/inkind-first-reward-journey
export const diagrams = {
    system: `flowchart LR
    subgraph RAILS["rails/ (the backend)"]
        PAY["Payments::Record<br/>txn + reward redemption<br/>in one transaction"]
        DB[("SQLite<br/>users, rewards, saves,<br/>transactions, app_events")]
        JOB["Braze::TrackJob<br/>after commit"]
        OUT[("braze_deliveries<br/>outbox, unique<br/>idempotency_key")]
        EXP["Warehouse::ExportJob<br/>every 10 minutes"]
        PAY --> DB
        DB -- "after_create_commit" --> JOB
        JOB --> OUT
        DB --> EXP
    end

    subgraph SF["sql/ (Snowflake)"]
        TBL[("rewards, transactions,<br/>app_events")]
        VIEW["braze_first_reward_attributes<br/>OBJECT_CONSTRUCT_KEEP_NULL"]
        TBL --> VIEW
    end

    subgraph BRAZE["Braze"]
        PROF["User profile<br/>custom attributes"]
        CAT[("restaurants_catalog")]
        CANVAS["Canvas"]
        MSG["Message<br/>liquid/ Content Blocks"]
        PROF --> CANVAS --> MSG
        CAT --> MSG
    end

    OUT -. "POST /users/track<br/>(record mode in this repo)" .-> PROF
    EXP -- "MERGE via SQL API" --> TBL
    VIEW -. "CDI: rows with a<br/>newer UPDATED_AT" .-> PROF
    MSG --> USER(["Push or email"])`,
    canvas: `flowchart TD
    A(["Entry<br/>saves a restaurant<br/>reward unused"]) --> B["Control split<br/>10% get nothing"]
    B --> C["Delay<br/>until 4:30 PM user's local time"]
    C --> D{"Audience Path<br/>Push Enabled?"}
    D -->|"yes"| E["Push<br/>Your $25 toward a $50+ meal<br/>at the restaurant you saved"]
    D -->|"no"| F["Email<br/>same message"]
    E --> G{"Action Path<br/>first purchase<br/>within 3 days?"}
    F --> G
    G -->|"paid"| H(["Exit: converted"])
    G -->|"no purchase"| K["Delay<br/>until Friday 4:30 PM local"] --> I["Follow-up<br/>other channel if allowed,<br/>else same channel<br/>three spots near you"]
    I --> J(["Exit<br/>eligible again in 30 days"])`,
    message: `flowchart TD
    START(["Canvas step renders the email"]) --> CFG["ik_brand, ik_urls<br/>design tokens and links"]
    CFG --> RW["ik_get_reward<br/>reads first_reward_* attributes"]
    RW --> OK{"reward_ok?"}
    OK -- "no unused reward" --> A1(["abort_message: no unused reward"])
    OK -- "amount is zero" --> A2(["abort_message: reward amount is zero"])
    OK -- "minimum missing" --> A3(["abort_message: reward minimum missing"])
    OK -- "yes" --> SV["ik_get_saved_restaurant<br/>the Canvas trigger's restaurant_id,<br/>else the first saved ID,<br/>looked up in restaurants_catalog"]
    SV --> HAS{"found in the Catalog?"}
    HAS -- "yes" --> CARD["Hero card and button<br/>for the saved restaurant"]
    HAS -- "no" --> BTN["Generic hero and a<br/>'Find a spot near you' button"]
    BTN --> NB["ik_get_nearby<br/>Connected Content call"]
    NB --> NBOK{"results?"}
    NBOK -- "yes" --> LIST["'Near you' list"]
    NBOK -- "no, or call failed" --> BODY
    CARD --> BODY
    LIST --> BODY
    BODY["Hero, how to use the reward<br/>(with the minimum spend), footer"] --> SEND(["Send"])`,
    outbox: `sequenceDiagram
    participant P as Payment
    participant DB as App database
    participant J as Outbox job
    participant B as Braze client
    participant W as Warehouse export
    P->>DB: Payment and reward redemption in one transaction
    DB-->>J: After commit
    J->>DB: Outbox row with a unique idempotency key
    J->>B: Build the payload once and store it
    B-->>J: Failure
    J->>B: Retry sends the stored payload
    W->>DB: Every 10 minutes, read new and changed rows
    W->>W: MERGE into Snowflake
    W->>DB: Mark exported only after the MERGE succeeds`,
};

export type DiagramKey = keyof typeof diagrams;
