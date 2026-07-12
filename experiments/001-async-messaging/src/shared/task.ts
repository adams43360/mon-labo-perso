import { randomUUID } from "node:crypto";
import { z } from "zod";

export const TaskSchema = z.object({
  id: z.string().uuid(),
  type: z.string(),
  payload: z.record(z.unknown()),
  createdAt: z.string().datetime(),
  attempts: z.number().int().default(0),
});

export type Task = z.infer<typeof TaskSchema>;

export function createTask(type: string, payload: Record<string, unknown>): Task {
  return {
    id: randomUUID(),
    type,
    payload,
    createdAt: new Date().toISOString(),
    attempts: 0,
  };
}
