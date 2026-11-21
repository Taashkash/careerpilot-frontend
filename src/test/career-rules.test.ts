import { describe, expect, it } from "vitest";
import { applicationStatuses } from "@/lib/demo-data";
import { computeReadiness, demoSkillsForRole, filterApplications, formatRelativeTime, isActiveApplication, isApplicationStatus, largestGaps, validateAccount } from "@/lib/demo-rules";

describe("career rules", () => {
  it("supports exactly Applied, Assessment, Interview, Offer and Rejected", () => {
    expect(applicationStatuses).toEqual(["Applied", "Assessment", "Interview", "Offer", "Rejected"]);
    expect(isApplicationStatus("Assessment")).toBe(true);
    expect(isApplicationStatus("Wishlist")).toBe(false);
  });
  it("filters applications by company or job title and selected status", () => {
    const apps = [{ id: "one", company: "Acme", role: "Analyst", location: "Remote", status: "Assessment" as const, appliedOn: "2026-11-21" }, { id: "two", company: "Other", role: "Engineer", location: "Remote", status: "Applied" as const, appliedOn: "2026-11-21" }];
    expect(filterApplications(apps, " ACME ", "Assessment").map((a) => a.id)).toEqual(["one"]);
    expect(filterApplications(apps, "analyst", "Applied")).toEqual([]);
  });
  it("counts Applied, Assessment and Interview as active applications, not Offer or Rejected", () => {
    const base = { id: "x", company: "A", role: "B", location: "", appliedOn: "2026-11-21" };
    expect(applicationStatuses.filter((status) => isActiveApplication({ ...base, status }))).toEqual(["Applied", "Assessment", "Interview"]);
  });
  it("requires a name at signup, a valid email and a password of at least 8 characters", () => {
    expect(validateAccount("", "person@example.com", "secret123", true)).not.toBe("");
    expect(validateAccount("", "person@example.com", "secret123", false)).toBe("");
    expect(validateAccount("Person", "invalid", "secret123", false)).not.toBe("");
    expect(validateAccount("Person", "person@example.com", "short12", false)).not.toBe("");
    expect(validateAccount("Person", "person@example.com", "secret12", true)).toBe("");
  });
  it("computes readiness as average coverage with current capped at required", () => {
    expect(computeReadiness([{ skill: "A", current: 50, required: 100, category: "T" }, { skill: "B", current: 90, required: 60, category: "T" }])).toBe(75);
    expect(computeReadiness([])).toBe(0);
    expect(computeReadiness(demoSkillsForRole("Data Analyst"))).toBe(70);
  });
  it("orders the largest gaps first", () => {
    expect(largestGaps(demoSkillsForRole("Data Analyst"), 2).map((s) => s.skill)).toEqual(["Python", "SQL"]);
  });
  it("uses different preset skills for different target roles", () => {
    expect(demoSkillsForRole("Frontend Developer").some((s) => s.skill === "React")).toBe(true);
    expect(demoSkillsForRole("Data Analyst").some((s) => s.skill === "React")).toBe(false);
  });
  it("formats notification times relative to now", () => {
    const now = new Date("2026-11-21T12:00:00Z");
    expect(formatRelativeTime("2026-11-21T10:00:00Z", now)).toBe("2h ago");
    expect(formatRelativeTime("2026-11-18T12:00:00Z", now)).toBe("3d ago");
  });
});
