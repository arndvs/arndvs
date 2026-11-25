import { skillForLabel } from "@/lib/data/skills";
import { technologiesData } from "@/lib/data/technologies";

import HomeContent from "./home-content";

export default function HomePage() {
    // Resolved here so the case-study data behind skills stays out of the client bundle.
    const techLinks = Object.fromEntries(
        technologiesData.flatMap((label) => {
            const skill = skillForLabel(label);
            return skill ? [[label, `/skills/${skill.slug}`]] : [];
        }),
    );
    return <HomeContent techLinks={techLinks} />;
}
