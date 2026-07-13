import { http, HttpResponse, delay } from "msw";
import type { Task, TaskInput } from "@/features/tasks/types.js";
import { seedTasks } from "./data.js";

// État en mémoire — réinitialisé à chaque rechargement de la page.
// Suffisant pour un POC ; pas fait pour persister entre sessions.
let tasks: Task[] = [...seedTasks];

async function applySimulation(request: Request) {
  if (request.headers.get("x-simulate-slow")) {
    await delay(2000);
  }
  if (request.headers.get("x-simulate-error")) {
    throw HttpResponse.json({ error: "Erreur simulée" }, { status: 500 });
  }
}

export const handlers = [
  http.get("/api/tasks", async ({ request }) => {
    await applySimulation(request);
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const result = status ? tasks.filter((t) => t.status === status) : tasks;
    return HttpResponse.json(result);
  }),

  http.post("/api/tasks", async ({ request }) => {
    await applySimulation(request);
    const input = (await request.json()) as TaskInput;
    const newTask: Task = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...input,
    };
    tasks = [newTask, ...tasks];
    return HttpResponse.json(newTask, { status: 201 });
  }),

  http.patch("/api/tasks/:id", async ({ request, params }) => {
    await applySimulation(request);
    const input = (await request.json()) as TaskInput;
    const id = params.id as string;
    tasks = tasks.map((t) => (t.id === id ? { ...t, ...input } : t));
    const updated = tasks.find((t) => t.id === id);
    if (!updated) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(updated);
  }),

  http.delete("/api/tasks/:id", async ({ request, params }) => {
    await applySimulation(request);
    const id = params.id as string;
    tasks = tasks.filter((t) => t.id !== id);
    return new HttpResponse(null, { status: 204 });
  }),
];
