"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import { GlassTypography } from "@/src/components/GlassTypography";
import { EyeCursor } from "./EyeCursor";
import { GlassEffect } from "./GlassEffect";
import { Navbar } from "./Navbar";
import styles from "./Hero.module.css";

const heroTitle = "HI\nI'M\nLUKINA";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // ScrollTrigger supplies a slow scrubbed drift while native smooth anchors remain intact.
  useEffect(() => {
    if (reduceMotion) return;
    let dispose: (() => void) | undefined;

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([gsapModule, triggerModule]) => {
      const gsap = gsapModule.gsap;
      const ScrollTrigger = triggerModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      const context = gsap.context(() => {
        gsap.to(visualRef.current, {
          yPercent: 7,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.25,
          },
        });
        gsap.to(contentRef.current, {
          yPercent: -10,
          opacity: .68,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.1,
          },
        });
      }, sectionRef);

      dispose = () => context.revert();
    });

    return () => dispose?.();
  }, [reduceMotion]);

  return (
    <section
      ref={sectionRef}
      data-hero
      className={`${styles.hero} flex items-center px-[clamp(24px,5vw,92px)]`}
      aria-labelledby="hero-title"
    >
      <div ref={visualRef} className="absolute inset-0">
        <GlassEffect />
      </div>
      <div className={styles.atmosphere} aria-hidden="true" />
      <Navbar />

      <motion.div
        ref={contentRef}
        className={styles.content}
        initial={{ opacity: 0, y: 44 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.25, delay: .18, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.h1
          id="hero-title"
          className={styles.title}
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: .28, ease: [0.16, 1, 0.3, 1] }}
        >
          <GlassTypography text={heroTitle} size="inherit" />
        </motion.h1>
        <p className={styles.titleMeta}>BUILD WHAT MATTERS.</p>
      </motion.div>

      <EyeCursor />
    </section>
  );
}
