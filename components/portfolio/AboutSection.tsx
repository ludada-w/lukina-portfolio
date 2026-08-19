"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { CSSProperties } from "react";
import { GlassTypography } from "@/src/components/GlassTypography";
import styles from "./About.module.css";

const cards = [
  { index: "01", title: "PLACEHOLDER TITLE", copy: "Short placeholder supporting text goes here." },
  { index: "02", title: "PLACEHOLDER TITLE", copy: "Short placeholder supporting text goes here." },
  { index: "03", title: "PLACEHOLDER TITLE", copy: "Short placeholder supporting text goes here." },
  { index: "04", title: "PLACEHOLDER TITLE", copy: "Short placeholder supporting text goes here." },
];

const cardPlacement = ["-3.5deg", "2.2deg", "-2deg", "3deg"].map(
  (rotation) => ({ "--rotation": rotation }) as CSSProperties,
);

export function AboutSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="about" className={styles.about} aria-labelledby="about-title">
      <div className={styles.lightField} aria-hidden="true" />
      <div className={styles.particleField} aria-hidden="true">
        {Array.from({ length: 14 }, (_, index) => <span key={index} />)}
      </div>

      <div className={styles.intro}>
        <motion.h2
          id="about-title"
          className={styles.title}
          initial={{ opacity: 0, y: 46 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: .55 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <GlassTypography text="ABOUT" size="inherit" />
        </motion.h2>

        <motion.p
          className={styles.description}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: .65 }}
          transition={{ duration: .9, delay: .12, ease: [0.16, 1, 0.3, 1] }}
        >
          A concise introduction about your work, perspective, and approach will live here.
        </motion.p>
      </div>

      <div className={styles.cardsStage}>
        {cards.map((card, index) => (
          <motion.div
            key={card.index}
            className={styles.cardPosition}
            style={cardPlacement[index]}
            initial={{ opacity: 0, y: 54 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: .28 }}
            transition={{ duration: .85, delay: .08 + index * .09, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.article
              className={styles.card}
              animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
              whileHover={reduceMotion ? undefined : { y: -13, scale: 1.025 }}
              transition={{
                y: { duration: 6.8 + index * .6, delay: index * .45, repeat: Infinity, ease: "easeInOut" },
                scale: { duration: .35, ease: [0.22, 1, 0.36, 1] },
              }}
            >
              <div className={styles.cardTopline}>
                <span>{card.index}</span>
                <i aria-hidden="true" />
              </div>
              <div>
                <h3>{card.title}</h3>
                <p>{card.copy}</p>
              </div>
            </motion.article>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
