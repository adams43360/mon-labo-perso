import { describe, expect, it } from "vitest";
import { seedTasks } from "../src/mocks/data.js";

describe("seedTasks", () => {
  it("a des identifiants uniques", () => {
    const ids = seedTasks.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("chaque tâche a un statut valide", () => {
    const validStatuses = ["todo", "in_progress", "done"];
    for (const task of seedTasks) {
      expect(validStatuses).toContain(task.status);
    }
  });
});
