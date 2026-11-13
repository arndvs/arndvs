/**
 * Seed script: creates "The Dinner inKind Missed" as a DRAFT post in Sanity.
 * Run: pnpm exec tsx scripts/seed-inkind-first-reward-post.ts
 *
 * The document id starts with "drafts.", so nothing goes live until it's published in the Studio.
 * Re-running replaces the draft, including any edits made in the Studio, so edit there once seeded.
 *
 * Placeholders: every "TODO clip" below is an htmlEmbed with no URL. It renders nothing on the site,
 * and the Studio won't publish while one is left, because the embed's URL is required. Before
 * publishing, give each one an HTTPS URL (an MP4/GIF or a hosted page), swap it for an inline image,
 * or delete it.
 */
import { createReadStream } from "node:fs";
import { join } from "node:path";

import { createSanityClient } from "./lib/sanity";

const client = createSanityClient();
const ASSET_DIR = join(__dirname, "assets", "inkind-first-reward");
const REPO = "https://github.com/arndvs/inkind-first-reward-journey";

// ── Code examples, copied from the repo ──

const SQL_VIEW = `CREATE OR REPLACE VIEW braze_first_reward_attributes AS
SELECT
  r.user_id AS EXTERNAL_ID,
  GREATEST(r.updated_at, COALESCE(t.first_at, r.updated_at)) AS UPDATED_AT,
  OBJECT_CONSTRUCT_KEEP_NULL(          -- keeps nulls so a used reward clears in Braze
    'first_reward_amount',  IFF(r.redeemed_at IS NULL, r.amount, NULL),
    'first_reward_display', IFF(r.redeemed_at IS NULL,
                                IFF(r.amount = FLOOR(r.amount),
                                    TO_VARCHAR(r.amount::INT),
                                    TRIM(TO_VARCHAR(r.amount, '9999990.00'))),
                                NULL),
    'first_reward_min_spend', IFF(r.redeemed_at IS NULL, r.min_spend::INT, NULL),
    'first_transaction_at',   t.first_at   -- NULL = never paid
  ) AS PAYLOAD
FROM rewards r
LEFT JOIN (
  SELECT user_id, MIN(created_at) AS first_at
  FROM transactions
  GROUP BY user_id
) t ON t.user_id = r.user_id
WHERE r.reward_type = 'referral_welcome';`;

const LIQUID_ABORT = `{{content_blocks.\${ik_brand}}}{{content_blocks.\${ik_urls}}}{{content_blocks.\${ik_get_reward}}}
{%- unless reward_ok -%}
  {%- case reward_skip_reason -%}
    {%- when 'zero_amount' -%}{%- abort_message("reward amount is zero") -%}
    {%- when 'no_minimum' -%}{%- abort_message("reward minimum missing") -%}
    {%- else -%}{%- abort_message("no unused reward") -%}
  {%- endcase -%}
{%- endunless -%}
{{content_blocks.\${ik_get_saved_restaurant}}}
{%- unless saved -%}{{content_blocks.\${ik_get_nearby}}}{%- endunless -%}`;

const NESTING_TEST = `MAX_LEVELS = 2
INCLUDE = re.compile(r"\\{\\{content_blocks\\.\\$\\{(\\w+)\\}\\}\\}")


def chains(source, blocks=BLOCKS, prefix=()):
    """Every chain of block names reachable from source, outermost first."""
    for name in INCLUDE.findall(source):
        if name in prefix:
            raise AssertionError(f"Content Block cycle: {' -> '.join(prefix + (name,))}")
        chain = prefix + (name,)
        yield chain
        yield from chains(blocks[name], blocks, chain)


@pytest.mark.parametrize("path", MESSAGES, ids=lambda p: p.name)
def test_no_block_chain_goes_deeper_than_two(path):
    too_deep = [c for c in chains(path.read_text(encoding="utf-8")) if len(c) > MAX_LEVELS]
    assert not too_deep, "Braze would drop: " + "; ".join(describe(c) for c in too_deep)`;

