import type { Task, TaskInput, TaskStatus } from "@/features/tasks/types.js";

export interface RequestOptions {
  simulateError?: boolean;
  simulateSlow?: boolean;
}

function buildHeaders(opts?: RequestOptions): HeadersInit {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (opts?.simulateError) headers["x-simulate-error"] = "1";
  if (opts?.simulateSlow) headers["x-simulate-slow"] = "1";
  return headers;
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    throw new Error(`Erreur ${res.status} lors de l'appel à l'API`);
  }
  return res.json() as Promise<T>;
}

export async function fetchTasks(
  status: TaskStatus | "all",
  opts?: RequestOptions,
): Promise<Task[]> {
  const url = status === "all" ? "/api/tasks" : `/api/tasks?status=${status}`;
  const res = await fetch(url, { headers: buildHeaders(opts) });
  return handle<Task[]>(res);
}

export async function createTask(input: TaskInput, opts?: RequestOptions): Promise<Task> {
  const res = await fetch("/api/tasks", {
    method: "POST",
    headers: buildHeaders(opts),
    body: JSON.stringify(input),
  });
  return handle<Task>(res);
}

export async function updateTask(
  id: string,
  input: TaskInput,
  opts?: RequestOptions,
): Promise<Task> {
  const res = await fetch(`/api/tasks/${id}`, {
    method: "PATCH",
    headers: buildHeaders(opts),
    body: JSON.stringify(input),
  });
  return handle<Task>(res);
}

export async function deleteTask(id: string, opts?: RequestOptions): Promise<void> {
  const res = await fetch(`/api/tasks/${id}`, {
    method: "DELETE",
    headers: buildHeaders(opts),
  });
  if (!res.ok) throw new Error(`Erreur ${res.status} lors de la suppression`);
}
