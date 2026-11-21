import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
import { applicationStatuses } from "@/lib/demo-data";
import { demoSkillsForRole, filterApplications, isApplicationStatus, validateDemoAccount } from "@/lib/demo-rules";
import { DemoProvider, useDemo } from "@/components/demo-provider";

afterEach(cleanup);
describe("frontend demonstration rules", () => {
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
  it("validates signup and login inputs before opening the demo", () => {
    expect(validateDemoAccount("", "person@example.com", "demo1234", true)).not.toBe("");
    expect(validateDemoAccount("Person", "invalid", "demo1234", false)).not.toBe("");
    expect(validateDemoAccount("Person", "person@example.com", "short", false)).not.toBe("");
    expect(validateDemoAccount("Person", "person@example.com", "demo1234", true)).toBe("");
  });
  it("uses different preset skills for different target roles", () => {
    expect(demoSkillsForRole("Frontend Developer").some((s) => s.skill === "React")).toBe(true);
    expect(demoSkillsForRole("Data Analyst").some((s) => s.skill === "React")).toBe(false);
  });
});

function Probe() {
  const demo = useDemo();
  return <><output data-testid="state">{demo.profile.name}|{demo.savedProjects.length}|{demo.completedWeeks.length}|{demo.applications.length}</output><button onClick={() => { demo.setProfile({ ...demo.profile, name: "Tanisha" }); demo.setSavedProjects(["support"]); demo.setCompletedWeeks([1, 2, 3]); demo.setApplications([]); }}>Change</button><button onClick={demo.reset}>Reset</button></>;
}
describe("temporary demonstration state", () => {
  it("shares changes during navigation but clears them on logout/reset", () => {
    render(<DemoProvider><Probe /></DemoProvider>);
    fireEvent.click(screen.getByText("Change"));
    expect(screen.getByTestId("state").textContent).toBe("Tanisha|1|3|0");
    fireEvent.click(screen.getByText("Reset"));
    expect(screen.getByTestId("state").textContent).toBe("Aarav Mehta|0|2|6");
  });
  it("does not keep changed data after a fresh mount/refresh", () => {
    const view = render(<DemoProvider><Probe /></DemoProvider>);
    fireEvent.click(screen.getByText("Change"));
    expect(screen.getByTestId("state").textContent).toBe("Tanisha|1|3|0");
    view.unmount();
    render(<DemoProvider><Probe /></DemoProvider>);
    expect(screen.getByTestId("state").textContent).toBe("Aarav Mehta|0|2|6");
  });
});