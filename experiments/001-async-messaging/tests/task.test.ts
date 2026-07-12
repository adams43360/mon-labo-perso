import { describe, expect, it } from "vitest";
import { createTask, TaskSchema } from "../src/shared/task.js";

describe("createTask", () => {
  it("crée une tâche valide au regard du schéma", () => {
    const task = createTask("demo.task", { note: "test" });
    expect(() => TaskSchema.parse(task)).not.toThrow();
    expect(task.attempts).toBe(0);
    expect(task.type).toBe("demo.task");
  });
});