const TRACK_JOB = `# Looks first. If a concurrent run creates the row between the look-up and the insert,
# the unique index raises RecordNotUnique and we reuse the row the other run made.
def find_or_create_delivery(kind, record)
  key = idempotency_key(kind, record)
  BrazeDelivery.find_by(idempotency_key: key) || create_delivery(kind, record, key)
end

def idempotency_key(kind, record)
  identifier = kind == "purchase" ? record.transaction_key : record.id
  "#{kind}:#{identifier}"
end`;

// ── Body ──

function buildBody(img: { journey: ImageRef; twoPaths: ImageRef }) {
    return [
        p(
            "In October I installed inKind, the restaurant rewards app, through a referral, which put a $25 reward in my account toward a first meal of $50 or more. I browsed restaurants around San Diego and saved a couple.",
        ),
        p(
            "Then life happened. Over the next couple of weeks I got two general brand emails. Neither mentioned my $25 or the restaurants I'd saved, and no push came, even with notifications on. One Saturday night my wife and I were deciding what to order for dinner, and we ended up scrolling Google Maps. inKind never crossed my mind, with $25 sitting in the app.",
        ),
        p(
            "That's not a complaint about inKind. It's the most common problem in lifecycle marketing: someone shows intent, and nothing follows up while the intent is still warm. A push around 4:30 on a Friday, saying \"your $25 is waiting at the place you saved,\" would very likely have won that dinner.",
        ),
        p(
            `So I built that message, end to end, as a [public repo](${REPO}): the data contract, the journey, the Liquid email and push, a Snowflake proof of concept, a Braze trial, and a small Rails backend. This post walks through each piece, what it does, and what I learned building it. Everything uses made-up users and fictional restaurants, and the repo isn't affiliated with inKind. The schema names are my guesses.`,
        ),
        todoClip(
            "the generic brand email next to the push it should have been",
            "Side by side: a general brand email, and a 4:30 PM push with the $25 and a saved restaurant. A still image is fine here.",
        ),

        // ── The journey ──
        h2("The journey: one save, two chances"),
        p(
            "The whole idea fits in one Canvas. Saving a restaurant is the signal that someone is thinking about going out, so that's the entry. The send waits for 4:30 PM in the user's own time zone, when dinner plans get made. If the reward still hasn't been used three days later, there's one more try on Friday at 4:30, and then the journey ends either way.",
        ),
        image(
            img.journey,
            "Flowchart of the first-reward Canvas: a saved restaurant enters, filters check for an unused reward, the send waits for 4:30 PM local, then push or email, a three-day wait, a purchase check, and a Friday follow-up before exit. A 10% control group gets no message.",
            "The main Canvas. Any purchase exits it at any step.",
        ),
        p(
            "A purchase ends the journey at any point, not just at the decision. A second, smaller Canvas covers new users who open the app three times in their first two weeks but never save anything. They get the same timing with nearby picks instead of a saved restaurant, and the moment they save one, they exit and the main Canvas takes over.",
        ),

        // ── The data ──
        h2("The data: what Braze needs to know, and where it comes from"),
        p(
            "A message is only as good as the profile behind it. The repo starts with a data contract: every field the journey reads, its type, and how it reaches Braze. There are two paths, split by how fresh the data has to be.",
        ),
        li(
            "bullet",
            "**Real time, through the API:** events that start or end the journey. When someone saves a restaurant or pays, the backend sends it to Braze's `/users/track` endpoint. The purchase goes this way so the journey's exit fires immediately, not on the next sync.",
        ),
        li(
            "bullet",
            "**The warehouse, through Cloud Data Ingestion:** values computed in Snowflake, like the unused reward amount. Braze syncs only the rows that changed since the last sync.",
        ),
        p(
            "The Snowflake side is a runnable proof of concept: ten synthetic users, each built to cover a case the journey has to handle, and a view shaped the way Cloud Data Ingestion reads it. Two details in that view do most of the work.",
        ),
        codeBlock(SQL_VIEW, "sql", "sql/01_braze_view.sql"),
        p(
            '**A used reward is sent as null.** When the reward is redeemed, the amount comes through as JSON null, and a null tells Braze to remove the attribute. That\'s why the view uses `OBJECT_CONSTRUCT_KEEP_NULL`. A plain `OBJECT_CONSTRUCT` drops the key instead, and the old "$25 waiting" value would stay on the profile of someone who already spent it.',
        ),
        p(
            '**The display amount is formatted once, in the warehouse.** Whole dollars show as "25" and amounts with cents as "12.50", stored as text. The message template never formats money.',
        ),
        p(
            "The last of the 11 checks shows a bug on purpose. One synthetic user paid on October 14, but the record didn't land in the warehouse until the 27th. If the sync's `UPDATED_AT` comes from when the purchase happened, a sync that already ran skips the late row, and Braze never learns the user paid. They keep getting \"your reward is waiting.\" It doesn't take thirteen days: a record an hour late, across a sync, is skipped the same way. The fix is to stamp `UPDATED_AT` with when the row arrived in the warehouse.",
        ),
        todoClip(
            "the 11 Snowflake checks running, with check 11 catching the late row",
            "10 to 20 seconds, muted, cut from walkthrough 1.",
        ),
        p(
            "All 11 checks pass in a clean Snowflake account, and walkthrough 1 runs them on camera.",
        ),
        youtube(
            "OnmBVC8vrwE",
            "Walkthrough 1: the SQL running in Snowflake",
            "Walkthrough 1 (4:42): synthetic users, the view Braze would read, 11 of 11 checks passing.",
        ),

        // ── The message ──
        h2("The message: Liquid that stops itself"),
        p(
            "The email and push are written in Liquid, Braze's templating language, and split into Content Blocks so the pieces can be reused across messages without anyone rewriting Liquid:",
        ),
        li(
            "bullet",
            "**Design tokens** (`ik_brand`): the colors, type sizes and spacing every visible block reads, so changing one block restyles every message.",
        ),
        li(
            "bullet",
            "**Logic blocks** that never print anything. `ik_get_reward` reads the reward and decides whether it can be promoted. `ik_get_saved_restaurant` looks the saved restaurant up in a Braze Catalog.",
        ),
        li(
            "bullet",
            '**Visible blocks:** the hero, the restaurant cards, the "how to use it" section with the minimum spend, and the footer.',
        ),
        p(
            'The part I care about most is what happens when the data is wrong. Before any lookup runs, the message checks the reward. If there\'s no unused reward, if the amount is zero, or if the minimum spend is missing, the message calls `abort_message` with its own reason and nothing goes out. That last case matters: without a minimum, the copy would promise "$25 off any meal." The abort sits in the message itself, not inside a Content Block, so the stop is visible to anyone reading the message.',
        ),
        codeBlock(LIQUID_ABORT, "html", "liquid/messages/first_reward.email.liquid"),
        p(
            'The nearby-restaurants lookup is optional, so it\'s built to fail quietly. If the call fails or returns nothing, the email falls back to a "Find a spot near you" button instead of breaking.',
        ),
        p(
            "The Liquid has 184 tests that run in CI. They render every block and message against fixture users: a saved restaurant, a saved ID missing from the Catalog, nothing saved, the recommendations call down, a $12.50 reward, long restaurant names that have to fit a push. One parity test makes sure the email and the push always make the same offer, because it's easy for a person or an agent to update one and forget the other. Another fails if any email loads an image from outside the repo.",
        ),
        todoClip(
            "the 184 Liquid tests running and passing in the terminal",
            "10 to 15 seconds, muted. The green summary line is the point.",
        ),

        // ── The Braze trial ──
        h2("The Braze trial: what worked, and what the trial taught me"),
        p(
            "Tests against fixtures only prove the Liquid works in my renderer. I wanted to see it render in Braze, so I loaded it into a Braze trial workspace by hand.",
        ),
        p("The setup went in this order, and the order matters:"),
        li(
            "number",
            "**The Catalog.** `restaurants_catalog`, imported from CSV: ID, name, cuisine, neighborhood, image, deep link. Every column came in as String, which is what the templates expect.",
        ),
        li(
            "number",
            "**The users.** Imported before any Content Block, because Braze won't save a block that references a custom attribute it hasn't seen yet. CSV import guessed `first_reward_display` was a Number. That would have turned \"$12.50\" into 12.5, so I set it to String before importing.",
        ),
        li(
            "number",
            "**The Content Blocks.** The trial caps a workspace at eight, and the repo has seventeen. So the eight that carry the most logic went in as real blocks, and a small build script inlines the rest into one trial email body. The production version keeps them separate.",
        ),
        li("number", "**The campaign.** One email, previewed as each test user."),
        p(
            "The previews matched the tests. The $25 user got the full email. The $12.50 user saw $12.50, not $12.5. The user with zero reward, the user with no minimum spend, and the user with no reward at all each stopped the send, each with its own abort reason in the preview.",
        ),
        todoClip(
            "the Braze preview switching between test users",
            "15 to 20 seconds, muted, cut from walkthrough 2: the $25 user, then $12.50, then the zero-reward user aborting with its reason. A second clip could show the saved-restaurant card.",
        ),
        p("The trial also pushed back in a few places, and each one was useful:"),
        li(
            "bullet",
            "**Arrays don't import by CSV.** The mapping screen marks an Array column \"Destination type unsupported,\" so `saved_restaurants` couldn't come in that way. To show the saved-restaurant card, I pinned one test user's lookup to a Catalog ID. The card rendered with the restaurant's name, image and link from the Catalog. In production, that array would arrive through Cloud Data Ingestion or the API.",
        ),
        li(
            "bullet",
            '**Connected Content is blocked.** The trial won\'t launch a block that uses it, even inside a Liquid comment. So the nearby-restaurants block went in as a stub, and the email falls back to the saved card or a generic "explore near you" link, which is the same fallback the tests cover.',
        ),
        li(
            "bullet",
            "**The preference center has to exist.** The footer's unsubscribe tag names a preference center. Until one with that exact name exists, the preview fails. That's a good failure: it means a typo there can't reach a user.",
        ),
        li(
            "bullet",
            "**Two limits I caught before loading anything.** Content Blocks nest only one level deep, and `:retry` on a Connected Content call aborts the message after five failures. Both are in Braze's docs. The repo first had a block nested two levels, and a test now fails if that happens again.",
        ),
        p(
            "None of this is production Braze. It's a trial, loaded by hand, so the point was to find out where the design and the platform disagreed before anything real depended on it.",
        ),
        youtube(
            "fSDLiHyoBgs",
            "Walkthrough 2: the Liquid rendering in a Braze trial",
            "Walkthrough 2 (4:23): the full email, $12.50 kept, three aborts, and the saved-restaurant card. Preview only, nothing sent.",
        ),

        // ── The backend ──
        h2("The backend: where a purchase clears the reward"),
        p(
            "The journey's exit depends on one fact: did the user spend the reward? That has to reach Braze fast. If it doesn't, someone who used their $25 on Thursday gets a Friday push telling them it's still waiting.",
        ),
        p(
            "The repo has a small Rails app that plays the part of inKind's backend. It's not meant to look like inKind's real system. It's there to show the event path end to end.",
        ),
        p("When a fictional user pays with their reward:"),
        li(
            "number",
            "**The payment and the reward are saved together.** The transaction is recorded and the reward is marked used in one database transaction. If either fails, neither is saved.",
        ),
        li(
            "number",
            "**A background job is queued after the commit**, so Braze only ever hears about payments that actually happened. Solid Queue runs it, and Mission Control at `/admin/jobs` shows it.",
        ),
        li(
            "number",
            "**The job writes one delivery row** with a unique key, `purchase:<transaction_key>`, and builds the payload once. Retries resend that stored payload instead of rebuilding it. If two runs race, the unique index stops a second row.",
        ),
        li(
            "number",
            "**The event goes to Braze as a purchase**, through the `/users/track` endpoint. That's what triggers the Canvas exit.",
        ),
        codeBlock(TRACK_JOB, "text", "rails/app/jobs/braze/track_job.rb"),
        p(
            "The trial has no REST API, so the app runs in **record mode**: the job builds the exact request it would send and stores it on the outbox row instead. You can open any row and read the payload. A **Re-send** button queues the same job again. It finds the existing row by its key, so it never creates a second one, and a row that's already recorded isn't sent again.",
        ),
        todoClip(
            "a payment, the outbox row appearing, and Re-send making no duplicate",
            "15 to 20 seconds, muted, cut from walkthrough 3.",
        ),
        p(
            "The second path is the warehouse. Every 10 minutes, a background job exports new and changed rows and MERGEs them into a `RAILS_DEMO` schema in Snowflake, which the same CDI view reads. The **CDI preview** page at `/warehouse/cdi_preview` shows what Braze would receive for each user, including the nulls that clear a spent reward.",
        ),
        image(
            img.twoPaths,
            "Diagram of two paths from a saved payment to the Braze profile: in real time, a track job sends a purchase event to /users/track; every 10 minutes, an export MERGEs into Snowflake and the CDI view sends the unused reward as null.",
            "The event exits the Canvas. The sync clears the reward.",
        ),
        p(
            "So there are two ways the fact reaches Braze: in real time through the event, and every few minutes through the warehouse. If the event never arrives, the next sync still clears the reward, and the message's own check stops the send because there's no unused reward left to promote.",
        ),
        youtube(
            "ZBk5Az8jVrs",
            "Walkthrough 3: a payment flowing from Rails to Snowflake",
            "Walkthrough 3 (4:30): a payment recorded once in the outbox, exported with a MERGE, and the reward going to null in the CDI preview. Record mode, nothing sent to Braze.",
        ),
        p("The Rails app has 146 tests."),

        // ── How it was built ──
        h2("How it was built: agents draft, tests decide"),
        p(
            "I built this in about a week, from October 26 to November 2: 11 merged pull requests and about 70 commits. Most of the code was drafted by AI coding agents running in my own setup, [ctrl+shft](https://github.com/arndvs/ctrlshft). That's only a fair thing to say because of what sits around the agents.",
        ),
        p("The flow for each piece of work was the same:"),
        li("number", '**A ticket** with the goal, the files in scope, and what "done" means.'),
        li(
            "number",
            "**The test first.** Before an agent touched the code, the ticket said which test had to fail now and pass after.",
        ),
        li("number", "**The agent drafts** on a branch and opens a pull request."),
        li(
            "number",
            "**CI decides.** The 184 Liquid tests and the 146 Rails tests run on every pull request. If one fails, the PR doesn't merge, no matter how good the diff looks. The 11 SQL checks need a Snowflake account, so I run those by hand in a worksheet.",
        ),
        li(
            "number",
            "**I review** what the tests can't judge: wording, whether the logic matches the journey, whether it's the right change at all.",
        ),
        p(
            "The clearest example is the nesting limit. Braze's docs say Content Blocks nest only one level deep, and the repo had a block nested two levels. In PR #4, the first commit was a test that walks every block's includes and fails above one level. It failed. The fix came after, and the test stays, so neither a person nor an agent can bring the problem back.",
        ),
        codeBlock(NESTING_TEST, "python", "liquid/tests/test_nesting.py"),
        todoClip(
            "the PR #4 nesting test failing, then CI turning green after the fix",
            "Two short screenshots or a 10-second clip: the red run, then the green one.",
        ),
        p(
            'At the end I ran a separate agent as an auditor, with no context from the build, and asked it to find real problems. I checked every finding by hand against the code. Some were wrong: it flagged a JWT that "never refreshes" when it does, and it called the late-arrival bug in check 11 critical when that bug is there on purpose, to show the check catching it. Five findings were real, and those five were fixed.',
        ),
        p(
            "That's the pattern I'd bring to campaign QA: let agents do the volume, and make the checks strict enough that a wrong change can't get through.",
        ),

        // ── One change, start to finish ──
        h2("One change, start to finish: removing a saved restaurant"),
        p(
            "After the first version shipped, I ran a simple check against the design: everything a user can create, they should also be able to change or remove. Saved restaurants failed it. A user could save a place and never drop it, and the Braze profile had the same problem: `saved_restaurants` could only grow, so a message could keep naming a restaurant the user had given up on.",
        ),
        p(
            "The fix went in one slice at a time, each starting with a failing test: the model writes a `restaurant_unsaved` event, the payload carries the remaining list, the delivery can be resent, and the console gets a Remove button. Nine new Rails tests and four new Liquid cases, which is where the 146 and 184 come from.",
        ),
        p("The tests and a walk through the flow found two problems the design hadn't covered:"),
        li(
            "bullet",
            "**A queued job crashed after its record was removed.** If someone removed a save before its `restaurant_saved` job ran, the job couldn't find the record and raised. Now the job notices the record is gone and sends nothing. The removal's own event carries the current list, so nothing is lost.",
        ),
        li(
            "bullet",
            "**A removed restaurant could still be named.** A Canvas carries the restaurant from the save that started it, and it can sit in its 4:30 delay for hours. A failing test reproduced it, and now the message only uses that restaurant while the profile still lists it. The same rule went into the Content Block and the single-file message, so the parity test still holds.",
        ),
        p(
            `One gap is still open, and it's on Braze's side: a Canvas doesn't exit when a restaurant is removed. That's a Canvas setting the repo can't configure, so it's written down in [docs/gaps.md](${REPO}/blob/main/docs/gaps.md) rather than papered over. The whole change, including the two places I broke a test file along the way, is in [docs/change-log.md](${REPO}/blob/main/docs/change-log.md).`,
        ),

        // ── Next ──
        h2("What I'd do next"),
        p("If this were going into a real workspace, these are the next pieces:"),
        li(
            "bullet",
            "**A send log.** Braze message events (sends, opens, clicks, aborts) streamed back into Snowflake, so every abort reason from the Liquid is countable, and orders can be checked against what was actually sent.",
        ),
        li(
            "bullet",
            "**Frequency caps by tag.** One rule across every reward-reminder message, so this journey can't stack on top of another campaign in the same week.",
        ),
        li(
            "bullet",
            "**Live API sends.** The Rails outbox already builds the request. With a real API key, record mode turns off and the purchase reaches Braze within seconds.",
        ),
        li(
            "bullet",
            "**A measured result.** The 10% control group is already in both Canvases. The number that matters is first-reward use within 14 days against that control, then whether people come back for a second visit.",
        ),
        li(
            "bullet",
            "**An agent loop for experiments.** Agents that propose a variant, run the full test suite against it, and only then put it in front of a person to approve. The same rule as the build: agents draft, checks decide.",
        ),

        h2("Links"),
        li("bullet", `The repo: [github.com/arndvs/inkind-first-reward-journey](${REPO})`),
        li(
            "bullet",
            `The three walkthroughs are embedded above, and in the README's [Walkthroughs](${REPO}#walkthroughs) section.`,
        ),

        h2("The fine print"),
        p(
            "Every restaurant, user and number in the repo is made up. I'm not affiliated with inKind, and this isn't their code or their data. The Snowflake schema names are my guesses at a reasonable shape, not inKind's. And I haven't run Braze in production. Everything Braze-side here ran in a trial workspace, loaded by hand.",
        ),
    ];
}

