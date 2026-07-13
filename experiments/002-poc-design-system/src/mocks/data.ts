import type { Task } from "@/features/tasks/types.js";

export const seedTasks: Task[] = [
  {
    id: "1",
    title: "Cadrer la prochaine expérience du labo",
    description: "Choisir le sujet et écrire l'ADR avant de coder.",
    status: "in_progress",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Committer le lockfile npm",
    description: "",
    status: "done",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Tester le POC avec un vrai utilisateur",
    description: "Envoyer le lien et recueillir des retours à chaud.",
    status: "todo",
    createdAt: new Date().toISOString(),
  },
];
