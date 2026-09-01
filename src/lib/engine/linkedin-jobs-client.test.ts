import { describe, expect, it } from "vitest";

import { parseJobsFromText } from "./linkedin-jobs-client";

const sampleResults = `forward deployed engineer in United States
49,000+ results
Set alert
Set job alert for Forward deployed engineer in United States
Jump to active job details
Jump to active search result

Software Engineer Staff
Software Engineer Staff with verification
Breeze Airways™
Cottonwood Heights, UT (Remote)
Viewed

Forward Deployed Engineer- Gen AI/Devin AI with Java
Forward Deployed Engineer- Gen AI/Devin AI with Java with verification
Synechron
Charlotte, NC (On-site)
$135K/yr - $145K/yr · 2 benefits
3 minutes ago
Within the past 24 hours

Staff Platform Engineer
Staff Platform Engineer with verification
Calendly
United States (Remote)
2 minutes ago
Within the past 24 hours`;

describe("parseJobsFromText", () => {
    it("parses multiple job rows with title, company, location, workType, salary, age", () => {
        const jobs = parseJobsFromText(sampleResults);
        expect(jobs.length).toBeGreaterThanOrEqual(3);

        const fde = jobs.find((j) => j.title?.includes("Forward Deployed Engineer"));
        expect(fde).toBeTruthy();
        expect(fde?.company).toBe("Synechron");
        expect(fde?.workType).toBe("on-site");
        expect(fde?.salary).toContain("$135K");
        expect(fde?.ageHours).toBeLessThan(1); // 3 minutes

        const remote = jobs.find((j) => j.title?.includes("Staff Platform"));
        expect(remote?.workType).toBe("remote");
        expect(remote?.ageHours).toBeLessThan(1); // 2 minutes
    });

    it("returns empty for empty input", () => {
        expect(parseJobsFromText("")).toEqual([]);
        expect(parseJobsFromText("   \n  ")).toEqual([]);
    });
});