// ── Helpers ──

type ImageRef = { _type: "reference"; _ref: string };
type Span = { _type: "span"; _key: string; text: string; marks: string[] };
type MarkDef = { _type: "link"; _key: string; href: string; blank: boolean };

let seq = 0;
const key = (prefix: string) => `${prefix}-${++seq}`;

/** Inline markdown: **bold**, `code` and [text](url). No nesting. */
function rich(text: string): { children: Span[]; markDefs: MarkDef[] } {
    const children: Span[] = [];
    const markDefs: MarkDef[] = [];
    const token = /\*\*(.+?)\*\*|`(.+?)`|\[(.+?)\]\((.+?)\)/g;
    let last = 0;
    for (const m of text.matchAll(token)) {
        // noUncheckedIndexedAccess types destructured array elements as `string | undefined`,
        // so each capture has to be narrowed before use.
        const [matched, strong, code, linkText, href] = m;
        const at = m.index ?? 0;
        if (at > last) children.push(span(text.slice(last, at)));
        if (strong !== undefined) children.push(span(strong, ["strong"]));
        else if (code !== undefined) children.push(span(code, ["code"]));
        else if (linkText !== undefined && href !== undefined) {
            const linkKey = key("link");
            markDefs.push({ _type: "link", _key: linkKey, href, blank: true });
            children.push(span(linkText, [linkKey]));
        } else {
            // The alternation above should make this unreachable; fail loudly if it changes.
            throw new Error(`rich(): unrecognised token ${JSON.stringify(matched)}`);
        }
        last = at + matched.length;
    }
    if (last < text.length) children.push(span(text.slice(last)));
    return { children, markDefs };
}

