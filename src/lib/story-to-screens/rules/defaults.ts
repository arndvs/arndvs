import type { RuleModule } from "./context";

/** Every product has a landing page. Products with accounts also need sign-up and log-in. */
export const defaults: RuleModule = {
    id: "defaults",
    name: "Default screens",
    step: "Step 3 · default screens",
    stage: "design",
    explain:
        "Every product has a landing page. Products with accounts also need sign-up and log-in.",
    standard: true,
    apply: ({ screens, addScreen, addFinding, record }) => {
        const added: string[] = [];
        if (addScreen("landing", "Landing page", "landing", null, "defaults"))
            added.push("landing");
        if (addScreen("signup", "Sign up", "auth", null, "defaults")) added.push("signup");
        if (addScreen("login", "Log in", "auth", null, "defaults")) added.push("login");
        if (added.length) {
            addFinding({
                id: "defaults",
                ruleId: "defaults",
                message: `Added ${added.length} screens every product needs: ${added.map((id) => screens.get(id)?.name).join(", ")}.`,
                sources: [],
            });
        }
        record("defaults", added);
    },
};
