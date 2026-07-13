import { Trash2, Pencil, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge.js";
import { Button } from "@/components/ui/button.js";
import { Skeleton } from "@/components/ui/skeleton.js";
import { TaskFormDialog } from "./TaskFormDialog.js";
import { STATUS_LABELS, type Task, type TaskInput } from "./types.js";

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  search: string;
  onRetry: () => void;
  onEdit: (id: string, input: TaskInput) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function TaskList({ tasks, loading, error, search, onRetry, onEdit, onDelete }: TaskListProps) {
  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm">
        <p className="mb-3 text-destructive">{error}</p>
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Réessayer
        </Button>
      </div>
    );
  }

  const filtered = tasks.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));

  if (filtered.length === 0) {
    return (
      <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
        Aucune tâche pour ce filtre.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {filtered.map((task) => (
        <div
          key={task.id}
          className="flex items-center justify-between rounded-md border p-4"
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{task.title}</span>
              <Badge variant={task.status}>{STATUS_LABELS[task.status]}</Badge>
            </div>
            {task.description && (
              <p className="mt-1 text-sm text-muted-foreground">{task.description}</p>
            )}
          </div>
          <div className="flex gap-2">
            <TaskFormDialog
              trigger={
                <Button variant="ghost" size="icon">
                  <Pencil className="h-4 w-4" />
                </Button>
              }
              initialValue={task}
              onSubmit={(input) => onEdit(task.id, input)}
            />
            <Button variant="ghost" size="icon" onClick={() => onDelete(task.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