function span(text: string, marks: string[] = []): Span {
    return { _type: "span", _key: key("span"), text, marks };
}

function textBlock(style: string, text: string, list?: "bullet" | "number") {
    return {
        _type: "block",
        _key: key("block"),
        style,
        ...rich(text),
        ...(list ? { listItem: list, level: 1 } : {}),
    };
}

const p = (text: string) => textBlock("normal", text);
const h2 = (text: string) => textBlock("h2", text);
const li = (kind: "bullet" | "number", text: string) => textBlock("normal", text, kind);

function codeBlock(code: string, language: string, filename: string) {
    return { _type: "codeBlock", _key: key("code"), code, language, filename };
}

function image(asset: ImageRef, alt: string, caption: string) {
    return { _type: "inlineImage", _key: key("image"), asset, alt, caption };
}

function youtube(id: string, title: string, caption: string) {
    return {
        _type: "htmlEmbed",
        _key: key("embed"),
        url: `https://www.youtube-nocookie.com/embed/${id}`,
        title,
        aspectRatio: "16 / 9",
        caption,
    };
}

/** A clip still to record. No URL, so it renders nothing and blocks publishing until filled. */
function todoClip(what: string, notes: string) {
    return {
        _type: "htmlEmbed",
        _key: key("todo"),
        title: `TODO clip: ${what}`,
        aspectRatio: "16 / 9",
        caption: notes,
    };
}

