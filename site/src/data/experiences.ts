export interface Experience {
  id: string;
  title: string;
  summary: string;
  status: "En cours" | "Documenté" | "Publié";
  date: string; // YYYY-MM-DD
  repoPath: string; // chemin relatif dans le repo GitHub
  blogSlug: string; // slug du billet de blog associé
}

const REPO_URL = "https://github.com/adams43360/mon-labo-perso";

export const experiences: Experience[] = [
  {
    id: "001",
    title: "Async messaging — RabbitMQ vs Kafka",
    summary:
      "Comparatif côte à côte de deux paradigmes de messaging asynchrone : un dashboard commun pour envoyer, mettre en pause et relancer des tâches sur les deux backends.",
    status: "En cours",
    date: "2026-07-12",
    repoPath: `${REPO_URL}/tree/main/experiments/001-async-messaging`,
    blogSlug: "/blog/001-async-messaging",
  },
  {
    id: "002",
    title: "POC produit avec design system (shadcn/ui) + données mockées",
    summary:
      "Un POC cliquable avec un vrai design system et une API simulée (MSW), pour tester une méthode de spec produit avant d'investir du temps de dev réel.",
    status: "En cours",
    date: "2026-07-13",
    repoPath: `${REPO_URL}/tree/main/experiments/002-poc-design-system`,
    blogSlug: "/blog/002-poc-design-system",
  },
  {
    id: "003",
    title: "POC SaaS avec design system à tokens (IBM Carbon)",
    summary:
      "La variable inverse de 002 : un design system complet et opinioné, piloté par des tokens. Onboarding SaaS multi-étapes, retheming intégral par tokens sémantiques, zéro CSS custom.",
    status: "En cours",
    date: "2026-07-16",
    repoPath: `${REPO_URL}/tree/main/experiments/003-poc-saas-carbon`,
    blogSlug: "/blog/003-poc-saas-carbon",
  },
  {
    id: "004",
    title: "Harness d'évals LLM : promptfoo vs DeepEval vs Vitest maison",
    summary:
      "Comparatif de 3 outils de mesure de la qualité d'une IA sur une même tâche de classification (50 cas, 16 pièges). Verdict : le harness maison (Vitest) devient le standard du labo pour toutes les futures évals.",
    status: "Documenté",
    date: "2026-07-20",
    repoPath: `${REPO_URL}/tree/main/experiments/004-harness-evals-llm`,
    blogSlug: "/blog/004-harness-evals-llm",
  },
];
