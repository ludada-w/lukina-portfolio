"use client";

import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { projects, type Project } from "@/data/portfolio";
import { GlassTypography } from "@/src/components/GlassTypography";
import { ProjectArtwork } from "./ProjectArtwork";
import styles from "./Portfolio.module.css";

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cardStyle = { "--stack-offset": `${index * 10}px`, zIndex: index + 1 } as CSSProperties;

  return (
    <motion.article
      id={project.id}
      className={`${styles.projectCard} ${styles[project.theme]}`}
      style={cardStyle}
      initial={{ opacity: 0, y: 60, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -6, scale: 1.003 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={styles.projectCopy}>
        <h3>{project.name}</h3>
        <p className={styles.projectStatement}>{project.statement}</p>
        <dl className={styles.projectDetails}>
          <div><dt>BACKGROUND</dt><dd>{project.background}</dd></div>
          <div><dt>PROBLEM</dt><dd>{project.problem}</dd></div>
          <div><dt>SOLUTION</dt><dd>{project.solution}</dd></div>
          <div><dt>PROCESS</dt><dd>{project.process}</dd></div>
          <div><dt>RESULT</dt><dd>{project.result}</dd></div>
        </dl>
      </div>
      <ProjectArtwork variant={project.visual} />
    </motion.article>
  );
}

export function ProjectsSection() {
  return (
    <section id="projects" className={styles.projects} aria-labelledby="projects-title">
      <div className={styles.projectsHeading}>
        <motion.h2
          id="projects-title"
          initial={{ opacity: 0, y: 42 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: .45 }}
          transition={{ duration: .9, ease: [0.16, 1, 0.3, 1] }}
        >
          <GlassTypography text={"SELECTED\nPROJECTS"} size="inherit" />
        </motion.h2>
      </div>
      <div className={styles.projectStack}>
        {projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}
      </div>
    </section>
  );
}
