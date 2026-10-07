import { describe, expect, it } from "vitest";
import { answerFor, bucketWeekly, traffic } from "./snapshot";

describe("Teamulate snapshot", () => {
  it("rolls daily traffic into weekly averages", () => {
    const weekly = bucketWeekly(traffic.labels, traffic.current);
    expect(weekly.labels).toEqual(["Sep 8", "Sep 15", "Sep 22", "Sep 29"]);
    expect(weekly.values).toHaveLength(4);
    expect(weekly.values[0]).toBe(Math.round((14 + 18 + 24 + 20 + 28 + 36 + 30) / 7));
  });

  it("answers from the snapshot instead of inventing a metric", () => {
    expect(answerFor("Why did website traffic increase?")).toContain("265");
    expect(answerFor("Show AI visibility trends")).toContain("ChatGPT");
    expect(answerFor("something else entirely")).toContain("Sep 8");
  });
});
