import { useCallback, useEffect, useState } from "react";
import { createTask, deleteTask, fetchTasks, updateTask, type RequestOptions } from "@/lib/api.js";
import type { Task, TaskInput, TaskStatus } from "./types.js";

export function useTasks(statusFilter: TaskStatus | "all", opts: RequestOptions) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTasks(statusFilter, opts);
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
    // opts est un objet recréé à chaque rendu ; on ne dépend que de ses valeurs primitives.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, opts.simulateError, opts.simulateSlow]);

  useEffect(() => {
    load();
  }, [load]);

  async function add(input: TaskInput) {
    await createTask(input, opts);
    await load();
  }

  async function edit(id: string, input: TaskInput) {
    await updateTask(id, input, opts);
    await load();
  }

  async function remove(id: string) {
    await deleteTask(id, opts);
    await load();
  }

  return { tasks, loading, error, reload: load, add, edit, remove };
}
