"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { contacts } from "@/data/portfolio";
import { GlassTypography } from "@/src/components/GlassTypography";
import styles from "./Portfolio.module.css";

export function ContactSection() {
  const reduceMotion = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 45, damping: 20, mass: 0.9 });
  const y = useSpring(rawY, { stiffness: 45, damping: 20, mass: 0.9 });

  return (
    <footer
      id="contact"
      className={styles.contact}
      aria-labelledby="contact-title"
      onPointerMove={(event) => {
        if (reduceMotion) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        rawX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 18);
        rawY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 14);
      }}
      onPointerLeave={() => {
        rawX.set(0);
        rawY.set(0);
      }}
    >
      <motion.div className={styles.contactBackground} style={{ x, y }} aria-hidden="true">
        <motion.img
          src="/media/lukina-contact.webp"
          alt=""
          animate={reduceMotion ? undefined : { scale: [1, 1.04, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
      <div className={styles.contactOverlay} aria-hidden="true" />

      <div className={styles.contactTitleWrap}>
        <motion.h2
          id="contact-title"
          initial={{ opacity: 0, y: 45 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: .45 }}
          transition={{ duration: .9, ease: [0.16, 1, 0.3, 1] }}
        >
          <GlassTypography text={"LET'S\nGET IN\nTOUCH."} size="inherit" />
        </motion.h2>
      </div>

      <div className={styles.contactInfo}>
        <nav aria-label="Contact links">
          {contacts.map((contact) => (
            <a key={contact.label} href={contact.href} target={contact.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
              <small>{contact.label}</small>
              <span>{contact.value}</span>
              <i>↗</i>
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
