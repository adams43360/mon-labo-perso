# Analyse d'architecture — POC compte-rendu structuré sur un transcript complet

## Le principe

005 a validé le mécanisme (routage fiable d'une intervention isolée). Cette expérience change une seule variable : passer d'un traitement intervention-par-intervention à un traitement du transcript entier en une seule passe — exactement le prolongement identifié dans l'ARCHITECTURE.md de 005 ("transcript complet en une passe... reporté à une itération produit si l'hypothèse tient"). Une expérience = une question : ici, "est-ce que ça tient à l'échelle, sur un texte long et désordonné".

## Choix du format du POC

| Option | Description | Décision |
|---|---|---|
| **App React interactive** (comme 002/003) | Formulaire de saisie, appel API depuis le navigateur ou un backend, affichage dynamique | Écarté pour cette itération : le sujet à valider ici est la qualité de la génération LLM sur un texte long, pas une interface. Construire une vraie UI maintenant serait prématuré — 002/003 testaient justement des choix d'UI, ce n'est pas le sujet ici |
| **Script + rapport HTML généré** (retenu) | Un script Node (dans la continuité de 004/005) qui appelle le LLM et génère un fichier HTML autonome, ouvrable dans un navigateur | Cohérent avec l'effort proportionné à la question posée : "cliquable" au sens où on ouvre un fichier et on voit le résultat, sans construire un serveur ni une UI de saisie. Si le POC convainc, une vraie app React (méthode 002/003) devient l'étape suivante légitime |
| Sortie markdown/terminal seule (comme 004/005) | Un simple rapport texte | Insuffisant ici : l'objectif explicite est une démonstration "présentable", pas juste un score — le HTML permet une mise en page comparative (deux colonnes) impossible à bien rendre en markdown brut |

**Décision : script + HTML généré.** Le bon niveau d'effort pour la question posée, et un chemin clair vers une vraie app si le POC convainc.

## Choix du format de sortie structurée

Le prompt "single-pass" doit renvoyer une structure exploitable, pas du texte libre à reparser à la main. Schéma retenu (validé par Zod) :

```ts
{
  parBloc: {
    budget: string[],
    recrutement: string[],
    roadmap: string[],
    risques: string[],
    divers: string[],
  },
  horsOrdreDuJour: string[],
}
```

Chaque entrée de tableau est un point synthétisé (pas une citation brute) rattaché à son bloc. En cas de JSON invalide ou de bloc manquant, un seul retry est tenté avant d'échouer explicitement (pas de silent failure) — même philosophie de robustesse que le reste du labo (cf. futur backlog #1 "structured output fiable", que cette expérience anticipe partiellement sans en faire une comparaison formelle function-calling vs JSON mode vs Zod).

## Comparaison à conditions égales

Pour que la comparaison résumé plat vs structuré soit honnête, les deux sorties viennent :

- Du **même modèle**, sur le **même run**
- À partir du **même transcript**, sans information supplémentaire donnée à la version structurée hors l'ordre du jour lui-même (qui fait partie de l'hypothèse testée, pas une aide déloyale)
- Le prompt "résumé plat" est délibérément générique ("résume cette réunion de façon chronologique, en quelques phrases"), pour représenter fidèlement ce que produirait un outil grand public par défaut

## Ce que le POC doit produire

1. Un transcript fictif plus long (~20-25 tours de parole) que celui de 005, avec digressions et redites, dans la continuité du même scénario de comité de pilotage
2. Une page HTML autonome (`results/comparaison.html`) avec les deux sorties côte à côte
3. Un verdict qualitatif dans le README : la structuration tient-elle sur un texte réaliste, et le gain de lisibilité est-il net ?
