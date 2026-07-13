import { Input } from "@/components/ui/input.js";
import { Select } from "@/components/ui/select.js";
import { STATUS_LABELS, type TaskStatus } from "./types.js";

interface TaskFiltersProps {
  status: TaskStatus | "all";
  onStatusChange: (status: TaskStatus | "all") => void;
  search: string;
  onSearchChange: (search: string) => void;
}

export function TaskFilters({ status, onStatusChange, search, onSearchChange }: TaskFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <Input
        placeholder="Rechercher une tâche..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="max-w-xs"
      />
      <Select
        value={status}
        onChange={(e) => onStatusChange(e.target.value as TaskStatus | "all")}
        className="max-w-[180px]"
      >
        <option value="all">Tous les statuts</option>
        {Object.entries(STATUS_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>
    </div>
  );
}