async function uploadImage(file: string): Promise<ImageRef> {
    const asset = await client.assets.upload("image", createReadStream(join(ASSET_DIR, file)), {
        filename: `inkind-first-reward-${file}`,
    });
    return { _type: "reference", _ref: asset._id };
}

async function main() {
    console.log("Uploading diagrams...");
    const journey = await uploadImage("journey.png");
    const twoPaths = await uploadImage("two-paths.png");

    const post = {
        _type: "post",
        _id: "drafts.post-inkind-first-reward-journey",
        title: "The Dinner inKind Missed: Building a First-Reward Journey",
        slug: { _type: "slug", current: "inkind-first-reward-journey" },
        author: "Aaron Davis",
        publishedAt: new Date().toISOString(),
        excerpt:
            "I had $25 waiting in a restaurant rewards app and still ended up on Google Maps. So I built the message that should have reached me: Snowflake, Liquid, a Braze trial and a Rails backend, end to end.",
        tldr: "A walkthrough of a public repo: a Braze first-reward journey with a Snowflake data contract, Liquid that aborts itself when the data is wrong, a hand-loaded Braze trial, a Rails outbox, and the agent-plus-tests workflow that built it in a week. Fictional data, not affiliated with inKind.",
        categories: ["Braze", "Lifecycle Marketing", "Snowflake", "Liquid", "Rails", "AI"],
        mainImage: {
            _type: "image",
            asset: journey,
            alt: "Flowchart of the first-reward Canvas, from a saved restaurant to a 4:30 PM push or email, a purchase check, and a Friday follow-up.",
        },
        seo: {
            _type: "seo",
            metaTitle: "The Dinner inKind Missed: Building a First-Reward Journey",
            metaDescription:
                "A Braze first-reward journey built end to end: Snowflake data, Liquid that stops itself, a Braze trial, and a Rails outbox, with fictional data.",
            focusKeyword: "braze lifecycle journey",
        },
        body: buildBody({ journey, twoPaths }),
    };

    const result = await client.createOrReplace(post);
    console.log(`✓ Created draft post: ${result._id}`);
    console.log(`  Slug: ${post.slug.current}`);
    console.log(`  URL (after publish): /blog/${post.slug.current}`);
    console.log("  Fill or remove each 'TODO clip' embed in the Studio before publishing.");
}

main().catch((err) => {
    console.error("Failed to seed blog post:", err);
    process.exit(1);
});
