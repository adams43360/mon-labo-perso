import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button.js";
import { TaskFilters } from "@/features/tasks/TaskFilters.js";
import { TaskFormDialog } from "@/features/tasks/TaskFormDialog.js";
import { TaskList } from "@/features/tasks/TaskList.js";
import { useTasks } from "@/features/tasks/useTasks.js";
import type { TaskStatus } from "@/features/tasks/types.js";

export default function App() {
  const [status, setStatus] = useState<TaskStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [simulateError, setSimulateError] = useState(false);
  const [simulateSlow, setSimulateSlow] = useState(false);

  const { tasks, loading, error, reload, add, edit, remove } = useTasks(status, {
    simulateError,
    simulateSlow,
  });

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Gestionnaire de tâches</h1>
          <p className="text-sm text-muted-foreground">
            POC — labo personnel, expérience 002
          </p>
        </div>
        <TaskFormDialog
          trigger={
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle tâche
            </Button>
          }
          onSubmit={add}
        />
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border bg-secondary/50 p-3 text-sm">
        <span className="font-medium">Simulation réseau</span>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={simulateError}
            onChange={(e) => setSimulateError(e.target.checked)}
          />
          Forcer une erreur
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={simulateSlow}
            onChange={(e) => setSimulateSlow(e.target.checked)}
          />
          Forcer une latence (2s)
        </label>
      </div>

      <TaskFilters status={status} onStatusChange={setStatus} search={search} onSearchChange={setSearch} />

      <TaskList
        tasks={tasks}
        loading={loading}
        error={error}
        search={search}
        onRetry={reload}
        onEdit={edit}
        onDelete={remove}
      />
    </div>
  );
}
