import type { ReactNode } from "react";
import Link from "@docusaurus/Link";
import { experiences } from "@site/src/data/experiences";
import styles from "./styles.module.css";

export default function ExperienceList(): ReactNode {
  return (
    <div className="container">
      <div className={styles.grid}>
        {experiences.map((exp) => (
          <div key={exp.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.id}>{exp.id}</span>
              <span className={styles.status}>{exp.status}</span>
            </div>
            <h3>{exp.title}</h3>
            <p className={styles.summary}>{exp.summary}</p>
            <div className={styles.links}>
              <Link to={exp.blogSlug}>Lire le billet</Link>
              <Link to={exp.repoPath}>Voir le code ↗</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
