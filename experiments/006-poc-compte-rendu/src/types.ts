import { z } from "zod";

export const BLOCS = ["budget", "recrutement", "roadmap", "risques", "divers"] as const;

export const StructuredReportSchema = z.object({
  parBloc: z.object({
    budget: z.array(z.string()),
    recrutement: z.array(z.string()),
    roadmap: z.array(z.string()),
    risques: z.array(z.string()),
    divers: z.array(z.string()),
  }),
  horsOrdreDuJour: z.array(z.string()),
});

export type StructuredReport = z.infer<typeof StructuredReportSchema>;

export interface AgendaItem {
  bloc: (typeof BLOCS)[number];
  intitule: string;
}

export const CALL_PARAMS = {
  temperature: 0,
  maxTokensFlat: 500,
  maxTokensStructure: 1200,
} as const;
