"use client";

import { motion } from "framer-motion";
import styles from "./Hero.module.css";

const links = [
  { label: "ABOUT", href: "#about" },
  { label: "PROJECTS", href: "#projects" },
  { label: "TOOLKIT", href: "#toolkit" },
  { label: "CONTACT", href: "#contact" },
];

export function Navbar() {
  return (
    <motion.nav
      className={styles.navbar}
      aria-label="Primary navigation"
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: .5, ease: [0.16, 1, 0.3, 1] }}
    >
      {links.map((link) => (
        <a key={link.label} className={styles.navLink} href={link.href}>
          {link.label}
        </a>
      ))}
    </motion.nav>
  );
}
